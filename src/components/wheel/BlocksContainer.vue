<template>
  <div id="blocks-container">
    <div class="block" :class="theme">
      <h3>URL da Roleta para o OBS</h3>
      <input type="text" v-model="wheelUrl" :class="theme" readonly>
      <p>
        <strong>Não compartilhe</strong> este endereço!
        <strong>Copie e utilize apenas no OBS</strong>
        (não deixe aberto no navegador).
      </p>
    </div>
    <div class="block" :class="theme">
      <h3>Resetar Prêmios</h3>
      <button
        v-if="!checkReset"
        @click="checkReset = true"
        :disabled="reseting"
        class="default-btn reset-btn"
      >
        {{ reseting ? "Resetando..." : "Resetar" }}
      </button>
      <div class="check-reset" v-if="checkReset">
        <button
          @click="checkReset = false"
          :disabled="reseting"
          class="default-btn cancel-reset-btn"
        >
          Cancelar
        </button>
        <button
          @click="resetPrizes()"
          :disabled="reseting"
          class="default-btn confirm-reset-btn"
        >
          Confirmar
        </button>
      </div>
      <p>Reseta os prêmios para o padrão.</p>
      <p>
        (O padrão atual é baseado no canal do
        <a href="https://www.twitch.tv/tesdey" target="_blank">Tesdey</a>)
      </p>
    </div>
    <div class="block" :class="theme">
      <h3>Roletar por Bits</h3>
      <input
        type="number"
        min="0"
        v-model="configuration.min_bits_to_wheel"
        :class="theme"
        placeholder="Quantidade mínima de bits"
      >
      <button class="roll-btn" @click="updateOrCreateConfiguration()">Salvar</button>
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import EventBus from '@/utils/event-bus'

