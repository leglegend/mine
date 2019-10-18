<template>
  <div class="services-model" @click.stop="close">
    <div class="services-context" @click.stop="">
      <div class="context-close">
        <span @click.stop="close">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </span>
      </div>
      <div class="context-title">
        <span>服务项目</span>
        <span>额度(次)</span>
      </div>
      <div class="context-items">
        <div class="context-item" v-for="item in services" v-if="!item.IsGift">
          <span>{{item.ItemName}}</span>
          <span>{{item.CardValue}}次</span>
        </div>
        <div class="context-item" v-for="item in services" v-if="item.IsGift">
          <span>{{item.ItemName}}</span>
          <span>{{item.CardValue}}次</span>
        </div>
      </div>
      <div class="context-all">
        {{computedAll}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['services'],
    data () {
      return {
      }
    },
    computed: {
      computedAll () {
        if (!this.services || this.services.length < 0) {
          return '共0次'
        } else {
          let times = 0
          for (let item of this.services) {
            times += item.CardValue
          }
          return '共' + times + '次'
        }
      }
    },
    methods: {
      close () {
        this.$emit('close')
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .services-model {
    width: 100vw;
    height: 80vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.35);
    padding-top: 20vh;
    z-index: 9999;
    top: 0;
    left: 0;
    .services-context {
      width: 85vw;
      margin: 0 auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 1.9vw;
      padding: 0 0 7.1vw 0;
      .context-close {
        text-align: right;
        padding-bottom: 0.4vw;
        span {
          display: inline-block;
          width: 3.9vw;
          height: 3.9vw;
          padding: 4.5vw;
          vertical-align: top;
        }
        img {
          width: 3.9vw;
          height: 3.9vw;
        }
      }
      .context-title {
        height: 4.2vw;
        line-height: 4.2vw;
        padding-bottom: 4.5vw;
        border-bottom: 0.1vw solid #BBBBBB;
        span {
          display: inline-block;
          box-sizing: border-box;
          width: 50%;
          vertical-align: top;
          height: 4.2vw;
          line-height: 4.2vw;
          color: #000000;
          font-size: 4.4vw;
          &:nth-child(1) {
            padding-left: 7.4vw;
          }
          &:nth-child(2) {
            text-align: right;
            padding-right: 8.6vw;
          }
        }
      }
      .context-items {
        padding: 2.4vw 8.2vw 5vw 7.4vw;
        .context-item {
          height: 3.5vw;
          line-height: 3.5vw;
          font-size: 3.5vw;
          padding: 2vw 0;
          span {
            display: inline-block;
            vertical-align: top;
            height: 3.5vw;
            line-height: 3.5vw;
            width: 50%;
            &:nth-child(1) {
              color: #181818;
            }
            &:nth-child(2) {
              color: #919191;
              text-align: right;
            }
          }
        }
      }
      .context-all {
        padding: 0 9.2vw 7.1vw 0;
        text-align: right;
        font-size: 6.3vw;
        color: #919191;
      }
    }
  }
</style>
