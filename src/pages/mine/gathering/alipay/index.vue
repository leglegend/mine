<template>
  <div class="alipay">
    <title :name="'设置收款账户'"></title>
    <scroll-view class="alipay-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="alipay-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="alipay-background">
          <img class="alipay-logo" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/alilogo.png"/>
          <div>收款实时到账</div>
        </div>
        <img class="alipay-img" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/alihome.jpg"/>
        <div class="alipay-form" v-if="!isLoading">
          <form @submit="save">
            <div class="unusual" v-if="state=='0'||state==0">
              <span>打款失败，请检查账户输入是否正确！</span>
            </div>
            <div class="alipay-title">
              <span>请填写收款账号(</span>
              <span @click="showHelp = true">帮助</span>):
            </div>
            <custom :name="'name'"
                    :value="name"
                    :title="'姓名'"
                    :request="true"
                    :type="'input'"
                    :info="'真实姓名'"></custom>
            <custom :name="'account'"
                    :value="account"
                    :title="'账户'"
                    :request="true"
                    :type="'input'"
                    :info="'手机号/邮箱'"></custom>
            <div class="demo-buttons" style="text-align: center;padding-top: 10vw">
              <button formType="submit" class="done" style="width: 33vw">保存</button>
            </div>
          </form>
          <div class="alipay-info" style="display: none">
            <div>此为临时快速通道，填写后即可马上进行收款</div>
            <div>当您的经营流水超过3万或使用时间超过15天后自动关闭</div>
            <div>建议尽快开通打到银行卡的方式</div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showHelp==true">
      <alipay @confirm="showHelp = false"></alipay>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import custom from '@/components/custom'
  import alipay from '@/components/alipayhelp'

  export default {
    components: {
      title, custom, alipay
    },

    data () {
      return {
        logs: [],
        titleHeight: null,
        name: '',
        account: '',
        showHelp: false,
        isLoading: true,
        state: ''
      }
    },
    methods: {
      save (e) {
        let values = e.mp.detail.value
        let that = this
        let childrens = this.$children
        let isError = false
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return false
        }
        this.$post('/store/businessSetStorePayAccount', {
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          AccountType: 2,
          AccountName: values.name,
          AccountId: values.account
        }).then(res => {
          that.$success('设置成功', true)
        })
      },
      getAccount () {
        let that = this
        this.$post('/store/businessGetStorePayAccount', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          if (res) {
            that.name = res.AccountName
            that.account = res.AccountId
            that.state = res.State
          }
          that.isLoading = false
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.name = ''
      this.account = ''
      this.state = option.state
      this.isLoading = true
      this.showHelp = false
      this.getAccount()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .alipay {
    height: 100vh;
    background-color: #f0f0f0;
    .alipay-scroll {
      height: 90vh;
      .alipay-main {
        min-height: 80vh;
        background-color: white;
        .alipay-background {
          width: 100vw;
          height: 36.9vw;
          padding-top: 7vw;
          box-sizing: border-box;
          text-align: center;
          color: white;
          font-size: 7.5vw;
          position: relative;
          z-index: 2;
          .alipay-logo {
            width: 34.2vw;
            height: 11.1vw;
            display: inline-block;
          }
        }
        .alipay-img {
          width: 100vw;
          height: 36.9vw;
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
        .alipay-form {
          padding: 5vw;
          height: 47vh;
          background: white;
          .unusual {
            text-align: center;
            font-size: 3.3vw;
            color: red;
            span {
              display: inline-block;
              width: 70vw;
              height: 8vw;
              line-height: 8vw;
              background-color: #f7e3e4;
              border-radius: rpx(30);
            }
          }
          .alipay-title {
            color: #939393;
            font-size: 3.5vw;
            padding-top: 5vw;
            padding-bottom: 3vw;
            span:nth-child(2) {
              color: #003d82;
            }
          }
          .alipay-info {
            padding: 3.5vw;
            margin-top: 5vw;
            background-color: #ffedad;
            font-size: 3.3vw;
            line-height: 6vw;
            border-radius: 1.5vw;
            color: #c48f21;
          }
        }
      }
    }
  }
</style>
