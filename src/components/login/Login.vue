<template>
  <div>
    <h1 class="logo">
      <i class="el-icon-stopwatch"></i>
    </h1>
    <h1 class="title">
      Roleta do Subscriber
    </h1>
    <h2 class="subtitle">
      Roleta automatica e personalizável para os subs do seu canal!
    </h2>
    <div class="links">
      <el-button type="primary" plain :disabled="loading" @click="connect">
        Conectar conta da Twitch
      </el-button>
    </div>
  </div>
</template>

<script>
import { authConfig } from "@/utils/auth";
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale("pt-br");

export default {
  name: "Login",

  data: () => ({
    loading: false
  }),

  mounted() {
    this.makeAuth();
  },

  methods: {
    async makeAuth() {
      const code = this.$route.query.code

      if (!code) return

      try {
        const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/auth`
        const authenticatedUser = await axios.post(url, { code: code, redirect: authConfig.redirect_uri });

        this.$store.commit("SET_USER", authenticatedUser.data);
        this.$router.push({ name: "Dashboard" });
      } catch (e) {
        console.log(e)
      }
    },

    connect() {
      this.loading = true;
      window.location = this.getAuthUrl();
    },

    getAuthUrl() {
      let url = authConfig.authUrl;

      url += "?client_id=" + authConfig.client_id;
      url += "&redirect_uri=" + authConfig.redirect_uri;
      url += "&response_type=" + authConfig.response_type;
      url += "&scope=" + authConfig.scopes;

      return url;
    }
  }
};
</script>

<style lang="scss">
.logo i {
  font-size: 98px;
  color: #35495e;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 72px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 32px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
