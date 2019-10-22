<template>
  <div class="option">
    <div :style="{'height':num==0?'70rpx':'30rpx'}"></div>
    <div class="option-context">
      <span class="option-card" :class="{'option-filter':!card.State}">
        <card :card="card" @showMore="showMore"></card>
      </span>
      <span class="option-info">
        <div class="info-price">￥ {{card.Price}}</div>
        <div class="info-times" style="width: 50.6vw;" :style="{filter: coupon?'grayscale(1)':''}">
          <span class="info-use">使用{{card.CardValue + (card.CardType ? '元' : '次')}}</span>
          <span class="info-gift" :class="{'option-bfbfbf':!card.State}"
                v-if="card.CardGivingValue">再赠{{card.CardGivingValue + (card.CardType ? '元' : '次')}}</span>
          <span class="info-discount" :class="{'option-bfbfbf':!card.State}"
                v-if="card.CardDiscount!=10&&card.CardType">享{{card.CardDiscount}}折</span>
        </div>
        <div class="info-times info-date">有效期：{{card.ValidityDateTime}}</div>
      </span>
      <span class="option-state">
        <span>{{card.State ? '出售中' : '已暂停'}}</span>
        <img :src="card.State?'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/sale.png':'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nosale.png'"/>
      </span>
      <span class="option-record" @click.stop="jumpToRecord" v-if="coupon!=true">
        已售出 {{card.CardSellCount}} 次 >
      </span>
    </div>
  </div>
</template>
<script>
  import card from '@/components/card'
  // import more from '@/components/services'

  export default {
    components: {
      card
    },
    props: ['num', 'option', 'card', 'last', 'store', 'uid', 'coupon'],
    data () {
      return {
      }
    },
    computed: {
      computedCardName () {
        if (this.card.CardName) {
          if (this.card.CardName.length > 10 && this.card.CardName.length <= 20) {
            let middle = Math.ceil(this.card.CardName.length / 2)
            return this.card.CardName.substring(0, middle) + '\n' + this.card.CardName.substring(middle, this.card.CardName.length)
          } else {
            return this.card.CardName
          }
        } else {
          return '会员卡'
        }
      }
    },
    methods: {
      jumpToRecord () {
        wx.setStorageSync('cardRecord', this.card)
        const url = '../record/main?userId=' + this.uid + '&storeId=' + this.store.StoreId
        wx.navigateTo({url})
      },
      showMore () {
        this.$emit('showServices', this.card.Services)
      }
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .option {
    width: 100vw;
    background-color: white;
    z-index: 999;
    .option-top {
      height: rpx(0);
    }
    .option-filter {
      -webkit-filter: grayscale(100%);
    }
    .option-bfbfbf {
      background: #bfbfbf !important;
    }
    .option-context {
      height: rpx(226);
      padding-left: rpx(40);
      vertical-align: middle;
      position: relative;
      span {
        display: inline-block;
      }
      .option-card {
        width: 39.7vw;
        height: 23.7vw;
        margin: auto 0;
        position: relative;
        .new-card-demo {
          transform: scale(0.48, 0.48);
          transform-origin: 0% 0%;
          top: 0;
          left: 0;
        }
      }
      .option-info {
        vertical-align: top;
        padding-left: rpx(15);
        padding-top: rpx(6);
        font-size: rpx(30);
        color: #909090;
        .info-price {
          color: black;
          font-size: rpx(43);
          font-weight: 600;
          vertical-align: middle;
        }
        .info-times {
          padding-top: rpx(13);
          padding-left: rpx(8);
          vertical-align: middle;
          overflow: hidden;
          white-space: nowrap;
          .info-use {
            //min-width: rpx(165);
            padding-right: rpx(5);
            max-width: rpx(170);
            vertical-align: middle;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: inline-block;
          }
          .info-gift {
            background-color: #ff6700;
            color: white;
            font-size: rpx(20);
            text-align: center;
            border-radius: rpx(15);
            padding: rpx(1) rpx(10);
            vertical-align: middle;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: inline-block;
          }
          .info-discount {
            background-color: #ff6700;
            color: white;
            font-size: rpx(20);
            margin-left: rpx(5);
            text-align: center;
            border-radius: rpx(15);
            padding: rpx(1) rpx(10);
            vertical-align: middle;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: inline-block;
          }
        }
        .info-date {
          font-size: rpx(25);
        }
      }
      .option-record {
        display: inline-block;
        position: absolute;
        bottom: 3vw;
        right: 4vw;
        font-size: 2.5vw;
        color: #909090;
        padding: 1vw;
      }
      .option-state {
        display: inline-block;
        width: rpx(60);
        height: rpx(61);
        height: 0;
        position: absolute;
        top: 0;
        right: 5vw;
        font-size: rpx(15);
        color: white;
        text-align: center;
        line-height: rpx(61);
        img {
          position: absolute;
          left: 0;
          top: 0;
          display: inline-block;
          width: rpx(60);
          height: rpx(61);
        }
        span {
          position: relative;
          display: inline-block;
          z-index: 100;
        }
      }
    }
  }
</style>
