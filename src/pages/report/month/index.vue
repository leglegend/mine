<template>
  <div class="month">
    <title :name="'运营报表'"></title>
    <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div style="background-color: #f0f0f0"
           :style="{'min-height':'calc(90vh - '+getGlobalData().titleHeight +'px)'}">
        <div style="background-color: white">
          <div class="title">
            <div class="logo">{{year + '年' + month + '月'}}</div>
          </div>

          <div class="report-data">
            <div class="data-money">
              {{report.SumMony}}
            </div>
            <div class="data-name">
              营业额(元)
            </div>
            <div class="line">
            <span class="info-data">
              <div class="value">{{report.SumVipMony}}</div>
              <div class="name">会员消费</div>
            </span>
              <span class="info-data">
              <div class="value">{{report.SumVipPeople}}</div>
              <div class="name">会员人次</div>
            </span>
              <span class="info-data">
              <div class="value">{{report.SumOpenCard}}/{{report.SumRenewal}}</div>
              <div class="name">新开卡/续费</div>
            </span>
            </div>

            <div class="line">
            <span class="info-data">
              <div class="value">{{report.SumNonVipMony}}</div>
              <div class="name">散客消费</div>
            </span>
              <span class="info-data">
              <div class="value">{{report.SumNonVipPeople}}</div>
              <div class="name">散客人次</div>
            </span>
              <span class="info-data">
              <div class="value">{{report.SumOldNonVipPeople}}</div>
              <div class="name">老散客</div>
            </span>
            </div>
            <div class="bottom-line"></div>
          </div>

          <div v-for="(item,index) in items" @click="jumpToDay(item)">
            <record :key="index" :item="item"></record>
          </div>
        </div>
        <div v-show="items.length>0">
          <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" v-show="isLoading">加载中...</div>
        </div>
        <div class="demo-noitems" v-show="items.length==0&&!isLoading">
          还没有数据哦 =_="
        </div>
      </div>
      <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import record from '@/components/record'
  import title from '@/components/title'

  export default {
    components: {
      record, title
    },

    data () {
      return {
        titleHeight: null,
        report: {},
        items: [],
        year: '',
        month: '',
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        page: 1 // 消费明细当前页
      }
    },
    methods: {
      jumpToDay (item) {
        if (item.DataType === 1) {
          return
        }
        let date = item.Introduction.split('月')
        let day = date[1].split('日')
        const url = '../day/main?month=' + date[0] + '&day=' + day[0] + '&year=' + this.year
        wx.navigateTo({url})
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getTable(this.page)
      },
      getMonthLength (year, month) {
        let d = new Date()
        // 将日期设置为下月一号
        d.setFullYear(year)
        d.setMonth(month)
        d.setDate('1')
        // 获取本月最后一天
        d.setDate(d.getDate() - 1)
        return d.getDate()
      },
      getStatistical () {
        let that = this
        let day = this.getMonthLength(this.year, this.month)
        this.$post('/operatingReports/businessGetStoreStatistical', {
          StartDate: this.year + '-' + this.month + '-1',
          EndDate: this.year + '-' + this.month + '-' + day,
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.report = res
        })
      },
      getTable (page) {
        let that = this
        let day = this.getMonthLength(this.year, this.month)
        this.isLoading = true
        this.$post('/operatingReports/businessGetStoreReportTable', {
          Uid: this.userId,
          StoreId: this.storeId,
          PageSize: 10,
          PageIndex: page,
          Conditions: 0,
          StartDate: this.year + '-' + this.month + '-1 00:00',
          EndDate: this.year + '-' + this.month + '-' + day + ' 23:59'
        }).then(res => {
          if (res.Data.length < 10) {
            that.isOver = true
          }
          for (let i in res.Data) {
            that.items.push(res.Data[i])
          }
          if (page === 1) {
            that.items = res.Data
          }
          this.isLoading = false
        })
      }
    },
    onLoad (option) {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.year = option.year
      if (option.month.indexOf('年') >= 0) {
        this.month = option.month.split('年')[1]
        if (this.month !== '10') {
          this.month = this.month.replace('0', '')
        }
      } else {
        this.month = option.month
      }
      this.isOver = false
      this.page = 1
      this.report = {}
      this.items = []
      this.getStatistical()
      this.getTable(1)
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .month {
    height: 100vh;
    width: 100vw;
    .table {
      height: 90vh;
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
        text-align: center;
        div {
          min-width: 35vw;
          margin: 0 auto;
          height: rpx(68);
          line-height: rpx(68);
          text-align: center;
          background-color: #78bc6d;
          border-radius: rpx(35);
          font-size: rpx(36);
          color: white;
          padding: 0 2vw;
          display: inline-block;
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
  }
</style>
