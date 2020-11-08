<template>
  <div id="how-to-container" ref="how-to-container" :class="theme">
    <div id="how-to-container-inner">
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
</template>

<script>
import { mapState } from 'vuex'
import EventBus from '@/utils/event-bus'

export default {
  name: "HowToContainer",

  computed: {
    ...mapState(['theme'])
  },

  created () {
    EventBus.$on('scroll-me-to', (refName) => {
      const element = this.$refs[refName];
      const top = element.offsetTop;

      window.scrollTo(0, top);
    })
  }
};
</script>

<style lang="scss" scoped>
#how-to-container {
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
  #how-to-container-inner {
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
</style>
