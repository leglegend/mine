<template>
  <div class="demo-page mine-bind">
    <scroll-view class="demo-scroll bind-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main bind-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context bind-context">
          <div>
            <img :src="!accept ?store.StoreLogo:'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/accept.png'"/>
          </div>
          <div>
            {{!accept ? store.StoreName : '已接受邀请'}}
          </div>
          <div>
            {{!accept ? '邀请你成为他的店员' : '点击完成，进入他的店铺'}}
          </div>
          <div>
            <span class="accept" @click="doAccept" v-if="!accept" :style="{background:canBind?'':'#f0f0f0'}">接受邀请</span>
            <span class="done" @click="done" v-if="accept">完成</span>
          </div>
        </div>
      </div>
      <div class="demo-footer bind-footer" style="padding-top: 10vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/logo3.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import title from '@/components/title'

  export default {
    components: {
      title
    },

    data () {
      return {
        titleHeight: null,
        store: {},
        accept: false,
        canBind: false
      }
    },
    methods: {
      doAccept () {
        if (this.canBind === false) {
          return
        }
        let that = this
        this.$post('/user/businessBindAdmin', {Uid: this.userId, QrCodeStr: this.code}, true).then(res => {
          that.accept = true
        })
      },
      done () {
        wx.removeStorageSync('auth')
        wx.setStorageSync('currentStore', this.storeId)
        const url = '../../index/main'
        wx.reLaunch({url})
      },
      checkBind () {
        let that = this
        this.$post('/user/businessBindAdminCheck', {
          Uid: this.userId,
          QrCodeStr: this.code
        }).then(res => {
          that.canBind = true
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {Uid: this.userId, StoreId: this.storeId}).then(res => {
          that.store = res
        })
      }
    },
    onLoad (res) {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = res.storeId
      this.code = res.code
      this.accept = false
      this.getStoreInfo()
      this.checkBind()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mine-bind {
    height: 100vh;
    background-color: #ff6700;
    .bind-scroll {
      height: 100vh;
      .bind-main {
        padding-top: 10vh;
        .bind-context {
          position: relative;
          z-index: 1000;
          background-color: white;
          margin: 0 auto;
          width: 94vw;
          border-radius: rpx(10);
          div {
            text-align: center;
            &:nth-child(1) {
              padding-top: 7vh;
              img {
                display: inline-block;
                border-radius: 50%;
                border: rpx(1) solid #f2f2f2;
                width: rpx(180);
                height: rpx(180);
              }
            }
            &:nth-child(2) {
              padding-top: 1vh;
              font-size: rpx(33);
            }
            &:nth-child(3) {
              padding-top: 1vh;
              font-size: rpx(26);
              color: #a7a7a7;
            }
            &:nth-child(4) {
              padding-top: 11vh;
              padding-bottom: 17vh;
              span {
                display: inline-block;
                width: 35vw;
                height: rpx(80);
                line-height: rpx(80);
                border-radius: rpx(40);
                font-size: rpx(35);
              }
              .accept {
                color: white;
                background-color: #78bc6d;
              }
              .done {
                border: rpx(1) solid #78bc6d;
                color: #78bc6d;
                background-color: white;
                width: 30vw;
              }
            }
          }
        }
      }
    }
    .bind-footer {
      background-color: #ff6700;
      position: fixed;
      bottom: 0;
      z-index: 1;
    }
  }
</style>
