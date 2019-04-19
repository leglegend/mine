<template>
  <div class="create-model" :animation="modelAnimation">
    <div style="padding-top: 35vw;"></div>
    <div class="confirm-context" :animation="contextAnimation">
      <div class="create-title">
        <span>新建会员成功!</span>
        <span>不在显示</span>
        <span>
          <switch @change="switchChange" :checked="checked" color="#78bc6d"/>
        </span>
      </div>
      <div class="create-context">
        当该会员过来消费时，扫描您的店铺码，点击右上角，即可完成领卡！
      </div>
      <img class="alipay-img" src="/static/createhelp.png"/>
      <div class="buttons">
        <span class="confirm" @click="doConfirm">知道了</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        modelAnimation: {},
        contextAnimation: {}
      }
    },
    methods: {
      switchChange (e) {
        let value = e.mp.detail.value
        wx.setStorageSync('createhelp', value)
      },
      doConfirm () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.height('0').width('0').step({duration: 200})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('confirm')
        }.bind(this), 150)
      }
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.height('100vw').width('90vw').step({duration: 150})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0.35)').step({duration: 150})
        this.modelAnimation = modelAnimation.export()
      }.bind(this), 50)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .create-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1001;
    background-color: rgba(0, 0, 0, 0);
    .confirm-context {
      width: 0;
      height: 0;
      margin: 0 auto;
      background-color: white;
      border-radius: rpx(10);
      font-size: rpx(36);
      overflow: hidden;
      text-align: center;
      padding-top: 7.5vw;
      .create-title {
        text-align: left;
        font-size: 5vw;
        padding-left: 5vw;
        overflow: hidden;
        span {
          display: inline-block;
          vertical-align: middle;
          &:nth-child(1) {
            width: 48vw;
          }
          &:nth-child(2) {
            color: #a7a7a7;
            font-size: 3.5vw;
            padding-right: 2vw;
          }
        }
      }
      .create-context {
        text-align: left;
        font-size: 3.5vw;
        color: #a7a7a7;
        padding: 3vw 5vw;
      }
      .context {
        padding: rpx(70) rpx(50) rpx(30) rpx(50);
        height: rpx(120);
        white-space: nowrap;
        overflow: hidden;
      }
      .alipay-img {
        width: 59.3vw;
        height: 55.3vw;
        display: inline-block;
      }
      .buttons {
        padding: rpx(35) rpx(40);
        text-align: center;
        font-size: rpx(34);
        span {
          display: inline-block;
          border-radius: rpx(40);
          width: rpx(165);
          height: rpx(75);
          line-height: rpx(75);
          text-align: center;
          border: rpx(1) solid #ff6700;
        }
        .confirm {
          color: white;
          background-color: #ff6700;
          &:active {
            background-color: #e66100;
          }
        }
      }
    }
  }
</style>
