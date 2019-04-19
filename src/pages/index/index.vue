<template>
  <div class="index-home">
    <div v-if="auth == 'yes'">
      <div class="model-top"></div>
      <div class="model-loading">
        <div class="loading-left"></div>
        <img src="/static/logo.png" class="loading-logo"/>
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
                        <img src="/static/radar-logo.png"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="radar-store" :animation="showStore1">
              <span>
                <img src="/static/store1.png"/>
              </span>
              <span>
                <span>距您1200米</span>
                <span>已在使用</span>
              </span>
            </span>
            <span class="radar-store" style="left: -40vw;top: 35vw" :animation="showStore2">
              <span>
                <img src="/static/store2.png"/>
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
      redirectToBind () {
        let params = this.option.c.split('^@^')
        const url = '../mine/bind/main?code=' + params[0] + '&storeId=' + params[1]
        wx.redirectTo({url})
      },
      gotoCustomer () {
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: 'pages/index/main?type=demo&storeId=' + this.storeId,
          envVersion: 'trial'
        })
      },
      getUserInfo (e) {
        if (e.mp.detail.errMsg === 'getUserInfo:ok') {
          this.auth = 'yes'
          if (this.option.type && this.option.type === 'home') {
            this.modifyServerPath('home')
          }
          this.login()
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
            if (this.option && this.option.cardId) {
              this.redirectToMember()
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
            that.$post('/weixin/loginUser', loginInfo).then(function (res) {
              user.Token = res.SignToken
              user.Userid = res.Id
              user.StoreId = res.UserStores[0].StoreId
              user.type = res.UserStores[0].UserType
              that.type = res.UserStores[0].UserType
              user.mobile = res.UserMobile
              user.name = res.UserName
              user.logo = res.UserImg
              that.userId = res.Id
              that.storeId = res.UserStores[0].StoreId
              let globalData = that.getGlobalData()
              globalData.user = user
              that.user = {
                avatarUrl: user.logo,
                nickName: user.name
              }
              that.modifyHeaders({
                'userid': user.Userid,
                'nonce': 'string',
                'storeId': that.storeId
              })
              if (res.IsBindMobile) {
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
                  that.userId = res.Id
                  that.storeId = res.UserStores[0].StoreId
                  let globalData = that.getGlobalData()
                  globalData.user = user

                  that.modifyHeaders({
                    'userid': user.Userid,
                    'nonce': 'string'
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
            that.auth = 'no'
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
