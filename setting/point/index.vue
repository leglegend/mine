<template>
  <div class="point-page">
    <title :name="'积分'"></title>
    <scroll-view class="point-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="point-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="point-state"
             :class="{'state-open':state,'state-close':!state}">
            <span>
              {{state ? '状态：已启用' : '状态：暂停使用'}}
            </span>
          <span>
              <switch :checked="state" @change="switchChange" color="#78BC6D"/>
            </span>
        </div>
        <form @submit="doSave">
          <div class="point-context">
            <div class="context-item">
              <div class="context-title">
                <span></span>积分获得规则：
              </div>
              <div class="context-text">
                每消费 1 元获得
                <span v-if="!isFirstLoad">
                <inputBox :name="'MoneyToIntegralProportion'" :value="point.MoneyToIntegralProportion||''"
                          :request="true"
                          :type="'number'"/>
              </span>
                积分
              </div>
            </div>
            <div class="context-item">
              <div class="context-title">
                <span></span>积分过期规则：
                <text @click="showRemark=true">说明</text>
              </div>
              <div class="select-items">
                <div class="select-item" @click="selectExpired(0)">
                  <img v-if="point.ExpiredSet==0"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.ExpiredSet!=0"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>不过期</span>
                </div>
                <div class="select-item" @click="selectExpired(1)">
                  <img v-if="point.ExpiredSet==1"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.ExpiredSet!=1"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>按月过期</span>
                </div>
                <div class="select-item" @click="selectExpired(2)">
                  <img v-if="point.ExpiredSet==2"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.ExpiredSet!=2"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>按季度过期</span>
                </div>
                <div class="select-item" @click="selectExpired(3)">
                  <img v-if="point.ExpiredSet==3"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.ExpiredSet!=3"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>按半年过期</span>
                </div>
                <div class="select-item" @click="selectExpired(4)">
                  <img v-if="point.ExpiredSet==4"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.ExpiredSet!=4"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>按年过期</span>
                </div>
              </div>
            </div>
            <div class="context-item">
              <div class="context-title">
                <span></span>积分使用规则：
              </div>
              <div class="select-items">
                <div class="select-item" @click="selectUseRule(0)">
                  <img v-if="!point.UseRule"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="point.UseRule"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>不能抵扣付款</span>
                </div>
                <div class="select-item" @click="selectUseRule(1)">
                  <img v-if="point.UseRule"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                  <img v-if="!point.UseRule"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                  <span>可以抵扣付款</span>
                </div>
                <div class="point-use-rule" v-if="point.UseRule&&!isFirstLoad">
                  <div>
                    <span>每 </span>
                    <inputBox :name="'IntegralToMoneyProportion'" :value="point.IntegralToMoneyProportion||''"
                              :type="'number'" :request="true"/>
                    <span> 积分抵1元</span>
                  </div>
                  <div>
                    <span>最少需达到 </span>
                    <inputBox :name="'UseMinIntegral'" :value="point.UseMinIntegral||''" :type="'number'"
                              :request="true"/>
                    <span> 积分才能使用</span>
                  </div>
                  <div>
                    <span>单次使用积分不能多于付款金额 </span>
                    <inputBox :name="'UseMaxProportion'" :value="point.UseMaxProportion||''" :type="'number'"
                              :request="true"/>
                    <span> %</span>
                  </div>
                  <div>
                    <span>单次使用积分最多抵扣 </span>
                    <inputBox :name="'UseMaxMoney'" :value="point.UseMaxMoney||''" :type="'number'" :info="'不限'"/>
                    <span> 元</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="context-item" style="border: 0">
              <div class="context-title" style="padding-bottom: 2.7vw">
                <span></span>积分说明：
              </div>
              <div class="rule-input">
                <textarea v-model="info"/>
              </div>
            </div>
          </div>
          <div class="save-button">
            <button form-type="submit">保存</button>
          </div>
        </form>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showRemark">
      <remark :text="remarkText" @close="showRemark=false"/>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import inputBox from '@/components/inputBox'
  import remark from '@/components/remarkmodel'

  export default {
    components: {
      title, inputBox, remark
    },

    data () {
      return {
        point: {},
        state: false,
        changeData: 0,
        info: '',
        remarkText: '积分使用规则\n每个会员的积分按自然月、季、半年、年批量过期\n例如按年过期：会员在今年3月18日获得5000积分，在10月20日又获得了5000积分，今年总共份获得10000积分，则明年就会提示会员有10000积分在明年的12月30日过期',
        isFirstLoad: true,
        showRemark: false,
        titleHeight: null
      }
    },
    methods: {
      selectExpired (e) {
        this.point.ExpiredSet = e
        this.changeData += 1
      },
      selectUseRule (e) {
        this.point.UseRule = e
        this.changeData += 1
      },
      switchChange () {
        this.state = !this.state
        let that = this
        this.$post('/storeIntegral/businessSetIsOpenIntegral', {
          IsOpenIntegral: this.state
        }, true).then(res => {
          that.$success('修改成功')
        })
      },
      doSave (e) {
        let childrens = this.$children
        let isError = false
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return
        }
        let params = e.mp.detail.value
        params.ExpiredSet = this.point.ExpiredSet
        params.UseRule = this.point.UseRule
        params.IntegralInfo = this.info
        if (params.UseMaxProportion) {
          params.UseMaxProportion = params.UseMaxProportion / 100
        }
        this.$post('/storeIntegral/businessUpdateIntegralSet', params, true).then(res => {
          this.$success('保存成功', true)
        })
      },
      getPoint () {
        this.$post('/storeIntegral/businessGetIntegralSet', {}, true).then(res => {
          if (res.UseMaxProportion) {
            res.UseMaxProportion = res.UseMaxProportion * 100
          }
          this.point = res
          this.info = res.IntegralInfo
          this.state = res.IsOpenIntegral
          this.isFirstLoad = false
        })
      }
    },
    onLoad () {
      this.isFirstLoad = true
      this.info = ''
      this.showRemark = false
      this.getPoint()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .point-page {
    height: 100vh;
    background-color: #f0f0f0;
    .point-scroll {
      height: 90vh;
      .point-main {
        min-height: 80vh;
        background: white;
        .point-state {
          padding: 5vw;
          span {
            display: inline-block;
            &:nth-child(1) {
              width: 75%;
              font-size: 4vw;
            }
            &:nth-child(2) {
              width: 25%;
              text-align: right;
            }
          }
        }
        .state-open {
          background: #ecf6ea;
          color: #78bc6d;
        }
        .state-close {
          background: #f6e3e3;
          color: #ff0000;
        }
        .point-context {
          .context-item {
            padding-top: 5.7vw;
            padding-left: 3.3vw;
            border-bottom: 2vw solid #E9E9E9;
            .context-title {
              line-height: 3.5vw;
              font-size: 3.5vw;
              font-weight: 600;
              span {
                height: 3.5vw;
                display: inline-block;
                vertical-align: top;
                width: 0.7vw;
                margin-right: 1vw;
                border-radius: 0.3vw;
                background: #FC6721;
              }
              text {
                text-decoration: underline;
                color: #D1AC00;
                font-size: 3vw;
              }
            }
            .context-text {
              padding-left: 18.3vw;
              line-height: 3.1vw;
              font-size: 3.1vw;
              padding-top: 3.4vw;
              padding-bottom: 4.8vw;
              .input-class {
                width: 10.6vw;
                text-align: center;
                border-bottom: 0.1vw solid #A0A6AA;
                display: inline-block;
                line-height: 3.1vw;
                position: relative;
                top: 0.5vw;
                input {
                  width: 10.6vw;
                  text-align: center;
                  line-height: 3.1vw;
                }
              }
            }
            .select-items {
              padding-top: 2.8vw;
              padding-bottom: 2.8vw;
              .select-item {
                padding-left: 18.3vw;
                line-height: 4.3vw;
                padding-bottom: 2.1vw;
                img {
                  width: 4.3vw;
                  height: 4.3vw;
                  display: inline-block;
                  vertical-align: top;
                }
                span {
                  padding-left: 1.7vw;
                  font-size: 3.1vw;
                }
              }
              .point-use-rule {
                width: 56.6vw;
                height: 27.3vw;
                border: 1px solid #E9E9E9;
                background: #F3F4F8;
                box-sizing: border-box;
                padding-left: 3.3vw;
                padding-top: 1.2vw;
                border: 1.9vw;
                font-size: 2.8vw;
                color: #7E7E7E;
                position: relative;
                left: 19.7vw;
                div {
                  height: 5vw;
                }
                span {
                  vertical-align: middle;
                  line-height: 2.8vw;
                }
                .input-class {
                  width: 7.6vw;
                  line-height: 3.1vw;
                  display: inline-block;
                  border-bottom: 0.1vw solid #A0A6AA;
                  text-align: center;
                  position: relative;
                  top: -0.4vw;
                  display: inline-block;
                  input {
                    width: 7.6vw;
                    text-align: center;
                    color: #78BC6D;
                    line-height: 3.1vw;
                    height: 3.1vw;
                    display: inline-block;
                    vertical-align: middle;
                  }
                }
              }
            }
            .rule-input {
              width: 65vw;
              height: 27vw;
              border: 1px solid #E9E9E9;
              border-radius: 0.9vw;
              margin-left: 18.3vw;
              padding: 1.7vw 2.6vw;
              textarea {
                font-size: 3vw;
                line-height: 3.5vw;
                color: #898989;
                width: 65vw;
                height: 27vw;
              }
            }
          }
        }
        .save-button {
          padding-top: 14.4vw;
          padding-bottom: 10vw;
          text-align: center;
          button {
            width: 50.8vw;
            line-height: 11.1vw;
            border-radius: 5.5vw;
            background: #FF6700;
            color: white;
            font-size: 4.3vw;
            display: inline-block;
            border: 0;
          }
        }
      }
    }
  }
</style>
