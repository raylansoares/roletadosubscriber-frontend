<template>
  <div id="wheel-config">

    <div class="md-layout">
      <div class="md-layout-item create-prize">
        <md-card>
          <md-card-content>
            <p class="card-title">Cadastrar Prêmio</p>
            <div class="md-layout">
              <div class="md-layout-item md-size-25 form-item">
                <md-field>
                  <label>Nome</label>
                  <md-input v-model="prize.name" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-35 form-item">
                <md-field>
                  <label>Descrição</label>
                  <md-input v-model="prize.description" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-15 form-item">
                <md-field>
                  <label>Status</label>
                  <md-select v-model="prize.enabled">
                    <md-option :value="1">Ativo</md-option>
                    <md-option :value="0">Inativo</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-size-15 form-item">
                <md-field>
                  <label>Cor</label>
                  <md-select v-model="prize.color" :style="'background-color: ' + prize.color ? prize.color : '#ffffff'">
                    <md-option value="#0172ac" style="background-color: #0172ac">#0172ac</md-option>
                    <md-option value="#fb426e" style="background-color: #fb426e">#fb426e</md-option>
                    <md-option value="#f07e26" style="background-color: #f07e26">#f07e26</md-option>
                    <md-option value="#f2d809" style="background-color: #f2d809">#f2d809</md-option>
                    <md-option value="#ffffff" style="background-color: #ffffff">#ffffff</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-size-10 form-item">
                <md-button
                  class="md-dense md-raised md-primary create-button"
                  :disabled="prize.name === null || prize.enabled === null || prize.color === null"
                  @click="createPrize"
                >
                  Cadastrar
                </md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
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
        <md-table-cell md-label="Status" class="cell-enabled">
          {{ item.enabled ? 'Ativo' : 'Inativo' }}
        </md-table-cell>
        <md-table-cell md-label="Cor" class="cell-color">
           <md-button class="md-dense md-raised" :style="'background-color: ' + item.color">
             {{ item.color }}
           </md-button>
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
    search: null,
    prize: {
      name: null,
      description: null,
      color: null,
      enabled: null
    }
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
    },

    async createPrize () {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`
      const response = await axios.post(url, this.prize)
      this.prize = {
        name: null,
        description: null,
        color: null,
        enabled: null
      }
      this.getPrizes()
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
    .md-card {
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.87)
    }
    .form-item {
      padding: 0 10px;
    }
    .create-button {
      width: 100%;
      margin-top: 20px;
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