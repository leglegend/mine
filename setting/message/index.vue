<template>
  <div class="message-home-page">
    <title :name="'短信中心'"></title>
    <scroll-view class="message-home-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="message-home-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="message-top">
          <div class="top-context">
            <span class="context-left">*</span>
            <span class="context-right">
              需要下发短信的功能, 如: 营销、预约、会员卡消费等等，
              需要先有短信余额才能正常发送短信给顾客
            </span>
          </div>
          <div class="top-context" style="padding-top: 1vw">
            <span class="context-left">*</span>
            <span class="context-right">
              受电信运营商的监管政策影响，不支持随意设置短信内容发送给顾客
            </span>
          </div>
        </div>
        <div class="message-middle">
          <div class="middle-message">
            <span>短信余额：</span>
            <span>{{balance}}</span>
            <span>&nbsp;&nbsp;条</span>
          </div>
          <div class="middle-buttons">
            <span @click="jumpToRecharge">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/msg-recharge.png"/>&nbsp;&nbsp;短信充值
            </span>
            <span @click="jumpToRecord">
              <img style="width: 4.5vw;height: 4.9vw"
                   src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/msg-record.png"/>&nbsp;&nbsp;发送记录
            </span>
          </div>
        </div>
        <div style="padding-top: 3.1vw;background: #F0F0F0"></div>
        <div class="message-items">
          <div class="items-title">
            充值记录：
          </div>
          <div class="msg-item" v-for="item in items" :key="index">
            <span>2019-09-20  10:22:10 </span>
            <span>1000条 / 59元</span>
          </div>
        </div>
        <div class="footer" v-show="isOver&&items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</div>
        <div class="footer" v-show="isLoading">加载中...</div>
        <div class="demo-noitems" v-show="items.length==0&&!isLoading">
          还没有数据哦 =_="
        </div>
      </div>
      <div class="demo-footer" v-show="isOver||items.length==0" style="padding-top: 0vh">
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
        items: [],
        balance: 0,
        isOver: false,
        isLoading: true,
        titleHeight: null
      }
    },
    methods: {
      jumpToRecharge () {
        const url = '../recharge/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToRecord () {
        const url = '../record/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.isLoading = true
        this.$post('/smsCenter/getSmsAddedServiceOrder', {
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          if (res.Orders.length < 10) {
            that.isOver = true
          }
          for (let i in res.Orders) {
            that.items.push(res.Orders[i])
          }
          if (page === 1) {
            that.items = res.Orders
          }
          that.isLoading = false
        })
      },
      getBalance () {
        let that = this
        this.$post('/smsCenter/getStoreSmsBalance', {
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.balance = res.StoreSmsBalance
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.balance = 0
      this.page = 1
      this.items = []
      this.getBalance()
      this.getItems(1)
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.userId) {
        this.getBalance()
        this.getItems(1)
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .message-home-page {
    height: 100vh;
    background-color: #f0f0f0;
    .message-home-scroll {
      height: 90vh;
      .message-home-main {
        min-height: 80vh;
        .message-top {
          padding: 2vw 7vw;
          background: #FFEDAD;
          .top-context {
            line-height: 5vw;
            span {
              display: inline-block;
              vertical-align: top;
              font-size: 3.3vw;
              &:nth-child(1) {
                color: #FC493A;
                width: 4vw;
              }
              &:nth-child(2) {
                color: #C48F21;
                width: 82vw;
              }
            }
          }
        }
        .message-middle {
          background: white;
          .middle-message {
            height: 5.6vw;
            padding-bottom: 9vw;
            text-align: center;
            padding-top: 8vw;
            span {
              display: inline-block;
              vertical-align: bottom;
              color: #78BC6D;
              font-size: 5.2vw;
              &:nth-child(2) {
                font-size: 6.7vw;
                position: relative;
                top: 0.4vw;
              }
            }
          }
          .middle-buttons {
            height: 7.1vw;
            line-height: 7.1vw;
            span {
              height: 7.1vw;
              line-height: 7.1vw;
              width: 50vw;
              box-sizing: border-box;
              display: inline-block;
              text-align: center;
              font-size: 3.7vw;
              font-weight: 500;
              &:nth-child(1) {
                border-right: 0.1vw solid #DDDDDD;
              }
            }
            img {
              display: inline-block;
              vertical-align: middle;
              &:nth-child(1) {
                width: 4.2vw;
                height: 4.9vw;
              }
              &:nth-child(2) {
                width: 4.5vw;
                height: 4.9vw;
              }
            }
            padding-bottom: 2.9vw;
          }
        }
        .message-items {
          padding: 5.5vw 8vw;
          background: white;
          .items-title {
            font-weight: 600;
            font-size: 3.5vw;
          }
          .msg-item {
            height: 13vw;
            line-height: 13vw;
            border-bottom: 0.1vw solid #E9E9E9;
            color: #898989;
            font-size: 3.3vw;
            span {
              display: inline-block;
              height: 13vw;
              line-height: 13vw;
              width: 50%;
              &:nth-child(1) {
                text-align: left;
              }
              &:nth-child(2) {
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
</style>
