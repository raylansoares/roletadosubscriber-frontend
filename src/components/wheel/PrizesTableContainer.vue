<template>
  <div id="prizes-table-container" :class="theme">
    <div id="table-header" :class="theme">
      <h3>
        Prêmios da Roleta
      </h3>
      <div class="search-sort-preview">
         <button
          class="default-btn preview-btn"
          @click="showPreview()"
          :disabled="selectedItem || sort"
        >
          <i class="material-icons">visibility</i> Visualizar Roleta
        </button>
        <button
          class="default-btn"
          :class="sort ? `sorting-btn ${theme}` : theme"
          @click="togleSort()"
          :disabled="!!selectedItem || sorting"
        >
          <i class="material-icons" v-if="sort">check</i>
          <i class="material-icons" v-else>reorder</i>
          {{ sort ? 'Salvar Ordernção' : 'Alterar Ordernção' }}
        </button>
        <input
          v-model="search"
          :class="theme"
          :disabled="sort || !!selectedItem"
          @input="filterPrizes()"
          placeholder="Buscar por nome do prêmio"
        >
      </div>
    </div>
    <div id="table-content">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th :class="theme" class="name">Nome</th>
            <th :class="theme" class="message">Mensagem</th>
            <th :class="theme" class="command">Comando</th>
            <th :class="theme" class="delay">Delay</th>
            <th :class="theme" class="color">Cor</th>
            <th :class="theme" class="text-color">Texto</th>
            <th :class="theme" class="status">Status</th>
            <th :class="theme" class="size">Porcentagem</th>
            <th :class="theme" class="actions">Ações</th>
          </tr>
        </thead>
      </table>
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
            <table border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr :class="theme">
                  <td :class="theme" class="name">
                    <span v-if="selectedItem !== prize._id">
                      {{ prize.name }}
                    </span>
                    <span v-else>
                      <input
                        type="text"
                        v-model="prize.name"
                        class="edit-prize-input"
                        :class="theme"
                      >
                    </span>
                  </td>
                  <td :class="theme" class="message">
                    <span v-if="selectedItem !== prize._id">
                      {{ prize.message }}
                    </span>
                    <span v-else>
                      <input
                        type="text"
                        v-model="prize.message"
                        class="edit-prize-input"
                        :class="theme"
                      >
                    </span>
                  </td>
                  <td :class="theme" class="command">
                    <span v-if="selectedItem !== prize._id">
                      {{ prize.command }}
                    </span>
                    <span v-else>
                      <input
                        type="text"
                        v-model="prize.command"
                        class="edit-prize-input"
                        :class="theme"
                      >
                    </span>
                  </td>
                  <td :class="theme" class="delay">
                    <span v-if="selectedItem !== prize._id">
                      {{ prize.delay }}
                    </span>
                    <span v-else>
                      <input
                        type="number"
                        min="0"
                        v-model="prize.delay"
                        class="edit-prize-input"
                        :class="theme"
                      >
                    </span>
                  </td>
                  <td :class="theme" class="color">
                    <span
                      v-if="selectedItem !== prize._id"
                      class="color-block"
                      :style="`background-color: ${prize.color}`"
                    ></span>
                    <el-color-picker v-else v-model="prize.color">
                    </el-color-picker>
                  </td>
                  <td :class="theme" class="text-color">
                    <span
                      v-if="selectedItem !== prize._id"
                      class="color-block"
                      :style="`background-color: ${prize.text_color}`"
                    ></span>
                    <el-color-picker v-else v-model="prize.text_color">
                    </el-color-picker>
                  </td>
                  <td :class="theme" class="status">
                    <span
                      v-if="selectedItem !== prize._id"
                      class="status-tag"
                      :class="prize.enabled ? 'enabled' : 'disabled'"
                    >
                      {{ prize.enabled ? "Ativo" : "Inativo" }}
                    </span>
                    <span class="status-change" v-else>
                      <i
                        class="material-icons status-on"
                        v-if="prize.enabled"
                        @click="prize.enabled = false"
                      >
                        toggle_on
                      </i>
                      <i
                        class="material-icons status-off"
                        v-else
                        @click="prize.enabled = true"
                      >
                        toggle_off
                      </i>
                    </span> 
                  </td>
                  <td :class="theme" class="size">
                    <span v-if="selectedItem !== prize._id">
                      {{ prize.size ? prize.size + '%' : 'Automática' }}
                    </span>
                    <span v-else>
                      <el-slider
                        v-model="prize.size"
                        :step="1"
                      >
                      </el-slider>
                    </span>
                  </td>
                  <td :class="theme" class="actions">
                    <button
                      class="btn-circle btn-sort handle"
                      :class="theme"
                      v-if="sort"
                      :disabled="sorting"
                    >
                      <i class="material-icons">reorder</i>
                    </button>
                    <button
                      class="btn-circle btn-edit"
                      :class="theme"
                      :disabled="!!selectedItem && selectedItem !== prize._id"
                      v-if="!sort"
                      @click="editPrize(prize)"
                    >
                      <i
                        class="material-icons"
                        v-if="selectedItem && selectedItem === prize._id"
                      >
                        check
                      </i>
                      <i class="material-icons" v-else>edit</i>
                    </button>
                    <button
                      class="btn-circle btn-delete"
                      :class="theme"
                      :disabled="!!selectedItem"
                      v-if="!sort"
                      @click="deletePrize(prize._id)"
                    >
                      <i class="material-icons">close</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </transition-group>
      </draggable>
    </div>
    <el-dialog :visible.sync="preview" center custom-class="wheel-modal" :show-close="false">
      <div class="pointer">
        <i class="material-icons">place</i>
      </div>
      <canvas id="canvas" width="500" height="500">
        <p style="color: white" align="center">
          Sorry, your browser doesn't support canvas. Please try another.
        </p>
      </canvas>
      <span slot="footer" class="dialog-footer">
        <button
          class="default-btn close-modal-btn preview-btn"
          @click="preview = false"
        >Fechar</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import * as Winwheel from "../../assets/scripts/Winwheel";

