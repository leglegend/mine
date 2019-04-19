<template>
  <div class="toast">
    <div class="toast-context" :class="type" :animation="animation">
      <div class="toast-title">
        <span>
          <img class="image" src="/static/check2.png" v-if="type=='success'"/>
          <img class="image" src="/static/error.png" v-if="type=='error'"/>
        </span>
        <span>
          {{type == 'success' ? checked ? '开启' : '关闭' : ''}}{{type == 'success' ? '成功' : '无法联络 "坚果语音" APP'}}
        </span>
        <span v-if="type=='error'" @click="hideToast">
          <img class="close" src="/static/close.png"/>
        </span>
      </div>
      <div class="toast-info" v-if="type=='error'&&checked">
        <span class="info-context">
          <div>
            <span>1、请先下载语音播报APP，即可拥有交易语音提醒 </span>
            <span style="color:#003d82;" @click="jumpToVoice">去下载</span>
          </div>
          <div>
            <span>2、若已安装，请确认是否开启了 "自动运行" 权限 </span>
            <span style="color:#003d82;" @click="jumpToHelp">帮助</span>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'type', 'checked'],
    data () {
      return {
        animation: {},
        type: ''
      }
    },
    methods: {
      jumpToVoice () {
        const url = '../voice/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToHelp () {
        const url = '../apphelp/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      hideToast () {
        let animation = wx.createAnimation()
        animation.bottom('-16vh').step({duration: 300})
        this.animation = animation.export()
        setTimeout(function () {
          this.$emit('hideToast')
        }.bind(this), 250)
      }
    },
    mounted () {
      setTimeout(function () {
        let animation = wx.createAnimation()
        animation.bottom('1vh').step({duration: 250})
        this.animation = animation.export()
      }.bind(this), 50)
      if (this.type === 'success') {
        setTimeout(function () {
          this.hideToast()
        }.bind(this), 3000)
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .toast {
    position: fixed;
    bottom: 0;
    padding: 1vh 3vw;
    .toast-context {
      border-radius: rpx(25);
      padding-left: 4vw;
      padding-right: 2vw;
      width: 88vw;
      position: fixed;
      bottom: -16vh;
      .toast-title {
        span {
          display: inline-block;
          height: 9vh;
          line-height: 9vh;
          vertical-align: top;
          &:nth-child(1) {
            width: 10vw;
          }
          &:nth-child(2) {
            font-size: rpx(35);
            color: white;
            width: 65vw;
          }
          &:nth-child(3) {
            font-size: rpx(35);
            color: white;
            width: 11vw;
            padding-right: 2vw;
            text-align: right;
            padding-top: 2vh;
            height: 8vh;
          }
        }
        .image {
          display: inline-block;
          width: rpx(56);
          height: rpx(56);
          vertical-align: middle;
        }
        .close {
          display: inline-block;
          width: rpx(22);
          height: rpx(22);
          vertical-align: top;
        }
      }
      .toast-info {
        padding-left: 10vw;
        position: relative;
        top: -2vh;
        .info-context {
          font-size: rpx(23);
          color: white;
          display: inline-block;
          line-height: 3vh;
        }
      }
    }
    .success {
      background-color: #78bc6d;
    }
    .error {
      background-color: #f87272;
    }
  }
</style>
