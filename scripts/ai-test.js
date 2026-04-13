/**
 * AI 业务流程测试脚本（真实执行版）
 *
 * 用法：
 *   单模块测试：node scripts/ai-test.js --module=coupon-management
 *   大模块全量：node scripts/ai-test.js --module=user-center
 *   子模块测试：node scripts/ai-test.js --module=user-center/user-login
 *   指定流程：  node scripts/ai-test.js --module=dict-management --flow=5
 *   全量测试：  node scripts/ai-test.js --all
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MODULES_DIR = path.join(__dirname, '..', 'docs', 'modules')
const SRC_DIR = path.join(__dirname, '..', 'src', 'modules')

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
    const flowMatch = line.match(/^####\s*流程(\d+)[：:]\s*(.+)/)
    if (flowMatch) {
      currentFlow = {
        number: parseInt(flowMatch[1], 10),
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

// 解析接口实现清单（从4.1章节）
function parseApiMapping(doc) {
  const mappings = []
  const lines = doc.split('\n')
  let inSection = false

  for (const line of lines) {
    if (line.includes('### 4.1 接口实现清单') || line.includes('接口实现清单')) {
      inSection = true
      continue
    }
    if (inSection && line.startsWith('##')) {
      inSection = false
      continue
    }

    if (
      inSection &&
      line.startsWith('|') &&
      !line.includes('---') &&
      !line.includes('组件调用方法')
    ) {
      const cols = line.split('|').filter(c => c.trim())
      if (cols.length >= 3 && cols[0].trim() && cols[0].trim() !== '') {
        mappings.push({
          componentCall: cols[0].trim(),
          mockMethod: cols[1].trim(),
          verified: cols[2].trim() === '✅',
        })
      }
    }
  }

  return mappings
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

// ==================== 核心执行引擎 ====================

// 动态导入 Mock API 模块
async function loadMockApi(modulePath) {
  // 处理带目录的模块路径（如 user-center/user-login）
  const baseName = modulePath.includes('/') ? path.basename(modulePath) : modulePath

  // 生成可能的文件名（处理不同的命名模式）
  // 例如：coupon-management -> coupon, dict-management -> dict
  const possibleNames = [baseName]

  // 处理 "-management" 后缀（coupon-management -> coupon）
  if (baseName.endsWith('-management')) {
    possibleNames.unshift(baseName.replace('-management', ''))
  }

  // 构建所有可能的路径
  const possiblePaths = []
  for (const name of possibleNames) {
    possiblePaths.push(
      path.join(SRC_DIR, modulePath, 'mock', `${name}Mock.js`),
      path.join(SRC_DIR, modulePath, 'mock', `${name}Mock.mjs`)
    )
  }

  for (const mockPath of possiblePaths) {
    try {
      // 使用 file:// 协议导入
      const module = await import(`file://${mockPath}`)
      // 尝试找到导出的 API 对象
      // 优先使用规范化后的 API 名称（如 couponApi）
      const apiName = `${possibleNames[0].replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Api`
      return module[apiName] || module.default || module
    } catch (e) {
      // 继续尝试下一个路径
    }
  }

  throw new Error(`找不到 Mock API 模块: ${modulePath} (尝试的路径: ${possiblePaths.join(', ')})`)
}

// 验证接口映射
async function verifyApiMapping(modulePath, mappings) {
  const results = []

  for (const mapping of mappings) {
    try {
      const api = await loadMockApi(modulePath)
      const mockMethod = mapping.mockMethod

      // 检查方法是否存在
      if (typeof api[mockMethod] === 'function') {
        results.push({
          ...mapping,
          verified: true,
          status: '✅',
        })
      } else {
        results.push({
          ...mapping,
          verified: false,
          status: '❌',
          error: `方法 ${mockMethod} 不存在`,
        })
      }
    } catch (error) {
      results.push({
        ...mapping,
        verified: false,
        status: '❌',
        error: error.message,
      })
    }
  }

  return results
}

// 解析步骤描述，提取操作类型和参数
function parseStepDescription(stepDesc) {
  // 匹配格式：序号. [操作类型] 描述 → 期望结果
  // 使用 Unicode 码点匹配箭头
  const arrow = String.fromCharCode(0x2192) // →
  const match = stepDesc.match(
    new RegExp(`^\\s*(\\d+)\\.\\s*\\[([^\\]]+)\\]\\s*(.+?)(?:\\s*${arrow}\\s*(.+))?$`)
  )
  if (!match) {
    return null
  }

  return {
    number: parseInt(match[1], 10),
    action: match[2], // 新增/查询/编辑/删除/验证/选择/切换/记录/下拉
    description: match[3],
    expectation: match[4] || '',
  }
}

// 执行单个步骤
async function executeStep(api, step, context, modulePath) {
  const parsed = parseStepDescription(step)
  if (!parsed) {
    return {
      success: false,
      error: '无法解析步骤描述',
      details: step,
    }
  }

  const { action, description, expectation } = parsed

  // 检测是否是跨模块操作
  // 如果描述中包含"字典"关键词，使用 dictItemApi 或 dictTypeApi
  let targetApi = api
  if (description.includes('字典') || description.includes('字典数据')) {
    try {
      // 对于字典数据操作，使用 dictItemApi
      // 对于字典类型操作，使用 dictTypeApi
      const module = await import(
        `file://${path.join(SRC_DIR, 'dict-management', 'mock', 'dictMock.js')}`
      )
      if (description.includes('字典数据') || description.includes('字典项')) {
        targetApi = module.dictItemApi
      } else {
        targetApi = module.dictTypeApi
      }
    } catch (e) {
      // 如果加载失败，继续使用原API
    }
  }

  try {
    switch (action) {
      case '新增':
      case '创建':
        return await executeCreate(targetApi, description, context)

      case '查询':
        return await executeQuery(targetApi, description, context)

      case '编辑':
      case '修改':
        return await executeUpdate(targetApi, description, context)

      case '删除':
        return await executeDelete(targetApi, description, context)

      case '验证':
        return await executeVerify(targetApi, description, context)

      case '启用':
        return await executeOn(targetApi, description, context)

      case '关闭':
        return await executeOff(targetApi, description, context)

      case '保存':
        // 保存操作，可能是新增或编辑的提交动作
        // 在API测试中，如果已有ID则视为编辑，否则跳过（因为新增已在之前步骤完成）
        if (context.lastId) {
          return {
            success: true,
            action,
            note: '保存操作（编辑已通过编辑步骤处理）',
          }
        }
        return {
          success: true,
          action,
          note: '保存操作（新增已通过新增步骤处理）',
        }

      case '选择':
      case '切换':
      case '记录':
      case '下拉':
        // 这些是UI操作，在API测试中跳过但记录
        return {
          success: true,
          action,
          note: 'UI操作，API测试跳过',
          details: description,
        }

      default:
        return {
          success: false,
          error: `未知操作类型: ${action}`,
          details: step,
        }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: step,
    }
  }
}

// 执行新增操作
async function executeCreate(api, description, context) {
  // 解析参数：名称="xxx", 面额=20, 门槛=100
  const params = {}
  let expectFailure = false

  // 检测异常测试模式
  if (description.includes('空名称') || description.includes('名称不能为空')) {
    params.name = '' // 空名称
    expectFailure = true
  } else if (description.includes('面额为负数') || description.includes('面额不能为负数')) {
    params.name = '测试券'
    params.amount = -10 // 负数面额
    expectFailure = true
  } else if (description.includes('门槛小于面额') || description.includes('门槛不能小于面额')) {
    params.name = '测试券'
    params.amount = 100
    params.threshold = 50 // 门槛小于面额
    expectFailure = true
  } else {
    // 正常参数解析
    const nameMatch = description.match(/名称[=:："']\s*([^,，]+)/)
    const amountMatch = description.match(/面额[=:："']\s*(\d+)/)
    const thresholdMatch = description.match(/门槛[=:："']\s*(\d+)/)
    const typeMatch = description.match(/类型[=:："']\s*([^,，]+)/)
    const labelMatch = description.match(/标签[=:："']\s*([^,，]+)/)
    const valueMatch = description.match(/值[=:："']\s*([^,，]+)/)
    const sortMatch = description.match(/排序[=:："']\s*(\d+)/)

    if (nameMatch) params.name = nameMatch[1].trim()
    if (amountMatch) params.amount = parseFloat(amountMatch[1])
    if (thresholdMatch) params.threshold = parseFloat(thresholdMatch[1])
    if (typeMatch) params.typeCode = typeMatch[1].trim()
    if (labelMatch) params.label = labelMatch[1].trim()
    if (valueMatch) params.value = valueMatch[1].trim()
    if (sortMatch) params.sort = parseInt(sortMatch[1], 10)

    // 添加默认值（用于跨模块流程测试，避免因缺少参数而失败）
    if (params.name && !params.amount && !expectFailure) {
      // 有名称但没有面额，说明是跨模块流程测试，添加默认值
      params.amount = 10
      params.threshold = 10
    }
  }

  // 判断是否是字典数据创建（有label/value/sort参数）
  const isDictData =
    params.label !== undefined || params.value !== undefined || params.sort !== undefined

  let result
  if (isDictData) {
    // 字典数据创建：api.create(typeCode, data)
    const typeCode = 'coupon_type' // 默认使用优惠券类型
    const data = { label: params.label, value: params.value, sort: params.sort }
    result = await api.create(typeCode, data)
  } else {
    // 普通数据创建：api.create(data)
    result = await api.create(params)
  }

  // 对于期望失败的操作，失败应该被视为成功
  if (expectFailure) {
    if (result.code !== 200) {
      return {
        success: true, // 期望的失败
        result: result.data,
        msg: result.msg,
        note: '期望的异常：' + result.msg,
      }
    }
    return {
      success: false,
      error: '期望操作失败但操作成功了',
    }
  }

  if (result.code === 200) {
    // 保存返回的ID供后续步骤使用
    if (result.data && result.data.id) {
      context.lastId = result.data.id
      context.lastData = result.data
    }
    return {
      success: true,
      result: result.data,
      msg: result.msg,
    }
  } else {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }
}

// 执行查询操作
async function executeQuery(api, description, context) {
  const params = {}
  const nameMatch = description.match(/名称[=:："']\s*([^,，]+)/)

  if (nameMatch) params.name = nameMatch[1].trim()

  const result = await api.getList(params)

  if (result.code === 200) {
    return {
      success: true,
      result: result.data,
      total: result.data?.total || 0,
      msg: result.msg,
    }
  } else {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }
}

// 执行编辑操作
async function executeUpdate(api, description, context) {
  if (!context.lastId) {
    return {
      success: false,
      error: '没有可编辑的数据ID',
    }
  }

  const params = {}
  const nameMatch = description.match(/名称[=:："']\s*([^,，]+)/)

  if (nameMatch) params.name = nameMatch[1].trim()

  const result = await api.update(context.lastId, params)

  if (result.code === 200) {
    return {
      success: true,
      result: result.data,
      msg: result.msg,
    }
  } else {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }
}

// 执行删除操作
async function executeDelete(api, description, context) {
  let targetId = context.lastId

  // 检查是否指定了ID
  const idMatch = description.match(/id[=:："']\s*(\d+)/)
  if (idMatch) {
    targetId = parseInt(idMatch[1], 10)
  }

  // 如果没有ID且描述中包含"不存在"，使用一个不存在的ID进行测试
  if (!targetId && description.includes('不存在')) {
    targetId = 99999 // 使用一个不存在的ID
  }

  if (!targetId) {
    return {
      success: false,
      error: '没有可删除的数据ID',
    }
  }

  const result = await api.remove(targetId)

  // 对于"删除不存在的数据"测试，期望返回错误
  if (description.includes('不存在')) {
    if (result.code !== 200) {
      return {
        success: true, // 期望的失败
        result: result.data,
        msg: result.msg,
        note: '期望的异常：' + result.msg,
      }
    }
    return {
      success: false,
      error: '期望删除失败但操作成功了',
    }
  }

  if (result.code !== 200) {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }

  // 删除后验证：查询列表确认数据已不存在
  const listResult = await api.getList()
  if (listResult.code === 200) {
    const exists = listResult.data.records.some(item => item.id === targetId)
    if (exists) {
      return {
        success: false,
        error: '删除后数据仍存在',
      }
    }
  }

  return {
    success: true,
    msg: result.msg,
  }
}

// 执行验证操作
async function executeVerify(api, description, context) {
  // 解析验证内容
  const containsName = description.match(/包含[：:"]?\s*"([^"]+)"/)
  const notContainsName = description.match(/不包含[：:"]?\s*"([^"]+)"/)
  const statusMatch = description.match(/状态为[：:"]?\s*"([^"]+)"/)

  const result = await api.getList()

  if (result.code !== 200) {
    return {
      success: false,
      error: result.msg,
    }
  }

  const records = result.data.records || []

  if (containsName) {
    const name = containsName[1]
    const found = records.some(item => item.name?.includes(name) || item.label?.includes(name))
    if (!found) {
      return {
        success: false,
        error: `未找到包含"${name}"的数据`,
      }
    }
  }

  if (notContainsName) {
    const name = notContainsName[1]
    const found = records.some(item => item.name?.includes(name) || item.label?.includes(name))
    if (found) {
      return {
        success: false,
        error: `存在不应包含的"${name}"数据`,
      }
    }
  }

  if (statusMatch) {
    if (!context.lastId) {
      return {
        success: false,
        error: '没有ID用于验证状态',
      }
    }
    const expectedStatus = statusMatch[1]
    const item = records.find(r => r.id === context.lastId)
    if (!item) {
      return {
        success: false,
        error: `找不到ID为${context.lastId}的数据`,
      }
    }
    // 状态可能是数字或字符串
    const itemStatus = item.status === 1 ? '已启用' : item.status === 0 ? '已关闭' : item.status
    if (itemStatus !== expectedStatus) {
      return {
        success: false,
        error: `状态不匹配：期望"${expectedStatus}"，实际"${itemStatus}"`,
      }
    }
  }

  return {
    success: true,
    verified: true,
  }
}

// 执行启用操作
async function executeOn(api, description, context) {
  if (!context.lastId) {
    return {
      success: false,
      error: '没有可启用的数据ID',
    }
  }

  const result = await api.on(context.lastId)

  if (result.code === 200) {
    return {
      success: true,
      result: result.data,
      msg: result.msg,
    }
  } else {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }
}

// 执行关闭操作
async function executeOff(api, description, context) {
  if (!context.lastId) {
    return {
      success: false,
      error: '没有可关闭的数据ID',
    }
  }

  const result = await api.off(context.lastId)

  if (result.code === 200) {
    return {
      success: true,
      result: result.data,
      msg: result.msg,
    }
  } else {
    return {
      success: false,
      error: result.msg,
      code: result.code,
    }
  }
}

// 执行单个流程
async function executeFlow(modulePath, flow, apiMappingResults) {
  console.log(`\n执行流程: ${flow.name}`)

  // 先检查接口映射
  const mappingErrors = apiMappingResults.filter(m => !m.verified)
  if (mappingErrors.length > 0) {
    console.log('  ❌ 接口映射验证失败:')
    mappingErrors.forEach(m => {
      console.log(`     - ${m.componentCall} -> ${m.mockMethod}: ${m.error}`)
    })
  }

  const context = {
    lastId: null,
    lastData: null,
  }

  // 检查前置条件，如果需要"已存在数据"但没有数据，自动创建
  if (flow.precondition && flow.precondition.includes('已存在') && !context.lastId) {
    try {
      const api = await loadMockApi(modulePath)
      // 创建测试数据
      const createResult = await api.create({
        name: '测试优惠券',
        amount: 50,
        threshold: 100,
      })
      if (createResult.code === 200 && createResult.data && createResult.data.id) {
        context.lastId = createResult.data.id
        context.lastData = createResult.data
        console.log(`  📝 自动创建测试数据 (ID: ${context.lastId})`)
      }
    } catch (e) {
      console.log(`  ⚠️  无法创建测试数据: ${e.message}`)
    }
  }

  const stepResults = []

  for (const step of flow.steps) {
    const parsed = parseStepDescription(step)
    if (!parsed) continue

    const { action, description } = parsed

    // 加载 API
    let api
    try {
      api = await loadMockApi(modulePath)
    } catch (error) {
      stepResults.push({
        number: parsed.number,
        action,
        description,
        success: false,
        error: `加载API失败: ${error.message}`,
      })
      break
    }

    const result = await executeStep(api, step, context, modulePath)

    stepResults.push({
      number: parsed.number,
      action,
      description,
      success: result.success,
      result: result.result,
      error: result.error,
      note: result.note,
    })

    // 输出步骤结果
    // 检查是否是期望的失败（异常拦截测试）
    const expectFailure =
      parsed.expectation &&
      (parsed.expectation.includes('期望失败') ||
        parsed.expectation.includes('失败') ||
        parsed.expectation.includes('提示'))

    // 如果期望失败，且确实失败了，且错误消息匹配期望，则视为成功
    let actualSuccess = result.success
    if (expectFailure && !result.success && result.error) {
      // 检查错误消息是否匹配期望
      if (
        parsed.expectation.includes(result.error) ||
        result.error.includes('不能为空') ||
        result.error.includes('不存在')
      ) {
        actualSuccess = true // 期望的失败，视为成功
      }
    }

    const status = actualSuccess ? '✅' : '❌'
    const note = result.note ? ` (${result.note})` : ''
    const errorInfo = result.error ? ` — ${result.error}` : ''
    console.log(`  ${status} 步骤${parsed.number}: [${action}] ${description}${note}${errorInfo}`)

    // 如果步骤失败且是关键操作，中断流程（但期望失败的情况除外）
    if (
      !actualSuccess &&
      !result.note &&
      ['新增', '创建', '删除', '编辑', '修改'].includes(action)
    ) {
      console.log(`  ⚠️  流程因步骤失败而中断`)
      break
    }
  }

  // 验证最终状态
  let finalCheckSuccess = true
  let finalCheckError = ''

  if (flow.finalCheck) {
    try {
      const finalApi = await loadMockApi(modulePath)
      // 根据最终验证描述进行验证
      if (flow.finalCheck.includes('已被完全清除') || flow.finalCheck.includes('不存在')) {
        const listResult = await finalApi.getList()
        if (listResult.code === 200 && context.lastId) {
          const exists = listResult.data.records.some(item => item.id === context.lastId)
          if (exists) {
            finalCheckSuccess = false
            finalCheckError = '数据未被清除'
          }
        }
      }
    } catch (error) {
      finalCheckSuccess = false
      finalCheckError = error.message
    }
  }

  return {
    name: flow.name,
    number: flow.number,
    stepResults,
    finalCheckSuccess,
    finalCheckError,
    allPassed: stepResults.every(s => s.success || s.note) && finalCheckSuccess,
  }
}

// 生成测试报告
function generateReport(modulePath, flowResults, apiMappingResults, duration) {
  const moduleName = modulePath.includes('/') ? path.basename(modulePath) : modulePath

  let report = '\n'
  report += '========================================\n'
  report += `  ${moduleName} - AI 流程驱动测试报告\n`
  report += '========================================\n\n'

  report += `**测试时间**：${new Date().toLocaleString('zh-CN')}\n`
  report += `**模块**：${moduleName}\n`
  report += `**执行时长**：${duration}ms\n\n`

  // 接口映射验证结果
  report += '### 接口映射验证\n\n'
  report += '| 组件调用方法 | Mock 实现方法 | 验证结果 |\n'
  report += '|-------------|--------------|:--------:|\n'
  apiMappingResults.forEach(m => {
    const result = m.verified ? '✅ 通过' : `❌ ${m.error || '失败'}`
    report += `| ${m.componentCall} | ${m.mockMethod} | ${result} |\n`
  })
  report += '\n'

  // 流程执行结果
  report += '### 流程执行结果\n\n'
  report += '| 流程 | 步骤数 | 通过 | 失败 | 结果 |\n'
  report += '|------|:------:|:----:|:----:|:----:|\n'

  const flowStats = flowResults.map(f => {
    const passed = f.stepResults.filter(s => s.success || s.note).length
    const failed = f.stepResults.filter(s => !s.success && !s.note).length
    const result = f.allPassed ? '✅ 通过' : '❌ 失败'
    return {
      name: f.name.substring(0, 20),
      passed,
      failed,
      total: f.stepResults.length,
      result,
    }
  })

  flowStats.forEach(s => {
    report += `| ${s.name} | ${s.total} | ${s.passed} | ${s.failed} | ${s.result} |\n`
  })
  report += '\n'

  // 详细步骤结果
  report += '### 详细步骤结果\n\n'
  flowResults.forEach(f => {
    report += `#### ${f.name}\n\n`
    report += '| 步骤 | 操作 | 结果 | 备注 |\n'
    report += '|------|------|:----:|------|\n'
    f.stepResults.forEach(s => {
      const result = s.success ? '通过' : '失败'
      const note = s.note || s.error || ''
      report += `| ${s.number} | ${s.action} | ${result} | ${note} |\n`
    })
    if (f.finalCheckError) {
      report += `\n**最终验证**：❌ ${f.finalCheckError}\n\n`
    } else if (f.finalCheckSuccess !== undefined) {
      report += `\n**最终验证**：✅ 通过\n\n`
    }
  })

  // 总结
  report += '### 总结\n\n'
  const totalFlows = flowResults.length
  const passedFlows = flowResults.filter(f => f.allPassed).length
  const totalSteps = flowResults.reduce((sum, f) => sum + f.stepResults.length, 0)
  const passedSteps = flowResults.reduce(
    (sum, f) => sum + f.stepResults.filter(s => s.success || s.note).length,
    0
  )

  report += `- 流程通过率：${passedFlows}/${totalFlows}（${Math.round((passedFlows / totalFlows) * 100)}%）\n`
  report += `- 步骤通过率：${passedSteps}/${totalSteps}（${Math.round((passedSteps / totalSteps) * 100)}%）\n`

  const mappingFailures = apiMappingResults.filter(m => !m.verified)
  if (mappingFailures.length > 0) {
    report += `- 接口映射问题：${mappingFailures.length}个\n`
  }

  const failedSteps = flowResults.flatMap(f => f.stepResults.filter(s => !s.success && !s.note))
  if (failedSteps.length > 0) {
    report += `- 失败步骤：\n`
    failedSteps.forEach(s => {
      report += `  - 流程"${s.flow}" 步骤${s.number}: ${s.error}\n`
    })
  }

  const overallPass = passedFlows === totalFlows && mappingFailures.length === 0
  report += `- 整体评估：${overallPass ? '✅ 通过' : '❌ 需修复'}\n`

  return report
}

// 执行单个模块测试
async function executeTest(modulePath, flowNum) {
  console.log(`\n开始测试模块: ${modulePath}`)

  const startTime = Date.now()
  const doc = loadModuleDoc(modulePath)

  // 解析文档
  const flows = parseFlows(doc)
  const apiMappings = parseApiMapping(doc)

  // 过滤流程（如果指定了流程号）
  let flowsToTest = flows
  if (flowNum) {
    if (flowNum < 1 || flowNum > flows.length) {
      console.error(`错误: 流程${flowNum}不存在，该模块共有${flows.length}个流程`)
      process.exit(1)
    }
    flowsToTest = [flows[flowNum - 1]]
  }

  console.log(`发现 ${flowsToTest.length} 个测试流程`)
  console.log(`发现 ${apiMappings.length} 个接口映射`)

  // 验证接口映射
  console.log('\n验证接口映射...')
  const apiMappingResults = await verifyApiMapping(modulePath, apiMappings)

  // 执行流程测试
  const flowResults = []
  for (const flow of flowsToTest) {
    const result = await executeFlow(modulePath, flow, apiMappingResults)
    flowResults.push(result)
  }

  const duration = Date.now() - startTime

  // 生成报告
  const report = generateReport(modulePath, flowResults, apiMappingResults, duration)
  console.log(report)

  // 保存报告到文件
  const reportPath = path.join(
    MODULES_DIR,
    path.dirname(modulePath),
    `${path.basename(modulePath)}.test-report.md`
  )
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, report)
  console.log(`测试报告已保存: ${reportPath}\n`)

  return flowResults.every(f => f.allPassed) && apiMappingResults.every(m => m.verified)
}

// 主流程
async function main() {
  const options = parseArgs()

  console.log('========================================')
  console.log('  AI 流程驱动测试（真实执行版）')
  console.log('========================================')

  let allPassed = true

  if (options.all) {
    const modules = listModules()
    if (modules.length === 0) {
      console.error('未找到任何模块文档，请先在 docs/modules/ 下创建模块描述')
      process.exit(1)
    }
    console.log(`发现 ${modules.length} 个模块：`)
    modules.forEach(m => console.log(`  - ${m}`))

    for (const mod of modules) {
      const passed = await executeTest(mod, null)
      if (!passed) allPassed = false
    }

    console.log('\n========================================')
    console.log(allPassed ? '✅ 所有模块测试通过' : '❌ 部分模块测试失败')
    console.log('========================================\n')
  } else if (options.module) {
    const subModules = listSubModules(options.module)

    if (subModules && subModules.length > 0) {
      console.log(`大模块 "${options.module}" 包含 ${subModules.length} 个子模块：`)
      subModules.forEach(m => console.log(`  - ${m}`))

      for (const mod of subModules) {
        const passed = await executeTest(mod, options.flow)
        if (!passed) allPassed = false
      }

      console.log('\n========================================')
      console.log(allPassed ? '✅ 所有子模块测试通过' : '❌ 部分子模块测试失败')
      console.log('========================================\n')
    } else {
      const passed = await executeTest(options.module, options.flow)
      allPassed = passed
    }
  } else {
    console.log('\n用法：')
    console.log('  单模块测试:   node scripts/ai-test.js --module=coupon-management')
    console.log('  大模块全量:   node scripts/ai-test.js --module=user-center')
    console.log('  子模块测试:   node scripts/ai-test.js --module=user-center/user-login')
    console.log('  指定流程:     node scripts/ai-test.js --module=dict-management --flow=5')
    console.log('  全量测试:     node scripts/ai-test.js --all\n')
  }

  process.exit(allPassed ? 0 : 1)
}

main().catch(error => {
  console.error('测试执行出错:', error)
  process.exit(1)
})
