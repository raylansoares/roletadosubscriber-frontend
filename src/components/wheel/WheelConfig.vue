<template>
  <div id="wheel-config">

    <el-row :gutter="20">
      <el-col :span="16">
        <el-alert
          :closable="false"
          title="Variáveis disponíveis"
          type="info"
          show-icon>
          <p><strong>{user}</strong> - Exibe o nome do subscriber na mensagem ou comando</p>
          <p><strong>{prize}</strong> - Exibe o nome do prêmio na mensagem</p>
          <p><strong>@2</strong> - Comando para roletar mais 2x (mínimo 1 e máximo 2)</p>
        </el-alert>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <el-dropdown trigger="click" class="reset-button" placement="bottom">
            <el-popover
                placement="left"
                width="320"
                trigger="hover"
                content="Reseta os prêmios para o padrão. (o padrão atual é baseado no canal do Tesdey)"
              >
                <el-button
                  slot="reference"
                  :disabled="reseting"
                  plain
                  type="warning"
                >
                  <i class="el-icon-warning-outline" v-if="!reseting"></i>
                  <i class="el-icon-loading" v-else></i>
                  {{ reseting ? "Resetando..." : "Resetar Prêmios" }}
                </el-button>
              </el-popover>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="resetPrizes">Confirmar</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="top-card">
          <el-form @submit.native.prevent="createPrize" :inline="true" :model="prize" label-position="top" class="prize-form">
            <el-form-item label="Nome" prop="name" class="inline-label name">
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                content="Nome do prêmio na roleta">
                <el-input slot="reference" v-model="prize.name" placeholder="Nome" size="medium" maxlength="25" clearable></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Mensagem" prop="message" class="inline-label message">
              <el-popover
                placement="bottom"
                width="300"
                trigger="hover"
                content="Mensagem a ser exibida no chat quando o usuário ganhar este prêmio">
                <el-input slot="reference" v-model="prize.message" placeholder="Mensagem" size="medium" clearable></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Comando" prop="message" class="inline-label command">
              <el-popover
                placement="bottom"
                width="260"
                trigger="hover"
                content="Comando a ser executado quando o usuário ganhar este prêmio">
                <el-input slot="reference" v-model="prize.command" placeholder="Comando" size="medium" clearable></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Delay" prop="delay" class="inline-label delay">
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                content="O comando será executado depois do delay (segundos)">
                <el-input-number slot="reference" v-model="prize.delay" placeholder="Delay" size="medium"
                type="number" :min="0" :max="60" :controls="false" class="delay"></el-input-number>
              </el-popover>
            </el-form-item>

            <el-form-item label="Cor" prop="color" class="inline-label color">
              <el-color-picker v-model="prize.color" size="medium"></el-color-picker>
            </el-form-item>

            <el-form-item label="Status" prop="enabled" class="inline-label status">
              <el-switch v-model="prize.enabled" active-color="#67c23a" inactive-color="#ff4949"></el-switch>
            </el-form-item>

            <el-form-item class="inline-button">
              <el-button type="primary" plain @click="createPrize">
                Cadastrar
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

     <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">Prêmios da Roleta</span>

            <div class="search-input">
              <el-input
                size="small"
                v-model="search"
                placeholder="Buscar prêmio"
                @input="filterPrizes"
              />
            </div>
          </div>

          <el-table
            :data="filteredPrizes"
            style="width: 100%"
            height="493"
            header-cell-class-name="sub-table-header"
          >
            <el-table-column label="Nome" prop="name" min-width="200px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.name }}
                </span>
                <el-popover
                  v-else
                  placement="bottom"
                  width="220"
                  trigger="hover"
                  content="Nome do prêmio na roleta">
                  <el-input slot="reference" size="small" v-model="scope.row.name" maxlength="25"></el-input>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="Mensagem" prop="message" min-width="200px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.message }}
                </span>
                <el-popover
                v-else
                  placement="bottom"
                  width="300"
                  trigger="hover"
                  content="Mensagem a ser exibida no chat quando o usuário ganhar este prêmio">
                  <el-input slot="reference" size="small" v-model="scope.row.message"></el-input>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="Comando" prop="command" min-width="200px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.command }}
                </span>
                <el-popover
                  v-else
                  placement="bottom"
                  width="260"
                  trigger="hover"
                  content="Comando a ser executado quando o usuário ganhar este prêmio">
                <el-input slot="reference" size="small" v-model="scope.row.command"></el-input>
              </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="Delay" prop="delay" min-width="70px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.delay }}
                </span>
                <el-popover
                  v-else
                  placement="bottom"
                  width="220"
                  trigger="hover"
                  content="O comando será executado depois do delay (segundos)">
                  <el-input-number slot="reference" v-model="scope.row.delay" size="small"
                  type="number" :min="0" :max="60" :controls="false" class="delay-edit"></el-input-number>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="Cor" min-width="70px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  <el-tag class="color-tag" :color="scope.row.color"></el-tag>
                </span>
                <el-color-picker v-else v-model="scope.row.color" size="small"></el-color-picker>
              </template>
            </el-table-column>

            <el-table-column label="Status" min-width="70px">
              <template slot-scope="scope">
                {{ scope.row.enabled ? "Ativo" : "Inativo" }}
              </template>
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
                    {{ scope.row.enabled ? "Ativo" : "Inativo" }}
                  </el-tag>
                </span>
                <el-switch v-else v-model="scope.row.enabled" active-color="#67c23a" inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>

            <el-table-column align="right" min-width="100px">
              <template slot-scope="scope">
                <el-button
                  plain
                  circle
                  :icon="selectedItem !== scope.row._id ? 'el-icon-edit' : 'el-icon-check'"
                  :type="selectedItem !== scope.row._id ? 'primary' : 'success'"
                  :disabled="!!selectedItem && selectedItem !== scope.row._id"
                  @click="editPrize(scope.row)"
                >
                </el-button>

                <el-dropdown trigger="click" placement="bottom">
                  <el-button
                    icon="el-icon-delete"
                    circle
                    plain
                    type="danger"
                    :disabled="!!selectedItem"
                  >
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="deletePrize(scope.row._id)">Confirm Delete</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex'

