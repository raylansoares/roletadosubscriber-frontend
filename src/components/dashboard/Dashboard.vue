<template>
  <div id="dashboard-container" :class="theme">
    <div id="dashboard-container-inner">
      <div id="blocks-container">
        <div class="block center" :class="theme">
          <img :src="user.profile_image_url" />
          <h3>{{ user.display_name }}</h3>
        </div>
        <div class="block" :class="theme">
          <h3>Roletar Manualmente</h3>
          <input type="text" v-model="username" :class="theme">
          <button @click="manualWheel()">Roletar</button>
        </div>
        <div class="block" :class="theme">
          <h3>Pontos de Canal</h3>
          <p>
            Para integrar a roleta com os pontos do canal basta adicionar
            uma recompensa personalizada exatamente com o seguinte nome:
            <br /><strong>Ganhe uma roleta do subscriber</strong>
          </p>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale("pt-br");

export default {
  name: "Dashboard",

  computed: {
    ...mapState(['user', 'theme'])
  },

  data: () => ({
    subscribers: [],
    filteredSubscribers: [],
    search: "",
    username: null,
    command: '!sorteio',
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

    manualWheel() {
      if (!this.username) return;
      this.$socket.emit("requestPrize", { 
        username: this.username, code: this.user.code 
      });
      this.username = null;
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
    },

    openRaffle () {},
    closeRaffle () {}
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
#dashboard-container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  flex: 1;
  &.light {
    background: var(--color-background-light);
  }
  &.dark {
    background: var(--color-background-dark);
  }
  #dashboard-container-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1280px;
    height: 100%;
    padding: 20px 10px;
    flex: 1;
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
        &.center {
          justify-content: center;
          align-items: center;
        }
        h3 {
          margin-bottom: 5px;
          font-size: 1.5em;
        }
        strong {
          font-size: 1.1em;
        }
        img {
          width: 80px;
          border-radius: 50%;
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
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--color-title-in-primary);
          padding: 9px 5px;
          border: none;
          border-radius: 5px;
          background-color: var(--color-primary);
          font-size: 1.2em;
          transition: background-color 0.2s;
          cursor: pointer;
          &:focus {
            outline:0;
          }
          &:hover {
            background-color: var(--color-primary-dark);
          }
        }
      }
    }
    #table-container {
      margin-top: 20px;
      padding: 15px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 600px;
      /* flex: 1; */
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
  }
}
@media (min-width:960px) {
  #dashboard-container {
    #dashboard-container-inner {
      align-items: initial;
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
  }
}
</style>
