<template>
  <div>
    <TopBar />
    <el-container><router-view /></el-container>
  </div>
</template>

<script>
import TopBar from "@/components/layout/TopBar";
import { mapState } from 'vuex'

export default {
  name: "DefaultContainer",

  components: {
    TopBar
  },

  computed: {
    ...mapState(['user'])
  },

  sockets: {
    updateToken(data) {
      if (data.code !== this.user.code) return
      this.$store.commit("SET_USER", data);
    }
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