export default {
  name: "PrizesTableContainer",

  components: {
    draggable
  },

  computed: {
    ...mapState(['user', 'theme']),
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
    selectedItem: null,
    drag: false,
    sort: false,
    sorting: false,
    preview: false,
    segments: [],
    theWheel: null
  }),

  mounted() {
    this.getPrizes();
  },

  created () {
    EventBus.$on('get-prizes', () => {
      this.getPrizes();
    })
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
        if (!response.data.length) EventBus.$emit('reset-prizes')
      } catch (e) {
        this.$message.error(`Algo deu errado! Se o erro persistir, clique
          em sair e faça login novamente`);
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

      const filteredPrizes = this.prizes.filter(prize => {
        return prize._id !== id && prize.enabled
      })

      const filteredTotalPercentages = filteredPrizes.reduce(
        (total, prize) => total + (prize.size ? prize.size : 0), 0
      );

      const filteredHasAutoSize = filteredPrizes.filter(prize => !prize.size)

      if (filteredTotalPercentages < 100 && !filteredHasAutoSize.length) {
        this.$message.error({
          message: `A porcentagem total dos prêmios ativos não pode ser menor que
            100%. Ajuste a porcentagem dos outros prêmios antes de excluir este.
            Total sem este prêmio: ${filteredTotalPercentages}%`,
          duration: 10000,
          showClose: true
        });
        return
      }

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

      if (item.enabled) {
        const enabledPrizes = this.prizes.filter(prize => prize.enabled)

        const totalPercentages = enabledPrizes.reduce(
          (total, prize) => total + (prize.size ? prize.size : 0), 0
        );

        const hasAutoSize = enabledPrizes.filter(prize => !prize.size)

        if (totalPercentages > 100) {
          this.$message.error({
            message: `A porcentagem total dos prêmios ativos não pode
              ultrapassar 100%. Total atual: ${totalPercentages}%`,
            duration: 5000,
            showClose: true
          });
          return
        }

        if (totalPercentages < 100 && !hasAutoSize.length) {
          this.$message.error({
            message: `A porcentagem total dos prêmios ativos não pode ser menor
              que 100%. Deixe em "0" caso queira definir a porcentagem desse
              prêmio como automática. Total atual: ${totalPercentages}%`,
            duration: 10000,
            showClose: true
          });
          return
        }
      } else {
        const filteredPrizes = this.prizes.filter(prize => {
          return prize._id !== item._id && prize.enabled
        })

        const filteredTotalPercentages = filteredPrizes.reduce(
          (total, prize) => total + (prize.size ? prize.size : 0), 0
        );

        const filteredHasAutoSize = filteredPrizes.filter(prize => !prize.size)

        if (filteredTotalPercentages < 100 && !filteredHasAutoSize.length) {
          this.$message.error({
            message: `A porcentagem total dos prêmios ativos não pode ser menor
              que 100%. Ajuste a porcentagem dos outros prêmios antes de
              desativar este. Total sem este prêmio: ${filteredTotalPercentages}%`,
            duration: 10000,
            showClose: true
          });
          return
        }
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

    initWheel () {
      this.theWheel = new Winwheel.Winwheel({});
      this.theWheel.rotationAngle = 0;
      this.theWheel.draw(); 

      this.segments = this.formatSegments(this.prizes);

      this.theWheel = new Winwheel.Winwheel({
        textFontSize: 19,
        numSegments: this.segments.length,
        segments: this.segments,
        innerRadius: 8
      });
    },

    showPreview () {
      this.preview = true
      setTimeout(() => {
        this.initWheel();
      }, 500);
    },

    formatSegments(data) {
      const enabledItems = data.filter(item => item.enabled === true);

      return enabledItems.map(item => {
        return {
          fillStyle: item.color,
          text: item.name,
          textFillStyle: item.text_color,
          size: item.size ? this.winwheelPercentToDegrees(item.size) : null
        };
      });
    },

    winwheelPercentToDegrees(percentValue) {
      let degrees = 0;

      if ((percentValue > 0) && (percentValue <= 100)) {
          const divider = (percentValue / 100);
          degrees = (360 * divider);
      }

      return degrees;
    },
  }
};
</script>

