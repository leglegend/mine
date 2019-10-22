<template>
  <div class="demo-page collect-page">
    <title :name="'收款记录'"></title>
    <!--<div class="alipay" @click="jumpToAccount">
       <span class="alipay-left">
         <span>
           <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/alipay.png"/>
         </span>
         <span class="left-title" v-if="account==null">设置收款账户</span>
         <span class="left-title2" v-if="account!=null">
           <div>{{account ? account.AccountName : ''}}</div>
           <div>账户:{{account ? account.AccountId : ''}}</div>
         </span>
       </span>
      <span class="alipay-right">
         <span v-if="account!=null">{{account.State ? '正常' : '异常'}}</span>
         <span>
           <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/alipay-right.png"/>
         </span>
       </span>
    </div>-->
    <div class="menu">
      <span class="day" :class="{'select':current==0}" @click="current=0">日到账</span>
      <span class="month" :class="{'select':current==1}" @click="current=1">月到账</span>
    </div>
    <swiper class="swiper" v-bind:current="current" @change="change"
            :style="{height:'calc(91.5vh - '+titleHeight +'px)'}">
      <swiper-item>
        <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                     :style="{height:'calc(91.5vh - '+titleHeight +'px)'}">
          <div :style="{'min-height':'calc(81.5vh - '+titleHeight +'px)'}">
            <div v-show="itemsone.length>0">
              <div style="background: white">
                <div v-for="(item,index) in itemsone">
                  <div v-if="index!=0" class="block">{{item.report.year}}</div>
                  <div class="title">
                    <div class="logo">{{item.report.month}}月</div>
                  </div>

                  <div class="collect-itemone collect-total">
                    <span>合计</span>
                    <span>{{item.report.PayCount}}笔</span>
                    <span>￥{{item.report.SumMony}}</span>
                  </div>
                  <div v-for="(dataMonth,index2) in item.datas">
                    <div class="collect-itemone" :class="index2==item.datas.length-1?'last-item':''"
                         @click="jumpToMoney(dataMonth)">
                      <span>{{dataMonth.Introduction}}</span>
                      <span>{{dataMonth.PayCount}}笔</span>
                      <span>￥{{dataMonth.SumMony}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer" v-show="isOverOne">—— &nbsp;没有更多了哦&nbsp; ——</div>
              <div class="footer" v-show="isLoadingOne">加载中...</div>
            </div>
            <div class="demo-noitems" v-show="itemsone.length==0&&!isLoadingOne">
              还没有数据哦 =_="
            </div>
          </div>
          <div class="demo-footer" v-show="itemsone.length==0||isOverOne" style="padding-top: 0">
            <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
          </div>
          <div class="demo-bottom"></div>
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower2"
                     :style="{height:'calc(91.5vh - '+titleHeight +'px)'}">
          <div :style="{'min-height':'calc(81.5vh - '+titleHeight +'px)'}">
            <div v-show="itemstwo.length>0">
              <div style="background: white">
                <div v-for="(item,index) in itemstwo">
                  <div v-if="index!=0" class="block"></div>
                  <div class="title year">
                    {{item.report.year}}年
                  </div>

                  <div class="collect-itemone collect-total">
                    <span>合计</span>
                    <span>{{item.report.PayCount}}笔</span>
                    <span>￥{{item.report.SumMony}}</span>
                  </div>
                  <div v-for="(dataMonth,index2) in item.datas" @click="jumpToDay(dataMonth)">
                    <div class="collect-itemone" :class="index2==item.datas.length-1?'last-item':''">
                    <span>
                      <div class="logo move-left">{{dataMonth.Introduction}}月</div>
                    </span>
                      <span>{{dataMonth.PayCount}}笔</span>
                      <span>￥{{dataMonth.SumMony}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer" v-show="isOverTwo">—— &nbsp;没有更多了哦&nbsp; ——</div>
              <div class="footer" v-show="isLoadingTwo">加载中...</div>
            </div>
            <div class="demo-noitems" v-show="itemstwo.length==0&&!isLoadingTwo">
              还没有数据哦 =_="
            </div>
          </div>
          <div class="demo-footer" v-show="itemstwo.length==0||isOverTwo" style="padding-top: 0">
            <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
          </div>
          <div class="demo-bottom"></div>
        </scroll-view>
      </swiper-item>
    </swiper>
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
        titleHeight: null,
        account: null,
        firstLoad: true,
        current: 0,
        itemsone: [],
        itemstwo: [],
        pageone: 1,
        pagetwo: 1,
        isLoadingOne: false, // 正在加载明细
        isOverOne: false, // 消费明细是否加载完
        isLoadingTwo: false, // 正在加载明细
        isOverTwo: false // 消费明细是否加载完
      }
    },
    methods: {
      jumpToDay (e) {
        const url = '../day/main?userId=' + this.userId + '&storeId=' + this.storeId + '&year=' + e.Year + '&month=' + e.Introduction
        wx.navigateTo({url})
      },
      jumpToMoney (e) {
        let date = e.Introduction.split('月')
        let day = date[1].split('日')
        const url = '../money/main?userId=' + this.userId + '&storeId=' + this.storeId + '&year=' + e.Year + '&month=' + date[0] + '&day=' + day[0]
        wx.navigateTo({url})
      },
      jumpToAccount () {
        const url = '../alipay/main?userId=' + this.userId + '&storeId=' + this.storeId + (this.account ? '&name=' + this.account.AccountName + '&account=' + this.account.AccountId + '&state=' + this.account.State : '')
        wx.navigateTo({url})
      },
      change (e) {
        this.current = e.mp.detail.current
        this.pageone = 1
        this.pagetwo = 1
        this.isOverOne = false
        this.isOverTwo = false
        if (this.current === 0 && this.itemsone.length === 0) {
          this.isLoadingOne = true
          this.getItems(1)
        } else if (this.current === 1 && this.itemstwo.length === 0) {
          this.isLoadingTwo = true
          this.getItems(1)
        }
      },
      scrolltolower () {
        if (this.isLoadingOne || this.isOverOne) {
          return
        }
        this.pageone += 1
        this.isLoadingOne = true
        this.getItems(this.pageone)
      },
      scrolltolower2 () {
        if (this.isLoadingTwo || this.isOverTwo) {
          return
        }
        this.pagetwo += 1
        this.isLoadingTwo = true
        this.getItems(this.pagetwo)
      },
      getItems (page) {
        let that = this
        this.$post('/operatingReports/businessGetStoreIncomeReportTable', {
          Uid: this.userId,
          StoreId: this.storeId,
          Conditions: this.current,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          if (that.current === 0) {
            that.isLoadingOne = false
            if (page === 1) {
              that.itemsone = []
            }
            if (res.Data.length < 10) {
              that.isOverOne = true
            }
            for (let item of res.Data) {
              let month = item.Introduction.split('月')[0]
              if (that.itemsone.length === 0) {
                that.itemsone.push({report: {}, datas: []})
                that.currentMonth = month
                that.currentMonthIndex = 0
                that.currentYear = item.Year
                that.getStatistical(month, 0, item.Year, false)
              }
              if (month === this.currentMonth && item.Year === this.currentYear) {
                that.itemsone[that.currentMonthIndex].datas.push(item)
              } else {
                that.itemsone.push({report: {}, datas: []})
                that.currentMonth = month
                that.currentMonthIndex += 1
                that.getStatistical(month, that.currentMonthIndex, item.Year, !(item.Year === that.currentYear))
                that.currentYear = item.Year
                that.itemsone[that.currentMonthIndex].datas.push(item)
              }
            }
          } else {
            that.isLoadingTwo = false
            if (page === 1) {
              that.itemstwo = []
            }
            if (res.Data.length < 10) {
              that.isOverTwo = true
            }
            for (let item of res.Data) {
              let month = item.Introduction.split('年')[1].split('月')[0]
              if (month !== '10') {
                month = month.replace('0', '')
              }
              item.Introduction = month
              if (that.itemstwo.length === 0) {
                that.itemstwo.push({report: {}, datas: []})
                that.currentYearTwo = item.Year
                that.currentYearIndex = 0
                that.getYearStatistical(0, item.Year)
              }
              if (item.Year === this.currentYearTwo) {
                that.itemstwo[that.currentYearIndex].datas.push(item)
              } else {
                that.itemstwo.push({report: {}, datas: []})
                that.currentYearIndex += 1
                that.currentYearTwo = item.Year
                that.itemstwo[that.currentYearIndex].datas.push(item)
                that.getYearStatistical(that.currentYearIndex, item.Year)
              }
            }
          }
        })
      },
      getStatistical (month, index, year, isNew) {
        let myDate = new Date()
        let that = this
        let currentMonth = myDate.getMonth() + 1 + ''
        this.$post('/operatingReports/businessGetStoreIncomeStatistical', {
          StartDate: year + '-' + month + '-1',
          EndDate: year + '-' + month + '-31',
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          res.month = currentMonth === month ? '本' : month
          res.year = isNew ? year + '年' : ''
          that.itemsone[index].report = res
        })
      },
      getYearStatistical (index, year) {
        let that = this
        this.$post('/operatingReports/businessGetStoreIncomeStatistical', {
          StartDate: year + '-' + 1 + '-1',
          EndDate: year + '-' + 12 + '-31',
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          res.year = year
          that.itemstwo[index].report = res
        })
      },
      getAccount () {
        let that = this
        this.$post('/store/businessGetStorePayAccount', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          if (res) {
            that.account = res
          }
          that.firstLoad = false
        })
      }
    },
    onLoad (res) {
      this.userId = res.userId
      this.storeId = res.storeId
      this.isLoadingOne = true
      this.firstLoad = true
      this.isOverOne = false
      this.current = 0
      this.getItems(1)
      this.getAccount()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      this.getAccount()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .collect-page {
    background: #f0f0f0;
    .alipay {
      padding: 4vw 5vw;
      background-color: #78bc6d;
      color: white;
      font-size: 7vw;
      span {
        height: 10.9vw;
        line-height: 10.9vw;
        display: inline-block;
        vertical-align: top;
      }
      .alipay-left {
        width: 60vw;
        img {
          width: 10.9vw;
          height: 10.9vw;
          display: inline-block;
          vertical-align: top;
        }
        .left-title {
          padding-left: 3vw;
        }
        .left-title2 {
          padding-left: 3vw;
          line-height: 5.45vw;
          font-size: 5vw;
          div {
            height: 5.45vw;
          }
          div:nth-child(2) {
            font-size: 3vw;
            line-height: 5.45vw;
            position: relative;
            top: 0.6vw;
          }
        }
      }
      .alipay-right {
        text-align: right;
        width: 30vw;
        img {
          height: 4vw;
          width: 1.7vw;
          display: inline-block;
        }
        span:nth-child(2) {
          width: 3vw;
        }
      }
    }
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
    .swiper {
      height: 83vh;
      .table {
        height: 83vh;
        width: 100vw;
        .block {
          padding: 1vh 5vw;
          background-color: #f0f0f0;
          font-size: rpx(45);
        }
        .title {
          width: 100vw;
          height: 5vh;
          padding-top: 2.3vh;
        }
        .year {
          padding-left: 5vw;
          font-size: rpx(60);
        }
        .logo {
          width: 19vw;
          height: rpx(60);
          line-height: rpx(60);
          text-align: center;
          background-color: #78bc6d;
          border-radius: 0 rpx(35) rpx(35) 0;
          font-size: rpx(36);
          color: white;
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
              width: 37vw;
            }
            &:nth-child(2) {
              width: 20vw;
              text-align: center;
            }
            &:nth-child(3) {
              width: 33vw;
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

    }
  }
</style>
