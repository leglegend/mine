<template>
  <div class="member">
    <div v-show="auth">
      <div class="member-top" :style="{height:'calc(75rpx + ' +(statusBarHeight+40)+'px)'}">
        <div class="member-title" :style="{'padding-top':statusBarHeight +'px'}">
          会员管理
        </div>
        <div class="member-search">
          <div>
            <span @click="doScan">
              <img src="/static/scan.png"/>
            </span>
            <span @click="jumpToKeyword">
              <img src="/static/search.png"/>
              会员名\卡号\手机号
            </span>
            <span @click="jumpToSearch">
              <img src="/static/screen.png"/>
            </span>
            <span @click="jumpToCreate">
              <img src="/static/add.png"/>
            </span>
          </div>
        </div>
      </div>
      <div>
        <scroll-view class="member-scroll" scroll-y="true" @scrolltolower="scrolltolower" enable-back-to-top="true"
                     scroll-with-animation="true"
                     :style="{height:'calc(100vh - 75rpx - ' +(statusBarHeight+40)+'px)'}">
          <div :style="{'min-height':'calc(90vh - 75rpx - ' +(statusBarHeight+40)+'px)',background: '#f0f0f0'}">
            <div style="padding: 0 5vw;width: 90vw;background-color: white">
              <div id="loading" style="padding-top: 2vw"></div>
              <div class="member-data">
                <div class="people">
              <span>
                <div>{{info.SumVipPeople}}</div>
                <div>全部会员(名)</div>
              </span>
                </div>
                <div class="member-info">
              <span class="part">
                <div class="value">{{info.SumVipNon}}</div>
                <div class="name">卡过期但有余额(张)</div>
              </span>
                  <span class="part">
                <div class="value">{{info.SumVip}}</div>
                <div class="name">卡有效且有余额(张)</div>
              </span>
                  <span class="part">
                <div class="value">{{info.SumNotRenewal}}</div>
                <div class="name">消费完未续费(张)</div>
              </span>
                </div>
              </div>
            </div>
            <div class="items" v-show="items.length>0">
              <div class="items-title">全部会员</div>
              <a v-for="(item,index) in items" v-on:click="jumpToDetails(item)">
                <item :key="index" :item="item" :last="index==items.length-1"></item>
              </a>
              <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
              <div class="footer" v-show="isLoading">加载中...</div>
            </div>
            <div class="demo-noitems" v-show="items.length==0&&!isLoading">
              还没有数据哦 =_="
            </div>
          </div>
          <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
            <img class="demo-nutcards" src="/static/nutcards.png"/>
          </div>
          <div class="demo-bottom"></div>
        </scroll-view>
      </div>
    </div>
    <div class="demo-noauth" v-show="auth==false">
      <div class="noauth-top" :style="{height:titleHeight+'px'}">
        <div class="noauth-title" :style="{'padding-top':statusBarHeight+'px'}">
          会员管理
        </div>
      </div>
      <div class="demo-noauthcontext" :style="{height:'calc(90vh - ' +titleHeight+'px)'}">
        {{auth == false ? '没有权限 =_="' : ''}}
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import item from '@/components/mbr'

  export default {
    components: {
      item
    },

    data () {
      return {
        titleHeight: null,
        statusBarHeight: null,
        auth: true,
        items: [],
        value: null,
        info: {},
        scrollTopView: null,
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        page: 1 // 消费明细当前页
      }
    },
    methods: {
      jumpToDetails (item) {
        const url = '../persion/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + item.UserId + '&cardId=' + item.CardId
        wx.navigateTo({url})
      },
      jumpToSearch () {
        const url = '../search/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToKeyword () {
        const url = '../keyword/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToCreate () {
        const url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      doScan () {
        let that = this
        wx.scanCode({
          success: function (res) {
            let url = res.result
            let theRequest = {}
            if (url.indexOf('?') !== -1) {
              let str = url.split('?')[1]
              let strs = str.split('&')
              for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
              }
              console.log(theRequest)
              that.jumpToDetails({UserId: theRequest.userId, CardId: theRequest.cardId})
            }
          }
        })
      },
      scrolltolower () {
        this.scrollTopView = null
        if (this.isLoading || this.isOver) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getMembers(this.page)
      },
      scrolltoupper () {
        this.scrollTopView = null
        if (this.isLoading) {
          return
        }
        this.isLoading = true
        this.page = 1
        this.getStatistical()
        let that = this
        setTimeout(function () {
          that.getMembers(that.page, function () {
            that.scrollTopView = 'loading'
          })
        }, 1000)
      },
      onBlur () {
        this.getMembers(1)
      },
      getMembers (page, callback) {
        let that = this
        this.isLoading = true
        this.type = 'result'
        this.$post('/card/businessGetUserCards', {
          KeyWord: this.value,
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
        }, this.isFirstLoad).then(res => {
          that.isFirstLoad = false
          if (res.Data.length < 10) {
            that.isOver = true
          }
          for (let i in res.Data) {
            that.items.push(res.Data[i])
          }
          if (page === 1) {
            that.items = res.Data
          }
          that.isLoading = false
          if (callback) {
            callback()
          }
        })
      },
      getStatistical () {
        let that = this
        this.$post('/store/businessGetStoreUserStatistical', {
          Uid: that.userId,
          StoreId: that.storeId
        }, this.isFirstLoad).then(res => {
          that.info = res
        })
      },
      getSystemPlatform () {
        setTimeout(function () {
          this.scrollTopView = 'loading'
        }.bind(this), 500)
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.isFirstLoad = true
      this.isOver = false
      this.getMembers(1)
      this.getStatistical()
      this.getSystemPlatform()
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
      wx.showShareMenu({
        withShareTicket: false
      })
      if (globalData.member && globalData.member.cardId) {
        this.jumpToDetails({UserId: globalData.member.userId, CardId: globalData.member.cardId})
      }
    },
    onShow () {
      let permissions = wx.getStorageSync('auth')
      if (permissions && permissions.length > 0) {
        for (let item of permissions) {
          if (item.PController === 'members' && item.State === 0) {
            this.auth = false
            return
          }
        }
        this.auth = true
      }
      if (this.isFirstLoad) {
        return
      }
      this.isOver = false
      this.page = 1
      this.getMembers(1)
      this.getStatistical()
    },
    onShareAppMessage () {
      return {
        title: '坚果卡包商家版',
        path: '/pages/index/main'
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .member {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .member-top {
      background: linear-gradient(to right, #ff8100, #ff6700);
    }
    .member-title {
      width: 100vw;
      height: 34px;
      line-height: 34px;
      padding-bottom: 6px;
      text-align: center;
      font-size: rpx(35);
      color: white;
    }
    .member-search {
      width: 100vw;
      height: rpx(75);
      div {
        width: 90vw;
        margin: 0 auto;
        height: rpx(52);
        img {
          display: inline-block;
          vertical-align: middle;
          width: rpx(35);
          height: rpx(35);
        }
        span {
          display: inline-block;
          height: rpx(52);
          vertical-align: top;
          &:nth-child(1) {
            width: 10vw;
          }
          &:nth-child(2) {
            width: 55.5vw;
            line-height: rpx(52);
            padding-left: 2.5vw;
            border-radius: rpx(8);
            font-size: rpx(21);
            color: white;
            background-color: rgb(225, 92, 0);
            img {
              width: rpx(22);
              height: rpx(22);
            }
          }
          &:nth-child(3) {
            width: 11vw;
            text-align: right;
          }
          &:nth-child(4) {
            width: 11vw;
            text-align: right;
          }
        }
      }
    }
    .member-scroll {
      width: 100vw;
      background-color: #f0f0f0;
      .member-data {
        width: 90vw;
        text-align: center;
        padding-top: 4.5vh;
        background-color: white;
        .people {
          height: 26vw;
          width: 40vw;
          margin-left: 25vw;
          border-radius: 50%;
          text-align: center;
          padding-top: 14vw;
          background-color: #78bc6d;
          span {
            display: block;
            height: 20vw;
            line-height: 10vw;
            div {
              color: white;
              &:nth-child(1) {
                font-size: rpx(75);
                font-weight: 600;
              }
              &:nth-child(2) {
                font-size: rpx(27);
                position: relative;
                top: rpx(-12);
              }
            }
          }
        }
        .member-info {
          width: 90vw;
          margin-top: rpx(70);
          padding-bottom: 6vh;
          border-bottom: rpx(1) solid #a7a7a7;
          .part {
            display: inline-block;
            width: calc(30vw - 2rpx);
            line-height: 6vh;
            height: 6vh;
            &:nth-child(2) {
              border-left: rpx(1) solid #78bc6d;
              border-right: rpx(1) solid #78bc6d
            }
          }
          .name {
            height: 1.6vh;
            line-height: 1.6vh;
            font-size: rpx(20);
            color: #969696;
          }
          .value {
            height: 4vh;
            line-height: 4vh;
            font-weight: 600;
            position: relative;
            top: rpx(-12);
          }
        }
      }

      .items {
        padding-top: 4.4vh;
        background-color: white;
        .items-title {
          font-size: rpx(45);
          padding-left: 5vw;
          font-weight: 600;
        }
      }
    }
  }
</style>
