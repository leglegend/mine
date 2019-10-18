<template>
  <div class="data-page">
    <title :name="name"></title>
    <scroll-view class="data-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="data-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="data-address" v-if="type=='input'">
          <div class="section">
            <input v-model="value"
                   class="picker"
                   focus="true"/>
            <span class="section-area" @click="value=''">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png" style="width: 28rpx;height: 28rpx;display: inline-block"/>
            </span>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <div class="data-address" style="height: auto" v-if="type=='textarea'">
          <div class="section" style="height: auto;padding-top: 2vw">
            <textarea v-model="value"
                      style="height: 36vw;line-height: 7vw"
                      class="picker"
                      focus="true"/>
            <span class="section-area" @click="value=''">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png" style="width: 28rpx;height: 28rpx;display: inline-block"/>
            </span>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <div class="data-address" v-if="type=='number'">
          <div class="section">
            <input v-model="value"
                   @input="valueChange"
                   class="picker"
                   type="number"
                   :placeholder="name=='微信分享限制'?'无限制':'0'"
                   focus="true"/>
            <span class="section-area" @click="value=''">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png" style="width: 28rpx;height: 28rpx;display: inline-block"/>
            </span>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <!--<div class="data-address" v-if="type=='date'">
          <div class="section">
            <picker mode="date" :value="beginDate" @change="beginDateChange" style="text-align: center">
              <div class="picker" style="text-align: center;display: inline-block">{{beginDate ? beginDate : '开始日期'}}
              </div>
            </picker>
          </div>
          <div style="padding: 1vw"></div>
          <div class="section">
            <picker mode="date" :value="endDate" @change="endDateChange" style="text-align: center">
              <div class="picker" style="text-align: center;display: inline-block">{{endDate ? endDate : '结束日期'}}</div>
            </picker>
          </div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>-->
        <div class="select-date" v-if="type=='date'">
          <div class="date-context">
            <div class="switch-button">
              <div>
                <span :style="{color:current==0?'#ffffff':''}" @click="current=0">固定时间</span>
                <span :style="{color:current==1?'#ffffff':''}" @click="current=1">按周期</span>
                <div class="switch-bg" style="left: 0" v-if="current==0"></div>
                <div class="switch-bg" style="right: 0" v-if="current==1"></div>
              </div>
            </div>
            <div class="switch-one" v-if="current==0">
              <span>有效期</span>
              <picker mode="date" :value="beginDate" @change="beginDateChange" style="text-align: center">
                <span class="switch-date">{{beginDate ? beginDate : '开始日期'}}
                </span>
              </picker>
              <span>至</span>
              <picker mode="date" :value="endDate" @change="endDateChange" style="text-align: center">
                <span class="switch-date">{{endDate ? endDate : '结束日期'}}</span>
              </picker>
            </div>
            <div class="switch-one" v-if="current==1">
              <span>有效期</span>
              <picker mode="multiSelector" :range="validityRange" :value="validity"
                      @change="validityChange"
                      :range-key="'name'">
                <span class="switch-date"
                      v-if="validity[0]==0||(validity[0]==1&&validity[1]==0&&validity[2]==0)">永久有效</span>
                <span class="switch-date"
                      v-if="validity[0]!=0&&!(validity[0]==1&&validity[1]==0&&validity[2]==0)">
                    {{validity[0] == 1 ? '' : validityRange[0][validity[0]].name}}
                    {{validity[1] == 0 ? '' : validityRange[1][validity[1]].name}}
                    {{validity[2] == 0 ? '' : validityRange[2][validity[2]].name}}</span>
              </picker>
            </div>
            <div class="switch-remark">
              说明：{{current ? '收到优惠券的时间即为有效开始时间，至周期结束！' : '按设定开始时间即生效，结束时间即失效'}}
            </div>
            <div class="data-button">
              <span @click="doSave">完成</span>
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
        validity: [0, 0, 0],
        validityRange: [],
        type: '',
        name: '',
        value: '',
        beginDate: '',
        endDate: '',
        current: 0,
        request: false,
        changeData: 0
      }
    },
    methods: {
      beginDateChange (e) {
        this.beginDate = e.mp.detail.value
      },
      endDateChange (e) {
        this.endDate = e.mp.detail.value
      },
      validityChange (e) {
        this.validity = e.mp.detail.value
        if (this.validity[0] === 0 && (this.validity[1] !== 0 || this.validity[2] !== 0)) {
          this.validity[0] = 1
          this.changeData += 1
        }
      },
      valueChange (e) {
        if (this.name === '续费(元)' || this.name === '续费(次)' || this.name === '现价') {
          if (e.mp.detail.value && e.mp.detail.value.length > 1 && e.mp.detail.value.substring(0, 1) === '0') {
            this.value = '0'
          }
        } else {
          if (e.mp.detail.value === 0 || e.mp.detail.value === '0') {
            this.value = ''
          }
        }
      },
      checkDate () {
        if (this.beginDate > this.endDate) {
          return false
        } else {
          return true
        }
      },
      doSave () {
        let request = false
        if (this.name === '名称' || this.name === '金额' || this.name === '原价' || this.name === '金额达到') {
          request = true
        }
        if (request && this.value === '') {
          wx.showToast({
            title: '不能为空',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        if ((this.name === '金额' || this.name === '原价') && this.value === '0') {
          wx.showToast({
            title: '不能为0',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        if (this.name === '最低消费') {
          wx.setStorageSync('data', {
            key: 'minConsume',
            value: this.value
          })
        } else if (this.name === '名称') {
          wx.setStorageSync('data', {
            key: 'name',
            value: this.value
          })
        } else if (this.name === '说明') {
          wx.setStorageSync('data', {
            key: 'remark',
            value: this.value
          })
        } else if (this.name === '金额' || this.name === '现价') {
          if (this.value === '' || this.value === null || this.value === undefined) {
            this.value = 0
          }
          wx.setStorageSync('data', {
            key: 'amount',
            value: this.value
          })
        } else if (this.name === '原价') {
          wx.setStorageSync('data', {
            key: 'originalPrice',
            value: this.value
          })
        } else if (this.name === '总发行量') {
          wx.setStorageSync('data', {
            key: 'qty',
            value: this.value
          })
        } else if (this.name === '券有效期' || this.name === '活动截止') {
          if (this.current === 0) {
            if (!this.beginDate || !this.endDate) {
              wx.showToast({
                title: '不能为空',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              return
            }
            if (this.checkDate() === false) {
              wx.showToast({
                title: '日期无效',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              return
            }
            wx.setStorageSync('data', {
              key: 'date',
              value: {
                beginDate: this.beginDate,
                endDate: this.endDate
              }
            })
          } else {
            let value = ''
            if (this.validity[0] === 0 || (this.validity[0] === 1 && this.validity[1] === 0 && this.validity[2] === 0)) {
              value = '0-0-0'
            } else {
              value = (this.validity[0] - 1) + '-' + this.validity[1] + '-' + this.validity[2]
            }
            wx.setStorageSync('data', {
              key: 'rangeDate',
              value: value
            })
          }
        } else if (this.name === '活动规则') {
          wx.setStorageSync('data', {
            key: 'rule',
            value: this.value
          })
        } else if (this.name === '续费(元)') {
          wx.setStorageSync('data', {
            key: 'minAmount',
            value: this.value ? this.value : '0'
          })
        } else if (this.name === '续费(次)') {
          wx.setStorageSync('data', {
            key: 'minTimes',
            value: this.value ? this.value : '0'
          })
        } else if (this.name === '金额达到') {
          wx.setStorageSync('data', {
            key: 'MeetAmountMin',
            value: this.value
          })
        } else if (this.name === '微信分享限制') {
          wx.setStorageSync('data', {
            key: 'ShareRegularCount',
            value: this.value ? this.value : null
          })
        }
        wx.navigateBack({
          delta: 1
        })
      },
      calcRangeDate (rangeDate) {
        let dates = rangeDate.split('-')
        this.validity = [dates[0] * 1 + 1, dates[1] * 1, dates[2] * 1]
        console.log(this.validity)
      }
    },
    onLoad (option) {
      this.type = option.type
      this.name = option.name
      this.value = ''
      this.beginDate = ''
      this.endDate = ''
      this.validity = [0, 0, 0]
      if (option.value) {
        this.value = option.value
      } else {
        this.value = ''
      }
      if (option.beginDate) {
        this.beginDate = option.beginDate
        this.current = 0
      }
      if (option.endDate) {
        this.endDate = option.endDate
        this.current = 0
      }
      if (option.rangeDate) {
        this.current = 1
        if (option.rangeDate !== '0-0-0') {
          this.calcRangeDate(option.rangeDate)
        }
      }
      this.titleHeight = this.getGlobalData().titleHeight
    },
    created () {
      let years = []
      for (var year = -1; year <= 6; year++) {
        years.push({
          name: year === -1 ? '永久有效' : year === 0 ? '' : year + '年',
          value: year
        })
      }
      this.validityRange.push(years)
      let months = []
      for (var month = 0; month <= 11; month++) {
        months.push({
          name: month === 0 ? '' : month + '月',
          value: month
        })
      }
      this.validityRange.push(months)
      let days = []
      for (var day = 0; day <= 29; day++) {
        days.push({
          name: day === 0 ? '' : day + '天',
          value: day
        })
      }
      this.validityRange.push(days)
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .data-page {
    height: 100vh;
    background-color: #f0f0f0;
    .data-scroll {
      height: 90vh;
      .data-main {
        min-height: 80vh;
        .data-upload {
          padding: 5vw;
          .data-img {
            text-align: center;
            padding: 7vw 0 10vw 0;
            img {
              display: inline-block;
              width: rpx(470);
              height: rpx(333);
            }
          }
          .data-button {
            padding: 3vw 5vw;
            text-align: center;
            font-size: 4vw;
            span {
              width: 80vw;
              height: 11vw;
              line-height: 11vw;
              background: #ff6700;
              border-radius: 6vw;
              color: white;
              display: inline-block;
            }
          }
        }
        .data-address {
          padding-top: 3vw;
          .section {
            background: white;
            height: 12vw;
            line-height: 12vw;
            padding: 0 5vw;
            width: 90vw;
            .picker {
              width: 80vw;
              display: inline-block;
              height: 12vw;
              line-height: 12vw;
              vertical-align: top;
              color: #7e7e7e;
              font-size: 4vw;
            }
            .section-area {
              width: 9vw;
              padding-right: 1vw;
              display: inline-block;
              height: 12vw;
              line-height: 12vw;
              vertical-align: top;
              text-align: right;
            }
          }
          .data-button {
            padding: 3vw 5vw;
            text-align: right;
            font-size: 4vw;
            span {
              width: 25vw;
              height: 11vw;
              line-height: 11vw;
              background: #ff6700;
              border-radius: 6vw;
              color: white;
              display: inline-block;
              text-align: center;
            }
          }
        }
        .select-date {
          padding-top: 3vw;
          .date-context {
            padding: 5vw 5vw;
            background: white;
            .switch-one {
              height: 10vw;
              line-height: 10vw;
              border-bottom: rpx(1) solid #bbbbbb;
              font-size: 4vw;
              span {
                display: inline-block;
              }
              picker {
                display: inline-block;
                width: 29vw;
              }
              .switch-date {
                padding-left: 2vw;
                width: 27vw;
                color: #dadada;
                text-align: left;
              }
            }
            .switch-remark {
              font-size: 3vw;
              color: #c48f21;
              padding-top: 3vw;
            }
          }
          .switch-button {
            padding: 5vw;
            text-align: center;
            color: #ff6700;
            font-size: 3.5vw;
            div {
              display: inline-block;
              border-radius: 10vw;
              height: 6.5vw;
              line-height: 6.5vw;
              width: 40vw;
              border: rpx(1) solid #ff6700;
              position: relative;
            }
            span {
              display: inline-block;
              width: 50%;
              position: relative;
              z-index: 2;
            }
            .switch-bg {
              height: 6.5vw;
              width: 21vw;
              border-radius: 10vw;
              background: #ff6700;
              position: absolute;
              z-index: 1;
              top: 0;
            }
          }
          .data-button {
            padding: 7vw 5vw;
            text-align: right;
            font-size: 4vw;
            span {
              width: 25vw;
              height: 11vw;
              line-height: 11vw;
              background: #ff6700;
              border-radius: 6vw;
              color: white;
              display: inline-block;
              text-align: center;
            }
          }
        }
        .data-title {
          font-size: 3vw;
          color: #bfbfbf;
        }
      }
    }
  }
</style>
