<template>
  <div id="contact-container" :class="theme">
    <div id="contact-container-inner">
      <h2 class="title" :class="theme">Contato</h2>
      <div class="description" :class="theme">
        <p>Tem alguma dúvida ou sugestão? Entre em contato pelo E-mail:</p>
        <strong>contato@roletadosubscriber.com.br</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "ContactContainer",

  computed: {
    ...mapState(['theme'])
  }
};
</script>

<style lang="scss" scoped>
#contact-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  &.light {
    background: var(--color-background-lighter);
  }
  &.dark {
    background: var(--color-background-darker);
  }
  #contact-container-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 40px 0 60px 0;
    max-width: 1150px;
    .title {
      font-size: 3em;
      padding: 10px 20px;
      color: var(--color-primary);
      &.light {
        color: var(--color-primary);
      }
      &.dark {
        color: var(--color-title-in-dark);
      }
    }
    .description {
      padding: 10px 20px;
      font-size: 1.1em;
      &.light {
        color: var(--color-primary-dark);
      }
      &.dark {
        color: var(--color-text-complement);
      }
    }
  }
}
</style>
