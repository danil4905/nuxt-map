<template>
  <div v-if="loading" :class="$style.window"><img src="/svg/loader.gif" alt=""></div>
  <v-container
    v-else
    class="py-8 px-6"
    fluid>
    <v-row justify="center">
      <v-card-title>Создать нового пользователя</v-card-title>
    </v-row>
    <v-form v-model="valid" @submit.prevent="submit">
      <v-container>
        <v-row
          justify="center">
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="firstname"
              :rules="firstNameRules"
              :counter="15"
              label="Имя"
              required
            ></v-text-field>
            <v-text-field
              v-model="lastname"
              :rules="lastNameRules"
              :counter="25"
              label="Фамилия"
              required
            ></v-text-field>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :counter="25"
              label="username"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
            <v-btn
              class="mr-4"
              type="submit"
              :disabled="!valid"
            >
              Создать
            </v-btn>
            <v-btn @click="clear">
              Очистить форму
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text v-if="submitted">{{ error ? error : 'Пользователь успешно создан!' }}</v-card-text>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: "AdminUsers",
  middleware: ['auth', 'is-admin'],
  layout: 'admin',
  data: () => ({
    cards: ['Ижевск', 'Киров', 'Питер', 'Казань'],
    loading: false,
    valid: false,
    firstname: '',
    lastname: '',
    error: '',
    submitted: false,
    username: '',
    firstNameRules: [
      v => !!v || 'Имя не заполнено',
      v => v.length <= 15 || 'Имя должно быть кроче 15 букв',
    ],
    lastNameRules: [
      v => !!v || 'Фамилия не заполнена',
      v => v.length <= 25 || 'Фамилия должна быть кроче 25 букв',
    ],
    usernameRules: [
      v => !!v || 'username не заполнен',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail не заполнен',
      v => /.+@+/.test(v) || 'E-mail должен быть формата - @elma-bpm.com или @quickbpm.io',
    ],
  }),
  methods: {
    submit() {
      let data = {
        user: {
          first_name: this.firstname,
          last_name: this.lastname,
          username: this.username,
          email: this.email
        }
      }
      try {
        this.$api.post('users/', data)
          .then((response) => {
            console.log(response);
            this.submitted = true;
            this.error = '';
            this.clear();
          }).catch((e) => {
          console.error(e.message);
          this.submitted = true;
          this.error = e.response.data;
          this.clear();
        });
      } catch (e) {
        if (e.response.status === 403) {
          this.$router.push('/')
        }
        this.error = e.response.data;
        this.submitted = true;
      }
    },
    clear() {
      this.firstname = ''
      this.lastname = ''
      this.email = ''
      this.username = ''
    },
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
