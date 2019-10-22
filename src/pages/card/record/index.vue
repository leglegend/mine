<template>
  <div class="recordcard-page">
    <title :name="'销售记录'"></title>
    <scroll-view class="recordcard-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="recordcard-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="option-context">
          <span class="option-card" v-bind:style="{'background':'url('+card.CardImg+')','background-size':'100% 100%'}">
            <div class="card-hearder">
              <span class="header-logo"
                    v-bind:style="{'background':'url('+card.StoreLogo+')','background-size':'100% 100%'}"></span>
              <span class="header-name">{{card.StoreName}}</span>
              <img class="header-code" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/code.png"/>
            </div>
            <div class="card-content">
              {{card.CardName ? card.CardName : '会员卡'}}
            </div>
            <div class="card-footer">
              <div class="footer-number">0000 0000 000</div>
              <div class="footer-date">有效期至{{card.ValidityDateTo}}</div>
            </div>
          </span>
        </div>
        <div style="background: white">
          <div class="collect-itemone collect-total" v-if="items.length>0">
            <span>合计{{report.SalesCount}}次</span>
            <span></span>
            <span>￥{{report.SalesMoney}}元</span>
          </div>
          <div v-for="(item,index) in items">
            <collect :last="index==items.length-1" :item="item" :key="index" :type="'card'"></collect>
          </div>
        </div>
        <div class="footer" v-show="isOver">
          <span v-if="items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</span>
          <span v-if="items.length==0">该卡没有销售记录 =_="</span>
        </div>
        <div class="footer" v-show="isLoading">加载中...</div>
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
  import collect from '@/components/collect'

  export default {
    components: {
      title, collect
    },

    data () {
      return {
        card: {},
        items: [],
        report: {},
        titleHeight: null,
        page: 1,
        firstLoad: false,
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
        this.getStorePrepaidCardSalesInfo(this.page)
      },
      getStorePrepaidCardSalesInfo (page) {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCardSalesInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          PrepaidCardId: this.cardId,
          PageSize: 10,
          PageIndex: page
        }, this.firstLoad).then(res => {
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
      getStorePrepaidCardSalesSummary () {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCardSalesSummary', {
          Uid: this.userId,
          StoreId: this.storeId,
          PrepaidCardId: this.cardId
        }, this.firstLoad).then(res => {
          that.report = res
          that.firstLoad = false
        })
      }
    },
    onLoad (option) {
      this.card = wx.getStorageSync('cardRecord')
      this.storeId = option.storeId
      this.userId = option.userId
      this.cardId = this.card.PrepaidCardId
      this.titleHeight = this.getGlobalData().titleHeight
      this.page = 1
      this.firstLoad = true
      this.getStorePrepaidCardSalesInfo(1)
      this.getStorePrepaidCardSalesSummary()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .recordcard-page {
    height: 100vh;
    background-color: #f0f0f0;
    .recordcard-scroll {
      height: 90vh;
      .recordcard-main {
        min-height: 80vh;
        .option-context {
          padding-top: rpx(60);
          height: rpx(226);
          padding-left: rpx(40);
          padding-right: rpx(40);
          vertical-align: middle;
          position: relative;
          text-align: center;
          background: white;
          span {
            display: inline-block;
          }
          .option-card {
            text-align: left;
            width: rpx(282);
            height: rpx(160);
            padding: rpx(10);
            box-shadow: rpx(2) rpx(2) rpx(4) rpx(2) #c0c0c0;
            border-radius: rpx(10);
            color: white;
            margin: auto 0;
            .card-hearder {
              height: rpx(40);
              line-height: rpx(40);
              .header-logo {
                width: rpx(40);
                height: rpx(40);
                display: inline-block;
                border-radius: 50%;
                vertical-align: middle;
              }
              .header-name {
                display: inline-block;
                font-size: rpx(18);
                vertical-align: middle;
                margin-left: rpx(10);
                width: rpx(200);
                white-space: nowrap;
              }
              .header-code {
                height: rpx(25);
                width: rpx(25);
                display: inline-block;
                vertical-align: middle;
              }
            }
            .card-content {
              height: rpx(80);
              line-height: rpx(80);
              text-align: center;
              font-size: rpx(50);
            }
            .card-footer {
              padding-left: rpx(5);
              padding-top: rpx(3);
              font-size: rpx(13);
              line-height: rpx(20);
              .footer-number {
                text-shadow: 1px 1px 1px #7a7a7a;
                color: #dcc913;
                font-size: rpx(13);
              }
            }
          }
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
      }
    }
  }
</style>
