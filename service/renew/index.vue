<template>
  <div class="service-renew-page">
    <title :name="'软件订购'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-renew-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-renew-main" :style="{'min-height':'calc(100vh - '+titleHeight +'px)'}">
        <div class="renew-top">
          <div class="top-current">
            <span class="top-circular"></span>
            <span class="top-circular circular2"></span>
            <span>当前版本：{{softInfo.SoftVersion == 10 ? '高级版' : softVersions[softInfo.SoftVersion]}}</span>
            <span style="padding-left: 4vw">到期时间：{{softInfo.ServiceEndDate}}</span>
          </div>
          <div class="top-items">
            <span class="top-item" v-for="item in items" :key="index" @click="getSoftPay(item.SoftVersion)"
                  :class="currentVersion==item.SoftVersion?'top-item-current':''">
              <div class="top-item-bg"></div>
              <div class="item-logo">
                <img
                  :src="'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-item-'+item.SoftVersion+(currentVersion==item.SoftVersion?'-check':'')+'.png'"/>
              </div>
              <div class="item-title">
                {{item.VersionName}}
              </div>
            </span>
          </div>
        </div>
        <div class="renew-context" :style="{'min-height':'calc(100vh - 37.8vw - '+titleHeight +'px)'}">
          <div class="context-none" v-if="currentVersion==0">
            ———— &nbsp;&nbsp; 请选择要订购的版本 &nbsp;&nbsp; ————
          </div>
          <div class="context-remark" v-if="currentVersion!=0">
            <div class="remark-title">
              版本说明
            </div>
            <div class="remark-items">
              <div class="remark-item">
                <span class="item-logo">
                  <span></span>
                  <img style="width: 3.5vw;height: 2.6vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-1.png"/>
                </span>
                <span class="item-title">电子会员卡</span>
                <span class="item-context">
                  <span></span>
                  <img style="width: 2.5vw;height: 2.1vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-check.png"/>
                </span>
              </div>
              <div class="remark-item">
                <span class="item-logo">
                  <span></span>
                  <img style="width: 3.3vw;height: 3.1vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-2.png"/>
                </span>
                <span class="item-title">会员管理</span>
                <span class="item-context">
                  <span v-if="currentItem.MaxMemberCount">
                    限{{currentItem.MaxMemberCount}}会员
                  </span>
                  <span v-else="">不限</span>
                </span>
              </div>
              <div class="remark-item">
                <span class="item-logo">
                  <span></span>
                  <img style="width: 3.1vw;height: 3.3vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-3.png"/>
                </span>
                <span class="item-title">预约</span>
                <span class="item-context">
                  <span>
                  </span>
                  <img style="width: 2.5vw;height: 2.1vw" v-if="currentVersion==4||currentVersion==10"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-check.png"/>
                  <img style="width: 2.2vw;height: 2.2vw" v-else=""
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-uncheck.png"/>
                </span>
              </div>
              <div class="remark-item">
                <span class="item-logo">
                  <span></span>
                  <img style="width: 3.1vw;height: 3.1vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-4.png"/>
                </span>
                <span class="item-title">营销</span>
                <span class="item-context">
                  <span>
                  </span>
                  <img style="width: 2.5vw;height: 2.1vw" v-if="currentVersion==5||currentVersion==10"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-check.png"/>
                  <img style="width: 2.2vw;height: 2.2vw" v-else=""
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-uncheck.png"/>
                </span>
              </div>
              <div class="remark-item">
                <span class="item-logo">
                  <span></span>
                  <img style="width: 3vw;height: 2.4vw"
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-1.png"/>
                </span>
                <span class="item-title">其他</span>
                <span class="item-context">
                  <span></span>
                  <span v-if="currentPrice&&currentPrice.GiveSmsCount">
                    附赠{{currentPrice.GiveSmsCount}}条短信
                  </span>
                  <img style="width: 2.2vw;height: 2.2vw" v-else=""
                       src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-remark-uncheck.png"/>
                </span>
              </div>
            </div>
            <div class="remark-bottom"></div>
          </div>
          <div class="context-year" v-if="currentVersion!=0&&prices&&prices.length>0&&currentItem.BtnState==1">
            <div class="year-title">
              订购周期
            </div>
            <div class="year-items">
              <div class="year-item" :class="item.Id==currentPrice.Id?'year-item-select':''" v-for="item in prices"
                   :key="index"
                   @click="choosePrice(item)">
                <span>{{item.CycleTitle}}</span>
                <span><text>¥</text> {{item.DiscountPrice}}</span>
              </div>
            </div>
          </div>
          <div class="context-year" v-if="currentItem.BtnState==2">
            <div class="year-title">
              升级周期
            </div>
            <div class="year-items">
              <div class="year-item year-item-select">
                <span style="font-size: 3.3vw">{{currentItem.UpGradeCycle}}</span>
                <span><text>¥</text> {{currentItem.UpGradePrice}}</span>
              </div>
            </div>
          </div>
          <div class="context-none" v-if="currentItem.BtnState==0">
            ———— &nbsp;&nbsp; 如您有降低版本的需求，请联系客服 &nbsp;&nbsp; ————
          </div>
          <div class="context-button" v-if="currentItem.BtnState==2||currentItem.BtnState==1"
               :style="{'padding-bottom':tabBarHeight+'vw'}"></div>
        </div>
        <div class="renew-button" v-if="currentItem.BtnState==2||currentItem.BtnState==1"
             :style="{'padding-bottom':tabBarHeight+'vw'}">
          <span @click="pay">{{currentItem.BtnState == 1 ? '立即订购' : '立即升级'}}</span>
        </div>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showRenew">
      <renew :item="currentItem" @close="showRenew=false"></renew>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import renew from '@/components/renew'

  export default {
    components: {
      title, renew
    },
    computed: {
      tabBarHeight () {
        return this.$store.state.tabBarHeight
      }
    },
    data () {
      return {
        items: [],
        prices: [],
        currentIndex: 0,
        currentVersion: 0,
        currentItem: {},
        currentPrice: {},
        showRenew: false,
        softInfo: {},
        softVersions: ['', '试用版', '基础版', '标准版', '预约版', '营销版'],
        titleHeight: null
      }
    },
    methods: {
      jumpToSuccess () {
        const url = '../success/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.redirectTo({url})
      },
      openRenew () {
        this.currentItem = this.items[this.currentIndex]
        this.showRenew = true
      },
      pay () {
        let that = this
        this.$post('/soft/businessPaySoftPrice', {
          StoreId: this.storeId,
          SoftPriceId: this.currentItem.BtnState === 1 ? this.currentPrice.Id : 0,
          UpSoftVersion: this.currentItem.BtnState === 1 ? null : this.currentVersion,
          Uid: this.userId
        }).then(res => {
          that.weixinPay(res.SoftOrderId)
        })
      },
      weixinPay (id) {
        let that = this
        this.$post('/pay/getBusinessPayParam', {
          OrderId: id,
          PayType: 0,
          OrderType: 1,
          StoreId: this.storeId,
          Uid: this.userId
        }, true).then(result => {
          let res = JSON.parse(result.ParmJson)
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: function () {
              that.jumpToSuccess()
              that.getSoftServerInfo()
            }
          })
        })
      },
      getSoftServerInfo () {
        let that = this
        this.$post('/soft/getSoftServerInfo', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          that.$store.commit('overdueInfo', res)
        })
      },
      choosePrice (item, index) {
        this.currentPrice = item
      },
      getSoftPay (index) {
        this.currentVersion = index
        let that = this
        this.$post('/soft/businessGetSoftPrice', {
          Uid: this.userId,
          StoreId: this.storeId,
          SoftVersion: this.currentVersion
        }, true).then(res => {
          that.currentItem = res
          that.prices = res.SoftPrices
          if (res.SoftPrices && res.SoftPrices.length > 0) {
            that.choosePrice(res.SoftPrices[0], 0)
          } else {
            this.currentPrice = null
          }
        })
      },
      getCouponInfo (code) {
        let that = this
        this.$post('/soft/businessGetSoftDiscountCoupon', {
          Uid: this.userId,
          StoreId: this.storeId,
          Code: code
        }, true).then(res => {
          res.Code = code
          that.currentItem = res
          that.showRenew = true
        })
      },
      getEndDate () {
        let that = this
        this.$post('/soft/getSoftServerInfo', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.softInfo = res
        })
      },
      getVersions () {
        let that = this
        this.$post('/soft/businessGetSoftVersions', {
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.items = res.Versions
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.showRenew = false
      if (option.code) {
        this.getCouponInfo(option.code)
      }
      this.currentIndex = 0
      this.currentVersion = 0
      this.prices = []
      this.currentItem = {}
      this.currentPrice = {}
      this.getVersions()
      this.getEndDate()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-renew-page {
    height: 100vh;
    background: #2E2E30;
    .service-renew-scroll {
      height: 90vh;
      .service-renew-main {
        min-height: 80vh;
        background: #2E2E30;
        .renew-top {
          padding: 4vw 0vw 7vw 5.1vw;
          .top-current {
            height: 3.5vw;
            line-height: 3.5vw;
            color: #ACADB3;
            font-size: 2.8vw;
            padding-bottom: 4.3vw;
            span {
              display: inline-block;
              vertical-align: top;
            }
            .top-circular {
              width: 3.5vw;
              height: 3.5vw;
              background: #7C581C;
              border-radius: 50%;
            }
            .circular2 {
              background: rgba(189, 140, 82, 0.71);
              z-index: 3;
              position: relative;
              left: -1.3vw;
            }
          }
          .top-items {
            height: 19vw;
            .top-item {
              width: 16vw;
              height: 19vw;
              margin-right: 2.6vw;
              border-radius: 0.9vw;
              background-color: #3D3D3D;
              color: white;
              display: inline-block;
              vertical-align: top;
              position: relative;
              .top-item-bg {
                background-image: url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-bg-black.png);
                background-size: 120%, 120%;
                position: absolute;
                left: 0;
                top: 0;
                width: 16vw;
                height: 19vw;
                z-index: 1;
              }
              .item-logo {
                width: 5.8vw;
                height: 5.8vw;
                padding: 3.7vw 0 3.4vw 2.4vw;
                position: relative;
                z-index: 2;
                img {
                  display: inline-block;
                  vertical-align: top;
                  width: 5.8vw;
                  height: 5.8vw;
                }
              }
              .item-title {
                line-height: 2.6vw;
                padding-left: 2.2vw;
                font-size: 2.8vw;
                position: relative;
                z-index: 2;
              }
            }
            .top-item-current {
              background-image: linear-gradient(135deg, #BD9354 0%, #BD9354 20%, #E7C899 50%, #E7C899 80%, #BD9354 100%);
              .top-item-bg {
                background-image: url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/renew-bg-gold.png);
              }
              color: #2E2E30;
            }
          }
        }
        .renew-context {
          border-top-left-radius: 7.4vw;
          border-top-right-radius: 7.4vw;
          background: white;
          .context-none {
            padding-top: 16.5vw;
            text-align: center;
            color: #ACADB3;
            font-size: 3.5vw;
          }
          .context-button {
            height: 16.3vw;
          }
          .context-remark {
            .remark-title {
              padding-top: 6.9vw;
              padding-left: 9.4vw;
              line-height: 3.4vw;
              font-size: 3.5vw;
              color: #ACADB3;
              font-weight: 600;
            }
            .remark-items {
              padding: 2vw 21vw 4vw 21vw;
              .remark-item {
                width: 58vw;
                position: relative;
                font-size: 3vw;
                span {
                  height: 8vw;
                  line-height: 8vw;
                  display: inline-block;
                  vertical-align: middle;
                }
                img {
                  display: inline-block;
                  vertical-align: middle;
                }
                .item-logo {
                  width: 6vw;
                }
                .item-title {
                  width: 27vw;
                }
                .item-context {
                  width: 25vw;
                  text-align: right;
                  color: #D5AB66;
                }
              }
              .remark-item:not(:last-child):after {
                position: absolute;
                content: '';
                width: 120%;
                left: -10%;
                bottom: 0;
                height: 1px;
                background-image: linear-gradient(90deg, #ffffff 0%, #dddddd 25%, #dddddd 75%, #ffffff 100%);
                transform: scale(1, 0.4);
                transform-origin: center bottom;
              }
            }
            .remark-bottom {
              height: 2.5vw;
              background: #F0F0F0;
            }
          }
          .context-year {
            padding-top: 6.2vw;
            padding-left: 9.5vw;
            padding-right: 9.5vw;
            .year-title {
              font-size: 3.5vw;
              color: #ACADB3;
              font-weight: 600;
              padding-bottom: 3.6vw;
            }
            .year-items {
              position: relative;
              .year-item {
                height: 13.5vw;
                line-height: 13.5vw;
                padding-left: 6.4vw;
                padding-right: 6.6vw;
                font-size: 4.3vw;
                color: #2E2E30;
                border: 1px solid white;
                border-radius: 0.9vw;
                span {
                  display: inline-block;
                  vertical-align: top;
                  width: 68%;
                  &:nth-child(2) {
                    text-align: right;
                    font-size: 4.8vw;
                    font-weight: 600;
                    color: #D5AB66;
                    width: 32%;
                  }
                }
                text {
                  display: inline-block;
                  height: 3.5vw;
                  line-height: 3.5vw;
                  transform-origin: bottom right;
                  transform: scale(0.65, 0.65);
                }
              }
              .year-item-select {
                border: 1px solid #B69663;
              }
            }
          }
        }
        .renew-button {
          height: 12.7vw;
          width: 91.6vw;
          padding-top: 3.6vw;
          text-align: right;
          padding-right: 8.4vw;
          box-shadow: 0px 0.2vw 2.2vw 0px rgba(21, 18, 25, 0.3);
          background: white;
          position: fixed;
          bottom: 0;
          left: 0;
          span {
            display: inline-block;
            vertical-align: top;
            width: 31.1vw;
            height: 9.2vw;
            line-height: 9.2vw;
            background: linear-gradient(90deg, rgba(216, 180, 113, 1), rgba(230, 198, 138, 1), rgba(246, 217, 166, 1));
            border-radius: 0.9vw;
            text-align: center;
            font-size: 4.1vw;
            font-weight: 600;
            color: #775417;
          }
        }
      }
    }
  }
</style>
