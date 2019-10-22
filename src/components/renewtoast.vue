<template>
  <view class="mptoast" :class="animation" @click.stop="">
    <div class="mptoast-close" @click.stop="close">
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close.png"/>
    </div>
    <span class="mptoast-icon">
      <img style="width: 7.4vw;height: 7.4vw;" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/error.png"/>
    </span>
    <span class="mptoast-context">
      <div class="title">亲, 该功能仅限付费用户使用呢</div>
      <div class="text">请尽快续费哦 <a @click="jumpToRenew">续费绿色通道</a></div>
    </span>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['show'],
    data () {
      return {
        animation: 'enterAni'
      }
    },
    methods: {
      jumpToRenew () {
        const url = '/pages/mine/service/renew/main?storeId=' + this.$store.state.storeId + '&userId=' + this.$store.state.userId
        wx.navigateTo({url})
      },
      close () {
        this.animation = 'fadeAni'
        setTimeout(function () {
          this.$emit('close')
        }.bind(this), 350)
      }
    },
    onLoad () {
      this.animation = 'enterAni'
    }
  }
</script>

<style lang="scss" scoped>
  .mptoast {
    width: 95vw;
    padding: 4vw 2vw 0 2vw;
    position: fixed;
    z-index: 999;
    bottom: -21vw;
    left: 2.5vw;
    height: 20vw;
    background: #F87272;
    border-radius: 2.8vw;
    color: white;
    box-sizing: border-box;
    .mptoast-close {
      position: absolute;
      right: 0;
      top: 0;
      padding: 3.5vw;
      width: 3vw;
      height: 3vw;
      img {
        display: inline-block;
        width: 3vw;
        height: 3vw;
        vertical-align: top;
      }
    }
    .mptoast-icon {
      width: 11.5vw;
      text-align: center;
      display: inline-block;
      vertical-align: top;
      img {
        display: inline-block;
        vertical-align: top;
      }
    }
    .mptoast-context {
      display: inline-block;
      width: 75vw;
      .title {
        line-height: 6.8vw;
        font-size: 4.5vw;
        font-weight: 600;
      }
      .text {
        font-size: 3.6vw;
        line-height: 4vw;
        padding-top: 1.8vw;
        a {
          display: inline-block;
          color: #023D82;
          text-decoration: underline;
          margin-left: 2vw;
        }
      }
    }
  }

  .mptoast-keep {
    bottom: 4vw;
  }

  .enterAni {
    animation: enter 0.35s;
    animation-fill-mode: forwards;
  }

  .fadeAni {
    animation: fadeout 0.4s;
    animation-fill-mode: forwards;
  }

  @keyframes enter {
    from {
      bottom: -21vw;
    }
    to {
      bottom: 4vw;
    }
  }

  @keyframes fadeout {
    from {
      bottom: 4vw;
    }
    to {
      bottom: -21vw;
    }
  }
</style>
