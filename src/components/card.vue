<template>
  <div class="new-card-model">
    <div class="new-card-demo">
      <div class="new-card"
           v-bind:style="{'background':'url('+card.CardImg+')','background-size':'100% 100%'}">
        <div class="new-card-hearder">
        <span class="new-card-header-logo" @click="jumpToSeller"
              v-bind:style="{'background':'url('+storeLogo+')','background-size':'100% 100%'}"></span>
          <span class="new-card-header-name">{{storeName}}</span>
          <div class="new-card-code" v-if="card.isShare" @click.stop="jumpToShare">
            <div>
              <img
                src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-card.png"/>
            </div>
          </div>
          <div class="new-card-code" v-if="!card.isShare">
            <div>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/NutCards/static/code.png"/>
            </div>
          </div>
        </div>
        <div class="new-card-content" :id="last?'cardTop':''"
             :style="{'font-size':card.CardName&&card.CardName.length>5?card.CardName.length<10?(130-card.CardName.length*8+'rpx'):'59rpx':'','line-height':card.CardName&&card.CardName.length>10?'67rpx':''}">
          <text>{{name ? name : computedCardName}}</text>
        </div>
        <div class="new-card-footer">
          <div class="footer-top" v-if="card.CardType==1">
            <span class="top-1" v-if="card.CardType==1&&(card.CardPrice||card.CardValue)">¥ </span>
            <span class="top-2">{{card.CardValue ? card.CardValue : card.CardPrice}}</span>
            <span class="top-3" v-if="card.CardType==0&&(card.CardPrice||card.CardValue)">次</span>
            <span class="top-4 top-5" v-if="card.CardGivingValue">
              赠 {{card.CardType ? '¥' : ''}}<p>{{card.CardGivingValue}}</p> {{card.CardType ? '' : '次'}}
            </span>
            <span style="width: 2vw;" v-if="card.CardDiscount&&card.CardDiscount!=10&&card.CardGivingValue"></span>
            <span class="top-4" v-if="card.CardDiscount&&card.CardDiscount!=10&&!card.Id">
              享<p class="top-discount">{{card.CardDiscount}}</p>折
            </span>
            <span class="top-6" v-if="card.CardDiscount&&card.CardDiscount!=10&&card.Id">
              享<p>{{card.CardDiscount}}</p>折
            </span>
          </div>
          <div style="position: relative;height: 5.5vw;line-height: 5.5vw;top: 1vw;" v-if="card.CardType==0"
               @click.stop="showMore">
            <div class="times-top" v-if="card.CardType==0"
                 style="width: 70vw;display: inline-block;vertical-align: top;top:0;">
              <span style="padding-right: 0.5vw">
                <span class="times-service" v-for="(item,index) in card.Services" v-if="!item.IsGift">
                  {{item.ItemName + item.CardValue}}次&nbsp;
                </span>
              </span>
              <span class="times-gift" v-for="item in card.Services" v-if="item.IsGift">
                赠{{item.ItemName + item.CardValue}}次
              </span>
            </div>
            <div class="show-more" v-if="card.Services&&card.Services.length>=3">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right4.png"/>
              </span>
            </div>
          </div>
          <div class="footer-bottom">
            有效期{{computedValidityDate}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['card', 'last', 'name'],
    data () {
      return {
        store: this.$store.state.storeInfo
      }
    },
    computed: {
      computedCardName () {
        if (this.card.CardName.length > 10 && this.card.CardName.length <= 20) {
          let middle = Math.ceil(this.card.CardName.length / 2)
          return this.card.CardName.substring(0, middle) + '\n' + this.card.CardName.substring(middle, this.card.CardName.length)
        } else {
          return this.card.CardName
        }
      },
      computedValidityDate () {
        if (this.card.Id) {
          return '至' + this.card.ValidityDate
        } else {
          if (this.card.ValidityDate === 0) {
            return '永久有效'
          } else {
            let year = Math.floor(this.card.ValidityDate / 365)
            let month = Math.floor(this.card.ValidityDate % 365 / 30)
            let day = this.card.ValidityDate % 365 % 30
            return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
          }
        }
      },
      storeName () {
        return this.$store.state.storeInfo.StoreName
      },
      storeLogo () {
        return this.$store.state.storeInfo.StoreLogo
      }
    },
    methods: {
      jumpToCardCode () {
        const url = '../code/main?num=' + this.card.CardNumber
        let globalData = this.getGlobalData()
        globalData.codeUrl = this.card.MemberCardQrCode
        wx.navigateTo({url})
      },
      jumpToSeller () {
        if (this.card.Id) {
          const url = '../seller/main?userId=' + this.userId + '&storeId=' + this.card.StoreId
          wx.navigateTo({url})
        }
      },
      jumpToShare () {
        if (this.card.Id) {
          this.$emit('share', this.card)
        } else if (this.card.PrepaidCardId) {
          const url = '../share/home/main?userId=' + this.card.userId + '&storeId=' + this.card.storeId + '&cardId=' + this.card.PrepaidCardId
          wx.navigateTo({url})
        }
      },
      showMore () {
        this.$emit('showMore', this.card.Services)
      }
    },
    onLoad (option) {
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .new-card-model {
    height: 0;
    width: 0;
    position: absolute;
    .new-card-demo {
      width: 82.7vw;
      height: 49.4vw;
      position: absolute;
      .new-card {
        width: 82.7vw;
        height: 49.4vw;
        box-sizing: border-box;
        box-shadow: 0 0 1vw 0 #7a7a7a;
        border-radius: 3vw;
        background-color: #d5d5d5;
        color: white;
        position: relative;
        text-align: left;
        overflow: hidden;
        .new-card-hearder {
          padding-left: 4.3vw;
          padding-top: 4.8vw;
          width: 78.4vw;
          height: 9.7vw;
          line-height: 9.7vw;
          position: relative;
          top: -0.5vw;
          .new-card-header-logo {
            width: 9.7vw;
            height: 9.7vw;
            display: inline-block;
            border-radius: 50%;
            vertical-align: top;
            background-size: 100% 100%;
          }
          .new-card-header-name {
            width: 9.7vw;
            height: 9.7vw;
            width: 50vw;
            display: inline-block;
            font-size: 3.9vw;
            vertical-align: top;
            padding-left: 1.8vw;
            white-space: nowrap;
          }
          .new-card-header-code {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-width: 7vw 7vw 7vw 7vw;
            border-style: solid;
            border-color: rgba(255, 255, 255, 0.21) rgba(255, 255, 255, 0.2) transparent transparent;
          }
          .new-card-code {
            position: absolute;
            width: 14vw;
            height: 14vw;
            top: 0;
            right: 0;
            img {
              display: inline-block;
              width: 6vw;
              height: 6vw;
              position: absolute;
              top: 6.5vw;
              right: 4vw;
            }
          }
        }

        .new-card-content {
          height: 20vw;
          line-height: 20vw;
          text-align: center;
          font-size: rpx(85);
          overflow: hidden;
          vertical-align: top;
          display: block;
          font-weight: 500;
          position: relative;
          top: -0.5vw;
          text {
            display: inline-block;
            vertical-align: top;
            font-family: SimHei;
          }
        }

        .new-card-footer {
          padding-left: 4.3vw;
          .footer-top {
            height: 5.5vw;
            line-height: 5.5vw;
            position: relative;
            top: 1vw;
            span {
              display: inline-block;
              vertical-align: bottom;
            }
            .top-1 {
              height: 4.1vw;
              line-height: 4.1vw;
              font-size: 4.1vw;
              font-weight: 600;
            }
            .top-2 {
              height: 5.5vw;
              line-height: 5.5vw;
              font-size: 7.3vw;
              padding-right: 0.9vw;
              color: white;
              font-weight: 600;
            }
            .top-3 {
              height: 3.7vw;
              line-height: 3.7vw;
              font-size: 3.7vw;
              padding-right: 0.9vw;
              font-weight: 600;
            }
            .top-4 {
              padding: 0 1.5vw;
              height: 5.5vw;
              line-height: 5.5vw;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 2.5vw;
              text-align: center;
              font-size: 3.4vw;
              font-family: HYRuiYiSongW;
            }
            .top-6 {
              padding: 0 1.5vw;
              height: 4.8vw;
              line-height: 4.8vw;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 2vw;
              text-align: center;
              font-size: 3vw;
              font-family: HYRuiYiSongW;
              p {
                display: inline-block;
              }
              p:first-letter {
                font-size: 4.6vw;
              }
            }
            .top-5 {
              width: auto;
              padding: 0 2vw;
              p {
                font-size: 4.1vw;
                display: inline-block;
              }
            }
            .top-discount {
              display: inline-block;
              padding-right: 0.4vw;
              padding-left: 0.4vw;
            }
            p.top-discount:first-letter {
              font-size: 5.5vw;
            }
          }
          .times-top {
            height: 5.5vw;
            line-height: 5.5vw;
            position: relative;
            top: 1vw;
            white-space: nowrap;
            overflow: hidden;
            span {
              display: inline-block;
              vertical-align: bottom;
            }
            .times-service {
              height: 5.5vw;
              line-height: 5.5vw;
              font-size: 4.5vw;
              color: white;
            }
            .times-gift {
              padding: 0 1.5vw;
              height: 5.5vw;
              line-height: 5.5vw;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 2.5vw;
              text-align: center;
              font-size: 3.4vw;
              font-family: HYRuiYiSongW;
              margin-right: 1vw;
            }
          }
          .show-more {
            position: absolute;
            right: 3vw;
            top: 0.3vw;
            width: 4.8vw;
            height: 4.8vw;
            line-height: 4.8vw;
            color: white;
            font-size: 4vw;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            span {
              width: 4.8vw;
              height: 4.8vw;
              line-height: 4.8vw;
              display: inline-block;
              vertical-align: top;
              box-sizing: border-box;
              padding-left: 1.7vw;
              padding-top: 1.1vw;
            }
            img {
              display: inline-block;
              vertical-align: top;
              height: 2.3vw;
              width: 1.8vw;
            }
          }
          .footer-bottom {
            padding-top: 1.8vw;
            height: 2.7vw;
            font-size: 2.8vw;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }

</style>
