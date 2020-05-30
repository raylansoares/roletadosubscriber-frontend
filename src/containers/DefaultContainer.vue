<template>
  <div>
    <TopBar />
    <el-container><router-view /></el-container>
  </div>
</template>

<script>
import TopBar from "@/components/layout/TopBar";

export default {
  name: "DefaultContainer",

  components: {
    TopBar
  }
};
</script>

<style lang="scss">
.el-container {
  justify-content: center;
  main {
    max-width: 1280px;
  }
}
</style>
