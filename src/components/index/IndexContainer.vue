<template>
  <div id="index-container">
    <div id="theme-container">
      <a @click="setTheme('light')" :class="theme === 'light' ? 'active' : ''">
        <i class="material-icons">wb_sunny</i>
      </a>
      <a @click="setTheme('dark')" :class="theme === 'dark' ? 'active' : ''">
        <i class="material-icons">brightness_3</i>
      </a>
    </div>
    <div id="content-container">
      <div id="start-container" :class="theme">
        <div id="start-container-inner">
          <div id="image-container">
            <img src="../../assets/images/wheel.svg" alt="Roleta do Subscriber">
          </div>
          <div id="text-container">
            <div id="title-container">
              <h1 :class="theme">Roleta do Subscriber</h1>
              <p :class="theme">
                Roleta automática e personalizável para subscribers e recompensas
                de pontos de canal da Twitch.
              </p>
            </div>
            <div id="buttons-container">
              <button id="how-button" @click="scrollMeTo('how-container')">
                <i class="material-icons">info</i>
                <span>Como Funciona?</span>
              </button>
              <button id="login-button" @click="connect()" :disabled="loading">
                <i class="material-icons">login</i>
                <span>{{ loading ? "Entrando..." : "Entrar com Twitch" }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="how-container" ref="how-container" :class="theme">
        <div id="how-container-inner">
          <h2 class="title" :class="theme">Como Funciona?</h2>

          <p class="description" :class="theme">
            Sempre que alguém se inscrever no seu canal, a roleta vai aparecer 
            automaticamente e selecionar aleatoriamente um dos prêmios
            configurados por você. Além de aparecer na tela, o bot
            "<strong>RoletaDoSubscriber</strong>" anunciará o prêmio no chat.
          </p>

          <p class="description" :class="theme">
            Siga o passo a passo abaixo para adicionar a roleta ao seu canal:
          </p>

          <ul class="steps" :class="theme">
            <li class="step">
              <span class="step-number" :class="theme">01 -></span>
              <span>
                Conecte sua conta da Twitch para acessar o painel.
              </span>
            </li>

            <li class="step">
              <span class="step-number" :class="theme">02 -></span>
              <span>
                No painel, acesse a página de configurações clicando em
                <strong>"Configurar Roleta"</strong> no menu.
              </span>
            </li>

            <li class="step">
              <span class="step-number" :class="theme">03 -></span>
              <span>
                Cadastre ou edite os prêmios que aparecerão na roleta.
              </span>
            </li>

            <li class="step">
              <span class="step-number" :class="theme">04 -></span>
              <span>
                Copie o link exibido em <strong>"URL da Roleta para o OBS"</strong>.
              </span>
            </li>

            <li class="step">
              <span class="step-number" :class="theme">05 -></span>
              <span>
                No OBS, adicione uma nova fonte do tipo "Navegador/Browser" e cole
                o link copiado no passo anterior.
              </span>
            </li>

            <li class="step">
              <span class="step-number" :class="theme">06 -></span>
              <span>
                Tudo pronto! Você pode testar utilizando o bloco
                <strong>"Roletar Manualmente"</strong> no painel.
              </span>
            </li>
          </ul>

          <p class="warning">
            <strong>Importante</strong>: Não compartilhe o link da sua roleta e
            nem deixe aberta no navegador, pois isso poderá fazer os prêmios serem
            duplicados no chat.
          </p>
        </div>
      </div>
      <div id="faq-container" :class="theme">
        <div id="faq-container-inner">
          <h2 class="title" :class="theme">Dúvidas Frequentes</h2>

          <ul class="questions" :class="theme">
            <li class="question">
              <span class="question-content" :class="theme">
                Por que alguns comandos configurados nos prêmios não funcionam?
              </span>
              <p class="question-answer">
                O Bot necessita de algumas permissões especiais para determinados
                comandos, para o <strong>/timeout</strong> por exemplo, é preciso
                dar status de moderador para o bot. Para o comando
                <strong>/commercial</strong> o bot precisa ter permissão de editor.
              </p>
            </li>

            <li class="question">
              <span class="question-content" :class="theme">
                Por que os prêmios estão aparecendo 2x no chat?
              </span>
              <p class="question-answer">
                O link da roleta só pode estar ativo em um lugar, no OBS. Se os
                prêmios estão sendo anuncioados 2x no chat verifique se não deixou a
                roleta aberta em alguma aba do navegador. Lembrando que para utilizar
                a roleta em várias cenas diferentes no OBS é necessário copiar a
                primeira fonte cadastrada com o link da roleta e colar na nova cena a
                <strong>referência</strong> da fonte.
              </p>
            </li>

          </ul>
        </div>
      </div>
      <div id="contact-container" :class="theme">
        <div id="contact-container-inner">
          <h2 class="title" :class="theme">Contato</h2>
          <div class="description" :class="theme">
            <p>Tem alguma dúvida ou sugestão? Envie um e-mail para:</p>
            <strong>contato@roletadosubscriber.com.br</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authConfig } from "@/utils/auth";
import { mapState } from 'vuex'
import axios from '@/repositories/clients/axios'
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale("pt-br");

export default {
  name: "IndexContainer",

  data: () => ({
    loading: true
  }),

  computed: {
    ...mapState(['theme'])
  },

  mounted() {
    this.makeAuth();
    this.setTheme(this.theme);
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
    },

    setTheme(theme) {
      this.$store.commit("SET_THEME", theme);
    },

    scrollMeTo(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;

      window.scrollTo(0, top);
    }
  }
};
</script>

