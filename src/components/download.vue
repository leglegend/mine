<template>
  <div class="download-model" :animation="modelAnimation">
    <div class="model-top" @click="turnOff"></div>
    <div class="model-buy" :style="{animation:isOver?'turnOff 200ms':'turnOn 200ms'}">
      <div class="model-close" @click="turnOff">
        <img class="close" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
      </div>
      <div class="molde-success">
        <div class="molde-img">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/qrcodetest.png"/>
        </div>
        <div class="model-text">
          <div>A、复制下载链接后，使用手机浏览器打开即可下载</div>
          <div>B、或者下载此二维码图片</div>
          <div style="padding-left: 5vw">1) 打开微信 "扫一扫"</div>
          <div style="padding-left: 5vw">2) 点击右上角 "相册" 选择此二维码图片</div>
        </div>
        <div class="model-button">
          <span @click="copyUrl">复制下载链接</span>
          <span @click="download" style="margin-left: 10vw">下载二维码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['index', 'length', 'card', 'store', 'uid'],
    data () {
      return {
        isOver: false,
        agree: true,
        modelAnimation: {},
        isSuccess: false,
        second: 3
      }
    },
    methods: {
      download () {
        wx.saveImageToPhotosAlbum({
          filePath: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/qrcodetest.png',
          success: function (res) {
            wx.showToast({
              title: '下载成功'
            })
          }
        })
      },
      copyUrl () {
        wx.setClipboardData({
          data: 'https://www.nutcards.com/nutcards/download.html',
          success: function () {
            wx.showToast({
              title: '复制成功',
              mask: true
            })
          }
        })
      },
      turnOff () {
        this.isOver = true
        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('turnOff')
        }.bind(this), 150)
      }
    },
    mounted () {
      this.isOver = false
      setTimeout(function () {
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

  .download-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1001;
    background-color: rgba(138, 138, 138, 0);
    .model-top {
      width: 100vw;
      height: 35vh;
      position: fixed;
      top: 0;
    }
    .model-buy {
      width: 100vw;
      height: 60vh;
      position: fixed;
      bottom: 0vh;
      background-color: white;
      .model-close {
        padding-left: rpx(25);
        padding-top: rpx(25);
        padding-bottom: rpx(13);
        .close {
          display: inline-block;
          width: rpx(31);
          height: rpx(31);
        }
      }
      .molde-success {
        width: 100vw;
        text-align: center;
        padding-top: 1vh;
        text-align: center;
        .molde-img {
          img {
            width: rpx(315);
            height: rpx(315);
            display: inline-block;
          }
        }
        .model-text {
          text-align: center;
          padding: 2vh 10vw;
          text-align: left;
          font-size: rpx(27);
          color: #7e7e7e;
          div {
            padding: rpx(5) 0;
          }
        }
        .model-button {
          padding-top: 2vh;
          span {
            display: inline-block;
            width: 32vw;
            height: 11vw;
            text-align: center;
            line-height: 11vw;
            background-color: #ff6700;
            color: white;
            border-radius: rpx(40);
            font-size: rpx(30);
          }
        }
      }
    }
    @keyframes turnOn {
      from {
        bottom: -65vh;
      }
      to {
        bottom: 0;
      }
    }
    @keyframes turnOff {
      from {
        bottom: 0;
      }
      to {
        bottom: -65vh;
      }
    }
  }
</style>
