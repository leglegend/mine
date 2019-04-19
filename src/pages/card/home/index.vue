<template>
  <div class="card-home">
    <div v-show="auth">
      <div class="card-top" :style="{height:titleHeight+'px'}">
        <div class="card-title" :style="{'padding-top':statusBarHeight+'px'}">
          会员卡管理
        </div>
      </div>
      <scroll-view scroll-y="true" class="card-scroll"
                   :style="{height:'calc(100vh - ' +titleHeight+'px)'}">
        <div v-if="cards.length>0" class="card-context" :style="{'min-height':'calc(85vh - ' +titleHeight+'px)'}">
          <div class="context-cards">
            <div v-for="(item,index) in cards" @click="jumpToCard(item)">
              <card :num="index" :card="item" :last="index+1==cards.length" :store="store" :uid="userId"></card>
            </div>
            <div class="add-card">
              <div @click="jumpToCard()">添加卡</div>
            </div>
          </div>

          <div class="card-info">
            <div class="info-title">
              填写信息
            </div>
            <div class="info-store" @click="jumpToStore">
            <span>
              <img :src="store.StoreLogo" v-if="store.StoreLogo"/>
              <div v-if="!store.StoreLogo">店标</div>
            </span>
              <span>
              <div>{{store.StoreName ? store.StoreName : '请填写店铺名称'}}</div>
              <div>{{store.Address ? store.Address : '请填写店铺地址'}}</div>
            </span>
              <span>
              <img class="store-right" src="/static/right1.png"/>
            </span>
            </div>
            <div class="card-option" @click="jumpToSetting">
            <span class="card-icon">
              <img src="/static/datum.png"/>
            </span>
              <span class="option-title">
              <span>会员资料设置</span>
              <span>
                <img v-if="setting.IsControls" class="check" src="/static/check.png"/>
                <img src="/static/right2.png"/>
              </span>
            </span>
            </div>
            <div class="card-option" @click="jumpToBenefit">
            <span class="card-icon">
              <img src="/static/benefit.png"/>
            </span>
              <span class="option-title">
              <span>会员权益说明</span>
              <span>
                <img v-if="setting.IsLimit" class="check" src="/static/check.png"/>
                <img src="/static/right2.png"/>
              </span>
            </span>
            </div>
            <div class="card-option" @click="jumpToAgreement">
            <span class="card-icon">
              <img src="/static/rule.png"/>
            </span>
              <span class="option-title no-line">
              <span>会员协议</span>
              <span>
                <img v-if="setting.IsAgreement" class="check" src="/static/check.png"/>
                <img src="/static/right2.png"/>
              </span>
            </span>
            </div>
          </div>
        </div>
        <div v-if="cards.length==0&&!firstLoad" :style="{'height':'calc(85vh - ' +titleHeight+'px)'}">
          <div class="nocard-context">
          <span class="no-cards">
            <div class="card-hearder">
              <span class="header-logo"></span>
              <span class="header-name">盼盼示例工作室</span>
              <img class="header-code" src="/static/code.png"/>
            </div>
            <div class="card-content">
              会员卡
            </div>
            <div class="card-footer">
              <div class="footer-number">0000 0000 0000 000</div>
              <div class="footer-date">有效期至2020年00月00日</div>
            </div>
          </span>
          </div>
          <div class="nocard-info">
            <div>可随身携带的电子会员卡</div>
            <div>1、添加会员卡 2、打印店铺码</div>
            <div>3、顾客即可通过扫面店铺进行消费、减次</div>
          </div>
          <div class="add-card">
            <div @click="jumpToCard()">添加卡</div>
          </div>
        </div>
        <div class="demo-footer">
          <img class="demo-nutcards" src="/static/nutcards.png"/>
        </div>
        <div class="demo-bottom"></div>
      </scroll-view>
    </div>
    <div class="demo-noauth" v-show="auth==false">
      <div class="card-top" :style="{height:titleHeight+'px'}">
        <div class="card-title" :style="{'padding-top':statusBarHeight+'px'}">
          会员卡管理
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
  import card from '@/components/card'

  export default {
    components: {
      card
    },

    data () {
      return {
        statusBarHeight: null,
        titleHeight: null,
        cards: [],
        setting: {},
        store: {},
        firstLoad: true,
        auth: true
      }
    },
    methods: {
      jumpToCard (item) {
        let url = '../create/main?userId=' + this.userId + '&storeId=' + this.storeId
        if (item) {
          url = url + '&type=edit&cardId=' + item.PrepaidCardId
        } else {
          url = '../choose/main?userId=' + this.userId + '&storeId=' + this.storeId + '&type=create'
        }
        wx.navigateTo({url})
      },
      jumpToSetting () {
        const url = '../setting/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToBenefit () {
        const url = '../benefit/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToAgreement () {
        const url = '../agreement/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToStore () {
        const url = '../store/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      getSettings () {
        let that = this
        this.$post('/store/businessGetStoreSeting', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          that.setting = res
        })
      },
      getCards () {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCards', {
          Uid: this.userId,
          StoreId: this.storeId
        }, this.firstLoad).then(res => {
          for (let item of res.PrepaidCards) {
            item.ValidityDateTo = that.calcValidityDateTo(item.ValidityDate)
            item.ValidityDateTime = that.calcValidityDate(item.ValidityDate)
            item.StoreLogo = res.StoreLogo
            item.StoreName = res.StoreName
          }
          that.cards = res.PrepaidCards
          that.firstLoad = false
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsNotDefaultData: true
        }, this.firstLoad).then(res => {
          res.StoreId = that.storeId
          that.store = res
        })
      },
      calcValidityDateTo (date) {
        if (date === 0) {
          return '永久有效'
        }
        var now = new Date()
        now.setDate(now.getDate() + date)
        return this.formatTime(now)
      },
      formatTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        let day = date.getDate()
        day = day < 10 ? '0' + day : day
        return year + '年' + month + '月' + day + '日'
      },
      calcValidityDate (validityDay) {
        if (validityDay === 0) {
          return '永久有效'
        }
        let year = Math.floor(validityDay / 365)
        let month = Math.floor(validityDay % 365 / 30)
        let day = validityDay % 365 % 30
        return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
      }
    },
    onLoad () {
      let globalData = this.getGlobalData()
      this.userId = globalData.user.Userid
      this.storeId = globalData.user.StoreId
      this.firstLoad = true
      this.getSettings()
      this.getStoreInfo()
      this.getCards()
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      let permissions = wx.getStorageSync('auth')
      if (permissions && permissions.length > 0) {
        for (let item of permissions) {
          if (item.PController === 'card' && item.State === 0) {
            this.auth = false
            return
          }
        }
        this.auth = true
      }
      if (this.firstLoad) {
        return
      }
      this.getStoreInfo()
      this.getCards()
      this.getSettings()
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

  .card-home {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .card-top {
      background: linear-gradient(to right, #ff8100, #ff6700);
      .card-title {
        width: 100vw;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: rpx(35);
        color: white;
      }
    }
    .nocard-context {
      text-align: center;
      padding-top: 10vh;
    }
    .nocard-info {
      padding-top: 10vh;
      padding-bottom: 3vh;
      text-align: center;
      font-size: rpx(25);
      color: #bfbfbf;
      div:nth-child(1) {
        font-size: rpx(30);
        padding: 1vh;
      }
    }
    .no-cards {
      text-align: left;
      width: rpx(282);
      height: rpx(160);
      padding: rpx(10);
      border-radius: rpx(10);
      color: #bfbfbf;
      margin: auto 0;
      background-color: #fafafa;
      display: inline-block;
      transform: scale(1.7, 1.7);
      border: rpx(2) dashed #bfbfbf;
      .card-hearder {
        height: rpx(40);
        line-height: rpx(40);
        .header-logo {
          width: rpx(40);
          height: rpx(40);
          display: inline-block;
          border-radius: 50%;
          vertical-align: middle;
          background-color: #b2b2b2;
        }
        .header-name {
          display: inline-block;
          font-size: rpx(18);
          vertical-align: middle;
          margin-left: rpx(10);
          width: rpx(200);
          white-space: nowrap;
        }
        .header-code {
          height: rpx(25);
          width: rpx(25);
          display: inline-block;
          vertical-align: middle;
        }
      }
      .card-content {
        height: rpx(80);
        line-height: rpx(80);
        text-align: center;
        font-size: rpx(50);
      }
      .card-footer {
        padding-left: rpx(5);
        padding-top: rpx(3);
        font-size: rpx(13);
        line-height: rpx(20);
        .footer-number {
          font-size: rpx(13);
        }
      }
    }

    .card-count {
      font-size: rpx(45);
      padding-left: 5vw;
      padding-top: rpx(40);
    }
    .card-scroll {
      height: 90vh;
      .card-context {
        width: 100vw;
        height: auto;
        .context-cards {
          width: 100vw;
          background-color: white;
        }
      }

    }
    .add-card {
      width: 100vw;
      text-align: center;
      padding-top: rpx(40);
      padding-bottom: rpx(90);
      div {
        width: 48vw;
        margin: 0 auto;
        border: rpx(1) solid #ff6700;
        color: #ff6700;
        font-size: rpx(30);
        border-radius: rpx(30);
        height: rpx(60);
        line-height: rpx(60);
        background: white;
      }
    }
    .card-edit {
      span {
        display: inline-block;
      }
      .card-demo {
        width: 30vw;
        height: 10vh;
      }
    }

    .card-info {
      font-size: 0.8em;
      width: 100vw;
      background-color: white;
      margin-top: rpx(20);
      padding-top: rpx(55);
      padding-left: 5vw;
      padding-right: 5vw;
      .info-title {
        font-size: rpx(43);
        font-weight: 600;
        width: 90vw;
      }
      .info-store {
        width: 90vw;
        margin-top: rpx(40);
        height: rpx(130);
        border-bottom: rpx(1) solid #dddddd;
        line-height: rpx(130);
        span {
          display: inline-block;
          vertical-align: middle;
          &:nth-child(1) {
            height: rpx(130);
            line-height: rpx(130);
            width: 15vw;
            img {
              display: inline-block;
              vertical-align: middle;
              width: 13vw;
              height: 13vw;
              border-radius: 50%;
              position: relative;
              top: rpx(-10);
            }
            div {
              display: inline-block;
              width: 13vw;
              height: 13vw;
              border-radius: 50%;
              background: #f0f0f0;
              line-height: 13vw;
              text-align: center;
              color: #a7a7a7;
              font-size: rpx(30);
            }
          }
          &:nth-child(2) {
            height: rpx(105);
            width: 68vw;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            div {
              &:nth-child(1) {
                line-height: rpx(65);
                font-size: rpx(35);
                font-weight: 600;
              }
              &:nth-child(2) {
                line-height: rpx(25);
                font-size: rpx(25);
                color: #c1c1c1;
              }
            }
          }
          &:nth-child(3) {
            height: rpx(130);
            line-height: rpx(130);
            width: 5vw;
            text-align: right;
            padding-right: 2vw;
          }
          .store-right {
            display: inline-block;
            height: rpx(34);
            width: rpx(13);
            vertical-align: middle;
          }
        }
      }
      .card-option {
        height: rpx(100);
        line-height: rpx(100);
        width: 90vw;
        font-size: rpx(27);
        span {
          display: inline-block;
          vertical-align: middle;
          height: rpx(100);
          line-height: rpx(100);
        }
        .card-icon {
          width: 8vw;
          height: rpx(100);
          line-height: rpx(100);
          img {
            display: inline-block;
            height: rpx(50);
            width: rpx(50);
            vertical-align: middle;
          }
        }
        .option-title {
          width: 82vw;
          border-bottom: rpx(1) solid #dddddd;
          span {
            img {
              display: inline-block;
              height: rpx(21);
              width: rpx(13);
              vertical-align: middle;
              margin-left: 2vw;
            }
            .check {
              width: rpx(32);
              height: rpx(24);
            }
            &:nth-child(1) {
              width: 70vw;
            }
            &:nth-child(2) {
              width: 10vw;
              padding-right: 2vw;
              text-align: right;
            }
          }
        }
        .no-line {
          border-bottom: 0;
        }
      }
    }
  }
</style>
