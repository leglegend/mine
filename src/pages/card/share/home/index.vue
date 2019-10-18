<template>
  <div class="share-home-page">
    <title :name="'领取会员卡'"></title>
    <scroll-view class="share-home-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="share-home-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="share-context-top">
          <div class="share-background">
            <div></div>
          </div>
          <div class="share-card" v-if="card&&card.CardName">
            <card :card="card"></card>
          </div>
          <div class="card-price">
            ￥{{card.Price}}
          </div>
        </div>
        <div class="share-middle">
        </div>
        <div class="share-bottom">
          <div class="share-code">
            <img :src="qrCode"/>
          </div>
          <div class="share-button">
            <span @click="jumpToNutCard">发给微信好友</span>
          </div>
          <div class="download-button">
            <span @click="downloadImages">存入相册</span>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="painter-model">
      <painter @imgOK="onImgOk" @imgErr="onImgOk" :palette="template"/>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import card from '@/components/card'

  export default {
    components: {
      title, card
    },

    data () {
      return {
        card: {},
        template: {},
        isDownloading: false,
        qrCode: '',
        titleHeight: null
      }
    },
    methods: {
      jumpToNutCard () {
        let path = 'pages/share/main?storeId=' + this.storeId + '&userId=' + this.userId + '&prepaidCardId=' + this.cardId
        let url = this.getGlobalUrl().url
        if (url.indexOf('test') > 0) {
          path += '&type=test'
        } else if (url.indexOf('home') > 0) {
          path += '&type=home'
        }
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: path,
          envVersion: 'trial'
        })
      },
      downloadImages () {
        this.isDownloading = true
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        let views = []
        let left = 119
        let top = 181
        // 背景图片
        views.push({
          type: 'image',
          url: this.card.CardImg + '?x-oss-process=image/blur,r_20,s_15',
          css: {
            width: '770rpx',
            height: '461rpx',
            mode: 'scaleToFill',
            top: '0rpx',
            left: '-10rpx'
          }
        })
        // 背景遮罩
        views.push({
          type: 'rect',
          css: {
            width: '750rpx',
            height: '1115rpx',
            top: '0rpx',
            left: '0rpx',
            color: 'rgba(0, 0, 0, 0.2)'
          }
        })
        // 背景
        views.push({
          type: 'rect',
          css: {
            width: '2250rpx',
            height: '2250rpx',
            top: '340rpx',
            left: '-750rpx',
            color: '#ffffff',
            borderRadius: '1125rpx'
          }
        })
        // 标题
        views.push({
          type: 'image',
          url: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buy-card.png',
          css: {
            width: '413rpx',
            height: '110rpx',
            mode: 'scaleToFill',
            top: '30rpx',
            left: '169rpx'
          }
        })
        // 卡面
        views.push({
          type: 'image',
          url: this.card.CardImg,
          css: {
            width: '512rpx',
            height: '315rpx',
            mode: 'scaleToFill',
            top: '181rpx',
            left: '119rpx',
            borderRadius: '15rpx',
            shadow: '10rpx 10rpx 5rpx #888888'
          }
        })
        // 门店LOGO
        views.push({
          type: 'image',
          url: this.card.StoreLogo,
          css: {
            width: '60rpx',
            height: '60rpx',
            mode: 'scaleToFill',
            top: '211rpx',
            left: '145rpx',
            borderRadius: '35rpx'
          }
        })
        // 门店名称
        views.push({
          type: 'text',
          text: this.card.StoreName,
          css: {
            top: '229rpx',
            left: '216rpx',
            fontSize: '24rpx',
            color: '#ffffff'
          }
        })
        // 会员卡名
        views.push({
          type: 'text',
          text: this.card.CardName,
          css: {
            top: '300rpx',
            left: '375rpx',
            fontSize: '57rpx',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center'
          }
        })
        // 剩余额度
        if (this.card.CardType) {
          views.push({
            id: 'cashLeft',
            type: 'text',
            text: '￥',
            css: {
              top: top + 240 + 'rpx',
              left: left + 26 + 'rpx',
              width: '20rpx',
              fontWeight: 'bold',
              fontSize: '25rpx',
              color: '#ffffff'
            }
          })
          views.push({
            type: 'text',
            id: 'cardCash',
            text: this.card.CardValue + '',
            css: {
              top: top + 225 + 'rpx',
              left: left + 51 + 'rpx',
              fontWeight: 'bold',
              fontSize: '40rpx',
              color: '#ffffff'
            }
          })
          if (this.card.CardGivingValue || this.card.CardDiscount !== 10) {
            let text = ''
            if (this.card.CardGivingValue && this.card.CardDiscount !== 10) {
              text = '赠￥' + this.card.CardGivingValue + '  享' + this.card.CardDiscount + '折'
            } else if (this.card.CardGivingValue) {
              text = '赠￥' + this.card.CardGivingValue
            } else {
              text = '享' + this.card.CardDiscount + '折'
            }
            views.push({
              type: 'text',
              text: text,
              css: {
                top: top + 235 + 'rpx',
                left: [left + 71 + 'rpx', 'cardCash'],
                fontSize: '25rpx',
                color: '#ffffff'
              }
            })
          }
        } else {
          let serviceName = ''
          let giftName = ''
          for (let item of this.card.Services) {
            if (item.IsGift) {
              giftName += '赠' + item.ItemName + item.CardValue + '次 '
            } else {
              serviceName += item.ItemName + item.CardValue + '次 '
            }
          }
          views.push({
            type: 'text',
            id: 'services',
            text: serviceName + giftName,
            css: {
              top: top + 225 + 'rpx',
              left: left + 26 + 'rpx',
              fontSize: '30rpx',
              color: '#ffffff',
              maxLines: 1,
              width: '480rpx'
            }
          })
        }
        // 有效期
        views.push({
          type: 'text',
          text: '有效期' + this.card.ValidityDateTime,
          css: {
            top: top + 270 + 'rpx',
            left: left + 26 + 'rpx',
            fontSize: '17rpx',
            color: '#ffffff'
          }
        })
        // 售价
        views.push({
          type: 'text',
          text: '￥' + this.card.Price,
          css: {
            top: '529rpx',
            left: '119rpx',
            fontSize: '36rpx',
            fontWeight: 'bold',
            color: '#AC9054'
          }
        })
        // 分割条
        views.push({
          type: 'rect',
          css: {
            width: '750rpx',
            height: '17rpx',
            top: '658rpx',
            left: '0rpx',
            color: '#f0f0f0'
          }
        })
        // 二维码
        views.push({
          type: 'image',
          url: this.qrCode,
          css: {
            width: '253rpx',
            height: '253rpx',
            mode: 'scaleToFill',
            top: '756rpx',
            left: '249rpx'
          }
        })
        this.template = {
          width: '750rpx',
          height: '1115rpx',
          background: '#ffffff',
          views: views
        }
      },
      onImgOk (e) {
        let that = this
        console.log(e)
        if (that.isDownloading) {
          wx.saveImageToPhotosAlbum({
            filePath: e.mp.detail.path,
            success: function () {
              wx.hideLoading()
              that.$success('下载成功', false)
              that.isDownloading = false
            },
            fail: function () {
              wx.hideLoading()
            }
          })
        }
        wx.hideLoading()
      },
      getCard () {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCard', {
          PrepaidCardId: this.cardId,
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          res.StoreName = that.store.StoreName
          res.StoreLogo = that.store.StoreLogo
          res.ValidityDateTime = that.calcValidityDate(res.ValidityDate)
          that.card = res
          that.firstLoad = false
        })
      },
      getCardCode () {
        let that = this
        this.$post('/storeCard/businessGetPrepaidCardQrCode', {
          PrepaidCardId: this.cardId,
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.qrCode = res.PrepaidCardQrCode
        })
      },
      calcValidityDateTo (date) {
        if (date === 0) {
          return '永久有效'
        }
        var now = new Date()
        now.setDate(now.getDate() + date)
        return this.formatTime(now)
      },
      formatTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        let day = date.getDate()
        day = day < 10 ? '0' + day : day
        return year + '年' + month + '月' + day + '日'
      },
      calcValidityDate (validityDay) {
        if (validityDay === 0) {
          return '永久有效'
        }
        let year = Math.floor(validityDay / 365)
        let month = Math.floor(validityDay % 365 / 30)
        let day = validityDay % 365 % 30
        return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
      },
      getStoreInfo (callback) {
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.store = res
          callback()
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.cardId = option.cardId
      this.isDownloading = false
      this.qrCode = ''
      this.template = ''
      let that = this
      this.getStoreInfo(function () {
        that.getCard()
      })
      this.getCardCode()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .share-home-page {
    height: 100vh;
    background-color: #f0f0f0;
    .share-home-scroll {
      height: 90vh;
      .share-home-main {
        min-height: 80vh;
        .share-context-top {
          position: relative;
          width: 100vw;
          height: 82vw;
          background: #FF6200;
          overflow: hidden;
          .share-background {
            position: relative;
            width: 100vw;
            left: 50vw;
            top: 45vw;
            div {
              border-radius: 50%;
              width: 300vw;
              height: 300vw;
              position: absolute;
              left: -150vw;
              background: white;
              border: 0.2vw solid white;
            }
          }
          .share-card {
            padding-top: 20vw;
            width: 68.2vw;
            height: 41.9vw;
            margin: 0 auto;
            position: relative;
            z-index: 100;
            .new-card-demo {
              transform: scale(0.82, 0.82);
              transform-origin: 0% 0%;
              top: 0;
              left: 0;
            }
          }
          .card-price {
            width: 68.2vw;
            padding-top: 4.5vw;
            margin: 0 auto;
            color: #AC9054;
            font-size: 4.8vw;
            position: relative;
            font-weight: 600;
            z-index: 101;
          }
        }
        .share-middle {
          position: relative;
          top: -0.2vw;
          background: #f0f0f0;
          height: 2vw;
          z-index: 102;
        }
        .share-bottom {
          background: white;
          padding: 11.3vw 0 12.7vw 0;
          text-align: center;
          .share-code {
            padding-bottom: 10.3vw;
            img {
              display: inline-block;
              width: 33vw;
              height: 33vw;
            }
          }
          .share-button {
            padding-bottom: 5.3vw;
            span {
              display: inline-block;
              vertical-align: top;
              width: 35vw;
              height: 9.5vw;
              line-height: 9.5vw;
              font-size: 3.9vw;
              color: white;
              background: rgba(255, 111, 0, 1);
              border-radius: 47px;
            }
          }
          .download-button {
            span {
              display: inline-block;
              vertical-align: top;
              width: 35vw;
              height: 9.1vw;
              line-height: 9.1vw;
              font-size: 3.9vw;
              color: #FF6F00;
              border: 0.2vw solid rgba(255, 111, 0, 1);
              border-radius: 4.7vw;
              background: #FFF4ED;
            }
          }
        }

      }
    }
    .share-model {
      position: fixed;
      width: 100vw;
      height: 100vh;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.35);
      z-index: 9999;
    }
    .painter-model {
      position: fixed;
      top: -100vh;
    }
  }
</style>
