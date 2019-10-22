<template>
  <div class="ac-details-page">
    <title :name="'转发效果'"></title>
    <scroll-view class="ac-details-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="ac-details-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="ac-details-context">
          <div class="member-info">
            <div class="info-context">
              <img class="logo" :src="user.UserImg"/>
              <div class="name">{{user.UserName}}</div>
              <div class="line" style="width: 100vw;text-align: left;font-weight: 500">
                <span class="info-data">
                  <div class="name">已获得券(张)</div>
                  <div class="value" style="color: white">{{user.SelfGetCount}}</div>
                </span>
                <span class="info-data">
                  <div class="name">已使用(张)</div>
                  <div class="value" style="color: white">{{user.SelfUsedCount}}</div>
                </span>
                <span class="info-data">
                  <div class="name">待领取(张)</div>
                  <div class="value" style="color: white">{{user.WaitGetCount}}</div>
                </span>
              </div>
            </div>
            <span class="background-logo" :style="{background:'url('+user.UserImg+')','background-size':'100%,auto'}"/>
            <span class="background-home"></span>
          </div>
          <div class="share-title">
            TA的转发效果
          </div>
          <div class="line" style="background: white">
            <span class="info-data">
              <div class="name">新客浏览(人)</div>
              <div class="value">{{user.NewViewers}}</div>
            </span>
            <span class="info-data">
              <div class="name">新客获取(张)</div>
              <div class="value">{{user.NewUserGetCount}}</div>
            </span>
            <span class="info-data">
              <div class="name">新客已使用(张)</div>
              <div class="value">{{user.NewUserUsedCount}}</div>
            </span>
          </div>
        </div>
        <div class="count-title" v-if="items.length>0">
          共获得/已使用
        </div>
        <div class="report-items">
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
        user: {},
        isLoading: false,
        isOver: false,
        firstLoad: true,
        titleHeight: null
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
        this.$post('/activity/businessActivityNewUserDataList', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          RecomUid: this.user.Uid,
          IsSelectAll: false,
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
      this.userId = option.userId
      this.storeId = option.storeId
      this.activityId = option.activityId
      this.user = wx.getStorageSync('share')
      this.getItems(1)
      wx.removeStorageSync('share')
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .ac-details-page {
    height: 100vh;
    background-color: #f0f0f0;
    .ac-details-scroll {
      height: 90vh;
      .ac-details-main {
        min-height: 80vh;
        .member-info {
          width: 100vw;
          position: relative;
          overflow: hidden;
          .info-context {
            position: relative;
            width: 100vw;
            z-index: 3;
            background: rgba(0, 0, 0, 0.11);
            text-align: center;
            padding: 2vh 0;
            .logo {
              display: inline-block;
              height: 10.5vh;
              width: 10.5vh;
              border-radius: 50%;
            }
            .edit {
              position: absolute;
              top: 0;
              right: 0;
              padding: 2vh 5vw;
              img {
                width: rpx(32);
                height: rpx(33);
              }
            }
            .name {
              font-size: rpx(35);
              font-weight: 600;
              height: 6.5vh;
              color: white;
            }
            .infomation {
              text-align: left;
              padding-left: 4vw;
              height: 4.5vh;
              span {
                display: inline-block;
                vertical-align: top;
                height: 3vh;
                line-height: 3vh;
                &:nth-child(1) {
                  font-size: rpx(26);
                  width: 15vw;
                  color: #e7e7e7;
                }
                &:nth-child(2) {
                  font-size: rpx(26);
                  color: white;
                }
              }
            }
          }
          .background-logo {
            width: 120vw;
            height: 120vw;
            position: absolute;
            top: -10vw;
            left: -10vw;
            z-index: 1;
            filter: blur(rpx(50));
            // opacity: 0.8;
          }
          .background-home {
            width: 100vw;
            height: 100vw;
            position: absolute;
            z-index: 2;
            top: 0vw;
            left: 0vw;
            background-color: rgba(0, 0, 0, 0.10);
          }
        }
        .share-title {
          padding: 5vw 5vw 0 5vw;
          font-weight: 600;
          font-size: 6vw;
          background: white;
        }
        .line {
          width: 100vw;
          height: 11.5vh;
          line-height: 11.5vh;
          .info-data {
            display: inline-block;
            margin-top: 3vh;
            height: 5.5vh;
            width: 33vw;
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
        .count-title {
          padding: 2vw 5vw 0 5vw;
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
                  width: 50%;
                  &:nth-child(2) {
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
