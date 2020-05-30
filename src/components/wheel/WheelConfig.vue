<template>
  <div id="wheel-config">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover" class="top-card">
          <el-form @submit.native.prevent="createPrize" :inline="true" :model="prize" label-position="top">
            <el-form-item label="Name" prop="name" class="inline-label name">
              <el-input v-model="prize.name" placeholder="Name" size="medium" maxlength="25" clearable></el-input>
            </el-form-item>

            <el-form-item label="Description" prop="description" class="inline-label description">
              <el-input v-model="prize.description" placeholder="Description" size="medium" clearable></el-input>
            </el-form-item>

            <el-form-item label="Color" prop="color" class="inline-label color">
              <el-color-picker v-model="prize.color" size="medium"></el-color-picker>
            </el-form-item>

            <el-form-item label="Status" prop="enabled" class="inline-label status">
              <el-switch v-model="prize.enabled" active-color="#67c23a" inactive-color="#ff4949"></el-switch>
            </el-form-item>

            <el-form-item class="inline-button">
              <el-button type="primary" plain @click="createPrize">
                Create Prize
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <el-dropdown trigger="click" class="reset-button" placement="bottom">
            <el-button
              :disabled="reseting"
              plain
              type="warning"
            >
              <i class="el-icon-warning-outline" v-if="!reseting"></i>
              <i class="el-icon-loading" v-else></i>
              {{ reseting ? "Reseting..." : "Reset Prizes" }}
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="resetPrizes">Confirm Reset</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
        </el-card>
      </el-col>
    </el-row>

     <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">Wheel Prizes</span>

            <div class="search-input">
              <el-input
                size="small"
                v-model="search"
                placeholder="Search prize"
                @input="filterPrizes"
              />
            </div>
          </div>

          <el-table
            :data="filteredPrizes"
            style="width: 100%"
            height="520"
            header-cell-class-name="sub-table-header"
          >
            <el-table-column label="Name" prop="name" min-width="200px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.name }}
                </span>
                <el-input v-else size="small" v-model="scope.row.name" maxlength="25" clearable></el-input>
              </template>
            </el-table-column>

            <el-table-column label="Description" prop="description" min-width="400px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  {{ scope.row.description }}
                </span>
                <el-input v-else size="small" v-model="scope.row.description" clearable></el-input>
              </template>
            </el-table-column>

            <el-table-column label="Color" min-width="100px">
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  <el-tag class="color-tag" :color="scope.row.color"></el-tag>
                </span>
                <el-color-picker v-else v-model="scope.row.color" size="small"></el-color-picker>
              </template>
            </el-table-column>

            <el-table-column label="Status" min-width="100px">
              <template slot-scope="scope">
                {{ scope.row.enabled ? "Enabled" : "Disabled" }}
              </template>
              <template slot-scope="scope">
                <span v-if="selectedItem !== scope.row._id">
                  <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
                    {{ scope.row.enabled ? "Enabled" : "Disabled" }}
                  </el-tag>
                </span>
                <el-switch v-else v-model="scope.row.enabled" active-color="#67c23a" inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>

            <el-table-column align="right" min-width="100px">
              <template slot-scope="scope">
                <el-button
                  plain
                  circle
                  :icon="selectedItem !== scope.row._id ? 'el-icon-edit' : 'el-icon-check'"
                  :type="selectedItem !== scope.row._id ? 'primary' : 'success'"
                  :disabled="!!selectedItem && selectedItem !== scope.row._id"
                  @click="editPrize(scope.row)"
                >
                </el-button>

                <el-dropdown trigger="click" placement="bottom">
                  <el-button
                    icon="el-icon-delete"
                    circle
                    plain
                    type="danger"
                    :disabled="!!selectedItem"
                  >
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="deletePrize(scope.row._id)">Confirm Delete</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WheelConfig",

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
      { color: "#ffffff", enabled: true, name: "Piada do saci" },
      { color: "#fb426e", enabled: true, name: "De timeout em alguém" },
      { color: "#ffffff", enabled: true, name: "Jogo Gratuito" },
      { color: "#0172ac", enabled: true, name: "Imagem para o cromakey" },
      { color: "#ffffff", enabled: true, name: "Ganso" },
      { color: "#f07e26", enabled: true, name: "Jogar água na cabeça" },
      { color: "#ffffff", enabled: true, name: "Adicionar emote da BTTV" },
      { color: "#f2d809", enabled: true, name: "500 rosecoins" },
      { color: "#ffffff", enabled: true, name: "Frase de encerramento" },
      { color: "#fb426e", enabled: true, name: "Pergunte ao Tesdey" },
      { color: "#ffffff", enabled: true, name: "10 minutos de timeout" },
      { color: "#0172ac", enabled: true, name: "Desenho na cara" },
      { color: "#ffffff", enabled: true, name: "Anúncio de graça" },
      { color: "#f07e26", enabled: true, name: "Roda 2x" },
      { color: "#ffffff", enabled: true, name: "Lendária ou ban" },
      { color: "#f2d809", enabled: true, name: "Duelo com Tesdey" },
      { color: "#ffffff", enabled: true, name: "500 rosecoins" },
      { color: "#fb426e", enabled: true, name: "BG temático" },
      { color: "#ffffff", enabled: true, name: "Escolha 2 músicas" },
      { color: "#0172ac", enabled: true, name: "De timeout em alguém" },
      { color: "#ffffff", enabled: true, name: "10 minutos de timeout" },
      { color: "#f07e26", enabled: true, name: "Imagem para o cromakey" },
      { color: "#ffffff", enabled: true, name: "Pergunte ao Tesdey" },
      { color: "#f2d809", enabled: true, name: "Desenho na cara" },
      { color: "#ffffff", enabled: true, name: "Anúncio de graça" },
      { color: "#fb426e", enabled: true, name: "Frase de encerramento" },
      { color: "#ffffff", enabled: true, name: "Duelo com Tesdey" }
    ],
    selectedItem: null
  }),

  mounted() {
    this.getPrizes();
  },

  methods: {
    async getPrizes() {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      const response = await axios.get(url);

      this.prizes = response.data;
      this.filterPrizes();
    },

    filterPrizes() {
      if (this.search) {
        this.filteredPrizes = this.prizes.filter(value =>
          value.name.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        this.filteredPrizes = this.prizes;
      }
    },

    async deletePrize(id) {
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${id}`;
      await axios.delete(url);
      this.getPrizes();
    },

    async editPrize(item) {
      if (this.selectedItem !== item._id) {
        this.selectedItem = item._id;
        return;
      }
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${item._id}`;
      await axios.patch(url, item);
      this.selectedItem = null;
    },

    async createPrize() {
      if (!this.prize.name) return
      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      await axios.post(url, this.prize);
      this.prize = {
        name: null,
        description: null,
        color: null,
        enabled: null
      };
      this.getPrizes();
    },

    async resetPrizes() {
      this.reseting = true;

      const allPrizes = this.prizes;

      this.prizes = [];
      this.filteredPrizes = [];

      await Promise.all(
        allPrizes.map(async prize => {
          const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes/${prize._id}`;
          await axios.delete(url);
        })
      );

      const url = `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/api/prizes`;
      for (let prize of this.defaultPrizes) {
        await axios.post(url, prize);
      }

      await this.getPrizes();

      this.reseting = false;
    }
  }
};
</script>

<style lang="scss">
#wheel-config {
  .el-row {
    margin-bottom: 20px;
  }

  .search-input {
    float: right;
    width: 300px;
  }

  .top-card {
    min-height: 120px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    color: #606266;
  }

  .color-tag {
    width: 32px;
  }

  .inline-label {
    margin-bottom: 0;
    label {
      line-height: 15px;
    }
    &.name {
      width: 220px;
    }
    &.description {
      width: 320px;
    }
  }

  .inline-button {
    margin: 25px 0 0 0;
  }

  .reset-button, .reset-button button {
    width: 100%;
    margin: 9px 0;
  }
}
</style>
