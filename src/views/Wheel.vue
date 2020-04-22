<template>
  <div class="wheel-container">
    <Wheel />
  </div>
</template>

<script>
import Wheel from '@/components/wheel/Wheel'

export default {
  name: 'WheelView',
  components: {
    Wheel
  }
}
</script>

<style lang="scss">
  .wheel-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;
  }
</style>
