<template>
  <div id="reward-config-container" :class="theme">
    <div id="reward-config-container-inner">
      <el-alert type="info" :closable="false" show-icon class="info-box" :class="theme">
        <strong>Como funciona?</strong> Selecione uma recompensa e adicione um comando a ela, quando alguém resgatar a recompensa na Twitch, a ação cadastrada aqui será executada automaticamente.
        Para as ações de dar e remover timeout, quem resgatar a recompensa precisa digitar o nome do alvo no início da mensagem.
      </el-alert>
      <el-alert type="info" :closable="false" show-icon class="info-box" :class="theme">
        O Bot <strong>RoletaDoSubscriber</strong> precisa ser <strong>Mod</strong> do seu canal para que as ações de dar e remover timeout funcionem corretamente.
      </el-alert>
      <NewRewardContainer
        @get-rewards="getRewards()"
        :channel-rewards="channelRewards"
      />
      <RewardsTableContainer
        :channel-rewards="channelRewards"
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
import axios from '@/repositories/clients/axios'
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
  },

  data: () => ({
    channelRewards: []
  }),

  mounted() {
    this.getChannelRewards()
  },

  methods: {
    async getChannelRewards () {
      try {
        const baseUrl = 'https://api.twitch.tv/helix/channel_points/custom_rewards'
        const url = `${baseUrl}?broadcaster_id=${this.user.broadcaster_id}`

        const response = await axios.get(url, {
          headers: { 
            'Client-Id': process.env.VUE_APP_CLIENT_ID,
            'Authorization': `Bearer ${this.user.access_token}`
          }
        });
        
        this.channelRewards = response.data.data
      } catch (e) {
        if (e.response && e.response.status && e.response.status === 403) {
          this.$message.error('Ops, seu canal não possui esse recurso');
          return
        }
        this.$message.error('Ops, não foi possível cadastrar este item');
      }
    }
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
