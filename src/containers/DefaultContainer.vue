<template>
  <div id="container">
    <TopBar @set-theme="setTheme($event)" />
    <router-view />
  </div>
</template>

<script>
import TopBar from "@/components/layout/TopBar";

export default {
  name: "DefaultContainer",

  components: {
    TopBar
  },

  methods: {
    setTheme(theme) {
      this.$store.commit("SET_THEME", theme);
    }
  }
};
</script>

<style lang="scss">
#container {
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent !important;
}
</style>
