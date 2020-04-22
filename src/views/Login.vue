<template>
  <div id="container">
    <div class="md-layout">
      <div id="login-form" class="md-layout md-layout-item md-alignment-center">
        <div class="md-layout-item">
          <Login :named-route="namedRoute" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from '@/components/login/Login.vue'

export default {
  name: 'LoginView',
  components: {
    Login
  },
  data () {
    return {
      namedRoute: 'Dashboard'
    }
  }
}
</script>

<style scoped>
  #container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
    padding-bottom: 10%;
  }
</style>
