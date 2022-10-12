<template>
  <div id="variables-container">
    <div class="block" :class="theme">
      <p class="title">
        <strong>Variáveis disponíveis para utilizar na mensagem ou comando:</strong>
      </p>
      <p>
        <strong>{user}</strong>
        - Exibe o nome do usuário que ganhou a roleta
      </p>
      <p>
        <strong>{prize}</strong>
        - Exibe o nome do prêmio que o usuário ganhou
      </p>
      <p>
        <strong>@2</strong>
        - Comando para roletar mais 2x
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "VariablesContainer",

  computed: {
    ...mapState(['theme'])
  },
}
</script>

<style lang="scss">
#variables-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin: 0 8px;
  width: auto;
  .block {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
    max-width: 600px;
    padding: 10px;
    border-radius: 5px;
    font-size: 0.90em;
    justify-content: space-between;
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
    h3 {
      margin-bottom: 5px;
      font-size: 1.5em;
    }
    p {
      text-align: left;
      padding: 3px 0;
      font-size: 12px;
      &.title {
        padding: 0 0 6px 0;
        display: flex;
        .tooltip i {
          cursor: default;
        }
      }
    }
    strong {
      font-size: 1.1em;
    }
  }
}
</style>
