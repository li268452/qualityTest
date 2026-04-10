/**
 * AI 业务流程测试脚本（流程驱动）
 *
 * 用法：
 *   单模块测试：node scripts/ai-test.js --module=dict-management
 *   大模块全量：node scripts/ai-test.js --module=user-center
 *   子模块测试：node scripts/ai-test.js --module=user-center/user-login
 *   指定流程：  node scripts/ai-test.js --module=dict-management --flow=1
 *   全量测试：  node scripts/ai-test.js --all
 */

const fs = require('fs')
const path = require('path')

const MODULES_DIR = path.join(__dirname, '..', 'docs', 'modules')

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const options = { module: null, flow: null, all: false }

  for (const arg of args) {
    if (arg === '--all') {
      options.all = true
    } else if (arg.startsWith('--module=')) {
      options.module = arg.split('=')[1]
    } else if (arg.startsWith('--flow=')) {
      options.flow = parseInt(arg.split('=')[1], 10)
    }
  }

  return options
}

// 读取模块描述文档
function loadModuleDoc(modulePath) {
  const fullPath = path.join(MODULES_DIR, `${modulePath}.md`)
  if (!fs.existsSync(fullPath)) {
    console.error(`错误: 找不到模块文档 docs/modules/${modulePath}.md`)
    console.error('请先按照 TEMPLATE.md 创建模块功能描述文档')
    process.exit(1)
  }
  return fs.readFileSync(fullPath, 'utf-8')
}

// 递归获取所有模块（支持目录层级）
function listModules(dir = MODULES_DIR, prefix = '') {
  if (!fs.existsSync(dir)) return []

  const modules = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const subPrefix = prefix ? `${prefix}/${entry.name}` : entry.name
      modules.push(...listModules(entryPath, subPrefix))
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      entry.name !== 'TEMPLATE.md' &&
      entry.name !== 'README.md' &&
      !entry.name.endsWith('.test-prompt.md')
    ) {
      const moduleName = entry.name.replace('.md', '')
      modules.push(prefix ? `${prefix}/${moduleName}` : moduleName)
    }
  }

  return modules
}

// 获取大模块下的所有子模块
function listSubModules(modulePath) {
  const dir = path.join(MODULES_DIR, modulePath)
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return null
  }
  return listModules(dir, modulePath)
}

