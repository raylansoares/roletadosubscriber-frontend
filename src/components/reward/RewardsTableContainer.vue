<template>
  <div id="rewards-table-container" :class="theme">
    <div id="table-header" :class="theme">
      <h3>
        Recompensas de Pontos de Canal
      </h3>
      <div class="search">
        <button
          class="default-btn example-btn"
          @click="showExample = true"
        >
          <i class="material-icons">assignment_turned_in</i> Ver Exemplo
        </button>
        <input
          v-model="search"
          :class="theme"
          :disabled="!!selectedItem"
          @input="filterRewards()"
          placeholder="Buscar por nome da recompensa"
        >
      </div>
    </div>
    <div id="table-content">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th :class="theme" class="name">Nome</th>
            <th :class="theme" class="type">Tipo</th>
            <th :class="theme" class="action">Ação</th>
            <th :class="theme" class="time">Tempo</th>
            <th :class="theme" class="actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="theme" v-for="reward in filteredRewards" :key="reward._id">
            <td :class="theme" class="name">
              <span v-if="selectedItem !== reward._id">
                {{ reward.name }}
              </span>
              <span v-else>
                <select
                  class="edit-reward-select"
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
                    :value="item.title">
                  </option>
                </select>
              </span>
            </td>
            <td :class="theme" class="type">
              <span v-if="selectedItem !== reward._id">
                {{ getTypeLabel(reward.type) }}
              </span>
              <span v-else>
                <select
                  class="edit-reward-select"
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
                    :value="item.value">
                  </option>
                </select>
              </span>
            </td>
            <td :class="theme" class="action">
              <span v-if="selectedItem !== reward._id">
                {{ getActionLabel(reward.action) }}
              </span>
              <span v-else>
                <select
                  class="edit-reward-select"
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
              </span>
            </td>
            <td :class="theme" class="time">
              <span v-if="selectedItem !== reward._id">
                {{ reward.time }}
              </span>
              <span v-else>
                <input
                  type="number"
                  min="0"
                  v-model="reward.time"
                  class="edit-reward-input"
                  :class="theme"
                  :disabled="reward.action !== 'timeout'"
                >
              </span>
            </td>
            <td :class="theme" class="actions">
              <button
                class="btn-circle btn-edit"
                :class="theme"
                :disabled="!!selectedItem && selectedItem !== reward._id"
                @click="editReward(reward)"
              >
                <i
                  class="material-icons"
                  v-if="selectedItem && selectedItem === reward._id"
                >
                  check
                </i>
                <i class="material-icons" v-else>edit</i>
              </button>
              <button
                class="btn-circle btn-delete"
                :class="theme"
                :disabled="!!selectedItem"
                @click="deleteReward(reward._id)"
              >
                <i class="material-icons">close</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog :visible.sync="showExample" center custom-class="example-modal" :show-close="false">
      <p><img src="../../assets/images/rewardsExample.png"></p>
      <span slot="footer" class="dialog-footer">
        <button
          class="default-btn close-modal-btn example-btn"
          @click="showExample = false"
        >Fechar</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'

export default {
  name: "RewardsTableContainer",

  computed: {
    ...mapState(['user', 'theme'])
  },

  props: {
    channelRewards: Array
  },

  data: () => ({
    rewards: [],
    filteredRewards: [],
    search: null,
    selectedItem: null,
    showExample: false,
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

  mounted() {
    this.getRewards();
  },

  created () {
    EventBus.$on('get-rewards', () => {
      this.getRewards();
    })
  },

  methods: {
    async getRewards() {
      const url = '/api/rewards';

      try {
        const response = await axios.get(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.rewards = response.data;
        this.filterRewards();
        if (!response.data.length) EventBus.$emit('reset-rewards')
      } catch (e) {
        this.$message.error(`Algo deu errado! Se o erro persistir, clique
          em sair e faça login novamente`);
      }
    },

    filterRewards() {
      if (this.search) {
        this.filteredRewards = this.rewards.filter(value =>
          value.name.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        this.filteredRewards = this.rewards;
      }
    },

    async deleteReward(id) {
      const url = `/api/rewards/${id}`;

      try {
        await axios.delete(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.getRewards();
      } catch (e) {
        this.$message.error('Ops, não foi possível excluir este item');
      }
    },

    async editReward(item) {
      if (this.selectedItem !== item._id) {
        this.selectedItem = item._id;
        return;
      }

      const sameReward = this.rewards.find(
        reward => reward.name === item.name && reward._id !== item._id
      )

      if (sameReward || !this.validReward(item)) return

      await this.updateReward(item)

      this.selectedItem = null;
    },

    async updateReward (item) {
      const url = `/api/rewards/${item._id}`;

      try {
        await axios.patch(url, item, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });
      } catch (e) {
        this.$message.error('Ops, não foi possível editar este item');
      }
    },

    validReward (reward) {
      if (!reward.name || !reward.type) return false
      if (reward.type === 'command' && !reward.action) return false
      if (reward.action === 'timeout' && !reward.time) return false
      return true
    },

    getTypeLabel (type) {
      const rewardType = this.rewardTypes.find(reward => reward.value === type)
      return rewardType ? rewardType.label : type
    },

    getActionLabel (action) {
      const rewardAction = this.rewardActions.find(reward => reward.value === action)
      return rewardAction ? rewardAction.label : action
    }
  }
};
</script>

<style lang="scss">
#rewards-table-container {
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
  .example-btn {
    color: var(--color-title-in-primary);
    background-color: var(--color-primary-dark);
    &:hover {
      background-color: var(--color-primary-darker);
    }
  }
  .example-modal {
    background-color: transparent;
    box-shadow: none;
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
    .search {
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
    }
  }
  #table-content {
    height: 100%;
    max-height: 570px;
    overflow: auto;
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
          width: 30%;
        }
        &.type {
          width: 20%;
        }
        &.action {
          width: 20%;
        }
        &.time {
          width: 10%;
        }
        &.actions {
          width: 10%;
        }
        .edit-reward-input, .edit-reward-select {
          padding: 6px 10px;
          width: 100%;
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
        .edit-reward-select {
          height: 37px;
        }
      }
      tr {
        transition: background-color 0.2s;
        td {
          padding: 7px 10px;
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
          .btn-edit {
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
          }
          &.dark {
            border-bottom: solid 1px var(--color-background-darker);
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
  #rewards-table-container {
    max-width: 100%;
    height: 100%;
  }
}
</style>
