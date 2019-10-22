<template>
  <div class="gathering-remark-page">
    <title :name="'收款说明'"></title>
    <scroll-view class="gathering-remark-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="gathering-remark-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="height: 3.1vw"></div>
        <div class="gathering-remark-context">
          <div>
            <div class="remark-title">
              如果您是新用户，建议选择开通【快捷收款】
            </div>
            <div class="remark-context">
              <div>1、瞬间开通：填写您的支付宝帐号即可。</div>
              <div>2、顾客付款后10秒内即到帐，付一笔到一笔。</div>
              <div>3、仅为新用户测试软件使用感受，15天后即关闭。</div>
              <div>4、15天内资金总和不得超3万，超过后即关闭。</div>
              <div>5、我们将垫付交易手续费，即顾客付多少您将收到多少。</div>
            </div>
          </div>
          <div style="padding-top: 9vw">
            <div class="remark-title">
              如您决定长期使用，请尽快开通【银行卡收款】
            </div>
            <div class="remark-context">
              <div>1、资金由银行处理，无后顾之忧。 </div>
              <div>2、需要上传资料审核后开通，该资料将由腾讯与支付宝分别审核。</div>
              <div>3、T+1到帐，即第二个工作日。比如一般情况下，周一的资金周二即可到帐；周五的资金则集合周六周日的资金总合于下周一一起到帐；同理遇节假日顺延至节假日后的第一个工作日。</div>
              <div>4、到帐金额为微信扣除0.38%手续费后的金额，即每100元收取0.38元手续费。</div>
              <div>5、仅顾客付款的金额收取手续费，顾客使用卡内的余额付款时不收取。</div>
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
        state: {},
        titleHeight: null
      }
    },
    methods: {
      getState () {
        let that = this
        this.$post('/merchant/businessGetMerchantsConfigState', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          that.state = res
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .gathering-remark-page {
    height: 100vh;
    background-color: #f0f0f0;
    .gathering-remark-scroll {
      height: 90vh;
      .gathering-remark-main {
        min-height: 80vh;
        .gathering-remark-context {
          background: white;
          padding: 9.6vw 6vw;
          .remark-title {
            color: #181818;
            font-size: 3.6vw;
            font-weight: 600;
            line-height: 5.6vw;
          }
          .remark-context {
            color: #181818;
            font-size: 3.3vw;
            line-height: 5.6vw;
            font-weight: 400;
          }
        }
      }
    }
  }
</style>