<style lang="scss" scoped>
#index-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    #theme-container {
      width: 100%;
      padding: 20px;
      text-align: right;
      position: fixed;
      a {
        cursor: pointer;
        color: var(--color-text-complement);
        &.active {
          color: var(--color-primary);
        }
      }
    }
    #content-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      #start-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100vh;
        &.light {
          background: var(--color-background-light);
        }
        &.dark {
          background: var(--color-background-dark);
        }
        #start-container-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          max-width: 1150px;
          justify-content: center;
          #text-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px;
            #title-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              h1 {
                font-weight: 700;
                font-size: 6.0rem;
                line-height: 6.0rem;
                max-width: 440px;
                margin-bottom: 20px;
                &.light {
                  color: var(--color-primary);
                }
                &.dark {
                  color: var(--color-title-in-dark);
                }
              }
              p {
                font-size: 1.4em;
                line-height: 1.3em;
                max-width: 390px;
                &.light {
                  color: var(--color-primary-dark);
                }
                &.dark {
                  color: var(--color-text-in-dark);
                }
              }
            }
            #buttons-container {
              display: flex;
              flex-direction: row;
              margin-top: 40px;
              justify-content: center;
              #how-button {
                width: 206px;
                display: flex;
                align-items: center;
                color: var(--color-title-in-primary);
                padding: 14px 10px;
                border: none;
                border-radius: 8px;
                background-color: var(--color-primary-light);
                font-size: 16px;
                transition: background-color 0.2s;
                cursor: pointer;
                &:focus {
                  outline:0;
                }
                &:hover {
                  background-color: var(--color-primary-lighter);
                }
                span {
                  margin-left: 5px;
                }
              }
              #login-button {
                width: 206px;
                display: flex;
                align-items: center;
                margin-left: 20px;
                color: var(--color-title-in-primary);
                padding: 14px 10px;
                border: none;
                border-radius: 8px;
                background-color: var(--color-primary);
                font-size: 16px;
                transition: background-color 0.2s;
                cursor: pointer;
                &:focus {
                  outline:0;
                }
                &:hover {
                  background-color: var(--color-primary-dark);
                }
                &:disabled {
                  background-color: var(--color-text-complement);
                  cursor: default;
                }
                span {
                  margin-left: 5px;
                }
              }
            }
          }
          #image-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
              max-width: 325px;
            }
          }
        }
      }
      #how-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100%;
        &.light {
          background: var(--color-background-lighter);
        }
        &.dark {
          background: var(--color-background-darker);
        }
        #how-container-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: auto;
          padding: 40px 0 60px 0;
          max-width: 1150px;
          .title {
            font-size: 3em;
            padding: 10px 20px;
            color: var(--color-primary);
            &.light {
              color: var(--color-primary);
            }
            &.dark {
              color: var(--color-title-in-dark);
            }
          }
          .description {
            padding: 10px 20px;
            font-size: 1.2em;
            &.light {
              color: var(--color-primary-dark);
            }
            &.dark {
              color: var(--color-text-complement);
            }
          }
          .steps {
            font-size: 1.1em;
            padding: 0 40px;
            &.light {
              color: var(--color-text-base);
            }
            &.dark {
              color: var(--color-text-complement);
            }
            .step {
              list-style-type: none;
              padding: 3px;
              .step-number {
                font-weight: 700;
                &.light {
                  color: var(--color-primary);
                }
                &.dark {
                  color: var(--color-primary-lighter);
                }
              }
            }
          }
          .warning {
            padding: 10px 20px 20px 20px;
            font-size: 0.9em;
            color: var(--color-tertiary);
          }
        }
      }
      #faq-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100%;
        &.light {
          background: var(--color-background-light);
        }
        &.dark {
          background: var(--color-background-dark);
        }
        #faq-container-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: auto;
          max-width: 1150px;
          padding: 40px 0 60px 0;
          .title {
            font-size: 3em;
            padding: 10px 20px;
            color: var(--color-primary);
            &.light {
              color: var(--color-primary);
            }
            &.dark {
              color: var(--color-title-in-dark);
            }
          }
          .questions {
            font-size: 1.1em;
            padding: 0 20px;
            &.light {
              color: var(--color-text-base);
            }
            &.dark {
              color: var(--color-text-complement);
            }
            .question {
              list-style-type: none;
              padding: 10px 0;
              .question-content {
                display: block;
                font-size: 1.2em;
                &.light {
                  color: var(--color-primary-darker);
                }
                &.dark {
                  color: var(--color-primary-lighter);
                }
              }
              .question-answer {
                padding: 0 20px;
              }
            }
          }
        }
      }
      #contact-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100%;
        &.light {
          background: var(--color-background-lighter);
        }
        &.dark {
          background: var(--color-background-darker);
        }
        #contact-container-inner {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: auto;
          padding: 40px 0 60px 0;
          max-width: 1150px;
          .title {
            font-size: 3em;
            padding: 10px 20px;
            color: var(--color-primary);
            &.light {
              color: var(--color-primary);
            }
            &.dark {
              color: var(--color-title-in-dark);
            }
          }
          .description {
            padding: 10px 20px;
            font-size: 1.1em;
            &.light {
              color: var(--color-primary-dark);
            }
            &.dark {
              color: var(--color-text-complement);
            }
          }
        }
      }
    }
  }
@media (min-width:960px) {
  #index-container {
    #content-container {
      #start-container {
        #start-container-inner {
          display: grid;
          grid-template-rows: 100% 1fr;
          grid-template-columns: 2fr 2fr;
          grid-template-areas: "text image";
          #text-container {
            grid-area: text;
            #title-container {
              align-items: flex-start;
              text-align: left;
              h1 {
                font-size: 8.5rem;
                line-height: 8.5rem;
              }
            }
            #buttons-container {
              justify-content: left;
            }
          }
          #image-container {
            grid-area: image;
            img {
              width: 90%;
              max-width: 525px;
            }
          }
        }
      }
    }
  }
}
</style>
