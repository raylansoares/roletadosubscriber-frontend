<template>
  <div id="table-container" :class="theme">
    <div id="table-header" :class="theme">
      <h3>
        Roletas Resgatadas <small>(Subscribers e Pontos de Canal)</small>
      </h3>
      <input v-model="search" :class="theme" @input="filterSubscribers()">
    </div>
    <div id="table-content">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th :class="theme" class="user">Usuário</th>
            <th :class="theme" class="prize">Prêmio(s)</th>
            <th :class="theme" class="data">Data/Hora</th>
            <th :class="theme" class="actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subscriber, key) of filteredSubscribers" :key="key" :class="theme">
            <td :class="theme" class="user">{{ subscriber.username }}</td>
            <td :class="theme" class="prize">
              <span
                v-for="(prize, index) in subscriber.prizes"
                :key="index"
                class="prize-tag"
              >
                {{ prize.name }}
              </span>
            </td>
            <td :class="theme" class="data">{{ subscriber.created_at | formatDate }}</td>
            <td :class="theme" class="actions">
              <button
                class="btn-circle btn-roll"
                :class="theme"
                @click="retryWheel(subscriber)"
              >
                <i class="material-icons">cached</i>
              </button>
              <button
                class="btn-circle btn-delete"
                :class="theme"
                @click="deleteSubscriber(subscriber._id)"
              >
                <i class="material-icons">close</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
import { mapState } from 'vuex'

dayjs.locale("pt-br");

export default {
  name: "TableContainer",

  computed: {
    ...mapState(['user', 'theme'])
  },

  data: () => ({
    subscribers: [],
    filteredSubscribers: [],
    search: "",
    host: process.env.VUE_APP_SERVER_HOST,
    port: process.env.VUE_APP_SERVER_PORT
  }),

  mounted() {
    this.getSubscribers();
  },

  filters: {
    formatDate: value => dayjs(value).format("DD/MM/YYYY - HH:mm:ss")
  },

  methods: {
    async getSubscribers() {
      const url = '/api/subscribers';

      try {
        const response = await axios.get(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.subscribers = response.data;
        this.filterSubscribers();
      } catch (e) {
        this.$message.error('Ops, não foi possível carregar a lista de subs');
      }
    },

    filterSubscribers() {
      if (this.search) {
        this.filteredSubscribers = this.subscribers.filter(value =>
          value.username.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        this.filteredSubscribers = this.subscribers;
      }
    },

    retryWheel(subscriber) {
      this.$socket.emit("retryWheel", { 
        subscriber: subscriber, code: this.user.code
      });
    },

    async deleteSubscriber(id) {
      const url = `/api/subscribers/${id}`;

      try {
        await axios.delete(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });
        
        this.getSubscribers();
      } catch (e) {
        this.$message.error('Ops, não foi possível excluir este item');
      }
    }
  },

  sockets: {
    selectPrize(data) {
      if (data.code !== this.user.code) return
      this.getSubscribers();
    },

    confirmPrize(data) {
      if (data.code !== this.user.code) return
      this.getSubscribers();
    }
  }
};
</script>

<style lang="scss">
#table-container {
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
  #table-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 10px;
    &.light {
      border-bottom: solid 1px var(--color-line-in-white);
    }
    &.dark {
      border-bottom: solid 1px var(--color-background-darker);
    }
    h3 {
      font-size: 1.4em;
      small {
        font-size: 0.6em;
        font-weight: normal;
        opacity: 0.9;
      }
    }
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
  #table-content {
    height: 100%;
    max-height: 570px;
    overflow: auto;
    table {
      width: 100%;
      text-align: left;
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
        &.user {
          width: 25%;
        }
        &.prize {
          width: 40%;
        }
        &.data {
          width: 25%;
          min-width: 220px;
          display: none;
        }
        &.actions {
          width: 10%;
          min-width: 110px;
        }
      }
      tr {
        transition: background-color 0.2s;
        td {
          padding: 7px 10px;
          .prize-tag {
            padding: 0px 10px;
            margin: 2px;
            border-radius: 3px;
            line-height: 2.0em;
            font-size: 0.9em;
            display: inline-block;
            background-color: var(--color-primary-2);
          }
          .btn-circle {
            border-radius: 50%;
            width: 35px;
            height: 35px;
            padding: 5px;
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
          .btn-roll {
            color: var(--color-primary);
            border: 2px solid var(--color-primary);
            background-color: var(--color-primary-2);
            &:hover {
              background-color: var(--color-primary-4);
            }
          }
          .btn-delete {
            color: var(--color-tertiary);
            border: 2px solid var(--color-tertiary);
            background-color: var(--color-tertiary-2);
            &:hover {
              background-color: var(--color-tertiary-4);
            }
          }
          &.light {
            border-bottom: solid 1px var(--color-line-in-white);
            .prize-tag {
              border: solid 1px var(--color-primary-lighter);
            }
          }
          &.dark {
            border-bottom: solid 1px var(--color-background-darker);
            .prize-tag {
              border: solid 1px var(--color-primary-darker);
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
  #table-container {
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
