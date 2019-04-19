<template>
  <div class="persion">
    <title :name="'会员资料'"></title>
    <scroll-view class="persion-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)',background: '#f0f0f0'}">
        <div style="background: white">
          <div class="member-info">
            <div class="info-context">
              <img class="logo" :src="user.UserImg"/>
              <div class="edit" @click="jumpToEdit">
                <img src="/static/edit.png"/>
              </div>
              <div class="name">{{storeUserName}}</div>
              <div class="infomation" v-if="user.UserMobile">
                <span>手机号：</span>
                <span>{{user.UserMobile}}</span>
              </div>
              <div class="infomation" v-for="item in infos">
                <span>{{item.ControlInstructions}}：</span>
                <span>{{item.ControlName == 'user_sex' ? (item.ControlValue == '1' ? '男' : item.ControlValue == '2' ? '女' : '未知') : item.ControlValue}}</span>
              </div>
            </div>
            <span class="background-logo" :style="{background:'url('+user.UserImg+')','background-size':'100%,auto'}"/>
            <span class="background-home"></span>
          </div>
          <div class="line">
            <span class="info-data">
              <div class="value">{{user.SumRenewal}}</div>
              <div class="name">累计充值(元)</div>
            </span>
            <span class="info-data">
              <div class="value">{{user.TotalNum}}</div>
              <div class="name">累计消费(次)</div>
            </span>
            <span class="info-data" @click="jumpToCoupons">
              <div class="value">{{couponCount === '' ? '-' : couponCount ? couponCount : 0}}</div>
              <div class="name">优惠券(张)</div>
            </span>
          </div>
          <div style="background: #f0f0f0;height: 3.5vw"></div>
          <div style="padding-top: 3vh" v-if="cards.length>0">
            <div style="min-height: 50vw;position: relative;" :style="{height:50+5*cards.length+'vw'}">
              <div v-for="(item,index) in cards" @click="refreshCards(item)">
                <card :item="item" :index="index" :count="cards.length" :store="store"></card>
              </div>
              <!--<div class="persion-card" v-for="(item,index) in cards"
                   @click="refreshCards(item)"
                   v-bind:style="{'background':'url('+item.CardImg+')','background-size':'100% 100%',top:5*(cards.length-index)+'vw','z-index':cards.length-index}">
                <div class="card-hearder">
                <span class="header-logo"
                      v-bind:style="{'background':'url('+store.StoreLogo+')','background-size':'100% 100%'}"></span>
                  <span class="header-name" style="width: 56vw">{{store.StoreName}}</span>
                  <img class="header-code" src="/static/code.png"/>
                </div>
                <div class="card-content">
                  {{computedCardName(item.CardName)}}
                </div>
                <div class="card-footer">
                  <div class="footer-number">{{item.CardNumber}}</div>
                  <div class="footer-date">有效期至{{item.ValidityDate}}</div>
                </div>
                <div class="card-background" v-if="index!=0">
                </div>
              </div>-->
            </div>
            <div class="card-balance">
              <span>
                <div>{{currentCard.CardPrice}}{{currentCard.CardType ? '元' : '次'}}</div>
                <div>余额</div>
              </span>
              <span @click="jumpToAdjust">
                <div>核减消费 | 调整余额</div>
              </span>
            </div>
          </div>
          <div class="line-bottom"></div>
          <div class="operation" v-if="user.StoreUserOperations&&user.StoreUserOperations.length>0">
            <div v-for="(item,index) in user.StoreUserOperations">
              <span>{{item.StoreUserName}}</span>
              <span>{{item.ConsumptionTag}}</span>
              <span>{{item.ConsumptionValue}}{{item.ConsumptionType ? '元' : '次'}}</span>
              <span @click="jumpToDetails(item)">查看</span>
            </div>
          </div>
        </div>
        <div class="items" v-if="items.length>0">
          <div class="items-foot">TA的足跡</div>
          <div v-for="(item,index) in items" @click="jumpToDetails(item)">
            <item :item="item" :index="index" :last="index==items.length-1"></item>
          </div>
          <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" v-show="isLoading">加载中...</div>
        </div>
        <div class="demo-noitems" v-show="items.length==0&&!isLoading">
          客户还没有使用过 =_="
        </div>
      </div>
      <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>

    <div v-if="deleting">
      <confirm :title="'确定删除该会员吗？'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
    </div>

    <div class="persion-buttons" style="display: none">
      <span @click="deleting = true">删除会员</span>
      <span @click="jumpToEdit">编辑资料</span>
      <span @click="jumpToAdjust">调整余额</span>
    </div>
  </div>
</template>

