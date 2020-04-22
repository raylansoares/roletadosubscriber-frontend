<template>
  <div id="dashboard">
    Dashboard...
  </div>
</template>

<script>
import dayjs from 'dayjs'
import store from '@/store/index'

export default {
  name: 'Dashboard',

  data: () => ({
        subscribers: [],
  }),

  methods: {
    
  },
  sockets: {
    connect() {
      console.log('connect')
    },

    disconnect() {
      console.log('disconnect')
    }
  },
}
</script>

<style lang="scss">
</style>