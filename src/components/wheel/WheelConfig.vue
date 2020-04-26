<template>
  <div id="wheel-config">
    <md-table v-model="filteredPrizes" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Prêmios da Roleta</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar prêmio..." v-model="search" @input="filterPrizes" />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nome" class="cell-name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Descrição" class="cell-description">{{ item.description }}</md-table-cell>
        <md-table-cell md-label="Cor" class="cell-color">
           <md-button class="md-dense md-raised" :style="'background-color: ' + item.color">
             {{ item.color }}
           </md-button>
        </md-table-cell>
        <md-table-cell md-label="Ativo" class="cell-enabled">
          <md-icon>{{ item.enabled ? 'done' : 'close' }}</md-icon>
        </md-table-cell>
        <md-table-cell md-label="Ações" class="cell-actions">
          <md-button
            id="edit-item"
            class="md-icon-button md-dense md-raised md-primary"
            @click="editPrize(item._id)"
            title="Editar registro"
          >
            <md-icon>create</md-icon>
          </md-button>
          <md-button
            id="delete-item"
            class="md-icon-button md-dense md-raised md-accent"
            @click="deletePrize(item._id)"
            title="Excluir registro"
          >
            <md-icon>close</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WheelConfig',

  data: () => ({
    prizes: [],
    filteredPrizes: [],
    search: null
  }),

  mounted () {
    this.getPrizes()
  },

  methods: {
    async getPrizes () {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`
      const response = await axios.get(url)
      
      this.prizes = response.data
      this.filterPrizes()
    },

    filterPrizes () {
      if (this.search) {
        this.filteredPrizes = this.prizes.filter(value => value.name.toLowerCase().includes(this.search.toLowerCase()))
      } else {
        this.filteredPrizes = this.prizes
      }
    },

    async deletePrize (id) {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${id}`
      const response = await axios.delete(url)
      this.getPrizes()
    },

    editPrize (id) {
      // Todo: implement method
    }
  }
}
</script>

<style lang="scss">
  #wheel-config {
    width: 100%;
    max-width: 1280px;
    .md-content {
      height: auto!important;
    }
    .cell-color {
      .md-button {
        cursor: default;
        box-shadow: none;
        border: #e0e0e0 solid 1px;
        height: 22px;
        font-size: 12px;
      }
    }
  }
</style>