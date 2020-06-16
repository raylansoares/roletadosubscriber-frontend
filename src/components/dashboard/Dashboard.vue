<template>
  <div id="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <el-form label-position="top" @submit.native.prevent="manualWheel">
            <el-form-item label="Roletar Manualmente" class="big-label">
              <el-input v-model="username" placeholder="Username"></el-input>
            </el-form-item>

            <el-form-item class="roll-button">
              <el-button type="primary" plain @click="manualWheel">
                Roletar
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <el-form label-position="top" @submit.native.prevent="" disabled>
            <el-form-item label="Sorteio no Chat (Em breve)" class="big-label">
              <el-input v-model="command" placeholder="Comando"></el-input>
            </el-form-item>

            <el-form-item class="open-raffle-button">
              <el-button type="primary" plain @click="openRaffle">
                Abrir sorteio
              </el-button>
            </el-form-item>

            <!-- <el-form-item class="close-raffle-button">
              <el-button type="primary" plain @click="closeRaffle">
                Finalizar sorteio
              </el-button>
            </el-form-item> -->
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="top-card">
          <div class="profile-card">
            <el-avatar :size="80" :src="user.profile_image_url"></el-avatar>
            <p>{{ user.display_name }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">Subscribers</span>

            <div class="search-input">
              <el-input
                size="small"
                v-model="search"
                placeholder="Buscar subscriber"
                @input="filterSubscribers"
              />
            </div>
          </div>

          <el-table
            :data="filteredSubscribers"
            style="width: 100%"
            height="520"
            header-cell-class-name="sub-table-header"
          >
            <el-table-column
              label="Subscriber"
              prop="username"
              min-width="200px"
            ></el-table-column>

            <el-table-column label="Prêmio" min-width="400px">
              <template slot-scope="scope">
                <el-tag
                  v-for="(prize, index) in scope.row.prizes"
                  :key="index"
                  class="prize-tag"
                >
                  {{ prize.name }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="Data do Sub" min-width="200px">
              <template slot-scope="scope">
                {{ scope.row.created_at | formatDate }}
              </template>
            </el-table-column>

            <el-table-column align="right" min-width="100px">
              <template slot-scope="scope">
                <el-dropdown trigger="click" placement="bottom">
                  <el-button
                    icon="el-icon-refresh"
                    circle
                    plain
                    type="primary"
                  >
                  </el-button>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="retryWheel(scope.row)">Confirmar</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown trigger="click" placement="bottom">
                  <el-button
                    icon="el-icon-delete"
                    circle
                    plain
                    type="danger"
                  >
                  </el-button>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="deleteSubscriber(scope.row._id)">
                        Confirmar
                      </span>
                    </el-dropdown-item>
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
import axios from '@/repositories/clients/axios'
import { mapState } from 'vuex'
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale("pt-br");

export default {
  name: "Dashboard",

  computed: {
    ...mapState(['user'])
  },

  data: () => ({
    subscribers: [],
    filteredSubscribers: [],
    search: "",
    username: null,
    command: '!sorteio',
    host: process.env.VUE_APP_SERVER_HOST,
    port: process.env.VUE_APP_SERVER_PORT
  }),

  mounted() {
    this.getSubscribers();
  },

  filters: {
    formatDate: value => dayjs(value).format("DD/MM/YYYY - HH:mm:ss")
  },

  methods: {
    async getSubscribers() {
      const url = '/api/subscribers';

      try {
        const response = await axios.get(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });

        this.subscribers = response.data;
        this.filterSubscribers();
      } catch (e) {
        this.$message.error('Ops, não foi possível carregar a lista de subs');
      }
    },

    filterSubscribers() {
      if (this.search) {
        this.filteredSubscribers = this.subscribers.filter(value =>
          value.username.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        this.filteredSubscribers = this.subscribers;
      }
    },

    retryWheel(subscriber) {
      this.$socket.emit("retryWheel", { 
        subscriber: subscriber, code: this.user.code
      });
    },

    manualWheel() {
      if (!this.username) return;
      this.$socket.emit("requestPrize", { 
        username: this.username, code: this.user.code 
      });
      this.username = null;
    },

    async deleteSubscriber(id) {
      const url = `/api/subscribers/${id}`;

      try {
        await axios.delete(url, { headers: { 
          'x-auth-token': this.user.access_token,
          'x-code': this.user.code
        } });
        
        this.getSubscribers();
      } catch (e) {
        this.$message.error('Ops, não foi possível excluir este item');
      }
    },

    openRaffle () {},
    closeRaffle () {}
  },

  sockets: {
    selectPrize(data) {
      if (data.code !== this.user.code) return
      this.getSubscribers();
    },

    confirmPrize(data) {
      if (data.code !== this.user.code) return
      this.getSubscribers();
    }
  }
};
</script>

<style lang="scss">
#dashboard {
  .big-label label {
    font-size: 20px;
  }

  .roll-button, .open-raffle-button, .close-raffle-button {
    margin-bottom: 0;
    button {
      width: 100%;
    }
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .prize-tag {
    margin: 3px;
  }

  .search-input {
    float: right;
    width: 300px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    color: #e4e4e4;
  }

  .profile-card {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 22px;
      color: #e4e4e4;
      margin-top: 10px;
    }
  }

  .top-card {
    min-height: 200px;
  }

  input:disabled{
    background-color: #222933;
    color: #121820;
  }
}
</style>
