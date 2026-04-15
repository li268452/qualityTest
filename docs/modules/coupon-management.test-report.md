
========================================
  coupon-management - AI 流程驱动测试报告
========================================

**测试时间**：2026/4/15 16:58:56
**模块**：coupon-management
**执行时长**：25ms

### 接口映射验证

| 组件调用方法 | Mock 实现方法 | 验证结果 |
|-------------|--------------|:--------:|
| couponApi.getList() | getList | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |
| couponApi.create() | create | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |
| couponApi.update() | update | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |
| couponApi.remove() | remove | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |
| couponApi.on() | on | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |
| couponApi.off() | off | ❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

### 流程执行结果

| 流程 | 步骤数 | 通过 | 失败 | 结果 |
|------|:------:|:----:|:----:|:----:|
| 新增优惠券 | 1 | 0 | 1 | ❌ 失败 |
| 启用优惠券 | 1 | 0 | 1 | ❌ 失败 |
| 流程1：完整生命周期（增删改查） | 1 | 0 | 1 | ❌ 失败 |
| 流程2：启用/关闭流程 | 1 | 0 | 1 | ❌ 失败 |
| 流程3：异常拦截 | 1 | 0 | 1 | ❌ 失败 |
| 流程4：分页查询 | 1 | 0 | 1 | ❌ 失败 |
| 流程5：跨模块完整流程（字典 → 优惠券 | 1 | 0 | 1 | ❌ 失败 |

### 详细步骤结果

#### 新增优惠券

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 新增 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 启用优惠券

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 启用 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 流程1：完整生命周期（增删改查）

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 新增 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 流程2：启用/关闭流程

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 关闭 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 流程3：异常拦截

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 新增 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 流程4：分页查询

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 查询 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

#### 流程5：跨模块完整流程（字典 → 优惠券）

| 步骤 | 操作 | 结果 | 备注 |
|------|------|:----:|------|
| 1 | 切换 | 失败 | 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs) |

**最终验证**：❌ 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)

### 总结

- 流程通过率：0/7（0%）
- 步骤通过率：0/7（0%）
- 接口映射问题：6个
- 失败步骤：
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
  - 流程"undefined" 步骤1: 加载API失败: 找不到 Mock API 模块: coupon-management (尝试的路径: D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\couponMock.mjs, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.js, D:\代码质量测试功能\质量测试项目\src\modules\coupon-management\mock\coupon-managementMock.mjs)
- 整体评估：❌ 需修复
