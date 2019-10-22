<template>
  <div class="demo-page account">
    <title :name="'我的账号'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main account-main"
           :style="{'height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div class="demo-context account-context">
          <div class="mobile" @click="jumpToMobile">
            <span>
              绑定电话<text style="color: red">*</text>
            </span>
            <span>{{mobile}}</span>
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="mobile" @click="jumpToStore" v-if="!(count==1&&!type)">
            <span>
              绑定店铺<text style="color: red">*</text>
            </span>
            <span>{{storeName}}</span>
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
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
        titleHeight: null,
        mobile: '',
        type: null,
        storeName: '',
        count: 0
      }
    },
    methods: {
      jumpToStore () {
        const url = '../store/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToMobile () {
        const url = '../mobile/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      }
    },
    onLoad (res) {
      this.userId = res.userId
      this.storeId = res.storeId
      this.storeName = res.storeName
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      let globalData = this.getGlobalData()
      this.mobile = globalData.user.mobile
      this.type = globalData.user.type
      this.count = globalData.storeList.length
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .account {
    background-color: #f0f0f0;
    .account-main {
      .account-context {
        padding: 1vh 5vw;
        height: 75vh;
        background-color: white;
        .mobile {
          height: 6vh;
          line-height: 6vh;
          border-bottom: rpx(1) solid #bbbbbb;
          span {
            display: inline-block;
            height: 6vh;
            line-height: 6vh;
            vertical-align: top;
            font-size: rpx(32);
            &:nth-child(1) {
              padding-left: 1vw;
              width: 22vw;
            }
            &:nth-child(2) {
              color: #7e7e7e;
              width: 65vw;
            }
          }
        }
        img {
          display: inline-block;
          height: rpx(21);
          width: rpx(13);
          vertical-align: middle;
          position: relative;
          top: rpx(-1);
        }
      }
    }
  }
</style>
