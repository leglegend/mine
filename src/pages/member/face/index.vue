<template>
  <div class="demo-page card-face">
    <title :name="'选择卡面'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div class="demo-context">
          <div v-for="(item,index) in items" @click="changeFace(index)">
            <card :item="item" :store="store"></card>
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
  import card from '@/components/face-card'

  export default {
    components: {
      title, card
    },

    data () {
      return {
        items: [],
        store: {},
        titleHeight: ''
      }
    },
    methods: {
      getCardSetting () {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCards', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          for (let item of res.PrepaidCards) {
            item.ValidityDateTo = that.calcValidityDateTo(item.ValidityDate)
          }
          that.items = res.PrepaidCards
        })
      },
      changeFace (index) {
        let globalData = this.getGlobalData()
        globalData.currentFaceIndex = index
        wx.navigateBack({
          delta: 1
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
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {Uid: this.userId, StoreId: this.storeId}).then(res => {
          that.store = res
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getCardSetting()
      this.getStoreInfo()
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
