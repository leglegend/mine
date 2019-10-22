<template>
  <div class="promotion-code-page">
    <title :name="'当面邀请'"></title>
    <scroll-view class="promotion-code-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="promotion-code-main" :style="{'min-height':'calc(100vh - '+titleHeight +'px)'}">
        <img class="promotion-bg" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/promotion-code-bg.png"/>
        <img class="promotion-code" :src="code"/>
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
        code: '',
        titleHeight: null
      }
    },
    methods: {
      getCode () {
        let that = this
        this.$post('/recommend/businessGetRecommendQrCode', {
          Uid: that.userId,
          StoreId: that.storeId
        }, true).then(res => {
          that.code = res.QrCode
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getCode()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .promotion-code-page {
    height: 100vh;
    background-color: #fef5d4;
    .promotion-code-scroll {
      height: 90vh;
      position: relative;
      .promotion-bg {
        position: absolute;
        width: 100vw;
        left: 0;
        top: 0;
        height: 158.4vw;
      }
      .promotion-code {
        position: absolute;
        width: 58.3vw;
        left: 22.4vw;
        top: 78.8vw;
        height: 58.3vw;
        border-radius: 5vw;
      }
      .promotion-code-main {
        min-height: 80vh;
      }
    }
  }
</style>