export default {
  name: "BlocksContainer",

  computed: {
    ...mapState(['theme', 'user'])
  },

  data: () => ({
    wheelUrl: null,
    checkReset: false,
    reseting: false,
    defaultPrizes: [
      { index: 0, color: "#ffffff", text_color: "#000000", enabled: true, name: "Piada do saci", message: "{user} ganhou {prize}!" },
      { index: 1, color: "#0172ac", text_color: "#000000", enabled: true, name: "Jogo Gratuito", message: "{user} ganhou {prize}!" },
      { index: 2, color: "#ffffff", text_color: "#000000", enabled: true, name: "Ganso", message: "{user} ganhou {prize}!" },
      { index: 3, color: "#f07e26", text_color: "#000000", enabled: true, name: "Jogar água na cabeça", message: "{user} ganhou {prize}!" },
      { index: 4, color: "#ffffff", text_color: "#000000", enabled: true, name: "Adicionar emote da BTTV", message: "{user} ganhou {prize}!", command: "!bttv", delay: 1 },
      { index: 5, color: "#fb426e", text_color: "#000000", enabled: true, name: "Anúncio de graça", message: "{user} ganhou {prize}!", command: "/commercial 60", delay: 15 },
      { index: 6, color: "#ffffff", text_color: "#000000", enabled: true, name: "Roda 2x", message: "{user} ganhou {prize}!", command: "@2" },
      { index: 7, color: "#f2d809", text_color: "#000000", enabled: true, name: "Lendária ou ban", message: "{user} ganhou {prize}!" },
      { index: 8, color: "#ffffff", text_color: "#000000", enabled: true, name: "500 rosecoins", message: "{user} ganhou {prize}!", command: "!addpoints {user} 500", delay: 1 },
      { index: 9, color: "#0172ac", text_color: "#000000", enabled: true, name: "BG temático", message: "{user} ganhou {prize}!" },
      { index: 10, color: "#ffffff", text_color: "#000000", enabled: true, name: "Escolha 2 músicas", message: "{user} ganhou {prize}!" },
      { index: 11, color: "#f07e26", text_color: "#000000", enabled: true, name: "De timeout em alguém", message: "{user} ganhou {prize}!" },
      { index: 12, color: "#ffffff", text_color: "#000000", enabled: true, name: "10 minutos de timeout", message: "{user} ganhou {prize}!", command: "/timeout {user} 600", delay: 15 },
      { index: 13, color: "#fb426e", text_color: "#000000", enabled: true, name: "Imagem para o cromakey", message: "{user} ganhou {prize}!" },
      { index: 14, color: "#ffffff", text_color: "#000000", enabled: true, name: "Pergunte ao Tesdey", message: "{user} ganhou {prize}!" },
      { index: 15, color: "#f2d809", text_color: "#000000", enabled: true, name: "Desenho na cara", message: "{user} ganhou {prize}!" },
      { index: 16, color: "#ffffff", text_color: "#000000", enabled: true, name: "Frase de encerramento", message: "{user} ganhou {prize}!" },
      { index: 17, color: "#0172ac", text_color: "#000000", enabled: true, name: "Duelo com Tesdey", message: "{user} ganhou {prize}!" },
    ],
    configuration: {
      min_bits_to_wheel: null
    }
  }),

  mounted() {
    this.setWheelUrl();
    this.getConfiguration();
  },

  methods: {
    async resetPrizes() {
      this.reseting = true;

      try {
        const allPrizes = await this.getPrizes();

        await Promise.all(
          allPrizes.map(async prize => {
            const url = `/api/prizes/${prize._id}`;

            await axios.delete(url, { headers: { 
              'x-auth-token': this.user.access_token,
              'x-code': this.user.code
            } });
          })
        );

        const url = '/api/prizes';

        for (let prize of this.defaultPrizes) {
          await axios.post(url, prize, { headers: { 
            'x-auth-token': this.user.access_token,
            'x-code': this.user.code
          } });
        }
      } catch (e) {
        this.$message.error('Ops, não foi possível resetar seus prêmios');
      }

      EventBus.$emit('get-prizes')

      this.checkReset = false
      this.reseting = false;
    },

    async getPrizes() {
      const url = '/api/prizes';

      const response = await axios.get(url, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });

      return response.data;
    },

    setWheelUrl() {
      this.wheelUrl = `${process.env.VUE_APP_URL}/wheel?code=${this.user.code}`;
    },

    async getConfiguration() {
      const url = '/api/configurations';

      const response = await axios.get(url, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });

      if (!response.data[0]) return

      this.configuration = response.data[0]
    },

    async updateOrCreateConfiguration() {
      this.configuration._id
        ? await this.updateConfiguration()
        : await this.createConfiguration()
    },

    async updateConfiguration() {
      const url = `/api/configurations/${this.configuration._id}`;

      try {
        const response = await axios.patch(url, this.configuration, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.$message.success({
          message: 'Configuração salva com sucesso!',
          showClose: true
        });

        this.configuration = response.data
      } catch (e) {
        this.$message.error({
          message: 'Ocorreu um erro ao salvar a configuração',
          showClose: true
        });
      }
    },

    async createConfiguration() {
      const url = '/api/configurations';

      try {
        const response = await axios.post(url, this.configuration, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.$message.success({
          message: 'Configuração salva com sucesso!',
          showClose: true
        });

        this.configuration = response.data
      } catch (e) {
        this.$message.error({
          message: 'Ocorreu um erro ao salvar a configuração',
          showClose: true
        });
      }
    }
  }
};
</script>

<style lang="scss">
#blocks-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  .block {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
    max-width: 600px;
    min-height: 170px;
    padding: 20px;
    border-radius: 5px;
    font-size: 0.90em;
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
    a, a:hover {
      text-decoration: none;
      font-weight: 700;
      color: var(--color-primary);
    }
    h3 {
      margin-bottom: 5px;
      font-size: 1.5em;
    }
    p {
      padding: 3px 0;
    }
    strong {
      font-size: 1.1em;
    }
    input {
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
    .reset-btn {
      color: var(--color-title-in-primary);
      background-color: var(--color-primary-dark);
      &:hover {
        background-color: var(--color-primary-darker);
      }
      &:disabled {
        background-color: var(--color-text-complement);
        cursor: default;
      }
    }
    .check-reset {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .cancel-reset-btn {
        width: 100%;
        color: var(--color-title-in-primary);
        background-color: var(--color-text-base);
        &:hover {
          background-color: var(--color-text-title);
        }
      }
      .confirm-reset-btn {
        width: 100%;
        color: var(--color-title-in-primary);
        background-color: var(--color-primary-dark);
        &:hover {
          background-color: var(--color-primary-darker);
        }
      }
    }
  }
}
@media (min-width:960px) {
  #blocks-container {
    justify-content: space-between;
    flex-direction: row;
    align-items: inherit;
    .block {
      margin: 0;
      width: 32%;
      max-width: 400px;
      .check-reset {
        display: flex;
        flex-direction: row;
        .cancel-reset-btn {
          width: 49%;
        }
        .confirm-reset-btn {
          width: 49%;
        }
      }
    }
  }
}
</style>
