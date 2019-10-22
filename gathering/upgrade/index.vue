<template>
  <div class="gathering-upgrade-page">
    <title :noline="true" :service="true" :background="'rgba(240, 240, 240, 0)'"></title>
    <scroll-view class="gathering-upgrade-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="gathering-upgrade-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="gathering-upgrade-context">
          <div class="upgrade-title">
            个人升级为个体/企业
          </div>
          <div class="upgrade-context">
            <div class="context-code">

            </div>
            <div class="download-button">
              <span>下载</span>
            </div>
            <div class="context-text">
              <div>1、请下载此码到您的手机相册</div>
              <div>2、打开微信，点击右上角加号选“扫一扫“ </div>
              <div>3、再选右上角相册、选择相册内此二维码</div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
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
        logs: [],
        titleHeight: null
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

  .gathering-upgrade-page {
    height: 100vh;
    background-color: #009B69;
    .gathering-upgrade-scroll {
      height: 90vh;
      .gathering-upgrade-main {
        min-height: 80vh;
        .gathering-upgrade-context {
          text-align: center;
          padding-top: 20vw;
          .upgrade-title {
            padding-bottom: 10vw;
            height: 8.6vw;
            line-height: 8.6vw;
            font-size: 9vw;
            color: rgba(255, 255, 255, 1);
          }
          .upgrade-context {
            display: inline-block;
            width: 78.1vw;
            height: 95vw;
            background: rgba(228, 240, 194, 1);
            border-radius: 0.9vw;
            box-sizing: border-box;
            padding: 9.7vw 5.1vw 8.4vw 5.1vw;
            .context-code {
              width: 37.9vw;
              height: 38.1vw;
            }
            .download-button {
              padding-top: 6.4vw;
              padding-bottom: 9vw;
              span {
                width: 36.9vw;
                height: 8.7vw;
                line-height: 8.7vw;
                background: rgba(63, 189, 87, 1);
                border-radius: 4.4vw;
                font-size: 4.4vw;
                color: rgba(228, 240, 194, 1);
              }
            }
            .context-text {
              text-align: left;
              color: #000000;
              line-height: 5.6vw;
            }
          }
        }
      }
    }
  }
</style>
