<template>
  <div class="promotion-send-page">
    <title :name="isShare?'坚果卡包':'转发微信好友'" :noreturn="isShare"></title>
    <div class="bg-top"></div>
    <div class="bg-bottom"></div>
    <scroll-view class="promotion-send-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div style="position: absolute;top: 0;left: 0;background: #ffe58e;width: 100vw;"
           :style="{'min-height':'calc(100vh - '+titleHeight +'px)'}"></div>
      <img class="promotion-send-bg"
           src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-send-bg.png"/>
      <div class="send-logo">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/nutcard_logo.jpg"/>
      </div>
      <div class="promotion-send-main" :style="{'min-height':'calc(100vh - '+titleHeight +'px)'}">
        <div class="send-title">
          <div>微信最新开放</div>
          <div>把会员卡放进顾客的微信卡包内,</div>
          <div>尽显门店档次</div>
          <div class="title-big">会员卡未来新趋势 抢占先机！</div>
        </div>
        <div class="send-middle">
          <div class="middle-img">
            <img/>
          </div>
          <div class="middle-title">
            <div>坚果卡包会员管理系统</div>
            <div>百万店长的选择</div>
          </div>
          <div class="middle-button" @click="!isShare?'':jumpToIndex()">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-send-bt.png"/>
          </div>
        </div>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="send-button" v-if="!isShare">
      <button open-type="share">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-weixin.png"/>
        <div>发给微信好友</div>
      </button>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'

  export default {
    components: {
      title
    },

    data () {
      return {
        code: '',
        storeId: '',
        isShare: false,
        titleHeight: null
      }
    },
    methods: {
      jumpToIndex () {
        const url = '/pages/index/main?userId=' + this.userId + '&path=promotion'
        wx.redirectTo({url})
      }
    },
    onLoad (option) {
      this.isShare = false
      this.userId = option.userId
      this.storeId = option.storeId
      if (option.path === 'promotion') {
        this.isShare = true
      }
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShareAppMessage () {
      let path = '/pages/mine/promotion/send/main?userId=' + this.userId + '&path=promotion'
      let url = this.getGlobalUrl().url
      if (url.indexOf('test') > 0) {
        path += '&type=test'
      } else if (url.indexOf('demo') > 0) {
        path += '&type=demo'
      }
      console.log(path)
      return {
        imageUrl: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/share-img.jpg',
        path: path
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .promotion-send-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .bg-top {
      width: 100vw;
      left: 0;
      top: 0;
      height: 50vh;
      background: #fef5d4;
      position: absolute;
    }
    .bg-bottom {
      width: 100vw;
      left: 0;
      bottom: 0;
      height: 50vh;
      background: #ffe58e;
      position: absolute;
    }
    .promotion-send-scroll {
      height: 90vh;
      position: relative;
      .promotion-send-bg {
        position: absolute;
        width: 100vw;
        left: 0;
        top: 0;
        height: 78.6vw;
      }
      .send-logo {
        position: absolute;
        height: 18vw;
        left: 41vw;
        top: 57.8vw;
        width: 18vw;
        border-radius: 2.8vw;
        background: #FF6801;
        overflow: hidden;
        img {
          height: 18vw;
          width: 18vw;
          display: inline-block;
          vertical-align: top;
          border-radius: 50%;
          transform: scale(1.3, 1.3);
        }
      }
      .promotion-send-main {
        min-height: 80vh;
        position: relative;
        // background: #ffe58e;
        .send-title {
          padding: 13.7vw 0 12.8vw 6.1vw;
          color: #DE691E;
          line-height: 7.7vw;
          font-size: 5.3vw;
          .title-big {
            height: 6vw;
            font-size: 6vw;
            line-height: 6vw;
            padding-top: 4.4vw;
            font-weight: 600;
          }
        }
        .send-middle {
          text-align: center;
          .middle-img {
            padding-bottom: 3.1vw;
            img {
              display: inline-block;
              width: 17.9vw;
              height: 18.1vw;
              border-radius: 2.8vw;
            }
          }
          .middle-title {
            line-height: 6.3vw;
            font-size: 4.5vw;
            color: #4F0E04;
          }
          .middle-button {
            img {
              display: inline-block;
              width: 64vw;
              height: 18.1vw;
            }
          }
        }
      }
    }
    .send-button {
      position: fixed;
      height: 25vw;
      width: 100vw;
      left: 0;
      background: #F4A123;
      text-align: center;
      box-sizing: border-box;
      padding-top: 3.5vw;
      bottom: 0;
      button {
        display: inline-block;
        width: 50vw;
        background: #F4A123;
        height: 21.5vw;
      }
      img {
        display: inline-block;
        vertical-align: top;
        width: 13.9vw;
        height: 13.9vw;
      }
      div {
        padding-top: 0vw;
        height: 3.1vw;
        font-size: 3.3vw;
        color: white;
        position: relative;
        top: -1vw;
      }
    }
  }
</style>
