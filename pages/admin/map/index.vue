<template>
  <div v-if="loading">Loading...</div>
  <v-container v-else>
    <h1 :class="$style.title">Выбор места в {{ citiesList[currentIndex - 1].title }}</h1>
    <ul :class="$style.citiesList">
      <li v-for="(item,index) in citiesList" :key="index">
        <button :class="$style.cityBtn" class="tabLink" v-if="item.id !== currentIndex"
                @click="()=>changeCity(item.id)">{{ item.title }}
        </button>
      </li>
    </ul>
    <v-card-actions>
      <v-btn @click="createMode = true" :disabled="checkDisabled()">Создать новое место</v-btn>
      <v-btn @click="deleteMode = true" :disabled="checkDisabled()">Удалить место</v-btn>
      <v-btn @click="moveMode = true" :disabled="checkDisabled()">Передвинуть место</v-btn>
      <v-btn @click="() => {this.deleteMode = false; this.createMode=false; this.moveMode=false }" v-if="checkDisabled()"
             color="error">Готово
      </v-btn>
    </v-card-actions>
    <v-banner v-if="createMode"
              icon="mdi-alert-octagon"
              outlined>
      Для создания нового места кликните по свободному месту на карте
    </v-banner>
    <v-banner v-if="deleteMode"
              icon="mdi-alert-octagon"
              outlined>
      Чтобы удалить место кликните по нему на карте
    </v-banner>
    <v-banner v-if="moveMode"
              icon="mdi-alert-octagon"
              outlined>
      Чтобы передвинуть место, перетащите его мышью.<br>
      Изменения сохраняются автоматически.
      По окончанию нажмите "Готово"
    </v-banner>
    <AdminOfficeMap edit-mode :createMode="createMode" :moveMode="moveMode" @changeCreateMode="changeCreateMode"/>
    <AdminModal :admin="true" :deleteMode="deleteMode" @changeDeleteMode="changeDeleteMode"/>
  </v-container>
</template>

<script>

import AdminModal from "@/components/AdminModal";
import {citiesList} from "static/js/constants";
import AdminOfficeMap from "@/components/OfficeMapSection/AdminOfficeMap";


export default {
  name: "AdminMap",
  components: {AdminOfficeMap, AdminModal},
  middleware: ['auth'],
  layout: 'admin',
  computed: {
    currentCity() {
      return this.$store.state.currentCity;
    },
    userId() {
      return this.$store.state.users.userId;
    },
    currentIndex() {
      return this.$store.state.currentIndex;
    },
    users() {
      return this.$store.state.users.users;
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    changeCity(index) {
      this.$store.commit('CHANGE_CITY', index);
      this.$store.dispatch('places/getPlace');
    },
    getUsers() {
      this.$store.dispatch('users/getUsers', "а");
      this.loading = false;
    },
    changeCreateMode(val) {
      this.createMode = val;
    },
    changeDeleteMode(val) {
      this.deleteMode = val
    },
    checkDisabled() {
      return this.createMode || this.deleteMode || this.moveMode
    }
  },
  head() {
    return {
      title: 'map',
      link: [
        {rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"},
        {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css'}
      ]
    }
  },
  data: () => (
    {
      drawer: null,
      links: [
        ['mdi-logout-variant', 'Выйти', {name: 'logout'}],
      ],
      loading: true,
      citiesList: citiesList,
      createMode: false,
      deleteMode: false,
      moveMode: false
    })
}
</script>

<style lang="scss" module>
.title {
  font-size: 40px;
  margin: 20px;
}

.citiesList {
  display: flex;

  button {
    margin-right: 20px;
    color: $lightBlue;
  }
}
</style>
<style>
#office {
  padding-top: 0;
}
</style>
