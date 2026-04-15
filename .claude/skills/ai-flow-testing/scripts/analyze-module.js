/**
 * 模块分析器 - 从前端代码提取字段信息
 *
 * 分析目标：
 * 1. Form 组件：提取表单字段（v-model 绑定的字段）
 * 2. List 组件：提取表格列、搜索条件、操作按钮
 * 3. 识别操作对应的 API 方法（如 status 字段 → on/off 操作）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 查找项目根目录（向上查找包含 package.json 或 docs/ 目录的父目录）
function findProjectRoot(startDir) {
  let currentDir = startDir
  let maxDepth = 10 // 防止无限循环

  while (maxDepth-- > 0) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    const docsDir = path.join(currentDir, 'docs')

    if (fs.existsSync(packageJsonPath) || fs.existsSync(docsDir)) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) break // 已到达根目录
    currentDir = parentDir
  }

  // 如果找不到，返回当前目录
  return startDir
}

// 确定项目根目录
const PROJECT_ROOT = findProjectRoot(__dirname)
const SRC_DIR = path.join(PROJECT_ROOT, 'src', 'modules')

/**
 * 提取 Vue 组件中的字段信息
 */
function analyzeVueComponent(componentPath, componentName) {
  if (!fs.existsSync(componentPath)) {
    console.log(`  文件不存在: ${componentPath}`)
    return null
  }

  const content = fs.readFileSync(componentPath, 'utf-8')
  const result = {
    componentName,
    type: null, // 'form' | 'list' | 'page'
    fields: {},
    operations: [],
    searchFields: [],
    displayFields: [],
  }

  // 1. 识别组件类型
  if (componentPath.includes('Form') || componentPath.includes('form')) {
    result.type = 'form'
  } else if (componentPath.includes('List') || componentPath.includes('list')) {
    result.type = 'list'
  } else if (componentPath.includes('Management') || componentPath.includes('Page')) {
    result.type = 'page'
  }

  // 2. 提取 data() 中的 form 字段定义
  const dataMatch = content.match(/form\s*:\s*\{([^}]+)\}/)
  if (dataMatch) {
    const formFields = dataMatch[1]
    const fieldMatches = formFields.matchAll(/(\w+)\s*:\s*['"`][^'"`]*['"`]/g)
    for (const match of fieldMatches) {
      if (match[1] && match[1] !== 'visible' && match[1] !== 'editTarget') {
        result.fields[match[1]] = {
          name: match[1],
          source: 'form',
        }
      }
    }
  }

  // 3. 提取 template 中的 v-model 字段
  const vmodelMatches = content.matchAll(
    /v-model(?:\.number)?(?:\.\w+)?\s*=\s*["'](\w+(?:\.\w+)*)["']/g
  )
  for (const match of vmodelMatches) {
    const fieldPath = match[1]
    const fieldName = fieldPath.split('.').pop()
    if (
      fieldName &&
      fieldName !== 'visible' &&
      fieldName !== 'editTarget' &&
      fieldName !== 'searchName' &&
      fieldName !== 'searchStatus'
    ) {
      if (!result.fields[fieldName]) {
        result.fields[fieldName] = {
          name: fieldName,
          source: 'template',
        }
      }
    }
  }

  // 4. 提取表格列（从 th 标签）
  const thMatches = content.matchAll(/<th[^>]*>([^<]+)<\/th>/g)

  // 尝试多种 v-for 模式（list/items/data等）
  const tbodyPatterns = [
    /<tbody>[\s\S]*?<tr\s*v-for="item\s*in\s*list"[^>]*>([\s\S]*?)<\/tbody>/,
    /<tbody>[\s\S]*?<tr\s*v-for="item\s*in\s*items"[^>]*>([\s\S]*?)<\/tbody>/,
    /<tbody>[\s\S]*?<tr\s*v-for="item\s*in\s*data"[^>]*>([\s\S]*?)<\/tbody>/,
  ]

  let tbodyContent = null
  for (const pattern of tbodyPatterns) {
    const match = content.match(pattern)
    if (match) {
      tbodyContent = match[1]
      break
    }
  }

  if (tbodyContent) {
    // 提取每一列中的 item.xxx
    const tdPatterns = tbodyContent.matchAll(/\{\{\s*item\.(\w+)/g)
    const tbodyFields = []
    for (const match of tdPatterns) {
      tbodyFields.push(match[1])
    }

    let fieldIndex = 0
    for (const match of thMatches) {
      const label = match[1].trim()
      if (label && label !== '操作' && tbodyFields[fieldIndex]) {
        const fieldName = tbodyFields[fieldIndex]
        result.displayFields.push({
          label,
          field: fieldName,
        })
        if (!result.fields[fieldName]) {
          result.fields[fieldName] = {
            name: fieldName,
            source: 'table',
          }
        }
      }
      fieldIndex++
    }
  }

  // 5. 提取搜索条件（从 data 中的 searchXxx 字段）
  const searchPattern = /search(\w+)\s*:\s*['"`]([^'"`]*)['"`]/g
  let searchMatch
  while ((searchMatch = searchPattern.exec(content)) !== null) {
    const [, fieldName] = searchMatch
    result.searchFields.push(fieldName)
  }

  // 6. 提取操作方法（handleXxx）
  const operationPatterns = [
    { pattern: /handleToggleStatus.*status\s*=\s*(\d+)/g, operation: 'toggle', field: 'status' },
    { pattern: /couponApi\.on\(/g, operation: 'on', field: 'status' },
    { pattern: /couponApi\.off\(/g, operation: 'off', field: 'status' },
    { pattern: /couponApi\.remove\(/g, operation: 'remove', field: 'id' },
    { pattern: /couponApi\.update\(/g, operation: 'update', field: 'id' },
    { pattern: /couponApi\.create\(/g, operation: 'create', field: null },
  ]

  operationPatterns.forEach(({ pattern, operation, field }) => {
    if (pattern.test(content)) {
      result.operations.push({ operation, field })
    }
  })

  return result
}

/**
 * 分析整个模块
 */
function analyzeModule(modulePath) {
  const moduleDir = path.join(SRC_DIR, modulePath)
  if (!fs.existsSync(moduleDir)) {
    console.error(`模块不存在: ${modulePath}`)
    return null
  }

  console.log(`\n========================================`)
  console.log(`分析模块: ${modulePath}`)
  console.log(`========================================`)

  const result = {
    modulePath,
    fields: {},
    formFields: [],
    listFields: [],
    searchFields: [],
    operations: [],
    components: [],
    // 区分不同实体类型的字段
    entityTypes: {}, // { 'dictType': {...}, 'dictData': {...} }
  }

  // 查找所有 Vue 组件
  function findVueFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        findVueFiles(fullPath, fileList)
      } else if (entry.isFile() && entry.name.endsWith('.vue')) {
        fileList.push(fullPath)
      }
    }
    return fileList
  }

  const vueFiles = findVueFiles(moduleDir)

  console.log(`找到 ${vueFiles.length} 个 Vue 文件`)

  for (const file of vueFiles) {
    console.log(`分析: ${file}`)
    const componentName = path.basename(file, '.vue')
    const analysis = analyzeVueComponent(file, componentName)

    if (analysis) {
      console.log(
        `  → ${componentName}: ${analysis.type}, fields: ${Object.keys(analysis.fields).length}`
      )
      result.components.push(analysis)

      // 根据组件名称推断实体类型
      let entityType = null
      if (componentName.includes('Type') || componentName.includes('TypeForm')) {
        entityType = 'dictType'
      } else if (componentName.includes('Data') || componentName.includes('DataForm')) {
        entityType = 'dictData'
      }

      // 合并字段信息
      Object.entries(analysis.fields).forEach(([name, info]) => {
        if (!result.fields[name]) {
          result.fields[name] = {
            name,
            sources: [],
            label: null,
            entityType: null, // 标记字段属于哪种实体类型
          }
        }
        result.fields[name].sources.push(info.source)
        if (entityType) {
          result.fields[name].entityType = entityType
        }

        // 从表格列中获取中文标签
        const displayField = analysis.displayFields.find(d => d.field === name)
        if (displayField) {
          result.fields[name].label = displayField.label
        }

        // 如果没有 label，根据字段名生成默认标签
        if (!result.fields[name].label) {
          const defaultLabels = {
            name: '名称',
            code: '编码',
            label: '标签',
            value: '值',
            sort: '排序',
            remark: '备注',
            amount: '面额',
            threshold: '门槛',
            typeCode: '类型编码',
            status: '状态',
          }
          result.fields[name].label = defaultLabels[name] || name
        }
      })

      if (analysis.type === 'form') {
        result.formFields = Object.keys(analysis.fields)
      }
      if (analysis.type === 'list' || analysis.type === 'page') {
        result.listFields = analysis.displayFields.map(d => d.field)
        result.searchFields.push(...analysis.searchFields)
        result.operations.push(...analysis.operations)
      }
    }
  }

  // 去重
  result.searchFields = [...new Set(result.searchFields)]

  // 构建实体类型分组
  result.entityTypes = {
    dictType: {
      fields: {},
      fieldNames: [],
    },
    dictData: {
      fields: {},
      fieldNames: [],
    },
  }

  Object.values(result.fields).forEach(field => {
    if (field.entityType) {
      result.entityTypes[field.entityType].fields[field.name] = field
      result.entityTypes[field.entityType].fieldNames.push(field.name)
    }
  })

  return result
}

/**
 * 生成字段映射配置
 */
function generateFieldMapping(moduleInfo) {
  const mapping = {}

  Object.values(moduleInfo.fields).forEach(field => {
    // 生成字段名到字段名的映射（自映射）
    mapping[field.name] = field.name

    // 生成中文名到字段名的映射
    if (field.label) {
      mapping[field.label] = field.name

      // 生成简化版本的映射（去除括号内容、单位等）
      let simplified = field.label
        .replace(/\([^)]*\)/g, '') // 移除括号及内容，如 "(元)"
        .replace(/（[^）]*）]/g, '') // 移除中文括号
        .trim()

      if (simplified !== field.label) {
        mapping[simplified] = field.name
      }

      // 生成更简化的版本（如 "优惠券名称" → "名称"）
      // 如果标签是复合词（XX名称、XX编码等），提取最后的词
      const coreFields = [
        '名称',
        '编码',
        '标签',
        '值',
        '金额',
        '面额',
        '门槛',
        '状态',
        '类型',
        '备注',
      ]
      coreFields.forEach(core => {
        if (simplified.endsWith(core) && simplified !== core) {
          mapping[core] = field.name
        }
      })
    }
  })

  return mapping
}

/**
 * 根据参数内容推断实体类型
 * @param {object} params - 解析后的参数
 * @param {object} moduleInfo - 模块信息
 * @returns {string|null} - 实体类型：'dictType', 'dictData', 或 null
 */
function inferEntityType(params, moduleInfo) {
  if (!moduleInfo.entityTypes) {
    return null
  }

  const { dictType, dictData } = moduleInfo.entityTypes

  // 检查是否包含字典类型的特征字段
  const hasTypeFields = dictType.fieldNames.some(f => params[f] !== undefined)
  // 检查是否包含字典数据的特征字段
  const hasDataFields = dictData.fieldNames.some(f => params[f] !== undefined)

  if (hasTypeFields && !hasDataFields) {
    return 'dictType'
  }
  if (hasDataFields && !hasTypeFields) {
    return 'dictData'
  }

  // 如果都有，根据具体字段判断
  if (params.code !== undefined && params.name !== undefined) {
    return 'dictType'
  }
  if (params.label !== undefined || params.value !== undefined) {
    return 'dictData'
  }

  return null
}

/**
 * 打印分析结果
 */
function printAnalysisResult(moduleInfo) {
  console.log(`\n📦 组件列表:`)
  moduleInfo.components.forEach(c => {
    console.log(`   - ${c.componentName} (${c.type})`)
  })

  console.log(`\n📋 字段列表:`)
  Object.values(moduleInfo.fields).forEach(field => {
    const sources = field.sources.join(', ')
    const label = field.label ? ` [${field.label}]` : ''
    console.log(`   - ${field.name}${label} (来源: ${sources})`)
  })

  console.log(`\n🔍 搜索字段: ${moduleInfo.searchFields.join(', ') || '无'}`)

  console.log(`\n⚙️ 操作列表:`)
  moduleInfo.operations.forEach(op => {
    console.log(`   - ${op.operation}${op.field ? ` (${op.field})` : ''}`)
  })

  console.log(`\n📝 字段映射配置:`)
  const mapping = generateFieldMapping(moduleInfo)
  console.log(JSON.stringify(mapping, null, 2))
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const modulePath = process.argv[2]
  if (!modulePath) {
    console.error('用法: node analyze-module.js <模块路径>')
    console.error('示例: node analyze-module.js coupon-management')
    process.exit(1)
  }

  const result = analyzeModule(modulePath)
  if (result) {
    printAnalysisResult(result)

    // 保存分析结果
    const outputPath = path.join(SRC_DIR, modulePath, 'module-meta.json')
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))
    console.log(`\n✅ 分析结果已保存到: ${outputPath}`)
  }
}

export {
  analyzeModule,
  generateFieldMapping,
  analyzeVueComponent,
  printAnalysisResult,
  inferEntityType,
}
