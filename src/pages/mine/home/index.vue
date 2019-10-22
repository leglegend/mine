<template>
  <scroll-view scroll-y="true" class="mine">
    <div style="height: 90vh;position:relative;z-index: 1;">
      <div class="mine-title" :style="{'padding-top':titleHeight+'px'}">
        <div class="title-context">
          <span @click="showLogo(store.StoreLogo?store.StoreLogo:user.avatarUrl)">
            <img :src="store.StoreLogo?store.StoreLogo:user.avatarUrl"/>
          </span>
          <span>
            <div @click="jumpToNutcards">
              {{store.StoreName ? store.StoreName : (user.nickName ? user.nickName : user.UserName)}}
              <img class="vip-icon" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/vip.png"/>
            </div>
            <div>
              <span
                class="hello">{{store.StoreName ? (userType == 0 ? '店长：' : userType == 1 ? '店员：' : '') : ''}}{{store.StoreName ? (store.StoreUserName ? store.StoreUserName : store.UserName) : ''
                }} {{hello}}</span>
            </div>
          </span>
          <span @click="jumpToAccount">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/setting.png"/>
          </span>
        </div>
      </div>
      <div class="mine-ice">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ice.png"/>
      </div>
      <div class="mine-buttons" v-show="auth" :style="{filter:isOverdue?'grayscale(100%)':''}">
        <span @click="isOverdue?showToast2=true:jumpToMessage()">
          <div>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/message.png"/>
          </div>
          <div>群发消息</div>
        </span>
        <span @click="isOverdue?showToast2=true:jumpToActivity()">
          <div>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupons.png"/>
          </div>
          <div>裂变式营销</div>
        </span>
        <span @click="isOverdue?showToast2=true:jumpToCoupon()">
          <div>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-center.png"/>
          </div>
          <div>优惠券中心</div>
        </span>
      </div>
      <div class="gathering-buttons" v-show="auth">
        <span class="gathering-left" @click="jumpToCollect"><img style="width: 5.8vw;height: 5.8vw"
                                                                 src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/shoukuanjilu.png"/> 收款记录</span>
        <span class="gathering-right" @click="jumpToGathering"><img style="width: 5.2vw;height: 5.2vw"
                                                                    src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/qian.png"/> 收款账户设置</span>
      </div>
      <div style="margin-top: 20rpx;" v-show="auth"></div>
      <div class="mine-options">
        <div class="mine-option" v-if="store.IsShowVoiceSeting">
          <div class="card-option">
            <span class="card-icon">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/voice.png"/>
            </span>
            <span class="option-title">
              <span>接收消卡/付款声音</span>
              <span>
                 <switch @change="switchChange" :checked="checked" color="#78bc6d"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option" @click="jumpToCode">
          <div class="card-option">
            <span class="card-icon">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/qrcode.png"/>
            </span>
            <span class="option-title">
              <span>打印店铺码</span>
              <span>
                用户扫码必用
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option" @click="jumpToAdd" v-show="auth">
          <div class="card-option">
            <span class="card-icon">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/clerk.png"/>
            </span>
            <span class="option-title">
              <span>添加店员</span>
              <span>
                {{store.AdminCount == 0 || store.AdminCount == undefined ? '你不在店时，店员帮你打理' : (store.AdminCount + '名')}}
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option" @click="jumpToContact">
          <div class="card-option">
            <span class="card-icon">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/service.png"/>
            </span>
            <span class="option-title">
              <span>咨询客服</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option" @click="jumpToNutcards">
          <div class="card-option">
            <span class="card-icon">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/detail.png"/>
            </span>
            <span class="option-title  no-line">
              <span>商家服务中心</span>
              <span>
                <text class="option-overdue" v-if="isOverdue">已到期</text>
                <text class="option-overdue option-test" v-if="!isOverdue&&softVersion==0">试用期</text>
                {{date ? date + ' 到期' : ''}}
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="demo-footer" style="padding-top: 0vh;z-index: -1;">
      <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
    </div>
    <div v-if="showToast==true" class="toast-model">
      <toast :type="type" @hideToast="showToast=false" :checked="type=='success'?checked:!checked"></toast>
    </div>
    <div v-if="showToast2">
      <renewtoast @close="showToast2 = false"></renewtoast>
    </div>
    <div class="ming-need-auth" v-if="showAuth" @click="showAuth=false">

    </div>
    <div class="mine-auth" v-if="!showAuth&&!isAuth">
      <div class="auth-model">
        <div class="model-title">该操作需要您的授权</div>
        <div class="model-close" @click="showAuth=true">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </div>
        <div class="model-button">
          <button @getuserinfo="getUserInfo" open-type="getUserInfo">微信授权</button>
        </div>
      </div>
    </div>
    <div class="mine-auth" v-if="!showAuth&&!isBindMobile&&isAuth">
      <div class="auth-model">
        <div class="model-title">需要您的手机号</div>
        <div class="model-close" @click="showAuth=true">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </div>
        <div class="model-button">
          <button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber">获取手机号</button>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
  import card from '@/components/card'
  import toast from '@/components/toast'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      card, toast, renewtoast
    },

    data () {
      return {
        titleHeight: null,
        store: {},
        showToast: false,
        showToast2: false,
        type: 'success',
        checked: null,
        hello: '',
        user: {},
        auth: true,
        date: '',
        firstLoad: true,
        userType: null,
        isAuth: '',
        isBindMobile: '',
        showAuth: false
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      },
      softVersion () {
        return this.$store.getters.GET_SOFTVERSION
      }
    },
    methods: {
      jumpToActivity () {
        const url = '../activity/home/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToCoupon () {
        const url = '../coupon/home/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToChoose () {
        const url = '../gathering/choose/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToNutcards () {
        const url = '../service/home/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToContact () {
        const url = '../contact/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToCode () {
        const url = '../code/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToVoice () {
        const url = '../voice/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToAccount () {
        const url = '../account/main?userId=' + this.userId + '&storeId=' + this.storeId + '&storeName=' + this.store.StoreName
        wx.navigateTo({url})
      },
      jumpToMessage () {
        const url = '../message/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToCollect () {
        const url = '../gathering/collect/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToGathering () {
        const url = '../gathering/choose/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToAdd () {
        const url = '../add/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      showLogo (src) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      },
      switchChange (e) {
        let value = e.mp.detail.value
        let that = this
        that.showToast = false
        this.$post('/user/businessSetIsVoice', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsVoice: value
        }, true, true).then(res => {
          if (res.State) {
            that.type = 'success'
            that.checked = value
          } else {
            that.type = 'error'
            that.checked = that.checked
          }
          that.showToast = true
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreManagementData', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          that.store = res
          that.checked = res.IsVoice
          that.firstLoad = false
        })
        this.$post('/soft/businessGetSoftServerEndDate', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.date = res.ServiceEndDate
        })
      },
      getUserInfo (e) {
        if (e.mp.detail.errMsg === 'getUserInfo:ok') {
          this.wxGetUserInfo(1)
        }
      },
      wxGetUserInfo (index) {
        let that = this
        let user = {
          'Nonce': 'string'
        }
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            if (!res.iv && index < 3) {
              that.wxGetUserInfo(index + 1)
              return
            }
            let loginInfo = {
              Uid: that.userId,
              State: 'login',
              RawData: res.rawData,
              Signature: res.signature,
              Iv: res.iv,
              EncryptData: res.encryptedData,
              VersionNo: that.version
            }
            that.$post('/weixin/userAuthorization', loginInfo, true).then(function (res) {
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
              that.getStoreInfo()
              that.isAuth = true
            })
          }
        })
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
          that.isBindMobile = true
        })
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      let that = this
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.userType = globalData.user.type
      this.firstLoad = true
      this.showToast2 = false
      this.isAuth = !this.$store.state.userInfo.IsAuthorization
      // this.isAuth = false
      this.isBindMobile = !this.$store.state.userInfo.IsBindMobile
      this.user = this.$store.state.userInfo
      // this.showAuth = !(this.isAuth && this.isBindMobile)
      this.showAuth = false
      this.getStoreInfo()
      let date = new Date()
      if (date.getHours() > 6 && date.getHours() < 12) {
        this.hello = '早上好'
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        this.hello = '下午好'
      } else {
        this.hello = '晚上好'
      }
      this.version = globalData.version
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
      wx.getUserInfo({
        success: function (res) {
          that.user = JSON.parse(res.rawData)
        }
      })
    },
    onShow () {
      this.auth = true
      let permissions = wx.getStorageSync('auth')
      if (permissions && permissions.length > 0) {
        for (let item of permissions) {
          if (item.PController === 'tools' && item.State === 0) {
            this.auth = false
          }
        }
      }
      if (this.firstLoad) {
        return
      }
      this.getStoreInfo()
    },
    onShareAppMessage () {
      return {
        title: '坚果卡包商家版',
        path: '/pages/index/main'
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mine {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .mine-title {
      width: 100vw;
      height: rpx(140);
      background: linear-gradient(to right, #ff8100, #ff6700);
      .title-context {
        width: 90vw;
        height: rpx(140);
        line-height: rpx(140);
        margin: 0 auto;
        span {
          display: inline-block;
          vertical-align: middle;
          height: rpx(140);
          &:nth-child(1) {
            width: 21vw;
            img {
              display: inline-block;
              width: rpx(130);
              height: rpx(130);
              border-radius: 50%;
            }
          }
          &:nth-child(2) {
            width: 60vw;
            line-height: rpx(60);
            color: white;
            div {
              &:nth-child(1) {
                font-size: rpx(45);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              &:nth-child(2) {
                line-height: rpx(60);
                font-size: rpx(20);
                width: auto;
                .hello {
                  height: rpx(30);
                  line-height: rpx(30);
                  padding: rpx(5) rpx(25);
                  width: auto;
                  background-color: #e05f00;
                  border-radius: rpx(25);
                }
              }
            }
          }
          &:nth-child(3) {
            width: 9vw;
            text-align: right;
            line-height: rpx(60);
            img {
              display: inline-block;
              vertical-align: middle;
              width: rpx(42);
              height: rpx(42);
            }
          }
        }
        .vip-icon {
          width: 5.7vw;
          height: 4.4vw;
          vertical-align: top;
          display: inline-block;
          position: relative;
          left: -0.5vw;
        }
      }
    }
    .mine-ice {
      width: 100vw;
      height: rpx(90);
      padding-top: rpx(10);
      overflow: hidden;
      position: relative;
      top: rpx(-1);
      background: linear-gradient(to right, #ff8100, #ff6700);
      img {
        width: 100vw;
        display: inline-block;
        height: rpx(287);
      }
    }
    .mine-buttons {
      width: 92vw;
      height: 21vw;
      padding-left: 4vw;
      padding-right: 4vw;
      background-color: white;
      position: relative;
      z-index: 1000;
      top: rpx(-2);
      span {
        display: inline-block;
        width: 25%;
        text-align: center;
        position: relative;
        top: -1vw;
        div {
          &:nth-child(1) {
            img {
              display: inline-block;
              width: rpx(84);
              height: rpx(84);
            }
          }
          &:nth-child(2) {
            font-size: rpx(25);
          }
        }
      }
    }
    .gathering-buttons {
      height: 13vw;
      padding-top: 2.4vw;
      border-top: 0.1vw solid #dddddd;
      background: white;
      box-sizing: border-box;
      position: relative;
      top: rpx(-2);
      z-index: 1001;
      span {
        display: inline-block;
        text-align: center;
        width: 50%;
        height: 8.3vw;
        line-height: 8.3vw;
        color: #4D4D4D;
        font-size: 3.7vw;
        vertical-align: top;
        letter-spacing: 0.5vw;
      }

      .gathering-left {
        box-sizing: border-box;
        border-right: 0.1vw solid #dddddd;
        img {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          top: -0.5vw;
          left: -0.5vw;
        }
      }
      .gathering-right {
        img {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          left: -0.5vw;
          top: -0.2vw;
        }
      }
    }
    .mine-options {
      width: 100vw;
      background-color: white;
      position: relative;
      .mine-option {
        width: 90vw;
        padding: 0 5vw;
        height: rpx(101);
        .card-option {
          height: rpx(100);
          line-height: rpx(100);
          width: 90vw;
          font-size: rpx(27);
          span {
            display: inline-block;
            vertical-align: top;
            height: rpx(100);
            line-height: rpx(100);
          }
          .card-icon {
            width: 8vw;
            height: rpx(100);
            line-height: rpx(100);
            img {
              display: inline-block;
              height: rpx(50);
              width: rpx(50);
              vertical-align: middle;
            }
          }
          .option-title {
            width: 82vw;
            border-bottom: rpx(1) solid #dddddd;
            span {
              img {
                display: inline-block;
                height: rpx(21);
                width: rpx(13);
                vertical-align: middle;
                position: relative;
                top: rpx(-1);
              }
              &:nth-child(1) {
                width: 30vw;
              }
              &:nth-child(2) {
                width: 50vw;
                padding-right: 2vw;
                text-align: right;
                color: #bfbfbf;
              }
            }
            .option-overdue {
              width: 10.8vw;
              display: inline-block;
              text-align: center;
              height: 3.7vw;
              line-height: 3.7vw;
              background: #EC0000;
              color: white;
              border-radius: 19px;
              font-size: 2.5vw;
              margin-right: 1vw;
              position: relative;
              top: -0.3vw;
            }
            .option-test {
              background: #78BC6D;
            }
          }
          .no-line {
            border-bottom: 0;
          }
        }
      }
      .service {
        width: 100vw;
        padding: 0;
        position: absolute;
        bottom: rpx(102);
        opacity: 0;
      }
    }
    .toast-model {
      position: fixed;
      bottom: 0;
      z-index: 1000;
    }
    .ming-need-auth {
      z-index: 9999;
      width: 100vw;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
    }
    .mine-auth {
      z-index: 9999;
      width: 100vw;
      position: fixed;
      left: 0;
      top: 0;
      height: 70vh;
      background: rgba(0, 0, 0, 0.35);
      padding-top: 30vh;
      .auth-model {
        padding-top: 3vw;
        width: 80vw;
        margin: 0 auto;
        border-radius: 3vw;
        background: white;
        text-align: center;
        position: relative;
        .model-title {
          line-height: 20vw;
          font-size: 6vw;
          color: black;
        }
        .model-close {
          width: 5vw;
          height: 5vw;
          position: absolute;
          right: 3vw;
          top: 3vw;
          img {
            width: 5vw;
            height: 5vw;
            display: inline-block;
            vertical-align: top;
          }
        }
        .model-button {
          padding-bottom: 10vw;
          padding-top: 3vw;
          button {
            display: inline-block;
            height: 10vw;
            line-height: 10vw;
            width: 55vw;
            color: white;
            background: #00b500;
            border-radius: 5vw;
            font-size: 5vw;
          }
        }
      }
    }
  }
</style>