export default {
  name: "WheelConfig",

  computed: {
    ...mapState(['user'])
  },

  data: () => ({
    prizes: [],
    filteredPrizes: [],
    search: null,
    prize: {
      name: null,
      message: null,
      command: null,
      delay: null,
      color: null,
      enabled: null
    },
    reseting: false,
    defaultPrizes: [
      { color: "#ffffff", enabled: true, name: "Piada do saci", message: "{user} ganhou {prize}!" },
      { color: "#0172ac", enabled: true, name: "Jogo Gratuito", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "Ganso", message: "{user} ganhou {prize}!" },
      { color: "#f07e26", enabled: true, name: "Jogar água na cabeça", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "Adicionar emote da BTTV", message: "{user} ganhou {prize}!" },
      { color: "#fb426e", enabled: true, name: "Anúncio de graça", message: "{user} ganhou {prize}!", command: "/commercial 60", delay: 15 },
      { color: "#ffffff", enabled: true, name: "Roda 2x", message: "{user} ganhou {prize}!", command: "@2" },
      { color: "#f2d809", enabled: true, name: "Lendária ou ban", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "500 rosecoins", message: "{user} ganhou {prize}!", command: "!givepoints {user} 500", delay: 1 },
      { color: "#0172ac", enabled: true, name: "BG temático", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "Escolha 2 músicas", message: "{user} ganhou {prize}!" },
      { color: "#f07e26", enabled: true, name: "De timeout em alguém", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "10 minutos de timeout", message: "{user} ganhou {prize}!", command: "/timeout {user} 600", delay: 15 },
      { color: "#fb426e", enabled: true, name: "Imagem para o cromakey", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "Pergunte ao Tesdey", message: "{user} ganhou {prize}!" },
      { color: "#f2d809", enabled: true, name: "Desenho na cara", message: "{user} ganhou {prize}!" },
      { color: "#ffffff", enabled: true, name: "Frase de encerramento", message: "{user} ganhou {prize}!" },
      { color: "#0172ac", enabled: true, name: "Duelo com Tesdey", message: "{user} ganhou {prize}!" }
    ],
    selectedItem: null
  }),

  mounted() {
    this.getPrizes();
  },

  methods: {
    async getPrizes() {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      const response = await axios.get(url, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });
      this.prizes = response.data;
      this.filterPrizes();
      if (!response.data.length) await this.resetPrizes()
    },

    filterPrizes() {
      if (this.search) {
        this.filteredPrizes = this.prizes.filter(value =>
          value.name.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        this.filteredPrizes = this.prizes;
      }
    },

    async deletePrize(id) {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${id}`;
      await axios.delete(url, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });
      this.getPrizes();
    },

    async editPrize(item) {
      if (this.selectedItem !== item._id) {
        this.selectedItem = item._id;
        return;
      }
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${item._id}`;
      await axios.patch(url, item, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });
      this.selectedItem = null;
    },

    async createPrize() {
      if (!this.prize.name || !this.prize.message) return
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      await axios.post(url, this.prize, { headers: { 
        'x-auth-token': this.user.access_token,
        'x-code': this.user.code
      } });
      this.prize = {
        name: null,
        message: null,
        command: null,
        delay: null,
        color: null,
        enabled: null
      };
      this.getPrizes();
    },

    async resetPrizes() {
      this.reseting = true;

      const allPrizes = this.prizes;

      this.prizes = [];
      this.filteredPrizes = [];

      await Promise.all(
        allPrizes.map(async prize => {
          const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${prize._id}`;
          await axios.delete(url, { headers: { 
            'x-auth-token': this.user.access_token,
            'x-code': this.user.code
          } });
        })
      );

      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      for (let prize of this.defaultPrizes) {
        await axios.post(url, prize, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });
      }

      await this.getPrizes();

      this.reseting = false;
    }
  }
};
</script>

<style lang="scss">
#wheel-config {
  .el-row {
    margin-bottom: 20px;
  }

  .search-input {
    float: right;
    width: 300px;
  }

  .top-card {
    min-height: 90px;
  }

  .prize-form {
    display: flex;
    justify-content: space-between;
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    color: #606266;
  }

  .color-tag {
    width: 32px;
  }

  .delay-edit.el-input-number {
    width: 70px;
  }

  .inline-label {
    margin-bottom: 0;
    label {
      line-height: 15px;
    }
    &.name {
      width: 260px;
    }
    &.message {
      width: 260px;
    }
    &.command {
      width: 260px;
    }
    &.delay .el-input-number {
      width: 110px;
    }
  }

  .inline-button {
    margin: 25px 0 0 0;
  }

  .reset-button, .reset-button button {
    width: 100%;
    margin: 2px 0;
  }
}
</style>
