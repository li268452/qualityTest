<template>
  <div class="app-container">
    <nav class="nav-bar">
      <span class="nav-title">代码质量测试项目</span>
      <div class="nav-menu">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['nav-btn', { active: currentTab === tab.key }]"
          @click="currentTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>
    <div class="main-content">
      <DictManagement v-if="currentTab === 'dict'" />
      <CouponManagement v-if="currentTab === 'coupon'" />
    </div>
  </div>
</template>

<script>
import DictManagement from './modules/dict-management/DictManagement.vue'
import CouponManagement from './modules/coupon-management/CouponManagement.vue'

export default {
  name: 'App',
  components: {
    DictManagement,
    CouponManagement,
  },
  data() {
    return {
      currentTab: 'coupon',
      tabs: [
        { key: 'dict', label: '字典管理' },
        { key: 'coupon', label: '优惠券管理' },
      ],
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  gap: 20px;
}
.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.nav-menu {
  display: flex;
  gap: 4px;
}
.nav-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 4px;
}
.nav-btn:hover {
  background: #f0f0f0;
}
.nav-btn.active {
  background: #409eff;
  color: #fff;
}
.main-content {
  flex: 1;
  overflow: auto;
  background: #fff;
  margin: 16px;
  border-radius: 8px;
}
</style>
