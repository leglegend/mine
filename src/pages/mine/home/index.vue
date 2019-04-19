<template>
  <scroll-view scroll-y="true" class="mine">
    <div style="height: 90vh">
      <div class="mine-title" :style="{'padding-top':titleHeight+'px'}">
        <div class="title-context">
          <span @click="showLogo(store.StoreLogo?store.StoreLogo:user.avatarUrl)">
            <img :src="store.StoreLogo?store.StoreLogo:user.avatarUrl"/>
          </span>
          <span>
            <div>{{store.StoreName ? store.StoreName : user.nickName}}</div>
            <div>
              <span
                class="hello">{{store.StoreName ? (userType == 0 ? '店长：' : userType == 1 ? '店员：' : '') : ''}}{{store.StoreName ? (store.StoreUserName ? store.StoreUserName : store.UserName) : ''
                }} {{hello}}</span>
            </div>
          </span>
          <span @click="jumpToAccount">
            <img src="/static/setting.png"/>
          </span>
        </div>
      </div>
      <div class="mine-ice">
        <img src="/static/ice.png"/>
      </div>
      <div class="mine-buttons" v-show="auth">
        <span @click="jumpToMessage">
          <div>
            <img src="/static/message.png"/>
          </div>
          <div>群发消息</div>
        </span>
        <span @click="jumpToCollect">
          <div>
            <img src="/static/money.png"/>
          </div>
          <div>收款管理</div>
        </span>
        <span @click="jumpToActivity">
          <div>
            <img src="/static/coupons.png"/>
          </div>
          <div>裂变式营销</div>
        </span>
        <span @click="jumpToCoupon">
          <div>
            <img src="/static/coupon-center.png"/>
          </div>
          <div>优惠券中心</div>
        </span>
      </div>
      <div style="margin-top: 25rpx;" v-show="auth"></div>
      <div class="mine-options">
        <div class="mine-option" v-if="store.IsShowVoiceSeting">
          <div class="card-option">
            <span class="card-icon">
              <img src="/static/voice.png"/>
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
              <img src="/static/qrcode.png"/>
            </span>
            <span class="option-title">
              <span>打印店铺码</span>
              <span>
                用户扫码必用
                <img src="/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option" @click="jumpToAdd" v-show="auth">
          <div class="card-option">
            <span class="card-icon">
              <img src="/static/clerk.png"/>
            </span>
            <span class="option-title">
              <span>添加店员</span>
              <span>
                {{store.AdminCount == 0 || store.AdminCount == undefined ? '你不在店时，店员帮你打理' : (store.AdminCount + '名')}}
                <img src="/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <div class="mine-option">
          <div class="card-option">
            <span class="card-icon">
              <img src="/static/service.png"/>
            </span>
            <span class="option-title">
              <span>咨询客服</span>
              <span>
                <img src="/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
        <button open-type="contact" class="mine-option service"></button>
        <div class="mine-option" @click="jumpToNutcards">
          <div class="card-option">
            <span class="card-icon">
              <img src="/static/detail.png"/>
            </span>
            <span class="option-title  no-line">
              <span>了解坚果卡包</span>
              <span>
                <img src="/static/right2.png"/>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="demo-footer" style="padding-top: 0vh">
      <img class="demo-nutcards" src="/static/nutcards.png"/>
    </div>
    <div v-if="showToast==true">
      <toast :type="type" @hideToast="showToast=false" :checked="type=='success'?checked:!checked"></toast>
    </div>
  </scroll-view>
</template>

<script>
  import card from '@/components/card'
  import toast from '@/components/toast'

  export default {
    components: {
      card, toast
    },

    data () {
      return {
        titleHeight: null,
        store: {},
        showToast: false,
        type: 'success',
        checked: null,
        hello: '',
        user: {},
        auth: true,
        firstLoad: true,
        userType: null
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
      jumpToNutcards () {
        const url = '../nutcards/main?userId=' + this.userId + '&storeId=' + this.storeId
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
        const url = '../collect/main?userId=' + this.userId + '&storeId=' + this.storeId
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
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      let that = this
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.userType = globalData.user.type
      this.firstLoad = true
      this.getStoreInfo()
      let date = new Date()
      if (date.getHours() > 6 && date.getHours() < 12) {
        this.hello = '早上好'
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        this.hello = '下午好'
      } else {
        this.hello = '晚上好'
      }
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
      width: 98vw;
      height: 14.7vh;
      padding-left: 2vw;
      background-color: white;
      position: relative;
      z-index: 1000;
      top: rpx(-2);
      span {
        display: inline-block;
        width: rpx(155);
        text-align: center;
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
    .mine-options {
      width: 100vw;
      background-color: white;
      position: relative;
      .mine-option {
        width: 90vw;
        padding: 0 5vw;
        height: rpx(102);
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
  }
</style>
