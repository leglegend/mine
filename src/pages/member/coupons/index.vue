<template>
  <div class="coupons-page">
    <title :name="'优惠券'"></title>
    <scroll-view class="coupons-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupons-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="coupons-buttons">
          <span class="buttton-item" :class="type==1?'buttton-item-check':''" @click="changeType(1)">
            <span><img
              :src="'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/hexiao-'+(type==1?'1':'2')+'.png'"/>核销优惠券</span>
          </span>
          <span class="buttton-item" :class="type==2?'buttton-item-check':''" @click="changeType(2)">
            <span><img
              :src="'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/songquan'+(type==2?'-1':'')+'.png'"/>送优惠券</span>
          </span>
        </div>
        <div class="demo-noitems" style="height: 7vh;line-height: 10vh" v-show="type!=2&&coupons.length==0&&!isLoading">
          没有可用优惠券 =_="
        </div>
        <div class="demo-noitems" style="height: 7vh;line-height: 10vh"
             v-show="type==2&&giftCoupons.length==0&&!isLoading">
          请先添加优惠券 =_="
        </div>
        <div class="coupons-context">
          <div class="coupons-list" v-if="type==0&&coupons.length>0">
            <div class="coupon-item" v-for="coupon in coupons">
              <coupon :coupon="coupon" :nouse="coupon.State==0"
                      @remark="couponRemark=coupon.CouponDescription"></coupon>
              <div class="coupon-source">
                {{'来源：' + coupon.CouponSourceContent}}
              </div>
              <div class="coupon-reason" v-if="coupon.StateReasonContent">
                <span>未生效原因：</span>{{coupon.StateReasonContent}}
              </div>
              <div class="coupon-no" v-if="coupon.State==0">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-nouse.png"/>
              </div>
            </div>
          </div>
          <div class="coupon-view" v-if="type==0&&!showAllCoupons&&otherCoupons.length>0">
            失效的优惠券已被隐藏，<span @click="showAllCoupons=true">点击查看</span>
          </div>
          <div class="coupons-list overdue" v-if="type==0&&showAllCoupons">
            <div class="coupon-item" v-for="coupon in otherCoupons">
              <coupon :coupon="coupon" :nouse="true" @remark="couponRemark=coupon.CouponDescription"></coupon>
              <div class="coupon-source">
                {{'来源：' + coupon.CouponSourceContent}}
              </div>
              <div class="coupon-used" v-if="coupon.State==2">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-used.png"/>
              </div>
              <div class="coupon-used" v-if="coupon.State==3">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-overdue.png"/>
              </div>
            </div>
          </div>
          <div class="coupons-list coupons-use" v-if="type==1&&coupons.length>0">
            <div class="coupon-item" v-for="(coupon,index) in coupons" @click="selectCoupon(coupon,index)">
              <span class="item-left">
                <coupon :coupon="coupon" :nouse="coupon.State!=1"
                        @remark="couponRemark=coupon.CouponDescription"></coupon>
                <div class="coupon-source">
                  {{'来源：' + coupon.CouponSourceContent}}
                </div>
                <div class="coupon-reason" v-if="coupon.StateReasonContent">
                  <span>{{coupon.State == 0 ? '未生效' : '不可用'}}原因：</span>{{coupon.StateReasonContent}}
                </div>
              </span>
              <span class="item-right" v-if="coupon.State==1">
                <img v-if="coupon.checked=='check'"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/NutCards/static/coupon-check.png"/>
                <span v-if="!coupon.checked||coupon.checked=='uncheck'"></span>
                <span v-if="coupon.checked=='cannotcheck'" style="background: #dddddd"></span>
              </span>
            </div>
            <div class="coupon-button">
              <span @click="save">确 定</span>
            </div>
          </div>
          <div class="coupons-list coupons-use" v-if="type==2&&giftCoupons.length>0">
            <div class="coupon-item" v-for="(coupon,index) in giftCoupons" @click="selectCoupon(coupon,index)">
              <span class="item-left">
                <coupon :coupon="coupon" :nouse="coupon.State!=1"
                        @remark="couponRemark=coupon.CouponDescription"></coupon>
                <!--<div class="coupon-source">
                  {{'来源：' + coupon.CouponSourceContent}}
                </div>-->
                <div class="coupon-reason" v-if="coupon.StateReasonContent">
                  <span>{{coupon.State == 0 ? '未生效' : '不可用'}}原因：</span>{{coupon.StateReasonContent}}
                </div>
              </span>
              <span class="item-right" v-if="coupon.State==1">
                <img v-if="coupon.checked=='check'"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/NutCards/static/coupon-check.png"/>
                <span v-if="!coupon.checked||coupon.checked=='uncheck'"></span>
                <span v-if="coupon.checked=='cannotcheck'" style="background: #dddddd"></span>
              </span>
            </div>
            <div class="coupon-button">
              <span @click="sendCoupons">确 定</span>
            </div>
          </div>
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
        couponRemark: '',
        coupons: [],
        otherCoupons: [],
        giftCoupons: [],
        showAllCoupons: false,
        useCoupon: false,
        changeDate: 0,
        titleHeight: null,
        type: 0,
        amount: '',
        isLoading: true
      }
    },
    methods: {
      jumpToUse () {
        const url = '../use/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + this.memberId
        wx.navigateTo({url})
      },
      selectCoupon (coupon, index) {
        if (coupon.State !== 1) {
          return
        }
        if (coupon.checked === 'check') {
          coupon.checked = 'uncheck'
        } else {
          coupon.checked = 'check'
        }
        this.changeDate = this.changeDate + 1
      },
      changeType (type) {
        if (this.type === 0) {
          this.type = type
        } else {
          if (this.type === type) {
            this.type = 0
          } else {
            this.type = type
          }
        }
      },
      calcCouponCheck (coupon, index) {
        coupon.checked = 'check'
        if (coupon.IsMore) {
          for (let i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].IsMore === false && index !== i) {
              this.coupons[i].checked = 'cannotcheck'
            }
          }
        } else {
          for (let i = 0; i < this.coupons.length; i++) {
            if (index !== i) {
              this.coupons[i].checked = 'cannotcheck'
            }
          }
        }
      },
      calcCouponUncheck (coupon, index) {
        coupon.checked = 'uncheck'
        if (coupon.IsMore) {
          let all = true
          for (let i = 0; i < this.coupons.length; i++) {
            if (this.coupons[i].IsMore && this.coupons[i].checked === 'check') {
              all = false
            }
          }
          if (all) {
            for (let i = 0; i < this.coupons.length; i++) {
              this.coupons[i].checked = 'uncheck'
            }
          }
        } else {
          for (let i = 0; i < this.coupons.length; i++) {
            this.coupons[i].checked = 'uncheck'
          }
        }
      },
      save () {
        let checkCoupons = []
        for (let coupon of this.coupons) {
          if (coupon.checked === 'check') {
            checkCoupons.push(coupon)
          }
        }
        if (checkCoupons.length === 0) {
          wx.showToast({
            title: '请选择优惠券',
            image: '/static/warn.png'
          })
          return
        }
        if (checkCoupons.length > 0) {
          wx.setStorageSync('coupons', checkCoupons)
          this.jumpToUse()
        } else {
          wx.removeStorageSync('coupons')
        }
      },
      sendCoupons () {
        let checkCoupons = []
        for (let coupon of this.giftCoupons) {
          if (coupon.checked === 'check') {
            checkCoupons.push(coupon.Id)
          }
        }
        if (checkCoupons.length === 0) {
          wx.showToast({
            title: '请选择优惠券',
            image: '/static/warn.png'
          })
          return
        }
        let that = this
        this.$post('/coupon/businessUserCouponAdd', {
          StoreId: this.storeId,
          Uid: this.userId,
          UserId: this.memberId,
          CouponIds: checkCoupons
        }, true).then(res => {
          that.$success('添加成功')
          that.type = 0
          that.getCoupons()
          that.getAllCoupons()
        })
      },
      getCoupons () {
        let that = this
        this.$post('/coupon/getUserCouponList', {
          StoreId: this.storeId,
          Uid: this.userId,
          QueryState: 1,
          UserId: this.memberId
        }).then(res => {
          for (let coupon of res.Coupons) {
            coupon = that.calcCoupon(coupon)
          }
          that.coupons = res.Coupons
          that.isLoading = false
        })
      },
      getAllCoupons () {
        let that = this
        this.$post('/coupon/businessGetCouponListByStoreId', {
          StoreId: this.storeId,
          Uid: this.userId
        }).then(res => {
          for (let coupon of res.Coupons) {
            coupon = that.calcCoupon(coupon)
          }
          that.giftCoupons = res.Coupons
          that.isLoading = false
        })
      },
      getOtherCoupons () {
        let that = this
        this.$post('/coupon/getUserCouponList', {
          StoreId: this.storeId,
          Uid: this.userId,
          QueryState: 2,
          UserId: this.memberId
        }).then(res => {
          for (let coupon of res.Coupons) {
            coupon = that.calcCoupon(coupon)
          }
          that.otherCoupons = res.Coupons
        })
      },
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
      this.userId = option.userId
      this.storeId = option.storeId
      this.memberId = option.memberId
      this.coupons = []
      this.otherCoupons = []
      this.giftCoupons = []
      this.showAllCoupons = false
      this.amount = ''
      this.type = 0
      this.isLoading = true
      if (option.type) {
        this.useCoupon = true
      } else {
        this.useCoupon = false
      }
      if (option.amount) {
        this.amount = option.amount
      }
      this.getCoupons()
      this.getOtherCoupons()
      this.getAllCoupons()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.isLoading) {
        return
      }
      this.type = 0
      this.getCoupons()
      this.getOtherCoupons()
      this.getAllCoupons()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupons-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupons-scroll {
      height: 90vh;
      .coupons-main {
        min-height: 80vh;
        .coupons-buttons {
          height: 14.9vw;
          line-height: 14.9vw;
          text-align: center;
          .buttton-item {
            display: inline-block;
            padding: 0 3vw;
            span {
              display: inline-block;
              width: 27.2vw;
              height: 6.8vw;
              line-height: 6.8vw;
              border-radius: 3.4vw;
              border: 0.1vw solid rgba(186, 186, 186, 1);
              font-size: 3vw;
              background: white;
              color: #696969;
              img {
                width: 3vw;
                height: 3vw;
                margin-right: 0.9vw;
                vertical-align: middle;
                position: relative;
                top: -0.3vw;
              }
            }
          }
          .buttton-item-check {
            span {
              color: white;
              background: #FF6700;
              border-color: #FF6700;
            }
          }
        }
        .coupons-info {
          height: 9vw;
          padding-left: 3vw;
          line-height: 9vw;
          font-size: 3.5vw;
          background: #ffedad;
          color: #c48f21;
          img {
            width: rpx(39);
            height: rpx(39);
            display: inline-block;
            position: relative;
            top: 1vw;
          }
        }
        .coupons-context {
          padding: 0 3vw;
          .coupons-list {
            border-radius: 3vw;
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
            margin-top: 4vw;
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
                white-space: nowrap;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 6.5vw;
                  }
                  &:nth-child(2) {
                    font-size: 9.5vw;
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
                font-size: 2.5vw;
                color: #7e7e7e;
                position: relative;
                span {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  display: inline-block;
                  width: 80%;
                }
                img {
                  width: rpx(17);
                  height: rpx(17);
                  position: absolute;
                  right: 7vw;
                  bottom: rpx(7);
                }
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
                white-space: nowrap;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 6.5vw;
                  }
                  &:nth-child(2) {
                    font-size: 9.5vw;
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
                  background: #bfbfbf !important;
                  border-radius: 2vw;
                  color: white !important;
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
                font-size: 2.5vw;
                color: #7e7e7e;
                position: relative;
                span {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  display: inline-block;
                  width: 80%;
                }
                img {
                  width: rpx(17);
                  height: rpx(17);
                  position: absolute;
                  right: 7vw;
                  bottom: rpx(7);
                }
              }
            }
          }
        }
      }
    }
    .coupon-button {
      text-align: center;
      text-align: center;
      padding: 5vw 0;
      span {
        display: inline-block;
        width: 70%;
        border-radius: 7vw;
        height: 12vw;
        line-height: 12vw;
        color: white;
        font-size: 5vw;
        background: #ff6700;
      }
    }
  }
</style>
