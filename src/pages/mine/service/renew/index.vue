<template>
  <div class="service-renew-page">
    <title :name="'续费'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-renew-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-renew-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-renew-context">
          <div class="renew-items">
            <span v-for="(item,index) in items" class="renew-item" @click="currentIndex = index">
              <div class="item-border" :class="{'item-checked':currentIndex == index}">
                <div>{{item.CycleTitle}}</div>
                <div>¥{{item.DiscountPrice}}</div>
                <div>¥{{item.OriginalPrice}}</div>
              </div>
            </span>
          </div>
          <form report-submit="true" @submit="openRenew">
            <div class="renew-button">
              <button formType="submit">确定续费</button>
            </div>
          </form>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showRenew">
      <renew :item="currentItem" @close="showRenew=false"></renew>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import renew from '@/components/renew'

  export default {
    components: {
      title, renew
    },

    data () {
      return {
        items: [],
        currentIndex: 0,
        currentItem: {},
        showRenew: false,
        titleHeight: null
      }
    },
    methods: {
      jumpToSuccess () {
        const url = '../success/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.redirectTo({url})
      },
      openRenew () {
        this.currentItem = this.items[this.currentIndex]
        this.showRenew = true
      },
      pay (e) {
        let that = this
        let item = this.items[this.currentIndex]
        this.$post('/soft/businessPaySoftPrice', {
          StoreId: this.storeId,
          SoftPriceId: item.Id,
          Uid: this.userId,
          FormId: e.mp.detail.formId
        }).then(res => {
          that.weixinPay(res.SoftOrderId)
        })
      },
      weixinPay (id) {
        let that = this
        this.$post('/pay/getBusinessPayParam', {
          OrderId: id,
          PayType: 0,
          OrderType: 1,
          StoreId: this.storeId,
          Uid: this.userId
        }, true).then(result => {
          let res = JSON.parse(result.ParmJson)
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: function () {
              that.jumpToSuccess()
            }
          })
        })
      },
      getItems () {
        let that = this
        this.$post('/soft/businessGetSoftPrice', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.items = res.SoftPrices
        })
      },
      getCouponInfo (code) {
        let that = this
        this.$post('/soft/businessGetSoftDiscountCoupon', {
          Uid: this.userId,
          StoreId: this.storeId,
          Code: code
        }, true).then(res => {
          res.Code = code
          that.currentItem = res
          that.showRenew = true
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.showRenew = false
      if (option.code) {
        this.getCouponInfo(option.code)
      }
      this.currentIndex = 0
      this.getItems()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-renew-page {
    height: 100vh;
    background-color: #f0f0f0;
    .service-renew-scroll {
      height: 90vh;
      .service-renew-main {
        min-height: 80vh;
        .service-renew-context {
          padding: 14.8vw 6.8vw;
          background: white;
          .renew-item {
            padding: 0 2.4vw 4.9vw 2.4vw;
            display: inline-block;
            .item-border {
              width: 24vw;
              height: 29.1vw;
              box-sizing: border-box;
              border: 0.2vw solid rgba(173, 137, 81, 1);
              border-radius: 1.5vw;
              div {
                text-align: center;
                &:nth-child(1) {
                  padding-top: 4.8vw;
                  height: 3.9vw;
                  line-height: 3.9vw;
                  font-size: 4.1vw;
                  font-family: MicrosoftYaHei-Bold;
                  font-weight: 700;
                  color: rgba(173, 137, 81, 1);
                }
                &:nth-child(2) {
                  padding-top: 3.7vw;
                  height: 5.7vw;
                  line-height: 5.7vw;
                  font-size: 7.3vw;
                  font-weight: 300;
                  color: rgba(173, 137, 81, 1);
                }
                &:nth-child(3) {
                  padding-top: 3.2vw;
                  height: 3vw;
                  line-height: 3vw;
                  font-size: 3.9vw;
                  font-family: PingFang-SC-Regular;
                  font-weight: 400;
                  color: #929296;
                  text-decoration: line-through;
                }
              }
            }
            .item-checked {
              border: 0.2vw solid #76541E;
              background: linear-gradient(131deg, rgba(232, 202, 147, 1), rgba(243, 214, 166, 1));
              div {
                &:nth-child(1) {
                  color: #76541E !important;
                }
                &:nth-child(2) {
                  color: #76541E !important;
                }
                &:nth-child(3) {
                  color: #76541E !important;
                }
              }
            }
          }
          .renew-button {
            padding-top: 3.3vw;
            padding-bottom: 0.4vw;
            text-align: center;
            button {
              display: inline-block;
              width: 58.7vw;
              height: 12.3vw;
              line-height: 12.3vw;
              background: linear-gradient(90deg, rgba(215, 180, 117, 1), rgba(229, 198, 142, 1), rgba(245, 216, 169, 1));
              border-radius: 6.2vw;
              font-size: 5vw;
              font-family: MicrosoftYaHei-Bold;
              font-weight: bold;
              color: rgba(118, 84, 30, 1);
              letter-spacing: 1.5vw;
            }
          }
        }
      }
    }
  }
</style>
