<template>
  <div class="coupons-home-page">
    <title :name="'优惠券'"></title>
    <scroll-view class="coupons-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupons-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="coupons">
          <div class="coupons-list overdue">
            <div class="coupon-item" v-for="coupon in items">
              <coupon :coupon="coupon" :nouse="true" @remark="couponRemark=coupon.CouponDescription"></coupon>
              <div class="coupon-source">
                {{'来源：' + coupon.CouponSourceContent}}
              </div>
              <div class="coupon-used">
                <img src="/static/current-used.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="couponRemark">
      <remark :text="couponRemark" @close="couponRemark = ''"></remark>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import remark from '@/components/remark'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, remark, coupon
    },

    data () {
      return {
        titleHeight: '',
        items: []
      }
    },
    methods: {
      calcCoupon (coupon) {
        if (coupon.CouponType === 1) {
          let values = (coupon.CouponValue + '').split('.')
          coupon.value1 = values[0]
          if (values.length === 2) {
            coupon.value2 = values[1]
          } else {
            coupon.value2 = 0
          }
        }
        return coupon
      }
    },
    onLoad (option) {
      let that = this
      this.userId = option.userId
      this.storeId = option.storeId
      this.info = {}
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
      this.$post('/consumption/businessGetConsumptionInfo', {
        StoreId: option.storeId,
        Uid: option.userId,
        ConsumptionId: option.consumptionId
      }).then(res => {
        if (res.Coupons) {
          for (let coupon of res.Coupons) {
            coupon = that.calcCoupon(coupon)
          }
          that.items = res.Coupons
        }
      })
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupons-home-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupons-scroll {
      height: 90vh;
      .coupons-main {
        min-height: 80vh;
        .coupons {
          padding: 0 2vw;
          background: white;
          .coupons-list {
            padding: 0 7vw 5vw 7vw;
            background: white;
            .coupon-item {
              padding-top: 6vw;
              position: relative;
              .coupon-source {
                font-size: 2.5vw;
                padding-top: 2vw;
                position: relative;
                left: -1vw;
                color: #bfbfbf;
              }
              .coupon-reason {
                font-size: 2.5vw;
                padding-top: 1vw;
                position: relative;
                left: -1vw;
                color: #bfbfbf;
                span {
                  color: #ff2626;
                }
              }
              .coupon-no {
                position: absolute;
                right: 0;
                top: 6vw;
                z-index: 100;
                img {
                  width: rpx(100);
                  height: rpx(100);
                }
              }
              .coupon-used {
                position: absolute;
                right: 4vw;
                bottom: 2vw;
                z-index: 100;
                img {
                  width: rpx(171);
                  height: rpx(171);
                }
              }
            }
          }
          .coupons-use {
            padding: 0 4vw 4vw 4vw;
            .coupon-item {
              .item-left {
                display: inline-block;
                width: 79vw;
              }
              .item-right {
                display: inline-block;
                width: 5vw;
                vertical-align: top;
                height: 22vw;
                line-height: 22vw;
                img {
                  width: rpx(42);
                  height: rpx(42);
                  display: inline-block;
                  position: relative;
                  top: 1vw;
                  left: 1vw;
                }
                span {
                  width: rpx(40);
                  height: rpx(40);
                  display: inline-block;
                  border: rpx(1) solid #dddddd;
                  border-radius: 50%;
                  position: relative;
                  top: 1vw;
                  left: 1vw;
                }
              }
            }
          }
          .coupon-view {
            padding-top: 7vw;
            font-size: 3.4vw;
            text-align: center;
            color: #7e7e7e;
            span {
              color: #003d82;
            }
          }
          .overdue {
            background: white;
          }
          .coupon {
            height: 22vw;
            background: #fff1ec;
            border-radius: 0.8vw;
            position: relative;
            left: -0.5vw;
            .coupon-left {
              position: relative;
              color: #ff6700;
              display: inline-block;
              height: 100%;
              width: 35%;
              text-align: center;
              .left-discount {
                padding-top: 2.7vw;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 10vw;
                  }
                  &:nth-child(2) {
                    font-size: 7vw;
                  }
                  &:nth-child(3) {
                    font-size: 4vw;
                  }
                }
              }
              .left-cash {
                padding-top: 2.7vw;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 7vw;
                  }
                  &:nth-child(2) {
                    font-size: 10vw;
                  }
                }
              }
              .left-gift {
                text-align: center;
                padding-top: 2.5vw;
                div {
                  display: inline-block;
                  width: 17vw;
                  padding-top: 4vw;
                  height: 13vw;
                  border-radius: 50%;
                  font-size: 2.5vw;
                  position: relative;
                  background: rgba(250, 230, 224, 1);
                  img {
                    display: inline-block;
                    width: rpx(51);
                    height: rpx(38);
                  }
                  span {
                    display: block;
                    position: absolute;
                    bottom: 3.5vw;
                    width: 17vw;
                    text-align: center;
                    color: #e5c5bb;
                  }
                }
              }
              .left-type {
                font-size: 2.5vw;
                span {
                  position: relative;
                  top: -1vw;
                  display: inline-block;
                  padding: 0 1.5vw;
                  background: #ffddd1;
                  border-radius: 2vw;
                }
              }
              .left-circle-top {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white;
                position: absolute;
                right: -1vw;
                top: -1.2vw;
              }
              .left-circle-bottom {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white;
                position: absolute;
                right: -1vw;
                bottom: -1.2vw;
              }
            }
            .coupon-left:after {
              content: ' ';
              width: 0;
              height: 100%;
              position: absolute;
              top: 0;
            }
            .coupon-left:after {
              border-left: rpx(2) dotted white;
              right: rpx(-1);
            }
            .coupon-right {
              display: inline-block;
              vertical-align: top;
              box-sizing: border-box;
              width: 65%;
              height: 100%;
              padding-top: 3.8vw;
              padding-left: 3.4vw;
              .right-name {
                font-size: 4.7vw;
                img {
                  display: inline-block;
                  width: rpx(100);
                  height: rpx(26);
                }
              }
              .right-date {
                padding-top: 2vw;
                font-size: 2.5vw;
                color: #7e7e7e;
              }
              .right-remark {
                width: 80%;
                font-size: 2.5vw;
                color: #7e7e7e;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .coupon:after {
            content: ' ';
            width: 0;
            height: 100%;
            position: absolute;
            top: 0;
          }
          .coupon:after {
            border-left: rpx(4) dotted white;
            right: rpx(-2);
          }
          .coupon-nouse {
            height: 22vw;
            background: #eeeeee !important;
            border-radius: 0.8vw;
            position: relative;
            left: -0.5vw;
            .coupon-left {
              position: relative;
              color: #7e7e7e !important;
              display: inline-block;
              height: 100%;
              width: 35%;
              text-align: center;
              .left-discount {
                padding-top: 2.7vw;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 10vw;
                  }
                  &:nth-child(2) {
                    font-size: 7vw;
                  }
                  &:nth-child(3) {
                    font-size: 4vw;
                  }
                }
              }
              .left-cash {
                padding-top: 2.7vw;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 7vw;
                  }
                  &:nth-child(2) {
                    font-size: 10vw;
                  }
                }
              }
              .left-type {
                font-size: 2.5vw;
                span {
                  position: relative;
                  top: -1vw;
                  display: inline-block;
                  padding: 0 1.5vw;
                  background: #bfbfbf !important;
                  border-radius: 2vw;
                  color: white !important;
                }
              }
              .left-gift {
                text-align: center;
                padding-top: 2.5vw;
                div {
                  display: inline-block;
                  width: 17vw;
                  padding-top: 4vw;
                  height: 13vw;
                  border-radius: 50%;
                  font-size: 2.5vw;
                  position: relative;
                  background: rgba(250, 230, 224, 1);
                  img {
                    display: inline-block;
                    width: rpx(51);
                    height: rpx(38);
                  }
                  span {
                    display: block;
                    position: absolute;
                    bottom: 3.5vw;
                    width: 17vw;
                    text-align: center;
                    color: #e5c5bb;
                  }
                }
              }
              .left-circle-top {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white !important;
                position: absolute;
                right: -1vw;
                top: -1.2vw;
              }
              .left-circle-bottom {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white !important;
                position: absolute;
                right: -1vw;
                bottom: -1.2vw;
              }
            }
            .coupon-left:after {
              content: ' ';
              width: 0;
              height: 100%;
              position: absolute;
              top: 0;
            }
            .coupon-left:after {
              border-left: rpx(2) dotted white;
              right: rpx(-1);
            }
            .coupon-right {
              display: inline-block;
              vertical-align: top;
              box-sizing: border-box;
              width: 65%;
              height: 100%;
              padding-top: 3.8vw;
              padding-left: 3.4vw;
              .right-name {
                font-size: 4.7vw;
                color: #7e7e7e;
                img {
                  display: inline-block;
                  width: rpx(100);
                  height: rpx(26);
                }
              }
              .right-date {
                padding-top: 2vw;
                font-size: 2.5vw;
                color: #bfbfbf;
              }
              .right-remark {
                width: 80%;
                font-size: 2.5vw;
                color: #bfbfbf;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .coupon-button {
            padding: 8vw 5vw;
            text-align: center;
            span {
              display: inline-block;
              width: 100%;
              border-radius: 7vw;
              height: 12vw;
              line-height: 12vw;
              color: white;
              font-size: 5vw;
              background: #ff6700;
            }
          }
        }
      }
    }
  }
</style>
