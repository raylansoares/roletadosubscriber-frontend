<template>
  <div id="top-bar-container" :class="theme">
    <div id="logo-container">
      <img src="../../assets/images/logo.svg" alt="Roleta do Subscriber">
    </div>
    <div id="logo-container-small">
      <img src="../../assets/images/logo_small.svg" alt="Roleta do Subscriber">
    </div>
    <div id="menu-container">
      <router-link to="/dashboard" :class="theme">
        <i class="material-icons">table_chart</i> Painel
      </router-link>
      <router-link to="/wheelConfig" :class="theme">
        <i class="material-icons">settings</i> Configurar Roleta
      </router-link>
      <a @click="logout()" :class="theme">
        <i class="material-icons">power_settings_new</i> Sair
      </a>
      <div id="theme-container">
        <a @click="setTheme('light')" :class="theme === 'light' ? 'active' : ''">
          <i class="material-icons">wb_sunny</i>
        </a>
        <a @click="setTheme('dark')" :class="theme === 'dark' ? 'active' : ''">
          <i class="material-icons">brightness_3</i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store';
import { mapState } from 'vuex';

export default {
  name: "TopBarContainer",

  computed: {
    ...mapState(['user', 'theme'])
  },

  data: () => ({
    showNavigation: false,
    currentPage: null
  }),

  mounted () {
    this.currentPage = this.$route.path

    // Temporary force logout to get new token
    if ('min_bits_to_wheel' in this.user === false) {
      this.logout()
    }
  },

  methods: {
    logout() {
      store.commit("SET_USER", null);
      this.$router.push("/");
    },

    setTheme(theme) {
      this.$emit("set-theme", theme);
    }
  }
};
</script>

<style lang="scss" scoped>
#top-bar-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  text-align: right;
  position: fixed;
  z-index: 9;
  &.light {
    background: var(--color-background-light);
    border-bottom: solid 1px var(--color-line-in-white);
  }
  &.dark {
    background: var(--color-background-dark);
    border-bottom: solid 1px var(--color-background-darker);
  }
  #logo-container {
    height: 30px;
    display: none;
  }
  #logo-container-small {
    height: 30px;
    display: block;
  }
  #menu-container {
    display: flex;
    min-width: 466px;
    width: 100%;
    justify-content: space-around;
    a {
      display: flex;
      padding: 0 15px;
      cursor: pointer;
      text-decoration: none;
      color: var(--color-text-base);
      i {
        margin-right: 5px;
      }
      &:active {
        color: var(--color-text-base);
      }
      &.dark, &.dark &:active{
        color: var(--color-text-complement);
      }
    }
  }
  #theme-container {
    margin: 0 5px 0 25px;
    a {
      i {
        margin: 0;
      }
      display: inline;
      padding: 0;
      cursor: pointer;
      color: var(--color-text-complement);
      &.active {
        color: var(--color-primary);
      }
    }
  }
}
@media (min-width:960px) {
  #top-bar-container {
    #menu-container {
      min-width: none;
      width: auto;
      justify-content: flex-end;
    }
    #logo-container {
      display: block;
    }
    #logo-container-small {
      display: none;
    }
  }
}
</style>
