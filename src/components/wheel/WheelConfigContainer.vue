<template>
  <div id="wheel-config-container" :class="theme">
    <div id="wheel-config-container-inner">
      <BlocksContainer
        @get-prizes="getPrizes()"
      />
      <NewPrizeContainer
        @get-prizes="getPrizes()"
      />
      <VariablesContainer
      />
      <el-alert
        type="info"
        description="Se o total das porcentagens definidas para os prêmios for igual a 100%, os prêmios com porcentagem automática não serão exibidos corretamente. Defina uma porcentagem para todos os prêmios ou deixe uma porcentagem sobrando para que essa sobra seja utilizada nos prêmios com porcentagem automática."
        :closable="false"
        show-icon
        class="info-box"
        :class="theme"
      ></el-alert>
      <PrizesTableContainer
      />
      <div class="contact" :class="theme">
        <p>
          Tem alguma dúvida ou sugestão? Entre em contato pelo E-mail:
          <strong>contato@roletadosubscriber.com.br</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BlocksContainer from '@/components/wheel/BlocksContainer'
import NewPrizeContainer from '@/components/wheel/NewPrizeContainer'
import PrizesTableContainer from '@/components/wheel/PrizesTableContainer'
import VariablesContainer from '@/components/wheel/VariablesContainer'

export default {
  name: "WheelConfigContainer",

  components: {
    BlocksContainer,
    NewPrizeContainer,
    PrizesTableContainer,
    VariablesContainer
  },

  computed: {
    ...mapState(['user', 'theme'])
  }
};
</script>

<style lang="scss">
#wheel-config-container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  flex: 1;
  &.light {
    background: var(--color-background-light);
  }
  &.dark {
    background: var(--color-background-dark);
  }
  #wheel-config-container-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;    
    max-width: 600px;
    height: 100%;
    padding: 20px 10px;
    flex: 1;
  }
  .info-box {
    margin-top: 15px;
    color: var(--color-primary-dark);
    background-color: var(--color-primary-2);
    border: solid 1px var(--color-primary-4);
    &.dark {
      p {
        color: var(--color-primary-light);
      }
    }
    &.light {
      p {
        color: var(--color-primary-dark);
      }
    }
  }
  .contact {
    text-align: center;
    font-size: 12px;
    margin-top: 20px;
  }
}
@media (min-width:960px) {
  #wheel-config-container {
    #wheel-config-container-inner {
      max-width: 1280px;
      align-items: initial;
    }
  }
}
</style>
