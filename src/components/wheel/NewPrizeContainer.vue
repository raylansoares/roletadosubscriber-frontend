<template>
  <div id="new-prize-container">
    <div class="block" :class="theme">
      <div class="form-field">
        <label>
          Nome
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">Nome do prêmio na roleta.</span>
          </div>
        </label>
        <input
          type="text"
          class="text-input"
          :class="theme"
          v-model="prize.name"
        >
      </div>
      <div class="form-field">
        <label>
          Mensagem
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              Mensagem exibida no chat quando alguém ganhar este prêmio.
            </span>
          </div>
        </label>
        <input
          type="text"
          class="text-input"
          :class="theme"
          v-model="prize.message"
        >
      </div>
      <div class="form-field">
        <label>
          Comando
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              Comando executado quando alguém ganhar este prêmio.
            </span>
          </div>
        </label>
        <input
          type="text"
          class="text-input"
          :class="theme"
          v-model="prize.command"
        >
      </div>
      <div class="form-field half">
        <label>
          Delay
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              O comando será executado depois do delay (segundos).
            </span>
          </div>
        </label>
        <input
          type="number"
          min="0"
          class="text-input"
          :class="theme"
          v-model="prize.delay"
        >
      </div>
      <div class="form-field half color">
        <div class="color">
          <label>Cor</label>
          <input type="color" class="color-input" v-model="prize.color">
        </div>
        <div class="color">
          <label>Texto</label>
          <input type="color" class="color-input" v-model="prize.text_color">
        </div>
      </div>
      <div class="form-field button">
        <button
          @click="createPrize()"
          :disabled="!prize.name || !prize.message"
          class="default-btn create-btn"
        >
        Cadastrar
      </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import EventBus from '@/utils/event-bus'

export default {
  name: "NewPrizeContainer",

  computed: {
    ...mapState(['theme', 'user'])
  },

  data: () => ({
    prize: {
      name: null,
      message: null,
      command: null,
      delay: null,
      color: '#ffffff',
      text_color: '#000000',
      enabled: true
    }
  }),

  methods: {
    async createPrize() {
      if (!this.prize.name || !this.prize.message) return
      const url = '/api/prizes';

      try {
        await axios.post(url, this.prize, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.prize = {
          name: null,
          message: null,
          command: null,
          delay: null,
          color: '#ffffff',
          text_color: '#000000',
          enabled: true
        };

      } catch (e) {
        this.$message.error('Ops, não foi possível cadastrar este item');
      }
 
      EventBus.$emit('get-prizes')
    }
  }
};
</script>

<style lang="scss">
#new-prize-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  width: 100%;
  .block {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border-radius: 5px;
    font-size: 0.90em;
    justify-content: space-between;
    &.light {
      color: var(--color-text-base);
      background-color: var(--color-box-light);
      border: solid 1px var(--color-line-in-white);
    }
    &.dark {
      color: var(--color-text-complement);
      background-color: var(--color-box-dark);
      border: solid 1px var(--color-background-darker);
    }
    .form-field {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 7px;
      &.half {
        width: 100%;
        min-width: 125px;
        &.color {
          display: flex;
          flex-direction: row;
          .color {
            display: flex;
            flex-direction: column;
            margin: 0 7px;
          }
        }
      }
      label {
        display: flex;
        i {
          margin-left: 3px;
          font-size: 21px;
        }
      }
    }
    .text-input {
      margin: 5px 0 10px 0;
      padding: 9px 10px;
      border: 1px solid var(--color-line-in-white);
      border-radius: 5px;
      &:focus {
        outline:0;
      }
      &.light {
        color: var(--color-text-base);
        background-color: var(--color-box-light);
        border: solid 1px var(--color-line-in-white);
      }
      &.dark {
        color: var(--color-text-complement);
        background-color: var(--color-background-dark);
        border: solid 1px var(--color-background-darker);
      }
    }
    .color-input {
      margin: 5px 0 10px 0;
      padding: 1px 2px;
      border: 1px solid var(--color-line-in-white);
      border-radius: 5px;
      height: 43px;
      width: 43px;
    }
    .default-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 9px 5px;
      border: none;
      border-radius: 5px;
      font-size: 1.2em;
      transition: background-color 0.2s;
      margin: 7px 0;
      cursor: pointer;
      &:focus {
        outline:0;
      }
    }
    .create-btn {
      color: var(--color-title-in-primary);
      background-color: var(--color-primary);
      &:hover {
        background-color: var(--color-primary-dark);
      }
      &:disabled {
        background-color: var(--color-text-complement);
        cursor: default;
      }
    }
  }
}
@media (min-width:960px) {
  #new-prize-container {
    margin-top: 20px;
    .block {
      margin: 0;
      max-width: none;
      flex-direction: row;
      justify-content: space-between;
      .form-field {
        width: 20%;
        &.half {
          width: 10%;
          min-width: 125px;
          &.color {
            display: flex;
            flex-direction: row;
            .color {
              display: flex;
              flex-direction: column;
              margin: 0 7px;
            }
          }
        }
        &.button {
          padding-top: 19px;
        }
      }
    }
  }
}
</style>
