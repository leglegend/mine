<template>
  <div class="details">
    <title :name="'运营报表'"></title>
    <scroll-view scroll-y="true" style="background-color: #f0f0f0;"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div style="background-color: #f0f0f0;"
           :style="{'min-height':'calc(85vh - '+titleHeight +'px)'}">
        <div class="details-context">
          <div class="titles" @click="jumpToDetails">
            <span class="logo" v-bind:style="{background:'url('+info.UserImg+')','background-size':'100%,100%'}"></span>
            <span
              class="user-name">{{info.RemarkName ? info.RemarkName : info.UserStoreName ? info.UserStoreName : info.UserName ? info.UserName : ''}}</span>
          </div>
          <div class="times" v-if="info.ConsumptionType===1||info.ConsumptionType===4">
            {{info.ConsumptionValue ? info.ConsumptionValue : '' }}
          </div>
          <div class="times" v-if="info.ConsumptionType===0">
            <div v-for="item in info.Service" v-if="item.ConsumptionValue">
              <span>{{item.ItemName}}</span>
              <span>{{(info.ConsumptionTag === '会员卡' || info.ConsumptionTag === '核减') ? '-' : '+'}}{{item.ConsumptionValue}}次</span>
            </div>
          </div>
          <div class="result">办理成功</div>
          <div style="padding-top: 0.2vh">
            <span class="name">操作人员</span>
            <span class="value">{{info.StoreUserName ? info.StoreUserName : info.UserName}}</span>
          </div>
          <div v-if="info.ConsumptionTag!='初始化'&&info.ConsumptionTag!='赠送'&&info.ConsumptionTag!='核减'">
            <span class="name">付款方式</span>
            <span class="value">{{info.PayType}}</span>
          </div>
          <div>
            <span class="name">交易类型</span>
            <span class="value">{{info.ConsumptionTag}}</span>
          </div>
          <div
            v-if="info.ConsumptionTag!='初始化'&&info.ConsumptionTag!='赠送'&&info.ConsumptionTag!='核减'&&(info.ConsumptionType == 1||info.ConsumptionType == 4)">
            <span class="name">应付金额</span>
            <span class="value">{{info.ConsumptionType == 1 ? info.TotalPrice : info.ConsumptionValue}}</span>
          </div>
          <div v-if="info.ConsumptionTag!='初始化'&&info.ConsumptionTag!='赠送'&&info.ConsumptionTag!='核减'">
            <span class="name">{{info.TotalPrice ? '实付金额' : '交易额度'}}</span>
            <span class="value">{{info.ConsumptionValue}}</span>
          </div>
          <div v-if="info.ConsumptionTag=='赠送'||info.ConsumptionTag=='核减'">
            <span class="name">调整金额</span>
            <span class="value">{{info.ConsumptionValue}}</span>
          </div>
          <div v-if="info.IsCoupon">
            <span class="name">优惠券</span>
            <span class="value" style="position: relative" @click="jumpToCoupons">
              <span style="color: red">
                {{info.Coupons.length + '张'}}
              </span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"
                   style="position: absolute;width: 13rpx;height: 22rpx;right: -16rpx;bottom:5rpx;"/>
            </span>
          </div>
          <div v-if="!info.IsCoupon&&info.ConsumptionTag!='初始化'&&info.ConsumptionTag!='赠送'&&info.ConsumptionTag!='核减'">
            <span class="name">优惠券</span>
            <span class="value">
              -
            </span>
          </div>
          <div v-if="info.CardName">
            <span class="name">会员卡名</span>
            <span class="value">{{info.CardName}}</span>
          </div>
          <div v-if="info.CardNumber">
            <span class="name">会员卡号</span>
            <span class="value">{{info.CardNumber}}</span>
          </div>
          <div v-if="info.ConsumptionTag!='付款'&&info.ConsumptionTag!='优惠券'">
            <span class="name" style="vertical-align: top">剩余额度</span>
            <span class="value" v-if="!info.Service||info.Service.length==0">{{info.AfterValue}}</span>
            <span class="value" v-if="info.Service&&info.Service.length>0">
              <span
                v-for="(item,index) in info.Service">{{item.ItemName + item.AfterValue + '次'}}{{index == info.Service.length - 1 ? '' : ','}}</span>
            </span>
          </div>
          <div>
            <span class="name">业务单号</span>
            <span class="value">{{info.ConsumptionId}}</span>
          </div>
          <div class="line"></div>
          <div class="business-time" style="padding-bottom: 5vh">
            <span>交易时间</span>
            <span>{{info.CreateDate}}</span>
          </div>
        </div>
        <div class="coupons" style="display: none">
          <div class="coupons-list overdue">
            <div class="coupon-item" v-for="coupon in items">
              <div class="coupon-nouse">
                <span class="coupon-left">
                  <div class="left-cash" v-if="coupon.CouponType == 0">
                    <span>￥</span>
                    <span>{{coupon.CouponValue}}</span>
                  </div>
                  <div class="left-discount" v-if="coupon.CouponType == 1">
                    <span>{{coupon.value1 + '.'}}</span>
                    <span>{{coupon.value2 ? coupon.value2 : 0}}</span>
                    <span>折</span>
                  </div>
                  <div class="left-discount" v-if="coupon.CouponType == 2">
                    <span>{{coupon.CouponValue}}</span>
                    <span></span>
                    <span>元</span>
                  </div>
                  <div class="left-gift" v-if="coupon.CouponType == 3">
                    <div
                      :style="{'background-image':'url('+coupon.CouponIcon+')','background-size':'100%,auto',filter:'grayscale(1)'}"></div>
                  </div>
                  <div class="left-type" v-if="coupon.CouponType!=3">
                    <span v-if="coupon.CouponType!=2">
                      {{coupon.IsMore ? '通用券' : '互斥券'}}{{coupon.IsBuyCard ? '仅购卡' : ''}}
                    </span>
                    <span v-if="coupon.CouponType==2"
                          style="text-decoration:line-through; ">原价{{coupon.OriginalPrice}}元</span>
                  </div>
                  <div class="left-circle-top"></div>
                  <div class="left-circle-bottom"></div>
                </span>
                <span class="coupon-right">
                  <div class="right-name">
                    {{coupon.CouponTitle}}
                    <span v-if="coupon.IsUseVip" :style="{filter:'grayscale(1)'}">
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buycard.png"/>
                    </span>
                  </div>
                  <div class="right-date">
                    有效期：{{coupon.BeginDate}}至{{coupon.EndDate}}
                  </div>
                  <div class="right-remark">
                    说 明：{{coupon.CouponDescription}}
                  </div>
                </span>
              </div>
              <div class="coupon-source">
                {{'来源：' + coupon.CouponSourceContent}}
              </div>
              <div class="coupon-used">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/current-used.png"/>
              </div>
            </div>
          </div>
        </div>
        <div class="printing-tickets">
          <span @click="downloadDetails">打印小票</span>
        </div>
      </div>
      <div class="demo-footer">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="printing-info" v-if="message" :style="{background:message=='打印已发送'?'#78BC6D':'#F87272'}">
      <span>
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/error.png" v-if="message!='打印已发送'"/>
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/check2.png" v-if="message=='打印已发送'"/>
      </span>
      <span>{{message}}</span>
      <div class="close" @click="message=''" v-if="message!='打印已发送'">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close.png"/>
      </div>
    </div>
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
        info: {},
        items: [],
        message: '',
        titleHeight: null
      }
    },
    methods: {
      jumpToDetails () {
        if (this.type === 'member') {
          return
        }
        const url = '../member/persion/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + this.info.UserId + '&cardId=' + this.info.CardId
        wx.navigateTo({url})
      },
      jumpToCoupons () {
        const url = '../coupons/main?userId=' + this.userId + '&storeId=' + this.storeId + '&consumptionId=' + this.consumptionId
        wx.navigateTo({url})
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
      downloadDetails () {
        let that = this
        this.$post('/consumption/printConsumption', {
          StoreId: that.storeId,
          Uid: that.userId,
          ConsumptionId: that.consumptionId
        }, true, true).then(res => {
          if (res.State) {
            that.message = '打印已发送'
            setTimeout(function () {
              that.message = ''
            }, 3000)
          } else {
            that.message = res.Message
          }
        })
      }
    },
    onLoad (option) {
      let that = this
      this.userId = option.userId
      this.storeId = option.storeId
      this.consumptionId = option.consumptionId
      this.type = option.type
      this.info = {}
      this.message = ''
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
      this.$post('/consumption/businessGetConsumptionInfo', {
        StoreId: option.storeId,
        Uid: option.userId,
        ConsumptionId: option.consumptionId
      }).then(res => {
        that.info = res
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

  .details {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .details-context {
      width: 90vw;
      padding: 0 5vw;
      text-align: center;
      background-color: white;
      .titles {
        height: 13.5vh;
        line-height: 13.5vh;
        .logo {
          width: 8vw;
          height: 8vw;
          font-size: rpx(35);
          text-align: center;
          line-height: 8vh;
          display: inline-block;
          border-radius: 50%;
          background-color: #d5d5d5;
          vertical-align: middle;
        }
        .user-name {
          display: inline-block;
          padding-left: 2vw;
          font-size: 0.8em;
          vertical-align: middle;
        }
      }
      .times {
        font-size: rpx(80);
        padding-top: 0vh;
        div {
          font-size: 7vw;
          height: 8.5vw;
          line-height: 8.5vw;
          text-align: center;
        }
        span {
          display: inline-block;
          width: 50%;
          box-sizing: border-box;
          &:nth-child(1) {
            text-align: right;
            padding-right: 2vw;
          }
          &:nth-child(2) {
            text-align: left;
            padding-left: 2vw;
          }
        }
      }
      .result {
        font-size: rpx(30);
        height: 3vh;
        line-height: 3vh;
        padding-bottom: 7vh;
      }
      .name {
        width: 45vw;
        font-size: rpx(27);
        display: inline-block;
        padding-top: 1.8vh;
        text-align: left;
        color: #a7a7a7;
      }
      .value {
        width: 45vw;
        font-size: rpx(27);
        display: inline-block;
        padding-top: 1.8vh;
        text-align: right;
      }
      .line {
        height: 1.8vh;
        border-bottom: rpx(1) solid #bbbbbb;
      }
      .business-time {
        text-align: right;
        color: #A7A7A7;
        font-size: 2.8vw;
        padding-top: 3.2vw;
        padding-right: 0.6vw;
        span {
          display: inline-block;
          padding-left: 2vw;
        }
      }
    }
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
    .printing-tickets {
      padding-bottom: 10vw;
      text-align: center;
      background: white;
      span {
        display: inline-block;
        width: 30vw;
        height: 9.2vw;
        line-height: 9.2vw;
        background: rgba(255, 244, 237, 1);
        border: 0.2vw solid rgba(255, 111, 0, 1);
        border-radius: 4.7vw;
        font-size: 3.6vw;
        color: rgba(255, 111, 0, 1);
      }
    }
    .printing-info {
      position: fixed;
      bottom: 9vw;
      left: 2.5vw;
      width: 95vw;
      height: 14.8vw;
      box-sizing: border-box;
      line-height: 14.8vw;
      background: #78BC6D;
      border-radius: 2.8vw;
      padding-left: 4.1vw;
      span {
        display: inline-block;
        height: 14.8vw;
        line-height: 14.8vw;
        vertical-align: top;
        box-sizing: border-box;
        &:nth-child(1) {
          padding-top: 3.9vw;
          img {
            display: inline-block;
            width: 7.4vw;
            height: 7.4vw;
            vertical-align: top;
          }
        }
        &:nth-child(2) {
          padding-left: 2.7vw;
          color: white;
          font-size: 4vw;
        }
      }
      .close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 3.6vw;
        height: 2.9vw;
        line-height: 2.9vw;
        width: 2.9vw;
        img {
          display: inline-block;
          width: 2.9vw;
          height: 2.9vw;
          vertical-align: top;
        }
      }
    }
  }
</style>
