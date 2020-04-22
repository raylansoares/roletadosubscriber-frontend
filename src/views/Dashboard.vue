<template>
  <div class="main-container">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from '@/components/dashboard/Dashboard'

export default {
  name: 'MainView',
  components: {
    Dashboard
  }
}
</script>

<style lang="scss">
  .main-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;
  }
</style>
