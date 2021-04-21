<template>
  <div id="blocks-container">
    <div class="block center" :class="theme">
      <img :src="user.profile_image_url" />
      <h3>{{ user.display_name }}</h3>
    </div>
    <div class="block" :class="theme">
      <h3>Roletar Manualmente</h3>
      <input
        type="text"
        v-model="username"
        :class="theme"
        placeholder="Nome do usuário na Twitch"
      >
      <button class="roll-btn" @click="manualWheel()">Roletar</button>
    </div>
    <div class="block" :class="theme">
      <el-badge value="novo" class="item" :class="theme">
        <h3>Pontos de Canal </h3>
      </el-badge>
      <p>
        Agora você pode integrar os pontos de canal da Twitch com a
        Roleta do Subscriber! Além da roleta, você também pode configurar
        comandos de dar e remover timeout.
        <router-link to="/rewardsConfig" :class="theme">
           Clique aqui
        </router-link>
        para mais detalhes.
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "BlocksContainer",

  computed: {
    ...mapState(['user', 'theme'])
  },

  data: () => ({
    username: null
  }),

  methods: {
    manualWheel() {
      if (!this.username) return;
      this.$socket.emit("requestPrize", { 
        username: this.username,
        code: this.user.code,
        origin: 'Manual',
        quantity: null,
        message: null
      });
      this.username = null;
    }
  }
};
</script>

<style lang="scss">
#blocks-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  .block {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
    max-width: 600px;
    min-height: 170px;
    padding: 20px;
    border-radius: 5px;
    font-size: 0.90em;
    &.light {
      color: var(--color-text-base);
      background-color: var(--color-box-light);
      border: solid 1px var(--color-line-in-white);
    }
    &.dark {
      color: var(--color-text-complement);
      background-color: var(--color-box-dark);
      border: solid 1px var(--color-background-darker);
    }
    &.center {
      justify-content: center;
      align-items: center;
    }
    h3 {
      margin-bottom: 5px;
      font-size: 1.5em;
    }
    strong {
      font-size: 1.1em;
    }
    img {
      width: 80px;
      border-radius: 50%;
    }
    input {
      margin: 5px 0 10px 0;
      padding: 9px 10px;
      border: 1px solid var(--color-line-in-white);
      border-radius: 5px;
      &:focus {
        outline:0;
      }
      &.light {
        color: var(--color-text-base);
        background-color: var(--color-box-light);
        border: solid 1px var(--color-line-in-white);
      }
      &.dark {
        color: var(--color-text-complement);
        background-color: var(--color-background-dark);
        border: solid 1px var(--color-background-darker);
      }
    }
    button.roll-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-title-in-primary);
      padding: 9px 5px;
      border: none;
      border-radius: 5px;
      background-color: var(--color-primary-dark);
      font-size: 1.2em;
      transition: background-color 0.2s;
      cursor: pointer;
      &:focus {
        outline:0;
      }
      &:hover {
        background-color: var(--color-primary-darker);
      }
    }
  }
}
@media (min-width:960px) {
  #blocks-container {
    justify-content: space-between;
    flex-direction: row;
    align-items: inherit;
    .block {
      margin: 0;
      width: 32%;
      max-width: 400px;
    }
  }
}
</style>
