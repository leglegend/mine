<template>
  <div class="record" :style="{ 'font-weight':item.DataType==1? 'bold':''}">
    <div>
      <span style="width: 20%">{{item.Introduction}}</span>
      <span style="width: 80%">
        <span class="record-money" :animation="animation">
          ￥{{item.SumMony}}
        </span>
      </span>
    </div>
    <div>
      <span>接待散客 {{item.SumNonVipPeople}}</span>
      <span>会员 {{item.SumVipPeople}}</span>
      <span>开卡 {{item.SumOpenCard}}</span>
      <span>续费 {{item.SumRenewal}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'year', 'month'],
    data () {
      return {
        animation: {},
        max: null
      }
    },
    methods: {
      updateValue (max, year, month) {
        if (year !== this.year || month !== this.month) {
          return
        }
        let value = this.item.SumMony
        let width = 0
        if (value === 0) {
          width = 0
        } else {
          width = value / max * 100
        }
        let animation = wx.createAnimation()
        animation.width(width + '%').step({duration: 800})
        this.animation = animation.export()
      }
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .record {
    width: 90vw;
    margin-left: 5vw;
    height: 10vh;
    line-height: 10vh;
    font-size: 0.8em;
    margin-top: 2vh;
    padding-bottom: 4.4vh;
    div {
      &:nth-child(1) {
        span {
          display: inline-block;
          .record-money {
            padding-left: 1%;
            height: rpx(40);
            width: 1%;
            border-radius: 0 rpx(20) rpx(20) 0;
            overflow: visible;
            background-color: #f7f0e7;
            line-height: rpx(40);
          }
        }
      }
      &:nth-child(2) {
        height: 2vh;
        line-height: 2vh;
        padding-left: 20%;
        width: 80%;
        font-size: rpx(23);
        position: relative;
        top: rpx(-20);
        span {
          display: inline-block;
          color: #c1c1c1;
          &:nth-child(1) {
            width: 32%;
          }
          &:nth-child(2) {
            width: 24%;
          }
          &:nth-child(3) {
            width: 23%;
          }
          &:nth-child(4) {
            width: 21%;
          }
        }
      }
    }
  }
</style>
