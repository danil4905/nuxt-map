export const state = () => ({
  users: [],
  userId: null,
})


export const actions = {
  async getUsers({commit}, payload) {
    let surname = payload.lastName ? payload.lastName[0].toUpperCase() + payload.lastName.slice(1) : 'а'
    let name = payload.firstName ? payload.firstName : ''
    try {
      await this.$api.$get(`users/search?lastName=${surname}&firstName=${name}`)
        .then((users) => {
          commit('SET_USERS', users.filter((user, index) => index < 8))
        });
    } catch (e) {
      console.error(e.message)
    }
  },
}

export const mutations = {
  SET_USERS: (state, payload) => {
    state.users = payload;
  },
  SET_USER_ID: (state, payload) => {
    state.userId = payload;
  }
}
