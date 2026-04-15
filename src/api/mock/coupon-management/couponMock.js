/**
 * 优惠券管理 Mock 数据
 * 模拟后端接口返回数据，后续对接真实后端时替换此文件即可
 */

let nextId = 5

// 优惠券假数据
const coupons = [
  {
    id: 1,
    name: '新人满减券',
    typeCode: 'full_reduction',
    typeName: '满减券',
    amount: 20,
    threshold: 100,
    status: 1, // 1=已启用 0=已关闭
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    remark: '新用户注册专属',
    createdAt: '2026-04-01 10:00:00',
  },
  {
    id: 2,
    name: '限时折扣券',
    typeCode: 'discount',
    typeName: '折扣券',
    amount: 50,
    threshold: 200,
    status: 1,
    startDate: '2026-04-05',
    endDate: '2026-04-15',
    remark: '限时活动',
    createdAt: '2026-04-03 14:00:00',
  },
  {
    id: 3,
    name: '节日优惠券',
    typeCode: 'full_reduction',
    typeName: '满减券',
    amount: 30,
    threshold: 150,
    status: 0, // 已关闭
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    remark: '春节活动已结束',
    createdAt: '2026-02-25 09:00:00',
  },
  {
    id: 4,
    name: '会员专属券',
    typeCode: 'no_threshold',
    typeName: '无门槛券',
    amount: 100,
    threshold: 500,
    status: 1,
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    remark: 'VIP会员专享',
    createdAt: '2026-03-28 16:00:00',
  },
]

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function success(data, msg = '操作成功') {
  return { code: 200, data, msg }
}

function error(msg, code = 400) {
  return { code, data: null, msg }
}

export const couponApi = {
  // 分页查询优惠券列表
  async getList(params = {}) {
    await delay()
    let list = [...coupons]

    if (params.name) {
      list = list.filter(c => c.name.includes(params.name))
    }
    if (params.status !== undefined && params.status !== '') {
      list = list.filter(c => c.status === Number(params.status))
    }

    const page = params.page || 1
    const size = params.size || 10
    const start = (page - 1) * size
    const records = list.slice(start, start + size)

    return success({
      records,
      total: list.length,
      page,
      size,
    })
  },

  // 新增优惠券
  async create(data) {
    await delay()
    if (!data.name) {
      return error('优惠券名称不能为空')
    }
    if (!data.amount || data.amount <= 0) {
      return error('面额必须大于0')
    }
    if (data.threshold !== undefined && data.threshold < data.amount) {
      return error('使用门槛不能小于面额')
    }

    const newCoupon = {
      id: nextId++,
      name: data.name,
      typeCode: data.typeCode || '',
      typeName: data.typeName || '',
      amount: data.amount,
      threshold: data.threshold || 0,
      status: 1,
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      remark: data.remark || '',
      createdAt: new Date().toLocaleString('zh-CN'),
    }
    coupons.push(newCoupon)
    return success(newCoupon, '新增成功')
  },

  // 编辑优惠券
  async update(id, data) {
    await delay()
    const index = coupons.findIndex(c => c.id === id)
    if (index === -1) {
      return error('优惠券不存在', 404)
    }

    if (data.name !== undefined) coupons[index].name = data.name
    if (data.typeCode !== undefined) coupons[index].typeCode = data.typeCode
    if (data.typeName !== undefined) coupons[index].typeName = data.typeName
    if (data.amount !== undefined) coupons[index].amount = data.amount
    if (data.threshold !== undefined) coupons[index].threshold = data.threshold
    if (data.startDate !== undefined) coupons[index].startDate = data.startDate
    if (data.endDate !== undefined) coupons[index].endDate = data.endDate
    if (data.remark !== undefined) coupons[index].remark = data.remark
    return success(coupons[index], '修改成功')
  },

  // 删除优惠券
  async remove(id) {
    await delay()
    const index = coupons.findIndex(c => c.id === id)
    if (index === -1) {
      return error('优惠券不存在', 404)
    }
    coupons.splice(index, 1)
    return success(null, '删除成功')
  },

  // 启用优惠券
  async on(id) {
    await delay()
    const coupon = coupons.find(c => c.id === id)
    if (!coupon) {
      return error('优惠券不存在', 404)
    }
    coupon.status = 1
    return success(coupon, '启用成功')
  },

  // 关闭优惠券
  async off(id) {
    await delay()
    const coupon = coupons.find(c => c.id === id)
    if (!coupon) {
      return error('优惠券不存在', 404)
    }
    coupon.status = 0
    return success(coupon, '关闭成功')
  },
}
