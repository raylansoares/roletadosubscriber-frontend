<template>
  <div id="dashboard-container" :class="theme">
    <div id="dashboard-container-inner">
      <el-alert
        title="Novidade!"
        type="info"
        description="Agora você pode configurar a porcentagem dos prêmios da roleta. Clique no menu 'Configurar Roleta' para visualizar a nova funcionalidade!"
        :closable="false"
        show-icon
        class="info-box"
        :class="theme"
      ></el-alert>
      <BlocksContainer />
      <TableContainer />
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
import BlocksContainer from '@/components/dashboard/BlocksContainer'
import TableContainer from '@/components/dashboard/TableContainer'
import { mapState } from 'vuex'

export default {
  name: "DashboardContainer",

  components: {
    BlocksContainer,
    TableContainer
  },

  computed: {
    ...mapState(['theme'])
  }
};
</script>

<style lang="scss">
#dashboard-container {
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
  #dashboard-container-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1280px;
    height: 100%;
    padding: 20px 10px;
    flex: 1;
  }
  .info-box {
    margin-bottom: 15px;
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
  #dashboard-container {
    #dashboard-container-inner {
      align-items: initial;
    }
  }
}
</style>
