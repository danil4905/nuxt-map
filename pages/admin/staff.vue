<template>
  <h1>STAFF</h1>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['auth','is-admin'],
  name: "staff"
}
</script>

<style scoped>

</style>