<script>
  import card from '@/components/persion-card'
  import item from '@/components/list'
  import title from '@/components/title'
  import confirm from '@/components/confirm'

  export default {
    components: {
      card, item, title, confirm
    },
    data () {
      return {
        titleHeight: null,
        storeUserName: '',
        deleting: false,
        user: {},
        infos: [],
        store: {},
        cards: [],
        currentCard: {},
        firstLoad: true,
        items: [],
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        couponCount: '',
        page: 1 // 消费明细当前页
      }
    },
    computed: {
      computedCardName () {
        return function () {
          return 'asfasdf'
        }
      }
    },
    methods: {
      jumpToEdit () {
        const url = '../edit/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId + '&cardId=' + this.info.cardId
        wx.navigateTo({url})
      },
      jumpToDetails (item) {
        const url = '../../details/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&consumptionId=' + item.ConsumptionId + '&type=member'
        wx.navigateTo({url})
      },
      jumpToAdjust () {
        const url = '../adjust/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId + '&cardId=' + this.user.CardId + '&childCardId=' + this.currentCard.Id
        wx.navigateTo({url})
      },
      jumpToCoupons () {
        const url = '../coupons/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId
        wx.navigateTo({url})
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.getConsumptions(this.page)
      },
      doDelete () {
        let that = this
        this.deleting = false
        this.$post('/card/businessCancelUserCard', {
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.$success('删除成功', true)
        })
      },
      refreshCards (card) {
        let cards = []
        let join = false
        for (let item of this.cards) {
          if (join || item.Id === card.Id) {
            cards.push(item)
            join = true
          }
        }
        for (let item of this.cards) {
          if (item.Id === card.Id) {
            break
          }
          cards.push(item)
        }
        this.cards = cards
        this.currentCard = cards[0]
      },
      getMemberInfo (refresh) {
        let that = this
        this.$post('/user/businessGetUserInfo', {
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.user = res
          that.cards = res.Cards
          that.firstLoad = false
          let infos = []
          that.storeUserName = res.UserName
          for (let item of res.StoreUserInfo) {
            if (item.ControlName === 'user_store_name') {
              that.storeUserName = item.ControlValue
            } else {
              infos.push(item)
            }
          }
          that.infos = infos
          if (res.Cards && res.Cards.length > 0) {
            if (refresh) {
              that.refreshCards(that.currentCard)
            } else {
              that.currentCard = res.Cards[0]
            }
          }
        })
      },
      getConsumptions (page) {
        let that = this
        this.isLoading = true
        this.$post('/consumption/businessGetUserConsumptionList', {
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          PageIndex: page,
          PageSize: 10
        }).then(res => {
          if (res.Data.length < 10) {
            that.isOver = true
          }
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let i in res.Data) {
              that.items.push(res.Data[i])
            }
          }
          this.isLoading = false
        })
      },
      getCouponCount () {
        let that = this
        this.$post('/coupon/getUserCouponCount', {
          StoreId: this.info.storeId,
          Uid: this.info.userId,
          UserId: this.info.memberId
        }).then(res => {
          that.couponCount = res.CouponCount
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreManagementData', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.store = res
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.infos = []
      this.page = 1
      this.user = {}
      this.store = {}
      this.items = []
      this.firstLoad = true
      this.couponCount = ''
      this.getMemberInfo()
      this.getStoreInfo()
      this.getConsumptions(1)
      this.getCouponCount()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      this.isOver = false
      this.page = 1
      this.getMemberInfo(true)
      this.getConsumptions(1)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .persion {
    height: 100vh;
    width: 100vw;
    background: #f0f0f0;
    .persion-scroll {
      width: 100vw;
      .member-info {
        width: 100vw;
        position: relative;
        overflow: hidden;
        .info-context {
          position: relative;
          width: 90vw;
          z-index: 3;
          background: rgba(0, 0, 0, 0.11);
          text-align: center;
          padding: 2vh 5vw;
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
      .line-bottom {
        width: 90vw;
        margin: 0 auto;
        border-bottom: rpx(1) solid #bbbbbb;
        padding-top: 2vh;
      }
      .operation {
        width: 90vw;
        margin: 0 auto;
        font-size: rpx(27);
        padding-top: 3.8vh;
        padding-bottom: 1.8vh;
        border-bottom: rpx(1) solid #bbbbbb;
        div {
          height: 4.3vh;
          span {
            display: inline-block;
            vertical-align: top;
            &:nth-child(1) {
              min-width: 10vw;
            }
            &:nth-child(2) {
              padding-left: 2vw;
              min-width: 13vw;
            }
            &:nth-child(3) {
              min-width: 12vw;
            }
            &:nth-child(4) {
              color: #003d82;
            }
          }
        }
      }
      .items {
        background: white;
        .items-foot {
          padding-left: 5vw;
          padding-top: 4.5vh;
          font-weight: 600;
          padding-bottom: 0.7vh;
        }
      }
    }
    .persion-buttons {
      position: absolute;
      bottom: 0;
      width: 100vw;
      height: 7vh;
      line-height: 7vh;
      z-index: 1000;
      border-top: rpx(1) solid #cccccc;
      background: white;
      span {
        display: inline-block;
        width: 28vw;
        margin-left: calc(4vw - 1rpx);
        height: 5vh;
        line-height: 5vh;
        text-align: center;
        border: rpx(1) solid #ff6700;
        font-size: rpx(33);
        border-radius: rpx(40);
        background: #ff6700;
        color: white;
        &:nth-child(1) {
          color: #ff6700;
          background: white;
        }
      }
    }
  }

  .filter {
    filter: blur(2px);
  }

  .card-balance {
    padding: 4vw 8vw;
    span {
      display: inline-block;
      width: 50%;
      vertical-align: bottom;
      &:nth-child(1) {
        div:nth-child(1) {
          font-size: 6vw;
          color: #ff6700;
        }
        div:nth-child(2) {
          font-size: 3vw;
        }
      }
      &:nth-child(2) {
        margin-left: 1%;
        margin-bottom: rpx(1);
        width: 48%;
        font-size: 3.5vw;
        color: #ff6700;
        text-align: center;
        border: rpx(1) solid #ff6700;
        height: 8vw;
        line-height: 8vw;
        border-radius: 5vw;
      }
    }
  }
</style>
