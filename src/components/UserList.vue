<template>
  <div class="user-list">
    <h1>用户列表</h1>

    <!-- 问题：v-for 没有 key -->
    <div v-for="user in users" :key="user.id" class="user-item">
      <span>{{ user.name }}</span>
      <span>{{ user.email }}</span>
    </div>

    <!-- 问题：v-html 存在 XSS 风险 -->
    <div v-html="userContent"></div>

    <!-- 正确示例 -->
    <div v-for="user in validUsers" :key="user.id" class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button @click="handleDelete(user.id)">删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      userContent: '<scr' + 'ipt>alert("XSS")</scr' + 'ipt>',
      loading: false,
      error: null,
    }
  },
  computed: {
    validUsers() {
      return this.users.filter(user => user && user.id)
    },
  },
  mounted() {
    // 问题：没有错误处理
    this.fetchUsers()
  },
  methods: {
    // 问题：没有 async/await 错误处理
    async fetchUsers() {
      this.loading = true
      const response = await fetch('/api/users')
      const data = await response.json()
      this.users = data
      this.loading = false
    },
    handleDelete(userId) {
      // 问题：使用 == 而不是 ===
      if (userId === null) {
        console.warn('Invalid user ID')
        return
      }
      // 问题：没有确认对话框
      this.deleteUser(userId)
    },
    async deleteUser(userId) {
      // 问题：没有错误处理
      await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      this.users = this.users.filter(u => u.id !== userId)
    },
  },
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.user-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.user-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
<!-- test -->
<!-- test -->
