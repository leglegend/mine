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
        <div class="data-address" v-if="type=='date'">
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
        type: '',
        name: '',
        value: '',
        beginDate: '',
        endDate: '',
        request: false
      }
    },
    methods: {
      beginDateChange (e) {
        this.beginDate = e.mp.detail.value
      },
      endDateChange (e) {
        this.endDate = e.mp.detail.value
      },
      valueChange (e) {
        if (this.name !== '现价' && (e.mp.detail.value === 0 || e.mp.detail.value === '0')) {
          this.value = ''
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
        if (this.name === '名称' || this.name === '金额' || this.name === '原价') {
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
        } else if (this.name === '活动规则') {
          wx.setStorageSync('data', {
            key: 'rule',
            value: this.value
          })
        }
        wx.navigateBack({
          delta: 1
        })
      }
    },
    onLoad (option) {
      this.type = option.type
      this.name = option.name
      this.value = ''
      this.beginDate = ''
      this.endDate = ''
      if (option.value) {
        this.value = option.value
      } else {
        this.value = ''
      }
      if (option.beginDate) {
        this.beginDate = option.beginDate
      }
      if (option.endDate) {
        this.endDate = option.endDate
      }
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
        .data-title {
          font-size: 3vw;
          color: #bfbfbf;
        }
      }
    }
  }
</style>
