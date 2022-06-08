<template>
  <v-navigation-drawer
    permanent
    :expand-on-hover="drawer"
    app
  >
    <v-sheet
      color="grey lighten-4"
      class="pa-4"
    >
      <v-avatar
        class="mb-4"
        color="grey darken-1"
        size="64"
      ></v-avatar>
      <div>{{this.user.user.first_name+" "+this.user.user.last_name}}</div>
      <div>{{this.user.user.email}}</div>
    </v-sheet>
    <v-divider></v-divider>

    <v-list>
      <NuxtLink v-for="[icon, text, url] in links"
                :key="icon"
                :to="url"
                link>
      <v-list-item
        link
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      </NuxtLink>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
name: "SideBar",
  props:{
  user: {
    type: Object,
    required:true
  }
  },
  data: () => ({
    links: [
      ['mdi-forum', 'Вопросы','/admin/questions'],
      ['mdi-map','Карта офиса','/admin/map'],
      ['mdi-account-group', 'Руководители','/admin/staff'],
      ['mdi-account-plus', 'Новый сотрудник','/admin/users'],
      ['mdi-logout-variant', 'Выйти',{name: 'logout'}],
    ],
    drawer:false
  }),
  mounted() {
    this.checkWidth();
    window.addEventListener('resize', this.checkWidth)
  },
  methods: {
  checkWidth() {
    if (window.innerWidth <= 1280) {
      this.drawer = true
    } else
      this.drawer = false
  }
  }
}
</script>

<style scoped>

</style>
