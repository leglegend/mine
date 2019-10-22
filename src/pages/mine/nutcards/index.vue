<template>
  <div class="demo-page nutcards">
    <!--:style="{background:'url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/我的_了解坚果卡包.png)','background-size':'100%,auto'}"-->
    <title :name="'关于坚果卡包'"></title>
    <scroll-view class="demo-scroll nutcards-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="nutcards-context">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/logo2.png"/>
        <div class="version">v{{version}}</div>
        <div class="nutcards-button" @click="jumpToAgreement">
          <span>服务协议</span>
          <span>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
          </span>
        </div>
        <div class="nutcards-button nutcards-button2" @click="jumpToApp">
          <span>软件介绍</span>
          <span>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
          </span>
        </div>
        <div class="nutcards-button nutcards-button2" @click="jumpToHelp">
          <span>使用帮助</span>
          <span>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
          </span>
        </div>
      </div>
      <div class="nutcards-foot">
        <div>010-52905560</div>
        <div>北京领客先行科技有限公司</div>
        <div>Beijing Lingkexianxing Technology Co.Ltd.</div>
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
        titleHeight: null,
        logs: [],
        version: ''
      }
    },
    methods: {
      jumpToAgreement () {
        const url = '../agreement/main'
        wx.navigateTo({url})
      },
      jumpToApp () {
        const url = '../app/main'
        wx.navigateTo({url})
      },
      jumpToHelp () {
        const url = '../help/main'
        wx.navigateTo({url})
      }
    },
    onLoad () {
      this.titleHeight = this.getGlobalData().titleHeight
      this.version = this.getGlobalData().version
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .nutcards {
    background-color: #f0f0f0;
    .nutcards-scroll {
      position: relative;
      .nutcards-context {
        text-align: center;
        padding-top: 9.2vh;
        img {
          width: rpx(174);
          height: rpx(244);
          display: inline-block;
        }
        .nutcards-button {
          margin-top: 8vh;
          line-height: 7vh;
          width: 100vw;
          background-color: white;
          border-top: rpx(1) solid #dddddd;
          border-bottom: rpx(1) solid #dddddd;
          font-size: rpx(28);
          img {
            height: rpx(21);
            width: rpx(13);
          }
          span {
            display: inline-block;
            width: 40vw;
            padding: 0 5vw;
            &:nth-child(1) {
              text-align: left;
            }
            &:nth-child(2) {
              text-align: right;
            }
          }
        }
        .nutcards-button2 {
          margin: 0;
          border-top: 0;
        }
      }
      .nutcards-foot {
        width: 100vw;
        text-align: center;
        position: absolute;
        padding-bottom: 3vh;
        font-size: rpx(22);
        bottom: 0;
        color: #a7a7a7;
        div:nth-child(1) {
          font-size: rpx(34);
          padding-bottom: 1.2vh;
        }
      }
      .version {
        font-size: rpx(22);
        color: #a7a7a7;
      }
    }

  }
</style>
