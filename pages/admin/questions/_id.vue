<template>
  <p v-if="$fetchState.pending" :class="$style.window"><img src="/svg/loader.gif" alt=""></p>
  <div :class="$style.appWrapper" v-else>
    <div :class="$style.wrapper">
      <div :class="$style.front">
        <h4 v-html="this.question.title">
          {{ this.changedQuestion.title }}
        </h4>
      </div>
      <div :class="$style.back">
        <p v-html="this.question.body">
          {{ this.changedQuestion.body }}
        </p>
      </div>
    </div>
    <div :class="$style.date">
      <span>Последнее обновление : {{ new Date(changedQuestion.updatedAt).toLocaleString() }}</span>
    </div>
    <div>
      <form action="" :class="$style.form">
        <v-text-field v-model="changedQuestion.title"
                      @change="() => { changedQuestion.title === title? this.changed = false :this.changed = true}"
                      @keydown="() => { changedQuestion.title === title? this.changed = false :this.changed = true}"></v-text-field>
        <v-textarea
          name="input-7-1"
          label="Текст вопроса"
          :value="this.changedQuestion.body"
          hint="Hint text"
          v-model="changedQuestion.body"
          @keyup="() => { changedQuestion.body === body? this.changed = false :this.changed = true}"
        ></v-textarea>
        <v-btn
          @click="resetForm"
          elevation="2"
        >Сброс
        </v-btn>
        <v-btn
          elevation="2"
          color="success"
          :disabled="!this.changed"
          @click="changeQuestion"
        >
          <v-icon left>
            mdi-pencil
          </v-icon>
          Сохранить
        </v-btn>
      </form>
    </div>
    <ModalSuccess :is-open="isOpen" :error="error" v-on:close="closeModal" />
  </div>
</template>

<script>

import ModalSuccess from "@/components/ModalSuccess";
export default {
  components: { ModalSuccess },
  layout: 'admin',
  middleware: ['auth', 'is-admin'],
  data() {
    return {
      question: null,
      changedQuestion: null,
      title: null,
      body: null,
      error: '',
      changed: false,
      loading: true,
      isOpen: false
    }
  },
  async fetch() {
   const question = await this.$api.$get('questions/' + this.$route.params.id);
   this.question = question;
   this.changedQuestion = question;
   this.title = question.title;
   this.body = question.body;
  },
  methods: {
    resetForm() {
      this.changedQuestion.body = this.body;
      this.changedQuestion.title = this.title;
      this.changed = false;
    },
    closeModal() {
      this.isOpen = false;
      this.error = '';
      this.$nuxt.refresh();
    },
    async resetQuestion() {
      const question = await this.$api.$get('questions/' + this.$route.params.id);
      this.question = question;
      this.changedQuestion = question;
      this.title = question.title;
      this.body = question.body;
    },
    async changeQuestion() {
      try {
        this.loading = true;
        await this.$api.$put(`questions/${this.$route.params.id}`, {
          title: this.changedQuestion.title,
          icon: this.question.icon,
          body: this.changedQuestion.body
        })
          .then((res) => {
            this.resetForm()
            this.loading = false;
            console.log(res)
            this.isOpen = true;
          }).catch((e) => {
            console.error(e.message);
            this.error = e.message;
            this.isOpen = true;
            if (e.response.status === 403) {
              this.$router.push('/login');
            }
          });
      } catch (e) {
        this.error = e.message;
        this.isOpen = true;
      }
    }
  }
}
</script>

<style lang="scss" module>
.appWrapper {
  padding: 50px;
}

.wrapper {
  display: flex;
  margin-bottom: 20px;
}

.date {
  display: flex;
}

.front {
  border-radius: 10px;
  margin-right: 40px;
  background-color: $yellow;
  @include md-plus {
    height: 315px;
    width: 230px;
    padding: 40px 20px;
  }
  @include xl-plus {
    height: 400px;
    width: 292px;
  }

  h4 {
    line-height: 140%;
    font-weight: 600;
    text-align: center;
    color: $darkBlue;
    @include md-plus {
      font-size: 22px;
    }
    @include xl-plus {
      font-size: 28px;
    }
  }
}

.back {
  background-color: $lightGray;
  border-radius: 10px;
  @include md-plus {
    height: 315px;
    width: 230px;
    padding: 40px 20px;
  }
  @include xl-plus {
    height: 400px;
    width: 292px;
  }

  p {
    margin: 0;
    @include md-minus {
      font-size: 10px;
    }
  }
}

.form {
  max-width: 50%;
}
.window {
  width: 100%;
  height: 100vh;
  @include flex-column;
  align-items: center;
  justify-content: center;
}
</style>
