<template>
  <div class="face-card"
       v-bind:style="{'background':'url('+item.CardImg+')','background-size':'100% 100%'}">
    <div class="card-hearder">
              <span class="header-logo"
                    v-bind:style="{'background':'url('+store.StoreLogo+')','background-size':'100% 100%'}"></span>
      <span class="header-name" style="width: 55vw">{{store.StoreName}}</span>
      <img class="header-code" src="/static/code.png"/>
    </div>
    <div class="card-content"
         :style="{'font-size':item.CardName&&item.CardName.length>5?item.CardName.length<10?(145-item.CardName.length*9+'rpx'):'59rpx':'','line-height':item.CardName&&item.CardName.length>10?'67rpx':''}">
      <text>{{computedCardName}}</text>
    </div>
    <div class="card-footer">
      <div class="footer-number">0000 0000 0000 000</div>
      <div class="footer-date">有效期至{{item.ValidityDateTo}}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['item', 'store'],
    data () {
      return {
        item: {}
      }
    },
    computed: {
      computedCardName () {
        if (this.item.CardName) {
          if (this.item.CardName.length > 10 && this.item.CardName.length <= 20) {
            let middle = Math.ceil(this.item.CardName.length / 2)
            return this.item.CardName.substring(0, middle) + '\n' + this.item.CardName.substring(middle, this.item.CardName.length)
          } else {
            return this.item.CardName
          }
        } else {
          return '会员卡'
        }
      }
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .face-card {
    text-align: left;
    width: 78vw;
    height: rpx(336);
    line-height: rpx(336);
    padding: rpx(20);
    box-shadow: 0 0 1vw 0 #7a7a7a;
    border-radius: 10px;
    background-color: #d5d5d5;
    margin: 0 auto;
    color: white;
    transform: scale(0.9, 0.9);
    font-size: 11vw;
    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 78vw;
      height: rpx(336);
      padding: rpx(20);
      background: black;
      opacity: 0.2;
      border-radius: 10px;
    }
    .shadow {
      position: absolute;
      top: rpx(-2);
      left: rpx(-2);
      border: rpx(2) solid #cecece;
      background-color: #dbdbdb;
      width: 85vw;
      height: rpx(336);
      padding: rpx(20);
      border-radius: rpx(20);
      margin: 0 auto;
      opacity: 0.3;
    }

    .card-left {
      transform: rotate(7deg);
      position: absolute;
      left: 1vw;
    }

    .card-right {
      transform: rotate(-4deg);
      position: absolute;
      left: calc(15vw / 2 - 11px);
    }

    .card-hearder {
      height: 30%;
      line-height: 7vh;
    }

    .card-content {
      height: rpx(134);
      line-height: rpx(134);
      text-align: center;
      font-size: rpx(100);
      overflow: hidden;
      vertical-align: top;
      display: block;
      text {
        display: inline-block;
        vertical-align: top;
      }
    }

    .card-footer {
      height: 30%;
      padding-top: 1vh;
      padding-left: 1vw;
      line-height: 3vh;
      font-size: rpx(25);
      .footer-number {
        padding-top: rpx(4);
        text-shadow: 1px 1px 1px #7a7a7a;
        color: #dcc913;
        font-size: rpx(28);
      }
    }

    .header-logo {
      width: 6vh;
      height: 6vh;
      font-size: 0.5em;
      text-align: center;
      line-height: 5vh;
      display: inline-block;
      border-radius: 50%;
      vertical-align: middle;
      background-size: 100% 100%;
    }

    .header-name {
      height: 5vh;
      line-height: 5vh;
      display: inline-block;
      font-size: rpx(32);
      vertical-align: middle;
      margin-left: 3vw;
      width: 10vw;
      white-space: nowrap;
    }

    .header-code {
      height: 3vh;
      width: 3vh;
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>
