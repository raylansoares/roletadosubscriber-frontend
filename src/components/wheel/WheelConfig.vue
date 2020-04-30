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
              <div class="md-layout-item md-size-30 form-item">
                <md-field>
                  <label>Descrição</label>
                  <md-input v-model="prize.description" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-15 form-item">
                <md-field>
                  <label>Cor</label>
                  <md-select v-model="prize.color">
                    <md-option value="#0172ac" style="background-color: #0172ac">#0172ac</md-option>
                    <md-option value="#fb426e" style="background-color: #fb426e">#fb426e</md-option>
                    <md-option value="#f07e26" style="background-color: #f07e26">#f07e26</md-option>
                    <md-option value="#f2d809" style="background-color: #f2d809">#f2d809</md-option>
                    <md-option value="#ffffff" style="background-color: #ffffff">#ffffff</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-size-15 form-item">
                <md-switch v-model="prize.enabled" class="md-primary">
                  {{ prize.enabled ? 'Ativo' : 'Inativo' }}
                </md-switch>
              </div>
              <div class="md-layout-item md-size-15 form-item">
                <md-button
                  class="md-dense md-raised md-primary create-button"
                  :disabled="prize.name === null || prize.enabled === null || prize.color === null"
                  @click="createPrize"
                  title="Cadastrar"
                >
                  <md-icon>add</md-icon>
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

        <md-field class="md-toolbar-section-end">
          <md-input placeholder="Buscar prêmio..." v-model="search" @input="filterPrizes" />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nome" class="cell-name">
          <span v-if="selectedItem !== item._id">{{ item.name }}</span>
          <md-field v-else class="inline-edit">
            <md-input v-model="item.name" />
          </md-field>
        </md-table-cell>
        <md-table-cell md-label="Descrição" class="cell-description">
          <span v-if="selectedItem !== item._id">{{ item.description }}</span>
          <md-field v-else class="inline-edit">
            <md-input v-model="item.description" />
          </md-field>
        </md-table-cell>
        <md-table-cell md-label="Cor" class="cell-color">
           <md-button v-if="selectedItem !== item._id" class="md-dense md-raised" :style="'background-color: ' + item.color">
             {{ item.color }}
           </md-button>
           <md-field v-else class="inline-edit">
              <md-select v-model="item.color" class="inline-select">
                <md-option value="#0172ac" style="background-color: #0172ac">#0172ac</md-option>
                <md-option value="#fb426e" style="background-color: #fb426e">#fb426e</md-option>
                <md-option value="#f07e26" style="background-color: #f07e26">#f07e26</md-option>
                <md-option value="#f2d809" style="background-color: #f2d809">#f2d809</md-option>
                <md-option value="#ffffff" style="background-color: #ffffff">#ffffff</md-option>
              </md-select>
            </md-field>
        </md-table-cell>
        <md-table-cell md-label="Status" class="cell-enabled">
          <span v-if="selectedItem !== item._id">{{ item.enabled ? 'Ativo' : 'Inativo' }}</span>
          <md-switch v-else v-model="item.enabled" class="md-primary">{{ item.enabled ? 'Ativo' : 'Inativo' }}</md-switch>
        </md-table-cell>
        <md-table-cell md-label="Ações" class="cell-actions">
          <md-button
            id="edit-item"
            class="md-icon-button md-dense md-raised md-primary"
            :class="selectedItem === item._id ? 'save' : ''"
            @click="editPrize(item)"
            :title="selectedItem !== item._id ? 'Editar' : 'Salvar'"
          >
            <md-icon v-if="selectedItem !== item._id">create</md-icon>
            <md-icon v-else>check</md-icon>
          </md-button>
          <md-button
            id="delete-item"
            class="md-icon-button md-dense md-raised md-accent"
            @click="deletePrize(item._id)"
            title="Excluir registro"
            :disabled="selectedItem === item._id"
          >
            <md-icon>close</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <div class="md-layout">
      <div class="md-layout-item">
        <md-button
          class="md-dense md-raised md-accent reset-button"
          @click="resetPrizes()"
          :disabled="reseting"
        >
          <md-icon v-if="!reseting">warning</md-icon>
          {{ reseting ? 'Aguarde...' : 'Resetar Prêmios' }}
        </md-button>
      </div>
    </div>
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
    },
    reseting: false,
    defaultPrizes: [
      {color : '#ffffff', enabled: true, name : 'Piada do saci'},
      {color : '#fb426e', enabled: true, name : 'De timeout em alguém'},
      {color : '#ffffff', enabled: true, name : 'Jogo Gratuito'},
      {color : '#0172ac', enabled: true, name : 'Imagem para o cromakey'},
      {color : '#ffffff', enabled: true, name : 'Ganso'},
      {color : '#f07e26', enabled: true, name : 'Jogar água na cabeça'},
      {color : '#ffffff', enabled: true, name : 'Adicionar emote da BTTV'},
      {color : '#f2d809', enabled: true, name : '500 rosecoins'},
      {color : '#ffffff', enabled: true, name : 'Frase de encerramento'},
      {color : '#fb426e', enabled: true, name : 'Pergunte ao Tesdey'},
      {color : '#ffffff', enabled: true, name : '10 minutos de timeout'},
      {color : '#0172ac', enabled: true, name : 'Desenho na cara'},
      {color : '#ffffff', enabled: true, name : 'Anúncio de graça'},
      {color : '#f07e26', enabled: true, name : 'Roda 2x'},
      {color : '#ffffff', enabled: true, name : 'Lendária ou ban'},
      {color : '#f2d809', enabled: true, name : 'Duelo com Tesdey'},
      {color : '#ffffff', enabled: true, name : '500 rosecoins'},
      {color : '#fb426e', enabled: true, name : 'BG temático'},
      {color : '#ffffff', enabled: true, name : 'Escolha 2 músicas'},
      {color : '#0172ac', enabled: true, name : 'De timeout em alguém'},
      {color : '#ffffff', enabled: true, name : '10 minutos de timeout'},
      {color : '#f07e26', enabled: true, name : 'Imagem para o cromakey'},
      {color : '#ffffff', enabled: true, name : 'Pergunte ao Tesdey'},
      {color : '#f2d809', enabled: true, name : 'Desenho na cara'},
      {color : '#ffffff', enabled: true, name : 'Anúncio de graça'},
      {color : '#fb426e', enabled: true, name : 'Frase de encerramento'},
      {color : '#ffffff', enabled: true, name : 'Duelo com Tesdey'},
    ],
    selectedItem: null
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

    async editPrize (item) {
      if (this.selectedItem !== item._id) {
        this.selectedItem = item._id
        return
      }
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${item._id}`
      const response = await axios.patch(url, item)
      this.selectedItem = null
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
    },

    async resetPrizes () {
      this.reseting = true

      const allPrizes = this.prizes

      this.prizes = []
      this.filteredPrizes = []

      await Promise.all(allPrizes.map(async (prize) => {
        const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${prize._id}`
        await axios.delete(url)
      }))

      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`
      for (let prize of this.defaultPrizes) {
        await axios.post(url, prize)
      }

      await this.getPrizes()

      this.reseting = false
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
      .md-switch {
        margin: 28px 7px 7px 7px;
      }
    }
    .create-button {
      width: 100%;
      margin-top: 20px;
    }
    .cell-color {
      .md-button {
        width: 15%;
        cursor: default;
        box-shadow: none;
        border: #e0e0e0 solid 1px;
        height: 22px;
        font-size: 12px;
      }
    }
    .cell-name {
      width: 25%;
    }
    .cell-description {
      width: 30%;
    }
    .cell-enabled {
      width: 15%;
    }
    .cell-actions {
      width: 15%;
    }
    .save {
      background-color: #4caf81;
    }
    .md-field.inline-edit {
      min-height: 34px;
      margin: 0;
      padding-top: 2px;
    }
    .md-switch {
      margin: 8px 7px 5px 0;
    }
    .inline-select {
      width: 100px;
    }
  }
</style>