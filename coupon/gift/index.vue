<template>
  <div class="gift-page">
    <title :name="'新客礼品'"></title>
    <scroll-view class="gift-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="gift-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 2vw"></div>
        <div class="gift-context">
          <div class="gift-type">
            <span :class="{'celected':type=='代金券'}" @click="changeType('代金券')">
              <img v-if="type=='代金券'" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/type-check.png"/> 代金券
            </span>
            <span :class="{'celected':type=='打折券'}" @click="changeType('打折券')">
              <img v-if="type=='打折券'" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/type-check.png"/> 打折券
            </span>
            <span v-if="scene!='renew'" :class="{'celected':type=='送服务'}" @click="changeType('送服务')">
              <img v-if="type=='送服务'" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/type-check.png"/> 送服务
            </span>
            <span v-if="scene!='renew'" :class="{'celected':type=='送礼品'}" @click="changeType('送礼品')">
              <img v-if="type=='送礼品'" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/type-check.png"/> 送礼品
            </span>
          </div>
          <div class="gift-coupon">
            <!--<div class="coupon">
              <span class="coupon-left">
                <div class="left-cash" v-if="type=='代金券'"
                     :style="{'padding-top':minConsume?'0':''}">
                  <span v-if="amount">￥</span>
                  <span>{{amount}}</span>
                </div>
                <div class="left-discount" v-if="type=='打折券'"
                     :style="{'padding-top':minConsume?'0':''}">
                  <span>{{discountRange[0][discount[0]]}}.</span>
                  <span>{{discountRange[2][discount[2]]}}</span>
                  <span>折</span>
                </div>
                <div class="left-discount" v-if="type=='送服务'">
                  <span>{{amount}}</span>
                  <span></span>
                  <span v-if="amount">元</span>
                </div>
                <div class="left-gift" v-if="type=='送礼品'">
                  <div @click="choosePhoto"
                       :style="{'background-image':'url('+giftImg+')','background-size':'100%,auto'}">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/camera2.png" v-if="!giftImg"/>
                    <span v-if="!giftImg">上传图片</span>
                  </div>
                </div>
                <div class="min-money" v-if="minConsume&&(type=='打折券'||type=='代金券')">
                  满{{minConsume}}元可用
                </div>
                <div class="left-type" v-if="type!='送礼品'">
                  <span v-if="type!='送服务'">
                    {{useMore && type == '代金券' ? '通用券' : '互斥券'}}
                  </span>
                  <span v-if="type!='送服务'&&payMember" style="margin-left: 1vw">
                    仅购卡
                  </span>
                  <span v-if="type=='送服务'&&originalPrice"
                        style="text-decoration:line-through; ">原价{{originalPrice}}元</span>
                </div>
                <div class="left-circle-top"></div>
                <div class="left-circle-bottom"></div>
              </span>
              <span class="coupon-right">
                <div class="right-name">
                  {{name ? name : type}}
                  <span v-if="needMember">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buycard.png"/>
                  </span>
                </div>
                <div class="right-date">
                  有效期：{{beginDate}}{{endDate ? '至' : ''}}{{endDate}}
                </div>
                <div class="right-remark" @click="couponRemark=remark">
                  <span>说 明：{{remark}}</span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-remark.png"/>
                </div>
              </span>
            </div>-->
            <coupon :coupon="coupon" @picture="choosePhoto"></coupon>
          </div>
          <div class="coupon-item" v-if="scene!='renew'">
            <span class="item-1">购买会员卡之后才能使用该券</span>
            <span class="item-2">
              <switch :checked="needMember" color="#78bc6d" @change="needMemberChange"/>
            </span>
          </div>
          <div class="coupon-item" v-if="type=='代金券'">
            <span class="item-1">消费时可同时使用多张</span>
            <span class="item-2">
              <switch :checked="useMore" color="#78bc6d" @change="useMoreChange"/>
            </span>
          </div>
          <div class="coupon-item" v-if="type=='代金券'||type=='打折券'">
            <span class="item-1">仅用于购买会员卡</span>
            <span class="item-2">
              <switch :checked="scene=='renew'||payMember" :disabled="scene=='renew'"
                      :color="scene=='renew'?'#8fde80':'#78bc6d'"
                      @change="payMemberChange"/>
            </span>
          </div>
          <div class="coupon-item"
               v-if="type!='送服务'&&scene!='renew'"
               @click="jumpToData('number','最低消费',minConsume)">
            <span class="item-3">最低消费满多少可用</span>
            <span class="item-4">{{minConsume ? minConsume + '元' : '不限制'}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" v-if="type=='送服务'" @click="jumpToData('number','原价',originalPrice)">
            <span class="item-3">原价</span>
            <span class="item-4">{{originalPrice ? originalPrice + '元' : ''}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" v-if="type=='代金券'||type=='送服务'"
               @click="jumpToData('number',type == '送服务' ? '现价' : '金额',amount?amount:'')">
            <span class="item-3">{{type == '送服务' ? '现价' : '金额'}}</span>
            <span class="item-4"
                  v-if="type == '送服务'">{{amount || amount == 0 || amount == '0' ? amount + '元' : ''}}</span>
            <span class="item-4" v-if="type != '送服务'">{{amount ? amount + '元' : ''}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" v-if="type=='打折券'">
            <picker mode="multiSelector" :range="discountRange" :value="discount"
                    @change="discountChange">
              <span class="item-3">折扣</span>
              <span class="item-4">{{discountRange[0][discount[0]]}}.{{discountRange[2][discount[2]]}}折</span>
              <span class="item-5">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </picker>
          </div>
          <div class="coupon-item" @click="choosePhoto" v-if="type=='送礼品'">
            <span class="item-3">礼品图片</span>
            <span class="item-4">
              <div style="padding-top: 1.5vw"></div>
              <span class="choose-photo"
                    :style="{'background-image':'url('+giftImg+')','background-size':'100%,auto'}">{{giftImg ? '' : '+'}}</span>
            </span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" @click="jumpToData('input','名称',name?name:type)">
            <span class="item-3">名称</span>
            <span class="item-4">{{name ? name : type}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" @click="jumpToData('input','说明',remark=='无'?'':remark)">
            <span class="item-3">说明</span>
            <span class="item-4">{{remark}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" @click="jumpToData('date','券有效期')">
            <span class="item-1" style="width: 20%">券有效期</span>
            <span class="item-2"
                  style="width: 75%">{{rangeDate ? rangeDateString : beginDate ? beginDate + '至' + endDate : '请选择'}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="coupon-item" v-if="scene!='group'" @click="jumpToData('number','总发行量',qty==-1?'':qty)">
            <span class="item-1" style="width: 75%">总发行量（送完为止）</span>
            <span class="item-2">{{qty && qty != -1 ? qty : '不限量'}}</span>
            <span class="item-5">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="data-button">
            <span @click="doSave">保存</span>
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
        type: '', // 卡券类型
        name: '', // 券名称
        remark: '无', // 说明
        amount: '', // 金额
        originalPrice: '', // 原价
        qty: '', // 总数量
        giftImg: '',
        beginDate: '',
        endDate: '',
        rangeDate: '',
        rangeDateString: '',
        needMember: false, // 仅限会员领取
        payMember: false, // 只用于支付会员
        useMore: false, // 可使用多张
        minConsume: null, // 最低消费
        discount: [0, 0, 0],
        scene: '',
        discountRange: [
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          ['.'],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ],
        titleHeight: null
      }
    },
    methods: {
      jumpToData (type, name, value) {
        let url = '../data/main?type=' + type + '&name=' + name + (value ? '&value=' + value : '')
        if (type === 'date' && this.rangeDate) {
          url = url + '&rangeDate=' + this.rangeDate
        } else if (type === 'date' && this.beginDate) {
          url = url + '&beginDate=' + this.beginDate + '&endDate=' + this.endDate
        }
        wx.navigateTo({url})
      },
      discountChange (e) {
        this.discount = e.mp.detail.value
        this.exchangeData()
      },
      payMemberChange () {
        this.payMember = !this.payMember
        this.exchangeData()
      },
      useMoreChange () {
        this.useMore = !this.useMore
        this.exchangeData()
      },
      needMemberChange () {
        this.needMember = !this.needMember
        this.exchangeData()
      },
      choosePhoto () {
        let that = this
        wx.chooseImage({
          success: function (res) {
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            console.log(res)
            wx.uploadFile({
              url: that.url + '/Common/uploadFileForXcx',
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                Uid: that.userId,
                StoreId: that.storeId,
                Type: 1,
                FileType: 0
              },
              success: function (res) {
                let data = JSON.parse(res.data)
                that.giftImg = data.Data[0].FilePath
                that.exchangeData()
                wx.hideLoading()
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        })
      },
      changeType (type) {
        this.type = type
        this.exchangeData()
      },
      exchangeData () {
        this.coupon = {}
        let coupon = {
          AcType: this.acType,
          StoreId: this.storeId,
          CouponType: this.type === '代金券' ? 0 : this.type === '打折券' ? 1 : this.type === '送服务' ? 2 : 3,
          CouponTitle: this.name ? this.name : this.type,
          BeginDate: this.beginDate,
          RangeDate: this.rangeDate,
          RangeDateRead: this.rangeDateString,
          EndDate: this.endDate,
          IsUseVip: this.needMember,
          CouponDescription: this.remark,
          CouponCount: this.qty
        }
        if (this.type === '代金券') {
          coupon.IsMore = this.useMore
        }
        if (this.type === '代金券' || this.type === '送服务') {
          coupon.CouponValue = this.amount
        }
        if (this.type === '代金券' || this.type === '打折券') {
          coupon.IsBuyCard = this.payMember
        }
        if (this.type !== '送服务') {
          coupon.UseMinMoney = this.minConsume
        }
        if (this.type === '送服务') {
          coupon.OriginalPrice = this.originalPrice
        }
        if (this.type === '送礼品') {
          coupon.CouponIcon = this.giftImg
        }
        if (this.type === '打折券') {
          coupon.value1 = this.discountRange[0][this.discount[0]]
          coupon.value2 = this.discountRange[2][this.discount[2]]
        }
        this.coupon = coupon
      },
      cleanDate () {
        this.scene = ''
        this.name = ''
        this.remark = '无'
        this.amount = 0
        this.originalPrice = ''
        this.qty = ''
        this.giftImg = ''
        this.beginDate = ''
        this.endDate = ''
        this.rangeDate = ''
        this.rangeDateString = ''
        this.needMember = false
        this.payMember = false
        this.useMore = true
        this.minConsume = null
        this.discount = [0, 0, 0]
        this.discountRange = [
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          ['.'],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ]
      },
      doSave () {
        let errorInfo = ''
        if (this.type === '代金券' && !this.amount) {
          errorInfo = '请填写金额'
        } else if (this.type === '送服务' && !this.originalPrice) {
          errorInfo = '请填写原价'
        } else if (this.type === '送服务' && !this.originalPrice) {
          errorInfo = '请填写原价'
        } else if (this.type === '送礼品' && !this.giftImg) {
          errorInfo = '请上传礼品图'
        } else if (!this.rangeDate && (!this.beginDate || !this.endDate)) {
          errorInfo = '请选择有效期'
        }
        if (errorInfo) {
          wx.showToast({
            title: errorInfo,
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        let coupon = {
          AcType: this.acType,
          StoreId: this.storeId,
          CouponType: this.type === '代金券' ? 0 : this.type === '打折券' ? 1 : this.type === '送服务' ? 2 : 3,
          CouponTitle: this.name ? this.name : this.type,
          BeginDate: this.beginDate,
          EndDate: this.endDate,
          RangeDate: this.rangeDate,
          RangeDateRead: this.rangeDateString,
          IsUseVip: this.needMember,
          CouponDescription: this.remark,
          CouponCount: this.qty
        }
        if (this.type === '代金券') {
          coupon.IsMore = this.useMore
        }
        if (this.type === '代金券' || this.type === '送服务') {
          coupon.CouponValue = this.amount
        }
        if (this.type === '代金券' || this.type === '打折券') {
          coupon.IsBuyCard = this.payMember
        }
        if (this.type !== '送服务') {
          coupon.UseMinMoney = this.minConsume
        }
        if (this.type === '送服务') {
          coupon.OriginalPrice = this.originalPrice
        }
        if (this.type === '送礼品') {
          coupon.CouponIcon = this.giftImg
        }
        if (this.type === '打折券') {
          coupon.CouponValue = this.discountRange[0][this.discount[0]] + '.' + this.discountRange[2][this.discount[2]]
        }
        wx.setStorageSync('coupon', coupon)
        wx.navigateBack({
          delta: 1
        })
      },
      calcRangeDate () {
        if (this.rangeDate) {
          if (this.rangeDate === '0-0-0') {
            this.rangeDateString = '永久有效'
          } else {
            let dates = this.rangeDate.split('-')
            this.rangeDateString = (dates[0] === '0' ? '' : (dates[0] + '年')) + (dates[1] === '0' ? '' : (dates[1] + '月')) + (dates[2] === '0' ? '' : (dates[2] + '日'))
          }
        }
      }
    },
    onLoad (option) {
      this.acType = option.type
      this.storeId = option.storeId
      this.userId = option.userId
      this.type = '代金券'
      this.titleHeight = this.getGlobalData().titleHeight
      this.url = this.getGlobalUrl().url
      this.cleanDate()
      if (option.scene) {
        if (option.scene === 'renew') {
          this.payMember = true
        }
        this.scene = option.scene
      }
      let coupon = wx.getStorageSync('coupon')
      if (coupon) {
        this.type = coupon.CouponType === 0 ? '代金券' : coupon.CouponType === 1 ? '打折券' : coupon.CouponType === 2 ? '送服务' : '送礼品'
        this.name = coupon.CouponTitle
        this.needMember = coupon.IsUseVip
        this.useMore = coupon.IsMore
        this.payMember = coupon.IsBuyCard
        this.minConsume = coupon.UseMinMoney
        this.amount = coupon.CouponValue
        this.originalPrice = coupon.OriginalPrice
        this.remark = coupon.CouponDescription
        this.beginDate = coupon.BeginDate
        this.endDate = coupon.EndDate
        this.rangeDate = coupon.RangeDate
        this.qty = coupon.CouponCount
        this.giftImg = coupon.CouponIcon
        this.calcRangeDate()
        if (coupon.CouponType === 1) {
          let values = (coupon.CouponValue + '').split('.')
          let value1 = 9 - values[0] * 1
          let value2 = 9
          if (values.length === 2) {
            value2 = 9 - values[1] * 1
          }
          this.discount = [value1, 0, value2]
        }
        wx.removeStorageSync('coupon')
      }
      this.exchangeData()
    },
    onShow () {
      let data = wx.getStorageSync('data')
      if (data && data.key) {
        if (data.key === 'minConsume') {
          this.minConsume = data.value
        } else if (data.key === 'name') {
          this.name = data.value
        } else if (data.key === 'remark') {
          this.remark = data.value
        } else if (data.key === 'amount') {
          this.amount = data.value
        } else if (data.key === 'originalPrice') {
          this.originalPrice = data.value
        } else if (data.key === 'qty') {
          this.qty = data.value
        } else if (data.key === 'date') {
          this.beginDate = data.value.beginDate
          this.endDate = data.value.endDate
          this.rangeDate = ''
        } else if (data.key === 'rangeDate') {
          this.beginDate = ''
          this.endDate = ''
          this.rangeDate = data.value
          this.calcRangeDate()
        }
        wx.removeStorageSync('data')
      }
      this.exchangeData()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .gift-page {
    height: 100vh;
    background-color: #f0f0f0;
    .gift-scroll {
      height: 90vh;
      .gift-main {
        min-height: 80vh;
        .gift-context {
          padding: 6vw 5vw;
          background: white;
          .gift-type {
            span {
              font-size: 3.5vw;
              text-align: center;
              box-sizing: border-box;
              display: inline-block;
              width: 21vw;
              border: rpx(1) solid #eeeeee;
              height: 8vw;
              line-height: 8vw;
              margin-left: 2vw;
              border-radius: 4vw;
              &:nth-child(1) {
                margin-left: 0;
              }
              img {
                display: inline-block;
                width: rpx(19);
                height: rpx(14);
                position: relative;
                top: -0.3vw;
              }
            }
            .celected {
              background: #eaf5e9;
              color: #5fa954;
              border: rpx(1) solid #cae5c6;
            }
          }
          .gift-coupon {
            padding: 7vw 5vw 3.7vw 5vw;
            .coupon {
              height: 22vw;
              background: #fff1ec;
              border-radius: 0.8vw;
              position: relative;
              .coupon-left {
                position: relative;
                color: #ff6700;
                display: inline-block;
                height: 100%;
                width: 35%;
                text-align: center;
                .left-cash {
                  padding-top: 2.7vw;
                  height: 13.5vw;
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
                .left-discount {
                  padding-top: 2.7vw;
                  height: 13.5vw;
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
                .min-money {
                  font-size: 2.5vw;
                  position: relative;
                  top: -2.5vw;
                  color: #7e7e7e;
                  height: 2.5vw;
                }
                .left-type {
                  font-size: 2.5vw;
                  span {
                    position: relative;
                    top: -0.5vw;
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
          }
          .coupon-item {
            font-size: 3.7vw;
            height: 13vw;
            line-height: 13vw;
            border-bottom: rpx(1) solid #dddddd;
            span {
              display: inline-block;
              height: 13vw;
              line-height: 13vw;
              vertical-align: top;
            }
            .item-1 {
              width: 80%;
            }
            .item-2 {
              width: 20%;
              text-align: right;
              color: #7e7e7e;
              switch {
                zoom: .8;
              }
            }
            .item-3 {
              width: 40%;
            }
            .item-4 {
              text-align: right;
              width: 55%;
              color: #7e7e7e;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              .choose-photo {
                height: 10vw;
                line-height: 10vw;
                width: 10vw;
                text-align: center;
                border-radius: 50%;
                display: inline-block;
                background: #f1f1f1;
                color: #d2d2d2;
                font-size: 5vw;
                font-weight: 400;
              }
            }
            .item-5 {
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
          .data-button {
            padding: 3vw 0;
            text-align: right;
            font-size: 4vw;
            span {
              width: 25vw;
              height: 10vw;
              line-height: 10vw;
              background: #ff6700;
              border-radius: 6vw;
              text-align: center;
              color: white;
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
