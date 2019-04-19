<template>
  <div class="demo-coupon" :style="{filter:nouse?'grayscale(1)':''}">
    <span class="coupon-left" :style="{'border-color':color?color:''}">
      <div class="left-cash" v-if="coupon.CouponType == 0"
           :style="{'padding-top':coupon.UseMinMoney?'0':''}">
        <span>￥</span>
        <span>{{coupon.CouponValue}}</span>
      </div>
      <div class="left-discount" v-if="coupon.CouponType == 1"
           :style="{'padding-top':coupon.UseMinMoney?'0':''}">
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
          :style="{'background-image':'url('+coupon.CouponIcon+')','background-size':'100%,auto',filter:coupon.State==0?'grayscale(1)':''}"></div>
      </div>
      <div class="min-money" v-if="coupon.UseMinMoney">
        满{{coupon.UseMinMoney}}元可用
      </div>
      <div class="left-type" v-if="coupon.CouponType!=3">
        <span v-if="coupon.CouponType!=2">
          {{coupon.IsMore ? '通用券' : '互斥券'}}
        </span>
        <span v-if="coupon.CouponType!=2&&coupon.IsBuyCard" style="margin-left: 1vw">
          仅购卡
        </span>
        <span v-if="coupon.CouponType==2"
              style="text-decoration:line-through; ">原价{{coupon.OriginalPrice}}元</span>
      </div>
      <div class="left-circle-top" :style="{background:color?color:''}"></div>
      <div class="left-circle-bottom" :style="{background:color?color:''}"></div>
    </span>
    <span class="coupon-right">
      <div class="right-name">
        {{coupon.CouponTitle}}
        <span class="name-body" v-if="coupon.IsUseVip">
          <span class="body-left">
          </span>
          <span class="body-right">
            {{coupon.IsUseVip ? '购卡后生效' : ''}}
            <span class="body-point"></span>
          </span>
        </span>
      </div>
      <div class="right-date">
        有效期：{{coupon.BeginDate}}至{{coupon.EndDate}}
      </div>
      <div class="right-remark" @click.stop="showRemark">
        <span>说<text>啊</text>明：{{coupon.CouponDescription}}</span>
        <img src="/static/coupon-remark.png"/>
      </div>
      <div class="right-point" v-for="i in 19" :style="{top:i*1.11+0.5+'vw',background:color?color:''}"></div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['coupon', 'color', 'nouse'],
    methods: {
      showRemark () {
        this.$emit('remark')
      }
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .demo-coupon {
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
      border-right: rpx(3) dotted;
      border-color: white;
      box-sizing: border-box;
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
        right: -1.1vw;
        top: -1.2vw;
      }
      .left-circle-bottom {
        height: 2vw;
        width: 2vw;
        border-radius: 50%;
        background: white;
        position: absolute;
        right: -1.1vw;
        bottom: -1.2vw;
      }
    }
    .coupon-right {
      position: relative;
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      width: 65%;
      height: 100%;
      padding-top: 3.8vw;
      padding-left: 3.4vw;
      .right-name {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        font-size: 4.7vw;
        .name-body {
          display: inline-block;
          position: relative;
          top: 1.5vw;
          .body-left {
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 1.6vw solid transparent;
            border-bottom: 1.6vw solid transparent;
            border-right: 1.6vw solid #ff6700;
            vertical-align: top;
          }
          .body-right {
            display: inline-block;
            height: 3.1vw;
            line-height: 3.1vw;
            padding: 0 1vw 0 1.5vw;
            background: #ff6700;
            font-size: 2vw;
            color: white;
            vertical-align: top;
            position: relative;
            .body-point {
              background: #fff1ec;
              border-radius: 50%;
              height: 1vw;
              width: 1vw;
              position: absolute;
              top: 1.1vw;
              left: -0.5vw;
            }
          }
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
        text {
          visibility: hidden;
        }
        img {
          width: rpx(17);
          height: rpx(17);
          position: absolute;
          right: 10%;
          bottom: rpx(7);
        }
      }
      .right-point {
        border-radius: 50%;
        background: white;
        position: absolute;
        right: -0.5vw;
        height: 0.9vw;
        width: 0.9vw;
      }
    }
  }
</style>
