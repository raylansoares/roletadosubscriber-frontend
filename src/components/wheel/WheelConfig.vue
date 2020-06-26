<template>
  <div id="wheel-config">

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <div class="big-label">
            <p>Variáveis Disponíveis</p>
          </div>
          <div class="var-desc">
            <p>
            <strong>{user}</strong>
            - Exibe o nome do subscriber na mensagem ou comando
          </p>
          <p>
            <strong>{prize}</strong>
            - Exibe o nome do prêmio na mensagem
          </p>
          <p>
            <strong>@2</strong>
            - Comando para roletar mais 2x (mín 1 e máx 2)
          </p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <el-form label-position="top">
            <el-form-item label="URL da Roleta para o OBS" class="big-label">
              <el-input v-model="wheelUrl" id="wheelUrl" show-password>
              </el-input>
            </el-form-item>

            <el-alert
              :closable="false"
              type="info"
              show-icon
              effect="dark"
            >
              <p>
                <strong>Não compartilhe</strong>
                este endereço!
                <strong>Utilize apenas no OBS</strong>
                (não deixe aberto no navegador).
              </p>
            </el-alert>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <div class="big-label">
            <p>Resetar Prêmios</p>
          </div>

          <el-dropdown trigger="click" placement="bottom" class="reset-button">
            <el-button
              :disabled="reseting || sort || !!selectedItem"
              plain
              type="warning"
            >
              <i class="el-icon-warning-outline" v-if="!reseting"></i>
              <i class="el-icon-loading" v-else></i>
              {{ reseting ? "Resetando..." : "Resetar" }}
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="resetPrizes">
                  Confirmar
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-alert
            :closable="false"
            type="info"
            show-icon
            effect="dark"
          >
            <p>Reseta os prêmios para o padrão.</p>
            <p>(O padrão atual é baseado no canal do Tesdey)</p>
          </el-alert>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <el-form
            @submit.native.prevent="createPrize"
            :inline="true"
            :model="prize"
            label-position="top"
            class="prize-form"
          >
            <el-form-item label="Nome" prop="name" class="inline-label name">
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                content="Nome do prêmio na roleta"
              >
                <el-input
                  slot="reference"
                  v-model="prize.name"
                  placeholder="Nome"
                  size="medium"
                  maxlength="25"
                  clearable
                ></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Mensagem" class="inline-label message">
              <el-popover
                placement="bottom"
                width="300"
                trigger="hover"
                content="Mensagem a ser exibida no chat quando
                  o usuário ganhar este prêmio"
              >
                <el-input
                  slot="reference"
                  v-model="prize.message"
                  placeholder="Mensagem"
                  size="medium"
                  clearable
                ></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Comando" class="inline-label command">
              <el-popover
                placement="bottom"
                width="260"
                trigger="hover"
                content="Comando executado quando o usuário ganhar este prêmio"
              >
                <el-input
                  slot="reference"
                  v-model="prize.command"
                  placeholder="Comando"
                  size="medium"
                  clearable
                ></el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="Delay" prop="delay" class="inline-label delay">
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                content="O comando será executado depois do delay (segundos)">
                <el-input-number
                  slot="reference"
                  v-model="prize.delay"
                  placeholder="Delay"
                  size="medium"
                  type="number"
                  :min="0"
                  :max="60"
                  :controls="false"
                  class="delay"
                ></el-input-number>
              </el-popover>
            </el-form-item>

            <el-form-item label="Cor" prop="color" class="inline-label color">
              <el-color-picker v-model="prize.color" size="medium">
              </el-color-picker>
            </el-form-item>

            <el-form-item label="Status" prop="enabled" class="inline-label">
              <el-switch
                v-model="prize.enabled"
                active-color="#67c23a"
                inactive-color="#ff4949"
              ></el-switch>
           </el-form-item>

            <el-form-item class="inline-button">
              <el-button
                type="primary"
                plain
                @click="createPrize"
                :disabled="sort || !!selectedItem"
              >
                Cadastrar
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card shadow="hover" class="prizes-card">
          <div slot="header" class="clearfix">
            <span class="card-title">Prêmios da Roleta</span>

            <div class="search-input">
              <el-input
                size="small"
                v-model="search"
                placeholder="Buscar prêmio"
                @input="filterPrizes"
                :disabled="sort || !!selectedItem"
              />
            </div>

            <el-button
              :type="sort ? 'success' : 'primary'"
              plain
              size="small"
              class="order-button"
              @click="togleSort()"
              :disabled="!!selectedItem"
            >
              <span v-if="!sorting">
                <i :class="sort ? 'el-icon-success' : 'el-icon-d-caret'"></i>
                {{ sort ? 'Salvar Ordernção' : 'Alterar Ordernção' }}
              </span>
              <span v-else>
                <i class="el-icon-loading"></i>
                Salvando ordenação...
              </span>
            </el-button>
          </div>

          <table class="header-table">
            <tr>
              <td class="name">Nome</td>
              <td class="message">Mensagem</td>
              <td class="command">Comando</td>
              <td class="delay">Delay</td>
              <td class="color">Cor</td>
              <td class="status">Status</td>
              <td class="actions">Ações</td>
            </tr>
          </table>
          
          <div class="prizes-container">
            <draggable
              v-model="filteredPrizes"
              tag="ul"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
              handle=".handle"
            >
              <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <li v-for="prize in filteredPrizes" :key="prize._id" class="list-item">
                  <table>
                    <tr>
                      <td class="name">
                        <span v-if="selectedItem !== prize._id">
                          {{ prize.name }}
                        </span>
                        <el-popover
                          v-else
                          placement="bottom"
                          width="220"
                          trigger="hover"
                          content="Nome do prêmio na roleta">
                          <el-input
                            slot="reference"
                            size="small"
                            v-model="prize.name"
                            maxlength="25"
                          ></el-input>
                        </el-popover>
                      </td>

                      <td class="message">
                        <span v-if="selectedItem !== prize._id">
                          {{ prize.message }}
                        </span>
                        <el-popover
                          v-else
                          placement="bottom"
                          width="300"
                          trigger="hover"
                          content="Mensagem a ser exibida no chat quando
                            o usuário ganhar este prêmio"
                        >
                          <el-input
                            slot="reference"
                            size="small"
                            v-model="prize.message"
                          ></el-input>
                        </el-popover>
                      </td>

                      <td class="command">
                        <span v-if="selectedItem !== prize._id">
                          {{ prize.command }}
                        </span>
                        <el-popover
                          v-else
                          placement="bottom"
                          width="260"
                          trigger="hover"
                          content="Comando a ser executado quando
                            o usuário ganhar este prêmio"
                        >
                          <el-input
                            slot="reference"
                            size="small"
                            v-model="prize.command"
                          ></el-input>
                        </el-popover>
                      </td>

                      <td class="delay">
                        <span v-if="selectedItem !== prize._id">
                          {{ prize.delay }}
                        </span>
                        <el-popover
                          v-else
                          placement="bottom"
                          width="220"
                          trigger="hover"
                          content="O comando será executado depois do delay (segundos)"
                        >
                          <el-input-number
                            slot="reference"
                            v-model="prize.delay"
                            size="small"
                            type="number"
                            :min="0"
                            :max="60"
                            :controls="false"
                            class="delay-edit"
                          ></el-input-number>
                        </el-popover>
                      </td>

                      <td class="color">
                        <span v-if="selectedItem !== prize._id">
                          <el-tag class="color-tag" :color="prize.color">
                          </el-tag>
                        </span>
                        <el-color-picker
                          v-else
                          v-model="prize.color"
                          size="small"
                        ></el-color-picker>
                      </td>

                      <td class="status">
                        <span v-if="selectedItem !== prize._id">
                          <el-tag :type="prize.enabled ? 'success' : 'danger'">
                            {{ prize.enabled ? "Ativo" : "Inativo" }}
                          </el-tag>
                        </span>
                        <el-switch
                          v-else
                          v-model="prize.enabled"
                          active-color="#67c23a"
                          inactive-color="#ff4949"
                        ></el-switch>
                      </td>

                      <td class="actions">

                        <el-button
                          v-show="sort"
                          plain
                          circle
                          :class="!sorting ? 'handle' : ''"
                          icon="el-icon-d-caret"
                          type="primary"
                          :disabled="sorting"
                        >
                        </el-button>

                        <el-button
                          v-show="!sort"
                          plain
                          circle
                          :icon="selectedItem !== prize._id ? 'el-icon-edit' : 'el-icon-check'"
                          :type="selectedItem !== prize._id ? 'primary' : 'success'"
                          :disabled="!!selectedItem && selectedItem !== prize._id"
                          @click="editPrize(prize)"
                        >
                        </el-button>

                        <el-dropdown
                          trigger="click"
                          placement="bottom"
                          v-show="!sort"
                        >
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
                              <span @click="deletePrize(prize._id)">
                                Confirmar
                              </span>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </td>
                    </tr>
                  </table>
                </li>
              </transition-group>
            </draggable>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: "WheelConfig",

  components: {
    draggable
  },

  computed: {
    ...mapState(['user']),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },

  data: () => ({
    prizes: [],
    filteredPrizes: [],
    search: null,
    wheelUrl: null,
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
      { index: 0, color: "#ffffff", enabled: true, name: "Piada do saci", message: "{user} ganhou {prize}!" },
      { index: 1, color: "#0172ac", enabled: true, name: "Jogo Gratuito", message: "{user} ganhou {prize}!" },
      { index: 2, color: "#ffffff", enabled: true, name: "Ganso", message: "{user} ganhou {prize}!" },
      { index: 3, color: "#f07e26", enabled: true, name: "Jogar água na cabeça", message: "{user} ganhou {prize}!" },
      { index: 4, color: "#ffffff", enabled: true, name: "Adicionar emote da BTTV", message: "{user} ganhou {prize}!", command: "!bttv", delay: 1 },
      { index: 5, color: "#fb426e", enabled: true, name: "Anúncio de graça", message: "{user} ganhou {prize}!", command: "/commercial 60", delay: 15 },
      { index: 6, color: "#ffffff", enabled: true, name: "Roda 2x", message: "{user} ganhou {prize}!", command: "@2" },
      { index: 7, color: "#f2d809", enabled: true, name: "Lendária ou ban", message: "{user} ganhou {prize}!" },
      { index: 8, color: "#ffffff", enabled: true, name: "500 rosecoins", message: "{user} ganhou {prize}!", command: "!givepoints {user} 500", delay: 1 },
      { index: 9, color: "#0172ac", enabled: true, name: "BG temático", message: "{user} ganhou {prize}!" },
      { index: 10, color: "#ffffff", enabled: true, name: "Escolha 2 músicas", message: "{user} ganhou {prize}!" },
      { index: 11, color: "#f07e26", enabled: true, name: "De timeout em alguém", message: "{user} ganhou {prize}!" },
      { index: 12, color: "#ffffff", enabled: true, name: "10 minutos de timeout", message: "{user} ganhou {prize}!", command: "/timeout {user} 600", delay: 15 },
      { index: 13, color: "#fb426e", enabled: true, name: "Imagem para o cromakey", message: "{user} ganhou {prize}!" },
      { index: 14, color: "#ffffff", enabled: true, name: "Pergunte ao Tesdey", message: "{user} ganhou {prize}!" },
      { index: 15, color: "#f2d809", enabled: true, name: "Desenho na cara", message: "{user} ganhou {prize}!" },
      { index: 16, color: "#ffffff", enabled: true, name: "Frase de encerramento", message: "{user} ganhou {prize}!" },
      { index: 17, color: "#0172ac", enabled: true, name: "Duelo com Tesdey", message: "{user} ganhou {prize}!" },
    ],
    selectedItem: null,
    host: process.env.VUE_APP_SERVER_HOST,
    port: process.env.VUE_APP_SERVER_PORT,
    drag: false,
    sort: false,
    sorting: false
  }),

  mounted() {
    this.getPrizes();
    this.setWheelUrl();
  },

  methods: {
    async getPrizes() {
      const url = '/api/prizes';

      try {
        const response = await axios.get(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.prizes = response.data;
        this.filterPrizes();
        if (!response.data.length) await this.resetPrizes()
      } catch (e) {
        this.$message.error('Ops, não foi possível carregar a lista de prêmios');
      }
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

    async togleSort() {
      if (!this.sort) {
        this.search = null
        this.filteredPrizes = this.prizes
        this.sort = true
        return
      }

      this.sorting = true

      await Promise.all(
        this.filteredPrizes.map(async (prize, index) => {
          const oldIndex = this.prizes.findIndex(item => item._id === prize._id)
          const newIndex = index

          if (oldIndex === newIndex && prize.index !== undefined) return

          prize.index = index

          await this.updatePrize(prize)

        })
      )

      this.prizes = this.filteredPrizes

      this.sort = false
      this.sorting = false
    },

    async deletePrize(id) {
      const url = `/api/prizes/${id}`;

      try {
        await axios.delete(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.getPrizes();
      } catch (e) {
        this.$message.error('Ops, não foi possível excluir este item');
      }
    },

    async editPrize(item) {
      if (this.selectedItem !== item._id) {
        this.selectedItem = item._id;
        return;
      }

      await this.updatePrize(item)

      this.selectedItem = null;
    },

    async updatePrize (item) {
      const url = `/api/prizes/${item._id}`;

      try {
        await axios.patch(url, item, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });
      } catch (e) {
        this.$message.error('Ops, não foi possível editar este item');
      }
    },

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
          color: null,
          enabled: null
        };

        this.getPrizes();
      } catch (e) {
        this.$message.error('Ops, não foi possível cadastrar este item');
      }
    },

    async resetPrizes() {
      this.reseting = true;

      const allPrizes = this.prizes;

      this.prizes = [];
      this.filteredPrizes = [];

      try {
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

        await this.getPrizes();
      } catch (e) {
        this.$message.error('Ops, não foi possível resetar seus prêmios');
      }
      this.reseting = false;
    },

    setWheelUrl() {
      this.wheelUrl = `${process.env.VUE_APP_URL}/wheel?code=${this.user.code}`;
    }
  }
};
</script>

