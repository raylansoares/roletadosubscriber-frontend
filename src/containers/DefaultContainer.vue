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
  },

  computed: {
    ...mapState(['user'])
  },

  mounted () {
    this.checkAuth()
  },

  methods: {
    checkAuth() {
      setInterval(async () => {
        if (!this.user) return

        const userCode = this.user.code;
        const userAccessToken = this.user.access_token;
        const url = '/api/auth/refresh';

        try {
          const response = await axios.get(url, { headers: { 
            'x-auth-token': userAccessToken,
            'x-code': userCode
          } });
          this.$store.commit("SET_USER", response.data);
        } catch (e) {
          this.$store.commit("SET_USER", null);
          this.$router.push({ name: "Login" });
          this.$message({
            message: 'Ops, sua sessão expirou. Faça login novamente para continuar.',
            type: 'error',
            duration: 0,
            showClose: true
          });
        }
      }, 3600);
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
