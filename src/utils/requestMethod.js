import {sign} from './sign.js'
import log from './log'
// let serverPath = 'https://testbapi.nutcards.com/api'
let serverPath = 'https://bapi.nutcards.com/api'
// let wssPath = 'wss://testws.nutcards.com'
let wssPath = 'wss://ws.nutcards.com'
let header = {
  'content-type': 'application/json',
  'Accept': 'application/json; charset=utf-8 '
}

export function getGlobalUrl () {
  return {
    url: serverPath,
    wss: wssPath
  }
}

export function post (url, body, showLoading, anyway, callback) {
  let timestamp = Date.parse(new Date())
  console.log(header)
  let requestHeader = {
    'content-type': 'application/json',
    'Accept': 'application/json; charset=utf-8 '
  }
  if (header.userid) {
    let signstring = sign(header, timestamp, JSON.stringify(body))
    requestHeader = {
      'content-type': 'application/json',
      'Accept': 'application/json; charset=utf-8 ',
      'userid': header.userid,
      'token': header.token,
      'nonce': 'string',
      'signature': signstring,
      'timestamp': timestamp
    }
  }
  if (showLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  console.log('POST:' + serverPath + url)
  console.log(body)
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverPath + url,
      data: body,
      method: 'POST',
      header: requestHeader,
      success: function (res) {
        console.log(res)
        if (showLoading) {
          wx.hideLoading()
        }
        if (res.data.StatusCode === 409) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '您已经不是该店店员，如有问题请咨询店长。',
            confirmColor: '#ff6700',
            success: function () {
              const url = '../index/main'
              wx.reLaunch({url})
            }
          })
          return
        }
        if (res.data.StatusCode === 403 || res.data.StatusCode === 405 || res.data.StatusCode === 406) {
          log.warn('POST:' + serverPath + url)
          log.warn(body)
          log.warn(res)
          callback().then(function (resp) {
            resolve(resp)
          })
        } else {
          if (anyway) {
            resolve(res.data)
            return
          }
          if (res.data.StatusCode === 200) {
            resolve(res.data.Data)
          } else {
            log.error('POST:' + serverPath + url)
            log.error(body)
            log.error(res)
            wx.showToast({
              title: res.data.Message,
              image: '/static/warn.png'
            })
          }
        }
      },
      fail: function (ret) {
        log.error('POST:' + serverPath + url)
        log.error(body)
        log.error(ret)
        if (showLoading) {
          wx.hideToast()
        }
        reject(ret)
      }
    })
  })
}

export function get (url, body) {
  console.log('GET:' + serverPath + url)
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverPath + url,
      data: body,
      method: 'GET',
      header: header,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (ret) {
        reject(ret)
      }
    })
  })
}

export function modifyHerders (headers) {
  header = headers
}

export function modifySign (sign, timestamp) {
  header.signature = sign
  header.timestamp = timestamp
}

export function modifyServerPath (type) {
  if (type === 'home') {
    serverPath = 'https://demobapi.nutcards.com/api'
  } else if (type === 'test') {
    serverPath = 'https://testbapi.nutcards.com/api'
  } else {
    serverPath = 'https://bapi.nutcards.com/api'
  }
}