// 解析流程测试（从6.1章节）
function parseFlows(doc) {
  const flows = []
  const lines = doc.split('\n')
  let currentFlow = null
  let inSteps = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 匹配流程标题：#### 流程1：xxx
    const flowMatch = line.match(/^####\s*流程\d+[：:]\s*(.+)/)
    if (flowMatch) {
      currentFlow = {
        name: line.replace(/^####\s*/, ''),
        precondition: '',
        steps: [],
        finalCheck: '',
      }
      flows.push(currentFlow)
      inSteps = false
      continue
    }

    if (!currentFlow) continue

    // 匹配前置条件
    if (line.startsWith('前置') && line.includes('：')) {
      currentFlow.precondition = line.replace(/^.*?：\s*/, '').trim()
      inSteps = false
      continue
    }

    // 匹配代码块开始（```）
    if (!inSteps && line.trim() === '```') {
      inSteps = true
      continue
    }

    // 匹配代码块结束（```）
    if (inSteps && line.trim() === '```') {
      inSteps = false
      continue
    }

    // 匹配最终验证（在代码块内）
    if (inSteps && line.startsWith('最终验证')) {
      currentFlow.finalCheck = line.replace(/^.*?：\s*/, '').trim()
      continue
    }

    // 匹配步骤开始标记（非代码块模式）
    if (!inSteps && line.trim() === '步骤：') {
      inSteps = true
      continue
    }

    // 收集步骤内容
    if (inSteps && line.trim()) {
      currentFlow.steps.push(line.trim())
    }
  }

  return flows
}

// 解析状态检查点（从6.2章节）
function parseCheckpoints(doc) {
  const checkpoints = []
  const lines = doc.split('\n')
  let inCheckpointSection = false

  for (const line of lines) {
    if (line.includes('6.2 状态检查点')) {
      inCheckpointSection = true
      continue
    }
    if (inCheckpointSection && line.startsWith('## ')) {
      inCheckpointSection = false
      continue
    }

    if (
      inCheckpointSection &&
      line.startsWith('|') &&
      !line.includes('---') &&
      !line.includes('检查点')
    ) {
      const cols = line.split('|').filter(c => c.trim())
      if (cols.length >= 3) {
        checkpoints.push({
          point: cols[0].trim(),
          method: cols[1].trim(),
          expected: cols[2].trim(),
        })
      }
    }
  }

  return checkpoints
}

// 解析依赖关系
function parseDependencies(doc) {
  const deps = []
  const lines = doc.split('\n')
  let inDepSection = false

  for (const line of lines) {
    if (line.includes('## 9. 依赖关系') || line.includes('## 依赖关系')) {
      inDepSection = true
      continue
    }
    if (inDepSection && line.startsWith('## ')) {
      inDepSection = false
      continue
    }

    if (inDepSection && line.startsWith('|') && !line.includes('---') && !line.includes('模块')) {
      const cols = line.split('|').filter(c => c.trim())
      if (cols.length >= 2 && cols[0].trim() !== '无') {
        deps.push({
          module: cols[0].trim(),
          description: cols[1].trim(),
        })
      }
    }
  }

  return deps
}

// 解析业务规则
function parseBusinessRules(doc) {
  const rules = []
  const lines = doc.split('\n')
  let inRules = false

  for (const line of lines) {
    if (line.includes('## 7. 业务规则')) {
      inRules = true
      continue
    }
    if (inRules && line.startsWith('## ')) {
      inRules = false
      continue
    }

    if (inRules && line.match(/^\s*\d+\.\s/)) {
      rules.push(line.trim())
    }
  }

  return rules
}

// 生成流程驱动 AI 测试 Prompt
function generateFlowPrompt(modulePath, doc, flowNum) {
  const flows = parseFlows(doc)
  const checkpoints = parseCheckpoints(doc)
  const dependencies = parseDependencies(doc)
  const rules = parseBusinessRules(doc)

  const moduleName = modulePath.includes('/') ? path.basename(modulePath) : modulePath

  let prompt = ''

  // ===== Prompt 头部 =====
  prompt += `# AI 流程驱动测试任务\n\n`
  prompt += `## 模块：${moduleName}\n`
  prompt += `## 路径：${modulePath}\n\n`
  prompt += `---\n\n`

  // ===== 角色与原则 =====
  prompt += `## 测试角色\n\n`
  prompt += `你是一名 QA 测试工程师，负责对「${moduleName}」模块进行自动化业务流程测试。\n\n`

  prompt += `## 测试原则\n\n`
  prompt += `1. **流程驱动**：按业务场景依次执行操作，上一步成功才继续下一步\n`
  prompt += `2. **只判成败**：每步操作只判断成功或失败，不逐字段检查返回内容\n`
  prompt += `3. **链式传递**：上一步的返回数据（如ID）作为下一步的输入\n`
  prompt += `4. **失败才分析**：成功就继续，失败时才抓取详细错误信息并分析原因\n`
  prompt += `5. **数据一致性**：流程结束后验证最终数据状态是否正确\n\n`

  prompt += `---\n\n`

  // ===== 依赖关系 =====
  if (dependencies.length > 0) {
    prompt += `## 前置依赖\n\n`
    prompt += `本模块依赖以下模块，测试前需确保这些模块的数据或接口可用：\n\n`
    dependencies.forEach(dep => {
      prompt += `- **${dep.module}**：${dep.description}\n`
    })
    prompt += `\n`
  }

  // ===== 业务规则 =====
  if (rules.length > 0) {
    prompt += `## 业务规则\n\n`
    rules.forEach(rule => {
      prompt += `- ${rule}\n`
    })
    prompt += `\n---\n\n`
  }

  // ===== 测试流程 =====
  if (flowNum) {
    // 指定流程
    const flow = flows[flowNum - 1]
    if (!flow) {
      console.error(`错误: 找不到流程${flowNum}，该模块共有 ${flows.length} 个流程`)
      process.exit(1)
    }
    prompt += formatFlow(flow)
  } else {
    // 全部流程
    prompt += `## 测试流程\n\n`
    flows.forEach((flow, i) => {
      prompt += formatFlow(flow, i + 1)
    })
  }

  // ===== 状态检查点 =====
  if (checkpoints.length > 0) {
    prompt += `## 状态检查点\n\n`
    prompt += `流程执行过程中，在对应节点验证以下状态：\n\n`
    checkpoints.forEach(cp => {
      prompt += `- **${cp.point}**：通过「${cp.method}」验证 → 期望「${cp.expected}」\n`
    })
    prompt += `\n`
  }

  // ===== 输出格式 =====
  prompt += `---\n\n`
  prompt += `## 输出格式\n\n`
  prompt += `### 1. 流程执行结果\n\n`
  prompt += `对每个流程，按以下格式输出：\n\n`
  prompt += `#### 流程N：xxx\n\n`
  prompt += `| 步骤 | 操作 | 结果 | 备注 |\n`
  prompt += `|------|------|:----:|------|\n`
  prompt += `| 1    | xxx  | 通过 |      |\n`
  prompt += `| 2    | xxx  | 通过 |      |\n`
  prompt += `| 3    | xxx  | 失败 | 具体错误信息 |\n\n`
  prompt += `**最终验证**：通过/失败 — 原因\n\n`

  prompt += `### 2. 失败分析（仅失败时输出）\n\n`
  prompt += `对于失败的步骤：\n`
  prompt += `- 可能原因：\n`
  prompt += `- 影响范围：\n`
  prompt += `- 修复建议：\n\n`

  prompt += `### 3. 总结\n\n`
  prompt += `- 流程通过率：X/Y\n`
  prompt += `- 状态检查点通过率：X/Y\n`
  prompt += `- 关键问题列表（如有）\n`
  prompt += `- 整体评估：通过/需修复\n`

  return prompt
}

function formatFlow(flow, index) {
  let text = ''

  // 去重：如果 flow.name 已经以"流程N："开头，不再重复
  const name = flow.name || '未命名'
  if (index !== undefined) {
    if (name.startsWith('流程')) {
      text += `### ${name}\n\n`
    } else {
      text += `### 流程${index}：${name}\n\n`
    }
  } else {
    text += `### ${name}\n\n`
  }

  text += `**前置条件**：${flow.precondition || '无'}\n\n`
  text += `**执行步骤**：\n\n`
  text += '```\n'
  flow.steps.forEach(step => {
    text += `${step}\n`
  })
  text += '```\n\n'

  if (flow.finalCheck) {
    text += `**最终验证**：${flow.finalCheck}\n\n`
  }

  text += '---\n\n'

  return text
}

// 生成 Prompt 文件的输出路径
function getPromptOutputPath(modulePath) {
  const parsed = path.parse(modulePath)
  if (parsed.dir) {
    const outputDir = path.join(MODULES_DIR, parsed.dir)
    return path.join(outputDir, `${parsed.name}.test-prompt.md`)
  }
  return path.join(MODULES_DIR, `${parsed.name}.test-prompt.md`)
}

// 主流程
function main() {
  const options = parseArgs()

  console.log('========================================')
  console.log('  AI 流程驱动测试')
  console.log('========================================\n')

  if (options.all) {
    const modules = listModules()
    if (modules.length === 0) {
      console.error('未找到任何模块文档，请先在 docs/modules/ 下创建模块描述')
      process.exit(1)
    }
    console.log(`发现 ${modules.length} 个模块：`)
    modules.forEach(m => console.log(`  - ${m}`))
    console.log('')

    modules.forEach(mod => {
      const doc = loadModuleDoc(mod)
      const prompt = generateFlowPrompt(mod, doc, null)
      const outputPath = getPromptOutputPath(mod)
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, prompt)
      console.log(`已生成: ${mod}`)
    })

    console.log('\n所有测试 Prompt 已生成，提交给 AI 即可进行全量业务测试')
  } else if (options.module) {
    const subModules = listSubModules(options.module)

    if (subModules && subModules.length > 0) {
      console.log(`大模块 "${options.module}" 包含 ${subModules.length} 个子模块：`)
      subModules.forEach(m => console.log(`  - ${m}`))
      console.log('')

      subModules.forEach(mod => {
        const doc = loadModuleDoc(mod)
        const prompt = generateFlowPrompt(mod, doc, options.flow)
        const outputPath = getPromptOutputPath(mod)
        fs.mkdirSync(path.dirname(outputPath), { recursive: true })
        fs.writeFileSync(outputPath, prompt)
        console.log(`已生成: ${mod}`)
      })

      console.log('\n所有子模块测试 Prompt 已生成，提交给 AI 即可进行大模块业务测试')
    } else {
      const doc = loadModuleDoc(options.module)
      const prompt = generateFlowPrompt(options.module, doc, options.flow)
      const outputPath = getPromptOutputPath(options.module)
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, prompt)
      console.log(`已生成测试 Prompt: ${outputPath}\n`)
      console.log('将此 Prompt 提交给 AI（如 Claude/ChatGPT）即可进行业务流程测试')
    }
  } else {
    console.log('用法：')
    console.log('  单模块测试:   node scripts/ai-test.js --module=dict-management')
    console.log('  大模块全量:   node scripts/ai-test.js --module=user-center')
    console.log('  子模块测试:   node scripts/ai-test.js --module=user-center/user-login')
    console.log('  指定流程:     node scripts/ai-test.js --module=dict-management --flow=1')
    console.log('  全量测试:     node scripts/ai-test.js --all')
  }
}

main()
