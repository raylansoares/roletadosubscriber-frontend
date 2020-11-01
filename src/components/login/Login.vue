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
        <i class="el-icon-orange"></i>
      </div>

      <h1 class="title">
        Roleta do Subscriber
      </h1>

      <h2 class="subtitle">
        Roleta automática e personalizável para os subs do seu canal!
      </h2>

      <div class="links">
        <el-button
          type="primary"
          class="login-button"
          plain
          :disabled="loading"
          @click="connect"
        >
          <i class="el-icon-loading" v-if="loading"></i>
          {{ loading ? "Conectando..." : "Conectar conta da Twitch" }}
        </el-button>
      </div>
    </div>

    <div id="how-section">
      <h2 class="title">Como Funciona</h2>

      <p class="description">
        Sempre que seu canal receber uma nova inscrição, a roleta aparecerá 
        automaticamente e irá selecionar aleatoriamente um dos prêmios
        configurados por você. Em seguida o bot "<strong>RoseChatBot</strong>"
        anunciará o prêmio no chat. Veja o passo a passo:
      </p>

      <ul class="steps">
        <li class="step">
          <span class="step-number">1</span>
          <span class="step-content">
            Conecte sua conta da Twitch para acessar o painel.
          </span>
        </li>

        <li class="step">
          <span class="step-number">2</span>
          <span class="step-content">
            No painel, acesse a página de configurações clicando em
            <strong>"Configurar Roleta"</strong> no menu.
          </span>
        </li>

        <li class="step">
          <span class="step-number">3</span>
          <span class="step-content">
            Cadastre ou edite os prêmios que aparecerão na roleta.
          </span>
        </li>

        <li class="step">
          <span class="step-number">4</span>
          <span class="step-content">
            No bloco <strong>"URL da Roleta para o OBS"</strong>, clique no campo
            para exibir o endereço da roleta e em seguida copie o link exibido.
          </span>
        </li>

        <li class="step">
          <span class="step-number">5</span>
          <span class="step-content">
            No OBS, adicione uma nova fonte do tipo "Navegador/Browser" e cole
            o link da roleta.
          </span>
        </li>

        <li class="step">
          <span class="step-number">6</span>
          <span class="step-content">
            Pronto! Assim que receber uma nova inscrição no seu canal a roleta
            irá aparecer e selecionar um prêmio automaticamente.
          </span>
        </li>

        <p class="description last">
          Clicando no link <strong>Dashboard</strong> do painel, além de
          visualizar a o histórico de inscrições e seus respectivos prêmios,
          você também pode rodar a roleta manualmente para um usuário conforme
          indicado no primeiro bloco da página.
        </p>
      </ul>
    </div>

    <div id="faq-section">
      <h2 class="title">Dúvidas Frequentes</h2>

      <ul class="questions">
        <li class="question">
          <span class="question-content">
            Por que alguns comandos configurados nos prêmios não funcionam?
          </span>
          <span class="question-answer">
            O Bot necessita de algumas permissões especiais para determinados
            comandos, para o <strong>/timeout</strong> por exemplo, é preciso
            dar status de moderador para o bot. Para o comando
            <strong>/commercial</strong> o bot precisa ter permissão de editor.
          </span>
        </li>

        <li class="question">
          <span class="question-content">
            Por que os prêmios estão aparecendo 2x no chat?
          </span>
          <span class="question-answer">
            O link da roleta só pode estar ativo em um lugar, no OBS. Se os
            prêmios estão sendo anuncioados 2x no chat verifique se não deixou a
            roleta aberta em alguma aba do navegador. Lembrando que para utilizar
            a roleta em várias cenas diferentes no OBS é necessário copiar a
            primeira fonte cadastrada com o link da roleta e colar na nova cena a
            <strong>referência</strong> da fonte.
          </span>
        </li>

      </ul>
    </div>

    <div id="contact-section">
      <h2 class="title">Contato</h2>
      <p class="description">
        Ficou com alguma dúvida? Me chame no Discord:
        <strong>RaylanPrime#3896</strong>
      </p>
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
      try {
        const token = this.$route.hash
          .replace('#access_token=', '')
          .split('&scope=')[0]

        if (!token) {
          this.loading = false
          return
        }

        const url = '/api/auth'

        const authenticatedUser = await axios.post(url, {
          token: token, redirect: authConfig.redirect_uri
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
  text-align: center;
  .title {
    font-weight: 300;
    font-size: 48px;
    color: #9fa4ad;
    word-spacing: 5px;
    padding-bottom: 30px;
  }
  .description {
    color: #9fa4ad;
    max-width: 1024px;
    &.last {
      padding-top: 30px;
    }
  }
}

#how-section {
  background-color: #2d3748;
  .steps {
    max-width: 1024px;
    padding: 20px 0;
    list-style: none;
    .step {
      display: flex;
      align-items: center;
      padding: 5px 0;
      color: #c9ccd2;
      .step-number {
        font-size: 22px;
        padding: 0 10px;
        height: 35px;
        width: 35px;
        border: 1px solid #c9ccd2;
        background-color: #384456;
        border-radius: 100px;
        margin: 10px;
      }
      .step-content {
        text-align: left;
        font-size: 16px;
      }
    }
  }
}

#faq-section {
  background-color: #1a202c;
  background-image: url(/img/dots.b81dabc0.png);
  background-size: contain;
  .questions {
    max-width: 1024px;
    padding: 0 0 20px 0;
    list-style: none;
    .question {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0 20px 0;
      .question-content {
        color: #c9ccd2;
        font-size: 22px;
      }
      .question-answer {
        padding: 10px 0;
        font-size: 16px;
        color: #9fa4ad;
      }
    }
  }
}

#contact-section {
  background-color: #2d3748;
}
</style>
