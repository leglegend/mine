<template>
  <div class="coupon-home-page">
    <title :name="'优惠券中心'"></title>
    <scroll-view class="coupon-home-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-home-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="coupon-home-context">
          <div class="coupon-items">
            <div v-for="item in items" v-if="item.created">
              <div class="coupon-item" :style="{filter:item.State?'':'grayscale(1)'}"
                   @click="jumpToView(item.CouponCenterType)">
                <span class="item-logo">
                  <img v-if="item.CouponCenterType==1" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-open2.png"/>
                  <img v-if="item.CouponCenterType==2" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-renew2.png"/>
                  <img v-if="item.CouponCenterType==3" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-birthday2.png"/>
                  <img v-if="item.CouponCenterType==4" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-discount2.png"/>
                  <img v-if="item.CouponCenterType==5" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-group2.png"/>
                  <img v-if="item.CouponCenterType==6" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-appoint2.png"/>
                </span>
                <span class="item-context">
                  <div v-if="item.CouponCenterType==1">
                    <div class="context-title">
                      开卡送券
                    </div>
                    <div class="context-info">
                      新会员开卡时送券
                    </div>
                  </div>
                  <div v-if="item.CouponCenterType==2">
                    <div class="context-title">
                      续费关怀
                    </div>
                    <div class="context-info">
                      老会员余额将用完时送券
                    </div>
                  </div>
                  <div v-if="item.CouponCenterType==3">
                    <div class="context-title">
                      生日送券
                    </div>
                    <div class="context-info">
                      会员生日当天送券
                    </div>
                  </div>
                  <div v-if="item.CouponCenterType==4">
                    <div class="context-title">
                      满送券
                    </div>
                    <div class="context-info">
                      消费满多少时送券
                    </div>
                  </div>
                  <div v-if="item.CouponCenterType==5">
                    <div class="context-title">
                      群发券
                    </div>
                    <div class="context-info">
                      当过节或促销活动时
                    </div>
                  </div>
                  <div v-if="item.CouponCenterType==6">
                    <div class="context-title">
                      定向券
                    </div>
                    <div class="context-info">
                      想送谁就送谁
                    </div>
                  </div>
                  <div class="context-num">
                    <span>
                      <div class="num-top">{{item.SendCount}}</div>
                      <div class="num-bottom">共发放 (张)</div>
                    </span>
                    <span>
                      <div class="num-top">{{item.UsedCount}}</div>
                      <div class="num-bottom">已使用 (张)</div>
                    </span>
                    <span>
                      <div class="num-top">{{item.NoUsedCount}}</div>
                      <div class="num-bottom">未使用 (张)</div>
                    </span>
                  </div>
                </span>
                <span class="option-state">
                  <span>{{item.State ? '已开启' : '已暂停'}}</span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/sale.png"/>
                </span>
              </div>
            </div>
          </div>
          <div class="no-coupon-items">
            <span v-for="item in items" v-if="!item.created&&item.CouponCenterType!=1"
                  @click="jumpToCoupon(item.CouponCenterType)">
              <div class="no-coupon-logo">
                <img v-if="item.CouponCenterType==1" style="width: 58rpx;height: 53rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-open.png"/>
                <img v-if="item.CouponCenterType==2" style="width: 55rpx;height: 59rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-renew.png"/>
                <img v-if="item.CouponCenterType==3" style="width: 70rpx;height: 66rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-birthday.png"/>
                <img v-if="item.CouponCenterType==4" style="width: 67rpx;height: 58rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-discount.png"/>
                <img v-if="item.CouponCenterType==5" style="width: 77rpx;height: 65rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-group.png"/>
                <img v-if="item.CouponCenterType==6" style="width: 76rpx;height: 78rpx;"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-appoint.png"/>
              </div>
              <div v-if="item.CouponCenterType==1">
                <div class="no-coupon-title">开卡送券</div>
                <div class="no-coupon-context">新会员开卡时送券</div>
              </div>
              <div v-if="item.CouponCenterType==2">
                <div class="no-coupon-title">续费关怀</div>
                <div class="no-coupon-context">老会员余额将用完时送</div>
              </div>
              <div v-if="item.CouponCenterType==3">
                <div class="no-coupon-title">生日送券</div>
                <div class="no-coupon-context">会员生日当天送券</div>
              </div>
              <div v-if="item.CouponCenterType==4">
                <div class="no-coupon-title">满送券</div>
                <div class="no-coupon-context">消费满多少时送</div>
              </div>
              <div v-if="item.CouponCenterType==5">
                <div class="no-coupon-title">群发券</div>
                <div class="no-coupon-context">当过节或促销活动时</div>
              </div>
              <div v-if="item.CouponCenterType==6">
                <div class="no-coupon-title">定向券</div>
                <div class="no-coupon-context">想送谁就送谁</div>
              </div>
            </span>
          </div>
          <div class="coupon-info">
            <div>
              合理的利用优惠券可有效提高顾客购卡与续费、到店率。如当顾客消费完毕后，赠送其它项目优惠券，在限期内到店消费可享折扣，即可提高用户到店率等。形式分为两种：
            </div>
            <div>
              1、系统自动派发：当达到设定条件后系统自动送券
            </div>
            <div>
              2、定向券：店长可以通过微信分享给某位顾客，或者在
              “会员”内直接发给某位顾客。
            </div>
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
        items: [],
        titleHeight: null
      }
    },
    methods: {
      jumpToCoupon (type) {
        let url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + type
        if (type === 4 || type === 5 || type === 6) {
          url = '../create2/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + type
        }
        wx.navigateTo({url})
      },
      jumpToView (type) {
        let url = '../view/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + type
        if (type === 4 || type === 5 || type === 6) {
          url = '../view2/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + type
        }
        wx.navigateTo({url})
      },
      getCouponCenters () {
        let that = this
        let items = []
        this.$post('/couponCenter/businessCouponCenterStatistics', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          for (let i = 1; i <= 6; i++) {
            let item = {
              CouponCenterType: i,
              created: false
            }
            for (let coupon of res.StatisticsList) {
              if (coupon.CouponCenterType === item.CouponCenterType) {
                item = coupon
                item.created = true
              }
            }
            items.push(item)
          }
          that.items = items
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getCouponCenters()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      this.getCouponCenters()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupon-home-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupon-home-scroll {
      height: 90vh;
      .coupon-home-main {
        min-height: 80vh;
        background: white;
        .coupon-home-context {
          .coupon-items {
            padding: 0 5vw 0 5vw;
            .coupon-item {
              position: relative;
              border-bottom: rpx(1) solid #bbbbbb;
              padding-top: 10vw;
              span {
                display: inline-block;
                vertical-align: top;
              }
              .item-logo {
                width: 10vw;
                img {
                  display: inline-block;
                  vertical-align: top;
                  width: 9.4vw;
                  height: 9.4vw;
                }
              }
              .item-context {
                width: 80vw;
                .context-title {
                  font-size: 4.2vw;
                  padding-left: 3vw;
                }
                .context-info {
                  font-size: 2.5vw;
                  color: #a7a7a7;
                  padding-left: 3vw;
                }
                .context-num {
                  padding: 5vw 0 6vw 0;
                  height: 8vw;
                  line-height: 8vw;
                  width: 110%;
                  font-size: 2.8vw;
                  position: relative;
                  left: -2%;
                  span {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 33%;
                    text-align: center;
                    &:nth-child(2) {
                      width: 34%;
                      border-left: rpx(1) solid #a7a7a7;
                      border-right: rpx(1) solid #a7a7a7;
                    }
                  }
                  .num-top {
                    color: #ff6700;
                    font-size: 4.8vw;
                    height: 4.5vw;
                    line-height: 4.5vw;
                    position: relative;
                    top: -1vw;
                  }
                  .num-bottom {
                    position: relative;
                    bottom: -1vw;
                    height: 3.5vw;
                    line-height: 3.5vw;
                  }
                }
              }
              .option-state {
                display: inline-block;
                width: rpx(60);
                height: rpx(61);
                height: 0;
                position: absolute;
                top: 10vw;
                right: 1vw;
                font-size: rpx(15);
                color: white;
                text-align: center;
                line-height: rpx(61);
                img {
                  position: absolute;
                  left: 0;
                  top: 0;
                  display: inline-block;
                  width: rpx(60);
                  height: rpx(61);
                }
                span {
                  position: relative;
                  display: inline-block;
                  z-index: 100;
                }
              }
            }
          }
          .no-coupon-items {
            padding: 0 2vw 10vw 2vw;
            span {
              width: 32vw;
              text-align: center;
              display: inline-block;
            }
            .no-coupon-logo {
              padding-top: 5vw;
              height: 15vw;
              line-height: 15vw;
              width: 32vw;
              img {
                display: inline-block;
                vertical-align: middle;
              }
            }
            .no-coupon-title {
              font-size: 3vw;
              padding: 1vw 0;
            }
            .no-coupon-context {
              font-size: 2.5vw;
              color: #a7a7a7;
            }
          }
          .coupon-info {
            padding: 5vw 5vw;
            line-height: 5.5vw;
            font-size: 3.4vw;
            background: #ffedad;
            color: #c48f21;
          }
        }
      }
    }
  }
</style>
