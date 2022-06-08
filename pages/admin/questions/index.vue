<template>
  <div v-if="loading" :class="$style.window"><img src="/svg/loader.gif" alt=""></div>
  <v-container
    v-else
    class="py-8 px-6"
    fluid>
    <v-select
      :items="cards.map(el => el.value)"
      label="Выбирите город"
      @change="(el) => { changeCity(el) }"
    ></v-select>
    <ul :class="$style.list">
      <li v-for="question in questions" :class="$style.question" :key="question.id">
        <NuxtLink :to="`/admin/questions/${question.id}`" v-html="question.title" :class="$style.link">
          {{ question.title }}
          {{ (question.city) }}
        </NuxtLink>
      </li>
    </ul>
  </v-container>
</template>

<script>

import {citiesList} from "static/js/constants";

export default {
  name: "AdminQuestions",
  middleware: ['auth', 'is-admin'],
  layout: 'admin',
  data: () => ({
    cards: citiesList,
    questions: null,
    loading: true
  }),
  computed: {
    currentCity() {
      return this.$store.state.currentCity
    }
  },
  methods: {
    changeCity(el) {
      console.log(el)
      this.getQuestions(el)
    },
    getQuestions(city = this.currentCity.value) {
      this.$api.get('/questions/by-city', {
        params: {
          city: city
        }
      })
        .then(response => {
          this.questions = response.data
          this.loading = false
          console.log()
        });
    }
  },
  mounted() {
    this.getQuestions();
  }
}
</script>

<style lang="scss" module>
.list {
  display: flex;
  flex-flow: wrap;
}

.title {
  font-size: 22px;
}

.question {
  min-height: 100px;
  margin: 20px;
  text-align: center;
  background: $lightGray;
  width: 350px;
  transition: 0.2s ease;

  &:hover {
    -webkit-box-shadow: 0 0 8px 0 rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0 0 8px 0 rgba(34, 60, 80, 0.2);
    box-shadow: 0 0 8px 0 rgba(34, 60, 80, 0.2);
  }

  a {
    color: $darkBlue;
  }
}

.link {
  @include flex-column;
  justify-content: center;
  width: 100%;
  height: 300px;
}

.window {
  width: 100%;
  height: 100vh;
  @include flex-column;
  align-items: center;
  justify-content: center;
}
</style>
