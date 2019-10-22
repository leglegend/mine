<template>
  <div class="renew" :animation="animationBg" @click="close">
    <div class="renew-context" :animation="animation" @click.stop="">
      <div class="context-close">
        <span @click="close">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </span>
      </div>
      <div class="context-store">
        <span>
          <img :src="store.StoreLogo"/>
        </span>
        <span>
          {{store.StoreName}}
        </span>
      </div>
      <div class="context-cash" v-if="!item.Code">
        <div>¥{{item.DiscountPrice}}</div>
        <div>应付金额</div>
        <div v-if="item.DiscountPrice&&item.OriginalPrice">已优惠¥{{item.OriginalPrice - item.DiscountPrice}}</div>
      </div>
      <div class="context-coupon" v-if="item.Code">
        <div v-if="item.State==1">¥0</div>
        <div v-if="item.State!=1" style="color: #9C9C9C">优惠码已失效</div>
        <div>
          <span>淘宝优惠码</span>
        </div>
      </div>
      <div class="context-info">
        订购周期：{{item.CycleTitle}}
      </div>
      <div class="context-info">
        订购时段：{{item.EffectiveTime}}
      </div>
      <form report-submit="true" @submit="pay">
        <div class="context-button">
          <button formType="submit">{{item.Code && item.State != 1 ? '知道了' : '支付'}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['item'],
    data () {
      return {
        animation: {},
        animationBg: {},
        store: this.$store.state.storeInfo
      }
    },
    methods: {
      jumpToSuccess () {
        const url = '../success/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.redirectTo({url})
      },
      close () {
        let animation = wx.createAnimation()
        animation.bottom('-62vh').step({duration: 200})
        this.animation = animation.export()
        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.animationBg = modelAnimation.export()
        setTimeout(function () {
          this.$emit('close')
        }.bind(this), 250)
      },
      pay (e) {
        let that = this
        if (this.item.Code) {
          if (this.item.State !== 1) {
            this.close()
          } else {
            this.$post('/soft/businessUsedSoftDiscountCoupon', {
              StoreId: this.storeId,
              Code: this.item.Code,
              Uid: this.userId,
              FormId: e.mp.detail.formId
            }).then(res => {
              that.getSoftServerInfo()
            })
          }
          return
        }
        this.$post('/soft/businessPaySoftPrice', {
          StoreId: this.storeId,
          SoftPriceId: this.item.Id,
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
              that.getSoftServerInfo()
            }
          })
        })
      },
      getSoftServerInfo () {
        let that = this
        this.$post('/soft/getSoftServerInfo', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          that.$store.commit('overdueInfo', res)
          that.close()
          that.jumpToSuccess()
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('0').step({duration: 200})
        this.animation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0.35)').step({duration: 200})
        this.animationBg = modelAnimation.export()
      }.bind(this), 50)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .renew {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1000;
    span {
      display: inline-block;
      vertical-align: top;
    }
    .renew-context {
      position: absolute;
      bottom: -62vh;
      left: 0;
      width: 100vw;
      height: 62vh;
      background: white;
      .context-close {
        height: 8vh;
        span {
          padding: 3.5vw 4.2vw;
          width: 4.1vw;
          height: 4.1vw;
        }
        img {
          display: inline-block;
          width: 4.1vw;
          height: 4.1vw;
          vertical-align: top;
        }
      }
      .context-store {
        height: 11.4vh;
        padding-left: 6.9vw;
        font-size: 5vw;
        span {
          height: 13vw;
          line-height: 13vw;
          &:nth-child(1) {
            width: 16.6vw;
          }
        }
        img {
          display: inline-block;
          vertical-align: top;
          width: 13vw;
          height: 13vw;
          border-radius: 50%;
        }
      }
      .context-cash {
        height: 16vh;
        text-align: center;
        div {
          &:nth-child(1) {
            font-size: 8vw;
            font-weight: 600;
            color: black;
            line-height: 8vw;
          }
          &:nth-child(2) {
            font-size: 4vw;
            color: black;
            line-height: 4vw;
            padding: 2.3vw 0;
          }
          &:nth-child(3) {
            font-size: 4vw;
            color: #9C9C9C;
            line-height: 4vw;
          }
        }
      }
      .context-coupon {
        height: 16vh;
        text-align: center;
        div {
          &:nth-child(1) {
            font-size: 8vw;
            font-weight: 600;
            color: black;
            line-height: 8vw;
          }
          &:nth-child(2) {
            padding-top: 2.5vw;
          }
        }
        span {
          width: 29.6vw;
          height: 7vw;
          line-height: 7vw;
          background: rgba(236, 0, 0, 1);
          border-radius: 3.5vw;
          color: white;
        }
      }
      .context-info {
        height: 11.3vw;
        border-top: 0.1vw solid #f0f0f0;
        line-height: 11.3vw;
        width: 78vw;
        margin: 0 auto;
        font-size: 3.5vw;
        color: #9C9C9C;
      }
      .context-button {
        padding-top: 2.3vw;
        width: 78vw;
        margin: 0 auto;
        text-align: right;
        button {
          display: inline-block;
          width: 31.8vw;
          height: 13.3vw;
          background: #FF6700;
          border-radius: 6.6vw;
          line-height: 13.3vw;
          color: white;
          font-size: 5.5vw;
          text-align: center;
        }
      }
    }
  }
</style>
