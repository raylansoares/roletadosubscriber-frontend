<template>
  <div id="variables-container">
    <div class="block" :class="theme">
      <p class="title">
        <strong>Variáveis disponíveis:</strong>
        <span class="tooltip">
          <i class="material-icons">help_outline</i>
          <span class="tooltiptext">
            Utilize as variáveis na mensagem ou no comando dos prêmios.
          </span>
        </span>
      </p>
      <p>
        <strong>{user}</strong>
        - Exibe o nome do subscriber
      </p>
      <p>
        <strong>{prize}</strong>
        - Exibe o nome do prêmio
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
  align-items: center;
  margin-top: 0;
  width: 100%;
  .block {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
    max-width: 600px;
    padding: 20px;
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
      padding: 3px 0;
      &.title {
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
@media (min-width:960px) {
  #variables-container {
    margin-top: 20px;
    .block {
      margin: 0;
      max-width: none;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
