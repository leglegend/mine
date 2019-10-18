<template>
  <div class="demo-page mine-agreement">
    <web-view :src="src">

    </web-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        src: null
      }
    },
    methods: {},
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.src = 'https://www.nutcards.com/jghyxy.html?storeId=' + option.storeId + '&userId=' + option.userId
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
