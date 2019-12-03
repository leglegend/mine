<template>
  <div class="msg-record-page">
    <title :name="'发送记录'"></title>
    <scroll-view class="msg-record-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="msg-record-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="msg-record-context">
          <div class="context-title">发送总数量：{{count}}&nbsp;条</div>
          <div class="context-items">
            <div class="context-item" v-for="item in items">
              <span>{{item.Mobile}}</span>
              <span>{{item.SmsType}}</span>
              <span>{{item.SendTime}}</span>
            </div>
          </div>
          <div class="footer" style="background: white" v-show="isOver&&items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" style="background: white" v-show="isLoading">加载中...</div>
          <div class="demo-noitems" v-show="items.length==0&&!isLoading">
            还没有数据哦 =_="
          </div>
        </div>
      </div>
      <div class="demo-footer" v-show="isOver||items.length==0" style="padding-top: 0vh">
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
        items: [],
        count: 0,
        isOver: false,
        isLoading: false,
        titleHeight: null
      }
    },
    methods: {
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.isLoading = true
        this.$post('/smsCenter/getStoreSmsSendLog', {
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 20,
          PageIndex: page
        }).then(res => {
          that.count = res.TotalCount
          if (res.Data.length < 20) {
            that.isOver = true
          }
          for (let i in res.Data) {
            that.items.push(res.Data[i])
          }
          if (page === 1) {
            that.items = res.Data
          }
          that.isLoading = false
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.page = 1
      this.items = []
      this.getItems(1)
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .msg-record-page {
    height: 100vh;
    background-color: #f0f0f0;
    .msg-record-scroll {
      height: 90vh;
      .msg-record-main {
        min-height: 80vh;
        background: white;
        .msg-record-context {
          padding: 6.7vw 0;
          .context-title {
            padding: 0 8vw 2.6vw 8vw;
            font-size: 3.5vw;
            font-weight: 600;
            border-bottom: 0.1vw solid #E9E9E9;
          }
          .context-items {
            padding: 0 7.6vw;
            .context-item {
              height: 13.8vw;
              line-height: 13.8vw;
              border-bottom: 0.1vw solid #E9E9E9;
              span {
                height: 13.8vw;
                line-height: 13.8vw;
                display: inline-block;
                color: #898989;
                font-size: 3.3vw;
                &:nth-child(1) {
                  width: 35%;
                  text-align: left;
                }
                &:nth-child(2) {
                  width: 30%;
                  text-align: center;
                }
                &:nth-child(3) {
                  width: 35%;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
