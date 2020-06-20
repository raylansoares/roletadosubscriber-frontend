<template>
  <div>
    <ul id="topbar">
      <li><a href="#start-section">Início</a></li>
      <li><a href="#how-section">Como funciona</a></li>
      <li><a href="#faq-section">Dúvidas frequentes</a></li>
      <li><a href="#contact-section">Contato</a></li>
    </ul>

    <div id="start-section">
      <div class="logo">
        <i class="el-icon-stopwatch"></i>
      </div>

      <h1 class="title">
        Roleta do Subscriber
      </h1>

      <h2 class="subtitle">
        Roleta automática e personalizável para os subs do seu canal!
      </h2>

      <div class="links">
        <el-button type="primary" class="login-button" plain :disabled="loading" @click="connect">
          <i class="el-icon-loading" v-if="loading"></i>
          {{ loading ? "Conectando..." : "Conectar conta da Twitch" }}
        </el-button>
      </div>
    </div>

    <div id="how-section">
      <h2 class="title">Como Funciona</h2>
      <p class="description">Em breve...</p>
    </div>

    <div id="faq-section">
      <h2 class="title">Dúvidas Frequentes</h2>
      <p class="description">Em breve...</p>
    </div>

    <div id="contact-section">
      <h2 class="title">Contato</h2>
      <p class="description">Em breve...</p>
    </div>
  </div>
</template>

<script>
import { authConfig } from "@/utils/auth";
import axios from '@/repositories/clients/axios'
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale("pt-br");

export default {
  name: "Login",

  data: () => ({
    loading: true
  }),

  mounted() {
    this.makeAuth();
  },

  methods: {
    async makeAuth() {
      const code = this.$route.query.code

      if (!code) {
        this.loading = false
        return
      }

      const url = '/api/auth'

      try {
        const authenticatedUser = await axios.post(url, {
          code: code, redirect: authConfig.redirect_uri
        });
        
        this.$store.commit("SET_USER", authenticatedUser.data);
        this.$router.push({ name: "Dashboard" });
      } catch (e) {
        this.$message.error('Ops, não foi possível conectar sua conta');
      }

      this.loading = false
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

<style lang="scss" scoped>
#topbar {
  background-color: #1a202ce8;
  position: fixed;
  width: 100%;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  list-style: none;
  font-weight: lighter;
  li {
    padding: 0 30px;
    a {
      text-decoration: none;
      color: #ececec;
    }
  }
}

#start-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200px 0;
  background-color: #1a202c;
  background-image: url(/img/dots.b81dabc0.png);
  background-size: contain;

  .logo i {
    font-size: 98px;
    color: #b2b6bd;
  }

  .title {
    display: block;
    font-weight: 300;
    font-size: 62px;
    color: #b2b6bd;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 28px;
    color: #9fa4ad;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
    .login-button {
      padding: 15px 40px;
      font-size: 16px;
      font-weight: normal;
    }
  }
}

#how-section, #faq-section, #contact-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  .title {
    font-weight: 300;
    font-size: 48px;
    color: #9fa4ad;
    word-spacing: 5px;
    padding-bottom: 60px;
  }
  .description {
    color: #9fa4ad;
  }
}

#how-section {
  background-color: #2d3748;
}

#faq-section {
  background-color: #1a202c;
  background-image: url(/img/dots.b81dabc0.png);
  background-size: contain;
}

#contact-section {
  background-color: #2d3748;
}
</style>
