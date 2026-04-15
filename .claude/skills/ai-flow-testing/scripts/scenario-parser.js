/**
 * 场景描述解析器
 * 从自然语言场景描述生成测试用例
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 解析场景描述，生成测试流程
 */
function parseScenario(scenarioText) {
  const lines = scenarioText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const scenario = {
    name: '',
    interfaces: [],
    triggerConditions: [],
    steps: [],
    completion: '',
  }

  let currentSection = null

  for (const line of lines) {
    // 解析场景名称
    if (line.startsWith('### 场景名称：')) {
      scenario.name = line.replace('### 场景名称：', '').trim()
      continue
    }

    // 解析涉及接口
    if (line.startsWith('**涉及接口**：')) {
      const interfaces = line.replace('**涉及接口**：', '').trim()
      if (interfaces) {
        scenario.interfaces = interfaces.split(/[,，、]/).map(s => s.trim())
      }
      continue
    }

    // 解析触发条件
    if (line.startsWith('**触发条件**：')) {
      currentSection = 'trigger'
      continue
    }

    // 解析操作流程
    if (line.startsWith('**操作流程**：')) {
      currentSection = 'steps'
      continue
    }

    // 解析完成标志
    if (line.startsWith('**完成标志**：')) {
      scenario.completion = line.replace('**完成标志**：', '').trim()
      continue
    }

    // 收集触发条件
    if (currentSection === 'trigger' && line.startsWith('-')) {
      scenario.triggerConditions.push(line.replace(/^-\s*/, '').trim())
    }

    // 收集操作步骤
    if (currentSection === 'steps' && line.match(/^\d+\./)) {
      scenario.steps.push(line.replace(/^\d+\.\s*/, '').trim())
    }
  }

  return scenario
}

/**
 * 将场景步骤转换为测试步骤
 */
function convertToTestSteps(scenario, fieldMapping) {
  const testSteps = []

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i]
    const stepNum = i + 1

    // 解析操作类型
    let action = ''
    let description = ''
    let expectation = ''

    // 提取参数
    const params = extractParameters(step, fieldMapping)

    // 根据操作关键词确定操作类型
    if (step.includes('打开') || step.includes('进入')) {
      if (step.includes('列表') || step.includes('页面')) {
        action = '[查询]'
        description = `查询${scenario.name.replace('新增', '').replace('启用', '').replace('关闭', '').trim()}列表`
      } else {
        action = '[操作]'
        description = step.replace(/打开|进入/, '').trim()
      }
    } else if (step.includes('填写') || step.includes('输入')) {
      action = '[操作]'
      description = step
      // 如果是最后一步填写，可能是保存
      if (i === scenario.steps.length - 1 || scenario.steps[i + 1]?.includes('保存')) {
        // 不做特殊处理
      }
    } else if (step.includes('选择') || step.includes('勾选')) {
      action = '[选择]'
      description = step
    } else if (
      step.includes('点击保存') ||
      step.includes('点击提交') ||
      step.includes('点击确认')
    ) {
      action = '[新增]'
      // 收集前面填写过的参数
      const allParams = collectParamsFromSteps(scenario.steps.slice(0, i), fieldMapping)
      if (Object.keys(allParams).length > 0) {
        const paramStr = Object.entries(allParams)
          .map(([k, v]) => `${k}="${v}"`)
          .join(', ')
        description = `创建${scenario.name.replace('新增', '').trim()}，${paramStr}`
      } else {
        description = `创建${scenario.name.replace('新增', '').trim()}`
      }
      expectation = '→ 期望成功'
    } else if (step.includes('调用') && step.includes('接口')) {
      action = '[操作]'
      description = '调用接口'
    } else if (step.includes('返回成功') || (step.includes('返回') && step.includes('成功'))) {
      action = '[验证]'
      description = '验证操作结果'
      expectation = '→ 期望成功'
    } else if (step.includes('刷新') || step.includes('加载')) {
      action = '[验证]'
      description = step.replace(/刷新|加载/, '查询').replace(/列表|页面/, '列表')
      expectation = '→ 期望包含新增数据'
    }

    if (action && description) {
      testSteps.push(`  ${stepNum}. ${action} ${description} ${expectation}`)
    }
  }

  return testSteps
}

/**
 * 从步骤中提取参数
 */
function extractParameters(step, fieldMapping) {
  const params = {}
  const matches = step.matchAll(/(\w+[:=]["']?\s*([^,，"'\)]+))/g)

  for (const match of matches) {
    const [, fieldKey, rawValue] = match
    const actualField = fieldMapping[fieldKey] || fieldKey
    let value = rawValue.trim().replace(/^["']|["']$/g, '')

    // 尝试转换为数字
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && /^\d+(\.\d+)?$/.test(value)) {
      value = numValue
    }

    params[actualField] = value
  }

  return params
}

/**
 * 收集前面步骤中的所有参数
 */
function collectParamsFromSteps(steps, fieldMapping) {
  const allParams = {}

  for (const step of steps) {
    const params = extractParameters(step, fieldMapping)
    Object.assign(allParams, params)
  }

  return allParams
}

/**
 * 生成测试流程代码
 */
function generateTestFlow(scenario, fieldMapping) {
  const testSteps = convertToTestSteps(scenario, fieldMapping)

  let flow = `#### 流程N：${scenario.name}\n\n`
  flow += `前置：${scenario.triggerConditions.join('，') || '无'}\n\n`
  flow += `步骤：\n`
  flow += testSteps.join('\n')
  flow += '\n\n'
  flow += `最终验证：${scenario.completion}\n`

  return flow
}

/**
 * 从模块文档中提取所有场景并生成测试用例
 */
function generateTestCasesFromScenarios(moduleDoc, fieldMapping) {
  // 查找第0节的内容
  const section0Match = moduleDoc.match(/## 0\. 功能流程描述([\s\S]*?)(?=##\s\d+\.)/)
  if (!section0Match) {
    return null
  }

  const scenariosSection = section0Match[1]

  // 提取所有场景
  const scenarioMatches = scenariosSection.matchAll(
    /### 场景名称[^\n]+\n([\s\S]*?)(?=### 场景名称|##\s\d+\.|$)/g
  )
  const scenarios = []

  for (const match of scenarioMatches) {
    const scenarioText = match[0]
    const scenario = parseScenario(scenarioText)
    if (scenario.name) {
      scenarios.push(scenario)
    }
  }

  return scenarios
}

export { parseScenario, convertToTestSteps, generateTestFlow, generateTestCasesFromScenarios }
