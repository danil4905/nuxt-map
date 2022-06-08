export const state = () => ({
  currentPlace: {},
  isOwner: false,
  places: [],
  loading: false
})

export const actions = {
  isOwnerCheck({commit, state}, userId) {
    commit('SET_CURRENT_PLACE', state.currentPlace.userId === userId)
  },
  async getPlace({commit}) {
    commit('SET_LOADING', true)
    let city = this.getters.currentCity.value
    let floor = this.getters.currentFloor
    try {
      const places = await this.$api.$get(`places/by-city?city=${city}&floor=${floor}`)
      commit('SET_PLACES', places)
      commit('SET_CURRENT_PLACE', places[0])
      commit('SET_LOADING', false)
    } catch (e) {
      console.log(e)
      commit('SET_LOADING', false)
    }
  },
  async getPlaceByComponent({commit}, payload) {
    try {
      commit('SET_LOADING', true);
      const places = await this.$api.$get(`places/by-city?city=${payload.city}&floor=${payload.floor}`);
      commit('SET_LOADING', false);
      return places;
    } catch (e) {
      console.log(e)
      commit('SET_LOADING', false)
    }
  },
}

export const mutations = {
  SET_PLACES: (state, payload) => {
    state.places = payload;
    state.loading = false;
  },
  SET_CURRENT_PLACE: (state, payload) => {
    state.currentPlace = payload;
    state.loading = false;
  },
  SET_IS_OWNER: (state, payload) => {
    state.isOwner = payload;
  },
  SET_LOADING: (state, payload) => {
    state.loading = payload;
  }
}
