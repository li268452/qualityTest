/**
 * 字典管理 Mock 数据
 * 模拟后端接口返回数据，后续对接真实后端时替换此文件即可
 */

let nextTypeId = 4
let nextItemId = 7

// 字典类型假数据
const dictTypes = [
  {
    id: 1,
    name: '用户状态',
    code: 'user_status',
    status: 1,
    remark: '用户账号状态',
    createdAt: '2026-04-01 10:00:00',
  },
  {
    id: 2,
    name: '订单状态',
    code: 'order_status',
    status: 1,
    remark: '订单流转状态',
    createdAt: '2026-04-01 10:05:00',
  },
  {
    id: 3,
    name: '支付方式',
    code: 'pay_method',
    status: 1,
    remark: '支付渠道类型',
    createdAt: '2026-04-02 09:00:00',
  },
]

// 字典数据假数据
const dictItems = [
  // user_status
  { id: 1, typeId: 1, typeCode: 'user_status', label: '正常', value: '1', sort: 1, remark: '' },
  { id: 2, typeId: 1, typeCode: 'user_status', label: '禁用', value: '0', sort: 2, remark: '' },
  // order_status
  { id: 3, typeId: 2, typeCode: 'order_status', label: '待支付', value: '0', sort: 1, remark: '' },
  { id: 4, typeId: 2, typeCode: 'order_status', label: '已支付', value: '1', sort: 2, remark: '' },
  { id: 5, typeId: 2, typeCode: 'order_status', label: '已取消', value: '2', sort: 3, remark: '' },
  // pay_method
  {
    id: 6,
    typeId: 3,
    typeCode: 'pay_method',
    label: '微信支付',
    value: 'wechat',
    sort: 1,
    remark: '',
  },
]

/**
 * 模拟网络延迟
 */
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 模拟 API 响应格式
 */
function successResponse(data, msg = '操作成功') {
  return { code: 200, data, msg }
}

function errorResponse(msg, code = 400) {
  return { code, data: null, msg }
}

/**
 * 字典类型 API Mock
 */
export const dictTypeApi = {
  // 分页查询字典类型
  async getList(params = {}) {
    await delay()
    let list = [...dictTypes]

    if (params.name) {
      list = list.filter(t => t.name.includes(params.name))
    }
    if (params.code) {
      list = list.filter(t => t.code.includes(params.code))
    }

    const page = params.page || 1
    const size = params.size || 10
    const start = (page - 1) * size
    const records = list.slice(start, start + size)

    return successResponse({
      records,
      total: list.length,
      page,
      size,
    })
  },

  // 新增字典类型
  async create(data) {
    await delay()
    if (!data.name) {
      return errorResponse('字典名称不能为空')
    }
    if (!data.code) {
      return errorResponse('字典编码不能为空')
    }
    if (dictTypes.some(t => t.code === data.code)) {
      return errorResponse('字典编码已存在')
    }

    const newType = {
      id: nextTypeId++,
      name: data.name,
      code: data.code,
      status: 1,
      remark: data.remark || '',
      createdAt: new Date().toLocaleString('zh-CN'),
    }
    dictTypes.push(newType)
    return successResponse(newType, '新增成功')
  },

  // 编辑字典类型
  async update(id, data) {
    await delay()
    const index = dictTypes.findIndex(t => t.id === id)
    if (index === -1) {
      return errorResponse('字典类型不存在', 404)
    }
    if (data.name !== undefined) dictTypes[index].name = data.name
    if (data.remark !== undefined) dictTypes[index].remark = data.remark
    if (data.status !== undefined) dictTypes[index].status = data.status
    return successResponse(dictTypes[index], '修改成功')
  },

  // 删除字典类型
  async remove(id) {
    await delay()
    const index = dictTypes.findIndex(t => t.id === id)
    if (index === -1) {
      return errorResponse('字典类型不存在', 404)
    }

    const type = dictTypes[index]

    // 级联删除字典数据
    for (let i = dictItems.length - 1; i >= 0; i--) {
      if (dictItems[i].typeId === id) {
        dictItems.splice(i, 1)
      }
    }
    dictTypes.splice(index, 1)
    return successResponse(null, '删除成功')
  },
}

/**
 * 字典数据 API Mock
 */
export const dictItemApi = {
  // 查询某类型下的字典数据
  async getList(typeCode) {
    await delay()
    const items = dictItems
      .filter(item => item.typeCode === typeCode)
      .sort((a, b) => a.sort - b.sort)
    return successResponse(items)
  },

  // 新增字典数据
  async create(typeCode, data) {
    await delay()
    if (!data.label) {
      return errorResponse('字典标签不能为空')
    }
    if (!data.value) {
      return errorResponse('字典值不能为空')
    }

    const typeItems = dictItems.filter(item => item.typeCode === typeCode)
    if (typeItems.some(item => item.value === data.value)) {
      return errorResponse('字典值已存在')
    }

    const type = dictTypes.find(t => t.code === typeCode)
    const newItem = {
      id: nextItemId++,
      typeId: type ? type.id : 0,
      typeCode,
      label: data.label,
      value: data.value,
      sort: data.sort || typeItems.length + 1,
      remark: data.remark || '',
    }
    dictItems.push(newItem)
    return successResponse(newItem, '新增成功')
  },

  // 编辑字典数据
  async update(id, data) {
    await delay()
    const index = dictItems.findIndex(item => item.id === id)
    if (index === -1) {
      return errorResponse('字典数据不存在', 404)
    }

    if (data.label !== undefined) dictItems[index].label = data.label
    if (data.value !== undefined) dictItems[index].value = data.value
    if (data.sort !== undefined) dictItems[index].sort = data.sort
    if (data.remark !== undefined) dictItems[index].remark = data.remark
    return successResponse(dictItems[index], '修改成功')
  },

  // 删除字典数据
  async remove(id) {
    await delay()
    const index = dictItems.findIndex(item => item.id === id)
    if (index === -1) {
      return errorResponse('字典数据不存在', 404)
    }
    dictItems.splice(index, 1)
    return successResponse(null, '删除成功')
  },
}

/**
 * 根据字典编码查询（供其他模块调用）
 */
export const dictQueryApi = {
  async getByCode(typeCode) {
    await delay()
    const type = dictTypes.find(t => t.code === typeCode)
    if (!type) {
      return errorResponse('字典类型不存在', 404)
    }
    if (type.status === 0) {
      return successResponse([])
    }
    const items = dictItems
      .filter(item => item.typeCode === typeCode)
      .sort((a, b) => a.sort - b.sort)
    return successResponse(items)
  },
}
