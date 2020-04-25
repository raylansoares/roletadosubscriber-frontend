<template>
  <div id="dashboard">
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
    search: null
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
    .md-table {
      display: block;
    }
    .md-chip {
      height: 22px;
      font-size: 12px;
      line-height: 22px;
      margin: 2px;
    }
  }
</style>