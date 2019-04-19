<template>
  <div class="remark-model" :animation="modelAnimation">
    <scroll-view scroll-y="true" class="remark-context" :animation="contextAnimation">
      <div class="remark-scroll">
        <text>{{text}}</text>
      </div>
      <div class="remark-buttons">
        <span @click="doClose">关闭</span>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    props: ['text'],
    data () {
      return {
        modelAnimation: {},
        contextAnimation: {}
      }
    },
    methods: {
      doClose () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.top('27vh').step({duration: 200})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.opacity(0).step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('close')
        }.bind(this), 150)
      }
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.top('20vh').step({duration: 150})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.opacity(1).step({duration: 150})
        this.modelAnimation = modelAnimation.export()
      }.bind(this), 50)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .remark-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 3000;
    background-color: rgba(0, 0, 0, 0.35);
    padding-top: rpx(450);
    .remark-context {
      position: absolute;
      left: 5vw;
      top: 27vh;
      width: 80vw;
      padding: 8vw 5vw;
      height: 85vw;
      border-radius: 2vw;
      background: white;
      .remark-scroll {
        height: 65vw;
        font-size: 4vw;
      }
      .remark-buttons {
        padding-top: 7vw;
        text-align: center;
        span {
          box-sizing: border-box;
          display: inline-block;
          width: 35%;
          border: rpx(1) solid #ff6700;
          background: #ff6700;
          border-radius: 6vw;
          font-size: 4.5vw;
          height: 11vw;
          line-height: 11vw;
          color: white;
          text-align: center;
        }
      }
    }
  }
</style>
