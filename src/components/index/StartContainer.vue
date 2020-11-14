<template>
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
          <button id="how-button" @click="scrollMeTo('how-to-container')">
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
</template>

<script>
import { mapState } from 'vuex'
import EventBus from '@/utils/event-bus'

export default {
  name: "StartContainer",

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState(['theme'])
  },

  methods: {
    connect() {
       this.$emit('connect');
    },

    scrollMeTo(refName) {
      EventBus.$emit('scroll-me-to', refName)
    }
  }
};
</script>

<style lang="scss" scoped>
#start-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: auto;
  padding-top: 35px;
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
    height: auto;
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
          text-align: initial;
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
          text-align: initial;
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
        max-width: 280px;
      }
    }
  }
}
@media (min-width:960px) {
  #start-container {
    height: 100vh;
    padding-top: 0;
    #start-container-inner {
      height: 100vh;
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
</style>
