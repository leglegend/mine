<template>
  <div class="ac-report-page">
    <title :name="'活动报告'"></title>
    <scroll-view class="ac-report-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="ac-report-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="ac-report-context">
          <div class="report-data">
            <div class="data-name">
              活动页总浏览(次)
            </div>
            <div class="data-money">
              {{report.AllPageviews}}
            </div>
            <div class="line">
              <span class="info-data">
                <div class="name">有效转发(人)</div>
                <div class="value">{{report.EffectiveForwards}}</div>
              </span>
              <span class="info-data">
                <div class="name">转发者获得(张)</div>
                <div class="value">{{report.ForwarderGetCount}}</div>
              </span>
              <span class="info-data">
                <div class="name">转发者已使用(张)</div>
                <div class="value">{{report.ForwarderUsedCount}}</div>
              </span>
            </div>

            <div class="line">
              <span class="info-data">
                <div class="name">新客浏览(人)</div>
                <div class="value">{{report.NewViewers}}</div>
              </span>
              <span class="info-data">
                <div class="name">新客领取(张)</div>
                <div class="value">{{report.NewUserGetCount}}</div>
              </span>
              <span class="info-data">
                <div class="name">新客已使用(张)</div>
                <div class="value">{{report.NewUserUsedCount}}</div>
              </span>
            </div>
          </div>
          <div class="items-title-select">
            <div style="height: 1px"></div>
            <span :class="type=='share'?'title-selected':''" @click="changeType('share')">转发者记录</span>
            <span :class="type=='get'?'title-selected':''" @click="changeType('get')">新客记录</span>
          </div>
          <div class="count-title" v-if="items.length>0">
            共获得/已使用
          </div>
          <div class="report-items" v-if="type=='share'">
            <div class="items" v-for="item in items" @click="jumpToDetails(item)">
              <span class="item-left">
                <img :src="item.UserImg"/>
              </span>
              <span class="item-right">
                <div class="item-title">
                  <span>{{item.UserName}}<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ismember.png"
                                              style="width: 14rpx;height: 22.4rpx;position: relative;top:2rpx"
                                              v-if="item.IsVip"/></span>
                  <span style="vertical-align: bottom;"><text
                    style="display:inline-block;vertical-align: bottom;">{{item.SelfGetCount}}</text>/{{item.SelfUsedCount}}</span>
                </div>
                <div class="item-context">
                  <span>新客浏览 {{item.NewViewers}}人</span>
                  <span>领取 {{item.NewUserGetCount}}张</span>
                  <span>已使用 {{item.NewUserUsedCount}}张</span>
                </div>
              </span>
            </div>
          </div>
          <div class="report-items" v-if="type=='get'">
            <div class="items" v-for="item in items">
              <span class="item-left">
                <img :src="item.UserImg"/>
              </span>
              <span class="item-right">
                <div class="item-title">
                  <span>{{item.UserName}}<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ismember.png"
                                              style="width: 14rpx;height: 22.4rpx;position: relative;top:2rpx"
                                              v-if="item.IsVip"/></span>
                  <span v-if="!item.LogType"><text>{{item.NewUserGetCount}}</text>/{{item.NewUserUsedCount}}</span>
                  <span v-if="item.LogType">仅浏览</span>
                </div>
                <div class="item-context">
                  {{item.CreateDate}}
                </div>
              </span>
            </div>
          </div>
          <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
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
        items: [],
        report: {},
        type: 'share',
        page: 1,
        isLoading: false,
        isOver: false,
        firstLoad: true,
        titleHeight: null
      }
    },
    methods: {
      jumpToDetails (item) {
        wx.setStorageSync('share', item)
        let url = '../details/main?userId=' + this.userId + '&storeId=' + this.storeId + '&activityId=' + this.activityId
        wx.navigateTo({url})
      },
      changeType (type) {
        this.type = type
        this.page = 1
        this.items = []
        this.firstLoad = true
        this.isOver = false
        this.getItems(1)
      },
      getReportData () {
        let that = this
        this.$post('/activity/businessActivityDataStatistical', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId
        }).then(res => {
          that.report = res
        })
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
        let url = ''
        if (this.type === 'share') {
          url = '/activity/businessActivityForwarderDataList'
        } else {
          url = '/activity/businessActivityNewUserDataList'
        }
        this.$post(url, {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          IsSelectAll: true,
          PageSize: 10,
          PageIndex: page
        }, this.firstLoad).then(res => {
          that.isLoading = false
          that.firstLoad = false
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
      this.userId = option.userId
      this.storeId = option.storeId
      this.activityId = option.activityId
      this.type = 'share'
      this.firstLoad = true
      this.getReportData()
      this.getItems(1)
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .ac-report-page {
    height: 100vh;
    background-color: #f0f0f0;
    .ac-report-scroll {
      height: 90vh;
      .ac-report-main {
        min-height: 80vh;
        .report-data {
          width: 96vw;
          padding: 0 2vw;
          text-align: center;
          border-bottom: rpx(1) solid #bbbbbb;
          background-color: white;
          .data-money {
            width: 90vw;
            margin: 0 auto;
            font-size: rpx(90);
            color: #ff6700;
            padding-bottom: rpx(30);
          }
          .data-name {
            padding-top: 10vw;
            font-size: rpx(28);
          }
          .line {
            width: 90vw;
            margin: 0 auto;
            height: 9.5vh;
            line-height: 9.5vh;
            .info-data {
              display: inline-block;
              margin-top: 2vh;
              height: 5.5vh;
              width: 29vw;
              text-align: center;
              .value {
                height: 3.5vh;
                line-height: 3.5vh;
                font-size: rpx(35);
                padding-left: rpx(10);
                color: #ff6700;
              }
              .name {
                height: 2vh;
                line-height: 2vh;
                font-size: rpx(22);
                padding-left: rpx(10);
              }
              &:nth-child(2) {
                border-left: rpx(1) solid #e3e3e3;
                border-right: rpx(1) solid #e3e3e3;
              }
            }
          }
        }
        .items-title-select {
          text-align: center;
          padding-top: 7vw;
          background-color: white;
          span {
            display: inline-block;
            width: 33vw;
            border: rpx(1) solid #ff6700;
            height: 7vw;
            line-height: 7vw;
            font-size: 3.5vw;
            color: #ff6700;
            &:nth-child(2) {
              margin-top: rpx(1);
              border-top-left-radius: 2vw;
              border-bottom-left-radius: 2vw;
            }
            &:nth-child(3) {
              margin-top: rpx(1);
              border-top-right-radius: 2vw;
              border-bottom-right-radius: 2vw;
            }
          }
          .title-selected {
            background: rgb(255, 103, 0);
            color: white !important;
          }
        }
        .count-title {
          padding: 7vw 5vw 0 5vw;
          text-align: right;
          font-size: 3.1vw;
          color: #7e7e7e;
          background-color: white;
        }
        .report-items {
          padding: 3vw 5vw 0 5vw;
          background-color: white;
          .items {
            height: 19vw;
            font-size: 3vw;
            span {
              display: inline-block;
              vertical-align: top;
            }
            .item-left {
              width: 10.5vw;
              height: 10.5vw;
              img {
                display: inline-block;
                width: 8.5vw;
                height: 8.5vw;
                border-radius: 50%;
              }
            }
            .item-right {
              width: 79.5vw;
              border-bottom: rpx(1) solid #dddddd;
              height: 14vw;
              .item-title {
                font-size: 3.5vw;
                span {
                  width: 60%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  &:nth-child(2) {
                    width: 40%;
                    text-align: right;
                    color: #a7a7a7;
                  }
                }
                text {
                  font-size: 4vw;
                  color: black;
                }
              }
              .item-context {
                padding-top: 1vw;
                color: #a7a7a7;
                span {
                  &:nth-child(1) {
                    width: 25vw;
                  }
                  &:nth-child(2) {
                    width: 20vw;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
