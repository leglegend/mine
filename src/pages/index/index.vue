<template>
  <div class="danni-page">
    <!--<div class="danni-barheight" :style="{height:statusBarHeight+'px'}"></div>-->
    <img class="danni-music" src="/static/images/music.png"/>
    <swiper v-if="imageUrl" class="danni-swiper" vertical="true" @change="swiperChange"
            easing-function="default">
      <swiper-item class="swiper-1">
        <span class="swiper-span">
          <img class="image-1" :src="imageUrl+'0003'+'-min.jpg'" @click="bindViewTap('0003')"
               :animation="animation1"/>
        </span>
      </swiper-item>
      <swiper-item class="swiper-2">
        <span class="swiper-span">
          <img class="image-1" :src="imageUrl+'0060'+'-min.jpg'" @click="bindViewTap('0060')"
               :animation="animation2"/>
        </span>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import card from '@/components/card'

  export default {
    data () {
      return {
        imageUrl: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Danni/_Y2P',
        animation1: {},
        animation2: {},
        statusBarHeight: 0
      }
    },
    components: {
      card
    },
    methods: {
      bindViewTap (url) {
        let image = this.imageUrl + url + '-min.jpg'
        wx.previewImage({
          current: image, // 当前显示图片的http链接
          urls: [image] // 需要预览的图片http链接列表
        })
      },
      swiperChange (e) {
        if (e.mp.detail.current) {
          let animationBg = wx.createAnimation()
          animationBg.scale(2, 2).step({duration: 3000})
          this.animation2 = animationBg.export()
          let animationBg2 = wx.createAnimation()
          animationBg2.scale(1, 1).step({duration: 1000})
          this.animation1 = animationBg2.export()
        } else {
          let animationBg = wx.createAnimation()
          animationBg.scale(2, 2).step({duration: 3000})
          this.animation1 = animationBg.export()
          let animationBg2 = wx.createAnimation()
          animationBg2.scale(1, 1).step({duration: 1000})
          this.animation2 = animationBg2.export()
        }
      }
    },
    onLoad () {
      let system = wx.getSystemInfoSync()
      system.statusBarHeight += 4
      if (system.platform.toLowerCase() === 'android') {
        system.statusBarHeight += 4
      }
      this.statusBarHeight = system.statusBarHeight
      this.titleHeight = system.statusBarHeight + 32 + 8
    },
    onShareAppMessage () {
      let path = '/pages/index/main'
      return {
        title: '快来看狗子',
        path: path
      }
    }
  }
</script>

<style scoped lang="scss">
  .danni-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to right, #7ac4d7, rgb(237, 162, 162));
    .danni-barheight {
      width: 100vw;
      background: linear-gradient(rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0));
    }
    .danni-music {
      width: 8vw;
      height: 8vw;
      position: fixed;
      left: 5vw;
      top: 5vh;
      z-index: 1000;
    }
    .danni-swiper {
      height: 100vh;
      width: 100vw;
      .swiper-1 {
        text-align: center;
        height: 100vh;
        line-height: 100vh;
        .swiper-span {
          width: 80vw;
          height: 120vw;
          line-height: 120vw;
          display: inline-block;
          overflow: hidden;
          vertical-align: middle;
        }
        .image-1 {
          width: 80vw;
          height: 120vw;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .swiper-2 {
        .swiper-span {
          width: 80vw;
          height: 120vw;
          line-height: 120vw;
          display: inline-block;
          overflow: hidden;
          vertical-align: middle;
        }
        text-align: center;
        height: 100vh;
        line-height: 100vh;
        .image-1 {
          width: 80vw;
          height: 120vw;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

  }
</style>
