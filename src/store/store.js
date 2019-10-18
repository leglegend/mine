import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userId: '',
    storeId: '',
    userInfo: {},
    storeInfo: {},
    toasts: [],
    isOverdue: false,
    softVersion: 0,
    serviceEndDate: '',
    jumpInfo: {},
    isCertification: false
  },
  getters: {
    'GET_ISOVERDUE': function (state) {
      return state.isOverdue
    },
    'GET_SOFTVERSION': function (state) {
      return state.softVersion
    },
    'GET_SERVICEENDDATE': function (state) {
      return state.serviceEndDate
    },
    'GET_ISCERTIFICATION': function (state) {
      return state.isCertification
    }
  },
  mutations: {
    userinfo (state, info) {
      const obj = state
      obj.userId = info.Id
      obj.toasts = []
      obj.userInfo = {
        UserName: info.UserName,
        UserLogo: info.UserImg,
        UserMobile: info.UserMobile,
        IsAuthorization: info.IsAuthorization,
        IsBindMobile: info.IsBindMobile
      }
      let storeId = wx.getStorageSync('currentStore')
      obj.storeId = info.UserStores[0].StoreId
      obj.userInfo.UserType = info.UserStores[0].UserType
      obj.storeInfo = {
        StoreName: info.UserStores[0].StoreName,
        StoreLogo: info.UserStores[0].StoreLogo
      }
      if (storeId) {
        for (let item of info.UserStores) {
          if (item.StoreId === storeId) {
            obj.storeId = item.StoreId
            obj.userInfo.UserType = item.UserType
            obj.storeInfo = {
              StoreName: item.StoreName,
              StoreLogo: item.StoreLogo
            }
          }
        }
      }
      console.log('setUserInfo')
      console.log(obj)
    },
    storeInfo (state, info) {
      const obj = state
      obj.storeInfo = {
        StoreName: info.StoreName,
        StoreLogo: info.StoreLogo
      }
    },
    pushToast (state, toast) {
      state.toasts.push(toast)
    },
    unshiftToast (state, toast) {
      let old = state.toasts.shift()
      state.toasts.unshift(toast)
      state.toasts.unshift(old)
    },
    shiftToast (state) {
      state.toasts.shift()
    },
    overdueInfo (state, info) {
      state.isOverdue = info.IsServiceEnd
      // state.isOverdue = 1
      state.softVersion = info.SoftVersion
      state.serviceEndDate = info.ServiceEndDate
      state.isCertification = info.IsCertification
    },
    jumpInfo (state, info) {
      state.jumpInfo = info
    }
  }
})

export default store
