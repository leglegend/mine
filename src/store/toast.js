import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const toast = new Vuex.Store({
  state: {
    show: false,
    animation: false,
    text: '',
    title: '',
    duration: null,
    icon: null,
    number: null,
    callback: null
  },
  getters: {
    'GET_TOAST_SHOW': function (state) {
      return state.show
    },
    'GET_TOAST_ANIMATION': function (state) {
      return state.animation
    },
    'GET_TOAST_TITLE': function (state) {
      return state.title
    },
    'GET_TOAST_TEXT': function (state) {
      return state.text
    },
    'GET_TOAST_DURATION': function (state) {
      return state.duration
    },
    'GET_TOAST_ICON': function (state) {
      return state.icon
    }
  },
  mutations: {
    hideToast (state) {
      if (state.number) {
        clearTimeout(state.number)
        state.number = null
      }
      state.animation = false
      setTimeout(function () {
        state.show = false
        let cb = state.callback
        cb && cb()
      }, 350)
    },
    showToast (state, data) {
      if (state.show) return
      let dt = {
        show: true,
        animation: true,
        title: data.title || '',
        text: data.text || '',
        duration: data.duration ? data.duration + 700 : null,
        icon: data.icon || '',
        callback: data.callback || null
      }
      state = Object.assign(state, dt)
      if (state.duration) {
        state.number = setTimeout(function () {
          if (state.animation !== false) {
            state.animation = false
            setTimeout(function () {
              state.show = false
              let cb = state.callback
              cb && cb()
            }, 350)
          }
        }, state.duration - 350)
      }
    },
    keepToast (state) {
      state.animation = null
    }
  }
})

export default toast
