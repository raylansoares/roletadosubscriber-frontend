<template>
  <div class="container">
    <TopBar />
    <el-container><router-view /></el-container>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import TopBar from "@/components/layout/TopBar";
import { mapState } from 'vuex'
import { isAuthenticated } from "../utils/auth";

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
