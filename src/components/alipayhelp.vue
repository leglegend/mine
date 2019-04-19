<template>
  <div class="alipay-model" :animation="modelAnimation">
    <div style="padding-top: 35vw;"></div>
    <div class="confirm-context" :animation="contextAnimation">
      <img class="alipay-img" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/alipayhelp.jpg"/>
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
        contextAnimation.height('115vw').width('80vw').step({duration: 150})
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

  .alipay-model {
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
      .context {
        padding: rpx(70) rpx(50) rpx(30) rpx(50);
        height: rpx(120);
        white-space: nowrap;
        overflow: hidden;
      }
      .alipay-img {
        width: 70.7vw;
        height: 90.7vw;
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
          height: rpx(78);
          line-height: rpx(78);
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
