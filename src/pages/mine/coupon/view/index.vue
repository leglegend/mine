<template>
  <div class="coupon-view-page">
    <title :name="name"></title>
    <scroll-view class="coupon-create-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-create-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="card-state"
             :class="{'state-open':state,'state-close':!state}">
          <span>
            <text v-if="state==1">状态：已启用</text>
            <text
              v-if="state==0">状态：{{stateReason == 0 ? '已暂停' : stateReason == 1 ? '已暂停' : stateReason == 2 ? '已达到发行数量上限' : '优惠券截止日期已过'}}</text>
          </span>
          <span>
            <switch :checked="state" @change="switchChange" color="#78BC6D"/>
          </span>
        </div>
        <div class="switch-button">
          <div>
            <span :style="{color:current==0?'#ffffff':''}">所有顾客一致</span>
            <span :style="{color:current==1?'#ffffff':''}">按会员卡等级</span>
            <div class="switch-bg" style="left: 0" v-if="current==0"></div>
            <div class="switch-bg" style="right: 0" v-if="current==1"></div>
          </div>
        </div>
        <div class="same-coupon" v-if="current==0&&coupon">
          <div v-if="coupon">
            <coupon :coupon="coupon"></coupon>
          </div>
          <div class="inputs" style="padding-top: 2vw" v-if="type=='2'">
            <div class="input-item">
              <span class="item-1">当余额低于多少时赠送 (元)</span>
              <span class="item-2">{{currentItem.LessMoney}}元</span>
            </div>
            <div class="input-item">
              <span class="item-1">当余额低于多少时赠送 (次)</span>
              <span class="item-2">{{currentItem.LessTimes}}次</span>
            </div>
          </div>
          <div class="context-num" @click="jumpToReport(currentItem)">
            <span>
              <div class="num-top">{{currentItem.TotalSendCount}}</div>
              <div class="num-bottom">共发放 (张)</div>
            </span>
            <span>
              <div class="num-top">{{currentItem.UsedCount}}</div>
              <div class="num-bottom">已使用 (张)</div>
            </span>
            <span>
              <div class="num-top">{{currentItem.NoUsedCount}}</div>
              <div class="num-bottom">未使用 (张)</div>
            </span>
          </div>
        </div>
        <div class="level-coupon" v-if="current==1">
          <div v-for="(item,index) in cards" v-if="item.Coupons">
            <card :num="index" :card="item" :last="index+1==cards.length" :store="store" :uid="userId"
                  :coupon="true"></card>
            <div class="item-coupon">
              <div class="coupon-bg">
                <div v-if="item.Coupons">
                  <div v-for="(itemCoupon,index2) in item.Coupons">
                    <coupon :coupon="itemCoupon"></coupon>
                  </div>
                </div>
              </div>
              <div class="inputs" v-if="type=='2'">
                <div v-if="item.CardType" class="input-item">
                  <span class="item-1">当余额低于多少时赠送 (元)</span>
                  <span class="item-2">{{item.LessMoney ? item.LessMoney : 0}}元</span>
                </div>
                <div v-if="!item.CardType" class="input-item">
                  <span class="item-1">当余额低于多少时赠送 (次)</span>
                  <span class="item-2">{{item.LessTimes ? item.LessTimes : 0}}次</span>
                </div>
              </div>
              <div class="context-num" style="padding-top: 5vw;padding-bottom: 8vw;" @click="jumpToReport(item)">
                <span>
                  <div class="num-top">{{item.TotalSendCount}}</div>
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
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="coupon-setting" @click="jumpToEdit">
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-setting.png"/>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import card from '@/components/option'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, card, coupon
    },

    data () {
      return {
        cards: [],
        name: '',
        type: '',
        store: {},
        currentItem: {},
        current: 0,
        coupon: null,
        changeData: 0,
        cardIndex: 0,
        minAmount: 0,
        minTimes: 0,
        state: 0,
        stateReason: '',
        titleHeight: null
      }
    },
    methods: {
      jumpToEdit () {
        let url = '../create/main?edit=1&userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + this.type
        wx.navigateTo({url})
      },
      jumpToReport (item) {
        wx.setStorageSync('couponCenter', item)
        wx.setStorageSync('store', this.store)
        let url = '../details/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      switchChange (e) {
        let that = this
        this.$post('/storeCouponCenter/businessStoreCouponCenterSet', {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterType: this.type,
          State: this.state ? 0 : 1
        }, true).then(res => {
          that.state = that.state ? 0 : 1
          that.$success('修改成功', true)
        })
      },
      getCards (items) {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCards', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          for (let item of res.PrepaidCards) {
            item.ValidityDateTo = that.calcValidityDateTo(item.ValidityDate)
            item.ValidityDateTime = that.calcValidityDate(item.ValidityDate)
            item.StoreLogo = res.StoreLogo
            item.StoreName = res.StoreNameitems
            for (let coupon of items) {
              if (item.PrepaidCardId === coupon.PreCardId) {
                for (let item2 of coupon.Coupons) {
                  item2 = that.calcCoupon(item2)
                }
                item.Coupons = coupon.Coupons
                item.CouponCenterId = coupon.CouponCenterId
                item.TotalSendCount = coupon.TotalSendCount
                item.IsByUserLevel = true
                item.UsedCount = coupon.UsedCount
                item.NoUsedCount = coupon.NoUsedCount
                if (that.type === '2') {
                  item.LessMoney = coupon.LessMoney
                  item.LessTimes = coupon.LessTimes
                }
              }
            }
          }
          that.cards = res.PrepaidCards
          that.firstLoad = false
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsNotDefaultData: true
        }, this.firstLoad).then(res => {
          res.StoreId = that.storeId
          that.store = res
        })
      },
      getCouponCenter () {
        let that = this
        this.$post('/couponCenter/businessCouponCenterInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsByUserLevel: -1,
          CouponCenterType: this.type
        }, this.firstLoad).then(res => {
          that.state = res.State
          that.stateReason = res.StateReason
          that.current = res.IsByUserLevel ? 1 : 0
          for (let item of res.CouponCenterInfos) {
            if (item.IsByUserLevel) {
              that.current = 1
              that.getCards(res.CouponCenterInfos)
              return
            }
            that.current = 0
            that.currentItem = item
            that.coupon = that.calcCoupon(item.Coupons[0])
          }
          if ((!res || !res.CouponCenterInfos || res.CouponCenterInfos.length === 0) && !that.firstLoad) {
            wx.navigateBack({
              delta: 1
            })
          }
          that.firstLoad = false
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
      },
      calcValidityDateTo (date) {
        if (date === 0) {
          return '永久有效'
        }
        var now = new Date()
        now.setDate(now.getDate() + date)
        return this.formatTime(now)
      },
      formatTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        let day = date.getDate()
        day = day < 10 ? '0' + day : day
        return year + '年' + month + '月' + day + '日'
      },
      calcValidityDate (validityDay) {
        if (validityDay === 0) {
          return '永久有效'
        }
        let year = Math.floor(validityDay / 365)
        let month = Math.floor(validityDay % 365 / 30)
        let day = validityDay % 365 % 30
        return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
      },
      calcName () {
        this.cards = []
        switch (this.type) {
          case '1':
            this.name = '开卡送券'
            break
          case '2':
            this.name = '续费关怀'
            break
          case '3':
            this.name = '生日送券'
            break
          case '4':
            this.name = '满送券'
            break
          case '5':
            this.name = '群发券'
            break
          case '6':
            this.name = '定向券'
            break
        }
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.type = option.type
      this.firstLoad = true
      this.coupon = null
      this.currentItem = {}
      this.calcName()
      this.getCouponCenter()
      this.getStoreInfo()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      this.getCouponCenter()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupon-view-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupon-create-scroll {
      height: 90vh;
      .coupon-create-main {
        min-height: 80vh;
        background: white;
        .card-state {
          padding: 4vw 5vw;
          span {
            display: inline-block;
            &:nth-child(1) {
              width: 75%;
              font-size: 4vw;
            }
            &:nth-child(2) {
              width: 25%;
              text-align: right;
            }
          }
        }
        .state-open {
          background: #ecf6ea;
          color: #78bc6d;
        }
        .state-close {
          background: #f6e3e3;
          color: #ff0000;
        }
        .switch-button {
          padding: 10vw 5vw 5vw 5vw;
          text-align: center;
          color: #7e7e7e;
          font-size: 3.5vw;
          div {
            display: inline-block;
            border-radius: 10vw;
            height: 6.5vw;
            line-height: 6.5vw;
            width: 60vw;
            border: rpx(1) solid #7e7e7e;
            position: relative;
          }
          span {
            display: inline-block;
            width: 50%;
            position: relative;
            z-index: 2;
          }
          .switch-bg {
            height: 6.5vw;
            width: 31vw;
            border-radius: 10vw;
            background: #7e7e7e;
            position: absolute;
            z-index: 1;
            top: 0;
          }
        }
        .same-coupon {
          padding: 5vw 10vw;
          border-bottom: rpx(1) solid #bbbbbb;
          .add-coupon {
            height: 22vw;
            line-height: 22vw;
            border-radius: 1vw;
            background: #f1f1f1;
            color: #c6c6c6;
            text-align: center;
            font-size: 4.5vw;
          }
        }
        .level-coupon {
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
        }
        .inputs {
          .input-item {
            font-size: 3.5vw;
            height: 10vw;
            line-height: 10vw;
            border-bottom: rpx(1) solid #dddddd;
            span {
              display: inline-block;
              height: 10vw;
              line-height: 10vw;
              vertical-align: top;
            }
            .item-1 {
              width: 70%;
            }
            .item-2 {
              width: 30%;
              text-align: right;
              color: #7e7e7e;
            }
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
    }
    .coupon-setting {
      position: fixed;
      width: rpx(126);
      height: rpx(126);
      bottom: 10vw;
      right: 5vw;
      img {
        width: rpx(126);
        height: rpx(126);
      }
    }
  }
</style>
