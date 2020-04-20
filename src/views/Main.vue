<template>
  <div class="main-container">
    <Wheel />
  </div>
</template>

<script>
import Wheel from '@/components/wheel/Wheel'

export default {
  name: 'MainView',
  components: {
    Wheel
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
