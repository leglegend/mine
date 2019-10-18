<template>
  <div class="demo-page voice">
    <title :name="'坚果语音'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+getGlobalData().titleHeight +'px)'}">
      <div class="demo-main" style="background-color: white"
           :style="{'min-height':'calc(90vh - '+getGlobalData().titleHeight +'px)'}">
        <div class="demo-context">
          <div class="top">
            <span class="app">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/app.png"/>
            </span>
            <span>
              <div>
                坚果
              </div>
              <div>
                交易语音提醒
              </div>
              <div>
                当顾客消费、充值刷卡时，可自动播放语音进行提醒。
              </div>
            </span>
          </div>
          <div class="middle">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/wave.png"/>
            <div class="button">
              <span @click="showDownload=true">下载安装</span>
            </div>
            <div class="info">
              <div>
                支持IOS和安卓设备
              </div>
              <div>
                团队倾心打造，小巧实用
              </div>
              <div>
                坚果软件的使用商家均可免费安装
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh;background-color: white">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
    </scroll-view>
    <div v-if="showDownload">
      <download @turnOff="showDownload=false"></download>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import download from '@/components/download'

  export default {
    components: {
      title, download
    },

    data () {
      return {
        titleHeight: null,
        showDownload: false
      }
    },
    methods: {},
    onLoad () {
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .voice {
    background-color: white;
    height: 100vh;
    .top {
      padding-left: 9vw;
      padding-top: 3.6vh;
      padding-bottom: 6.2vh;
      background-color: #78bc6d;
      img {
        width: rpx(182);
        height: rpx(182);
      }
      span {
        display: inline-block;
        vertical-align: top;
        &:nth-child(1) {
          padding-top: 1.2vh;
          width: rpx(225);
        }
        &:nth-child(2) {
          width: rpx(420);
        }
      }
      div {
        color: white;
        &:nth-child(1) {
          font-size: rpx(85);
          font-weight: 500;
        }
        &:nth-child(2) {
          font-size: rpx(58);
          font-weight: 500;
          position: relative;
          top: rpx(-5);
        }
        &:nth-child(3) {
          padding-top: rpx(13);
          line-height: rpx(40);
          font-size: rpx(26);
          font-weight: 500;
          position: relative;
          top: rpx(-5);
        }
      }
    }
    .middle {
      text-align: center;
      img {
        width: 100%;
        height: rpx(42);
        position: relative;
        top: rpx(-38)
      }
      .button {
        padding-top: 10vh;
        span {
          display: inline-block;
          width: 34vw;
          height: 10vw;
          line-height: 10vw;
          border-radius: rpx(35);
          font-size: rpx(35);
          color: white;
          background-color: #78bc6d;
        }
      }
      .info {
        div:nth-child(1) {
          padding-top: 4.6vh;
          font-size: rpx(27);
          color: #7e7e7e;
        }
        div:nth-child(2) {
          padding-top: 1vh;
          font-size: rpx(20);
          color: #a7a7a7;
        }
        div:nth-child(3) {
          font-size: rpx(20);
          color: #a7a7a7;
        }
      }
    }
  }
</style>
