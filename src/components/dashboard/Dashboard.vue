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
        <md-table-cell md-label="Usuário" md-sort-by="user">{{ item.user }}</md-table-cell>
        <md-table-cell md-label="Prêmio" md-sort-by="prize">{{ item.prize }}</md-table-cell>
        <md-table-cell md-label="Data" md-sort-by="created_at">{{ item.created_at }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import store from '@/store/index'
import axios from 'axios'

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

  methods: {
    async getSubscribers () {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/subscribers`
      const response = await axios.get(url)
      
      this.subscribers = response.data
      this.filterUsers()
    },

    filterUsers () {
      if (this.search) {
        this.filteredUsers = this.subscribers.filter(value => value.user.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        this.filteredUsers = this.subscribers
      }
    }
  },

  sockets: {
    connect() {
      console.log('connect')
    },

    disconnect() {
      console.log('disconnect')
    },

    confirmPrize(data) {
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
  }
</style>