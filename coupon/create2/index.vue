<template>
  <div class="coupon-create2-page">
    <title :name="name"></title>
    <scroll-view class="coupon-create-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-create-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="coupon-info" v-if="type=='4'">
          <div>
            1、当顾客消费达到一定额度时所赠优惠券
          </div>
          <div>
            2、可以设置多个区间
          </div>
        </div>
        <div class="coupon-info" v-if="type=='5'">
          <div>
            1、逢店庆、节假日等可向所有会员赠送优惠券
          </div>
          <div>
            2、可修改优惠券名称，如情人节约就送券
          </div>
        </div>
        <div class="coupon-info" v-if="type=='6'">
          <div>
            1、可通过微信发给顾客，也可在会员管理内直接送给某会员
          </div>
          <div>
            2、可打印二维码放置前台，供顾客快速扫码领券
          </div>
        </div>
        <div class="coupon-create-context">
          <div class="same-coupon" v-for="(item,index) in cards" v-if="type!='5'||item.State != 2">
            <div v-if="!item.Coupons" class="add-coupon" @click="jumpToGift(item,index)">
              + 添加礼券
            </div>
            <div v-if="item.Coupons" @click="jumpToGift(item,index)">
              <div v-for="(itemCoupon,index2) in item.Coupons">
                <coupon :coupon="itemCoupon"></coupon>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='4'">
              <div class="input-item" @click="cardIndex=index">
                <picker :range="['累计','单次']" :value="item.IsOnlyOne?item.IsOnlyOne:0"
                        @change="ruleChange">
                  <span class="item-4">计算规则</span>
                  <span class="item-5">{{item.IsOnlyOne ? '单次' : '累计'}}</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </picker>
              </div>
              <div class="input-item" @click="cardIndex=index">
                <picker :range="['仅付款','卡内消费']" :value="item.ConsumptionType == 2?1:0"
                        @change="typeChange">
                  <span class="item-4">消费方式</span>
                  <span class="item-5">{{item.ConsumptionType == 2 ? '卡内消费' : '仅付款'}}</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </picker>
              </div>
              <div class="input-item"
                   @click="jumpToData('number','金额达到',item.MeetAmountMin?item.MeetAmountMin:'',index)">
                <span class="item-1">金额达到</span>
                <span class="item-2">{{item.MeetAmountMin ? item.MeetAmountMin + '元' : ''}}</span>
                <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='5'">
              <div class="input-item" @click="cardIndex=index">
                <picker mode="date" :value="item.date"
                        @change="dateChange">
                  <span class="item-4">发放日期</span>
                  <span class="item-5">{{item.date ? item.date : ''}}</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </picker>
              </div>
              <div class="input-item" @click="cardIndex=index">
                <picker mode="time" :value="item.time"
                        @change="timeChange">
                  <span class="item-4">发放时间</span>
                  <span class="item-5">{{item.time ? item.time : ''}}</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </picker>
              </div>
              <div class="input-item" @click="cardIndex=index">
                <picker :range="['只发一次']"
                        :value="item.SendGroupTimes == 2 ? 1 : item.SendGroupTimes == 3 ? 2 : 0"
                        @change="timesChange">
                  <span class="item-4">发放次数</span>
                  <span class="item-5">{{item.SendGroupTimes == 2 ? '按月发送' : item.SendGroupTimes == 3 ? '按年发送' : '只发一次'}}</span>
                  <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </picker>
              </div>
              <div class="input-item">
                <span class="item-4">发放群体</span>
                <span class="item-5">全部会员<text style="color: #bfbfbf">(暂不支持筛选)</text></span>
                <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='6'">
              <div class="input-item"
                   @click="jumpToData('number','微信分享限制',item.ShareRegularCount&&item.ShareRegularCount!=-1?item.ShareRegularCount:'',index)">
                <span class="item-4">微信分享限制</span>
                <span class="item-5"
                      v-if="item.ShareRegularCount>0">每次仅限{{item.ShareRegularCount ? item.ShareRegularCount : 1}}名顾客领取</span>
                <span class="item-5"
                      v-if="!item.ShareRegularCount||item.ShareRegularCount==-1">无限制</span>
                <span class="item-3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
              </div>
            </div>
            <div class="delete-button" @click="deleteCard(index)">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-delete.png"/>
            </div>
          </div>
          <div class="add-buttons">
            <span @click="addCard">+ {{type == '4' ? '增加区间' : type == '5' ? '新增活动' : '新增优惠券'}}</span>
          </div>
          <div class="coupon-buttons">
            <span @click="doSave">保 存</span>
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
  import card from '@/components/card'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, card, coupon
    },

    data () {
      return {
        cards: [{}],
        name: '',
        type: '',
        changeData: 0,
        cardIndex: 0,
        titleHeight: null
      }
    },
    methods: {
      jumpToGift (item, index) {
        let url = '../gift/main?storeId=' + this.storeId + '&userId=' + this.userId
        if (this.type === '5') {
          url += '&scene=group'
        }
        this.cardIndex = index
        if (item.Coupons && item.Coupons.length > 0) {
          wx.setStorageSync('coupon', item.Coupons[0])
        }
        wx.navigateTo({url})
      },
      jumpToData (type, name, value, index) {
        let url = '../data/main?type=' + type + '&name=' + name + '&value=' + value
        this.cardIndex = index
        wx.navigateTo({url})
      },
      ruleChange (e) {
        this.cards[this.cardIndex].IsOnlyOne = e.mp.detail.value * 1
        this.changeData += 1
      },
      dateChange (e) {
        this.cards[this.cardIndex].date = e.mp.detail.value
        this.changeData += 1
      },
      timeChange (e) {
        this.cards[this.cardIndex].time = e.mp.detail.value
        this.changeData += 1
      },
      timesChange (e) {
        this.cards[this.cardIndex].SendGroupTimes = e.mp.detail.value * 1 + 1
        this.changeData += 1
      },
      typeChange (e) {
        this.cards[this.cardIndex].ConsumptionType = e.mp.detail.value * 1 + 1
        this.changeData += 1
      },
      doSave () {
        let that = this
        let isError = false
        let papams = {
          Uid: this.userId,
          StoreId: this.storeId,
          IsByUserLevel: false,
          CouponCenterType: this.type,
          CouponCenters: []
        }
        if (this.isEdit && this.cards.length === 1 && !this.cards[0].Coupons) {
        } else {
          for (let item of this.cards) {
            let couponCenter = {
              CouponCenterType: this.type,
              StoreId: this.storeId,
              IsByUserLevel: false,
              PreCardId: item.PrepaidCardId,
              Coupons: item.Coupons,
              State: item.State
            }
            if (item.CouponCenterId) {
              couponCenter.CouponCenterId = item.CouponCenterId
            }
            if (!item.Coupons) {
              wx.showToast({
                title: '请添加券',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              return
            }
            if (this.type === '4') {
              couponCenter.IsOnlyOne = item.IsOnlyOne ? item.IsOnlyOne : 0
              couponCenter.ConsumptionType = item.ConsumptionType === 2 ? 2 : 1
              couponCenter.MeetAmountMin = item.MeetAmountMin
              if (item.MeetAmountMin === null || item.MeetAmountMin === undefined || item.MeetAmountMin === '') {
                isError = true
              }
            } else if (this.type === '5') {
              couponCenter.SendGroup = 0
              couponCenter.SendGroupTimes = item.SendGroupTimes ? item.SendGroupTimes : 1
              if (!item.date || !item.time) {
                isError = true
              } else {
                couponCenter.SendGroupDate = item.date + ' ' + item.time
              }
            } else if (this.type === '6') {
              couponCenter.ShareRegularCount = item.ShareRegularCount ? item.ShareRegularCount : -1
            }
            if (isError) {
              wx.showToast({
                title: '请补全信息',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              return
            }
            papams.CouponCenters.push(couponCenter)
          }
        }
        if (this.isEdit) {
          this.$post('/couponCenter/businessCouponCentersUpdate', papams, true).then(res => {
            that.$success('保存成功', true)
          })
        } else {
          this.$post('/couponCenter/businessAddCouponCenters', papams, true).then(res => {
            that.$success('保存成功', true)
          })
        }
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
          let count = 0
          for (let item of res.CouponCenterInfos) {
            item.Coupons = [that.calcCoupon(item.Coupons[0])]
            if (that.type === '5') {
              if (item.State === 2) {
                count += 1
              }
              let dates = item.SendGroupDate.split(' ')
              item.date = dates[0]
              item.time = dates[1]
            }
          }
          if (that.type === '5' && count !== 0 && count === res.CouponCenterInfos.length) {
            res.CouponCenterInfos.push({})
          }
          that.cards = res.CouponCenterInfos
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
      calcName () {
        this.cards = [{}]
        switch (this.type) {
          case '1':
            this.name = '开卡送券'
            break
          case '2':
            this.name = '续费送券'
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
      },
      addCard () {
        this.cards.push({})
      },
      deleteCard (index) {
        if (this.cards.length === 1) {
          this.cards = [{}]
        } else {
          let cards = []
          for (let i = 0; i < this.cards.length; i++) {
            if (index !== i) {
              cards.push(this.cards[i])
            }
          }
          this.cards = cards
        }
        this.changeData += 1
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.type = option.type
      this.firstLoad = false
      this.calcName()
      this.cards = [{}]
      this.coupon = null
      if (option.edit) {
        this.isEdit = true
        this.getCouponCenter()
      } else {
        this.isEdit = false
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
        if (this.cards[this.cardIndex].Coupons && this.cards[this.cardIndex].Coupons[0].Id) {
          coupon.Id = this.cards[this.cardIndex].Coupons[0].Id
        }
        this.cards[this.cardIndex].Coupons = [coupon]
        wx.removeStorageSync('coupon')
      }
      let data = wx.getStorageSync('data')
      if (data && data.key) {
        if (data.key === 'MeetAmountMin') {
          this.cards[this.cardIndex].MeetAmountMin = data.value
        } else if (data.key === 'minTimes') {
          this.cards[this.cardIndex].LessTimes = data.value
        } else if (data.key === 'ShareRegularCount') {
          this.cards[this.cardIndex].ShareRegularCount = data.value
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

  .coupon-create2-page {
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
          font-size: 3.2vw;
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
          padding-top: 5vw;
          .same-coupon {
            padding: 5vw 10vw;
            position: relative;
            .add-coupon {
              height: 22vw;
              line-height: 22vw;
              border-radius: 1vw;
              background: #f1f1f1;
              color: #c6c6c6;
              text-align: center;
              font-size: 4.5vw;
            }
            .delete-button {
              position: absolute;
              width: 5.6vw;
              height: 5.6vw;
              top: 2.5vw;
              right: 7.5vw;
              img {
                width: 5.6vw;
                height: 5.6vw;
              }
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
              .item-4 {
                width: 45%;
              }
              .item-5 {
                width: 50%;
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
        .add-buttons {
          padding: 0 5vw;
          text-align: left;
          position: relative;
          top: -3vw;
          span {
            display: inline-block;
            padding: 1vw 3vw;
            border-radius: 5vw;
            text-align: center;
            font-size: 3vw;
            color: #ff6700;
            background: #f1f1f1;
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
            &:nth-child(1) {
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
