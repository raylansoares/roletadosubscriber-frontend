<template>
  <div class="page-container md-layout-column">
    <TopBar />
    <md-content class="container-content">
      <router-view />
    </md-content>
  </div>
</template>

<script>
import TopBar from '@/components/layout/TopBar'

export default {
  name: 'Temporary',
  components: {
    TopBar
  }
}
</script>

<style lang="scss">
  .container-content {
    padding: 20px;
  }
  .page-container {
    height: 100vh;
  }
</style>
