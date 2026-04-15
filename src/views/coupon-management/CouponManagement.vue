<template>
  <div class="coupon-management">
    <div class="page-header">
      <h2>优惠券管理</h2>
      <div class="header-actions">
        <input
          v-model="searchName"
          placeholder="搜索优惠券名称"
          class="search-input"
          @input="handleSearch"
        />
        <select v-model="searchStatus" class="status-select" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="1">已启用</option>
          <option value="0">已关闭</option>
        </select>
        <button class="btn btn-primary" @click="handleAdd">新增优惠券</button>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>优惠券名称</th>
          <th>类型</th>
          <th>面额(元)</th>
          <th>使用门槛(元)</th>
          <th>有效期</th>
          <th>状态</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="9" class="empty-text">加载中...</td>
        </tr>
        <tr v-else-if="list.length === 0">
          <td colspan="9" class="empty-text">暂无数据</td>
        </tr>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>
            <span class="type-tag">{{ item.typeName || '-' }}</span>
          </td>
          <td>{{ item.amount }}</td>
          <td>{{ item.threshold }}</td>
          <td>{{ item.startDate }} ~ {{ item.endDate }}</td>
          <td>
            <span :class="['status-tag', item.status === 1 ? 'status-on' : 'status-off']">
              {{ item.status === 1 ? '已启用' : '已关闭' }}
            </span>
          </td>
          <td>{{ item.remark || '-' }}</td>
          <td class="action-cell">
            <button class="btn-link" @click="handleEdit(item)">编辑</button>
            <button
              v-if="item.status === 1"
              class="btn-link btn-warning"
              @click="handleToggleStatus(item, 0)"
            >
              关闭
            </button>
            <button v-else class="btn-link btn-success" @click="handleToggleStatus(item, 1)">
              启用
            </button>
            <button class="btn-link btn-danger" @click="handleDelete(item)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="total > pageSize" class="pagination">
      <span class="page-info">共 {{ total }} 条</span>
      <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        上一页
      </button>
      <span class="page-num">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
    </div>

    <CouponForm
      :visible="formVisible"
      :edit-data="editTarget"
      @close="formVisible = false"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script>
import { couponApi } from '@/api/mock/coupon-management/couponMock.js'
import CouponForm from './CouponForm.vue'

export default {
  name: 'CouponManagement',
  components: { CouponForm },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      searchName: '',
      searchStatus: '',
      formVisible: false,
      editTarget: null,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const res = await couponApi.getList({
        name: this.searchName,
        status: this.searchStatus,
        page: this.currentPage,
        size: this.pageSize,
      })
      if (res.code === 200) {
        this.list = res.data.records
        this.total = res.data.total
      }
      this.loading = false
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchList()
    },
    changePage(page) {
      this.currentPage = page
      this.fetchList()
    },
    handleAdd() {
      this.editTarget = null
      this.formVisible = true
    },
    handleEdit(item) {
      this.editTarget = { ...item }
      this.formVisible = true
    },
    async handleFormSubmit(data) {
      if (this.editTarget) {
        const res = await couponApi.update(this.editTarget.id, data)
        if (res.code === 200) {
          this.formVisible = false
          this.fetchList()
        } else {
          alert(res.msg)
        }
      } else {
        const res = await couponApi.create(data)
        if (res.code === 200) {
          this.formVisible = false
          this.fetchList()
        } else {
          alert(res.msg)
        }
      }
    },
    async handleToggleStatus(item, status) {
      const action = status === 1 ? '启用' : '关闭'
      if (!confirm(`确定${action}「${item.name}」吗？`)) return

      const res = status === 1 ? await couponApi.on(item.id) : await couponApi.off(item.id)
      if (res.code === 200) {
        this.fetchList()
      } else {
        alert(res.msg)
      }
    },
    async handleDelete(item) {
      if (!confirm(`确定删除「${item.name}」吗？此操作不可恢复。`)) return

      const res = await couponApi.remove(item.id)
      if (res.code === 200) {
        this.fetchList()
      } else {
        alert(res.msg)
      }
    },
  },
}
</script>

<style scoped>
.coupon-management {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
}
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-input {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}
.status-select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.data-table th,
.data-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
}
.data-table th {
  background: #fafafa;
  color: #666;
  font-weight: 500;
}
.data-table tr:hover {
  background: #f5f7fa;
}
.empty-text {
  text-align: center;
  color: #999;
  padding: 40px 0 !important;
}
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #ecf5ff;
  color: #409eff;
}
.status-on {
  background: #e1f3d8;
  color: #67c23a;
}
.status-off {
  background: #fde2e2;
  color: #f56c6c;
}
.action-cell {
  white-space: nowrap;
}
.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  color: #409eff;
}
.btn-link:hover {
  text-decoration: underline;
}
.btn-warning {
  color: #e6a23c;
}
.btn-success {
  color: #67c23a;
}
.btn-danger {
  color: #f56c6c;
}
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.btn-primary:hover {
  background: #66b1ff;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}
.page-btn {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}
.page-btn:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
