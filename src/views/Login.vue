<template>
  <div class="container">
    <Login />
  </div>
</template>

<script>
import Login from "@/components/login/Login.vue";

export default {
  name: "LoginView",

  components: {
    Login
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
