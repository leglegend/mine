<template>
  <div class="demo-page card-face">
    <title :name="'选择卡面'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div class="demo-context">
          <div class="create-card" v-for="(item,index) in items" @click="changeFace(index)"
               v-bind:style="{'background':'url('+item+')','background-size':'100% 100%'}">
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
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
        items: [],
        titleHeight: ''
      }
    },
    methods: {
      getCardSetting () {
        let that = this
        this.$post('/storeCard/businessStorePrepaidCardSeting', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.items = res.CardImages
        })
      },
      changeFace (index) {
        let globalData = this.getGlobalData()
        globalData.currentFaceIndex = index
        wx.navigateBack({
          delta: 1
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getCardSetting()
      let globalData = this.getGlobalData()
      globalData.currentFaceIndex = null
    },
    created () {
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .card-face {
    height: 100vh;
    background-color: #f0f0f0;
    .demo-context {
      padding: 2vh 0;
      background-color: white;
    }
    .create-card {
      width: 78vw;
      height: rpx(336);
      padding: rpx(20);
      box-shadow: 0 0 1vw 0 #7a7a7a;
      border-radius: 10px;
      background-color: #d5d5d5;
      margin: 0 auto;
      color: white;
      transform: scale(0.9, 0.9);
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
        height: 40%;
        line-height: 9vh;
        text-align: center;
        font-size: rpx(100);
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
  }
</style>
