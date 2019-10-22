<template>
  <div class="service-fee-page">
    <title :name="'支付手续费说明'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-fee-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-fee-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-fee-context">
          <div class="fee-bg">
            什么叫支付手续费？
          </div>
          <div class="fee-context">
            <div>
              支付手续费是指顾客在使用微信或支付宝支付费用时所产生的点费，费率为0.6%，即100元收取0.6元的手续费，该费用由微信和支付宝收取；
            </div>
            <div>
              特别说明：
            </div>
            <div>
              1、当顾客付款时由微信和支付宝扣除后，将剩余款项打入您的帐户。
            </div>
            <div>
              2、仅顾客在付款时才会产生该费用，如果顾客使用会员卡卡内金额付款时，则不会产生费用。
            </div>
          </div>
          <!--<div class="fee-bottom">
            <div>微信收取费率官方公告</div>
            <div>http://kf.qq.com/faq/140225MveaUz1501077rEfqI.html</div>
          </div>-->
        </div>
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
        titleHeight: null
      }
    },
    methods: {
      getDate () {
        let that = this
        this.$post('/soft/businessGetSoftServerEndDate', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.date = res.ServiceEndDate
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.date = ''
      this.getDate()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-fee-page {
    height: 100vh;
    background-color: white;
    .service-fee-scroll {
      height: 90vh;
      .service-fee-main {
        min-height: 80vh;
        .service-fee-context {
          .fee-bg {
            width: 100vw;
            height: 35.7vw;
            text-align: center;
            line-height: 35.7vw;
            background: url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/pay-bg.jpg);
            background-size: 100%, 100%;
            font-size: 5.9vw;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
          .fee-context {
            padding: 6vw 7vw;
            font-size: 3.3vw;
            font-weight: 400;
            color: rgba(24, 24, 24, 1);
            line-height: 5.6vw;
          }
          .fee-bottom {
            padding: 3vw 7vw;
            font-size: 3.3vw;
            line-height: 5.6vw;
            div {
              &:nth-child(1) {
                font-weight: 600;
              }
              &:nth-child(2) {
                color: #0033A8;
              }
            }
          }
        }
      }
    }
  }
</style>
