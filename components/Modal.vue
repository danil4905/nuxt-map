<template>
  <v-row justify="center">
    <v-dialog
      v-model="this.isOpen"
      persistent
      max-width="600px"
    >
      <v-card v-if="!loading && !error && !admin">
        <v-card-title>
          <span
            class="text-h5">Место: {{
              this.currentPlace.id
            }} ({{ this.currentPlace.authUserId ? this.currentPlace.User.lastName : 'Свободно' }})</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              Город: {{ getCityName(this.currentPlace.cityId) }}<br>
              Этаж: {{ this.currentPlace.floor }}
              <v-col cols="12">
                {{
                  isOwner ? 'Открепить себя от этого места?' : 'Прикрепить себя к этому месту?'
                }}
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
            @click="error='changed'"
          >
            {{ isOwner ? 'Открепить' : 'Прикрепить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="error === 'changed'">
        <div class="text-h4 pa-12">Вы действительно хотите
          {{ isOwner ? 'открепить еб от этого места?' : 'прикрепить себя к этому месту?' }}
        </div>
        <p style="margin: 20px">
          Город: {{ getCityName(this.currentPlace.cityId) }}<br>
          Этаж: {{ this.currentPlace.floor }}<br>
          Фамилия: {{ this.$auth.user.user.last_name }}
        </p>
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
            @click="savePlace"
          >
            Да
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
            @click="()=>{closeModal()}"
          >
            Продолжить редактирование
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="()=>{setInit(); closeModal()}"
          >
            Сохранить и выйти
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
  name: "PlaceModal",
  props: ['admin'],
  data() {
    return {
      place: {},
      loading: true,
      error: '',
    }
  },
  computed: {
    isOpen() {
      return this.$store.state.isDialogOpen;
    },
    currentPlace() {
      return this.$store.state.currentPlace;
    },
    isOwnerCheck(id) {
      return this.$store.dispatch('places/isOwnerCheck', id);
    },
    isOwner() {
      return this.$store.state.isOwner;
    },
    citiesList() {
      return citiesList
    },
    authUserid() {
      return this.$store.state.userId
    }
  },
  mounted() {
    this.getCurrentPlace();
  },
  methods: {
    closeModal() {
      this.$store.commit('TOGGLE_MODAL', false);
      this.error = '';
    },
    async savePlace() {
      let data = {
        floor: this.currentPlace.floor,
        cityId: this.currentPlace.cityId,
        coords: this.currentPlace.coords,
        userId: this.authUserid
      }
      if (this.isOwner) {
        try {
          await this.$api.put(`places/${this.currentPlace.id}`, {
            floor: data.floor,
            cityId: data.cityId,
            coords: data.coords,
            userId: null
          })
            .then((response) => {
              console.log(response);
              this.error = 'success';
              this.$store.dispatch('places/getPlace')
            }).catch((e) => {
              console.error(e.message);
            });
        } catch (e) {
          this.error = e.message;
        }
      } else {
        try {
          await this.$api.put(`/places/${this.currentPlace.id}`, data)
            .then((response) => {
              console.log(response);
              this.error = 'success';
              this.$store.dispatch('places/getPlace');
            }).catch((e) => {
              console.error(e.message);
            });
        } catch (e) {
          this.error = e.message;
        }
      }
    },
    async getCurrentPlace() {
      this.loading = false;
      await this.$api.get('users/' + this.$auth.user.user.username, () => {

      }).then((response) => this.userId = response.data.id)
    },
    async setInit() {
      await this.$api.put(`users/${this.$auth.user.user.username}`, {
        firsName: this.$auth.user.user.firsName,
        lastName: this.$auth.user.user.lastName,
        username: this.$auth.user.user.username,
        email: this.$auth.user.user.email,
        isInit: true
      })
        .then((response) => {
          console.log(response);
          this.error = 'success';
        }).catch((e) => {
          console.error(e.message);
        });
      await this.$router.push('/');
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

<style scoped>

</style>
