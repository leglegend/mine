<template>
  <div class="collect" v-bind:style="{color:item.OperationType==1?'red':''}">
    <span class="collect-logo" v-bind:style="{background:'url('+item.UserImg+')','background-size':'100%,100%'}"></span>
    <span class="info" :class="last?'last':''">
      <div class="operate">
        <span class="user">{{item.UserStoreName ? item.UserStoreName : item.UserName}}
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ismember.png" style="width: 14rpx;height: 22.4rpx;position: relative;top:2rpx"
               v-if="item.CardId>0"/>
        </span>
        <span class="opera"></span>
        <span class="result">{{type == 'card' ? '￥' + item.SalesMoney : item.ConsumptionValue}}</span>
      </div>
      <div>
        <span class="time">
        {{item.CreateDate}}</span>
        <span class="times" :style="{color:item.State?'#78bc6d':'#d6d6d6'}" v-if="type!='card'">
        {{item.State ? '到账成功' : '未到账'}}</span>
      </div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'last', 'type']
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .collect {
    width: 92vw;
    margin-left: rpx(37);
    height: rpx(105);
    margin-top: rpx(35);
    font-size: rpx(15);
    color: #a7a7a7;
    .collect-logo {
      width: rpx(70);
      height: rpx(70);
      display: inline-block;
      border-radius: 50%;
      vertical-align: top;
    }
    .info {
      display: inline-block;
      vertical-align: middle;
      margin-left: rpx(5);
      height: rpx(105);
      width: 80vw;
      font-size: rpx(27);
      border-bottom: rpx(1) solid #dddddd;
      .user {
        width: 38vw;
        padding-left: rpx(9);
        display: inline-block;
        text-align: left;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .opera {
        width: 0vw;
        display: inline-block;
        text-align: left;
      }

      .result {
        width: 40vw;
        display: inline-block;
        text-align: right;
        font-size: rpx(30);
        color: black;
      }

      .time {
        display: inline-block;
        width: calc(50% - 8rpx);
        padding-left: rpx(8);
        font-size: rpx(25);
        position: relative;
        bottom: rpx(-5);
        color: #d6d6d6;
      }
      .times {
        display: inline-block;
        width: 50%;
        text-align: right;
        font-size: rpx(25);
        position: relative;
        bottom: rpx(-5);
        color: #78bc6d;
      }
    }
    .last {
      border-bottom: 0px;
    }
  }


</style>
