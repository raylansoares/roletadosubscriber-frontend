<template>
  <div class="main-container">
    <WheelConfig />
  </div>
</template>

<script>
import WheelConfig from '@/components/wheel/WheelConfig'

export default {
  name: 'MainView',
  components: {
    WheelConfig
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
