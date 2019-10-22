<template>
  <div class="demo-page">
    <title :name="''"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context">

        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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
        logs: [],
        titleHeight: null
      }
    },
    methods: {},
    onLoad () {
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .demo-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .demo-scroll {
      height: 90vh;
      .demo-main {
        min-height: 80vh;
      }
    }
  }
</style>
