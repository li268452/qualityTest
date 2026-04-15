/**
 * 字典管理 Mock 数据
 * 模拟后端接口返回数据，后续对接真实后端时替换此文件即可
 */

let nextTypeId = 5
let nextItemId = 11

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
  {
    id: 4,
    name: '优惠券类型',
    code: 'coupon_type',
    status: 1,
    remark: '优惠券分类',
    createdAt: '2026-04-10 10:00:00',
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
  {
    id: 7,
    typeId: 3,
    typeCode: 'pay_method',
    label: '支付宝',
    value: 'alipay',
    sort: 2,
    remark: '',
  },
  // coupon_type
  {
    id: 8,
    typeId: 4,
    typeCode: 'coupon_type',
    label: '满减券',
    value: 'full_reduction',
    sort: 1,
    remark: '满X元减Y元',
  },
  {
    id: 9,
    typeId: 4,
    typeCode: 'coupon_type',
    label: '折扣券',
    value: 'discount',
    sort: 2,
    remark: '打X折',
  },
  {
    id: 10,
    typeId: 4,
    typeCode: 'coupon_type',
    label: '无门槛券',
    value: 'no_threshold',
    sort: 3,
    remark: '直接抵扣',
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
 * 字典管理 API Mock（统一接口）
 */
export const dictApi = {
  /**
   * 查询列表
   * @param {string|object} typeCode - 类型编码或查询参数
   * @returns {Promise} 列表数据
   */
  async getList(typeCode) {
    await delay()

    // 如果 typeCode 是对象，说明是查询字典类型列表
    if (typeof typeCode === 'object' && typeCode !== null) {
      const params = typeCode
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
    }

    // 如果有 typeCode，查询该类型下的字典数据
    if (typeCode && typeof typeCode === 'string') {
      const items = dictItems
        .filter(item => item.typeCode === typeCode)
        .sort((a, b) => a.sort - b.sort)
      return successResponse(items)
    }

    // 默认返回字典类型列表（分页）
    const page = 1
    const size = 10
    const start = (page - 1) * size
    const records = dictTypes.slice(start, start + size)

    return successResponse({
      records,
      total: dictTypes.length,
      page,
      size,
    })
  },

  /**
   * 创建
   * @param {string|object} typeCode - 类型编码或字典类型数据
   * @param {object} data - 字典数据
   * @returns {Promise} 创建结果
   */
  async create(typeCode, data) {
    await delay()

    // 判断是创建字典类型还是字典数据
    // 情况1: typeCode 是对象且包含 code 字段，或 typeCode 缺失 -> 创建字典类型
    // 情况2: typeCode 是字符串且没有 code 字段，且有 data 参数 -> 创建字典数据
    const isDictType =
      (!typeCode && !data) || (typeCode && typeof typeCode === 'object' && typeCode.code)

    if (isDictType) {
      // 创建字典类型
      const params = typeCode && typeof typeCode === 'object' ? typeCode : data

      if (!params || !params.name) {
        return errorResponse('字典名称不能为空')
      }
      if (!params.code) {
        return errorResponse('字典编码不能为空')
      }
      if (dictTypes.some(t => t.code === params.code)) {
        return errorResponse('字典编码已存在')
      }

      const newType = {
        id: nextTypeId++,
        name: params.name,
        code: params.code,
        status: 1,
        remark: params.remark || '',
        createdAt: new Date().toLocaleString('zh-CN'),
      }
      dictTypes.push(newType)
      return successResponse(newType, '新增成功')
    }

    // 创建字典数据
    if (!data || !data.label) {
      return errorResponse('字典标签不能为空')
    }
    if (!data.value) {
      return errorResponse('字典值不能为空')
    }

    const typeItems = dictItems.filter(item => item.typeCode === typeCode)
    if (typeItems.some(item => String(item.value) === String(data.value))) {
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

  /**
   * 更新
   * @param {number} id - ID
   * @param {object} data - 数据
   * @returns {Promise} 更新结果
   */
  async update(id, data) {
    await delay()

    // 先尝试查找字典类型
    const typeIndex = dictTypes.findIndex(t => t.id === id)
    if (typeIndex !== -1) {
      // 更新字典类型
      if (data.name !== undefined) dictTypes[typeIndex].name = data.name
      if (data.remark !== undefined) dictTypes[typeIndex].remark = data.remark
      if (data.status !== undefined) dictTypes[typeIndex].status = data.status
      return successResponse(dictTypes[typeIndex], '修改成功')
    }

    // 查找字典数据
    const itemIndex = dictItems.findIndex(item => item.id === id)
    if (itemIndex !== -1) {
      // 更新字典数据
      if (data.label !== undefined) dictItems[itemIndex].label = data.label
      if (data.value !== undefined) dictItems[itemIndex].value = data.value
      if (data.sort !== undefined) dictItems[itemIndex].sort = data.sort
      if (data.remark !== undefined) dictItems[itemIndex].remark = data.remark
      return successResponse(dictItems[itemIndex], '修改成功')
    }

    return errorResponse('数据不存在', 404)
  },

  /**
   * 删除
   * @param {number} id - ID
   * @returns {Promise} 删除结果
   */
  async remove(id) {
    await delay()

    // 先尝试查找字典类型
    const typeIndex = dictTypes.findIndex(t => t.id === id)
    if (typeIndex !== -1) {
      // 删除字典类型（级联删除字典数据）
      for (let i = dictItems.length - 1; i >= 0; i--) {
        if (dictItems[i].typeId === id) {
          dictItems.splice(i, 1)
        }
      }
      dictTypes.splice(typeIndex, 1)
      return successResponse(null, '删除成功')
    }

    // 查找字典数据
    const itemIndex = dictItems.findIndex(item => item.id === id)
    if (itemIndex !== -1) {
      dictItems.splice(itemIndex, 1)
      return successResponse(null, '删除成功')
    }

    return errorResponse('数据不存在', 404)
  },

  /**
   * 启用
   * @param {number} id - 字典类型 ID
   * @returns {Promise} 操作结果
   */
  async on(id) {
    await delay()
    const index = dictTypes.findIndex(t => t.id === id)
    if (index === -1) {
      return errorResponse('字典类型不存在', 404)
    }
    dictTypes[index].status = 1
    return successResponse(dictTypes[index], '启用成功')
  },

  /**
   * 关闭
   * @param {number} id - 字典类型 ID
   * @returns {Promise} 操作结果
   */
  async off(id) {
    await delay()
    const index = dictTypes.findIndex(t => t.id === id)
    if (index === -1) {
      return errorResponse('字典类型不存在', 404)
    }
    dictTypes[index].status = 0
    return successResponse(dictTypes[index], '关闭成功')
  },

  /**
   * 根据编码查询（供其他模块调用）
   * @param {string} typeCode - 类型编码
   * @returns {Promise} 字典数据列表
   */
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
