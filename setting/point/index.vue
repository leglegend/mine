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
          <div class="point-context" v-if="!isFirstLoad">
            <div class="context-title">
              积分获得规则
            </div>
            <div class="context-item">
              <inputBox :title="'每消费一元获得'"
                        :name="'MoneyToIntegralProportion'" :value="point.MoneyToIntegralProportion||''"
                        :request="true"
                        :type="'number'"
                        :unit="'积分'"
                        :back="true"
                        @save="doSaveItem"/>
            </div>
            <div class="context-item">
              <div class="input-class">
                <picker :range="expiredRange" :value="point.ExpiredSet" @change="selectExpired">
                  <span class="input-title">积分过期规则</span>
                  <span class="input-value">{{expiredRange[point.ExpiredSet]}}</span>
                  <span class="input-unit"></span>
                </picker>
              </div>
            </div>
            <div class="context-item">
              <div class="input-class">
                <picker :range="useRange" :value="point.UseRule" @change="selectUseRule">
                  <span class="input-title">积分抵扣付款</span>
                  <span class="input-value">{{useRange[point.UseRule]}}</span>
                  <span class="input-unit"></span>
                </picker>
              </div>
            </div>
            <div class="context-item" @click="openRemark">
              <div class="input-class">
                <span class="input-title">会员积分说明</span>
                <span class="input-value"></span>
                <span class="input-unit">
                  <img v-if="remark" class="have-remark"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/have-remark.png"/>
                  <img
                    src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </div>
            </div>
            <div v-if="useRule&&!isFirstLoad">
              <div class="context-title">
                积分抵扣规则
              </div>
              <div class="context-item">
                <inputBox :title="'消费抵扣一元需要'"
                          :name="'IntegralToMoneyProportion'" :value="point.IntegralToMoneyProportion||''"
                          :request="true"
                          :type="'number'"
                          :unit="'积分'"
                          :back="true"
                          @save="doSaveItem"/>
              </div>
              <div class="context-item">
                <inputBox :title="'每次抵扣最少需要'"
                          :name="'UseMinIntegral'" :value="point.UseMinIntegral||''"
                          :request="true"
                          :type="'number'"
                          :unit="'积分'"
                          :back="true"
                          @save="doSaveItem"/>
              </div>
              <div class="context-item">
                <inputBox :title="'每比最多抵扣'"
                          :name="'UseMaxMoney'" :value="point.UseMaxMoney||''"
                          :type="'number'"
                          :unit="'元'"
                          :back="true"
                          @save="doSaveItem"/>
              </div>
              <div class="context-item">
                <inputBox :title="'每比抵扣比例最多'"
                          :name="'UseMaxProportion'" :value="point.UseMaxProportion||''"
                          :type="'number'"
                          :unit="'%'"
                          :back="true"
                          @save="doSaveItem"/>
              </div>
            </div>
            <div class="context-item" style="border: 0;display: none">
              <div class="context-title" style="padding-bottom: 2.7vw">
                <span></span>积分说明：
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="remark-dialog" v-if="showRemark" @click="showRemark=false">
      <div class="remark-demo"></div>
      <div class="remark-model-point" @click.stop="">
        <div class="rule-input">
          <textarea v-model="info"/>
        </div>
        <div class="remark-buttons">
          <span @click="doSaveRemark">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import inputBox from '@/components/inputBox'

  export default {
    components: {
      title, inputBox
    },

    data () {
      return {
        point: {},
        state: false,
        changeData: 0,
        useRule: 0,
        expiredRange: ['不过期', '按月过期', '按季度过期', '按半年过期', '按年过期'],
        useRange: ['不能抵扣付款', '可以抵扣付款'],
        info: '',
        remark: '',
        remarkText: '积分使用规则\n每个会员的积分按自然月、季、半年、年批量过期\n例如按年过期：会员在今年3月18日获得5000积分，在10月20日又获得了5000积分，今年总共份获得10000积分，则明年就会提示会员有10000积分在明年的12月30日过期',
        isFirstLoad: true,
        showRemark: false,
        titleHeight: null
      }
    },
    methods: {
      selectExpired (e) {
        this.point.ExpiredSet = e.mp.detail.value
        this.changeData += 1
        this.doSaveItem('ExpiredSet', e.mp.detail.value)
      },
      selectUseRule (e) {
        this.point.UseRule = e.mp.detail.value
        this.useRule = e.mp.detail.value * 1
        this.changeData += 1
        this.doSaveItem('UseRule', e.mp.detail.value)
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
      openRemark () {
        this.info = (this.remark || '') + ''
        this.showRemark = true
      },
      doSaveRemark () {
        this.remark = this.info + ''
        this.showRemark = false
        this.doSaveItem('IntegralInfo', this.remark)
      },
      doSaveItem (key, value) {
        this.point[key] = value
        this.point[key] = value
        let params = {}
        for (let key in this.point) {
          params[key] = this.point[key]
        }
        if (params['UseMaxProportion']) {
          params['UseMaxProportion'] = params['UseMaxProportion'] * 1 / 100
        }
        this.$post('/storeIntegral/businessUpdateIntegralSet', params).then(res => {
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
        params.IntegralInfo = this.remark
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
          this.useRule = res.UseRule
          this.remark = res.IntegralInfo
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
          .context-title {
            line-height: 11.9vw;
            font-size: 3.3vw;
            font-weight: 500;
            background: #F0F0F0;
            padding-left: 6.1vw;
          }
          .context-item {
            padding: 0 5.8vw;
            background: white;
            .input-class {
              width: 88.4vw;
              border-bottom: 0.1vw solid #E9E9E9;
              display: inline-block;
              line-height: 13.7vw;
              picker {
                display: inline-block;
              }
              .input-title {
                width: 38.4vw;
                display: inline-block;
                line-height: 13.7vw;
                vertical-align: top;
              }
              .input-unit {
                width: 10vw;
                display: inline-block;
                line-height: 13.7vw;
                vertical-align: top;
                text-align: right;
                img {
                  display: inline-block;
                  height: rpx(21);
                  width: rpx(13);
                  vertical-align: middle;
                  position: relative;
                  top: rpx(-1);
                }
                .have-remark {
                  vertical-align: middle;
                  position: relative;
                  width: 4.6vw;
                  height: 3.2vw;
                  right: 3.4vw;
                }
              }
              .input-value {
                width: 40vw;
                text-align: center;
                line-height: 13.7vw;
                display: inline-block;
                vertical-align: top;
                color: #C6C6C6;
              }
              input {
                width: 40vw;
                text-align: center;
                line-height: 13.7vw;
                height: 13.7vw;
                display: inline-block;
                vertical-align: top;
                color: #C6C6C6;
              }
              .input-request {
                display: inline-block;
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
    .remark-dialog {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      z-index: 3000;
      background-color: rgba(0, 0, 0, 0.35);
      text-align: center;
      .remark-demo {
        height: 100vh;
        width: 0;
        display: inline-block;
        vertical-align: middle;
      }
      .remark-model-point {
        width: 80vw;
        padding: 8vw 5vw;
        height: 85vw;
        border-radius: 2vw;
        background: white;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        .rule-input {
          width: 80vw;
          height: 60vw;
          border: 1px solid #E9E9E9;
          border-radius: 0.9vw;
          padding: 1.7vw 2.6vw;
          box-sizing: border-box;
          textarea {
            font-size: 3.5vw;
            line-height: 4vw;
            color: #898989;
            width: 74vw;
            height: 56vw;
          }
        }
        .remark-buttons {
          padding-top: 7vw;
          text-align: center;
          span {
            box-sizing: border-box;
            display: inline-block;
            width: 35%;
            border: rpx(1) solid #ff6700;
            background: #ff6700;
            border-radius: 6vw;
            font-size: 4.5vw;
            height: 11vw;
            line-height: 11vw;
            color: white;
            text-align: center;
          }
        }
      }
    }
  }
</style>
