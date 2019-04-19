<template>
  <div class="home">
    <div class="refresh" :animation="animationLoading" v-if="platform=='ios'">
      <img class="loading1" src="/static/loading1.png"/>
      <img class="loading2" :animation="animationLoading2" src="/static/loading2.png" v-if="showLoading"/>
      <img class="loading3" src="/static/loading2.png" v-if="isRefreshing"/>
    </div>
    <div v-show="auth==true">
      <div class="home-background">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/background.jpg" :animation="animation"/>
      </div>
      <div class="home-context">
        <div class="home-loading">

        </div>
        <div style="height: 13.8vh;"></div>
        <div class="main-context">
          <div class="update" :animation="animationUpdate">
            <span>已更新 {{time}}</span>
          </div>
          <div class="context-top">
            <div class="income">
              <div class="context">{{report.SumMony}}</div>
              <div class="title">今日营业额（元）</div>
            </div>
            <div class="line line-bottom">
              <span class="info">
                <div class="value">{{report.SumVipMony}}</div>
                <div class="name">会员消费</div>
              </span>
              <span class="line-middle"></span>
              <span class="info">
                <div class="value">{{report.SumVipPeople}}</div>
                <div class="name">会员人次</div>
              </span>
              <span class="line-middle"></span>
              <span class="info">
                <div class="value">{{report.SumOpenCard}}/{{report.SumRenewal}}</div>
                <div class="name">新开卡/续费人次</div>
              </span>
            </div>

            <div class="line">
              <span class="info">
                <div class="value">{{report.SumNonVipMony}}</div>
                <div class="name">散客消费</div>
              </span>
              <span class="line-middle"></span>
              <span class="info">
                <div class="value">{{report.SumNonVipPeople}}</div>
                <div class="name">散客人次</div>
              </span>
              <span class="line-middle"></span>
              <span class="info">
                <div class="value">{{report.SumOldNonVipPeople}}</div>
                <div class="name">老散客</div>
              </span>
            </div>

            <div class="context-bottom"></div>
          </div>
          <div style="background-color: white" v-show="items.length>0">
            <div class="items-title">
              今天流水
            </div>
            <div class="items">
              <a v-for="(item,index) in items" v-on:click="jumpToDetails(item)">
                <item :key="index" :item="item" :last="index==items.length-1"></item>
              </a>
              <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
              <div class="footer" v-show="isLoading">加载中...</div>
            </div>
          </div>
          <div class="demo-noitems" v-show="items.length==0&&!isLoading">
            还没有数据哦 =_="
          </div>
        </div>
        <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
          <img class="demo-nutcards" src="/static/nutcards.png"/>
        </div>
      </div>
    </div>
    <div class="demo-noauth" v-show="auth==false">
      <div class="demo-noauthcontext" style="height: 90vh">
        {{auth == false ? '没有权限 =_="' : ''}}
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
    </div>
    <div class="demo-noauth" v-show="auth==null">
      <div class="demo-noauthcontext" style="height: 90vh">
        加载中...
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
    </div>
    <div class="home-help" @click="jumpToHelp">
      <span>帮助</span>
    </div>
  </div>
</template>

