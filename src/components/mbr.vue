<template>
  <div class="mbr">
    <span class="logo" v-bind:style="{background:'url('+item.UserImg+')','background-size':'100%,100%'}"></span>
    <span class="context" :class="{'no-line':last}">
      <div class="operate">
        <span class="user">{{item.UserStoreName ? item.UserStoreName : item.UserName}}</span>
        <span class="opera">{{item.ConsumptionTag}}</span>
        <span class="result" v-if="item.Cards.length>0"
              :style="{'font-size':item.Cards.length==1?'4.5vw':item.Cards.length==2?'3.8vw':'3vw'}">
          <div v-for="card in item.Cards"
               :style="{'line-height':item.Cards.length==1?'10vw':item.Cards.length==2?'7vw':'5vw'}">
            余{{card.CardPrice + (card.CardType ? '元' : '次')}}
          </div>
        </span>
      </div>
      <div class="time">
        {{item.LastDate}}
      </div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'last']
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mbr {
    width: 90vw;
    height: 16vw;
    margin-left: 5vw;
    font-size: 2.5vw;
    margin-top: 2vw;
    .logo {
      width: 8vw;
      height: 8vw;
      font-size: 0.8em;
      text-align: center;
      line-height: 8vh;
      display: inline-block;
      border-radius: 50%;
      background-color: #d5d5d5;
      vertical-align: middle;
    }
    .context {
      display: inline-block;
      width: 78vw;
      padding-left: 2vw;
      height: 16vw;
      vertical-align: middle;
      border-bottom: rpx(1) solid #dddddd;
      .operate {
        position: relative;
        top: rpx(15);
        .user {
          width: 52vw;
          display: inline-block;
          text-align: left;
          font-size: rpx(28);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 8vw;
        }

        .opera {
          width: 0vw;
          display: inline-block;
          text-align: center;
        }

        .result {
          width: 26vw;
          right: 0;
          top: 0;
          display: inline-block;
          text-align: right;
          height: 15vw;
          position: absolute;
          font-size: rpx(34);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          div {
            line-height: 5vw;
          }
        }
      }
      .time {
        padding-top: 1vw;
        font-size: rpx(25);
        color: #a7a7a7;
        position: relative;
        //top: rpx(-15);
      }
    }
    .no-line {
      border-bottom: 0 solid #dddddd;
    }
  }


</style>
