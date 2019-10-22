<template>
  <div class="demo-page mine-agreement">
    <title :name="'服务协议'"></title>
    <web-view src="https://www.nutcards.com/business.html">

    </web-view>
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
        titleHeight: null
      }
    },
    methods: {},
    onLoad () {
      this.titleHeight = this.getGlobalData().titleHeight
      wx.showShareMenu({
        withShareTicket: false
      })
    },
    onShareAppMessage (e) {
      return {
        title: '坚果卡包商家版介绍'
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mine-agreement {
    .agreement-context {
      margin: 0 5vw;
      font-size: rpx(28);
      div {
        &:nth-child(1) {
          text-align: center;
          font-size: rpx(35);
          line-height: 10vh;
          font-weight: 600;
        }
        &:nth-child(2) {
          padding-bottom: 4vh;
        }
      }
    }
  }
</style>
