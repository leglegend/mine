<template>
  <div class="month">
    <title :name="'运营报表'"></title>
    <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div style="background-color: #f0f0f0"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="background-color: white">
          <div class="title">
            <div class="logo">{{year + '年' + month + '月' + day + '日流水'}}</div>
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

          <div v-for="(item,index) in items" @click="jumpToDetails(item)">
            <item :key="index" :item="item" :last="index==items.length-1"></item>
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
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import item from '@/components/item'
  import title from '@/components/title'

  export default {
    data () {
      return {
        items: [],
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        page: 1, // 消费明细当前页
        report: {},
        month: '',
        year: '',
        day: '',
        titleHeight: ''
      }
    },

    components: {
      item, title
    },

    methods: {
      jumpToDetails (item) {
        const url = '../../details/main?userId=' + this.userId + '&storeId=' + this.storeId + '&consumptionId=' + item.ConsumptionId
        wx.navigateTo({url})
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.getConsumptions(this.page)
      },
      getConsumptions (page) {
        let that = this
        this.isLoading = true
        this.$post('/consumption/businessGetConsumptionList', {
          StartDate: this.year + '-' + this.month + '-' + this.day + ' 00:00',
          EndDate: this.year + '-' + this.month + '-' + this.day + ' 23:59',
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
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
      },
      getStatistical () {
        let that = this
        this.$post('/operatingReports/businessGetStoreStatistical', {
          StartDate: this.year + '-' + this.month + '-' + this.day + ' 00:00',
          EndDate: this.year + '-' + this.month + '-' + this.day + ' 23:59',
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.report = res
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.year = option.year
      this.month = option.month
      this.day = option.day
      this.isOver = false
      this.page = 1
      this.getStatistical()
      this.getConsumptions(1)
      this.statusBarHeight = this.getGlobalData().statusBarHeight
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
          min-width: 45vw;
          margin: 0 auto;
          height: rpx(68);
          line-height: rpx(68);
          text-align: center;
          background-color: #78bc6d;
          border-radius: rpx(35);
          font-size: rpx(36);
          color: white;
          padding: 0 3vw;
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
