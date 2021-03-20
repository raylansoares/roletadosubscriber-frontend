<template>
  <div id="reward-config-container" :class="theme">
    <div id="reward-config-container-inner">
      <el-alert type="info" :closable="false" show-icon class="info-box" :class="theme">
        Primeiro <a :href='`https://dashboard.twitch.tv/u/${this.user.login}/viewer-rewards/channel-points/rewards`' target='_blank'>Clique Aqui</a>
        para cadastrar uma recompensa na Twitch, em seguida cadastre ela aqui no painel com o mesmo nome.
        Quando alguém resgatar a recompensa na Twitch, a ação cadastrada aqui será executada automaticamente.
        Para as ações de dar e remover timeout, quem resgatar a recompensa precisa digitar o nome do alvo no início da mensagem.
        O Bot <strong>RoletaDoSubscriber</strong> precisa ser <strong>Mod</strong> do seu canal para que as ações de dar e remover timeout funcionem.
      </el-alert>
      <NewRewardContainer
        @get-rewards="getRewards()"
      />
      <RewardsTableContainer
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
import NewRewardContainer from '@/components/reward/NewRewardContainer'
import RewardsTableContainer from '@/components/reward/RewardsTableContainer'

export default {
  name: "RewardsConfigContainer",

  components: {
    NewRewardContainer,
    RewardsTableContainer
  },

  computed: {
    ...mapState(['user', 'theme'])
  }
};
</script>

<style lang="scss">
#reward-config-container {
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
  #reward-config-container-inner {
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
      p, a {
        color: var(--color-primary-light);
      }
    }
    &.light {
      p, a {
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
  #reward-config-container {
    #reward-config-container-inner {
      max-width: 1280px;
      align-items: initial;
    }
  }
}
</style>
