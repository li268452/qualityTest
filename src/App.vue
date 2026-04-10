<template>
  <div class="app-container">
    <DictManagement />
  </div>
</template>

<script>
import DictManagement from './modules/dict-management/DictManagement.vue'

export default {
  name: 'App',
  components: {
    DictManagement,
  },
}
</script>

<style>
.app-container {
  height: 100vh;
  background-color: #fff;
}
</style>
