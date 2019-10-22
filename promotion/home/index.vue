<template>
  <div class="promotion-page">
    <title :name="'推广得现金'"></title>
    <div class="bg-top"></div>
    <div class="bg-bottom"></div>
    <scroll-view class="promotion-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <img class="promotion-bg" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-bg.png"/>
      <div class="promotion-main" :style="{'min-height':'calc(100vh - '+titleHeight +'px)'}">
        <div style="background: #fdd98e;">
          <div class="promotion-setting">
            <div class="setting-title">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-setting.png"/>
            </div>
            <div class="setting-context">
              <div class="setting-item">
                <span class="item-left">每成功邀请一个</span>
                <span class="item-right">现金100元</span>
              </div>
              <div class="setting-line"></div>
              <div class="setting-heng" v-for="item in 5" :style="{top:(item+1)*8.1+'vw'}"></div>
            </div>
            <div class="setting-rule">
              <span class="rule-line"></span>
              <span class="rule-fang"></span>
              <span class="rule-title">奖励规则:  需同时满足以下两个条件</span>
              <span class="rule-fang"></span>
              <span class="rule-line"></span>
            </div>
            <div class="setting-rule-text">
              <span><img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-1.png"/></span>
              <span>对方须订购软件至少1年</span>
            </div>
            <div class="setting-rule-text">
              <span><img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-2.png"/></span>
              <span>对方须完成商家认证</span>
            </div>
          </div>
          <div class="promotion-code">
            <div class="code-title">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-type.png"/>
            </div>
            <div class="code-context">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/weixinkefu.jpg"
                   @click="showWeixinCode('https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/weixinkefu.jpg')"/>
              <div @click="copyWeixinCode('jgkb6520')">jgkb6520</div>
            </div>
            <div class="code-text">
              添加坚果客服微信, 由客服确认后发送现金红包
            </div>
          </div>
          <div class="promotion-record">
            <div class="record-title">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-record.png"/>
            </div>
            <div class="record-number">
              <div>
                <span>{{info.count}}</span>
                <span>{{info.money}}</span>
              </div>
              <div>
                <span>已邀请商家 (家)</span>
                <span>累计奖励 (元)</span>
              </div>
            </div>
            <div class="record-items">
              <div class="record-item" v-for="item in stores">
                <span class="item-logo">
                  <img :src="item.StoreLogo"/>
                </span>
                <span class="item-name">{{item.StoreName}}</span>
                <span class="item-info" v-if="item.State">
                  <span v-if="item.IsRebate" style="color: #EC622F">获得{{item.RebatePrice}}元</span>
                  <span
                    v-if="!item.IsRebate">{{item.IsBuy ? '已订购' : '无订购'}}/{{item.IsCertification ? '已认证' : '无认证'}}</span>
                </span>
                <span class="item-info" v-if="!item.State">
                  <span class="item-no">
                    <div>无效</div>
                    <div>{{item.Rcontent}}</div>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div style="height: 30vw">
          </div>
        </div>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="send-button">
      <span @click="jumpToCode">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-gift.png"/>
        <div>当面邀请</div>
      </span>
      <span @click="jumpToSend">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-weixin.png"/>
        <div>发给微信好友</div>
      </span>
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
        stores: [],
        info: {},
        titleHeight: null
      }
    },
    methods: {
      jumpToSend () {
        const url = '../send/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToCode () {
        const url = '../code/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      showWeixinCode (src) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      },
      copyWeixinCode (code) {
        wx.setClipboardData({
          data: code,
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      },
      getItems () {
        let that = this
        this.$post('/recommend/getRecommendStoreList', {
          Uid: that.userId,
          StoreId: that.storeId
        }, true).then(res => {
          that.info = {
            count: res.StoreCount,
            money: res.RebatePriceSum
          }
          if (res.Stores && res.Stores.length > 0) {
            that.stores = res.Stores
          }
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getItems()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      this.getItems()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .promotion-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .bg-top {
      width: 100vw;
      left: 0;
      top: 0;
      height: 50vh;
      background: #fef5d4;
      position: absolute;
    }
    .bg-bottom {
      width: 100vw;
      left: 0;
      bottom: 0;
      height: 50vh;
      background: #fdd98e;
      position: absolute;
    }
    .promotion-scroll {
      height: 90vh;
      position: relative;
      .promotion-bg {
        position: absolute;
        width: 100vw;
        left: 0;
        top: 0;
        height: 129.5vw;
      }
      .promotion-main {
        box-sizing: border-box;
        padding-top: 103.7vw;
        min-height: 80vh;
        position: relative;
        .promotion-setting {
          width: 90vw;
          margin: 0 auto;
          padding-bottom: 7vw;
          background: white;
          box-shadow: 0 2.7vw 0 0 rgba(244, 161, 35, 1);
          border-radius: 5.6vw;
          .setting-title {
            text-align: center;
            position: relative;
            width: 100%;
            height: 10.9vw;
            top: -4vw;
            img {
              display: inline-block;
              vertical-align: top;
              width: 44.7vw;
              height: 9vw;
            }
          }
          .setting-context {
            background: white;
            width: 58vw;
            height: 8.1vw;
            border: 0.3vw solid rgba(236, 98, 47, 1);
            border-radius: 1.5vw;
            margin: 0 auto;
            line-height: 8.1vw;
            overflow: hidden;
            position: relative;
            .setting-item {
              height: 8.1vw;
              line-height: 8.1vw;
              span {
                display: inline-block;
                vertical-align: top;
                height: 8.1vw;
                line-height: 8.1vw;
              }
              .item-left {
                width: 30vw;
                text-align: center;
                background: #fce0d3;
              }
              .item-right {
                width: 27.7vw;
                text-align: center;
              }
            }
            .setting-line {
              width: 0.3vw;
              height: 50vw;
              top: 0;
              left: 29.9vw;
              background: rgba(236, 98, 47, 1);
              position: absolute;
            }
            .setting-heng {
              width: 50vw;
              left: 0;
              height: 0.1vw;
              position: absolute;
              z-index: 1000;
              background: rgba(236, 98, 47, 1);
            }
          }
          .setting-rule {
            padding-top: 6.5vw;
            text-align: center;
            color: #EC622F;
            height: 3.6vw;
            line-height: 3.6vw;
            font-size: 3.5vw;
            text-align: center;
            padding-bottom: 5vw;
            span {
              display: inline-block;
            }
            .rule-line {
              width: 8vw;
              height: 0.1vw;
              vertical-align: middle;
              background: #EC622F;
            }
            .rule-fang {
              height: 1.5vw;
              width: 1.5vw;
              vertical-align: middle;
              background: #EC622F;
              transform: rotate(45deg);
              margin: 0 1.5vw;
            }
            .rule-title {
              padding: 0 1.2vw;
              vertical-align: top;
              height: 3.6vw;
              line-height: 3.6vw;
              font-weight: 600;
            }
          }
          .setting-rule-text {
            height: 4.5vw;
            line-height: 4.5vw;
            padding-left: 8.5vw;
            padding-bottom: 3.4vw;
            img {
              display: inline-block;
              vertical-align: top;
              width: 5vw;
              height: 4.5vw;
            }
            span {
              display: inline-block;
              height: 4.5vw;
              vertical-align: top;
              line-height: 4.5vw;
              font-weight: 600;
              font-size: 3.7vw;
              &:nth-child(1) {
                padding-right: 3.4vw;
              }
            }
          }
        }
        .promotion-code {
          width: 90vw;
          margin: 13.6vw auto;
          background: white;
          box-shadow: 0 2.7vw 0 0 rgba(244, 161, 35, 1);
          border-radius: 5.6vw;
          .code-title {
            text-align: center;
            position: relative;
            width: 100%;
            height: 10vw;
            top: -4vw;
            img {
              display: inline-block;
              vertical-align: top;
              width: 54vw;
              height: 9vw;
            }
          }
          .code-context {
            text-align: center;
            img {
              height: 40vw;
              width: 40vw;
              display: inline-block;
              vertical-align: top;
            }
          }
          .code-text {
            text-align: center;
            padding: 3vw 0 9.3vw 0;
            font-size: 4vw;
            color: #655651;
          }
        }
        .promotion-record {
          width: 90vw;
          margin: 0 auto;
          background: white;
          box-shadow: 0 2.7vw 0 0 rgba(244, 161, 35, 1);
          border-radius: 5.6vw;
          .record-title {
            text-align: center;
            position: relative;
            width: 100%;
            height: 10.9vw;
            top: -4vw;
            img {
              display: inline-block;
              vertical-align: top;
              width: 54vw;
              height: 9vw;
            }
          }
          .record-number {
            padding-top: 3.2vw;
            div {
              &:nth-child(1) {
                height: 6.3vw;
                line-height: 6.3vw;
                font-size: 6.5vw;
                font-weight: 600;
              }
              &:nth-child(2) {
                padding-top: 1.9vw;
                height: 3.1vw;
                line-height: 3.1vw;
                padding-bottom: 9.4vw;
                font-size: 3.2vw;
              }
              span {
                display: inline-block;
                width: 50%;
                text-align: center;
                color: #EC622F;
              }
            }
          }
          .record-items {
            padding: 0 0 5vw 7.5vw;
            .record-item {
              padding-bottom: 5.9vw;
              span {
                display: inline-block;
                line-height: 10.5vw;
                height: 10.5vw;
                vertical-align: top;
              }
              .item-logo {
                width: 10.5vw;
                height: 10.5vw;
                padding-right: 2.1vw;
                img {
                  display: inline-block;
                  height: 10.5vw;
                  width: 10.5vw;
                  border-radius: 50%;
                }
              }
              .item-name {
                width: 25vw;
                font-size: 3.5vw;
                color: #545454;
              }
              .item-info {
                width: 37.6vw;
                font-size: 3.5vw;
                text-align: right;
                color: #9E9D9D;
                .item-no {
                  height: 7vw;
                  line-height: 3.5vw;
                  vertical-align: middle;
                  font-size: 3.2vw;
                }
              }
            }
          }
        }
      }
    }
    .send-button {
      position: fixed;
      height: 20vw;
      width: 100vw;
      left: 0;
      bottom: 0;
      background: #F4A123;
      text-align: center;
      box-sizing: border-box;
      padding: 2vw 10vw 0 10vw;
      z-index: 2000;
      span {
        display: inline-block;
        width: 50%;
        vertical-align: top;
      }
      img {
        display: inline-block;
        vertical-align: top;
        width: 11vw;
        height: 11vw;
      }
      div {
        padding-top: 1vw;
        height: 3vw;
        font-size: 3vw;
        color: white;
      }
    }
  }
</style>
