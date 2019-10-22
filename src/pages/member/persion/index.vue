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
              <div class="edit" @click="jumpToEdit" v-if="isMember">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/edit.png"/>
              </div>
              <div class="name">{{user.RemarkName ? user.RemarkName : storeUserName}}</div>
              <div class="infomation" v-if="user.UserMobile">
                <span>手机号：</span>
                <span>{{user.UserMobile}}</span>
              </div>
              <div class="infomation" v-for="item in infos">
                <span>{{item.ControlInstructions}}：</span>
                <span>{{item.ControlName == 'user_sex' ? (item.ControlValue == '1' ? '男' : item.ControlValue == '2' ? '女' : '未知') : item.ControlValue}}</span>
              </div>
              <div class="infomation" v-if="user.RemarkName">
                <span>备注名：</span>
                <span>{{user.RemarkName}}</span>
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
          <div v-if="cards.length>0">
            <div class="add-card" @click="jumpToAddCard">
              <span>添加会员卡</span>
              <span><img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right3.png"/></span>
            </div>
            <div style="min-height: 50vw;position: relative;" :style="{height:50+5*cards.length+'vw'}">
              <div v-for="(item,index) in cards" @click="refreshCards(item)">
                <card :item="item" :index="index" :count="cards.length" @showServices="showMore=true"
                      @shareCard="showShareModel"></card>
              </div>
            </div>
            <div class="card-balance">
              <!--<span>
                <div>{{currentCard.CardPrice}}{{currentCard.CardType ? '元' : '次'}}</div>
                <div>余额</div>
              </span>-->
              <span @click="jumpToAdjust">
                <div>核减消费 | 编辑会员卡</div>
              </span>
            </div>
          </div>
          <div class="line-bottom" v-if="isMember"></div>
          <!--<div class="operation" v-if="user.StoreUserOperations&&user.StoreUserOperations.length>0">
            <div v-for="(item,index) in user.StoreUserOperations">
              <span>{{item.StoreUserName}}</span>
              <span>{{item.ConsumptionTag}}</span>
              <span>{{item.ConsumptionValue}}{{item.ConsumptionType ? '元' : '次'}}</span>
              <span @click="jumpToDetails(item)">查看</span>
            </div>
          </div>-->
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
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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

    <div v-if="showMore">
      <more :services="currentCard.Services" @close="showMore=false"></more>
    </div>

    <div class="share-model" @click="showShare=false" v-if="showShare">
      <div class="share-context" @click.stop="">
        <div class="share-close">
          <span @click="showShare=false">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
          </span>
        </div>
        <div class="share-code">
          <img :src="qrCode"/>
        </div>
        <div class="share-title">
          让顾客扫码领取
        </div>
        <div class="share-other">
          <div></div>
          <span>其他领取方式</span>
        </div>
        <div class="share-buttons">
          <span @click="showMessage=true">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-message.png"/>
            <div>发送短信</div>
          </span>
          <span @click="jumpToNutCard">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-group.png"/>
            <div>微信好友</div>
          </span>
          <span @click="showPersion=true">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-persion.png"/>
            <div>顾客自领取</div>
          </span>
          <div class="share-time">
            <div v-if="messageTemplate.IsSentMessage">{{messageTemplate.SendMessageDate}} <img
              src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/accept.png"/></div>
          </div>
        </div>
        <div class="share-close2">
          <span @click="showShare=false">关闭</span>
        </div>
      </div>
    </div>

    <div class="message-model" v-if="showMessage" @click="showMessage=false">
      <div class="message-context" @click.stop="">
        <div class="message-close">
          <span @click="showMessage=false">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
          </span>
        </div>
        <div class="message-text">
          【坚果卡包】您经常光顾的“{{messageTemplate.StoreName}}”已启用使消费更加透明化的电子会员卡，卡内余额、消费记录等一目了然，领取{{messageTemplate.LinkUrl}}
        </div>
        <div class="message-call">
          <span>发送至: {{messageTemplate.UserMobile}}({{messageTemplate.UserName}})</span>
          <span class="share-time" v-if="messageTemplate.IsSentMessage">
            <div>{{messageTemplate.SendMessageDate}} <img
              src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/accept.png"/></div>
          </span>
        </div>
        <div class="message-remark">
          短信费用由坚果卡包支付
        </div>
        <div class="message-buttons">
          <span @click="showMessage=false">{{messageTemplate.SendMessageDate ? '知道了' : '取消'}}</span>
          <span v-if="!messageTemplate.IsSentMessage" @click="sendMessage"
                style="margin-left: 5vw;background: #FF6F00;color: white;">发送</span>
        </div>
      </div>
    </div>

    <div class="persion-model" @click="showPersion=false" v-if="showPersion">
      <div class="persion-context" @click.stop="">
        <div class="persion-close">
          <span @click="showPersion=false">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
          </span>
        </div>
        <div class="persion-title">
          让该会员扫描您的店铺码，点击右上角，即可完成领卡（如下图）
        </div>
        <div class="persion-img">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/tobe-member.png"/>
        </div>
        <div class="persion-close2">
          <span @click="showPersion=false">知道了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import card from '@/components/persion-card'
  import item from '@/components/list'
  import title from '@/components/title'
  import confirm from '@/components/confirm'
  import more from '@/components/services'

  export default {
    components: {
      card, item, title, confirm, more
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
        qrCode: '',
        items: [],
        isMember: true,
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        couponCount: '',
        showMore: false,
        showShare: false,
        showPersion: false,
        showMessage: false,
        sendDate: '',
        messageTemplate: {},
        page: 1 // 消费明细当前页
      }
    },
    methods: {
      jumpToNutCard () {
        let path = 'pages/share/main?storeId=' + this.info.storeId + '&userId=' + this.info.userId + '&childCardId=' + this.currentCard.Id
        let url = this.getGlobalUrl().url
        if (url.indexOf('test') > 0) {
          path += '&type=test'
        } else if (url.indexOf('home') > 0) {
          path += '&type=home'
        }
        console.log(path)
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: path,
          envVersion: 'trial'
        })
      },
      jumpToEdit () {
        const url = '../edit/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId + '&cardId=' + this.info.cardId
        wx.navigateTo({url})
      },
      jumpToAddCard () {
        let cardIds = []
        for (let card of this.cards) {
          cardIds.push(card.PrepaidCardId)
        }
        wx.setStorageSync('addCardInfo', {
          user: this.user,
          cardIds: cardIds
        })
        const url = '../addcard/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId + '&cardId=' + this.info.cardId
        wx.navigateTo({url})
      },
      jumpToDetails (item) {
        const url = '../../details/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&consumptionId=' + item.ConsumptionId + '&type=member'
        wx.navigateTo({url})
      },
      jumpToAdjust () {
        wx.setStorageSync('adjustCard', this.currentCard)
        const url = '../adjust/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId + '&memberId=' + this.info.memberId + '&cardId=' + this.user.CardId + '&childCardId=' + this.currentCard.Id + '&number=' + this.cards.length
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
      showShareModel () {
        if (this.user.IsAssociatedUser) {
          return
        }
        this.messageTemplate = {}
        this.getMessage()
        this.getCardCode()
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
      sendMessage () {
        let that = this
        this.$post('/card/businessSendAssociateCardMessage', {
          ChildCardId: this.currentCard.Id,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          if (res.IsSentMessage) {
            that.sendDate = res.SendMessageDate
            that.showMessage = false
            that.getMessage()
          }
        })
      },
      getMessage () {
        let that = this
        this.$post('/card/businessGetMessageTemplate', {
          CardId: this.info.cardId,
          ChildCardId: this.currentCard.Id,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.messageTemplate = res
        })
      },
      getCardCode () {
        let that = this
        this.$post('/card/businessGetUserCardChildQrCode', {
          ChildCardId: this.currentCard.Id,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.qrCode = res.QrCode
          that.showShare = true
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
          that.firstLoad = false
          that.storeUserName = res.UserName
          let infos = []
          for (let item of res.StoreUserInfo) {
            if (item.ControlName === 'user_store_name') {
              that.storeUserName = item.ControlValue
              that.user.StoreUserName = item.ControlValue
            } else {
              infos.push(item)
            }
          }
          that.infos = infos
          if (res.Cards && res.Cards.length > 0) {
            for (let card of res.Cards) {
              card.StoreLogo = that.store.StoreLogo
              card.StoreName = that.store.StoreName
              if (res.UserId === 0 || res.UserId === '0') {
                card.isShare = true
              }
            }
          }
          that.cards = res.Cards
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
          CardId: this.info.cardId ? this.info.cardId : 0,
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
      getStoreInfo (callback) {
        let that = this
        this.$post('/store/businessGetStoreManagementData', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.store = res
          callback()
        })
      }
    },
    onLoad (option) {
      this.info = option
      if (this.info.cardId && this.info.cardId !== '0') {
        this.isMember = true
      } else {
        this.isMember = false
      }
      // this.isMember = true
      this.infos = []
      this.page = 1
      this.isOver = false
      this.user = {}
      this.store = {}
      this.items = []
      this.cards = []
      this.firstLoad = true
      this.showMore = false
      this.showShare = false
      this.showMessage = false
      this.showPersion = false
      this.couponCount = ''
      this.storeUserName = ''
      let that = this
      this.getStoreInfo(function () {
        that.getMemberInfo()
      })
      this.getCouponCount()
      this.getConsumptions(1)
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      this.isOver = false
      this.page = 1
      this.getMemberInfo(true)
      this.getCouponCount()
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
    .filter {
      filter: blur(2px);
    }
    .add-card {
      padding-top: 6vw;
      padding-left: 73vw;
      height: 3.3vw;
      line-height: 3.3vw;
      span {
        display: inline-block;
        vertical-align: top;
        height: 3.3vw;
        line-height: 3.3vw;
        &:nth-child(1) {
          color: #A5A5A5;
          font-size: 3.3vw;
        }
        &:nth-child(2) {
          padding-left: 0.6vw;
          padding-top: 0.6vw;
          box-sizing: border-box;
        }
        img {
          display: inline-block;
          vertical-align: top;
          height: 1.9vw;
          width: 1.4vw;
        }
      }
    }
    .card-balance {
      padding: 4vw 8vw;
      text-align: center;
      span {
        display: inline-block;
        width: 50%;
        vertical-align: bottom;
        &:nth-child(1) {
          box-sizing: border-box;
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
    .share-model {
      background: rgba(0, 0, 0, 0.35);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 80vh;
      padding-top: 20vh;
      z-index: 3000;
      .share-context {
        margin: 0 auto;
        width: 87.7vw;
        background: white;
        border-radius: 1.9vw;
        text-align: center;
        .share-close {
          text-align: right;
          span {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
            padding: 4.4vw;
          }
          img {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
          }
        }
        .share-code {
          padding: 2.6vw 0 3.9vw 0;
          height: 27vw;
          img {
            display: inline-block;
            width: 26.9vw;
            height: 27vw;
          }
        }
        .share-title {
          color: #323232;
          font-size: 5vw;
          height: 5vw;
          line-height: 5vw;
          padding-bottom: 8.7vw;
        }
        .share-other {
          height: 3.6vw;
          line-height: 3.6vw;
          margin: 0 6.1vw;
          position: relative;
          padding-bottom: 5.2vw;
          div {
            position: absolute;
            border-bottom: 0.1vw solid #BFBFBF;
            top: 1.6vw;
            width: 100%;
            height: 0;
            left: 0;
          }
          span {
            display: inline-block;
            vertical-align: top;
            background: white;
            height: 3.6vw;
            line-height: 3.6vw;
            color: #A5A5A5;
            font-size: 3.6vw;
            position: relative;
            padding: 0 1vw;
          }
        }
        .share-buttons {
          padding: 0 2vw;
          span {
            display: inline-block;
            width: 33.3%;
            div {
              height: 3.3vw;
              line-height: 3.3vw;
              padding: 2.7vw 0 1.9vw 0;
              color: #323232;
              font-size: 3.3vw;
            }
          }
          img {
            display: inline-block;
            vertical-align: top;
            width: 12.4vw;
            height: 12.4vw;
          }
          .share-time {
            height: 4.5vw;
            line-height: 4.5vw;
            width: 33.3%;
            padding-bottom: 8.3vw;
            div {
              display: inline-block;
              vertical-align: top;
              height: 4.5vw;
              line-height: 4.5vw;
              background: rgba(245, 234, 189, 1);
              border-radius: 2.3vw;
              padding: 0 2.9vw;
              font-size: 2.2vw;
              color: rgba(159, 120, 0, 1);
            }
            img {
              display: inline-block;
              width: 2.9vw;
              height: 2.9vw;
              vertical-align: middle;
            }
          }
        }
        .share-close2 {
          padding-bottom: 8.1vw;
          span {
            display: inline-block;
            height: 8.9vw;
            line-height: 8.9vw;
            width: 36.2vw;
            border: 0.2vw solid #FF6F00;
            border-radius: 4.5vw;
            font-size: 4vw;
            color: #FF6F00;
            background: #FFF4ED;
          }
        }
      }
    }

    .persion-model {
      background: rgba(0, 0, 0, 0.35);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 80vh;
      padding-top: 20vh;
      z-index: 3003;
      .persion-context {
        margin: 0 auto;
        width: 87.7vw;
        background: white;
        border-radius: 1.9vw;
        .persion-close {
          text-align: right;
          span {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
            padding: 4.4vw;
          }
          img {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
          }
        }
        .persion-title {
          padding: 2.7vw 5.5vw 6.6vw 5.5vw;
          color: #0B0B0B;
          font-size: 4.4vw;
          line-height: 5.3vw;
        }
        .persion-img {
          width: 75.3vw;
          height: 42.8vw;
          margin: 0 auto;
          img {
            display: inline-block;
            vertical-align: top;
            width: 75.3vw;
            height: 42.8vw;
          }
        }
        .persion-close2 {
          padding-top: 10.8vw;
          padding-bottom: 8.9vw;
          padding-right: 6.4vw;
          text-align: right;
          span {
            display: inline-block;
            height: 8.9vw;
            line-height: 8.9vw;
            width: 29.4vw;
            border-radius: 4.5vw;
            font-size: 4vw;
            color: white;
            background: #FF6F00;
            text-align: center;
          }
        }
      }
    }

    .message-model {
      background: rgba(0, 0, 0, 0.35);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 78vh;
      padding-top: 22vh;
      z-index: 3001;
      .message-context {
        margin: 0 auto;
        width: 87.7vw;
        background: white;
        border-radius: 1.9vw;
        .message-close {
          text-align: right;
          padding-bottom: 2.5vw;
          span {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
            padding: 4.4vw;
          }
          img {
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
            display: inline-block;
          }
        }
        .message-text {
          width: 75.3vw;
          box-sizing: border-box;
          padding: 5.5vw 3.5vw;
          line-height: 6vw;
          color: #323232;
          font-size: 3.3vw;
          margin: 0 auto;
          background: rgba(241, 241, 241, 1);
          border: 0.1vw solid rgba(188, 188, 188, 1);
          text-align: left;
        }
        .message-call {
          height: 4.5vw;
          line-height: 4.5vw;
          font-size: 3.1vw;
          color: #0B0B0B;
          padding: 5vw 6.2vw 2vw 6vw;
          text-align: left;
          span {
            height: 4.5vw;
            line-height: 4.5vw;
            display: inline-block;
            vertical-align: top;
            width: 70%;
          }
          .share-time {
            height: 4.5vw;
            line-height: 4.5vw;
            padding-bottom: 8.3vw;
            width: 30%;
            text-align: right;
            div {
              display: inline-block;
              vertical-align: top;
              height: 4.5vw;
              line-height: 4.5vw;
              background: rgba(245, 234, 189, 1);
              border-radius: 2.3vw;
              padding: 0 2.9vw;
              font-size: 2.2vw;
              color: rgba(159, 120, 0, 1);
              text-align: center;
            }
            img {
              display: inline-block;
              width: 2.9vw;
              height: 2.9vw;
              vertical-align: middle;
            }
          }
        }
        .message-remark {
          height: 3.1vw;
          line-height: 3.1vw;
          font-size: 3.1vw;
          color: #A5A5A5;
          padding-left: 6vw;
          padding-bottom: 10.5vw;
          text-align: left;
        }
        .message-buttons {
          padding-bottom: 8.3vw;
          text-align: right;
          padding-right: 6.3vw;
          span {
            display: inline-block;
            height: 8.7vw;
            line-height: 8.5vw;
            padding: 0 8vw;
            border: 0.2vw solid #FF6F00;
            border-radius: 4.5vw;
            font-size: 4vw;
            box-sizing: border-box;
            color: #FF6F00;
            background: #FFF4ED;
          }
        }
      }
    }
  }


</style>
