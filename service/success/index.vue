<template>
  <div class="service-success-page">
    <title :name="'续费'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-success-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-success-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-success-context">
          <div class="success-logo">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/pay-success.png"/>
          </div>
          <div class="success-title">
            付款成功
          </div>
          <div class="success-context">
            您的软件有效期至：{{date}}
          </div>
          <div class="success-jump">
            ({{second}}秒后跳转到订购记录)
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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
        date: '',
        second: 3,
        titleHeight: null
      }
    },
    methods: {
      jumpToRecord () {
        const url = '../record/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.redirectTo({url})
      },
      getDate () {
        let that = this
        this.$post('/soft/businessGetSoftServerEndDate', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.date = res.ServiceEndDate
        })
      },
      beginJump () {
        setTimeout(function () {
          if (this.second === 0) {
            this.jumpToRecord()
          } else {
            this.second -= 1
            this.beginJump()
          }
        }.bind(this), 1000)
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.date = ''
      this.second = 3
      this.beginJump()
      this.getDate()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-success-page {
    height: 100vh;
    background-color: #f0f0f0;
    .service-success-scroll {
      height: 90vh;
      .service-success-main {
        min-height: 80vh;
        .service-success-context {
          padding: 24.3vw 0 23.6vw 0;
          background: white;
          text-align: center;
          img {
            width: 14.5vw;
            height: 14.5vw;
            display: inline-block;
          }
          .success-logo {
            height: 14.5vw;
          }
          .success-title {
            height: 5.8vw;
            font-size: 6.1vw;
            font-family: PingFang-SC-Bold;
            font-weight: 600;
            color: rgba(118, 84, 30, 1);
            line-height: 5.8vw;
            padding-top: 2.8vw;
            letter-spacing: 1vw;
          }
          .success-context {
            padding-top: 5.1vw;
            height: 4.2vw;
            font-size: 4.4vw;
            color: rgba(172, 172, 179, 1);
            line-height: 4.2vw;
          }
          .success-jump {
            padding-top: 2vw;
            font-size: 3vw;
            color: rgba(172, 172, 179, 1);
          }
        }
      }
    }
  }
</style>
