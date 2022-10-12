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
      <h3>Roletar por Sub</h3>
      <p>Clique no botão abaixo para configurar mais detalhes da roleta por sub.</p>
      <button class="default-btn subs-btn"  @click="showConfig = true">Abrir Configurações</button>
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
      <button class="default-btn bits-btn" @click="updateOrCreateConfiguration()">Salvar</button>
    </div>
    <el-dialog :visible.sync="showConfig" center :custom-class="theme + ' subs-modal'" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="config-tier" :class="theme">
        <p>Deixe marcado abaixo quais os tipos de sub que podem ativar a roleta:</p>
        <div class="sub-types">
          <el-checkbox-group
            v-model="configuration.active_sub_plans"
            fill="#7246c8"
          >
            <el-checkbox-button
              v-for="plan in plans"
              :label="plan.cod"
              :key="plan.cod"
            >
              {{ plan.label }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <div class="config-interval" :class="theme">
        <p>Selecione abaixo o intervalo de meses de subs em que a roleta deve aparecer:</p>
        <div class="sub-interval">
          <el-radio-group
            v-model="configuration.subs_interval"
            fill="#7246c8"
          >
            <el-radio-button
              v-for="interval in intervals"
              :label="interval.cod"
              :key="interval.cod"
            >
              {{ interval.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button
          class="default-btn close-modal-btn"
          @click="updateOrCreateConfiguration(), showConfig = false"
        >Salvar</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'

export default {
  name: "BlocksContainer",

  computed: {
    ...mapState(['theme', 'user'])
  },

  data: () => ({
    wheelUrl: null,
    defaultPrizes: [
      { index: 0, color: "#bba1ff", text_color: "#000000", enabled: true, size: 5, name: "Contar uma Piada", message: "{user} ganhou {prize}!" },
      { index: 1, color: "#ffeb3b", text_color: "#000000", enabled: true, size: 5, name: "Jogo Gratuito", message: "{user} ganhou {prize}!" },
      { index: 2, color: "#5b4292", text_color: "#ffffff", enabled: true, size: 5, name: "Jogar água na cabeça", message: "{user} ganhou {prize}!" },
      { index: 3, color: "#bba1ff", text_color: "#000000", enabled: true, size: 5, name: "Adicionar emote da BTTV", message: "{user} ganhou {prize}!", command: "!bttv", delay: 1 },
      { index: 4, color: "#8e4af8", text_color: "#ffffff", enabled: true, size: 10, name: "Anúncio de graça", message: "{user} ganhou {prize}!", command: "/commercial 60", delay: 15 },
      { index: 5, color: "#4caf50", text_color: "#ffffff", enabled: true, size: 5, name: "Roda 2x", message: "{user} ganhou {prize}!", command: "@2" },
      { index: 6, color: "#bba1ff", text_color: "#000000", enabled: true, size: 5, name: "Jogatina personalizada", message: "{user} ganhou {prize}!" },
      { index: 7, color: "#8e4af8", text_color: "#ffffff", enabled: true, size: 10, name: "Escolha 2 músicas", message: "{user} ganhou {prize}!" },
      { index: 8, color: "#5b4292", text_color: "#ffffff", enabled: true, size: 5, name: "De timeout em alguém", message: "{user} ganhou {prize}!" },
      { index: 9, color: "#e65151", text_color: "#ffffff", enabled: true, size: 10, name: "10 minutos de timeout", message: "{user} ganhou {prize}!", command: "/timeout {user} 600", delay: 15 },
      { index: 10, color: "#8e4af8", text_color: "#ffffff", enabled: true, size: 5, name: "Imagem para o cromakey", message: "{user} ganhou {prize}!" },
      { index: 11, color: "#5b4292", text_color: "#ffffff", enabled: true, size: 5, name: "Desenho na cara", message: "{user} ganhou {prize}!" },
      { index: 12, color: "#bba1ff", text_color: "#000000", enabled: true, size: 10, name: "Frase de encerramento", message: "{user} ganhou {prize}!" },
      { index: 13, color: "#8e4af8", text_color: "#ffffff", enabled: true, size: 5, name: "Hora do Duelo", message: "{user} ganhou {prize}!" },
      { index: 14, color: "#03a9f4", text_color: "#ffffff", enabled: true, size: 10, name: "Seguir no Twitter", message: "{user} ganhou {prize}!" },
    ],
    configuration: {
      min_bits_to_wheel: null,
      active_sub_plans: [],
      subs_interval: null
    },
    plans: [
      { cod: 'Prime', label: 'Prime' },
      { cod: '1000', label: 'Tier 1' },
      { cod: '2000', label: 'Tier 2' },
      { cod: '3000', label: 'Tier 3' }
    ],
    intervals: [
      { cod: 1, label: 'Todo mês' },
      { cod: 2, label: 'A cada 2 meses de sub' },
      { cod: 3, label: 'A cada 3 meses de sub' }
    ],
    showConfig: false
  }),

  mounted() {
    this.setWheelUrl();
    this.getConfiguration();
  },

  methods: {
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
    .bits-btn{
      color: var(--color-title-in-primary);
      padding: 9px 5px;
      background-color: var(--color-primary-dark);
      &:hover {
        background-color: var(--color-primary-darker);
      }
    }
    .subs-btn{
      color: var(--color-title-in-primary);
      padding: 9px 5px;
      margin-top: 17px;
      background-color: var(--color-primary-dark);
      &:hover {
        background-color: var(--color-primary-darker);
      }
    }
  }
  .subs-modal {
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      text-align: center;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-dialog__footer {
      display: flex;
      justify-content: center;
    }
    &.dark {
      background-color: var(--color-background-dark)
    }
  }
  .sub-types, .sub-interval {
    margin-top: 10px;
    text-align: center;
    .sub-type {
      display: block;
      .status-on, .status-off {
        font-size: 4em;
        cursor: pointer;
      }
      .status-on {
        color: var(--color-primary);
      }
      .status-off {
        color: var(--color-tertiary);
      }
    }
  }
  .config-tier, .config-interval {
    padding: 20px 10px;
    p {
      padding-top: 5px;
    }
    border-bottom: 1px solid var(--color-background-light);
    small {
      color: var(--color-primary);
    }
    &.dark {
      border-bottom: 1px solid var(--color-background-darker);
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
  .close-modal-btn {
    padding: 10px 15px;
    font-size: 1em;
    color: var(--color-title-in-primary);
    background-color: var(--color-primary-dark);
    &:hover {
      background-color: var(--color-primary-darker);
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
    }
  }
}
</style>
