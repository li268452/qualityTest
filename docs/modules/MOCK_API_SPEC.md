# Mock API 规范

本文档定义了 AI Flow Testing 工具所需的 Mock API 返回格式规范。

## 目录

- [标准返回格式](#标准返回格式)
- [HTTP 状态码规范](#http-状态码规范)
- [业务状态码规范](#业务状态码规范)
- [接口返回示例](#接口返回示例)
- [数据格式规范](#数据格式规范)
- [错误处理规范](#错误处理规范)

## 标准返回格式

### 成功响应

```javascript
{
  "code": 200,          // 业务状态码（必填）
  "data": {...},        // 返回数据（必填）
  "msg": "操作成功"     // 提示信息（必填）
}
```

### 失败响应

```javascript
{
  "code": 400,          // 业务状态码（必填）
  "data": null,         // 返回数据（失败时为 null）
  "msg": "错误原因"     // 错误提示（必填）
}
```

### 分页响应

```javascript
{
  "code": 200,
  "data": {
    "records": [...],   // 数据列表（必填）
    "total": 100,       // 总记录数（必填）
    "page": 1,          // 当前页码（必填）
    "size": 10          // 每页大小（必填）
  },
  "msg": "查询成功"
}
```

## HTTP 状态码规范

Mock API 使用统一的 HTTP 状态码：**200**

无论业务成功或失败，HTTP 状态码都应返回 200，业务状态通过 `code` 字段区分。

## 业务状态码规范

### 成功状态码

| Code | 说明     | 使用场景     |
| ---- | -------- | ------------ |
| 200  | 操作成功 | 所有成功操作 |

### 客户端错误状态码

| Code | 说明         | 使用场景                     | 示例          |
| ---- | ------------ | ---------------------------- | ------------- |
| 400  | 请求参数错误 | 参数缺失、格式错误、校验失败 | 名称不能为空  |
| 401  | 未授权       | 需要登录才能访问             | 请先登录      |
| 403  | 禁止访问     | 权限不足                     | 无权限操作    |
| 404  | 资源不存在   | 数据不存在                   | 数据不存在    |
| 409  | 资源冲突     | 数据重复、状态冲突           | 名称已存在    |
| 422  | 数据验证失败 | 业务规则验证失败             | 数值必须大于0 |

### 服务器错误状态码

| Code | 说明           | 使用场景           |
| ---- | -------------- | ------------------ |
| 500  | 服务器内部错误 | 未知错误、系统异常 |

## 接口返回示例

### 1. 查询列表（分页）

```javascript
// 成功
{
  "code": 200,
  "data": {
    "records": [
      {
        "id": 1,
        "name": "测试数据1",
        "status": 1
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  },
  "msg": "查询成功"
}
```

### 2. 新增数据

```javascript
// 成功
{
  "code": 200,
  "data": {
    "id": 5,
    "name": "新数据",
    "status": 1
  },
  "msg": "新增成功"
}

// 失败 - 参数校验失败
{
  "code": 400,
  "data": null,
  "msg": "名称不能为空"
}

// 失败 - 数据重复
{
  "code": 409,
  "data": null,
  "msg": "名称已存在"
}
```

### 3. 编辑数据

```javascript
// 成功
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "更新后的名称",
    "status": 1
  },
  "msg": "修改成功"
}

// 失败 - 资源不存在
{
  "code": 404,
  "data": null,
  "msg": "数据不存在"
}
```

### 4. 删除数据

```javascript
// 成功
{
  "code": 200,
  "data": null,
  "msg": "删除成功"
}

// 失败 - 资源不存在
{
  "code": 404,
  "data": null,
  "msg": "数据不存在"
}
```

### 5. 启用/禁用

```javascript
// 成功
{
  "code": 200,
  "data": {
    "id": 1,
    "status": 1
  },
  "msg": "启用成功"
}

// 失败 - 状态冲突
{
  "code": 409,
  "data": null,
  "msg": "数据已是启用状态"
}
```

## 数据格式规范

### 日期时间格式

使用 `YYYY-MM-DD HH:mm:ss` 格式：

```javascript
{
  "createdAt": "2026-04-15 10:30:00",
  "updatedAt": "2026-04-15 11:00:00"
}
```

### 日期格式

使用 `YYYY-MM-DD` 格式：

```javascript
{
  "startDate": "2026-04-01",
  "endDate": "2026-05-31"
}
```

### 状态字段

- **数字类型**：`1` 表示启用/激活，`0` 表示禁用/停用
- **布尔类型**：不推荐，建议使用数字类型

```javascript
{
  "status": 1,   // 1=已启用 0=已关闭
  "deleted": 0   // 0=未删除 1=已删除
}
```

### 数值字段（可选）

如果业务涉及数值字段（如金额、数量等），使用数字类型：

```javascript
{
  "amount": 2000,    // 单位：分（20.00元）
  "quantity": 100,   // 数量
  "threshold": 100   // 阈值
}
```

或使用更直观的单位：

```javascript
{
  "amount": 20,      // 单位：元
  "quantity": 100,
  "threshold": 100
}
```

## 错误处理规范

### 错误提示格式

错误提示应清晰明确，包含以下信息：

1. **什么出错了** - 具体的错误原因
2. **如何修复** - 可操作的修复建议（可选）

```javascript
// 好的错误提示
{
  "code": 400,
  "msg": "名称不能为空"
}

{
  "code": 422,
  "msg": "数值必须大于0"
}

{
  "code": 422,
  "msg": "结束日期不能早于开始日期"
}

// 不好的错误提示
{
  "code": 400,
  "msg": "参数错误"  // 不明确
}

{
  "code": 400,
  "msg": "操作失败"  // 无意义
}
```

### 常见错误码映射表

| 错误场景         | Code | 错误提示                             |
| ---------------- | ---- | ------------------------------------ |
| 必填字段为空     | 400  | {字段名}不能为空                     |
| 字段格式错误     | 400  | {字段名}格式不正确                   |
| 字段长度超限     | 400  | {字段名}长度不能超过{N}个字符        |
| 数值范围错误     | 422  | {字段名}必须{大于/小于/等于}{N}      |
| 数据已存在       | 409  | {数据描述}已存在                     |
| 数据不存在       | 404  | {数据描述}不存在                     |
| 状态不允许操作   | 409  | {数据描述}已是{当前状态}，无法{操作} |
| 业务规则验证失败 | 422  | {具体规则描述}                       |

### 通用错误提示模板

```javascript
// 字段校验类
'名称不能为空'
'邮箱格式不正确'
'手机号格式不正确'
'密码长度不能少于6位'

// 数值校验类
'数量必须大于0'
'年龄必须大于等于18'
'金额不能为负数'

// 业务规则类
'结束日期不能早于开始日期'
'库存不能小于已销售数量'
'折扣不能超过100%'

// 状态类
'数据已被禁用，无法操作'
'数据正在审核中，无法修改'
'存在关联数据，无法删除'
```

## Mock API 实现模板

```javascript
/**
 * {模块名称} Mock 数据
 */

// 模拟网络延迟
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 成功响应
function success(data, msg = '操作成功') {
  return { code: 200, data, msg }
}

// 失败响应
function error(msg, code = 400) {
  return { code, data: null, msg }
}

export const xxxApi = {
  /**
   * 查询列表
   * @param {object} params - 查询参数
   * @returns {Promise} 响应结果
   */
  async getList(params) {
    await delay()
    // 实现逻辑
    return success({
      records: [],
      total: 0,
      page: params.page || 1,
      size: params.size || 10,
    })
  },

  /**
   * 新增数据
   * @param {object} data - 新增数据
   * @returns {Promise} 响应结果
   */
  async create(data) {
    await delay()
    // 参数校验
    if (!data.name) {
      return error('名称不能为空')
    }
    // 业务逻辑
    return success(newData, '新增成功')
  },

  /**
   * 编辑数据
   * @param {number} id - 数据ID
   * @param {object} data - 编辑数据
   * @returns {Promise} 响应结果
   */
  async update(id, data) {
    await delay()
    // 检查数据是否存在
    const exists = findById(id)
    if (!exists) {
      return error('数据不存在', 404)
    }
    // 更新逻辑
    return success(updatedData, '修改成功')
  },

  /**
   * 删除数据
   * @param {number} id - 数据ID
   * @returns {Promise} 响应结果
   */
  async remove(id) {
    await delay()
    // 检查数据是否存在
    const exists = findById(id)
    if (!exists) {
      return error('数据不存在', 404)
    }
    // 删除逻辑
    return success(null, '删除成功')
  },

  /**
   * 启用数据（可选）
   * @param {number} id - 数据ID
   * @returns {Promise} 响应结果
   */
  async on(id) {
    await delay()
    // 检查数据是否存在
    const exists = findById(id)
    if (!exists) {
      return error('数据不存在', 404)
    }
    // 检查状态
    if (exists.status === 1) {
      return error('数据已是启用状态', 409)
    }
    // 启用逻辑
    return success(updatedData, '启用成功')
  },

  /**
   * 禁用数据（可选）
   * @param {number} id - 数据ID
   * @returns {Promise} 响应结果
   */
  async off(id) {
    await delay()
    // 检查数据是否存在
    const exists = findById(id)
    if (!exists) {
      return error('数据不存在', 404)
    }
    // 检查状态
    if (exists.status === 0) {
      return error('数据已是禁用状态', 409)
    }
    // 禁用逻辑
    return success(updatedData, '禁用成功')
  },
}
```

## 验证检查清单

使用 Mock API 时，请确保：

- [ ] 所有接口返回统一格式：`{ code, data, msg }`
- [ ] 成功时 `code` 为 200，失败时为其他错误码
- [ ] 失败时 `data` 为 `null`
- [ ] 错误提示清晰明确
- [ ] 分页数据包含 `records`、`total`、`page`、`size`
- [ ] 日期时间使用 `YYYY-MM-DD HH:mm:ss` 格式
- [ ] 状态使用数字类型（1=启用，0=禁用）
