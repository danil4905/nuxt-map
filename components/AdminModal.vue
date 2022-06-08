<template>
  <v-row justify="center">
    <v-dialog
      v-model="this.isOpen"
      persistent
      max-width="600px"
    >
      <v-card v-if="deleteMode">
        <div class="text-h3 pa-12">Удалить место {{
            this.currentPlace.id
          }} ({{ this.currentPlace.userId ? this.currentPlace.User.lastName : 'Свободно' }})
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            Нет
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deletePlace"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="!loading && !error && admin">
        <v-card-title>
          <span
            class="text-h5">Место: {{
              this.currentPlace.id
            }} ({{ this.currentPlace.userId ? this.currentPlace.User.lastName : 'Свободно' }})</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              Город: {{ getCityName(this.currentPlace.cityId) }}<br>
              Этаж: {{ this.currentPlace.floor }}
              <v-col cols="12">
                <v-autocomplete
                  clearable
                  dense
                  filled
                  rounded
                  :loading="loading"
                  placeholder="Начните вводить фамилию сотрудника"
                  :items="users.map(el => `${el.lastName} ${el.firstName}`)"
                  :search-input.sync="input"
                ></v-autocomplete>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            Закрыть
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="savePlace"
            :disabled="!isTaken && !input || !users[0]"
          >
            {{ isTaken && !input ? 'Освободить' : 'Прикрепить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="error === 'success'">
        <div class="text-h3 pa-12">Успешно!</div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="error && error !== 'success' && error !== 'changed'">
        <div class="text-h3 pa-12">Ошибка :(</div>
        <span>{{ error }}</span>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {citiesList} from "static/js/constants";

export default {
  name: "AdminModal",
  props: ['admin', 'deleteMode'],
  data() {
    return {
      place: {},
      loading: true,
      error: '',
      input: '',
      debounce: null,
      search: ''
    }
  },
  watch: {
    input(val) {
      if (!val) {
        this.debounceSearch()
      }

      this.debounceSearch()
    }
  },
  computed: {
    isOpen() {
      return this.$store.state.isDialogOpen;
    },
    currentPlace() {
      return this.$store.state.places.currentPlace;
    },
    isTaken() {
      return !!this.currentPlace.userId
    },
    citiesList() {
      return citiesList
    },
    users() {
      return this.$store.state.users.users;
    }
  },
  mounted() {
    this.getCurrentPlace();
  },
  methods: {
    closeModal() {
      this.$store.commit('TOGGLE_MODAL', false);
      this.error = '';
      this.input = '';
      this.search = ''
    },
    debounceSearch() {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if(this.input !== null) {
          this.input = this.input.trim()
          let currentInput = this.input.trim();
          let lastName = currentInput.split(' ')[0];
          let firstName = currentInput.split(' ')[1];
          console.log(lastName,firstName)
          this.$store.dispatch('users/getUsers', {lastName, firstName})
        }
      }, 350)
    },
    async savePlace() {
      let data = {
        floor: this.currentPlace.floor,
        cityId: this.currentPlace.cityId,
        coords: this.currentPlace.coords,
        userId: null
      }
      if (this.currentPlace.userId && !this.input) {
        try {
          await this.$api.put(`places/${this.currentPlace.id}`, data)
            .then(() => {
              this.error = 'success';
              this.$store.dispatch('places/getPlace')
            }).catch((e) => {
              console.error(e.message);
              this.error = e.message;
              if (e.response.status === 403) {
                this.$router.push('/login');
              }
            });
        } catch (e) {
          this.error = e.message;
        }
      } else {
        try {
          this.loading = true;
          await this.$api.put(`/places/${this.currentPlace.id}`, {
            floor: this.currentPlace.floor,
            cityId: this.currentPlace.cityId,
            coords: this.currentPlace.coords,
            userId: this.users[0] ? this.users[0].id : this.currentPlace.userId
          })
            .then(() => {
              this.error = 'success';
              this.$store.dispatch('places/getPlace');
              this.loading = false;
            }).catch((e) => {
              console.error(e.message);
              this.error = e.message;
              if (e.response.status === 403) {
                this.$router.push('/login');
              }
            });
        } catch (e) {
          this.error = e.message;
        }
      }
      this.input = '';
    },
    async getCurrentPlace() {
      this.loading = true;
      await this.$api.get('users/' + this.$auth.user.user.username, () => {

      }).then((response) => this.userId = response.data.id)
      this.loading = false;
      this.isTaken = !!this.currentPlace.userId;
    },
    async deletePlace() {
      try {
        this.loading = true;
        await this.$api.delete(`/places/${this.currentPlace.id}`)
          .then(() => {
            this.$emit('changeDeleteMode', false)
            this.error = 'success';
            this.$store.dispatch('places/getPlace');
            this.loading = false;
          }).catch((e) => {
            console.error(e.message);
            this.error = e.message;
            if (e.response.status === 403) {
              this.$router.push('/login');
            }
          });
      } catch (e) {
        this.error = e.message;
      }
    },
    getCityName(id) {
      switch (id) {
        case 1:
          return 'Ижевск'
        case 2:
          return 'Киров'
        case 3:
          return 'Питер'
        default:
          return 'Казань'
      }
    }
  }
}
</script>
