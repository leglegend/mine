<template>
  <div class="item" v-bind:style="{color:item.OperationType==1?'red':''}">
    <span class="logo" @click.stop="jumpToMember"
          v-bind:style="{background:'url('+item.UserImg+')','background-size':'100%,100%'}"></span>
    <span class="info" :class="last?'last':''">
      <div class="operate">
        <span class="user">{{item.RemarkName ? item.RemarkName : item.UserStoreName ? item.UserStoreName : item.UserName}}
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ismember.png"
               style="width: 14rpx;height: 22.4rpx;position: relative;top:2rpx"
               v-if="item.CardId>0"/>
        </span>
        <span class="opera">{{item.ConsumptionTag}}</span>
        <span class="result">{{item.ConsumptionValue}}</span>
        <div class="use-coupon" v-if="item.IsCoupon">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/use-coupon.png"/>
        </div>
      </div>
      <div>
        <span class="time">
          {{item.CreateDate}}
          <span class="useTimes" v-if="item.ConsumptionSum" :style="{color:item.ConsumptionSum==1?'#EEAE25':''}">
            {{item.ConsumptionSum == 1 ? '首次消费' : '第' + item.ConsumptionSum + '次消费'}}
          </span>
        </span>
        <span class="times" v-if="item.ConsumptionTag!='余额'&&item.CardId>0&&item.ConsumptionType!=4">
          余{{item.AfterValue}}
        </span>
      </div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'last'],
    methods: {
      jumpToMember () {
        const url = '/pages/member/persion/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + this.item.Userid + '&cardId=' + this.item.CardId
        wx.navigateTo({url})
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .item {
    width: 92vw;
    margin-left: rpx(37);
    height: rpx(105);
    margin-top: rpx(35);
    font-size: rpx(15);
    color: #a7a7a7;
    .logo {
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
      .operate {
        position: relative;
        .use-coupon {
          position: absolute;
          right: -3.5vw;
          top: 0.5vw;
          z-index: 100;
          img {
            width: rpx(32);
            height: rpx(21);
          }
        }
      }
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
        width: 17vw;
        display: inline-block;
        text-align: left;
      }

      .result {
        width: 23vw;
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
        .useTimes {
          display: inline-block;
          padding-left: rpx(15);
        }
      }
      .times {
        display: inline-block;
        width: 50%;
        text-align: right;
        font-size: rpx(25);
        position: relative;
        bottom: rpx(-5);
        color: #d6d6d6;
      }
    }
    .last {
      border-bottom: 0px;
    }
  }


</style>
