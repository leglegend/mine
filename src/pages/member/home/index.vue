<template>
  <div class="member">
    <div v-show="auth">
      <div class="current-letter" v-if="showLetter&&currentLetter">
        {{currentLetter == 'TNT' ? '#' : currentLetter}}
      </div>
      <div class="member-list" v-if="!isFirstLoad"
           :style="{height:'calc(100vh - 17.8vw - ' +(statusBarHeight+34)+'px)',top:'calc(17.8vw + ' +(statusBarHeight+34)+'px)'}">
        <div style="position: absolute;top: 50%;height: 100%;right: 0;">
          <div id="memberList" style="position: relative;"
               :style="{height:(items.length+1)*34+'rpx',top:-(items.length+1)*17+'rpx'}">
            <div class="list-item" id="AZ">
            </div>
            <div class="list-item" v-for="item in items" :id="item.NameGroup"
                 @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
              <div class="item-left" v-if="item.NameGroup==currentLetter"></div>
              <div class="item-right" :class="item.NameGroup==currentLetter?'selected':''">
                <span>{{item.NameGroup == 'TNT' ? '#' : item.NameGroup}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="member-top"
           :class="showAdjust?'member-filter':''"
           :style="{height:'calc(17.8vw + ' +(statusBarHeight+34)+'px)'}">
        <div class="member-title" :style="{'padding-top':statusBarHeight +'px'}">
          会员管理
        </div>
        <div class="member-search">
          <div>
            <span @click="doScan">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/scan.png"/>
            </span>
            <span @click="jumpToKeyword">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/search.png"/>
              会员名\卡号\手机号
            </span>
            <span @click="jumpToSearch">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/screen.png"/>
            </span>
          </div>
        </div>
      </div>
      <scroll-view class="member-scroll" :class="showAdjust?'member-filter':''" :scroll-y="scrollY"
                   enable-back-to-top="true"
                   :scroll-into-view="scrollView"
                   @scroll="memberScroll"
                   :style="{height:'calc(100vh - 17.8vw - ' +(statusBarHeight+34)+'px)'}">
        <div :style="{'min-height':'calc(90vh - 17.8vw - ' +(statusBarHeight+34)+'px)',background: '#f0f0f0'}">
          <div id="memberTop">
            <div class="member-add">
              <span @click="jumpToCreate">+ 添加新会员</span>
            </div>
            <div class="member-statis">
              <div class="statis-data">
              <span @click="changeType(0)" :class="type==0?'selected':''">
                <div>{{info.SumVipPeople}}</div>
                <div>全部会员(名)</div>
              </span>
                <span @click="changeType(1)" :class="type==1?'selected':''">
                <div>{{info.SumVipNon}}</div>
                <div>卡过期但有余额(张)</div>
              </span>
                <span @click="changeType(2)" :class="type==2?'selected':''">
                <div>{{info.SumVip}}</div>
                <div>卡有效且有余额(张)</div>
              </span>
                <span @click="changeType(3)" :class="type==3?'selected':''">
                <div>{{info.SumNotRenewal}}</div>
                <div>消费完未续费(张)</div>
              </span>
              </div>
              <div class="statis-select">
                <span class="select-item"><span v-if="type==0"></span></span>
                <span class="select-item"><span v-if="type==1"></span></span>
                <span class="select-item"><span v-if="type==2"></span></span>
                <span class="select-item"><span v-if="type==3"></span></span>
              </div>
            </div>
          </div>
          <div class="member-item" style="height: 0;">
            <div class="member-letter" id="scroll0" style="position: absolute;z-index: 0;"></div>
          </div>
          <div class="member-item" v-for="group in items">
            <div class="member-letter" :id="'scroll'+group.NameGroup">
              {{group.NameGroup == 'TNT' ? '#' : group.NameGroup}}
            </div>
            <div v-for="(item,index1) in group.Users" v-on:click="jumpToDetails(item)">
              <div class="members">
                <span class="member-logo">
                  <img :src="item.UserImg">
                </span>
                <span class="member-info">
                  <span class="info-left">
                    <div>{{item.RemarkName ? item.RemarkName : item.UserStoreName ? item.UserStoreName : item.UserName}}</div>
                    <div>
                      <span v-if="item.LastDate">{{item.LastDate}}</span>
                      <span v-if="item.TotalMoney">{{item.TotalMoney}}</span>
                      <span v-if="item.TotalTimes">{{item.TotalTimes}}</span>
                    </div>
                  </span>
                  <span class="info-right" @click.stop="openAdjust(item)">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/member-adjust.png"/>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="demo-noitems" v-show="items.length==0&&!isLoading">
            还没有数据哦 =_="
          </div>
        </div>
        <div id="scrollBottom" class="demo-footer" style="padding-top: 0">
          <img class="demo-nutcards"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
        </div>
        <div class="demo-bottom"></div>
      </scroll-view>
      <div v-if="showAdjust">
        <adjust @close="closeAdjust"></adjust>
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
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
    </div>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
    </div>
  </div>
</template>

<script>
  import adjust from '@/components/adjust'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      adjust, renewtoast
    },

    data () {
      return {
        titleHeight: null,
        statusBarHeight: null,
        currentLetter: '',
        auth: true,
        items: [],
        value: null,
        info: {},
        type: 0,
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        scrollY: true,
        showLetter: false,
        showAdjust: false,
        scrollView: '',
        isMoving: false,
        isFirstLoad: true,
        showToast: false,
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
      openAdjust (item) {
        let memberList = wx.getStorageSync('memberList')
        let member = {}
        for (let group of memberList) {
          for (let user of group.Users) {
            if (user.CardId === item.CardId) {
              member = user
            }
          }
        }
        for (let card of member.Cards) {
          card.StoreName = this.store.StoreName
          card.StoreLogo = this.store.StoreLogo
        }
        wx.setStorageSync('member', {
          storeId: this.storeId,
          userId: this.userId,
          member: member
        })
        this.showAdjust = true
        this.scrollY = false
        wx.hideTabBar({
          animation: true
        })
      },
      closeAdjust () {
        this.showAdjust = false
        this.scrollY = true
        wx.removeStorageSync('member')
        wx.showTabBar({
          animation: true
        })
        this.getMembers(1)
        this.getStatistical()
      },
      memberScroll (e) {
        if (this.letterHeight && this.topHeight && !this.isMoving && this.userNumber) {
          this.scrollView = ''
          let scrollTop = e.target.scrollTop
          let itemHeight = (e.target.scrollHeight - this.topHeight - this.bottomHeight - this.letterHeight * this.items.length) / this.userNumber
          if (scrollTop < this.topHeight) {
            this.currentLetter = ''
          } else {
            let allTopHeight = this.topHeight
            for (let i = 0; i < this.items.length; i++) {
              if (scrollTop >= allTopHeight && scrollTop <= (allTopHeight + this.letterHeight + itemHeight * this.items[i].Users.length)) {
                this.currentLetter = this.items[i].NameGroup
                break
              }
              allTopHeight += this.letterHeight + itemHeight * this.items[i].Users.length
            }
          }
        }
      },
      touchStart (e) {
        if (this.currentLetter !== e.currentTarget.id) {
          wx.vibrateShort()
          this.scrollView = 'scroll' + e.currentTarget.id
        }
        console.log(e)
        this.currentLetter = e.currentTarget.id
        this.scrollY = false
        this.showLetter = true
        this.isMoving = true
      },
      touchMove (e) {
        this.scrollY = true
        this.showLetter = true
        this.isMoving = true
        let that = this
        let height = that.rightHeight
        let currentHeight = e.clientY - height - that.letterTop
        let currentIndex = 0
        if (currentHeight <= 0) {
          currentIndex = 1
        } else {
          currentIndex = Math.ceil(currentHeight / height)
        }
        if (currentIndex > that.items.length) {
          currentIndex = that.items.length - 1
        } else {
          currentIndex = currentIndex - 1
        }
        if (that.currentLetter !== that.items[currentIndex].NameGroup) {
          wx.vibrateShort()
          that.scrollView = 'scroll' + that.items[currentIndex].NameGroup
        }
        that.currentLetter = that.items[currentIndex].NameGroup
      },
      touchEnd () {
        this.scrollY = true
        setTimeout(function () {
          this.showLetter = false
          this.isMoving = false
        }.bind(this), 500)
      },
      doScan () {
        let that = this
        wx.scanCode({
          success: function (res) {
            let url = res.result
            console.log('lalalalalalalalalalalaaaaaa')
            console.log(res)
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
      getMembers () {
        let that = this
        this.isLoading = true
        this.$post('/card/businessGetUsers', {
          Uid: that.userId,
          StoreId: that.storeId,
          CardState: this.type
        }, true).then(res => {
          let number = 0
          let items = []
          for (let item of res.Datas) {
            let users = []
            for (let user of item.Users) {
              users.push({
                UserId: user.UserId,
                UserImg: user.UserImg,
                CardId: user.CardId,
                RemarkName: user.RemarkName ? user.RemarkName : user.UserStoreName ? user.UserStoreName : user.UserName,
                TotalMoney: user.TotalMoney,
                TotalTimes: user.TotalTimes,
                LastDate: user.LastDate
              })
            }
            if (item.NameGroup === '#') {
              item.NameGroup = 'TNT'
            }
            items.push({
              NameGroup: item.NameGroup,
              Users: users
            })
            number += item.Users.length
          }
          that.items = items
          that.userNumber = number
          that.isLoading = false
          that.isFirstLoad = false
          wx.setStorageSync('memberList', res.Datas)
          setTimeout(function () {
            const query = wx.createSelectorQuery()
            query.select('#memberTop').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.select('#scroll0').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.select('#AZ').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.select('#scrollBottom').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.select('#memberList').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function (res) {
              console.log(res)
              that.topHeight = res[0].height
              that.letterHeight = res[2].height
              that.rightHeight = res[4].height
              that.bottomHeight = res[6].height
              that.letterTop = res[8].top
            })
          }, 200)
        })
      },
      changeType (type) {
        if (this.type === type) {
          return
        }
        this.type = type
        this.isOver = false
        this.page = 1
        this.getMembers(1)
      },
      getStatistical () {
        let that = this
        this.$post('/store/businessGetStoreUserStatistical', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          that.info = res
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreManagementData', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          that.store = res
        })
      },
      getServiceTags () {
        let that = this
        this.$post('/storeCard/businessGetStoreServiceItems', {
          Uid: that.userId,
          StoreId: that.storeId
        }).then(res => {
          wx.setStorageSync('serviceTags', res.Services)
        })
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.isFirstLoad = true
      this.isOver = false
      this.scrollY = true
      this.showLetter = false
      this.showAdjust = false
      this.scrollView = ''
      this.isMoving = false
      this.showToast = false
      this.type = 0
      this.page = 1
      this.getMembers(1)
      this.getStatistical()
      this.getStoreInfo()
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
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      if (this.isFirstLoad || this.showAdjust) {
        return
      }
      this.isOver = false
      this.page = 1
      this.getMembers(1)
      this.getStatistical()
      this.getServiceTags()
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
    .member-filter {
      filter: blur(6px);
    }
    .member-top {
      background: linear-gradient(to right, #ff8100, #ff6700);
      position: relative;
      z-index: 101;
      .member-title {
        width: 100vw;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 4.6vw;
        color: white;
      }
      .member-search {
        width: 100vw;
        height: 9.6vw;
        line-height: 9.6vw;
        padding-top: 3.3vw;
        padding-bottom: 4.9vw;
        div {
          width: 90vw;
          padding: 0 5vw;
          height: 9.6vw;
          line-height: 9.6vw;
          img {
            display: inline-block;
            vertical-align: top;
            width: 5.7vw;
            height: 5.7vw;
          }
          span {
            display: inline-block;
            height: rpx(52);
            vertical-align: top;
            &:nth-child(1) {
              box-sizing: border-box;
              padding-top: 1.9vw;
              width: 8.9vw;
            }
            &:nth-child(2) {
              box-sizing: border-box;
              width: 72.2vw;
              height: 9.6vw;
              line-height: 9.6vw;
              padding-left: 2.5vw;
              border-radius: 4.8vw;
              font-size: 3.1vw;
              color: white;
              background-color: rgb(225, 92, 0);
              img {
                margin-top: 3.2vw;
                margin-right: 2.1vw;
                width: 3.1vw;
                height: 3.1vw;
              }
            }
            &:nth-child(3) {
              box-sizing: border-box;
              padding-top: 1.9vw;
              padding-left: 3.2vw;
            }
          }
        }
      }
    }
    .member-scroll {
      width: 100vw;
      background-color: #f0f0f0;
      .member-add {
        text-align: center;
        background: white;
        padding: 8.7vw 0 9.2vw 0;
        span {
          display: inline-block;
          width: 47.7vw;
          height: 10.6vw;
          line-height: 10.6vw;
          background: #78bc6d;
          color: white;
          font-size: 4.4vw;
          border-radius: 5vw;
        }
      }
      .member-statis {
        height: 15.8vw;
        box-sizing: border-box;
        padding: 3.9vw 0 4.2vw 0;
        background: rgba(252, 252, 252, 1);
        border: 0.1vw solid rgba(238, 238, 238, 1);
        position: relative;
        .statis-data {
          span {
            display: inline-block;
            width: 25%;
            box-sizing: border-box;
            display: inline-block;
            height: 7.8vw;
            line-height: 7.8vw;
            border-right: 0.1vw solid #BEBEBE;
            text-align: center;
            &:nth-child(4) {
              border: 0;
            }
            div:nth-child(1) {
              color: black;
              font-size: 4.4vw;
              height: 3.4vw;
              line-height: 3.4vw;
              padding-bottom: 2.4vw;
              font-weight: 600;
            }
            div:nth-child(2) {
              color: #969696;
              font-size: 2.2vw;
              height: 2.1vw;
              line-height: 2.1vw;
            }
          }
          .selected {
            div:nth-child(1) {
              color: #78BC6D;
            }
            div:nth-child(2) {
              color: #78BC6D;
            }
          }
        }
        .statis-select {
          height: 0.7vw;
          width: 100vw;
          position: absolute;
          bottom: 0;
          left: 0;
          span {
            display: inline-block;
            vertical-align: top;
            height: 0.7vw;
          }
          .select-item {
            width: 25vw;
            text-align: center;
            span {
              height: 0.7vw;
              width: 18.8vw;
              background: #87C37E;
            }
          }
        }
      }
      .member-item {
        background: white;
        position: relative;
        z-index: 1;
        .member-letter {
          padding: 6.5vw 0 1vw 3.9vw;
          height: 3.2vw;
          line-height: 3.2vw;
          color: black;
          font-size: 4.4vw;
          font-weight: 600;
        }
        .members {
          padding: 4.4vw 12.7vw 0 7.6vw;
          height: 14.1vw;
          span {
            display: inline-block;
            vertical-align: top;
          }
          .member-logo {
            height: 11.1vw;
            width: 11.1vw;
            padding-right: 3.5vw;
            img {
              width: 11.1vw;
              height: 11.1vw;
              vertical-align: top;
              display: inline-block;
              border-radius: 50%;
            }
          }
          .member-info {
            width: 65.1vw;
            height: 14.1vw;
            border-bottom: 0.1vw solid #E9E9E9;
            box-sizing: border-box;
            .info-left {
              padding-top: 1.9vw;
              width: 55vw;
              div:nth-child(1) {
                color: #545454;
                font-size: 3.3vw;
                height: 3.1vw;
                line-height: 3.1vw;
                padding-bottom: 1.7vw;
              }
              div:nth-child(2) {
                color: #929292;
                font-size: 2.6vw;
                height: 2.4vw;
                line-height: 2.4vw;
              }
              span {
                display: inline-block;
                padding-right: 3vw;
              }
            }
            .info-right {
              padding-left: 2vw;
              width: 8.1vw;
              height: 14.1vw;
              position: relative;
              top: 0.5vw;
              img {
                display: inline-block;
                vertical-align: top;
                width: 8.1vw;
                height: 8.1vw;
              }
            }
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
    .member-list {
      position: fixed;
      height: 100vh;
      line-height: 100vh;
      right: 0;
      top: 50%;
      z-index: 100;
      .list-item {
        text-align: right;
        height: rpx(34);
        line-height: rpx(34);
        width: rpx(60);
        .item-left {
          display: inline-block;
          vertical-align: top;
          width: 0;
          height: 0;
          border-width: rpx(13) 0 rpx(14) rpx(10);
          border-style: solid;
          border-color: #87c37e #87c37e #87c37e transparent;
        }
        .item-right {
          display: inline-block;
          vertical-align: top;
          width: rpx(49);
          box-sizing: border-box;
          padding-left: rpx(10);
          text-align: left;
          height: rpx(26);
          line-height: rpx(26);
          color: #929292;
          margin-bottom: rpx(8);
        }
        span {
          display: inline-block;
          height: rpx(26);
          line-height: rpx(26);
          width: rpx(13);
          font-size: rpx(17);
          text-align: center;
          vertical-align: top;
        }
        .selected {
          color: #ffffff;
          background: #87c37e;
        }
      }
    }
    .current-letter {
      position: fixed;
      width: 14vw;
      height: 14vw;
      line-height: 14vw;
      left: 43vw;
      top: 48vh;
      text-align: center;
      font-size: 6.5vw;
      background: #87c37e;
      color: white;
      z-index: 1000;
      border-radius: 3vw;
    }
  }
</style>
