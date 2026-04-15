<template>
  <div class="dict-data-list">
    <div v-if="currentType" class="data-header">
      <div class="header-info">
        <h3>{{ currentType.name }}</h3>
        <span class="type-code">{{ currentType.code }}</span>
      </div>
      <button class="btn btn-primary" @click="$emit('add-data', currentType)">新增字典数据</button>
    </div>

    <div v-if="currentType" class="data-table">
      <table>
        <thead>
          <tr>
            <th>字典标签</th>
            <th>字典值</th>
            <th>排序</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.label }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.sort }}</td>
            <td>{{ item.remark || '-' }}</td>
            <td class="action-cell">
              <button class="btn-link" @click="$emit('edit-data', item, currentType)">编辑</button>
              <button class="btn-link danger" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="empty-tip">暂无字典数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <p>请从左侧选择一个字典类型</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DictDataList',
  props: {
    currentType: {
      type: Object,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['add-data', 'edit-data', 'delete-data'],
  methods: {
    handleDelete(item) {
      if (confirm(`确定删除字典数据「${item.label}」吗？`)) {
        this.$emit('delete-data', item)
      }
    },
  },
}
</script>

<style scoped>
.dict-data-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.header-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
}

.type-code {
  font-size: 12px;
  color: #999;
}

.data-table {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead th {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 2px solid #f0f0f0;
  color: #666;
  font-weight: 500;
}

tbody td {
  padding: 10px 8px;
  border-bottom: 1px solid #f5f5f5;
}

.action-cell {
  display: flex;
  gap: 8px;
}

.btn-link {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}

.btn-link:hover {
  color: #40a9ff;
}

.btn-link.danger {
  color: #ff4d4f;
}

.btn-link.danger:hover {
  color: #ff7875;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: #999;
  font-size: 14px;
}

.btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-primary {
  color: #fff;
  background-color: #1890ff;
}

.btn-primary:hover {
  background-color: #40a9ff;
}
</style>
