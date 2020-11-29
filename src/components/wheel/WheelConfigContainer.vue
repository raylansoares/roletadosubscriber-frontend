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
      <PrizesTableContainer
      />
    </div>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
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
    max-width: 1280px;
    height: 100%;
    padding: 20px 10px;
    flex: 1;
  }
}
@media (min-width:960px) {
  #wheel-config-container {
    #wheel-config-container-inner {
      align-items: initial;
    }
  }
}
</style>
