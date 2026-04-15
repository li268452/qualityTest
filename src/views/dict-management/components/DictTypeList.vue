<template>
  <div class="dict-type-list">
    <div class="header">
      <h3>字典类型</h3>
      <button class="btn btn-primary" @click="$emit('add-type')">新增类型</button>
    </div>

    <div class="search-bar">
      <input
        v-model="searchName"
        type="text"
        placeholder="搜索名称/编码"
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <div class="type-list">
      <div
        v-for="item in filteredList"
        :key="item.id"
        :class="['type-item', { active: selectedId === item.id }]"
        @click="$emit('select', item)"
      >
        <div class="type-info">
          <span class="type-name">{{ item.name }}</span>
          <span class="type-code">{{ item.code }}</span>
        </div>
        <div class="type-status">
          <span :class="['status-tag', item.status === 1 ? 'enabled' : 'disabled']">
            {{ item.status === 1 ? '启用' : '禁用' }}
          </span>
        </div>
      </div>

      <div v-if="filteredList.length === 0" class="empty-tip">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DictTypeList',
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    selectedId: {
      type: Number,
      default: null,
    },
  },
  emits: ['select', 'add-type'],
  data() {
    return {
      searchName: '',
    }
  },
  computed: {
    filteredList() {
      if (!this.searchName) {
        return this.types
      }
      const keyword = this.searchName.toLowerCase()
      return this.types.filter(
        item =>
          item.name.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword)
      )
    },
  },
  methods: {
    handleSearch() {
      // 输入时自动过滤，无需额外操作
    },
  },
}
</script>

<style scoped>
.dict-type-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.header h3 {
  margin: 0;
  font-size: 16px;
}

.search-bar {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
}

.type-list {
  flex: 1;
  overflow-y: auto;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.type-item:hover {
  background-color: #f0f7ff;
}

.type-item.active {
  background-color: #e6f4ff;
  border-left: 3px solid #1890ff;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.type-name {
  font-size: 14px;
  font-weight: 500;
}

.type-code {
  font-size: 12px;
  color: #999;
}

.status-tag {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
}

.status-tag.enabled {
  color: #52c41a;
  background-color: #f6ffed;
}

.status-tag.disabled {
  color: #999;
  background-color: #f5f5f5;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
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
