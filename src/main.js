import Vue from 'vue'
import App from './App'

import {post, get, modifyHerders, modifySign, getGlobalUrl, modifyServerPath} from './utils/requestMethod.js'
import {sign} from './utils/sign.js'
import {setGlobalData, getGlobalData, getPages} from './utils/globalData.js'

Vue.prototype.$get = get
Vue.prototype.linkSign = sign
Vue.prototype.modifyHeaders = modifyHerders
Vue.prototype.modifyServerPath = modifyServerPath
Vue.prototype.modifySign = modifySign
Vue.prototype.setGlobalData = setGlobalData
Vue.prototype.getGlobalData = getGlobalData
Vue.prototype.getGlobalUrl = getGlobalUrl
Vue.prototype.getPages = getPages

function relogin (url, body, showLoading, anyway) {
  let globalData = getGlobalData()
  let timestamp = Date.parse(new Date())
  if (globalData.user) {
    let signature = sign(globalData.user, timestamp, JSON.stringify(body))
    modifySign(signature, timestamp)
  }

  return post(url, body, showLoading, anyway)
}

Vue.prototype.$post = function (url, body, showLoading, anyway) {
  let globalData = this.getGlobalData()
  let timestamp = Date.parse(new Date())
  if (globalData.user) {
    let sign = this.linkSign(globalData.user, timestamp, JSON.stringify(body))
    this.modifySign(sign, timestamp)
  }
  return post(url, body, showLoading, anyway, function () {
    return new Promise((resolve, reject) => {
      let user = {
        'Nonce': 'string'
      }
      wx.login({
        success: (res) => {
          let code = res.code
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              relogin('/weixin/loginUser', {
                Code: code,
                State: 'login',
                RawData: res.rawData,
                Signature: res.signature,
                Iv: res.iv,
                EncryptData: res.encryptedData,
                VersionNo: globalData.version
              }).then(function (res) {
                user.Token = res.SignToken
                user.Userid = res.Id
                user.StoreId = res.UserStores[0].StoreId
                user.type = res.UserStores[0].UserType
                user.mobile = res.UserMobile
                user.name = res.UserName
                user.logo = res.UserImg
                let globalData = getGlobalData()
                globalData.user = user
                modifyHerders({
                  'userid': user.Userid,
                  'nonce': 'string',
                  'storeId': body.StoreId ? body.StoreId : 0
                })
                relogin(url, body, showLoading, anyway).then(function (resp) {
                  resolve(resp)
                })
              })
            }
          })
        }
      })
    })
  })
}

Vue.prototype.$success = function (title, goBack, callback) {
  wx.showToast({
    title: title,
    mask: true
  })
  if (goBack) {
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  }
  if (callback) {
    setTimeout(function () {
      callback()
    }, 1500)
  }
}

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
