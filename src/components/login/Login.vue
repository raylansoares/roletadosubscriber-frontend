<template>
  <div>
    <h1 class="logo">
      <i class="el-icon-stopwatch"></i>
    </h1>
    <h1 class="title">
      Twitch Wheel
    </h1>
    <h2 class="subtitle">
      A simple service for Twitch interactions
    </h2>
    <div class="links">
      <el-button type="primary" plain :disabled="loading" @click="connect">
        Connect with Twitch
      </el-button>
    </div>
  </div>
</template>

<script>
import { authConfig } from "@/utils/auth";
import dayjs from "dayjs";

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
      const hash = document.location.hash;
      const hashArray = hash.split("&");
      const tokenKey = hashArray[0];
      const accessToken = tokenKey.replace("#access_token=", "");

      if (!accessToken) return;

      // const authenticatedUser = await this.$axios.$post("/api/v1/users", {
      //   access_token: accessToken
      // });

      // this.$store.commit("SET_USER", authenticatedUser);

      this.$store.commit("SET_USER", {
        user: "Admin",
        email: "admin@admin.com",
        token: accessToken,
        expires: dayjs().add(12, "hour")
      });

      this.$router.push({ name: "Dashboard" });
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
