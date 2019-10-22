<template>
  <div class="demo-page mine-add">
    <title :name="'添加店员'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context">
          <div style="background-color: white">
            <div class="qrcode" :style="{filter:isOverdue?'grayscale(100%)':''}">
              <img :src="url"/>
              <div v-if="isOverdue">
                软件已到期
              </div>
            </div>
            <div class="infomation">
              <div>让店员扫描上方小程序码</div>
              <div>当您不在店里时</div>
              <div>店员可接收消卡/收款声音提示及会员管理</div>
              <div>添加成功后可配置该店员的使用权限</div>
            </div>
          </div>
          <div style="padding: 1vh"></div>
          <div class="clerks">
            <div class="clerk" v-for="item in items" @click="jumpToPermission(item)">
              <span>
                <img :src="item.UserImg"/>
              </span>
              <span>{{item.StoreUserName ? item.StoreUserName : item.UserName}}</span>
              <span>权限</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="clerk animation" v-for="item in news">
              <span>
                <img :src="item.UserImg"/>
              </span>
              <span>{{item.StoreUserName ? item.StoreUserName : item.UserName}}</span>
              <span>正在绑定</span>
              <span>
              </span>
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
        titleHeight: null,
        items: [],
        news: [],
        url: ''
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      }
    },
    methods: {
      jumpToPermission (item) {
        let globalData = this.getGlobalData()
        globalData.admin = item
        const url = '../permission/main?userId=' + this.userId + '&storeId=' + this.storeId + '&adminId=' + item.UserId
        wx.navigateTo({url})
      },
      getQrCode () {
        let that = this
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.$post('/user/businessGetBindAdminQrCodeStr', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.url = res.QrCodeImg
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        })
      },
      getClerks (callback) {
        let that = this
        this.$post('/user/businessGetAdminList', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.firstLoad = false
          that.items = res.Users
          if (callback) {
            callback()
          }
        })
      }
    },
    onLoad (res) {
      this.userId = res.userId
      this.storeId = res.storeId
      this.firstLoad = true
      this.url = ''
      this.items = []
      this.news = []
      this.getQrCode()
      this.getClerks()
      this.titleHeight = this.getGlobalData().titleHeight
      this.wss = this.getGlobalUrl().wss
      let that = this
      let request = {
        SourceUserID: this.userId,
        MsgType: 0
      }
      wx.connectSocket({
        url: that.wss
      })
      // testws.link-fit.com
      // ws.link-fit.com
      wx.onSocketOpen(function (res) {
        wx.sendSocketMessage({
          data: JSON.stringify(request)
        })
      })
      wx.onSocketMessage(function (res) {
        let data = JSON.parse(res.data)
        console.log(data)
        if (data.Data) {
          let newClerk = JSON.parse(data.Data)
          if (data.MsgType === 1) {
            that.news.push(newClerk.UserInfo)
          } else if (data.MsgType === 2) {
            that.getClerks(function () {
              let news = []
              for (let item of that.news) {
                if (item.UserId !== newClerk.Id) {
                  news.push(item)
                }
              }
              that.news = news
            })
          }
        }
      })
    },
    onShow () {
      if (this.firstLoad === false) {
        this.news = []
        this.getClerks()
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mine-add {
    background-color: #f0f0f0;
    .qrcode {
      text-align: center;
      padding: 4vh 0;
      img {
        width: rpx(350);
        height: rpx(350);
      }
      div {
        position: absolute;
        width: rpx(360);
        left: rpx(198);
        height: rpx(360);
        top: calc(4vh - 2rpx);
        color: white;
        font-size: 7vw;
        line-height: rpx(350);
        font-weight: 600;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 50%;
      }
    }
    .infomation {
      text-align: center;
      padding-bottom: 4vh;
      div {
        font-size: rpx(25);
        color: #c3c3c3;
        &:nth-child(1) {
          color: black;
          font-size: rpx(30);
          padding-bottom: 1vh;
        }
      }
    }
    .clerks {
      background-color: white;
      .clerk {
        width: 90vw;
        margin: 0 auto;
        height: 12vw;
        line-height: 12vw;
        border-bottom: rpx(1) solid #f0f0f0;
        span {
          display: inline-block;
          vertical-align: top;
          height: 12vw;
          line-height: 12vw;
          &:nth-child(1) {
            width: 10vw;
            img {
              border-radius: 50%;
              width: 8vw;
              height: 8vw;
              display: inline-block;
              vertical-align: middle;
            }
          }
          &:nth-child(2) {
            width: 59vw;
            padding-left: 1vw;
            font-size: rpx(30);
          }
          &:nth-child(3) {
            width: 15vw;
            font-size: rpx(25);
            color: #c3c3c3;
            text-align: right;
          }
          &:nth-child(4) {
            width: 5vw;
            text-align: center;
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
    }
    .animation {
      animation: flicker 2s linear infinite;
    }

    @keyframes flicker {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