<script>
  import item from '@/components/item'

  export default {
    data () {
      return {
        items: [],
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        page: 1, // 消费明细当前页
        report: {},
        scrollTop: 0,
        animation: {},
        animationLoading: {},
        animationLoading2: {},
        animationUpdate: {},
        firstLoad: true,
        auth: null,
        isRefreshing: false,
        screenWidth: 0,
        time: '',
        statusBarHeight: 0,
        showLoading: false,
        platform: ''
      }
    },

    components: {
      item
    },

    methods: {
      jumpToHelp () {
        const url = '../mine/help/main'
        wx.navigateTo({url})
      },
      jumpToDetails (item) {
        const url = '../details/main?userId=' + this.userId + '&storeId=' + this.storeId + '&consumptionId=' + item.ConsumptionId
        wx.navigateTo({url})
      },
      scroll (e) {
        console.log(e.mp.detail.deltaY)
      },
      touchend (e) {
      },
      setTouchMove (e) {
        console.log(e)
        this.left = e.clientX + 'px'
        this.top = e.clientY + 'px'
      },
      getConsumptions (page, callback) {
        let myDate = new Date()
        this.month = myDate.getMonth() + 1
        let that = this
        that.isLoading = true
        this.$post('/consumption/businessGetConsumptionList', {
          StartDate: myDate.getFullYear() + '-' + this.month + '-' + myDate.getDate() + ' 00:00',
          EndDate: myDate.getFullYear() + '-' + this.month + '-' + myDate.getDate() + ' 23:59',
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
        }, this.isFirstLoad).then(res => {
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
          that.firstLoad = false
          if (callback) {
            callback()
          }
        })
      },
      getStatistical () {
        let myDate = new Date()
        this.month = myDate.getMonth() + 1
        let that = this
        this.$post('/operatingReports/businessGetStoreStatistical', {
          StartDate: myDate.getFullYear() + '-' + this.month + '-' + myDate.getDate() + ' 00:00',
          EndDate: myDate.getFullYear() + '-' + this.month + '-' + myDate.getDate() + ' 23:59',
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          that.report = res
        })
      },
      getPermissions (callback) {
        let that = this
        this.$post('/user/businessGetAdminPermissions', {
          Uid: that.userId,
          StoreId: that.storeId,
          Userid: that.userId
        }).then(res => {
          if (callback) {
            callback(res.AdminPermissions)
          }
        })
      }
    },
    onLoad () {
      let that = this
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.isLoading = true
      // const url = '../mine/coupon/home/main?userId=' + this.userId + '&storeId=' + this.storeId
      // wx.navigateTo({url})
      if (globalData.user.type !== 0) {
        this.getPermissions(function (permissions) {
          if (permissions && permissions.length > 0) {
            for (let item of permissions) {
              if (item.PController === 'today' && item.State === 0) {
                that.auth = false
                return
              }
            }
          }
          that.auth = true
          that.getConsumptions(1)
          that.getStatistical()
        })
      } else {
        that.auth = true
        that.getConsumptions(1)
        that.getStatistical()
      }
      wx.setBackgroundColor({
        backgroundColorTop: '#021656',
        backgroundColorBottom: '#f0f0f0'
      })
      this.screenWidth = this.getGlobalData().screenWidth
      this.statusBarHeight = this.getGlobalData().statusBarHeight + 6
      this.platform = this.getGlobalData().platform
      console.log(this.platform)
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      let permissions = wx.getStorageSync('auth')
      if (permissions && permissions.length > 0) {
        for (let item of permissions) {
          if (item.PController === 'today' && item.State === 0) {
            this.auth = false
            return
          }
        }
        this.auth = true
      }
      this.isOver = false
      this.page = 1
      this.getConsumptions(1)
      this.getStatistical()
    },
    onPullDownRefresh () {
      let that = this
      wx.stopPullDownRefresh()
      let animationLoading = wx.createAnimation()
      animationLoading.top(this.statusBarHeight + 'px').opacity(1).step({duration: 60})
      this.animationLoading = animationLoading.export()
      this.isRefreshing = true
      this.showLoading = false
      this.isOver = false
      this.page = 1
      this.getStatistical()
      this.getConsumptions(1, function () {
        let date = new Date()
        that.time = date.getHours() + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes())
        setTimeout(function () {
          let animationUpdate = wx.createAnimation()
          animationUpdate.opacity('0').step({duration: 500})
          that.animationUpdate = animationUpdate.export()
        }, 3500)
        setTimeout(function () {
          that.isRefreshing = false
          let animationLoading = wx.createAnimation()
          animationLoading.top('-5.93vw').step({duration: 100})
          that.animationLoading = animationLoading.export()
          let animationUpdate = wx.createAnimation()
          animationUpdate.opacity('1').step({duration: 300})
          that.animationUpdate = animationUpdate.export()
        }, 800)
      })
    },
    onPageScroll (e) {
      if (e.scrollTop <= 0) {
        let scrollTop = -e.scrollTop * 1.5
        let animation = wx.createAnimation()
        animation.width(750 + scrollTop + 'rpx').height(506 + scrollTop / 750 * 506 + 'rpx').step({duration: 60})
        this.animation = animation.export()

        if (this.isRefreshing) {
          return
        }
        scrollTop = -e.scrollTop
        if (scrollTop > this.statusBarHeight) {
          this.showLoading = true
          let animationLoading = wx.createAnimation()
          animationLoading.top(this.statusBarHeight + 'px').opacity(1).step({duration: 60})
          this.animationLoading = animationLoading.export()

          let animationLoading2 = wx.createAnimation()
          animationLoading2.rotate(-scrollTop / this.screenWidth * 500 - 50).step({duration: 100})
          this.animationLoading2 = animationLoading2.export()
          return
        }
        this.showLoading = false
        let animationLoading = wx.createAnimation()
        animationLoading.top(scrollTop + 'px').opacity(scrollTop / this.statusBarHeight).step({duration: 60})
        this.animationLoading = animationLoading.export()
      }
    },
    onReachBottom () {
      if (this.isLoading || this.isOver) {
        return
      }
      this.page += 1
      this.getConsumptions(this.page)
    },
    onShareAppMessage () {
      return {
        title: '坚果卡包商家版',
        path: '/pages/index/main'
      }
    }
  }