<style lang="scss">
#wheel-config {
  .el-row {
    margin-bottom: 20px;
  }

  .prizes-card { 
    .el-card__body {
      padding: 5px 10px 15px 10px;
    }

    .header-table {
      width: 100%;
      padding: 10px;
      border-bottom: solid 1px #121820;
      background-color: #262f3a;
      font-size: 14px;
      color: #eee;
      font-weight: 500;
    }

    .handle {
      cursor: move;
    }

    .order-button {
      float: right;
      margin-right: 10px;
    }

    table {
      width: 100%;
      tr {
        td.name {
          min-width: 200px;
        }
        td.message {
          min-width: 200px;
        }
        td.command {
          min-width: 200px;
        }
        td.delay {
          min-width: 70px;
        }
        td.color {
          min-width: 70px;
        }
        td.status {
          min-width: 70px;
        }
        td.actions {
          min-width: 100px;
          text-align: right;
        }
      }
    }
  }

  .prizes-container {
    height: 540px;
    overflow-y: scroll;
  }

  ul {
    list-style: none;
    padding: 0;
    font-size: 14px;
    color: #eee;
    li.list-item {
      padding: 5px 0;
      border-bottom: solid 1px #121820;
      padding: 10px;
      transition: background-color 200ms linear;
      &:hover {
        background-color: #262f3a;
        transition: background-color 200ms linear;
      }
    }
  }

  .search-input {
    float: right;
    width: 300px;
  }

  .top-card {
    min-height: 190px;
  }

  .prize-form {
    display: flex;
    justify-content: space-between;
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    color: #e4e4e4;
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

  .big-label {
    color: #fff;
    label {
      font-size: 20px;
    }
    p {
      font-size: 20px;
      margin-top: 7px;
    }
  }

  .el-form-item {
    margin-bottom: 5px;
  }

  .var-desc p {
    font-size: 12px;
    padding: 5px 0;
    &:first-child {
      padding: 20px 0 5px 0;
    }
  }

  .reset-button {
    margin-top: 15px;
    width: 100%;
  }

  .el-alert, .el-alert p {
    color: #ccc
  }
}
</style>
