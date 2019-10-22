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
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/unionpay.png"
                     style="width: 70rpx;height: 44rpx;display: inline-block;vertical-align: middle"/>
              </span>
              <span>
                <div>【推荐】银行卡收款</div>
                <div>资金由银行处理，收取0.38%费率，T+1到账</div>
              </span>
              <span v-if="!state.IsCertification">
                未开通
              </span>
              <span v-if="state.IsCertification">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/already.png"
                     style="width:32rpx;height: 25rpx;display: inline-block"/>
              </span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right1.png"
                     style="width:13rpx;height: 31rpx;display: inline-block"/>
              </span>
            </div>
          </div>
          <div class="choose-item" style="border:0" @click="jumpToAlipay">
            <div class="item-context">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/alipaylogo.png"
                     style="width: 63rpx;height: 63rpx;display: inline-block;vertical-align: middle"/>
              </span>
              <span>
                <div>【临时】快捷收款</div>
                <div v-if="!state.IsExperience&&state.SoftVersion==0">瞬间开通，15天或超过3万后自动关闭</div>
                <div
                  v-if="!state.IsExperience&&state.SoftVersion">瞬间开通，至{{state.PayPreferentialEndDate}}或超过3万后自动关闭</div>
                <div v-if="state.IsExperience==2">已于{{state.PayPreferentialEndDate}}关闭</div>
                <div v-if="state.IsExperience==1">有效期至{{state.PayPreferentialEndDate}}，请尽快开通银行卡收款</div>
              </span>
              <span v-if="!state.IsExperience">
                未开通
              </span>
              <span v-if="state.IsExperience==2">
                已关闭
              </span>
              <span v-if="state.IsExperience==1">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/already.png"
                     style="width:32rpx;height: 25rpx;display: inline-block"/>
              </span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right1.png"
                     style="width:13rpx;height: 31rpx;display: inline-block"/>
              </span>
            </div>
          </div>
        </div>
        <div class="remark" @click="jumpToRemark">
          关于两种收款方式的详细说明
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
        state: {},
        account: {},
        titleHeight: null
      }
    },
    methods: {
      jumpToAlipay () {
        const url = '../alipay/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToIdent () {
        const url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToRemark () {
        const url = '../remark/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      getState () {
        let that = this
        this.$post('/soft/getSoftServerInfo', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          if (res) {
            that.state = res
          } else {
            that.state = {
              IsExperience: 0,
              IsCertification: 0
            }
          }
          that.isFirstLoad = false
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.isFirstLoad = true
      this.getState()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.isFirstLoad) {
        return
      }
      this.getState()
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
          width: 100vw;
          background: white;
          .choose-item {
            width: 90vw;
            padding: 4vw 0;
            margin: 0 auto;
            border-bottom: rpx(1) solid #bbbbbb;
            background: white;
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
                  font-size: 3.5vw;
                  div:nth-child(2) {
                    font-size: 2.8vw;
                    border: rpx(1) solid #C48F21;
                    height: 5vw;
                    padding: 0 2vw;
                    color: #C48F21;
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
        .remark {
          padding: 6vw 5vw;
          color: #004CA1;
          font-size: 3.1vw;
        }
      }
    }
  }
</style>
