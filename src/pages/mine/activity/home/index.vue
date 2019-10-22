<template>
  <div class="activity-page">
    <title :name="'活动管理'"></title>
    <scroll-view class="activity-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="activity-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="activity-context">
          <div class="no-activity" v-if="items.length==0&&isOver">
            <div class="no-title">
              <span>拓</span>
              <span>客</span>
              <span>之</span>
            </div>
            <div class="no-title2">
              裂变转发秘籍
            </div>
            <div class="no-context" style="padding-top: 4vw">
              通常获取新客时，需做一些优惠打折或免费体验等活动激励大家转发，被领取的越多自己得到的就越多，激励每一个人成为你的转发者，不断裂变。本工具支持形式：
            </div>
            <div class="no-context2">
              <span>1、</span>
              <span>仅会员得奖励：会员转发就可得</span>
            </div>
            <div class="no-context2">
              <span>2、</span>
              <span>新客与会员均可得奖励：每介绍一名新客，新客和会员可各得一个奖励</span>
            </div>
            <div class="no-context2">
              <span>3、</span>
              <span>新客转发也得奖励(最强裂变)：新客也可转发，介绍其它新客，每介绍成功一个新客可再得奖励。</span>
            </div>
            <div class="no-context" style="padding-top: 4vw">
              分发渠道例举：
            </div>
            <div class="no-context2">
              <span>1、</span>
              <span>将活动发送给现有会员，激励现有会员帮您转发</span>
            </div>
            <div class="no-context2">
              <span>2、</span>
              <span>店主自己转发活动到朋友圈，激励朋友协助转发</span>
            </div>
            <div class="no-context2">
              <span>3、</span>
              <span>将活动二维码彩印出来置于店内或到附近居民区发宣传单，用户看到后扫描参与活动</span>
            </div>
          </div>
          <div class="activitys">
            <div class="activity-item" v-for="item in items" @click="jumpToView(item)">
              <div class="item-bg">
                <div class="bg-filter">
                  <div class="bg-filter"
                       :style="{background:'url('+item.BgImg+'?x-oss-process=image/blur,r_40,s_15/resize,m_lfit,h_200,w_200)','background-size':'100%,auto',filter:item.State==3?'grayscale(1)':''}"></div>
                </div>
                <div class="bg-filter" style="background: rgba(0,0,0,0.1);z-index: 9"></div>
                <div class="bg-context">
                  <span class="option-state" v-if="item.State==1">
                    <span>进行中</span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/sale.png"/>
                  </span>
                  <span class="option-state" v-if="item.State==2" style="filter:grayscale(1)">
                    <span>未开始</span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/sale.png"/>
                  </span>
                  <span class="overdue" v-if="item.State==3">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/overdue.png"/>
                  </span>
                  <div class="bg-info">
                    <text>{{item.Title}}</text>
                  </div>
                </div>
              </div>
              <div class="item-info">
                <div>
                  <span>活动截止：</span>
                  <span>{{item.BeginDate}}至{{item.EndDate}}</span>
                </div>
                <div>
                  <span>浏览量：</span>
                  <span>{{item.Pageviews}}</span>
                  <span style="padding-left: 3vw" v-if="item.IsTwoReward">转发送券：</span>
                  <span v-if="item.IsTwoReward">{{item.ForwardCoupon}}张</span>
                  <span style="padding-left: 3vw" v-if="item.IsOneReward">新客送券：</span>
                  <span v-if="item.IsOneReward">{{item.NewUserCoupon}}张</span>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-buttons" style="text-align: center;padding: 10vw 0">
            <div class="done" style="width: 65vw;height: 11vw;line-height: 11vw" @click="jumpToCreate(0)">
              创建新活动
            </div>
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
        items: [],
        titleHeight: null,
        page: 1,
        isLoading: false, // 正在加载明细
        isOver: false // 消费明细是否加载完
      }
    },
    methods: {
      jumpToCreate () {
        let url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToView (item) {
        let url = '../view/main?userId=' + this.userId + '&storeId=' + this.storeId + '&id=' + item.Id
        wx.navigateTo({url})
      },
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
        this.$post('/activity/businessGetActivityList', {
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
          // that.jumpToView(that.items[0])
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.getItems(1)
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.storeId) {
        this.getItems(1)
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .activity-page {
    height: 100vh;
    background-color: #f0f0f0;
    .activity-scroll {
      height: 90vh;
      .activity-main {
        min-height: 80vh;
        background: white;
        .activity-context {
          .activitys {
            padding: 1vw 6vw;
          }
          .activity-item {
            padding: 7vw 0 5vw 0;
            border-bottom: rpx(1) solid #bbbbbb;
            width: 88vw;
            .item-bg {
              height: 38vw;
              position: relative;
              text-align: center;
              color: white;
              .bg-filter {
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                overflow: hidden;
              }
              .bg-context {
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 10;
              }
              .bg-info {
                padding: 5vw 3vw 0 3vw;
                line-height: 27vw;
                text {
                  vertical-align: middle;
                  line-height: 9vw;
                  font-size: 7vw;
                  width: 100%;
                  display: inline-block;
                  word-wrap: break-word;
                  word-break: normal;
                }
              }

              .option-state {
                display: inline-block;
                width: rpx(80);
                height: rpx(80);
                height: 0;
                position: absolute;
                top: -2.5vw;
                right: -2.5vw;
                font-size: 2.5vw;
                color: white;
                text-align: center;
                line-height: rpx(80);
                img {
                  position: absolute;
                  left: 0;
                  top: 0;
                  display: inline-block;
                  width: rpx(80);
                  height: rpx(80);
                }
                span {
                  position: relative;
                  display: inline-block;
                  z-index: 100;
                }
              }
              .overdue {
                display: inline-block;
                width: rpx(182);
                height: rpx(182);
                position: absolute;
                top: -2vw;
                right: -2vw;
                img {
                  width: rpx(182);
                  height: rpx(182);
                }
              }
            }
            .item-info {
              font-size: 3.5vw;
              padding-top: 4vw;
              div:nth-child(2) {
                padding-top: 1vw;
              }
              span:nth-child(2n+0) {
                color: #bfbfbf;
              }
            }
          }
          .no-activity {
            padding: 6vw;
            background: rgb(255, 237, 173);
            color: #c48f21;
            font-size: 3.3vw;
            line-height: 5.5vw;
            .no-title {
              text-align: center;
              span {
                width: 5vw;
                height: 5vw;
                font-size: 4vw;
                line-height: 5vw;
                display: inline-block;
                color: rgb(255, 237, 173);
                border-radius: 50%;
                background: #c48f21;
              }
            }
            .no-title2 {
              text-align: center;
              font-size: 6.5vw;
              height: 10vw;
              line-height: 10vw;
              color: #c48f21;
            }
            .no-context {
              font-weight: 600;
            }
            .no-context2 {
              span {
                display: inline-block;
                vertical-align: top;
                &:nth-child(1) {
                  width: 5%;
                }
                &:nth-child(2) {
                  width: 95%;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
