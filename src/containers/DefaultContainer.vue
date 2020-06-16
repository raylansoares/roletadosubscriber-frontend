<template>
  <div class="container">
    <TopBar />
    <el-container><router-view /></el-container>
  </div>
</template>

<script>
import TopBar from "@/components/layout/TopBar";
import { mapState } from 'vuex'
import { isAuthenticated } from "../utils/auth";

export default {
  name: "DefaultContainer",

  components: {
    TopBar
  },

  computed: {
    ...mapState(['user'])
  },

  mounted () {
    this.checkAuth()
  },

  methods: {
    checkAuth() {
      setInterval(() => {
        const validToken = isAuthenticated()
        console.log(validToken)
      }, 300000);
    }
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
