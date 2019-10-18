<template>
  <div class="coupon-details-page">
    <title :name="'转发效果'"></title>
    <scroll-view class="coupon-details-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-details-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="level-coupon">
          <div v-if="couponCenter.IsByUserLevel">
            <card :num="0" :card="couponCenter" :last="false" :store="store" :uid="userId"
                  :coupon="true"></card>
          </div>
          <div v-if="!couponCenter.IsByUserLevel" style="padding-top: 10vw">
          </div>
          <div class="item-coupon">
            <div class="coupon-bg">
              <div v-if="couponCenter.Coupons">
                <div v-for="(itemCoupon,index2) in couponCenter.Coupons">
                  <coupon :coupon="itemCoupon"></coupon>
                </div>
              </div>
            </div>
            <div class="context-num" style="padding-top: 5vw;padding-bottom: 8vw;">
              <span>
                <div class="num-top">{{couponCenter.TotalSendCount}}</div>
                <div class="num-bottom">共发放 (张)</div>
              </span>
              <span>
                <div class="num-top">{{couponCenter.UsedCount}}</div>
                <div class="num-bottom">已使用 (张)</div>
              </span>
              <span>
                <div class="num-top">{{couponCenter.NoUsedCount}}</div>
                <div class="num-bottom">未使用 (张)</div>
              </span>
            </div>
          </div>
        </div>
        <div class="report-items" v-if="items&&items.length>0">
          <div class="items" v-for="item in items">
            <span class="item-left">
              <img :src="item.UserImg"/>
            </span>
            <span class="item-right">
              <div class="item-title">
                <span>{{item.UserName}}<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ismember.png"
                                            style="width: 14rpx;height: 22.4rpx;position: relative;top:2rpx"
                                            v-if="item.IsVip"/></span>
                <span :style="{color:item.IsUsed?'#000000':''}">{{item.IsUsed ? '已使用' : '未使用'}}</span>
                </div>
                <div class="item-context">
                  {{item.CreateDate}}
                </div>
              </span>
          </div>
        </div>
        <div class="footer" v-show="isOver&&items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</div>
        <div class="footer" v-show="isOver&&items.length==0">还没有数据 =_="</div>
        <div class="footer" v-show="isLoading">加载中...</div>
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
  import card from '@/components/card'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, card, coupon
    },

    data () {
      return {
        items: [],
        store: {},
        couponCenter: {},
        isLoading: false,
        isOver: false,
        firstLoad: true,
        titleHeight: null
      }
    },
    methods: {
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.isLoading = true
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.$post('/couponCenter/businessCouponCenterCouponReport', {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterId: this.couponCenterId,
          CouponId: this.couponId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          that.isLoading = false
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let item of res.Data) {
              that.items.push(item)
            }
          }
          if (res.Data.length < 10) {
            that.isOver = true
          }
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.couponCenter = wx.getStorageSync('couponCenter')
      console.log(this.couponCenter)
      this.couponCenterId = this.couponCenter.CouponCenterId
      this.couponId = this.couponCenter.Coupons[0].Id
      this.store = wx.getStorageSync('store')
      this.page = 1
      this.getItems(1)
      wx.removeStorageSync('couponCenter')
      wx.removeStorageSync('store')
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupon-details-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupon-details-scroll {
      height: 90vh;
      .coupon-details-main {
        min-height: 80vh;
        .level-coupon {
          background: white;
          .item-coupon {
            padding: 0 5vw 3vw 5vw;
            background: white;
            border-bottom: rpx(1) solid #bbbbbb;
            .coupon-bg {
              border-radius: 3vw;
              padding: 0vw 3vw 0vw 4vw;
              background: white;
              position: relative;
              top: -2vw;
            }
          }
          .context-num {
            padding: 8vw 0 4vw 0;
            height: 8vw;
            line-height: 8vw;
            width: 110%;
            font-size: 2.8vw;
            position: relative;
            left: -5%;
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
        .report-items {
          padding: 7vw 5vw 0 5vw;
          background-color: white;
          .items {
            height: 19vw;
            font-size: 3vw;
            span {
              display: inline-block;
              vertical-align: top;
            }
            .item-left {
              width: 10.5vw;
              height: 10.5vw;
              img {
                display: inline-block;
                width: 8.5vw;
                height: 8.5vw;
                border-radius: 50%;
              }
            }
            .item-right {
              width: 79.5vw;
              border-bottom: rpx(1) solid #dddddd;
              height: 14vw;
              .item-title {
                font-size: 3.5vw;
                span {
                  width: 50%;
                  &:nth-child(2) {
                    text-align: right;
                    color: #a7a7a7;
                  }
                }
                text {
                  font-size: 4vw;
                  color: black;
                }
              }
              .item-context {
                padding-top: 1vw;
                color: #a7a7a7;
                span {
                  &:nth-child(1) {
                    width: 25vw;
                  }
                  &:nth-child(2) {
                    width: 20vw;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
