<template>
  <div class="report">
    <div v-show="auth">
      <div class="report-top" :style="{height:'calc(80rpx + ' +(statusBarHeight+36)+'px)'}">
        <div class="report-title" :style="{'padding-top':statusBarHeight +'px'}">
          运营报表
        </div>
        <div class="menu">
          <span class="day" v-bind:class="{'select':current==0}" @click="current=0">日报</span>
          <span class="month" v-bind:class="{'select':current==1}" @click="current=1">月报</span>
        </div>
      </div>
      <swiper class="swiper" v-bind:current="current" @change="change"
              :style="{height:'calc(100vh - 80rpx - ' +(statusBarHeight+36)+'px)'}">
        <swiper-item>
          <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                       :style="{height:'calc(100vh - 80rpx - ' +(statusBarHeight+36)+'px)'}">
            <div :style="{'min-height':'calc(90vh - 80rpx - ' +(statusBarHeight+36)+'px)'}">
              <div v-if="items.length>0&&current==0">
                <div v-for="(item,index) in items" style="background-color: white">
                  <div v-if="index!=0" class="block">{{item.report.year}}</div>
                  <div class="title">
                    <div class="logo">{{item.report.month}}月</div>
                  </div>

                  <div class="report-data">
                    <div class="data-money">
                      {{item.report.SumMony}}
                    </div>
                    <div class="data-name">
                      营业额(元)
                    </div>
                    <div class="line">
                      <span class="info-data">
                        <div class="value">{{item.report.SumVipMony}}</div>
                        <div class="name">会员消费</div>
                      </span>
                      <span class="info-data">
                        <div class="value">{{item.report.SumVipPeople}}</div>
                        <div class="name">会员人次</div>
                      </span>
                      <span class="info-data">
                        <div class="value">{{item.report.SumOpenCard}}/{{item.report.SumRenewal}}</div>
                        <div class="name">新开卡/续费</div>
                      </span>
                    </div>

                    <div class="line">
                      <span class="info-data">
                        <div class="value">{{item.report.SumNonVipMony}}</div>
                        <div class="name">散客消费</div>
                      </span>
                      <span class="info-data">
                        <div class="value">{{item.report.SumNonVipPeople}}</div>
                        <div class="name">散客人次</div>
                      </span>
                      <span class="info-data">
                        <div class="value">{{item.report.SumOldNonVipPeople}}</div>
                        <div class="name">老散客</div>
                      </span>
                    </div>
                    <div class="bottom-line"></div>
                  </div>

                  <div v-for="(dataMonth,index2) in item.datas" @click="jumpToDay(dataMonth)">
                    <record :key="index2" :item="dataMonth" :max="item.maxValue" :year="item.year"
                            :month="item.month"></record>
                  </div>
                </div>
                <div class="footer" v-show="isOverOne">—— &nbsp;没有更多了哦&nbsp; ——</div>
                <div class="footer" v-show="isLoadingOne">加载中...</div>
              </div>
              <div class="demo-noitems" v-show="items.length==0&&!isLoadingOne">
                还没有数据哦 =_="
              </div>
            </div>
            <div class="demo-footer" style="padding-top: 2vh">
              <img class="demo-nutcards"
                   src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
            </div>
          </scroll-view>
        </swiper-item>

        <swiper-item>
          <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower2"
                       :style="{height:'calc(100vh - 80rpx - ' +(statusBarHeight+36)+'px)'}">
            <div :style="{'min-height':'calc(90vh - 80rpx - ' +(statusBarHeight+36)+'px)'}">
              <div v-if="items.length>0&&current==1" style="background-color: white">
                <div v-for="(item,index) in months">
                  <div v-if="index!=0" class="block"></div>
                  <div class="month-title">
                    {{item.year}}年
                  </div>
                  <div class="month-item" v-for="(month,indexM) in item.datas" @click="jumpToMonth(month,item.year)">
                    <div class="item-one">
                      <span>{{month.Introduction}}月</span>
                      <span>￥{{month.SumMony}}</span>
                    </div>
                    <div class="item-two">
                      <span>
                        <div>{{month.SumNonVipPeople}}</div>
                        <div>接待散客</div>
                      </span>
                      <span>
                        <div>{{month.SumVipPeople}}</div>
                        <div>接待会员</div>
                      </span>
                      <span>
                        <div>{{month.SumOpenCard}}/{{month.SumRenewal}}</div>
                        <div>开卡/续卡</div>
                      </span>
                    </div>
                    <div class="item-three" v-if="indexM!=item.datas.length-1"></div>
                  </div>
                </div>
                <div class="footer" v-show="isOverTwo">—— &nbsp;没有更多了哦&nbsp; ——</div>
                <div class="footer" v-show="isLoadingTwo">加载中...</div>
              </div>
              <div class="demo-noitems" v-show="months.length==0&&!isLoadingTwo">
                还没有数据哦 =_="
              </div>
            </div>
            <div class="demo-footer" style="padding-top: 2vh">
              <img class="demo-nutcards"
                   src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
            </div>
          </scroll-view>
        </swiper-item>
      </swiper>
    </div>
    <div class="demo-noauth" v-show="auth==false">
      <div class="noauth-top" :style="{height:titleHeight+'px'}">
        <div class="noauth-title" :style="{'padding-top':statusBarHeight+'px'}">
          运营报表
        </div>
      </div>
      <div class="demo-noauthcontext" :style="{height:'calc(90vh - ' +titleHeight+'px)'}">
        {{auth == false ? '没有权限 =_="' : ''}}
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import record from '@/components/record'

  export default {
    components: {
      record
    },

    data () {
      return {
        statusBarHeight: null,
        titleHeight: null,
        auth: true,
        current: 0,
        report: {},
        days: [],
        months: [],
        items: [],
        currentMonth: 0,
        currentMonthIndex: 0,
        currentYear: 0,
        maxValue: 0,
        pageone: 1,
        pagetwo: 1,
        isLoadingOne: false, // 正在加载明细
        isOverOne: false, // 消费明细是否加载完
        isLoadingTwo: false, // 正在加载明细
        isOverTwo: false, // 消费明细是否加载完
        thisMonth: '',
        thisYear: ''
      }
    },
    methods: {
      jumpToMonth (item, year) {
        if (item.DataType === 1) {
          return
        }
        let month = item.Introduction
        if (month !== '10') {
          month = month.replace('0', '')
        }
        const url = '../month/main?userId=' + this.userId + '&storeId=' + this.storeId + '&year=' + year + '&month=' + month
        wx.navigateTo({url})
      },
      jumpToDetails () {
        const url = '../../details/main?userId=' + this.userId + '&storeId=' + this.storeId + '&consumptionId=' + 3
        wx.navigateTo({url})
      },
      jumpToDay (item) {
        if (item.DataType === 1) {
          return
        }
        let date = item.Introduction.split('月')
        let day = date[1].split('日')
        const url = '../day/main?userId=' + this.userId + '&storeId=' + this.storeId + '&month=' + date[0] + '&day=' + day[0] + '&year=' + item.Year
        wx.navigateTo({url})
      },
      change (e) {
        this.current = e.mp.detail.current
        this.pageone = 1
        this.pagetwo = 1
        this.isOverOne = false
        this.isOverTwo = false
        if (this.current === 0) {
          this.getTable(1)
        } else if (this.current === 1) {
          this.getTable(1)
        }
      },
      scrolltolower () {
        if (this.isLoadingOne || this.isOverOne) {
          return
        }
        this.pageone += 1
        this.isLoadingOne = true
        this.getTable(this.pageone)
      },
      scrolltolower2 () {
        if (this.isLoadingTwo || this.isOverTwo) {
          return
        }
        this.pagetwo += 1
        this.isLoadingTwo = true
        this.getTable(this.pagetwo)
      },
      getMonthLength2 (year, month) {
        let d = new Date()
        // 将日期设置为下月一号
        d.setFullYear(year)
        d.setMonth(month)
        d.setDate('1')
        // 获取本月最后一天
        d.setDate(d.getDate() - 1)
        return d.getDate()
      },
      getStatistical (month, index, year, isNew) {
        let myDate = new Date()
        let that = this
        let currentMonth = myDate.getMonth() + 1 + ''
        let day = this.getMonthLength2(year, month)
        this.$post('/operatingReports/businessGetStoreStatistical', {
          StartDate: year + '-' + month + '-1 00:00',
          EndDate: year + '-' + month + '-' + day + ' 23:59',
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          res.month = currentMonth === month ? '本' : month
          res.year = isNew ? year + '年' : ''
          that.items[index].report = res
        })
      },
      getMonthLength (date) {
        let d = date
        // 将日期设置为下月一号
        d.setMonth(d.getMonth() + 1)
        d.setDate('1')
        // 获取本月最后一天
        d.setDate(d.getDate() - 1)
        return d.getDate()
      },
      getTable (page) {
        let that = this
        let day = ''
        if (page === 1) {
          this.thisMonth = new Date().getMonth() + 1
          this.thisYear = new Date().getFullYear()
          if (this.thisMonth === undefined) {
            this.sleep()
          }
        } else {
          if (this.current) {
            this.thisYear -= 1
          } else {
            if (this.thisMonth > 1) {
              this.thisMonth -= 1
            } else {
              this.thisYear -= 1
              this.thisMonth = 12
            }
          }
        }
        let date = new Date(this.thisYear, this.thisMonth - 1, 1, 0, 0)
        day = this.getMonthLength(date)
        let current = that.current * 1
        this.$post('/operatingReports/businessGetStoreReportTable', {
          StartDate: this.current ? this.thisYear + '-1-1 00:00' : this.thisYear + '-' + this.thisMonth + '-1 00:00',
          EndDate: this.current ? this.thisYear + '-12-31 23:59' : this.thisYear + '-' + this.thisMonth + '-' + day + ' 23:59',
          Uid: this.userId,
          StoreId: this.storeId,
          PageSize: 31,
          PageIndex: 1,
          Conditions: current
        }, this.firstLoad).then(res => {
          that.firstLoad = false
          if (current === 0) {
            that.isLoadingOne = false
            if (page === 1) {
              that.maxValue = 0
              that.items = []
            }
            if (res.Data === undefined || res.Data.length === 0) {
              that.isOverOne = true
            }
            for (let item of res.Data) {
              let month = item.Introduction.split('月')[0]
              if (item.SumMony > that.maxValue) {
                that.maxValue = item.SumMony
              }
              if (that.items.length === 0) {
                that.items.push({report: {}, datas: [], maxValue: item.SumMony, year: item.Year, month: month})
                that.currentMonth = month
                that.currentMonthIndex = 0
                that.currentYear = item.Year
                that.getStatistical(month, 0, item.Year, false)
              }
              if (month === this.currentMonth && item.Year === this.currentYear) {
                that.items[that.currentMonthIndex].datas.push(item)
              } else {
                that.items.push({report: {}, datas: [], maxValue: item.SumMony, year: item.Year, month: month})
                that.currentMonth = month
                that.currentMonthIndex += 1
                that.getStatistical(month, that.currentMonthIndex, item.Year, !(item.Year === that.currentYear), item.SumMony)
                that.currentYear = item.Year
                that.items[that.currentMonthIndex].datas.push(item)
              }
              if (item.SumMony > that.items[that.currentMonthIndex].maxValue) {
                that.items[that.currentMonthIndex].maxValue = item.SumMony
              }
            }
            for (let item of that.items) {
              that.updateValue(item.maxValue, item.year, item.month)
            }
          } else {
            that.isLoadingTwo = false
            if (page === 1) {
              that.months = []
            }
            if (res.Data === undefined || res.Data.length === 0) {
              that.isOverTwo = true
            }
            for (let item of res.Data) {
              let month = item.Introduction.split('年')[1].split('月')[0]
              if (month !== '10') {
                month = month.replace('0', '')
              }
              item.Introduction = month
              if (that.months.length === 0) {
                that.months.push({year: item.Year, datas: []})
                that.currentYearTwo = item.Year
                that.currentYearIndex = 0
              }
              if (item.Year === this.currentYearTwo) {
                that.months[that.currentYearIndex].datas.push(item)
              } else {
                that.months.push({year: item.Year, datas: []})
                that.currentYearIndex += 1
                that.currentYearTwo = item.Year
                that.months[that.currentYearIndex].datas.push(item)
              }
            }
          }
          if (page === 1 && (res.Data && res.Data.length < 10)) {
            that.getTable(2)
          }
        })
      },
      updateValue (max, year, month) {
        setTimeout(function () {
          let childrens = this.$children
          for (let children of childrens) {
            if (children.updateValue === undefined) {
              continue
            }
            children.updateValue(max, year, month)
          }
        }.bind(this), 500)
      },
      sleep () {
        let i = 0
        while (i < 100000000) {
          i += 1
        }
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.firstLoad = true
      this.currentMonth = new Date().getMonth() + 1 + ''
      this.currentYear = new Date().getFullYear() + ''
      this.thisMonth = new Date().getMonth() + 1
      this.thisYear = new Date().getFullYear()
      this.getTable(1)
      this.isLoadingOne = true
      this.isLoadingTwo = true
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      let permissions = wx.getStorageSync('auth')
      if (permissions && permissions.length > 0) {
        for (let item of permissions) {
          if (item.PController === 'reports' && item.State === 0) {
            this.auth = false
            return
          }
        }
        this.auth = true
      }
      // if (this.firstLoad) {
      // return
      // }
      // this.pageone = 1
      // this.pagetwo = 1
      // this.isOverOne = false
      // this.isOverTwo = false
      // this.current = 0
      // this.getTable(1)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .report {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .report-top {
      width: 100vw;
      background: linear-gradient(to right, #ff8100, #ff6700);
      .report-title {
        width: 100vw;
        height: 36px;
        line-height: 34px;
        text-align: center;
        font-size: rpx(35);
        color: white;
      }
      .menu {
        height: rpx(75);
        line-height: rpx(70);
        text-align: center;
        font-size: rpx(28);
        color: white;
        padding-bottom: rpx(5);
        .day {
          border-radius: rpx(15) 0 0 rpx(15);
          display: inline-block;
          height: rpx(55);
          line-height: rpx(55);
          border: 1px solid white;
          text-align: center;
          width: 33vw;
          background-color: #ff6700;
        }
        .month {
          border-radius: 0 5px 5px 0;
          display: inline-block;
          border: 1px solid white;
          text-align: center;
          height: rpx(55);
          line-height: rpx(55);
          width: 33vw;
          background-color: #ff6700;
        }
        .select {
          color: #ff6700;
          background-color: white;
        }
      }
    }

    .swiper {
      background-color: #f0f0f0;
      .table {
        width: 100vw;
        background-color: #f0f0f0;
        .block {
          padding: 1vh 5vw;
          background-color: #f0f0f0;
          font-size: rpx(45);
        }
        .title {
          width: 100vw;
          height: 6vh;
          padding-top: 2.3vh;
          padding-bottom: rpx(7);
          div {
            width: 16vw;
            height: rpx(68);
            line-height: rpx(68);
            text-align: center;
            background-color: #78bc6d;
            border-radius: 0 rpx(35) rpx(35) 0;
            font-size: rpx(36);
            color: white;
          }
        }
        .report-data {
          width: 96vw;
          border-radius: rpx(10);
          //background-color: white;
          margin: 0 auto;
          text-align: center;
          .data-money {
            height: 8.8vh;
            line-height: 9.5vh;
            width: 90vw;
            margin: 0 auto;
            font-size: rpx(90);
            color: #ff6700;
          }
          .data-name {
            font-size: rpx(28);
            padding-bottom: rpx(30);
          }
          .line {
            width: 90vw;
            margin: 0 auto;
            height: 9.5vh;
            line-height: 9.5vh;
            .info-data {
              display: inline-block;
              margin-top: 2vh;
              height: 5.5vh;
              width: 29vw;
              text-align: center;
              .value {
                height: 3.5vh;
                line-height: 3.5vh;
                font-size: rpx(35);
                padding-left: rpx(10);
                color: #ff6700;
              }
              .name {
                height: 2vh;
                line-height: 2vh;
                font-size: rpx(22);
                padding-left: rpx(10);
              }
              &:nth-child(2) {
                border-left: rpx(1) solid #e3e3e3;
                border-right: rpx(1) solid #e3e3e3;
              }
            }
          }
          .bottom-line {
            width: 90vw;
            margin: 0 auto;
            margin-top: 5vh;
            background-color: #bbbbbb;
            height: rpx(1);
            margin-bottom: 5vh;
          }
        }
        .column-title {
          width: 90vw;
          margin: 0 auto;
          .column {
            display: inline-block;
            height: 8vh;
            line-height: 8vh;
            font-size: 0.8em;
          }
        }
      }
      .month-title {
        padding: 6vh 0 4vh 5vw;
        font-size: rpx(70);
        font-weight: 600;
      }
      .month-item {
        width: 100vw;
        height: 16vh;
        .item-one {
          span {
            display: inline-block;
            &:nth-child(1) {
              height: rpx(53);
              line-height: rpx(53);
              font-size: rpx(28);
              width: 13vw;
              padding-left: 5vw;
              border-radius: 0 rpx(25) rpx(25) 0;
              background-color: #78bc6d;
              color: white;
            }
            &:nth-child(2) {
              height: rpx(53);
              line-height: rpx(53);
              font-size: rpx(28);
              padding-left: 3vw;
            }
          }
        }
        .item-two {
          font-size: rpx(24);
          padding-left: 18vw;
          padding-right: 4vw;
          color: #a7a7a7;
          padding-bottom: 2.2vh;
          span {
            display: inline-block;
            width: 33.3%;
            text-align: center;
            div {
              &:nth-child(1) {
                padding-top: rpx(20);
              }
            }
          }
        }
        .item-three {
          margin-left: 21vw;
          width: 74vw;
          border-bottom: rpx(1) solid #bbbbbb;
        }
      }
    }
  }
</style>
