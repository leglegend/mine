<template>
  <div class="index-home">
    <div v-if="auth == 'yes'">
      <div class="model-top"></div>
      <div class="model-loading">
        <div class="loading-left"></div>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAGdCAYAAACo606lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjUwNjg2OTNEMDRBMTFFODk3N0U5RDgxNUEwNEQzREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjUwNjg2OTJEMDRBMTFFODk3N0U5RDgxNUEwNEQzREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM1NDBFNjMwOTZGRjExRThBNzA2QkZGQUM2Q0Q1QzFBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM1NDBFNjMxOTZGRjExRThBNzA2QkZGQUM2Q0Q1QzFBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+0rjWuAAAH/1JREFUeNrs3QeYXVW5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"
          class="loading-logo"/>
        <div class="loading-right"></div>
        <div class="wave"></div>
      </div>
      <div class="model-bottom"></div>
    </div>
    <div v-if="auth != 'yes'">
      <div v-if="auth == 'no'" class="radar">
        <div :style="{'padding-top':titleHeight+6+'px'}">
          <div class="radar-count">
            共62881名商户在使用
          </div>
          <div class="radar-context">
            <span class="arrow"></span>
            <div class="circle1">
              <div class="circle2">
                <div class="circle3">
                  <div class="circle4">
                    <div class="circle5">
                      <div class="circle6">
                        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/radar-logo.png"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="radar-store" :animation="showStore1">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/store1.png"/>
              </span>
              <span>
                <span>距您1200米</span>
                <span>已在使用</span>
              </span>
            </span>
            <span class="radar-store" style="left: -40vw;top: 35vw" :animation="showStore2">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/store2.png"/>
              </span>
              <span>
                <span>距您2650米</span>
                <span>已在使用</span>
              </span>
            </span>
          </div>
          <div class="radar-button">
            <button @getuserinfo="getUserInfo" open-type="getUserInfo">微信授权</button>
          </div>
        </div>
      </div>
      <div v-if="auth == 'authing'">
        <div class="model-text">
          <div>
            欢迎使用
          </div>
          <div>
            坚果会员卡商家版
          </div>
        </div>
        <div class="model-logo2">
          <img :src="user.avatarUrl"/>
          <div style="padding-top: 0.5vh">
            {{user.nickName}}
          </div>
        </div>
        <div class="model-button" style="padding-top: 7vh">
          <button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber">立即使用</button>
        </div>
      </div>
      <div v-if="auth == 'stores'" class="index-stores">
        <div class="stores-title">
          <div>
            欢迎观看
          </div>
          <div>
            电子会员卡演示账户
          </div>
          <div>
            根据商家实际营业情况而生成的演示数据，方便您更好的理解该产品
          </div>
        </div>
        <div class="stores-context">
          <div class="stores-item" v-for="item in storeList" @click="initDemoStore(item)">
            <span :style="{background:'url('+item.BgImg+')','background-size':'100%,100%'}">
              <div>{{item.StoreName}}</div>
              <div>{{item.WatchCount}}人已观看</div>
            </span>
          </div>
        </div>
      </div>
      <div v-if="auth == 'choose'" class="index-choose">
        <div class="choose-title">
          <div>
            本系统分为商户版与顾客版
          </div>
          <div>
            顾客通过扫描消费
          </div>
        </div>
        <div class="choose-context">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/choose.png"/>
        </div>
        <div class="choose-button">
            <span @click="doJump">
              商家版
            </span>
        </div>
        <div class="choose-button">
            <span style="background: #78bc6d;" @click="gotoCustomer">
              顾客版
            </span>
        </div>
      </div>
      <div class="model-info" v-if="auth == 'no'||auth=='bind'">
        <div @click="jumpToNutcards">
          了解坚果卡包
        </div>
        <div>
          北京领客先行科技有限公司
        </div>
        <div>
          Bejing Lingkexianxing Technology Co.,Ltd.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        auth: '',
        user: {},
        storeList: [],
        version: null,
        needConfirm: false,
        titleHeight: '',
        showStore1: {},
        showStore2: {}
      }
    },
    methods: {
      jumpToNutcards () {
        const url = '../mine/nutcards/main'
        wx.navigateTo({url})
      },
      redirectToHome () {
        const url = '../home/main'
        wx.switchTab({url})
      },
      redirectToMember () {
        let data = this.getGlobalData()
        data.member = {
          userId: this.option.userId,
          cardId: this.option.cardId
        }
        const url = '../member/home/main'
        wx.switchTab({url})
      },
      redirectToRenew () {
        const url = '../home/main'
        wx.switchTab({url})
      },
      redirectToBind () {
        let params = this.option.c.split('^@^')
        const url = '../mine/bind/main?code=' + params[0] + '&storeId=' + params[1]
        wx.redirectTo({url})
      },
      gotoCustomer () {
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: 'pages/index/main?type=home&storeId=' + this.storeId,
          envVersion: 'trial'
        })
      },
      getUserInfo (e) {
        if (e.mp.detail.errMsg === 'getUserInfo:ok') {
          this.auth = 'yes'
          if (this.option.type && this.option.type === 'home') {
            this.modifyServerPath('home')
          }
          if (this.option.storeId) {
            this.adminLogin(this.option.storeId)
          } else {
            this.login()
          }
        }
      },
      getPhoneNumber (e) {
        console.log(e)
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok' || !e.mp.detail.iv) {
          return
        }
        let info = {
          Uid: this.userId,
          State: 'phone',
          Iv: e.mp.detail.iv,
          EncryptData: e.mp.detail.encryptedData
        }
        let that = this
        this.$post('/weiXin/userMobileDecryption', info, true).then(function (res) {
          that.setUserMobile(res.UserMobile)
          that.auth = 'yes'
        })
      },
      setUserMobile (mobile) {
        let that = this
        this.$post('/user/setUserMobile', {
          Uid: this.userId,
          StoreId: this.storeId,
          SmsCode: '654321',
          UserMobile: mobile
        }, true).then(res => {
          let globalData = that.getGlobalData()
          globalData.mobile = mobile
          if (that.option && that.option.type === 'home') {
            that.getStoreList()
          } else {
            that.doJump()
          }
        })
      },
      doJump () {
        this.needConfirm = true
        if (this.option && this.option.c) {
          this.redirectToBind()
        } else {
          if (this.type !== 0) {
            this.getPermissions()
          } else {
            wx.removeStorage({key: 'auth'})
            if (this.option && this.option.cardId) {
              this.redirectToMember()
            } else if (this.option && this.option.code) {
              this.redirectToRenew()
            } else {
              this.redirectToHome()
            }
          }
        }
      },
      getStoreList () {
        let that = this
        this.$post('/store/businessDemoGetStoreList', {}).then(res => {
          that.auth = 'stores'
          that.storeList = res.DemoStoreList
        })
      },
      initDemoStore (store) {
        let that = this
        this.needConfirm = true
        this.$post('/store/initDemoStore', {
          Uid: this.userId,
          StoreId: this.storeId,
          FromStoreId: store.Id
        }, true).then(res => {
          // that.doJump()
          that.auth = 'choose'
        })
      },
      wxGetUserInfo (code, index) {
        let that = this
        let user = {
          'Nonce': 'string'
        }
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            if (!res.iv && index < 3) {
              that.wxGetUserInfo(code, index + 1)
              return
            }
            let loginInfo = {
              Code: code,
              State: 'login',
              RawData: res.rawData,
              Signature: res.signature,
              Iv: res.iv,
              EncryptData: res.encryptedData,
              VersionNo: that.version
            }
            if (that.path === 'promotion') {
              loginInfo.UserSource = that.userSource
              loginInfo.SourceType = 1
            }
            that.$post('/weixin/loginUser', loginInfo).then(function (res) {
              user.Token = res.SignToken
              user.Userid = res.Id
              user.StoreId = res.UserStores[0].StoreId
              user.type = res.UserStores[0].UserType
              that.type = res.UserStores[0].UserType
              that.storeId = res.UserStores[0].StoreId
              let storeId = wx.getStorageSync('currentStore')
              if (storeId) {
                for (let item of res.UserStores) {
                  if (item.StoreId === storeId) {
                    user.StoreId = item.StoreId
                    user.type = item.UserType
                    that.type = res.UserStores[0].UserType
                    that.storeId = item.StoreId
                  }
                }
              }
              user.mobile = res.UserMobile
              user.name = res.UserName
              user.logo = res.UserImg
              that.userId = res.Id
              let globalData = that.getGlobalData()
              globalData.user = user
              that.user = {
                avatarUrl: user.logo,
                nickName: user.name
              }
              globalData.storeList = res.UserStores
              that.modifyHeaders({
                'userid': user.Userid,
                'token': res.SignToken,
                'nonce': 'string',
                'storeId': that.storeId
              })
              that.$store.commit('userinfo', res)
              if (res.IsBindMobile && that.option.c) {
                that.auth = 'authing'
              } else if (that.option && that.option.type === 'home') {
                that.getStoreList()
              } else {
                that.doJump()
              }
            })
          }
        })
      },
      login () {
        let that = this
        wx.login({
          success: (res) => {
            that.wxGetUserInfo(res.code, 1)
          }
        })
      },
      noAuthLogin () {
        let that = this
        let user = {
          'Nonce': 'string'
        }
        wx.login({
          success: (resp) => {
            let loginInfo = {
              Code: resp.code,
              State: 'login',
              VersionNo: that.version
            }
            if (that.path === 'promotion') {
              loginInfo.UserSource = that.userSource
              loginInfo.SourceType = 1
            }
            that.$post('/weixin/loginUser', loginInfo).then(function (res) {
              user.Token = res.SignToken
              user.Userid = res.Id
              user.StoreId = res.UserStores[0].StoreId
              user.type = res.UserStores[0].UserType
              that.type = res.UserStores[0].UserType
              that.storeId = res.UserStores[0].StoreId
              let storeId = wx.getStorageSync('currentStore')
              if (storeId) {
                for (let item of res.UserStores) {
                  if (item.StoreId === storeId) {
                    user.StoreId = item.StoreId
                    user.type = item.UserType
                    that.type = res.UserStores[0].UserType
                    that.storeId = item.StoreId
                  }
                }
              }
              user.mobile = res.UserMobile
              user.name = res.UserName
              user.logo = res.UserImg
              that.userId = res.Id
              let globalData = that.getGlobalData()
              globalData.user = user
              that.user = {
                avatarUrl: user.logo,
                nickName: user.name
              }
              globalData.storeList = res.UserStores
              that.modifyHeaders({
                'userid': user.Userid,
                'token': res.SignToken,
                'nonce': 'string',
                'storeId': that.storeId
              })
              that.$store.commit('userinfo', res)
              if (that.option && that.option.type === 'home') {
                that.getStoreList()
              } else {
                that.doJump()
              }
            })
          }
        })
      },
      adminLogin (storeId) {
        let that = this
        let user = {
          'Nonce': 'string'
        }
        wx.login({
          success: (res) => {
            let code = res.code
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                let loginInfo = {
                  Code: code,
                  State: 'login',
                  RawData: res.rawData,
                  Signature: res.signature,
                  Iv: res.iv,
                  EncryptData: res.encryptedData,
                  VersionNo: that.version,
                  StoreId: storeId
                }
                that.$post('/weixin/adminLogin', loginInfo).then(function (res) {
                  user.Token = res.SignToken
                  user.Userid = res.Id
                  user.StoreId = res.UserStores[0].StoreId
                  user.type = res.UserStores[0].UserType
                  that.type = res.UserStores[0].UserType
                  user.mobile = res.UserMobile
                  user.storeCount = res.UserStores.length
                  that.userId = res.Id
                  that.storeId = res.UserStores[0].StoreId
                  let globalData = that.getGlobalData()
                  globalData.user = user
                  that.$store.commit('userinfo', res)
                  that.modifyHeaders({
                    'userid': user.Userid,
                    'token': res.SignToken,
                    'nonce': 'string',
                    'storeId': that.storeId
                  })
                  if (res.IsBindMobile) {
                    that.auth = 'authing'
                  } else {
                    that.doJump()
                  }
                })
              }
            })
          }
        })
      },
      getPermissions () {
        let that = this
        this.$post('/user/businessGetAdminPermissions', {
          Uid: that.userId,
          StoreId: that.storeId,
          Userid: that.userId
        }).then(res => {
          wx.setStorage({
            key: 'auth',
            data: res.AdminPermissions,
            success: function () {
              if (that.option && that.option.cardId) {
                that.redirectToMember()
              } else {
                that.redirectToHome()
              }
            }
          })
        })
      },
      showStores () {
        setTimeout(function () {
          let showStore2 = wx.createAnimation()
          showStore2.opacity(1).step({duration: 700})
          this.showStore2 = showStore2.export()
        }.bind(this), 1400)
        setTimeout(function () {
          let showStore1 = wx.createAnimation()
          showStore1.opacity(1).step({duration: 700})
          this.showStore1 = showStore1.export()
        }.bind(this), 4700)
      }
    },
    onLoad (option) {
      let that = this
      if (option.q) {
        let url = decodeURIComponent(option.q)
        if (url.indexOf('?') !== -1) {
          url = url.split('?')[1]
          console.log(url)
          let theRequest = {}
          let strs = url.split('&')
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
          }
          option = theRequest
          console.log(theRequest)
        }
      }
      this.option = option
      if (option) {
        this.path = option.path
        if (this.path === 'promotion') {
          this.userSource = option.userId
        }
        if (option.code) {
          this.$store.commit('jumpInfo', {
            path: 'renew',
            value: option.code
          })
        }
      }
      this.needConfirm = false
      this.showStores()
      let globalData = that.getGlobalData()
      this.version = globalData.version

      if (option.type && (option.type === 'home' || option.type === 'test')) {
        that.modifyServerPath(option.type)
      } else {
        that.modifyServerPath()
      }

      wx.setStorageSync('auth', {})
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            that.auth = 'yes'
            if (option.storeId) {
              that.adminLogin(option.storeId)
            } else if (option.c) {
              let params = that.option.c.split('^@^')
              if (params.length > 2 && params[2] === 'd') {
                that.modifyServerPath('home')
              }
              that.login()
            } else {
              that.login()
            }
          } else {
            if (option.storeId || option.c) {
              that.auth = 'no'
            } else {
              that.noAuthLogin()
            }
          }
        }
      })
      wx.showShareMenu({
        withShareTicket: false
      })
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        if (that.needConfirm) {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        } else {
          updateManager.applyUpdate()
        }
      })
      wx.showTabBar({
        animation: false
      })
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .index-home {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: white;
    .radar {
      height: 100vh;
      background: #f0f0f0;
      .radar-count {
        text-align: center;
        font-size: 2.7vw;
        height: 7.8vw;
      }
      .radar-context {
        text-align: center;
        height: 83vw;
        margin: 0 auto;
        border-radius: 50%;
        // overflow: hidden;
        width: 83vw;
        position: relative;
        div {
          display: inline-block;
          border-radius: 50%;
          border: rpx(4) dashed #dcdcdc;
          box-sizing: border-box;
          vertical-align: middle;
        }
        .arrow {
          left: 41.5vw;
          top: 41.5vw;
          width: 41.5vw;
          height: 41.5vw;
          box-sizing: border-box;
          position: absolute;
          z-index: 100;
          display: inline-block;
          border-left: rpx(3) solid #78bc6d;
          background: linear-gradient(rgba(120, 188, 109, 0), rgba(120, 188, 109, 0.45));
          transform-origin: left top;
          animation: rotate1 5s linear infinite;
          border-radius: 0 0 41.5vw 0;
        }
        @keyframes rotate1 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .circle1 {
          height: 83vw;
          line-height: 83vw;
          width: 83vw;
          vertical-align: top;
        }
        .circle2 {
          height: 65vw;
          line-height: 65vw;
          width: 65vw;
          position: relative;
          top: -1vw;
        }
        .circle3 {
          height: 50vw;
          line-height: 50vw;
          width: 50vw;
          position: relative;
          top: -1vw;
        }
        .circle4 {
          height: 36vw;
          line-height: 36vw;
          width: 36vw;
          position: relative;
          top: -1vw;
        }
        .circle5 {
          height: 24vw;
          line-height: 24vw;
          width: 24vw;
          position: relative;
          top: -1vw;
        }
        .circle6 {
          height: 15vw;
          line-height: 15vw;
          width: 15vw;
          position: relative;
          top: -1vw;
          img {
            display: inline-block;
            vertical-align: middle;
            width: 10vw;
            height: 10vw;
            position: relative;
            top: -1vw;
            z-index: 1000;
          }
        }
        .radar-store {
          opacity: 0;
          position: absolute;
          right: 25vw;
          bottom: 10vw;
          text-align: center;
          display: block;
          img {
            width: rpx(85);
            height: rpx(85);
            display: inline-block;
          }
          font-size: 2.3vw;
          span {
            display: block;
          }
        }
      }
      .radar-button {
        padding-top: 15vw;
        button {
          width: 60vw;
          height: 15vw;
          line-height: 15vw;
          background-color: #78bc6d;
          color: white;
          border-radius: 8vw;
          border: rpx(0) solid #78bc6d;
        }
      }
    }
    .index-stores {
      padding: 8.8vh 7vw 0 7vw;
      .stores-title {
        div {
          &:nth-child(1) {
            font-size: 7.5vw;
          }
          &:nth-child(2) {
            font-size: 7.5vw;

          }
          &:nth-child(3) {
            color: #a7a7a7;
            font-size: 2.7vw;
            padding-top: 2vw;
          }
        }
      }
      .stores-context {
        padding: 7vh 6vw;
        .stores-item {
          height: 15.5vh;
          line-height: 15.5vh;
          text-align: center;
          color: white;
          span {
            width: 72vw;
            height: 24vw;
            line-height: 20vw;
            display: inline-block;
            border-radius: 2vw;
            div:nth-child(1) {
              font-size: 7.3vw;
            }
            div:nth-child(2) {
              font-size: 2vw;
              height: 4vw;
              line-height: 4vw;
              position: relative;
              top: -5.5vw;
            }
          }
        }
      }
    }
    .index-choose {
      padding: 11vh 5vw 0 5vw;
      .choose-title {
        div {
          font-size: 6.8vw;
        }
      }
      .choose-context {
        padding: 8.5vh 6vw;
        img {
          width: rpx(596);
          height: rpx(279);
        }
      }
      .choose-button {
        padding: 2.4vh 6vw;
        color: white;
        span {
          width: 100%;
          text-align: center;
          display: inline-block;
          height: 18.5vw;
          line-height: 18.5vw;
          border-radius: 20vw;
          font-size: 6.5vw;
          background: #ff6700;
        }
      }
    }
    .model-top {
      width: 100vw;
      height: rpx(10);
      position: absolute;
      top: rpx(485);
      background-color: white;
      z-index: 1000;
    }
    .model-bottom {
      width: 100vw;
      height: rpx(10);
      position: absolute;
      top: rpx(643);
      background-color: white;
      z-index: 1000;
    }
    .model-loading {
      position: absolute;
      top: rpx(495);
      width: 100vw;
      height: rpx(150);
      text-align: center;
      overflow: hidden;
      background-color: rgba(166, 166, 166, 0.39);
      z-index: 0;
      .loading-left {
        background-color: white;
        z-index: 30;
        left: 0;
        width: rpx(326);
        height: rpx(205);
        position: absolute;
      }
      .loading-right {
        background-color: white;
        z-index: 30;
        right: 0;
        width: rpx(329);
        height: rpx(205);
        position: absolute;
      }
      .loading-logo {
        height: rpx(150);
        width: rpx(102);
        z-index: 30;
        left: rpx(324);
        display: inline-block;
        position: absolute;
      }
      .wave {
        position: absolute;
        width: rpx(106);
        height: rpx(250);
        z-index: 0;
        left: rpx(322);
        background-color: #ff6700;
        border-radius: 50%;
        animation: change 8s linear infinite;

        &::before,
        &::after {
          content: "";
          position: absolute;
          width: rpx(300);
          height: rpx(300);
          top: 0;
          left: 50%;
          background-color: rgba(255, 255, 255, .4);
          border-radius: 40%;
          transform: translate(-50%, -70%) rotate(0);
          animation: rotate 6s linear infinite;
          z-index: 10;
        }

        &::after {
          border-radius: 47%;
          background-color: rgba(223, 223, 223, 1);
          transform: translate(-50%, -70%) rotate(0);
          animation: rotate 10s linear -5s infinite;
          z-index: 20;
        }
      }

      @keyframes rotate {
        50% {
          transform: translate(-50%, -73%) rotate(180deg);
        }
        100% {
          transform: translate(-50%, -70%) rotate(360deg);
        }
      }

      @keyframes change {
        50% {
          bottom: rpx(3)
        }
        0%, 100% {
          bottom: rpx(-155)
        }
      }
    }
    .model-logo {
      text-align: center;
      padding-top: 23vh;
      img {
        display: inline-block;
        width: rpx(182);
        height: rpx(182);
      }
    }
    .model-logo2 {
      text-align: center;
      padding-top: 9vh;
      font-size: rpx(33);
      img {
        display: inline-block;
        width: rpx(182);
        height: rpx(182);
        border-radius: 50%;
      }
    }
    .model-text {
      padding-left: 8vw;
      padding-top: 14vh;
      font-size: rpx(57);
    }
    .model-button {
      padding-top: 11vh;
      button {
        width: 50vw;
        height: 11vw;
        line-height: 11vw;
        background-color: #78bc6d;
        color: white;
        border-radius: rpx(40);
        border: rpx(0) solid #78bc6d;
      }
    }
    .model-info {
      position: fixed;
      bottom: 3.3vh;
      width: 100vw;
      text-align: center;
      font-size: rpx(19);
      color: #a7a7a7;
      div:nth-child(1) {
        padding-bottom: rpx(25);
        font-size: rpx(26);
        color: #003d82;
      }
    }
  }
</style>
