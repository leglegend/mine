<template>
  <div class="list" v-bind:style="{color:item.OperationType==1?'red':''}">
    <img class="item-logo" :src="item.ConsumptionImg"/>
    <span class="info" :class="last?'last':''">
      <div class="operate">
        <span class="user">{{item.OperationType == 1 ? item.StoreUserName : '用户扫描'}}</span>
        <span class="opera">{{item.ConsumptionTag}}</span>
        <span class="result">{{item.ConsumptionValue}}</span>
        <div class="use-coupon" v-if="item.IsCoupon">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/use-coupon.png"/>
        </div>
      </div>
      <div>
        <span class="time">
        {{item.CreateDate}}</span>
        <span class="times" v-if="item.ConsumptionTag!='付款'&&item.ConsumptionType!=4">
        余{{item.AfterValue}}</span>
      </div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'last']
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .list {
    width: 92vw;
    margin-left: rpx(47);
    height: rpx(96);
    margin-top: rpx(30);
    font-size: rpx(15);
    .item-logo {
      width: rpx(55);
      height: rpx(55);
      font-size: 0.5em;
      text-align: center;
      line-height: 5vh;
      display: inline-block;
      border-radius: 50%;
      vertical-align: top;
    }
    .info {
      display: inline-block;
      vertical-align: middle;
      margin-left: rpx(10);
      height: 7vh;
      width: 83vw;
      font-size: rpx(27);
      border-bottom: rpx(1) solid #dddddd;
      .user {
        width: 41vw;
        padding-left: rpx(9);
        display: inline-block;
        text-align: left;
        color: black;
      }

      .operate {
        position: relative;
        .use-coupon {
          position: absolute;
          right: -1vw;
          top: 0vw;
          z-index: 100;
          img {
            width: rpx(32);
            height: rpx(21);
          }
        }
      }
      .opera {
        width: 17vw;
        display: inline-block;
        text-align: left;
      }

      .result {
        width: 20vw;
        display: inline-block;
        text-align: right;
      }

      .time {
        display: inline-block;
        width: 50%;
        padding-left: rpx(8);
        font-size: rpx(19);
        position: relative;
        bottom: rpx(2);
        color: #d6d6d6;
      }
      .times {
        display: inline-block;
        width: 44%;
        text-align: right;
        font-size: rpx(19);
        position: relative;
        bottom: rpx(2);
        color: #d6d6d6;
      }
    }
    .last {
      border-bottom: 0px;
    }
  }
</style>