</script>

<style scoped lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .home {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    position: relative;
    .refresh {
      position: fixed;
      color: white;
      top: -5.93vw;
      left: 5vw;
      z-index: 1001;
      width: 5.93vw;
      height: 5.93vw;
      .loading1 {
        width: 3.05vw;
        height: 4.17vw;
        display: inline-block;
        position: absolute;
        left: 1.44vw;
        top: 0.88vw;
      }
      .loading2 {
        width: 5.93vw;
        height: 5.93vw;
        display: inline-block;
        vertical-align: top;
      }
      .loading3 {
        width: 5.93vw;
        height: 5.93vw;
        display: inline-block;
        vertical-align: top;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
    .home-background {
      position: fixed;
      top: 0;
      left: 50%;
      overflow: visible;
      img {
        width: 100vw;
        height: rpx(506);
        position: relative;
        display: block;
        left: -50%;
        z-index: 2;
      }
      z-index: 1;
    }
    .home-context {
      width: 100vw;
      height: 100vh;
      z-index: 4;
      position: relative;
      overflow: visible;
      .home-loading {
        position: absolute;
        top: rpx(-20);
        height: rpx(40);
        width: rpx(20);
        //background-color: red;
        z-index: 1000;
      }
      .main-context {
        min-height: 76.2vh;
        width: 100vw;
        background-color: #f0f0f0;
        border-radius: rpx(15) rpx(15) 0 0;
        z-index: 4;
        position: relative;
        .update {
          position: absolute;
          text-align: center;
          width: 63vw;
          padding-left: 37vw;
          padding-top: 3vw;
          opacity: 0;
          span {
            width: 26vw;
            height: 5vw;
            // line-height: 5vw;
            background-color: #a7a7a7;
            color: white;
            // display: inline-block;
            font-size: rpx(25);
            border-radius: rpx(25);
            text-align: center;
            display: table-cell;
            vertical-align: middle
          }
        }
        .context-top {
          background-color: white;
          border-radius: rpx(15) rpx(15) 0 0;
        }
      }
      .income {
        width: 100vw;
        text-align: center;
        .context {
          padding-top: 8vw;
          height: 8vh;
          font-size: rpx(90);
          font-weight: bold;
          color: #ff6700;
        }
        .title {
          height: 4.5vh;
          padding-top: 0.8vh;
          font-size: rpx(27);
          color: #a7a7a7;
        }
      }
      .line {
        width: 90vw;
        margin: 0 auto;
        background-color: white;
        height: 8.5vh;
        z-index: 4;
        overflow: hidden;
        white-space: nowrap;
        .info {
          display: inline-block;
          width: calc(30vw - 2rpx);
          text-align: center;
          .value {
            padding-top: 1vh;
            height: 3.5vh;
            font-weight: bold;
            color: #ff6700;
            font-size: rpx(35);
          }
          .name {
            height: 4vh;
            font-size: rpx(23);
            color: #a7a7a7;
          }
        }
        .line-middle {
          width: rpx(1);
          display: inline-block;
          background-color: #a7a7a7;
          height: 4.5vh;
          margin-top: 2vh;
          margin-left: rpx(1);
          margin-right: rpx(1);
        }
      }
      .line-bottom {
        border-bottom: rpx(1) solid #bbbbbb;
      }
      .context-bottom {
        width: 100vw;
        height: 2vh;
        background-color: #f1f1f1;
      }
      .items-title {
        font-size: rpx(45);
        padding-left: 5vw;
        padding-top: 4vh;
        font-weight: 600;
        padding-bottom: 2vh;
        z-index: 4;
      }

      .open {
        display: inline-block;
        width: 50vw;
        text-align: center;
      }
      .footer {
        width: 100vw;
        font-size: 0.8em;
        height: 6vh;
        line-height: 6vh;
        margin: 0 auto;
        text-align: center;
      }
    }
    .home-help {
      position: fixed;
      right: 2vw;
      bottom: 5vw;
      width: 15vw;
      height: 14vw;
      padding-top: 1vw;
      border-radius: 50%;
      background-color: rgba(255, 103, 0, 0.39);
      text-align: center;
      z-index: 1001;
      color: white;
      font-size: 4.5vw;
      span {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        width: 13vw;
        height: 13vw;
        line-height: 13vw;
        border-radius: 50%;
        background-color: rgba(255, 103, 0, 1);
      }
    }
  }
</style>
