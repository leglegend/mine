<template>
  <div class="time-page">
    <title :name="'营业时间'"></title>
    <scroll-view class="time-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="time-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="time-context">
          <form @submit="doSave">
            <div class="form-data">
              <div class="date-select">
                <span class="select-title">
                  营业时间:
                </span>
                <span class="select-items">
                  <span class="select-item" :class="item.isChecked?'select-item-checked':''" v-for="item in weeks"
                        :key="index" @click="selectWeek(item)">
                    <div>{{item.name}}</div>
                  </span>
                  <div class="time-items">
                    <div class="time-item" v-for="item in times" :key="index">
                      <span class="time-box">
                        <picker @change="timeChange($event,item)" mode="multiSelector" :value="item.timeIndex"
                                :range="timesRange" range-key="value">
                          <span>
                            {{item.BeginTime}}
                          </span>
                          &nbsp;&nbsp;至&nbsp;&nbsp;
                          <span>
                            {{item.EndTime}}
                          </span>
                        </picker>
                      </span>
                      <span class="free-close" @click="deleteTime(index)">
                        <img src="/static/del-button.png"/>
                      </span>
                    </div>
                    <div class="add-button" @click="addTime">
                      <span>
                        <img src="/static/add-button.png"/>
                      </span>
                      <span>添加营业时间段</span>
                    </div>
                    <div class="free-remark">
                      * 非营业时间段内不开放顾客预约
                    </div>
                  </div>
                </span>
              </div>
              <div class="free-select">
                <span class="select-title">
                  节日放假:
                </span>
                <span class="free-items">
                  <div class="free-item" v-for="item in frees" :key="index">
                    <span class="time-box">
                      <picker @change="dateChange($event,item)" mode="multiSelector" :value="item.dateIndex"
                              :range="selectRange" range-key="value">
                        <span>
                          {{(item.beginIndex[1] + 1 ) + '-' + (item.beginIndex[2] + 1) + ' ' + (item.beginIndex[3] + 1) + ':00'}}
                        </span>
                        &nbsp;&nbsp;至&nbsp;&nbsp;
                        <span>
                          {{(item.endIndex[1] + 1 ) + '-' + (item.endIndex[2] + 1) + ' ' + (item.endIndex[3] + 1) + ':00'}}
                        </span>
                      </picker>
                    </span>
                    <span class="free-close" @click="deleteDate(index)">
                      <img src="/static/del-button.png"/>
                    </span>
                  </div>
                  <div class="add-button" @click="addDate">
                    <span>
                      <img src="/static/add-button.png"/>
                    </span>
                    <span>添加请假时间段</span>
                  </div>
                  <div class="free-remark">
                    * 请假时间段内不开放顾客预约
                  </div>
                </span>
              </div>
              <div class="save-button">
                <button form-type="submit">保存</button>
              </div>
            </div>
          </form>
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
  import {formatDateTime, formatNumber} from '@/utils/index.js'

  export default {
    components: {
      title
    },

    data () {
      return {
        info: {},
        store: {},
        items: [],
        weeks: [],
        times: [],
        frees: [],
        selectRange: [],
        timesRange: [],
        changeDate: 0,
        isLoading: true,
        titleHeight: null
      }
    },
    methods: {
      selectWeek (item) {
        item.isChecked = !item.isChecked
        this.changeData += 1
      },
      dateChange (e, item) {
        let value = e.mp.detail.value
        let beginIndex = [value[0] > 11 ? 1 : 0, value[0] > 11 ? value[0] - 12 : value[0], value[1], value[2]]
        let beginDate = this.convertIndexToDate(beginIndex)
        let endIndex = [value[4] > 11 ? 1 : 0, value[4] > 11 ? value[4] - 12 : value[4], value[5], value[6]]
        let endDate = this.convertIndexToDate(endIndex)
        if (endDate < beginDate) {
          wx.showToast({
            title: '起止时间错误',
            image: '/static/warn.png'
          })
          return
        }
        item.beginIndex = beginIndex
        item.BeginDate = beginDate
        item.endIndex = endIndex
        item.EndDate = endDate
        item.dateIndex = value
        this.changeData += 1
      },
      timeChange (e, item) {
        let value = e.mp.detail.value
        let beginTime = (value[0] > 9 ? value[0] : '0' + value[0]) + ':' + (value[1] > 9 ? value[1] : '0' + value[1])
        let endTime = (value[3] > 9 ? value[3] : '0' + value[3]) + ':' + (value[4] > 9 ? value[4] : '0' + value[4])
        if (endTime < beginTime) {
          wx.showToast({
            title: '起止时间错误',
            image: '/static/warn.png'
          })
          return
        }
        item.BeginTime = beginTime
        item.EndTime = endTime
        item.timeIndex = value
        this.changeData += 1
      },
      addDate () {
        let beginDate = new Date()
        beginDate.setDate(beginDate.getDate() + 1)
        beginDate.setHours(1)
        let endDate = new Date()
        endDate.setDate(endDate.getDate() + 2)
        endDate.setHours(23)
        let beginIndex = this.convertDateToIndex(formatDateTime(beginDate))
        let endIndex = this.convertDateToIndex(formatDateTime(endDate))
        this.frees.push({
          BeginDate: formatDateTime(beginDate),
          beginIndex: beginIndex,
          EndDate: formatDateTime(endDate),
          endIndex: endIndex,
          dateIndex: [this.convertYearMonth(formatDateTime(beginDate)), beginIndex[2], beginIndex[3], 0, this.convertYearMonth(formatDateTime(endDate)), endIndex[2], endIndex[3]]
        })
      },
      addTime () {
        this.times.push({
          BeginTime: '09:00',
          EndTime: '17:30',
          timeIndex: this.convertTimeToIndex('09:00', '17:30')
        })
      },
      deleteDate (index) {
        let frees = []
        for (let i = 0; i < this.frees.length; i++) {
          if (i !== index) {
            frees.push(this.frees[i])
          }
        }
        this.frees = frees
      },
      deleteTime (index) {
        let times = []
        for (let i = 0; i < this.times.length; i++) {
          if (i !== index) {
            times.push(this.times[i])
          }
        }
        this.times = times
      },
      convertIndexToDate (value) {
        let year = value[0] ? new Date().getFullYear() + 1 : new Date().getFullYear()
        let date = [year, value[1] + 1 > 9 ? value[1] + 1 : '0' + (value[1] + 1), value[2] + 1 > 9 ? value[2] + 1 : '0' + (value[2] + 1)].map(formatNumber).join('-')
        let time = [value[3] + 1 > 9 ? value[3] + 1 : '0' + (value[3] + 1), '00'].map(formatNumber).join(':')
        return `${date} ${time}`
      },
      convertDateToIndex (date) {
        let dates = date.split(' ')[0].split('-')
        let time = date.split(' ')[1].split(':')[0]
        let year = dates[0] * 1 === new Date().getFullYear() ? 0 : 1
        return [year, dates[1] * 1 - 1, dates[2] * 1 - 1, time * 1 - 1]
      },
      convertYearMonth (date) {
        let dates = date.split('-')
        for (let i = 0; i < 24; i++) {
          if (dates[0] + '-' + dates[1] === this.selectRange[0][i].key) {
            return i
          }
        }
      },
      convertTimeToIndex (beginTime, endTime) {
        let beginIndex = beginTime.split(':')
        let endIndex = endTime.split(':')
        return [beginIndex[0] * 1, beginIndex[1] * 1, 0, endIndex[0] * 1, endIndex[1] * 1]
      },
      cleanData () {
        this.isLoading = true
        this.weeks = []
        for (let i = 1; i <= 7; i++) {
          let week = '周'
          switch (i) {
            case 1:
              week += '一'
              break
            case 2:
              week += '二'
              break
            case 3:
              week += '三'
              break
            case 4:
              week += '四'
              break
            case 5:
              week += '五'
              break
            case 6:
              week += '六'
              break
            case 7:
              week += '日'
              break
          }
          this.weeks.push({
            value: i,
            name: week,
            isChecked: i <= 5
          })
        }
        let years = [{
          key: new Date().getFullYear() + '',
          value: new Date().getFullYear() + '年'
        }, {
          key: new Date().getFullYear() + 1 + '',
          value: new Date().getFullYear() + 1 + '年'
        }]
        let months = []
        for (let i = 1; i <= 12; i++) {
          months.push({
            key: years[0].key + '-' + (i < 10 ? '0' + i : i + ''),
            value: i + '月'
          })
        }
        for (let i = 1; i <= 12; i++) {
          months.push({
            key: years[1].key + '-' + (i < 10 ? '0' + i : i + ''),
            value: i === 1 ? years[1].key + '年' : i + '月'
          })
        }
        let days = []
        for (let i = 1; i <= 31; i++) {
          days.push({
            key: i < 10 ? '0' + i : i + '',
            value: i + '日'
          })
        }
        let hours = []
        for (let i = 1; i <= 24; i++) {
          hours.push({
            key: i < 10 ? '0' + i : i + '',
            value: i + '时'
          })
        }
        this.selectRange = [months, days, hours, [{value: '至'}], months, days, hours]
        let timesHours = []
        for (let i = 0; i < 24; i++) {
          timesHours.push({
            key: i < 10 ? '0' + i : i + '',
            value: i + '时'
          })
        }
        let timesMinutes = []
        for (let i = 0; i < 60; i++) {
          timesMinutes.push({
            key: i < 10 ? '0' + i : i + '',
            value: i + '分'
          })
        }
        this.timesRange = [timesHours, timesMinutes, [{value: '至'}], timesHours, timesMinutes]
      },
      getInfo () {
        let that = this
        this.$post('/store/getOperateInfo', {
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.info = res
          for (let item of res.StoreOperateWeeks) {
            for (let week of that.weeks) {
              if (item.WeekInfo === week.value) {
                week.isChecked = item.State
              }
            }
          }
          for (let item of res.StoreVacations) {
            item.beginIndex = this.convertDateToIndex(item.BeginDate)
            item.endIndex = this.convertDateToIndex(item.EndDate)
            item.dateIndex = [this.convertYearMonth(item.BeginDate), item.beginIndex[2], item.beginIndex[3], 0, this.convertYearMonth(item.EndDate), item.endIndex[2], item.endIndex[3]]
          }
          that.frees = res.StoreVacations
          for (let item of res.StoreOperateTimes) {
            item.timeIndex = this.convertTimeToIndex(item.BeginTime, item.EndTime)
          }
          that.times = res.StoreOperateTimes
          that.isLoading = false
        })
      },
      doSave () {
        let weeks = []
        for (let item of this.weeks) {
          if (item.isChecked) {
            weeks.push(item.value)
          }
        }
        this.$post('/store/setOperateInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          StoreOperateWeeks: weeks,
          StoreVacations: this.frees,
          StoreOperateTimes: this.times
        }, true).then(res => {
          this.$success('修改成功', true)
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.cleanData()
      this.getInfo()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .time-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .time-scroll {
      height: 90vh;
      .time-main {
        min-height: 80vh;
        .time-context {
          width: 100vw;
          span {
            display: inline-block;
            vertical-align: top;
          }
          .form-data {
            padding: 0 5.4vw;
            .input-title {
              padding-top: 4.1vw;
              padding-bottom: 2.9vw;
              height: 3.1vw;
              line-height: 3.1vw;
              color: black;
              font-size: 3.3vw;
            }
            .input-box {
              .input-class {
                width: 100%;
                height: 7.6vw;
                line-height: 7.6vw;
                font-size: 3.7vw;
                border-bottom: 0.1vw solid #E9E9E9;
                input {
                  display: inline-block;
                  height: 7.6vw;
                  line-height: 7.6vw;
                  width: 100%;
                }
              }
            }
            .date-select {
              padding-top: 5.3vw;
              padding-bottom: 4vw;
              border-bottom: 0.1vw solid #E9E9E9;
              .select-title {
                height: 6.8vw;
                line-height: 6.8vw;
                color: black;
                font-size: 3.3vw;
                padding: 1.3vw 0;
                width: 16.5vw;
              }
              .select-items {
                width: 70vw;
                .select-item {
                  height: 6.8vw;
                  line-height: 6.8vw;
                  padding: 1.3vw 1.5vw;
                  div {
                    height: 6.8vw;
                    line-height: 6.8vw;
                    width: 13.6vw;
                    text-align: center;
                    border: 1px solid #78BC6D;
                    border-radius: 1.5vw;
                    color: #78BC6D;
                    font-size: 3.1vw;
                  }
                }
                .select-item-checked {
                  div {
                    background: #78BC6D;
                    color: white;
                  }
                }
                .time-items {
                  padding-left: 1.5vw;
                  padding-top: 1.3vw;
                  .time-item {
                    height: 7.4vw;
                    line-height: 7.4vw;
                    padding-bottom: 2vw;
                    .time-box {
                      height: 7.4vw;
                      line-height: 7.4vw;
                      width: 40vw;
                      border: 1px solid rgba(217, 217, 217, 1);
                      border-radius: 1.5vw;
                      color: #898989;
                      font-size: 3.9vw;
                      text-align: center;
                      font-weight: 600;
                    }
                    .free-close {
                      color: #FC493A;
                      font-size: 3vw;
                      height: 1.9vw;
                      padding: 2.7vw 2.3vw;
                      img {
                        width: 1.9vw;
                        height: 1.9vw;
                        display: inline-block;
                        vertical-align: top;
                      }
                    }
                  }
                  .add-button {
                    height: 4.4vw;
                    line-height: 4.4vw;
                    padding-top: 1.5vw;
                    padding-bottom: 2.5vw;
                    span {
                      &:nth-child(1) {
                        height: 4.4vw;
                        width: 4.4vw;
                      }
                      &:nth-child(2) {
                        padding-left: 1.3vw;
                        color: #898989;
                        font-size: 3.1vw;
                      }
                    }
                    img {
                      width: 4.4vw;
                      height: 4.4vw;
                      display: inline-block;
                      vertical-align: top;
                    }
                  }
                  .free-remark {
                    color: #D1AC00;
                    font-size: 2.6vw;
                  }
                }
              }
            }
            .free-select {
              padding-top: 6vw;
              border-bottom: 0.1vw solid #E9E9E9;
              .select-title {
                height: 7.4vw;
                line-height: 7.4vw;
                width: 18vw;
                color: black;
                font-size: 3.3vw;
              }
              .free-items {
                width: 70vw;
                .free-item {
                  height: 7.4vw;
                  line-height: 7.4vw;
                  padding-bottom: 2vw;
                  .time-box {
                    height: 7.4vw;
                    line-height: 7.4vw;
                    width: 61.6vw;
                    border: 1px solid rgba(217, 217, 217, 1);
                    border-radius: 1.5vw;
                    color: #898989;
                    font-size: 3.9vw;
                    text-align: center;
                    font-weight: 600;
                  }
                  .free-close {
                    color: #FC493A;
                    font-size: 3vw;
                    height: 1.9vw;
                    padding: 2.7vw 2.3vw;
                    img {
                      width: 1.9vw;
                      height: 1.9vw;
                      display: inline-block;
                      vertical-align: top;
                    }
                  }
                }
                .add-button {
                  height: 4.4vw;
                  line-height: 4.4vw;
                  padding-top: 1.5vw;
                  padding-bottom: 2.5vw;
                  span {
                    &:nth-child(1) {
                      height: 4.4vw;
                      width: 4.4vw;
                    }
                    &:nth-child(2) {
                      padding-left: 1.3vw;
                      color: #898989;
                      font-size: 3.1vw;
                    }
                  }
                  img {
                    width: 4.4vw;
                    height: 4.4vw;
                    display: inline-block;
                    vertical-align: top;
                  }
                }
                .free-remark {
                  padding-bottom: 5.5vw;
                  color: #D1AC00;
                  font-size: 2.6vw;
                }
              }
            }
            .save-button {
              padding-top: 20vw;
              text-align: center;
              padding-bottom: 5.3vw;
              button {
                width: 48.8vw;
                height: 11vw;
                line-height: 11vw;
                border: 1px solid #FF6700;
                color: white;
                font-size: 4.3vw;
                background: #FF6700;
                border-radius: 5.5vw;
              }
            }
            .delete-button {
              padding-top: 0;
              padding-bottom: 15vw;
              button {
                background: #FFF4ED;
                color: #FF6F03;
              }
            }
            .items-select {
              padding-top: 7.7vw;
              .items-title {
                color: black;
                font-size: 3.3vw;
                width: 10.4vw;
              }
              .items-list {
                padding-top: 1.2vw;
                .item-title {
                  height: 3vw;
                  line-height: 3vw;
                  padding-top: 5.2vw;
                  padding-bottom: 2.5vw;
                  font-size: 3.1vw;
                }
                .item-context {
                  width: 45.7vw;
                  height: 6.9vw;
                  line-height: 6.9vw;
                  box-sizing: border-box;
                  padding-left: 3vw;
                  border-radius: 0.9vw;
                  background: #F0F0F0;
                  color: #A0A6AA;
                  font-size: 3.7vw;
                  .input-class {
                    display: inline-block;
                    width: 100%;
                    height: 6.9vw;
                    line-height: 6.9vw;
                    input {
                      height: 6.9vw;
                      line-height: 6.9vw;
                      width: 100%;
                      display: inline-block;
                    }
                  }
                }
                .item-switch {
                  padding-left: 6.9vw;
                  height: 6.9vw;
                  line-height: 6.9vw;
                  width: 20vw;
                  position: relative;
                  top: -0.5vw;
                  switch {
                    zoom: 0.8;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
