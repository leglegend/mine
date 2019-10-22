<template>
  <div class="coupon-create-page">
    <title :name="name"></title>
    <scroll-view class="coupon-create-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-create-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="coupon-info" v-if="type=='1'">
          <div>
            1、新顾客在第一次购卡时所赠的优惠券
          </div>
          <div>
            2、可选择用于购卡或购卡后送；券一但送出，不可撤回
          </div>
        </div>
        <div class="coupon-info" v-if="type=='2'">
          <div>
            1、当会员的卡内余额接近用完时所赠的优惠券
          </div>
          <div>
            2、可选择用于购卡或购卡后送；券一但送出，不可撤回
          </div>
        </div>
        <div class="coupon-info" v-if="type=='3'" style="font-size: 3.2vw">
          <div>
            1、当到会员生日时，当日赠优惠券
          </div>
          <div>
            2、注意：在会员注册时，您必须开启要求会员录入生日选项
          </div>
          <div>
            3、注意：每会员每年仅赠送一次
          </div>
        </div>
        <div class="switch-button">
          <div>
            <span @click="swiperChange(0)" :style="{color:current==0?'#ffffff':''}">所有顾客一致</span>
            <span @click="swiperChange(1)" :style="{color:current==1?'#ffffff':''}">按会员卡等级</span>
            <div class="switch-bg" :animation="animation"></div>
          </div>
        </div>
        <swiper class="coupon-create-context" :current="current" @change="swiperChange"
                :animation="animationSwiper">
          <swiper-item>
            <div class="same-coupon">
              <div v-if="!coupon" class="add-coupon" @click="jumpToGift">
                + 添加礼券
              </div>
              <div v-if="coupon" @click="jumpToGift">
                <coupon :coupon="coupon"></coupon>
              </div>
              <div class="inputs" style="padding: 2vw 0 5vw 0" v-if="type=='2'">
                <div class="input-item" @click="jumpToData('number','续费(元)',minAmount)">
                  <span class="item-1">当余额低于多少时赠送 (元)</span>
                  <span class="item-2">{{minAmount}}元</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </div>
                <div class="input-item" @click="jumpToData('number','续费(次)',minTimes)">
                  <span class="item-1">当余额低于多少时赠送 (次)</span>
                  <span class="item-2">{{minTimes}}次</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </div>
              </div>
            </div>
            <div class="coupon-buttons">
              <span @click="deleteCards">清除设置</span>
              <span @click="doSave">保 存</span>
            </div>
          </swiper-item>
          <swiper-item>
            <div class="level-coupon">
              <div v-for="(item,index) in cards">
                <card :num="index" :card="item" :last="index+1==cards.length" :store="store" :uid="userId"
                      :coupon="true"></card>
                <div class="item-coupon">
                  <div class="coupon-bg" @click="jumpToGift(item,index)">
                    <div v-if="!item.Coupons" class="add-button">+ 添加礼券</div>
                    <div v-if="item.Coupons">
                      <div v-for="(itemCoupon,index2) in item.Coupons">
                        <coupon :coupon="itemCoupon" :color="'#e4e6e9'"></coupon>
                      </div>
                    </div>
                    <div class="coupon-horn"></div>
                    <div class="delete-button" v-if="item.Coupons" @click.stop="deleteCard(index)">
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-delete.png"/>
                    </div>
                  </div>
                  <div class="inputs" v-if="type=='2'">
                    <div v-if="item.CardType" class="input-item"
                         @click="jumpToData('number','续费(元)',item.LessMoney ? item.LessMoney : 0,index)">
                      <span class="item-1">当余额低于多少时赠送 (元)</span>
                      <span class="item-2">{{item.LessMoney ? item.LessMoney : 0}}元</span>
                      <span class="item-3">
                        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                      </span>
                    </div>
                    <div v-if="!item.CardType" class="input-item"
                         @click="jumpToData('number','续费(次)',item.LessTimes ? item.LessTimes : 0,index)">
                      <span class="item-1">当余额低于多少时赠送 (次)</span>
                      <span class="item-2">{{item.LessTimes ? item.LessTimes : 0}}次</span>
                      <span class="item-3">
                        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="coupon-buttons">
                <span @click="deleteCards">清除设置</span>
                <span @click="doSave">保 存</span>
              </div>
            </div>
          </swiper-item>
        </swiper>
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
        animation: {},
        animationSwiper: {},
        store: {},
        current: 0,
        coupon: null,
        changeData: 0,
        cardIndex: 0,
        minAmount: 0,
        minTimes: 0,
        couponCenterId: '',
        titleHeight: null
      }
    },
    methods: {
      jumpToGift (item, index) {
        let url = '../gift/main?storeId=' + this.storeId + '&userId=' + this.userId
        if (this.type === '2') {
          url += '&scene=renew'
        } else if (this.type === '3') {
          url += '&scene=group'
        }
        if (this.current === 0 && this.coupon) {
          wx.setStorageSync('coupon', this.coupon)
        } else {
          this.cardIndex = index
          if (item.Coupons && item.Coupons.length > 0) {
            wx.setStorageSync('coupon', item.Coupons[0])
          }
        }
        wx.navigateTo({url})
      },
      jumpToData (type, name, value, index) {
        let url = '../data/main?type=' + type + '&name=' + name + '&value=' + value
        if (this.current) {
          this.cardIndex = index
        }
        wx.navigateTo({url})
      },
      swiperChange (e) {
        if (e.mp) {
          this.current = e.mp.detail.current
        } else {
          this.current = e
        }
        if (this.current === 0) {
          let animation = wx.createAnimation()
          animation.left(0).step({duration: 200})
          this.animation = animation.export()
          let animationSwiper = wx.createAnimation()
          animationSwiper.height('90vw').step({duration: 200})
          this.animationSwiper = animationSwiper.export()
        } else {
          let animation = wx.createAnimation()
          animation.left('29vw').step({duration: 200})
          this.animation = animation.export()
          let height = 65.5
          if (this.type === '2') {
            height += 10
          }
          let animationSwiper = wx.createAnimation()
          animationSwiper.height(30 + height * this.cards.length + 'vw').step({duration: 200})
          this.animationSwiper = animationSwiper.export()
        }
      },
      deleteCards () {
        if (this.current) {
          for (let item of this.cards) {
            item.Coupons = null
          }
          this.changeData += 1
        } else {
          this.coupon = null
          this.minAmount = 0
          this.minTimes = 0
        }
      },
      deleteCard (index) {
        this.cards[index].Coupons = null
        this.cards[index].LessMoney = 0
        this.cards[index].LessTimes = 0
        this.changeData += 1
      },
      doSave () {
        let that = this
        let params = {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterType: this.type,
          IsByUserLevel: this.current,
          CouponCenters: []
        }
        if (this.current === 0) {
          if (!this.edit && this.coupon === null) {
            wx.showToast({
              title: '请添加优惠券',
              image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
            })
            return
          }
          let couponCenter = {
            CouponCenterType: this.type,
            StoreId: this.storeId,
            IsByUserLevel: 0,
            Coupons: this.coupon ? [this.coupon] : null
          }
          if (this.couponCenterId) {
            couponCenter.CouponCenterId = this.couponCenterId
          }
          if (this.type === '2') {
            couponCenter.LessMoney = this.minAmount
            couponCenter.LessTimes = this.minTimes
          }
          if (this.coupon) {
            params.CouponCenters.push(couponCenter)
          } else {
            params.CouponCenters = null
          }
        } else {
          for (let item of this.cards) {
            let couponCenter = {
              CouponCenterType: this.type,
              StoreId: this.storeId,
              IsByUserLevel: 1,
              PreCardId: item.PrepaidCardId,
              Coupons: item.Coupons
            }
            if (!item.Coupons) {
              continue
            }
            if (item.CouponCenterId) {
              couponCenter.CouponCenterId = item.CouponCenterId
            }
            if (this.type === '2') {
              couponCenter.LessMoney = item.LessMoney ? item.LessMoney : 0
              couponCenter.LessTimes = item.LessTimes ? item.LessTimes : 0
            }
            params.CouponCenters.push(couponCenter)
          }
          if (!this.edit && params.CouponCenters.length === 0) {
            wx.showToast({
              title: '请添加优惠券',
              image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
            })
            return
          }
        }
        if (this.edit) {
          this.$post('/couponCenter/businessCouponCentersUpdate', params, true).then(res => {
            that.$success('保存成功', true)
          })
        } else {
          this.$post('/couponCenter/businessAddCouponCenters', params, true).then(res => {
            that.$success('保存成功', true)
          })
        }
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsNotDefaultData: true
        }).then(res => {
          res.StoreId = that.storeId
          that.store = res
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
            item.StoreName = res.StoreName
            if (items) {
              for (let coupon of items) {
                if (item.PrepaidCardId === coupon.PreCardId) {
                  for (let item2 of coupon.Coupons) {
                    item2 = that.calcCoupon(item2)
                  }
                  item.Coupons = coupon.Coupons
                  item.CouponCenterId = coupon.CouponCenterId
                  if (that.type === '2') {
                    item.LessMoney = coupon.LessMoney
                    item.LessTimes = coupon.LessTimes
                  }
                }
              }
            }
          }
          that.cards = res.PrepaidCards
          that.swiperChange(that.current)
          that.firstLoad = false
        })
      },
      getCouponCenter (index) {
        let that = this
        this.$post('/couponCenter/businessCouponCenterInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsByUserLevel: index,
          CouponCenterType: this.type
        }, this.firstLoad).then(res => {
          if (index === -1) {
            that.current = res.IsByUserLevel ? 1 : 0
          }
          for (let item of res.CouponCenterInfos) {
            if (item.IsByUserLevel) {
              that.getCards(res.CouponCenterInfos)
              that.getCouponCenter(0)
              return
            }
            that.couponCenterId = item.CouponCenterId
            that.coupon = that.calcCoupon(item.Coupons[0])
            if (that.type === '2') {
              that.minAmount = item.LessMoney
              that.minTimes = item.LessTimes
            }
          }
          if (index === -1 && !that.current) {
            that.getCouponCenter(1)
          }
          if (index === -1 && that.current) {
            that.getCouponCenter(0)
          }
          if (index === -1 && res.CouponCenterInfos.length === 0 && that.current) {
            that.getCards()
          }
          if (index === 1 && res.CouponCenterInfos.length === 0) {
            that.getCards()
          }
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
      this.edit = option.edit
      this.couponCenterId = ''
      this.coupon = null
      this.cards = []
      this.firstLoad = true
      this.calcName()
      this.getStoreInfo()
      if (option.edit) {
        this.getCouponCenter(-1)
      } else {
        this.swiperChange(0)
        this.getCards()
      }
      this.titleHeight = this.getGlobalData().titleHeight
      wx.removeStorageSync('coupon')
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      let coupon = wx.getStorageSync('coupon')
      if (coupon) {
        if (coupon.CouponType === 1) {
          let values = (coupon.CouponValue + '').split('.')
          coupon.value1 = values[0]
          if (values.length === 2) {
            coupon.value2 = values[1]
          } else {
            coupon.value2 = 0
          }
        }
        if (this.current === 0) {
          if (this.coupon && this.coupon.Id) {
            coupon.Id = this.coupon.Id
          }
          this.coupon = coupon
        } else {
          if (this.cards[this.cardIndex].Coupons && this.cards[this.cardIndex].Coupons[0].Id) {
            coupon.Id = this.coupon.Id
          }
          this.cards[this.cardIndex].Coupons = [coupon]
        }
        wx.removeStorageSync('coupon')
      }
      let data = wx.getStorageSync('data')
      if (data && data.key) {
        if (this.current) {
          if (data.key === 'minAmount') {
            this.cards[this.cardIndex].LessMoney = data.value
          } else if (data.key === 'minTimes') {
            this.cards[this.cardIndex].LessTimes = data.value
          }
        } else {
          if (data.key === 'minAmount') {
            this.minAmount = data.value
          } else if (data.key === 'minTimes') {
            this.minTimes = data.value
          }
        }
        wx.removeStorageSync('data')
      }
      this.changeData += 1
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupon-create-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupon-create-scroll {
      height: 90vh;
      .coupon-create-main {
        min-height: 80vh;
        background: white;
        .coupon-info {
          padding: 4vw 5vw;
          line-height: 5.5vw;
          font-size: 3.4vw;
          background: #ffedad;
          color: #c48f21;
        }
        .switch-button {
          padding: 5vw;
          text-align: center;
          color: #ff6700;
          font-size: 3.5vw;
          div {
            display: inline-block;
            border-radius: 10vw;
            height: 6.5vw;
            line-height: 6.5vw;
            width: 60vw;
            border: rpx(1) solid #ff6700;
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
            background: #ff6700;
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
          }
        }
        .coupon-create-context {
          height: 90vw;
          .same-coupon {
            padding: 5vw 10vw;
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
              .coupon-bg {
                border-radius: 3vw;
                padding: 3vw 3vw 3vw 4vw;
                background: #e4e6e9;
                position: relative;
                top: -2vw;
                .add-button {
                  color: #bfbfbf;
                  font-size: 4.5vw;
                  height: 22vw;
                  line-height: 22vw;
                  text-align: center;
                }
                .coupon-horn {
                  width: 0;
                  height: 0;
                  border-width: 0 3vw 3vw;
                  border-style: solid;
                  border-color: transparent transparent #e4e6e9;
                  position: absolute;
                  left: 15vw;
                  top: -2vw;
                }
                .delete-button {
                  position: absolute;
                  width: 5.6vw;
                  height: 5.6vw;
                  top: -2.5vw;
                  right: -2.5vw;
                  img {
                    width: 5.6vw;
                    height: 5.6vw;
                  }
                }
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
                width: 25%;
                text-align: right;
                color: #7e7e7e;
              }
              .item-3 {
                text-align: center;
                width: 5%;
                img {
                  width: rpx(13);
                  height: rpx(22);
                  display: inline-block;
                  vertical-align: middle;
                  position: relative;
                  top: rpx(-1);
                }
              }
            }
          }
        }
        .coupon-buttons {
          padding: 5vw;
          text-align: right;
          span {
            display: inline-block;
            width: 30vw;
            height: 11vw;
            line-height: 11vw;
            border-radius: 10vw;
            border: rpx(1) solid #ff6700;
            color: #ff6700;
            text-align: center;
            font-size: 4.5vw;
            &:nth-child(2) {
              color: white;
              background: #ff6700;
              margin-left: 3vw;
            }
          }
        }
      }
    }
  }
</style>
