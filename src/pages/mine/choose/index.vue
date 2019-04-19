<template>
  <div class="choose-page">
    <title :name="'收款方式'"></title>
    <scroll-view class="choose-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="choose-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 2vw;background: #f0f0f0"></div>
        <div class="choose-context">
          <div class="choose-item" @click="jumpToIdent">
            <div class="item-context">
              <span>
                <img src="/static/unionpay.png"
                     style="width: 70rpx;height: 44rpx;display: inline-block;vertical-align: middle"/>
              </span>
              <span>
                <div>直接打进银行卡</div>
                <div>推荐使用，需上传资料进行审核</div>
              </span>
              <span v-if="false">
                未开通
              </span>
              <span>
                <img src="/static/already.png" style="width:32rpx;height: 25rpx;display: inline-block"/>
              </span>
              <span>
                <img src="/static/right1.png" style="width:13rpx;height: 31rpx;display: inline-block"/>
              </span>
            </div>
          </div>
          <div class="choose-item" @click="jumpToAlipay">
            <div class="item-context">
              <span>
                <img src="/static/alipaylogo.png"
                     style="width: 63rpx;height: 58rpx;display: inline-block;vertical-align: middle"/>
              </span>
              <span>
                <div>支付宝收款</div>
                <div>临时快速开通；超3万元或使用15天后自动关闭</div>
              </span>
              <span v-if="!account.account">
                未开通
              </span>
              <span v-if="account.account">
                <img src="/static/already.png" style="width:32rpx;height: 25rpx;display: inline-block"/>
              </span>
              <span>
                <img src="/static/right1.png" style="width:13rpx;height: 31rpx;display: inline-block"/>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
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
        account: {},
        titleHeight: null
      }
    },
    methods: {
      jumpToAlipay () {
        const url = '../alipay/main?userId=' + this.userId + '&storeId=' + this.storeId + (this.account ? '&name=' + this.account.name + '&account=' + this.account.account + '&state=' + this.account.state : '')
        wx.navigateTo({url})
      },
      jumpToIdent () {
        const url = '../ident/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      if (option.account) {
        this.account = {
          name: option.name,
          account: option.account,
          state: option.state
        }
        this.alipay = true
      } else {
        this.alipay = false
      }
      console.log(option)
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .choose-page {
    height: 100vh;
    background-color: #f0f0f0;
    .choose-scroll {
      height: 90vh;
      background-color: #f0f0f0;
      .choose-main {
        min-height: 80vh;
        .choose-context {
          height: 73vh;
          width: 100vw;
          background: white;
          .choose-item {
            width: 90vw;
            padding: 4vw 0;
            margin: 0 auto;
            border-bottom: rpx(1) solid #bbbbbb;
            .item-context {
              height: 11vw;
              span {
                display: inline-block;
                height: 11vw;
                line-height: 11vw;
                vertical-align: top;
                &:nth-child(1) {
                  width: 11vw;
                }
                &:nth-child(2) {
                  line-height: 5.5vw;
                  width: 65vw;
                  font-size: 3.7vw;
                  div:nth-child(2) {
                    font-size: 2.8vw;
                    border: rpx(1) solid #e6d0a1;
                    height: 5vw;
                    padding: 0 2vw;
                    color: #e6d0a1;
                    display: inline-block;
                    width: auto;
                    border-radius: rpx(20);
                    position: relative;
                    left: -1vw;
                    top: 0.5vw;
                  }
                }
                &:nth-child(3) {
                  font-size: 2.8vw;
                  width: 10vw;
                  text-align: right;
                  color: red;
                }
                &:nth-child(4) {
                  width: 4vw;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
