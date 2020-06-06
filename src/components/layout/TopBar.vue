<template>
  <div>
    <el-menu
      :default-active="currentPage"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
      background-color="#409EFF"
      text-color="#f9f9f9"
      active-text-color="#f9f9f9"
    >
      <el-menu-item @click="logout()">
        <i class="el-icon-switch-button"></i> Sair
      </el-menu-item>
      <el-menu-item index="/wheelConfig">
        <i class="el-icon-stopwatch"></i> Configurar Roleta
      </el-menu-item>
      <el-menu-item index="/dashboard">
        <i class="el-icon-pie-chart"></i> Dashboard
      </el-menu-item>
      <el-menu-item class="menu-item-logo">
        <i class="el-icon-stopwatch"></i> Twitch Wheel
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import store from "../../store";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"])
  },

  data: () => ({
    showNavigation: false,
    currentPage: null
  }),

  mounted () {
    this.currentPage = this.$route.path
  },

  methods: {
    logout() {
      store.commit("SET_USER", null);
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
  float: right;
}

.el-menu-item i {
  color: #ffffff;
}

.menu-item-logo {
  float: left !important;
  font-size: 20px;
  font-weight: 500;
  cursor: default;
  i {
    font-size: 28px;
  }
}
</style>
