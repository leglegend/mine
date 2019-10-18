<template>
  <div class="persion-card"
       v-bind:style="{top:5*(count-index)+'vw','z-index':count-index}">
    <!--<div class="card-hearder">
      <span class="header-logo"
            v-bind:style="{'background':'url('+store.StoreLogo+')','background-size':'100% 100%'}"></span>
      <span class="header-name" style="width: 56vw">{{store.StoreName}}</span>
      <img class="header-code" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/code.png"/>
    </div>
    <div class="card-content"
         :style="{'font-size':item.CardName&&item.CardName.length>5?item.CardName.length<10?(145-item.CardName.length*9+'rpx'):'59rpx':'','line-height':item.CardName&&item.CardName.length>10?'67rpx':''}">
      <text>{{computedCardName}}</text>
    </div>
    <div class="card-footer">
      <div class="footer-number">{{item.CardNumber}}</div>
      <div class="footer-date">有效期至{{item.ValidityDate}}</div>
    </div>-->
    <card :card="item" @showMore="showMore" @share="shareCard"></card>
    <div class="card-background" v-if="index!=0">
    </div>
  </div>
</template>
<script>
  import card from '@/components/card'

  export default {
    components: {
      card
    },
    props: ['item', 'index', 'count'],
    data () {
      return {
      }
    },
    methods: {
      showMore () {
        this.$emit('showServices')
      },
      shareCard () {
        this.$emit('shareCard')
      }
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .persion-card {
    width: 82.7vw;
    position: absolute;
    left: 8.6vw;
    height: 49.4vw;
    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 82.7vw;
      height: 49.4vw;
      background: black;
      opacity: 0.2;
      border-radius: 3vw;
    }
    .new-card-demo {
      top: 0;
      left: 0;
    }
  }
</style>
