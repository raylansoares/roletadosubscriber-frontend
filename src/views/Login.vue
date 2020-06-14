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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
