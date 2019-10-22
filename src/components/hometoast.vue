<template>
  <view class="mptoast" :style="{background:icon==2||icon==-1?'#78BC6D':''}">
    <div class="mptoast-close" @click="close">
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close.png"/>
    </div>
    <span class="mptoast-icon" v-if="icon!=2">
      <img v-if="icon==0||icon==1" style="width: 7.4vw;height: 7.4vw;" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/error.png"/>
      <img v-if="icon==-1" style="width: 7.4vw;height: 7.4vw;" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/check2.png"/>
      <img v-if="icon==11||icon==12" style="width: 7.5vw;height: 6.6vw;" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/gantanhao.png"/>
      <img v-if="icon==13" style="width: 5.5vw;height: 6.9vw;" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/wuquanxian.png"/>
    </span>
    <span class="mptoast-context" :class="icon==2?'mptoast-left':''">
      <div class="title">{{title}}</div>
      <div class="text">
        {{text}} <a @click="jumpToRenew" v-if="icon==0||icon==1">绿色通道</a>
        <a @click="jumpToGathering" v-if="icon>10">马上开通</a>
      </div>
    </span>
    <div class="mptoast-again" v-if="icon==2">
      <span @click="tryOutAgain">再试用7天</span>
    </div>
  </view>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['item'],
    data () {
      return {
        animateShow: false,
        showToast: false,
        number: ''
      }
    },
    computed: {
      show () {
        return this.$toastStore.getters.GET_TOAST_SHOW
      },
      title () {
        return this.item.TipsTitle
      },
      text () {
        return this.item.TipsSubTitle
      },
      icon () {
        let icon = this.item.TipsType
        return icon
      },
      textClass () {
        let animation = this.$toastStore.getters.GET_TOAST_ANIMATION
        let animatClass = ''
        if (animation === true) {
          animatClass = 'enterAni'
        } else if (animation === false) {
          animatClass = 'mptoast-keep fadeAni'
        } else {
          animatClass = 'mptoast-keep'
        }
        return animatClass
      },
      iconClass () {
        return this.$toastStore.getters.GET_TOAST_ICON_CLASS_NAME || '__toast_image__'
      }
    },
    methods: {
      jumpToRenew () {
        this.close()
        const url = '/pages/mine/service/renew/main?storeId=' + this.$store.state.storeId + '&userId=' + this.$store.state.userId
        wx.navigateTo({url})
      },
      jumpToGathering () {
        this.close()
        const url = '/pages/mine/gathering/choose/main?storeId=' + this.$store.state.storeId + '&userId=' + this.$store.state.userId
        wx.navigateTo({url})
      },
      tryOutAgain2 () {
        this.item = {
          TipsType: -1,
          TipsSubTitle: '期间部分功能开放',
          TipsTitle: '试用7天开通成功'
        }
        // that.$mptoast('试用7天开通成功', '期间部分功能开放', -1, null, true)
      },
      tryOutAgain () {
        let that = this
        this.$post('/soft/tryOutAgain', {
          Uid: that.$store.state.userId,
          StoreId: that.$store.state.storeId
        }, true).then(res => {
          that.item = {
            TipsType: -1,
            TipsSubTitle: '期间部分功能开放',
            TipsTitle: '试用7天开通成功'
          }
        })
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mptoast {
    width: 95vw;
    padding: 4vw 0 5vw 2vw;
    position: relative;
    z-index: 999;
    // height: 20vw;
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
    .mptoast-left {
      padding-left: 5vw;
    }
    .mptoast-icon {
      width: 11.5vw;
      text-align: center;
      display: inline-block;
      vertical-align: top;
    }
    .mptoast-context {
      display: inline-block;
      width: 80vw;
      .title {
        line-height: 6.8vw;
        font-size: 4.3vw;
        font-weight: 600;
      }
      .text {
        font-size: 3.2vw;
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
    .mptoast-again {
      padding-left: 5vw;
      padding-top: 3vw;
      span {
        display: inline-block;
        width: 31.2vw;
        height: 6.9vw;
        line-height: 6.9vw;
        text-align: center;
        color: #78BC6D;
        font-size: 3.8vw;
        background: white;
        border-radius: 3.5vw;
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
      bottom: -40vw;
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
      bottom: -40vw;
    }
  }
</style>
