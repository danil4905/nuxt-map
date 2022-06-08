import {citiesList} from '~/static/js/constants.js'
import {widths} from '~/static/js/constants.js'

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn; // auth object as default will be added in vuex state, when you initialize nuxt auth
  },
  getUserInfo(state) {
    return state.auth.user;
  },
  currentIndex: state => state.currentIndex,
  currentCity: state => state.currentCity,
  currentFloor: state => state.currentFloor,
  isDialogOpen: state => state.isDialogOpen,
  isMobile: state => state.isMobile
};
export const state = () => ({
  currentIndex: 1,
  currentCity: citiesList[0],
  currentFloor: citiesList[0].floors[0],
  isDialogOpen: false,
  isMobile: false,
})
export const actions = {
  setMobile({commit}) {
    commit('SET_MOBILE', window.innerWidth <= widths.mobile);
  }
}
export const mutations = {
  CHANGE_CITY: (state, payload) => {
    state.currentCity = citiesList[payload - 1];
    state.currentIndex = payload;
    if (state.currentCity.floors) {
      state.currentFloor = state.currentCity.floors[0];
    }
    state.isOpen = false;
  },
  CHANGE_FLOOR: (state, payload) => {
    state.currentFloor = payload;
  },
  TOGGLE_MODAL: (state, payload) => {
    state.isDialogOpen = payload;
  },
  SET_MOBILE: (state, payload) => {
    state.isMobile = payload;
  },
}

