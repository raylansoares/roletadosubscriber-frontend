<template>
  <div id="theme-container">
    <a @click="setTheme('light')" :class="theme === 'light' ? 'active' : ''">
      <i class="material-icons">wb_sunny</i>
    </a>
    <a @click="setTheme('dark')" :class="theme === 'dark' ? 'active' : ''">
      <i class="material-icons">brightness_3</i>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "ThemeContainer",

  computed: {
    ...mapState(['theme'])
  },

  methods: {
    setTheme(theme) {
      this.$emit("set-theme", theme);
    }
  }
};
</script>

<style lang="scss" scoped>
#theme-container {
  width: 100%;
  padding: 20px;
  text-align: right;
  position: fixed;
  a {
    cursor: pointer;
    color: var(--color-text-complement);
    &.active {
      color: var(--color-primary);
    }
  }
}
</style>
