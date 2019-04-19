<template>
  <div class="card-choose-page">
    <title :name="'选择卡类型'"></title>
    <scroll-view class="choose-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="choose-main" :style="{'min-height':'calc(88vh - '+titleHeight +'px)'}">
        <div class="choose-context">
          <div class="choose-item item-bottom" @click="chooseItem(0)">
            <span>
              <div>计次卡</div>
              <div>购买次数，每消费一次总数减一</div>
            </span>
            <span>
              <img src="/static/right2.png"/>
            </span>
          </div>
          <div class="choose-item" @click="chooseItem(1)">
            <span>
              <div>储值卡</div>
              <div>预存金额，买卡时享赠送或消费时享打折</div>
            </span>
            <span>
              <img src="/static/right2.png"/>
            </span>
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
        logs: [],
        titleHeight: null
      }
    },
    methods: {
      chooseItem (e) {
        let url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=create&cardType=' + e
        wx.navigateTo({url})
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .card-choose-page {
    height: 100vh;
    background-color: #f0f0f0;
    .choose-scroll {
      height: 90vh;
      .choose-main {
        min-height: 80vh;
        padding-top: 2vh;
        .choose-context {
          background: white;
          padding: 2vw 5vw;
          .choose-item {
            padding: 4vw 0;
            span {
              display: inline-block;
              height: 10vw;
              vertical-align: top;
              &:nth-child(1) {
                line-height: 5vw;
                width: 80%;
                div {
                  &:nth-child(1) {
                    font-size: 4.5vw;
                  }
                  &:nth-child(2) {
                    font-size: 3vw;
                    color: #bfbfbf;
                    position: relative;
                    top: 1vw;
                  }
                }
              }
              &:nth-child(2) {
                line-height: 10vw;
                text-align: right;
                width: 20%;
                img {
                  width: rpx(13);
                  height: rpx(22);
                  display: inline-block;
                }
              }
            }
          }
          .item-bottom {
            border-bottom: rpx(1) solid #f0f0f0;
          }
        }
      }
    }
  }
</style>
