<template>
  <div class="mbrforkeyword" :style="{height:'12vh'}">
    <span class="logo" v-bind:style="{background:'url('+item.UserImg+')','background-size':'100%,100%'}"></span>
    <span class="context" :class="{'no-line':last}" :style="{height:showKey?'12vh':'10vh'}">
      <div class="operate">
        <span class="user" v-if="showKey">
          {{item.UserStoreName ? item.UserStoreName : item.UserName}}
        </span>
        <div class="user" v-if="!showKey">
          <span>{{partOne}}</span>
          <span style="color: #ff0000">{{partTwo}}</span>
          <span>{{partThree}}</span>
        </div>
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
      <div class="showkey" v-if="showKey" :style="{top:item.LastDate?'-40rpx':'-10rpx'}">
        <span>{{partOne}}</span>
        <span style="color: #ff0000">{{partTwo}}</span>
        <span>{{partThree}}</span>
      </div>
      <div class="showkey" v-if="!showKey" :style="{top:item.LastDate?'-40rpx':'-10rpx'}">
        <span>{{'卡号：' + item.CardNumber}}</span>
      </div>
    </span>
  </div>
</template>
<script>
  export default {
    props: ['key', 'item', 'last', 'keyword'],
    data () {
      return {
        item: {},
        key: '',
        showKey: false,
        keyword: '',
        partOne: '',
        partTwo: '',
        partThree: ''
      }
    },
    methods: {},
    onLoad () {
      let key = this.keyword
      let item = this.item
      let keyWord = ''
      let partOne = ''
      let partTwo = ''
      let partThree = ''
      if (item.UserMobile && item.UserStoreName.indexOf(key) > -1) {
        keyWord = item.UserMobile
        this.showKey = true
        partOne = '电话：'
      } else if (item.UserStoreName && item.UserStoreName.indexOf(key) > -1) {
        keyWord = item.UserStoreName
      } else if (item.UserName && item.UserName.indexOf(key) > -1) {
        keyWord = item.UserName
      } else if (item.CardNumber && item.CardNumber.indexOf(key) > -1) {
        keyWord = item.CardNumber
        this.showKey = true
        partOne = '卡号：'
      }
      let index = keyWord.indexOf(key)
      partOne = partOne + keyWord.substring(0, index)
      partTwo = key
      partThree = keyWord.substring(index + key.length, keyWord.length)
      this.partOne = partOne
      this.partTwo = partTwo
      this.partThree = partThree
    }
  }
</script>
<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mbrforkeyword {
    width: 90vw;
    height: 10vh;
    line-height: 5vh;
    margin-left: 5vw;
    font-size: 0.8em;
    margin-top: 1.8vh;
    .logo {
      width: 8vw;
      height: 8vw;
      font-size: 0.8em;
      text-align: center;
      line-height: 8vh;
      display: inline-block;
      border-radius: 50%;
      background-color: #d5d5d5;
      vertical-align: top;
      position: relative;
      top: 2vh;
    }
    .context {
      display: inline-block;
      width: 78vw;
      padding-left: 2vw;
      height: 10vh;
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
          div {
            line-height: 5vw;
          }
        }
      }
      .time {
        font-size: rpx(25);
        color: #a7a7a7;
        position: relative;
        top: rpx(-10);
      }
      .showkey {
        font-size: rpx(25);
        color: #a7a7a7;
        position: relative;
        top: rpx(-40);
      }
    }
    .no-line {
      border-bottom: 0 solid #dddddd;
    }
  }
</style>
