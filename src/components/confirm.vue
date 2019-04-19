<template>
  <div class="confirm-model" :animation="modelAnimation">
    <div class="confirm-context" :animation="contextAnimation">
      <div class="context">
        {{title}}
        <div class="text" v-if="text">
          {{text}}
        </div>
      </div>
      <div class="buttons">
        <span class="cancel" @click="doCancel">{{cancel}}</span>
        <span class="confirm" @click="doConfirm">{{confirm}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'cancel', 'confirm', 'text'],
    data () {
      return {
        modelAnimation: {},
        contextAnimation: {}
      }
    },
    methods: {
      doCancel () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.height('0').width('0').step({duration: 200})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('cancel')
        }.bind(this), 150)
      },
      doConfirm () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.height('0').width('0').step({duration: 200})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          let modelAnimation = wx.createAnimation()
          modelAnimation.height('0').width('0').step({duration: 50})
          this.modelAnimation = modelAnimation.export()
          this.$emit('confirm')
        }.bind(this), 150)
      }
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.height('355rpx').width('94vw').step({duration: 150})
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

  .confirm-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1001;
    background-color: rgba(0, 0, 0, 0);
    padding-top: rpx(450);
    .confirm-context {
      width: 0;
      height: 0;
      margin: 0 auto;
      background-color: white;
      border-radius: rpx(10);
      font-size: rpx(36);
      overflow: hidden;
      .context {
        padding: rpx(70) rpx(50) rpx(30) rpx(50);
        height: rpx(120);
        white-space: nowrap;
        overflow: hidden;
        .text {
          padding-top: 1vw;
          white-space: normal;
          font-size: rpx(28);
          color: #bdbdbd;
        }
      }
      .buttons {
        padding: rpx(20) rpx(40);
        text-align: right;
        font-size: rpx(34);
        span {
          display: inline-block;
          border-radius: rpx(40);
          width: rpx(165);
          height: rpx(78);
          line-height: rpx(78);
          text-align: center;
          border: rpx(1) solid #ff6700;
          margin-left: rpx(27)
        }
        .cancel {
          color: #ff6700;
          &:active {
            background-color: #e6e6e6;
          }
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
