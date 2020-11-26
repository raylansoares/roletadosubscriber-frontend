<template>
  <div id="container">
    <TopBar @set-theme="setTheme($event)" />
    <router-view />
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import TopBar from "@/components/layout/TopBar";

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
    setTheme(theme) {
      this.$store.commit("SET_THEME", theme);
    },

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
            message: 'Sua sessão expirou, faça login novamente para continuar.',
            type: 'error',
            duration: 0,
            showClose: true
          });
        }
      }, 3600000);
    }
  }
};
</script>

<style lang="scss">
#container {
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent !important;
}
</style>
