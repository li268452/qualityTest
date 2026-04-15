/**
 * 测试参数解析器
 */

// 复制 parseParameters 函数
function parseParameters(description, fieldMapping = {}) {
  const params = {}

  // 匹配格式：字段名[:=]["']?\s*值
  // 例如：名称="测试", name=test, 面额=100
  const paramPattern = /(\w+|[^\s,，]+?)[:=]["']?\s*([^,，"'\n]+)/g
  let match

  while ((match = paramPattern.exec(description)) !== null) {
    const [, fieldKey, rawValue] = match
    console.log(`Match: fieldKey="${fieldKey}", rawValue="${rawValue}"`)

    // 尝试从字段映射中获取实际字段名
    const actualField = fieldMapping[fieldKey] || fieldKey

    // 解析值类型
    let value = rawValue.trim()
    // 尝试转换为数字
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && /^\d+(\.\d+)?$/.test(value)) {
      value = numValue
    }
    // 移除引号
    if (typeof value === 'string') {
      value = value.replace(/^["']|["']$/g, '')
    }

    params[actualField] = value
  }

  return params
}

// 测试
const desc1 = '创建字典类型，名称="审核状态", 编码="audit_status"'
const fieldMapping1 = { 名称: 'name', 编码: 'code' }

const desc2 = '创建字典数据，标签="正常", 值="1"'
const fieldMapping2 = { 标签: 'label', 值: 'value', 排序: 'sort' }

console.log('Test 1 - Dict Type:')
console.log('Description:', desc1)
console.log('Field mapping:', fieldMapping1)
const params1 = parseParameters(desc1, fieldMapping1)
console.log('Result:', JSON.stringify(params1, null, 2))

console.log('\nTest 2 - Dict Data:')
console.log('Description:', desc2)
console.log('Field mapping:', fieldMapping2)
const params2 = parseParameters(desc2, fieldMapping2)
console.log('Result:', JSON.stringify(params2, null, 2))

console.log('Description:', desc)
console.log('Field mapping:', fieldMapping)
console.log('\nParsing...')
const params = parseParameters(desc, fieldMapping)
console.log('\nResult:', JSON.stringify(params, null, 2))
