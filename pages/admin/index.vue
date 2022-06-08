<template>
  <h1>Административная панель для StartKit</h1>
</template>

<script>

export default {
  name: 'IndexPage',
  middleware: ['auth', 'is-admin'],
  layout: 'admin',
  head() {
    return {
      title: 'admin',
      link: [
        {rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"},
        {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css'}
      ]
    }
  },
  data: () => ({drawer: null})
}
</script>

<style lang="scss" module>
h1 {
  margin: 50px;
}
</style>
