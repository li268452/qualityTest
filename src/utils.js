// 工具函数文件

// ==================== 问题：没有 JSDoc 注释 ====================
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ==================== 问题：参数过多 ====================
function createUser(name, email, age, phone, address, role, status, department) {
  return {
    name,
    email,
    age,
    phone,
    address,
    role,
    status,
    department,
  }
}

// ==================== 问题：循环中重复计算 ====================
function inefficientSum(arr) {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    // arr.length 在每次循环都计算
    sum = sum + arr[i]
  }
  return sum
}

// ==================== 问题：深层嵌套 ====================
function findUserById(users, id) {
  if (users) {
    if (Array.isArray(users)) {
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          if (users[i]) {
            if (users[i].id === id) {
              return users[i]
            }
          }
        }
      }
    }
  }
  return null
}

// ==================== 正确示例 ====================
/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatProperDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 高效的数组遍历
function efficientSum(arr) {
  let sum = 0
  const len = arr.length // 缓存长度
  for (let i = 0; i < len; i++) {
    sum += arr[i]
  }
  return sum
}

// 使用可选链避免深层嵌套
function findUserSafely(users, id) {
  return users?.find?.(user => user?.id === id) || null
}

module.exports = {
  formatDate,
  createUser,
  inefficientSum,
  findUserById,
  formatProperDate,
  efficientSum,
  findUserSafely,
}
