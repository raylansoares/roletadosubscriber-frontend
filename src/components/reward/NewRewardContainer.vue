<template>
  <div id="new-reward-container">
    <div class="block" :class="theme">
      <div class="form-field">
        <label>
          Nome
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">Nome da recompensa.</span>
          </div>
        </label>
        <select
          class="select-input"
          :class="theme"
          v-model="reward.name"
          placeholder="Recompensa"
          @change="reward.type = null, reward.action = null, reward.time = null"
        >
          <option value=""></option>
          <option
            v-for="item in channelRewards"
            :key="item.id"
            :label="item.title"
            :value="item.title"
          >
          </option>
        </select>
      </div>
      <div class="form-field">
        <label>
          Tipo
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              Tipo da recompensa.
            </span>
          </div>
        </label>
        <select
          class="select-input"
          :class="theme"
          v-model="reward.type"
          placeholder="Tipo"
          @change="reward.action = null, reward.time = null"
          :disabled="!reward.name"
        >
          <option value=""></option>
          <option
            v-for="item in rewardTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </option>
        </select>
      </div>
      <div class="form-field">
        <label>
          Ação
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              Ação a ser executada no resgate da recompensa.
            </span>
          </div>
        </label>
        <select
          class="select-input"
          :class="theme"
          v-model="reward.action"
          placeholder="Ação"
          @change="reward.time = null"
          :disabled="reward.type !== 'command'"
        >
          <option value=""></option>
          <option
            v-for="item in rewardActions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </option>
        </select>
      </div>
      <div class="form-field half">
        <label>
          Tempo
          <div class="tooltip">
            <i class="material-icons">help_outline</i>
            <span class="tooltiptext">
              Tempo do comando (segundos) - Utilizado no timeout.
            </span>
          </div>
        </label>
        <input
          type="number"
          min="0"
          class="text-input"
          :class="theme"
          v-model="reward.time"
          placeholder="Tempo"
          :disabled="reward.action !== 'timeout'"
        >
      </div>
      <div class="form-field button">
        <button
          @click="createReward()"
          :disabled="!this.validReward()"
          class="default-btn create-btn"
          :class="theme"
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
  name: "NewRewardContainer",

  computed: {
    ...mapState(['theme', 'user'])
  },

  props: {
    channelRewards: Array
  },

  data: () => ({
    reward: {
      name: null,
      type: null,
      action: null,
      time: null
    },
    rewardTypes: [
      {
        value: 'wheel',
        label: 'Roleta'
      },
      {
        value: 'command',
        label: 'Comando'
      }
    ],
    rewardActions: [
      {
        value: 'timeout',
        label: 'Dar Timeout'
      },
      {
        value: 'untimeout',
        label: 'Remover Timeout'
      }
    ]
  }),

  methods: {
    async createReward() {
      if (!this.validReward()) return

      const url = '/api/rewards';

      try {
        await axios.post(url, this.reward, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.reward = {
          name: null,
          type: null,
          action: null,
          time: null
        };

      } catch (e) {
        this.$message.error('Ops, não foi possível cadastrar este item');
      }
 
      EventBus.$emit('get-rewards')
    },

    validReward () {
      if (!this.reward.name || !this.reward.type) return false
      if (this.reward.type === 'command' && !this.reward.action) return false
      if (this.reward.action === 'timeout' && !this.reward.time) return false
      return true
    }
  }
};
</script>

<style lang="scss">
#new-reward-container {
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
      }
      label {
        display: flex;
        i {
          margin-left: 3px;
          font-size: 21px;
        }
      }
    }
    .text-input, .select-input {
      margin: 5px 0 10px 0;
      padding: 9px 10px;
      border: 1px solid var(--color-line-in-white);
      border-radius: 5px;
      &:focus {
        outline:0;
      }
      &:disabled {
        cursor: not-allowed;
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
    .select-input {
      height: 43px;
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
        &.light {
          background-color: var(--color-text-complement);
        }
        &.dark {
          background-color: var(--color-text-base);
        }
      }
    }
  }
}
@media (min-width:960px) {
  #new-reward-container {
    margin-top: 20px;
    .block {
      margin: 0;
      max-width: none;
      flex-direction: row;
      justify-content: space-between;
      .form-field {
        width: 22%;
        &.half {
          width: 12%;
          min-width: 125px;
        }
        &.button {
          padding-top: 19px;
        }
      }
    }
  }
}
</style>
