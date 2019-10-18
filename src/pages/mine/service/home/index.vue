<template>
  <div class="service-home-page">
    <title :name="'坚果服务'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <div class="service-top-bg"></div>
    <scroll-view class="service-home-scroll" :scroll-y="!showGift"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-home-context">
        <div class="part-one">
          <div class="service-card"
               :style="{background:'url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/service-card-bg'+(isOverdue?'2.png)':'.png)'),'background-size':'100%,100%'}">
            <div class="card-top" @click="jumpToRenew">
              <span class="card-left">
                <span class="top-circular" :style="{filter:isOverdue?'grayscale(100%)':''}">
                </span>
                <span class="top-circular circular2" :style="{filter:isOverdue?'grayscale(100%)':''}">
                </span>
                <span class="top-times" :style="{filter:isOverdue?'grayscale(100%)':''}">
                  有效期至 : {{date}}
                </span>
                <div class="top-renew">
                  <span>
                    立即续费
                  </span>
                </div>
              </span>
              <span class="card-right">
                <img v-if="!isOverdue" class="right-bg" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/service-bg.png"/>
                <img v-if="isOverdue" class="right-bg2" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/service-bg2.png"/>
                <img v-if="!isCertification" class="right-img" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/weirenzheng.png"/>
                <img v-if="isCertification" class="right-img" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/yirenzheng.png"/>
              </span>
            </div>
            <!--<div class="card-middle">
              <span class="middle-left">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nine-day.png"/>
                <div class="middle-title">
                  免交易手续费
                </div>
                <div class="middle-context">
                  前三个月不收取任何费用
                </div>
                <div class="middle-context">
                  （{{store.PayPreferentialBeginDate}} 至 {{store.PayPreferentialEndDate}}）
                </div>
              </span>
              <span class="middle-right">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/three-year.png"/>
                <div class="middle-title">
                  免软件服务费
                </div>
                <div class="middle-context">
                  仅收取支付手续费0.6%
                </div>
                <div class="middle-context">
                  （{{store.FreeBeginDate}} 至 {{store.FreeEndDate}}）
                </div>
              </span>
            </div>-->
            <!--<img class="card-nutcard" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/NUTCARD-text.png"/>-->
            <img v-if="isOverdue" class="card-version" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/yidaoqi.png"/>
            <img v-if="!isOverdue&&softVersion==0" class="card-version" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/shiyongqi.png"/>
          </div>
          <div class="card-logs">
            <span @click="jumpToFee">什么叫支付手续费?</span>
            <span @click="jumpToRecord">我的订购记录</span>
          </div>
          <div class="one-circular">
            <div></div>
          </div>
        </div>
        <div class="in-middle"></div>
        <div class="banner" @click="jumpToPromotion">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/banner.png"/>
        </div>
        <div class="in-middle"></div>
        <div class="part-two">
          <span @click="jumpToAccount">
            <div class="two-logo">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/edit-phone.png" style="width: 8vw;height: 9vw;"/>
            </div>
            <div class="two-title">
              修改手机号
            </div>
          </span>
          <span @click="jumpToExport">
            <div class="two-logo">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export.png" style="width: 7.3vw;height: 9vw;"/>
            </div>
            <div class="two-title">
              导出数据
            </div>
          </span>
          <span @click="jumpToTable">
            <div class="two-logo">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/taipai.png" style="width: 10.7vw;height: 8.8vw;"/>
            </div>
            <div class="two-title">
              我要台牌
            </div>
          </span>
          <span @click="jumpToContract">
            <div class="two-logo">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/hetong.png" style="width: 8.2vw;height: 8.7vw;"/>
            </div>
            <div class="two-title">
              我要合同
            </div>
          </span>
        </div>
        <div class="in-middle"></div>
        <div class="part-three">
          <div class="three-title">
            <span>
              <span class="three-icon"></span>
            </span>
            <span style="padding-left: 2vw">常见问题</span>
          </div>
          <div class="three-items">
            <!--<div class="three-item">
              <span>数据案例怎么保障？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="three-item">
              <span>顾客付款后怎么收到款？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="three-item">
              <span>老会员怎么处理？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="three-item">
              <span>怎么快速使用？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="three-item">
              <span>怎样进行营销增加收入？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>-->
            <div class="three-item" @click="jumpToBusiness">
              <span>坚果软件能帮商家解决哪些问题？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="three-item" style="border-bottom: 0;" @click="jumpToHelp">
              <span>新用户使用步骤（教程）？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <!--<div class="three-item" style="border-bottom: 0;">
              <span>顾客怎样使用？</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>-->
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 8vw;height: 7.9vw;line-height: 7.9vw;">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="version">v{{version}}</div>
      <div class="service-home-foot">
        <div>010-52905560</div>
        <div>北京领客先行科技有限公司</div>
        <div>Beijing Lingkexianxing Technology Co.Ltd.</div>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="service-home-gift" v-if="showGift" :animation="animationBg">
      <div class="gift-card" :animation="animationContext">
        <div class="card-border">
          <div class="card-context">
            <div class="context-title">
              <div>将会员卡放进微信卡包</div>
              <div>补贴计划</div>
            </div>
            <div class="context-middle">
              <div class="middle-info">
                <div class="info-title">
                  <span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/gift-icon.png"/>
                  </span>
                  <span>前3个月完全免费</span>
                </div>
                <div class="info-context">
                  <div class="context-item">
                    <span>
                      90天交易手续费补贴
                    </span>
                    <span>已赠送</span>
                  </div>
                  <div class="context-item" style="padding-top: 2.6vw">
                    <span>
                      90天软件服务费补贴
                    </span>
                    <span>已赠送</span>
                  </div>
                </div>
              </div>
              <div class="middle-info">
                <div class="info-title">
                  <span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/gift-icon.png"/>
                  </span>
                  <span>3年免软件服务费</span>
                </div>
                <div class="info-context">
                  <div class="context-item">
                    <span>
                      交易手续费补贴
                    </span>
                    <span style="width: 13.4vw">收取(0.6%)</span>
                  </div>
                  <div class="context-item" style="padding-top: 2.6vw">
                    <span>
                      3年软件服务费补贴
                    </span>
                    <span>已赠送</span>
                  </div>
                </div>
              </div>
              <div class="middle-bottom">
                <div>
                  补贴活动时间截止：2019年5月1日
                </div>
                <div>
                  截止日之前注册的商家均可享受此补贴
                </div>
              </div>
            </div>
            <div class="context-button">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/gift-button.png"/>
                <div @click="getGift">领 取</div>
              </span>
            </div>
          </div>
        </div>
        <img class="border-img" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/gift-border.png"/>
      </div>
    </div>
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
        store: {},
        date: {},
        version: '',
        animationBg: {},
        animationContext: {},
        showGift: true
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      },
      isCertification () {
        return this.$store.getters.GET_ISCERTIFICATION
      },
      softVersion () {
        return this.$store.getters.GET_SOFTVERSION
      }
    },
    methods: {
      jumpToPromotion () {
        const url = '../../promotion/home/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToRecord () {
        const url = '../record/main?storeId=' + this.storeId + '&userId=' + this.userId
        console.log(url)
        wx.navigateTo({url})
      },
      jumpToHelp () {
        const url = '../help/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToBusiness () {
        const url = '../business/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToRenew () {
        const url = '../renew/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToFee () {
        const url = '../fee/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToAccount () {
        const url = '../../account/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToExport () {
        const url = '../export/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToContract () {
        const url = '../../agreement/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      jumpToTable () {
        const url = '../table/main?storeId=' + this.storeId + '&userId=' + this.userId
        wx.navigateTo({url})
      },
      getGift () {
        wx.setStorageSync('showGift', true)
        let animationBg = wx.createAnimation()
        animationBg.opacity(0).step({duration: 200})
        this.animationBg = animationBg.export()
        let animationContext = wx.createAnimation()
        animationContext.top('20vw').step({duration: 200})
        this.animationContext = animationContext.export()
        setTimeout(function () {
          this.showGift = false
        }.bind(this), 250)
      },
      getStoreInfo () {
        let that = this
        this.$post('/soft/businessGetSoftServerFreeDate', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.store = res
        })
        this.$post('/soft/businessGetSoftServerEndDate', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.date = res.ServiceEndDate
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.showGift = false
      /* setTimeout(function () {
       if (wx.getStorageSync('showGift')) {
       this.showGift = false
       } else {
       this.showGift = true
       let animationBg = wx.createAnimation()
       animationBg.opacity(1).step({duration: 200})
       this.animationBg = animationBg.export()
       let animationContext = wx.createAnimation()
       animationContext.top('0vw').step({duration: 200})
       this.animationContext = animationContext.export()
       }
       }.bind(this), 500) */
      this.getStoreInfo()
      this.titleHeight = this.getGlobalData().titleHeight
      this.version = this.getGlobalData().version
    },
    onShow () {
      this.getStoreInfo()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-home-page {
    background: #f0f0f0;
    .service-top-bg {
      position: absolute;
      top: 0;
      left: 0;
      height: 40vh;
      z-index: 1;
      width: 100vw;
      background: #2e2e30;
    }
    .service-home-scroll {
      position: relative;
      z-index: 2;
      .service-home-context {
        .part-one {
          height: 66vw;
          padding-top: 6vw;
          box-sizing: border-box;
          background: #2e2e30;
          position: relative;
          overflow: hidden;
          .service-card {
            margin: 0 auto;
            width: 90vw;
            height: 43.3vw;
            box-sizing: border-box;
            border-radius: 2.8vw;
            position: relative;
            z-index: 2;
            // background-image: -webkit-gradient(linear, left 0, right 0, from(rgb(215, 180, 117)), to(rgb(245, 216, 169)));
            box-shadow: 0vw 1vw 2vw 0.5vw rgba(128, 128, 128, 0.5);
            .card-top {
              padding: 0.9vw 0vw 0 0;
              position: relative;
              z-index: 10;
              span {
                display: inline-block;
                vertical-align: top;
              }
              .card-left {
                padding-top: 10.4vw;
                width: 51.6vw;
                position: relative;
                left: 5.7vw;
                z-index: 10;
                .top-circular {
                  width: 4.7vw;
                  height: 4.7vw;
                  background: #7C581C;
                  border-radius: 50%;
                }
                .circular2 {
                  background: rgba(173, 126, 33, 0.5);
                  z-index: 3;
                  position: relative;
                  left: -1.5vw;
                }
                .top-times {
                  height: 4.7vw;
                  line-height: 4.7vw;
                  font-size: 3.2vw;
                  font-weight: 600;
                  position: relative;
                  left: -0.1vw;
                  color: #7C581C;
                }
                .top-renew {
                  padding-top: 3.3vw;
                  padding-left: 6.5vw;
                  span {
                    box-sizing: border-box;
                    width: 23vw;
                    text-align: center;
                    border: 0.3vw solid #7C581C;
                    line-height: 5.8vw;
                    font-size: 3.5vw;
                    border-radius: 2.9vw;
                    color: #7C581C;
                    letter-spacing: 0.3vw;
                    font-weight: 600;
                  }
                }
              }
              .card-right {
                width: 38.3vw;
                position: relative;
                z-index: 9;
                .right-bg {
                  position: absolute;
                  top: 0.9vw;
                  width: 38.1vw;
                  height: 36.7vw;
                  right: 0;
                }
                .right-bg2 {
                  position: absolute;
                  top: 2.7vw;
                  right: 2.4vw;
                  width: 30.8vw;
                  height: 30.8vw;
                }
                .right-img {
                  top: 7vw;
                  right: 8.6vw;
                  position: absolute;
                  width: 18.2vw;
                  height: 19.7vw;
                }
              }
            }
            .card-middle {
              text-align: center;
              position: relative;
              top: -1.4vw;
              z-index: 10;
              color: #7F561C;
              span {
                display: inline-block;
              }
              .middle-left {
                width: 30vw;
                img {
                  width: 23.9vw;
                  height: 24vw;
                }
                div {
                  position: relative;
                  top: -1.5vw;
                }
                .middle-title {
                  font-size: 2.5vw;
                  font-weight: 600;
                }
                .middle-context {
                  font-size: 2vw;
                }
              }
              .middle-right {
                width: 30vw;
                img {
                  width: 24.4vw;
                  height: 23.6vw;
                }
                div {
                  position: relative;
                  top: -1.5vw;
                }
                .middle-title {
                  font-size: 2.5vw;
                  font-weight: 600;
                }
                .middle-context {
                  font-size: 2vw;
                }
              }
            }
            .card-nutcard {
              position: absolute;
              left: 0vw;
              bottom: 0vw;
              z-index: 2;
              width: 89.7vw;
              height: 48.6vw;
            }
            .card-version {
              position: absolute;
              left: 0vw;
              bottom: 3.3vw;
              z-index: 3;
              width: 12.8vw;
              height: 14.6vw;
            }
            .card-gift {
              position: absolute;
              width: 92vw;
              height: 45.5vw;
              right: -2.3vw;
              top: -5vw;
              z-index: 2;
            }
          }
          .card-logs {
            text-align: center;
            font-size: 3.3vw;
            padding-top: 6.3vw;
            position: relative;
            z-index: 10;
            span {
              display: inline-block;
              height: 4vw;
              line-height: 4vw;
              font-weight: 600;
              &:nth-child(1) {
                padding-right: 4.4vw;
                border-right: 0.2vw solid #351808;
              }
              &:nth-child(2) {
                padding-left: 4.4vw;
              }
            }
          }
          .one-circular {
            position: absolute;
            left: -100vw;
            width: 300vw;
            top: 20vw;
            z-index: 1;
            div {
              border-radius: 50%;
              width: 300vw;
              height: 300vw;
              box-sizing: border-box;
              position: relative;
              z-index: 1;
              background: #ffffff;
            }
          }
        }
        .banner {
          width: 100vw;
          height: 28.9vw;
          img {
            display: inline-block;
            vertical-align: top;
            width: 100vw;
            height: 28.9vw;
          }
        }
        .part-two {
          box-sizing: border-box;
          padding: 6.2vw 5vw 6.2vw 5vw;
          background: white;
          span {
            display: inline-block;
            width: 25%;
            text-align: center;
          }
          .two-logo {
            height: 11vw;
            img {
              display: inline-block;
            }
          }
          .two-title {
            font-size: 2.8vw;
          }
        }
        .part-three {
          background: white;
          padding: 6vw 9.5vw 0 9.5vw;
          .three-title {
            height: 3.6vw;
            line-height: 3.6vw;
            font-size: 3.8vw;
            font-weight: 700;
            span {
              display: inline-block;
              height: 3.6vw;
              line-height: 3.6vw;
              box-sizing: border-box;
            }
            .three-icon {
              width: 3vw;
              background: #EBC891;
              height: 1.1vw;
              position: relative;
              top: -0.8vw;
            }
          }
          .three-items {
            .three-item {
              height: 12.6vw;
              line-height: 12.6vw;
              border-bottom: rpx(1) solid #BFBFBF;
              font-size: 3.5vw;
              img {
                height: rpx(21);
                width: rpx(13);
                vertical-align: middle;
              }
              span {
                display: inline-block;
                height: 12.6vw;
                line-height: 12.6vw;
                width: 80%;
                vertical-align: middle;
                &:nth-child(2) {
                  text-align: right;
                  width: 20%;
                }
              }
            }
          }
        }
        .in-middle {
          padding-top: 3vw;
          background: #f0f0f0;
        }
      }
      .service-home-foot {
        width: 100vw;
        text-align: center;
        padding-bottom: 5vw;
        padding-top: 8vw;
        font-size: rpx(22);
        color: #a7a7a7;
        background: #f0f0f0;
        div:nth-child(1) {
          font-size: rpx(34);
          padding-bottom: 1.2vh;
        }
      }
      .version {
        background: #f0f0f0;
        text-align: center;
        font-size: rpx(22);
        color: #a7a7a7;
      }
    }
    .service-home-gift {
      background: rgba(0, 0, 0, 0.7);
      position: fixed;
      padding-top: 35vw;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      top: 0;
      left: 0;
      z-index: 1001;
      opacity: 0;
      .gift-card {
        margin: auto auto;
        width: 75.1vw;
        height: 113.1vw;
        border-radius: 3.7vw;
        background: #2f3031;
        box-sizing: border-box;
        padding: 3.4vw 3.1vw;
        position: relative;
        top: 20vw;
        .card-border {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 0.1vw solid rgba(215, 179, 122, 1);
          border-radius: 3.7vw;
          .card-context {
            position: relative;
            z-index: 1003;
            .context-title {
              padding-top: 3.3vw;
              padding-bottom: 4.3vw;
              text-align: center;
              div {
                padding-top: 1.6vw;
                height: 4.4vw;
                font-size: 4.4vw;
                font-family: MicrosoftYaHei-Bold;
                font-weight: 700;
                color: rgba(243, 213, 165, 1);
                line-height: 4.4vw;
              }
            }
            .context-middle {
              margin: 0 auto;
              box-sizing: border-box;
              padding-top: 1.8vw;
              width: 61.3vw;
              height: 66vw;
              background: rgba(242, 213, 164, 1);
              border-radius: 3.7vw;
              .middle-info {
                padding-top: 4.4vw;
                padding-left: 6.7vw;
                .info-title {
                  height: 3.7vw;
                  line-height: 3.7vw;
                  span {
                    vertical-align: top;
                    display: inline-block;
                    height: 3.7vw;
                    line-height: 3.7vw;
                    &:nth-child(1) {
                      width: 4.6vw;
                    }
                    &:nth-child(2) {
                      font-size: 3.5vw;
                      font-family: PingFang-SC-Heavy;
                      font-weight: 800;
                      color: rgba(46, 46, 48, 1);
                    }
                  }
                  img {
                    display: inline-block;
                    vertical-align: top;
                    width: 3.3vw;
                    height: 3.7vw;
                  }
                }
                .info-context {
                  padding-top: 2.2vw;
                  .context-item {
                    height: 3.8vw;
                    line-height: 3.8vw;
                    span {
                      display: inline-block;
                      vertical-align: top;
                      height: 3.8vw;
                      line-height: 3.8vw;
                      &:nth-child(1) {
                        width: 30.1vw;
                        font-size: 2.8vw;
                        color: rgba(46, 46, 48, 1);
                      }
                      &:nth-child(2) {
                        width: 9.4vw;
                        height: 3.8vw;
                        background: rgba(119, 77, 26, 1);
                        border-radius: 1.9vw;
                        text-align: center;
                        font-size: 2vw;
                        color: rgba(219, 190, 143, 1);
                      }
                    }
                  }
                }
              }
              .middle-bottom {
                margin-top: 4.7vw;
                height: 11.9vw;
                background: rgba(219, 190, 143, 1);
                text-align: center;
                div {
                  font-size: 2.4vw;
                  height: 2.3vw;
                  line-height: 2.3vw;
                  font-family: PingFang-SC-Bold;
                  font-weight: 600;
                  color: rgba(119, 77, 26, 1);
                  &:nth-child(1) {
                    padding-top: 2.7vw;
                  }
                  &:nth-child(2) {
                    padding-top: 1.3vw;
                  }
                }
              }
            }
            .context-button {
              padding-top: 5.6vw;
              text-align: center;
              span {
                display: inline-block;
                width: 37.1vw;
                height: 8.8vw;
                position: relative;
              }
              img {
                display: inline-block;
                width: 37.1vw;
                height: 8.8vw;
              }
              div {
                text-align: center;
                position: absolute;
                top: 0;
                width: 37.1vw;
                padding-top: 2.1vw;
                font-size: 4.2vw;
                font-family: MicrosoftYaHei-Bold;
                font-weight: 700;
                color: rgba(118, 84, 30, 1);
                height: 4.1vw;
                line-height: 4.1vw;
              }
            }
          }
        }
        .border-img {
          position: absolute;
          width: 80.4vw;
          height: 124.4vw;
          z-index: 1002;
          left: -2.1vw;
          top: -2.2vw;
        }
      }
    }
  }
</style>
