<template>
  <div class="service-record-page">
    <title :name="'订购记录'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-record-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-record-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-record-context">
          <div class="record-title">
            <span>周期</span>
            <span>有效期</span>
            <span>金额</span>
          </div>
          <div class="record-items">
            <div class="record-item" v-for="(item,index) in items"
                 :style="{'border-bottom':index==items.length-1?'0':''}">
              <div class="item-top">
                <span>{{item.CycleTitle}}</span>
                <span>{{item.ServiceBeginDate}} 至 {{item.ServiceEndDate}}</span>
                <span>{{item.PayPrice + '元'}}</span>
              </div>
              <div class="item-bottom">
                {{item.CreateDate}} &nbsp;&nbsp; {{item.State == 1 ? '订购成功' : item.State == 0 ? '待入账' : '已删除'}}
                <span v-if="item.IsUserSoftCoupon">优惠码</span>
              </div>
            </div>
          </div>
          <div class="footer" v-show="isOver&&items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" v-show="isOver&&items.length==0">还没有数据 =_="</div>
          <div class="footer" v-show="isLoading">加载中...</div>
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
        items: [],
        page: 1,
        isLoading: false, // 正在加载明细
        isOver: false // 消费明细是否加载完
      }
    },
    methods: {
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.isLoading = true
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.$post('/soft/businessGetSoftOrder', {
          Uid: this.userId,
          StoreId: this.storeId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          that.isLoading = false
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let item of res.Data) {
              that.items.push(item)
            }
          }
          if (res.Data.length < 10) {
            that.isOver = true
          }
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.isLoading = false
      this.isOver = false
      this.page = 1
      this.getItems(1)
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-record-page {
    height: 100vh;
    background-color: #f0f0f0;
    .service-record-scroll {
      height: 90vh;
      .service-record-main {
        min-height: 80vh;
        .service-record-context {
          .record-title {
            padding: 0 7vw;
            font-size: 4vw;
            font-weight: 600;
            background: #F0F0F0;
            height: 14vw;
            line-height: 14vw;
            span {
              display: inline-block;
              width: 25%;
              &:nth-child(2) {
                width: 50%;
                text-align: center;
              }
              &:nth-child(3) {
                text-align: right;
              }
            }
          }
          .record-items {
            padding: 0 7vw;
            background: #ffffff;
            .record-item {
              height: 18vw;
              border-bottom: rpx(1) solid #BFBFBF;
              .item-top {
                font-weight: 500;
                font-size: 3vw;
                padding-top: 4.7vw;
                height: 3.1vw;
                line-height: 3.1vw;
                span {
                  display: inline-block;
                  width: 18%;
                  &:nth-child(2) {
                    width: 64%;
                    text-align: center;
                  }
                  &:nth-child(3) {
                    text-align: right;
                    color: #BB924A;
                  }
                }
              }
              .item-bottom {
                padding-top: 3.5vw;
                font-size: 2.4vw;
                height: 4.4vw;
                line-height: 4.4vw;
                color: #ACACB3;
                span {
                  height: 3.4vw;
                  line-height: 3.4vw;
                  display: inline-block;
                  border-radius: 1.7vw;
                  margin-left: 1vw;
                  background: red;
                  color: white;
                  font-size: 2vw;
                  padding: 0 1vw;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
