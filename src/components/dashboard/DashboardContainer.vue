<template>
  <div id="dashboard-container" :class="theme">
    <div id="dashboard-container-inner">
      <BlocksContainer />
      <TableContainer />
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
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
}
@media (min-width:960px) {
  #dashboard-container {
    #dashboard-container-inner {
      align-items: initial;
    }
  }
}
</style>
