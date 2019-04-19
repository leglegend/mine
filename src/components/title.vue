<template>
  <div class="windows-title" :style="{height:titleHeight-statusBarHeight+'px','padding-top':statusBarHeight +'px'}">
    <div class="title-context">
      <span class="return" @click="navigateBack">
        <img class="title-icon" src="/static/return.png"/>
      </span>
      <span class="center-title">
        <img v-if="name=='生日送券'" style="width: 35rpx;height: 33rpx;"
             src="/static/coupon-birthday.png"/>
        <img v-if="name=='满送券'" style="width: 34rpx;height: 29rpx;"
             src="/static/coupon-discount.png"/>
        <img v-if="name=='群发券'" style="width: 39rpx;height: 33rpx;"
             src="/static/coupon-group.png"/>
        <img v-if="name=='定向券'" style="width: 38rpx;height: 39rpx;"
             src="/static/coupon-appoint.png"/>
        {{name}}
      </span>
      <span class="return"></span>
    </div>
    <div class="title-bottom" v-if="noline!=true"></div>
  </div>
</template>
<script>
  export default {
    props: ['name', 'noline'],
    data () {
      return {
        statusBarHeight: null,
        titleHeight: null
      }
    },
    methods: {
      navigateBack () {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    created () {
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .windows-title {
    width: 100vw;
    background-color: #ffffff;
    z-index: 1000;
    position: relative;
    span {
      display: inline-block;
      vertical-align: top;
      height: 32px;
      line-height: 32px;
    }
    .title-context {
      height: 32px;
      line-height: 32px;
    }
    .center-title {
      width: 60%;
      text-align: center;
      font-size: rpx(38);
      img {
        vertical-align: middle;
        position: relative;
        top: -1px;
      }
    }
    .return {
      width: 20%;
      font-size: rpx(38);
      color: #959595;
      .title-icon {
        display: inline-block;
        width: rpx(18);
        height: rpx(31);
        padding-left: rpx(25);
      }
    }
    .title-bottom {
      position: absolute;
      bottom: rpx(-1);
      height: rpx(1);
      background: white;
      width: 100vw;
      z-index: 1001;
      border-bottom: rpx(1) solid #bfbfbf;
    }
  }
</style>
