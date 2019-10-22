<template>
  <div class="demo-page card-face">
    <title :name="'选择卡面'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div class="demo-context">
          <div class="create-card" v-for="(item,index) in items" @click="changeFace(index,item)">
            <card :card="item" :store="store" @showMore="showServices"></card>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showMore">
      <more :services="services" @close="showMore=false"></more>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import card from '@/components/card'
  import more from '@/components/services'

  export default {
    components: {
      title, card, more
    },

    data () {
      return {
        items: [],
        store: {},
        services: [],
        showMore: false,
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
          let items = []
          for (let item of res.PrepaidCards) {
            item.ValidityDateTo = that.calcValidityDateTo(item.ValidityDate)
            item.ValidityDateTime = that.calcValidityDate(item.ValidityDate)
            item.StoreName = that.store.StoreName
            item.StoreLogo = that.store.StoreLogo
            if (that.cardIds.indexOf(item.PrepaidCardId) < 0) {
              items.push(item)
            }
          }
          that.items = items
        })
      },
      showServices (services) {
        this.services = services
        this.showMore = true
      },
      changeFace (index, item) {
        let globalData = this.getGlobalData()
        globalData.currentFaceIndex = index
        wx.setStorageSync('cardFace', item)
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
      calcValidityDate (validityDay) {
        if (validityDay === 0) {
          return '永久有效'
        }
        let year = Math.floor(validityDay / 365)
        let month = Math.floor(validityDay % 365 / 30)
        let day = validityDay % 365 % 30
        return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
      },
      formatTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        let day = date.getDate()
        day = day < 10 ? '0' + day : day
        return year + '年' + month + '月' + day + '日'
      },
      getStoreInfo (callback) {
        let that = this
        this.$post('/store/businessGetStoreInfo', {Uid: this.userId, StoreId: this.storeId}).then(res => {
          that.store = res
          callback()
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.cardIds = []
      this.showMore = false
      let cardIds = wx.getStorageSync('cardIds')
      if (cardIds) {
        this.cardIds = cardIds
        wx.removeStorageSync('cardIds')
      }
      let that = this
      this.getStoreInfo(function () {
        that.getCardSetting()
      })
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
      padding: 1vh 0;
      background-color: white;
      .create-card {
        width: 66.2vw;
        height: 39.52vw;
        margin: 3vw auto;
        color: white;
        position: relative;
        .new-card-demo {
          left: 0;
          top: 0;
          transform: scale(0.8, 0.8);
          transform-origin: 0% 0%;
        }
      }
    }
  }
</style>
