<template>
  <div>
    <md-toolbar class="md-primary">
      <span class="md-title">Rose Panel</span>
      <div class="md-toolbar-section-end">
        <md-button to="dashboard"> <md-icon>dashboard</md-icon> Dashboard </md-button>
        <md-button to="wheelConfig"> <md-icon>slow_motion_video</md-icon> Configurar Roleta </md-button>
        <md-button @click="logout()">Sair</md-button>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
import store from '../../store'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  data: () => ({
      showNavigation: false
  }),
  methods: {
    logout () {
      store.commit('SET_USER', {
        expires: ''
      })
      this.$router.push('/login')
    }
  }
}

</script>

<style lang="scss">
</style>
