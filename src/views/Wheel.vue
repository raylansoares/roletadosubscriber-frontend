<template>
  <el-main class="wheel-main">
    <Wheel />
  </el-main>
</template>

<script>
import Wheel from "@/components/wheel/Wheel";

export default {
  name: "WheelView",

  components: {
    Wheel
  }
};
</script>

<style lang="scss">
  .wheel-main {
    padding: 0!important;
  }
</style>
