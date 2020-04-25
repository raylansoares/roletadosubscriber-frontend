<template>
  <div id="dashboard">

    <div class="md-layout">
      <div class="md-layout-item three-cards">
        <md-card>
          <md-card-content>
            <p class="card-title">Roletar manualmente</p>
            <md-field>
              <label>Nome do usuário</label>
              <md-input v-model="username" @keyup.enter="manualWheel" />
            </md-field>
            <md-button
              class="md-dense md-raised md-primary roll-button"
              :disabled="!username"
              @click="manualWheel"
            >
              Roletar
            </md-button>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item three-cards">
        <md-card>
          <md-card-content>
            <p class="card-title">Widget 2</p>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item three-cards">
        <md-card>
          <md-card-content>
            <p class="card-title">Widget 3</p>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <md-table v-model="filteredUsers" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Subscribers</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar usuário..." v-model="search" @input="filterUsers" />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Usuário">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Prêmios">
          <md-chip v-for="(prize, key) in item.prizes" :key="key">{{ prize }}</md-chip>
        </md-table-cell>
        <md-table-cell md-label="Data">{{ item.created_at | formatDate }}</md-table-cell>
        <md-table-cell md-label="Ações">
          <md-button
            id="force-wheel"
            class="md-icon-button md-dense md-raised md-primary"
            @click="retryWheel(item)"
            :disabled="!!item.prizes.length"
            title="Tentar novamente"
          >
            <md-icon>cached</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import store from '@/store/index'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'Dashboard',

  data: () => ({
    subscribers: [],
    filteredUsers: [],
    search: null,
    username: null
  }),

  mounted () {
    this.getSubscribers()
  },

  filters: {
      formatDate: value => (moment(value).format('DD/MM/YYYY - HH:mm:ss'))
  },

  methods: {
    async getSubscribers () {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/subscribers`
      const response = await axios.get(url)
      
      this.subscribers = response.data
      this.filterUsers()
    },

    filterUsers () {
      if (this.search) {
        this.filteredUsers = this.subscribers.filter(value => value.username.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        this.filteredUsers = this.subscribers
      }
    },

    retryWheel (subscriber) {
      this.$socket.emit('retryWheel', subscriber)
    },

    manualWheel () {
      if (!this.username) return
      this.$socket.emit('requestPrize', this.username)
      this.username = null
    }
  },

  sockets: {
    connect() {
      console.log('connect')
    },

    disconnect() {
      console.log('disconnect')
    },

    selectPrize() {
      this.getSubscribers()
    },

    confirmPrize() {
      this.getSubscribers()
    }
  },
}
</script>

<style lang="scss">
  #dashboard {
    width: 100%;
    max-width: 1280px;
    .three-cards {
      &:nth-child(1) {
        margin-right: 10px;
      }
      &:nth-child(2) {
        margin: 0 10px;
      }
      &:nth-child(3) {
        margin-left: 10px;
      }
      .md-card {
        min-height: 170px;
      }
    }
    .md-table {
      display: block;
    }
    .md-chip {
      height: 22px;
      font-size: 12px;
      line-height: 22px;
      margin: 2px;
    }
    .md-card {
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.87)
    }
    .roll-button {
      width: 100%;
      margin: 0;
    }
  }
</style>