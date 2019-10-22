<template>
  <div class="demo-page collect-day">
    <title :name="'收款管理'"></title>
    <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="background: white">
          <div class="title">
            <div class="logo">{{time}}</div>
          </div>
          <div class="collect-itemone collect-total">
            <span>合计{{report.PayCount}}笔</span>
            <span></span>
            <span>￥{{report.SumMony}}</span>
          </div>
          <div v-for="(item,index) in items">
            <collect :last="index==items.length-1" :item="item" :key="index"></collect>
          </div>
        </div>
        <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
        <div class="footer" v-show="isLoading">加载中...</div>
      </div>
      <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import title from '@/components/title'
  import collect from '@/components/collect'

  export default {
    components: {
      title, collect
    },

    data () {
      return {
        titleHeight: null,
        items: [],
        time: '',
        report: {},
        page: 1,
        isLoading: false, // 正在加载明细
        isOver: false // 消费明细是否加载完
      }
    },
    methods: {
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.isLoading = true
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.$post('/consumption/businessGetConsumptionList', {
          Uid: this.userId,
          StoreId: this.storeId,
          StartDate: this.year + '-' + this.month + '-' + this.day + ' 00:00',
          EndDate: this.year + '-' + this.month + '-' + this.day + ' 23:59',
          IsIncome: true,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          that.isLoading = false
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let item of res.Data) {
              that.items.push(item)
            }
          }
          if (res.Data.length < 10) {
            that.isOver = true
          }
        })
      },
      getStatistical () {
        let that = this
        this.$post('/operatingReports/businessGetStoreIncomeStatistical', {
          StartDate: this.year + '-' + this.month + '-' + this.day + ' 00:00',
          EndDate: this.year + '-' + this.month + '-' + this.day + ' 23:59',
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.report = res
        })
      }
    },
    onLoad (res) {
      this.userId = res.userId
      this.storeId = res.storeId
      this.year = res.year
      this.month = res.month
      this.day = res.day
      this.isLoading = false
      this.isOver = false
      this.page = 1
      this.time = this.year + '年' + this.month + '月' + this.day + '日到账'
      this.getItems(1)
      this.getStatistical()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .collect-day {
    background: #f0f0f0;
    .menu {
      height: 8.5vh;
      line-height: 8.5vh;
      text-align: center;
      font-size: rpx(28);
      color: #ff6700;
      background-color: #f0f0f0;
      .day {
        border-radius: rpx(15) 0 0 rpx(15);
        display: inline-block;
        height: rpx(55);
        line-height: rpx(55);
        border: rpx(1) solid #ff6700;
        text-align: center;
        width: 33vw;
        background-color: white;
      }
      .month {
        border-radius: 0 rpx(15) rpx(15) 0;
        display: inline-block;
        border: rpx(1) solid #ff6700;
        text-align: center;
        height: rpx(55);
        line-height: rpx(55);
        width: 33vw;
        background-color: white;
      }
      .select {
        color: white;
        background-color: #ff6700;
      }
    }

    .block {
      padding: 1vh 5vw;
      background-color: #f0f0f0;
      font-size: rpx(45);
    }
    .title {
      width: 100vw;
      height: 5vh;
      padding-top: 2.3vh;
      text-align: center;
    }
    .year {
      padding-left: 5vw;
      font-size: rpx(60);
    }
    .logo {
      min-width: 50vw;
      height: rpx(60);
      line-height: rpx(60);
      text-align: center;
      background-color: #78bc6d;
      border-radius: rpx(35);
      font-size: rpx(36);
      color: white;
      display: inline-block;
    }
    .move-left {
      position: relative;
      left: -5vw;
    }
    .collect-itemone {
      width: 90vw;
      font-size: rpx(29);
      margin: 0 auto;
      border-bottom: rpx(1) solid #dddddd;
      line-height: 8vh;
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 42vw;
        }
        &:nth-child(2) {
          width: 10vw;
        }
        &:nth-child(3) {
          width: 38vw;
          text-align: right;
          font-size: rpx(33);
        }
      }
    }
    .collect-total {
      color: #7e7e7e;
      border-bottom: rpx(2) solid #dddddd;
    }
    .last-item {
      border-bottom: 0 solid white;
    }

  }
</style>
