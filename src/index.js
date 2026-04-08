// 这是一个测试文件，包含一些代码质量问题
// 用于测试 SonarQube 的代码质量检测功能

// ==================== 问题1：未使用的变量 ====================
const unusedVariable = 'this is never used'
let anotherUnused = 123

// ==================== 问题2：使用 var 而不是 let/const ====================
var oldStyle = 'should use let or const'
var counter = 0

// ==================== 问题3：console.log（生产环境不应有）====================
console.log('This is a debug message')
console.warn('Warning message')
console.error('Error message')

// ==================== 问题4：使用 == 而不是 === ====================
function compareNumbers(a, b) {
  if (a == b) {
    // 应该使用 ===
    return true
  }
  return false
}

// ==================== 问题5：函数复杂度过高 ====================
function complexFunction(x, y, z, a, b, c) {
  // 这个函数嵌套层级太深，复杂度过高
  if (x > 0) {
    if (y > 0) {
      if (z > 0) {
        if (a > 0) {
          if (b > 0) {
            if (c > 0) {
              return 'all positive'
            }
          }
        }
      }
    }
  }
  return 'some negative'
}

// ==================== 问题6：重复代码 ====================
function calculateArea1(length, width) {
  const result = length * width
  console.log('Area calculated:', result)
  return result
}

function calculateArea2(length, width) {
  const result = length * width // 重复代码
  console.log('Area calculated:', result)
  return result
}

// ==================== 问题7：魔法数字 ====================
function calculateDiscount(price) {
  if (price > 100) {
    return price * 0.1 // 魔法数字 0.1
  } else if (price > 500) {
    return price * 0.2 // 魔法数字 0.2
  } else if (price > 1000) {
    return price * 0.3 // 魔法数字 0.3
  }
  return 0
}

// ==================== 问题8：潜在的空指针异常 ====================
function getUserInfo(user) {
  // 没有检查 user 是否为 null
  return user.name + ' - ' + user.email
}

// ==================== 问题9：函数过长 ====================
function processUserData(id, name, email, age, address, phone, status) {
  // 验证输入
  if (!id) {
    console.log('ID is required')
    return null
  }
  if (!name) {
    console.log('Name is required')
    return null
  }
  if (!email) {
    console.log('Email is required')
    return null
  }
  if (!age) {
    console.log('Age is required')
    return null
  }
  if (!address) {
    console.log('Address is required')
    return null
  }
  if (!phone) {
    console.log('Phone is required')
    return null
  }
  if (!status) {
    console.log('Status is required')
    return null
  }

  // 处理数据
  const processedId = id.toUpperCase()
  const processedName = name.trim()
  const processedEmail = email.toLowerCase()
  const processedAge = parseInt(age)
  const processedAddress = address.replace(/\s+/g, ' ')
  const processedPhone = phone.replace(/-/g, '')
  const processedStatus = status.toUpperCase()

  // 返回结果
  return {
    id: processedId,
    name: processedName,
    email: processedEmail,
    age: processedAge,
    address: processedAddress,
    phone: processedPhone,
    status: processedStatus,
  }
}

// ==================== 问题10：eval 使用（安全风险）====================
function unsafeEval(code) {
  // eval 是安全风险
  return eval(code)
}

// ==================== 示例：正确的代码 ====================
const CONSTANT_VALUE = 100 // 常量使用大写

function goodFunction(a, b) {
  // 使用 ===
  if (a === b) {
    return true
  }
  return false
}

function safeGetUser(user) {
  // 检查 null
  if (!user) {
    return 'Unknown User'
  }
  return user.name || 'Anonymous'
}

// 导出函数
module.exports = {
  compareNumbers,
  complexFunction,
  calculateDiscount,
  getUserInfo,
  processUserData,
  unsafeEval,
  goodFunction,
  safeGetUser,
}
