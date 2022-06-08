<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpen"
      persistent
      max-width="600px"
    >
      <v-card>
        <div class="text-h3 pa-12">{{ error? error: 'Успешно!'}}</div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="()=>{closeModal()}"
          >
            Ок
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ModalSuccess",
  props: ['isOpen', 'error'],
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>

</style>
