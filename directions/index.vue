<template>
  <div class="demo-page mine-agreement">
    <web-view :src="src">

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
        src: '',
        titleHeight: null
      }
    },
    methods: {},
    onLoad (option) {
      this.src = 'https://www.nutcards.com/directions.html?number=' + option.number
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShareAppMessage (e) {
      return {
        title: '坚果卡包使用帮助'
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
