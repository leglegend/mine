<template>
  <div class="use-coupon-page">
    <title :name="'核销优惠券'"></title>
    <scroll-view class="use-coupon-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="use-coupon-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="use-coupon-context">
          <div class="context-logo">
            <img :src="user.UserImg"/>
          </div>
          <div class="context-name">
            {{user.RemarkName ? user.RemarkName : storeUserName}}
          </div>
          <div class="coupons-list">
            <div class="coupon-item" v-for="coupon in coupons">
              <coupon :coupon="coupon" :nouse="type==1"
                      @remark="couponRemark=coupon.CouponDescription"></coupon>
              <div class="coupon-source">
                {{'来源：' + coupon.CouponSourceContent}}
              </div>
              <div class="coupon-reason" v-if="coupon.StateReasonContent">
                <span>未生效原因：</span>{{coupon.StateReasonContent}}
              </div>
              <div class="coupon-no" v-if="type==1">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/yihexiao-2.png"/>
              </div>
            </div>
          </div>
        </div>
        <div class="use-coupon-button">
          <span class="use-button" @click="commit" v-if="type==0">核销</span>
          <span class="use-success" v-if="type==1">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/chenggong-2.png"/>核销成功
          </span>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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
        user: {},
        coupons: [],
        storeUserName: '',
        couponRemark: '',
        type: 0,
        titleHeight: null
      }
    },
    methods: {
      commit () {
        let checkCoupons = []
        for (let coupon of this.coupons) {
          checkCoupons.push(coupon.Id)
        }
        let that = this
        this.$post('/coupon/businessUserCouponUsed', {
          StoreId: this.storeId,
          Uid: this.userId,
          UserId: this.memberId,
          CouponIds: checkCoupons
        }, true).then(res => {
          that.type = 1
        })
      },
      getUserInfo () {
        let that = this
        this.$post('/user/businessGetUserInfo', {
          UserId: this.memberId,
          CardId: this.cardId,
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.user = res
          that.firstLoad = false
          that.storeUserName = res.UserName
          for (let item of res.StoreUserInfo) {
            if (item.ControlName === 'user_store_name') {
              that.storeUserName = item.ControlValue
              that.user.StoreUserName = item.ControlValue
            }
          }
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.memberId = option.memberId
      this.storeUserName = ''
      this.type = 0
      this.getUserInfo()
      this.coupons = wx.getStorageSync('coupons')
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .use-coupon-page {
    height: 100vh;
    background-color: #f0f0f0;
    .use-coupon-scroll {
      height: 90vh;
      .use-coupon-main {
        min-height: 80vh;
        .use-coupon-context {
          background: white;
          text-align: center;
          .context-logo {
            padding-top: 8.9vw;
            padding-bottom: 1.3vw;
            img {
              display: inline-block;
              width: 17.1vw;
              height: 17.1vw;
              border-radius: 50%;
            }
          }
          .context-name {
            color: #181818;
            font-weight: 600;
            font-size: 4.3vw;
          }
          .coupons-list {
            padding: 5vw 9vw 10vw 9vw;
            background: white;
            text-align: left;
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
                right: -2vw;
                bottom: -1vw;
                z-index: 100;
                img {
                  width: rpx(171);
                  height: rpx(171);
                }
              }
            }
          }
        }
        .use-coupon-button {
          padding-top: 20vw;
          text-align: center;
          padding-bottom: 15vw
        ;
          .use-button {
            display: inline-block;
            width: 61.1vw;
            height: 13.3vw;
            line-height: 13.3vw;
            border-radius: 6.6vw;
            background: #FF6700;
            color: white;
            font-size: 5.2vw;
          }
          .use-success {
            height: 8vw;
            line-height: 8vw;
            display: inline-block;
            vertical-align: top;
            img {
              width: 8vw;
              height: 8vw;
              margin-right: 2.7vw;
              display: inline-block;
              vertical-align: top;
            }
            color: #259B23;
            font-size: 4.8vw;
          }
        }
      }
    }
  }
</style>
