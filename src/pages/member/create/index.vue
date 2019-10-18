<template>
  <div class="create">
    <title :name="'新增会员'"></title>
    <scroll-view class="create-scroll" scroll-y="true" v-if="cards.length>0"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div v-if="!firstLoad" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 2vh"></div>
        <div class="create-logo">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/createlogo.png"/>
        </div>
        <div style="padding: 2vh 5vw;">
          <inputBox :keyword="'phone'"
                    :name="'电话'"
                    :request="true"
                    :type="'input'"
                    :context="'number'"
                    :max="'11'"
                    @changeValue="changeValue"></inputBox>

          <inputBox v-for="(item,index) in items"
                    :key="index"
                    :keyword="item.ControlName"
                    :name="item.ControlInstructions"
                    :request="item.IsMust"
                    :value="item.ControlValue"
                    :validations="item.ControlsValidations"
                    :type="item.ControlType"
                    @changeValue="changeValue"></inputBox>
          <inputBox :keyword="'remarkName'"
                    :name="'备注'"
                    :type="'input'"
                    @changeValue="changeValue"></inputBox>
        </div>
        <div>
          <div style="padding: 1vh"></div>
          <div style="padding: 2.5vh 5vw;background-color: white;">
            <div class="create-card">
              <span>持有卡片<text style="color: red">*</text></span>
              <span
                :style="{background:'url('+currentFace.CardImg+')','background-size':'100%,100%'}"
                @click="jumpToFace"
                v-if="currentFace!=null">
                <span class="card-title"
                      :style="{'font-size':currentFace&&currentFace.CardName&&currentFace.CardName.length>5?currentFace.CardName.length<10?(75-currentFace.CardName.length*5+'rpx'):'28rpx':'','line-height':currentFace&&currentFace.CardName&&currentFace.CardName.length>10?'12vw':''}">
                  {{computedCardName}}
                </span>
              </span>
              <span :style="{'font-size':'3vw',color:'#bfbfbf'}" @click="jumpToFace"
                    v-if="currentFace==null">选择持有会员卡</span>
              <span @click="jumpToFace">
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>

            <!--<inputBoxTwo :name="'充值金额'" :keyword="'SumValue'" :info="'元'"></inputBoxTwo>
            <inputBoxTwo :name="'购买'+(type?'金额':'次数')" :keyword="'SumOtherValue'" :info="type?'元':'次'"></inputBoxTwo>-->
            <div v-if="type==1">
              <inputBoxTwo :name="'余额'" :keyword="'CardValue'" :info="type?'元':'次'"></inputBoxTwo>
            </div>
            <div v-if="type==0">
              <div class="param" v-for="(item,index) in services">
                <span class="title">
                  {{item.ItemName}}
                  <text style="color: red">*</text>
                </span>
                <span class="model">
                  <input v-model="item.CardValue" type="number" placeholder="请输入余额" placeholder-style="color:#BABABA"/>
                </span>
                <span class="param-delete" @click="subService(index)">
                  次
                  <img v-if="services.length>1" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png"/>
                </span>
              </div>
              <div class="param" v-for="(item,index) in gifts">
                <span class="title">
                  {{item.ItemName}}
                  <text style="color: red">*</text>
                </span>
                <span class="model">
                  <input v-model="item.CardValue" type="number" placeholder="请输入余额" placeholder-style="color:#BABABA"/>
                </span>
                <span class="param-delete" @click="subGift(index)">
                  次
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png"/>
                </span>
              </div>
              <div class="times-add" @click="showAddModel">
                <span>+</span>
                <span>添加服务项</span>
              </div>
            </div>
            <div class="param">
              <span class="title">有效期至</span>
              <span>
              <picker class="picker" @change="changeValidityDate" mode="date" :value="validityDate"
                      :start="start">
                <view class="model"
                      :style="{color:validityDate==''?'#7e7e7e':''}">{{validityDate == '' ? '请选择' : validityDate}}</view>
              </picker>
            </span>
            </div>
            <div class="commit">
              <button @click="isOverdue?showToast=true:createMember()" :class="isOverdue?'overdue-button':''">保存
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="nocards" v-if="firstLoad==false&&cards.length==0">
      没有会员卡哦 =_="
    </div>
    <div v-if="showHelp==true">
      <help @confirm="confirm"></help>
    </div>
    <div v-if="showAdd">
      <add @close="showAdd=false" @save="doAddService" :items="newServices" :gifts="newGifts" :type="'create'"></add>
    </div>
    <div class="share-model" @click="showShare=false" v-if="showShare">
      <div class="share-context" @click.stop="">
        <div class="share-close">
          <span></span>
          <span>今日不再显示</span>
          <span style="position: relative;top: -0.8vw">
            <switch style="zoom: 0.7" @change="switchChange" :checked="false" color="#78bc6d"/>
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
          <span @click="closeShareModel">关闭</span>
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
            <div>{{messageTemplate.SendMessageDate}} <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/accept.png"/></div>
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
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
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
  import inputBox from '@/components/input'
  import inputBoxTwo from '@/components/input2'
  import title from '@/components/title'
  import help from '@/components/createhelp'
  import add from '@/components/addservice'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      inputBox, title, inputBoxTwo, help, add, renewtoast
    },
    data () {
      return {
        titleHeight: null,
        userInfos: [],
        items: [],
        cards: [],
        validityDate: '',
        sumValue: null,
        cardValue: null,
        img: '',
        currentFace: null,
        type: null,
        currentCard: {},
        firstLoad: true,
        start: '',
        showHelp: false,
        services: [],
        newServices: [{}],
        gifts: [],
        newGifts: [],
        remarkName: '',
        newInfo: {
          remarkName: ''
        },
        qrCode: '',
        showAdd: false,
        showShare: false,
        showMessage: false,
        showPersion: false,
        messageTemplate: {},
        changeData: 0,
        showToast: false
      }
    },
    computed: {
      computedCardName () {
        if (this.currentFace && this.currentFace.CardName) {
          if (this.currentFace.CardName.length > 10 && this.currentFace.CardName.length <= 20) {
            let middle = Math.ceil(this.currentFace.CardName.length / 2)
            return this.currentFace.CardName.substring(0, middle) + '\n' + this.currentFace.CardName.substring(middle, this.currentFace.CardName.length)
          } else {
            return this.currentFace.CardName
          }
        } else {
          return '会员卡'
        }
      },
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      }
    },
    methods: {
      confirm () {
        this.showHelp = false
        wx.navigateBack({
          delta: 1
        })
      },
      closeShareModel () {
        this.showShare = false
        wx.navigateBack({
          delta: 1
        })
      },
      jumpToNutCard () {
        let path = 'pages/share/main?storeId=' + this.info.storeId + '&userId=' + this.info.userId + '&childCardId=' + this.childCardId
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
      jumpToFace () {
        const url = '../face/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId
        wx.navigateTo({url})
      },
      switchChange (e) {
        let value = e.mp.detail.value
        let date = new Date()
        console.log(date.getTime())
        wx.setStorageSync('showShare', {
          hide: value,
          time: date.getTime()
        })
      },
      changeValue (key, value) {
        for (var i in this.userInfos) {
          if (this.userInfos[i].ControlName === key) {
            this.userInfos[i].ControlValue = value
          }
        }
        if (key === 'phone') {
          this.phone = value
        } else if (key === 'remarkName') {
          this.newInfo['remarkName'] = value
        }
      },
      showAddModel () {
        let items = []
        for (let item of this.services) {
          items.push({
            ItemId: item.ItemId,
            ItemName: item.ItemName,
            CardValue: item.CardValue
          })
        }
        if (items.length > 0) {
          this.newServices = items
          this.newServices.push({})
        } else {
          this.newServices = [{}]
        }
        let gifts = []
        for (let item of this.gifts) {
          gifts.push({
            IsGift: true,
            ItemId: item.ItemId,
            ItemName: item.ItemName,
            CardValue: item.CardValue
          })
        }
        this.newGifts = gifts
        this.showAdd = true
      },
      subService (index) {
        if (this.services.length === 1) {
          return
        }
        let items = []
        for (let i = 0; i < this.services.length; i++) {
          if (i !== index) {
            items.push(this.services[i])
          }
        }
        this.services = items
        this.changeData += 1
      },
      subGift (index) {
        let items = []
        for (let i = 0; i < this.gifts.length; i++) {
          if (i !== index) {
            items.push(this.gifts[i])
          }
        }
        this.gifts = items
      },
      doAddService (items, gifts) {
        let cards = []
        let services = []
        for (let item of items) {
          item.CardValue = item.CardValue * 1
          cards.push(item)
          services.push(item)
        }
        this.services = cards
        if (gifts) {
          this.gifts = gifts
          for (let item of gifts) {
            services.push(item)
          }
        }
        this.showAdd = false
        this.changeData += 1
      },
      sendMessage () {
        let that = this
        this.$post('/card/businessSendAssociateCardMessage', {
          ChildCardId: this.childCardId,
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
      getMessage (cardId) {
        let that = this
        this.$post('/card/businessGetMessageTemplate', {
          CardId: this.cardId,
          ChildCardId: this.childCardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.messageTemplate = res
        })
      },
      getCardCode () {
        let that = this
        this.$post('/card/businessGetUserCardChildQrCode', {
          ChildCardId: this.childCardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.qrCode = res.QrCode
          that.showShare = true
        })
      },
      getUserInfo (cardId) {
        let that = this
        this.cardId = cardId
        this.$post('/user/businessGetUserInfo', {
          UserId: 0,
          CardId: cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          if (res.Cards && res.Cards.length > 0) {
            that.childCardId = res.Cards[0].Id
            that.getCardCode()
            that.getMessage()
          }
        })
      },
      createMember () {
        let that = this
        let childrens = this.$children
        let isError = false
        let values = []
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
          if (children.getValue) {
            let value = children.getValue()
            values[value.name] = value.value
          }
        }
        if (this.currentFace === null) {
          wx.showToast({
            title: '请选择持有卡片',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          isError = true
        }
        let services = []
        if (this.type === 0) {
          for (let item of this.services) {
            if (item.ItemName && item.CardValue !== null && item.CardValue !== '' && item.CardValue !== undefined) {
              item.OperationValue = item.CardValue
              services.push(item)
            } else {
              wx.showToast({
                title: '不能为空',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              isError = true
            }
          }
          for (let item of this.gifts) {
            if (item.ItemName && item.CardValue !== null && item.CardValue !== '' && item.CardValue !== undefined) {
              item.OperationValue = item.CardValue
              services.push(item)
            } else {
              wx.showToast({
                title: '不能为空',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              isError = true
            }
          }
        }
        if (isError) {
          return false
        }
        console.log(values)
        console.log(services)
        this.$post('/user/businessAddStoreUser', {
          UserMobile: this.phone,
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          UserInfos: this.userInfos,
          ValidityDate: this.validityDate,
          CardValue: values['CardValue'] ? values['CardValue'] : 10,
          PrepaidCardId: this.currentFace.PrepaidCardId,
          OperationServicesModel: services,
          RemarkName: this.newInfo['remarkName']
        }, true).then(res => {
          let help = wx.getStorageSync('showShare')
          console.log(help)
          if (!help || help.hide === false) {
            that.getUserInfo(res.CardId)
          } else {
            if (help && help.hide === true) {
              let date = new Date()
              if ((date.getTime() - help.time) / 1000 > 86400) {
                that.getUserInfo(res.CardId)
              } else {
                that.$success('创建成功', true)
              }
            } else {
              that.$success('创建成功', true)
            }
          }
        })
      },
      getCustomControls () {
        let that = this
        this.$post('/user/businessGetStoreControls', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.items = res.Controls
          if (that.items && that.items.length > 0) {
            for (let item of that.items) {
              that.userInfos.push({
                ControlName: item.ControlName
              })
            }
          }
          that.firstLoad = false
        })
      },
      changeValidityDate (e) {
        this.validityDate = e.mp.detail.value
      },
      calcValidityDateTo (date) {
        if (date === 0) {
          return ''
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
        return year + '-' + month + '-' + day
      },
      getCardSetting (callback) {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCards', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, this.firstLoad).then(res => {
          if (res.PrepaidCards && res.PrepaidCards.length > 0) {
            that.cards = res.PrepaidCards
          }
          if (callback) {
            callback()
          }
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.firstLoad = true
      this.userInfos = []
      this.items = []
      this.validityDate = ''
      this.currentFace = null
      this.showHelp = false
      this.type = null
      this.newInfo = {
        remarkName: ''
      }
      this.remarkName = ''
      this.showShare = false
      this.showMessage = false
      this.showPersion = false
      this.showToast = false
      wx.removeStorageSync('cardFace')
      let that = this
      this.getCardSetting(function () {
        that.getCustomControls()
      })
      this.titleHeight = this.getGlobalData().titleHeight
      let date = new Date()
      this.start = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    onShow () {
      if (!this.firstLoad) {
        let globalData = this.getGlobalData()
        if (globalData.currentFaceIndex != null) {
          this.currentFace = this.cards[globalData.currentFaceIndex]
          this.type = this.currentFace.CardType
        }
        let currentCard = wx.getStorageSync('cardFace')
        if (currentCard) {
          this.currentCard = currentCard
          this.validityDate = this.calcValidityDateTo(currentCard.ValidityDate)
          this.services = []
          this.gifts = []
          for (let item of currentCard.Services) {
            if (item.IsGift) {
              this.gifts.push(item)
            } else {
              this.services.push(item)
            }
          }
        }
        console.log(currentCard)
        wx.removeStorageSync('cardFace')
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .create {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .nocards {
      color: #bfbfbf;
      text-align: center;
      height: 25vh;
      line-height: 25vh;
      font-size: 4vw;
    }
    .create-scroll {
      width: 100vw;
      height: 90vh;
      font-size: rpx(28);
      .create-logo {
        text-align: center;
        img {
          display: inline-block;
          width: rpx(140);
          height: rpx(140);
        }
      }
      .create-card {
        height: 24vw;
        line-height: 24vw;
        padding-bottom: 3vh;
        vertical-align: top;
        .card-img {

        }
        span {
          display: inline-block;
          height: 24vw;
          line-height: 24vw;
          vertical-align: top;
          &:nth-child(1) {
            padding-left: 1vw;
            width: 20vw;
          }
          &:nth-child(2) {
            width: 40vw;
            border-radius: rpx(15);
            text-align: center;
            font-size: rpx(50);
            color: white;
            background: #f1f1f1;
            height: 24vw;
            vertical-align: top;
          }
          &:nth-child(3) {
            padding-left: 2vw;
          }
          img {
            display: inline-block;
            height: rpx(40);
            width: rpx(15);
            vertical-align: middle;
          }
        }
        .card-title {
          display: inline-block;
          vertical-align: top;
          width: 40vw !important;
          padding: 0 !important;
        }
      }
      .times-add {
        height: 4.4vw;
        line-height: 4.4vw;
        padding-bottom: 3.2vw;
        span {
          display: inline-block;
          vertical-align: top;
          height: 4.4vw;
          line-height: 4.4vw;
          &:nth-child(1) {
            width: 4.4vw;
            line-height: 4.3vw;
            border-radius: 50%;
            border: 0.1vw solid #BABABA;
            color: #BABABA;
            font-size: 3.5vw;
            text-align: center;
          }
          &:nth-child(2) {
            padding-left: 0.8vw;
            color: black;
            font-size: 3.5vw;
          }
        }
      }
      .param {
        height: 7.2vh;
        color: #7e7e7e;
        .title {
          height: 4vh;
          line-height: 4vh;
          width: 20vw;
          padding-left: 1vw;
          display: inline-block;
          color: black;
        }
        .picker {
          display: inline-block;
          height: calc(4vh + 2rpx);
          vertical-align: top;
        }
        .model {
          display: inline-block;
          width: 39vw;
          height: 4vh;
          line-height: 4vh;
          border: rpx(1) solid #f0f0f0;
          color: black;
          vertical-align: top;
          border-radius: rpx(30);
          background-color: #f0f0f0;
          padding: 0 2vw;
          input {
            width: 35vw;
            display: inline-block;
            height: 4vh;
            line-height: 4vh;
            vertical-align: top;
            color: black;
          }
        }
        .param-delete {
          height: 4vh;
          line-height: 4vh;
          display: inline-block;
          vertical-align: top;
          padding-left: 2vw;
          img {
            display: inline-block;
            vertical-align: middle;
            width: 4.4vw;
            height: 4.4vw;
            margin-left: 5vw;
          }
        }
      }

      .commit {
        padding: 4.5vh 5vw;
        text-align: right;
        button {
          display: inline-block;
          height: rpx(80);
          line-height: rpx(80);
          text-align: center;
          background-color: #ff6700;
          border-radius: rpx(40);
          font-size: rpx(35);
          color: white;
          width: 28vw;
          font-size: rpx(40);
          color: white;
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
          text-align: left;
          font-size: 5vw;
          padding-top: 2vw;
          padding-left: 0vw;
          overflow: hidden;
          position: relative;
          left: 3vw;
          span {
            display: inline-block;
            vertical-align: middle;
            &:nth-child(1) {
              width: 48vw;
            }
            &:nth-child(2) {
              color: #a7a7a7;
              font-size: 3.5vw;
              padding-right: 2vw;
            }
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
