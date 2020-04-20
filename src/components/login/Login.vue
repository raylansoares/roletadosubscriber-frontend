<template>
  <div id="login">
    <md-card-content id="header">
      <img class="logo" src="@/assets/logo.png" alt="logo">
    </md-card-content>

    <div id="content">
      <md-field>
        <label>Usuário</label>
        <md-input
          type="text"
          id="username"
          v-model="user.username"
          :disabled="loading"
        />
      </md-field>

      <md-field>
        <label>Senha</label>
        <md-input
          type="password"
          id="password"
          v-model="user.password"
          :disabled="loading"
          @keyup.enter="navigate"
        />
      </md-field>
    </div>

    <div id="actions">

      <md-button
        id="login-btn"
        class="md-raised md-primary"
        :disabled="loading"
        @click="navigate"
      >
        <span>Entrar</span>
      </md-button>

      <md-progress-bar v-show="loading" md-mode="indeterminate"></md-progress-bar>

    </div>

    <md-snackbar
      md-position="center"
      :md-duration="snackBar.duration"
      :md-active.sync="snackBar.show"
      md-persistent
    >
      <span> {{ snackBar.message }} </span>
    </md-snackbar>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import store from '@/store/index'

export default {
  name: 'Login',
  props: {
    namedRoute: {
      type: String
    }
  },
  data: () => ({
    main: true,
    loading: false,
    user: {
      username: '',
      password: ''
    },
    snackBar: {
      show: false,
      duration: 4000,
      message: ''
    }
  }),
  methods: {
    navigate () {
      this.loading = true

      /* bypass */
      if (this.user.username === 'admin' && this.user.password === 'admin') {
        const data = {
          username: 'admin',
          name: 'Admin',
          token: 'admin',
          expires: dayjs().add(12, 'hour')
        }
        store.commit('SET_USER', data)
        this.$router.push({ name: this.namedRoute })
        return
      }
      /* bypass */

      this.$http
        .post('/auth', this.user)
        .then((response) => {
          const data = {
            username: response.data.username,
            name: response.data.name,
            token: response.data.token,
            expires: dayjs().add(12, 'hour')
          }

          store.commit('SET_USER', data)
          this.$router.push({ name: this.namedRoute })
        })
        .catch((err) => {
          this.loading = false
          this.snackBar.show = true
          this.snackBar.message = err
        })
    }
  }
}
</script>

<style lang="scss">

#login {
    width: 400px;

    #header {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .logo {
          width: 100px;
        }
    }

    #content {
      padding: 6px 8px;
    }

    #actions {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .md-progress-bar {
          margin: -6px 8px 0 8px;
        }
    }
}

</style>