<style lang="scss">
#prizes-table-container {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
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
  .default-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 10px;
    border: none;
    border-radius: 5px;
    font-size: 0.8em;
    transition: background-color 0.2s;
    margin: 5px 10px;
    color: var(--color-title-in-primary);
    i {
      padding-right: 10px;
    }
    &.light {
      background-color: var(--color-text-base);
    }
    &.dark {
        background-color: var(--color-text-title);
    }
    cursor: pointer;
    &:focus {
      outline:0;
    }
    &:hover {
      &.light {
        background-color: var(--color-text-title);
      }
      &.dark {
        background-color: var(--color-text-base);
      }
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
  .preview-btn {
    color: var(--color-title-in-primary);
    background-color: var(--color-primary-dark);
    &:hover {
      background-color: var(--color-primary-darker);
    }
  }
  .wheel-modal {
    background-color: transparent;
    box-shadow: none;
    .el-dialog__body {
      text-align: center;
      padding: 0;
      display: flex;
      justify-content: center;
    }
    .el-dialog__footer {
      display: flex;
      justify-content: center;
    }
    .pointer {
      margin-top: 210px;
      width: 100%;
      text-align: center;
      position: fixed;
      i {
        color: var(--color-primary);
        font-size: 64px;
        opacity: 0.9;
        transform: rotate(180deg);
        -webkit-text-stroke: 2px var(--color-primary-lighter);
      }
    }
    .wheel-canvas {
      text-align: center;
    }
    #canvas {
      margin-top: 0;
    }
  }
  .close-modal-btn {
    padding: 10px 15px;
    font-size: 1em;
  }
  #table-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 10px;
    &.light {
      border-bottom: solid 1px var(--color-line-in-white);
    }
    &.dark {
      border-bottom: solid 1px var(--color-background-darker);
    }
    h3 {
      font-size: 1.4em;
    }
    .search-sort-preview {
      display: flex;
      justify-content: center;
      input {
        padding: 7px 10px;
        width: 300px;
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
      .sorting-btn {
        color: var(--color-title-in-primary);
        background-color: var(--color-primary);
        &:hover {
          background-color: var(--color-primary-dark);
        }
      }
    }
  }
  #table-content {
    height: 100%;
    max-height: 570px;
    overflow: auto;
    ul {
      padding: 0;
      .list-item {
        list-style: none;
      }
    }
    table {
      width: 100%;
      text-align: left;
      font-size: 0.9em;
      tr th {
        &.light {
          background-color: var(--color-line-in-white)
        }
        &.dark {
          background-color: var(--color-background-darker)
        }
      }
      tr th, tr td {
        padding: 15px 10px;
        &.name {
          width: 20%;
        }
        &.message {
          width: 16%;
        }
        &.command {
          width: 16%;
        }
        &.delay {
          width: 7%;
        }
        &.color {
          width: 5%;
        }
        &.text-color {
          width: 5%;
        }
        &.status {
          width: 6%;
        }
        &.size {
          width: 15%;
        }
        &.actions {
          width: 10%;
        }
        .color-block {
          display: block;
          width: 30px;
          height: 30px;
          border: 1px solid var(--color-text-base);
        }
        .el-color-picker {
          margin: 2px 0 -2px 0px;
          .el-color-picker__trigger {
            height: 35px;
            width: 35px;
            padding: 2px;
            margin: 1px 0 -4px 0;
          }
        }
        input.edit-prize-input {
          padding: 6px 10px;
          width: 100%;
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
        .status-change {
          display: block;
          margin: -15px 0 -25px 0px;
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
      tr {
        transition: background-color 0.2s;
        td {
          padding: 7px 10px;
          .status-tag {
            padding: 0px 5px;
            margin: 2px;
            border-radius: 3px;
            line-height: 2.0em;
            font-size: 0.9em;
            display: inline-block;
            min-width: 55px;
            text-align: center;
            &.enabled {
              background-color: var(--color-primary-2);
            }
            &.disabled {
              background-color: var(--color-tertiary-2);
            }
          }
          .btn-circle {
            border-radius: 50%;
            width: 33px;
            height: 33px;
            padding: 5px 5px 5px 4px;
            margin: 2px 3px;
            cursor: pointer;
            transition: background-color 0.2s;
            &:focus {
              outline:0;
            }
            i {
              font-size: 1.4em;
            }
          }
          .btn-edit, .btn-sort {
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
            background-color: var(--color-primary-2);
            &:hover {
              background-color: var(--color-primary-4);
            }
            &:disabled {
              color: var(--color-primary-4);
              border: 1px solid var(--color-primary-4);
              cursor: not-allowed;
            }
          }
          .btn-sort {
            cursor: move;
          }
          .btn-delete {
            color: var(--color-tertiary);
            border: 1px solid var(--color-tertiary);
            background-color: var(--color-tertiary-2);
            &:hover {
              background-color: var(--color-tertiary-4);
            }
            &:disabled {
              color: var(--color-tertiary-4);
              border: 1px solid var(--color-tertiary-4);
              cursor: not-allowed;
            }
          }
          &.light {
            border-bottom: solid 1px var(--color-line-in-white);
            .status-tag {
              &.enabled {
                border: solid 1px var(--color-primary-lighter);
              }
              &.disabled {
                border: solid 1px var(--color-tertiary-lighter);
              }
            }
          }
          &.dark {
            border-bottom: solid 1px var(--color-background-darker);
            .status-tag {
              &.enabled {
                border: solid 1px var(--color-primary-darker);
              }
              &.disabled {
                border: solid 1px var(--color-tertiary-darker);
              }
            }
          }
        }
      }
      tr:hover {
        &.light {
          background-color: var(--color-background-light);
        }
        &.dark {
          background-color: var(--color-background-dark);
        }
      }
    }
  }
}
@media (min-width:960px) {
  #prizes-table-container {
    max-width: 100%;
    height: 100%;
    #table-content {
      table {
        tr th, tr td {
          &.data {
            display: table-cell;
          }
        }
      }
    }
  }
}
</style>
