<template>
  <div class="demo-page card-create">
    <title :name="this.info.type=='edit'?'编辑卡':'新建卡'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh" v-if="info.type=='create'"></div>
        <div class="card-state" v-if="info.type=='edit'&&state!=null"
             :class="{'state-open':state,'state-close':!state}">
          <span>
            {{state ? '状态：出售中' : '状态：暂停出售（即顾客看不到）'}}
          </span>
          <span>
              <switch :checked="state" @change="switchChange" color="#78BC6D"/>
          </span>
        </div>
        <div class="demo-context create-context" v-show="firstLoad==false">
          <div @click="jumpToFace">
            <div class="create-card"
                 v-bind:style="{'background':'url('+img+')','background-size':'100% 100%'}">
              <div class="card-hearder">
              <span class="header-logo"
                    v-bind:style="{'background':'url('+store.StoreLogo+')','background-size':'100% 100%'}"></span>
                <span class="header-name" style="width: 55vw">{{store.StoreName}}</span>
                <img class="header-code" src="/static/code.png"/>
              </div>
              <div class="card-content"
                   :style="{'font-size':cardName&&cardName.length>5?cardName.length<10?(145-cardName.length*9+'rpx'):'59rpx':'','line-height':cardName&&cardName.length>10?'67rpx':''}">
                <text>{{computedCardName}}</text>
              </div>
              <div class="card-footer">
                <div class="footer-number">0000 0000 0000 000</div>
                <div class="footer-date">有效期<span
                  v-if="validity[0]==0||(validity[0]==1&&validity[1]==0&&validity[2]==0)">永久</span>
                  <span v-if="validity[0]!=0&&!(validity[0]==1&&validity[1]==0&&validity[2]==0)">
                  <span>{{validity[0] == 1 ? '' : validityRange[0][validity[0]].name}}</span>
                  <span>{{validity[1] == 0 ? '' : validityRange[1][validity[1]].name}}</span>
                  <span>{{validity[2] == 0 ? '' : validityRange[2][validity[2]].name}}</span>
                </span>
                </div>
              </div>
            </div>
            <div class="store-right">
              <img src="/static/right2.png"/>
            </div>
          </div>

          <form @submit="commit">
            <div v-if="card!=undefined" class="info">
              <custom :name="'CardName'"
                      :title="'卡名'"
                      :request="true"
                      :type="'input'"
                      :value="card.CardName"
                      @changeName="changeValue"></custom>

              <div class="demo-input" @click="showTool=true"
                   :style="{'border-bottom':isError?'1rpx solid red':'1rpx solid #bbbbbb'}">
                <span class="name">面值<span class="request">*</span></span>
                <span class="value" :style="{color:faceValue == null?'#dadada':'#7e7e7e'}">
                {{faceValue == null ? '请输入' : faceValue.price + '元/' + faceValue.times + (cardType == 0 ? '次' : '元')}}
                <span style="display: inline-block;color: red;padding-left: 5vw"
                      v-if="faceValue!=null&&faceValue.gift!=''">额外赠{{faceValue.gift + (cardType == 0 ? '次' : '元')}}</span>
              </span>
              </div>

              <!--<record :keyword="'Price'"
                      :name="'售价'"
                      :request="true"
                      :type="'input'"
                      :value="card.Price"
                      @changeValue="changeValue"></record>

              <record :keyword="'CardValue'"
                      :name="'卡价值'"
                      :request="true"
                      :type="'input'"
                      :value="card.CardValue"
                      @changeValue="changeValue"></record>

              <record :keyword="'CardGivingValue'"
                      :name="'赠送'"
                      :request="true"
                      :type="'input'"
                      :value="card.CardGivingValue"
                      @changeValue="changeValue"></record>-->

              <div class="custom-box" v-if="cardType==1">
                <div class="input" :style="{'border-bottom-color':'#d5d5d5'}">
                <span class="name">
                  折扣<span class="request">*</span>
                </span>
                  <picker class="value" mode="multiSelector" :range="discountRange" :value="discount"
                          @change="discountChange">
                    <span v-if="discount[0]==0||(discount[0]==11&&discount[2]==10)">无折扣</span>
                    <span
                      v-if="discount[0]!=0&&!(discount[0]==11&&discount[2]==10)">
                    {{discountRange[0][discount[0]]}}
                    .
                    {{discountRange[2][discount[2]]}}折</span>
                  </picker>
                </div>
              </div>
              <div class="custom-box">
                <div class="input" :style="{'border-bottom-color':'#d5d5d5'}">
                <span class="name">
                  有效期<span class="request">*</span>
                </span>
                  <picker class="value" mode="multiSelector" :range="validityRange" :value="validity"
                          @change="validityChange"
                          :range-key="'name'">
                    <span v-if="validity[0]==0||(validity[0]==1&&validity[1]==0&&validity[2]==0)">永久有效</span>
                    <span
                      v-if="validity[0]!=0&&!(validity[0]==1&&validity[1]==0&&validity[2]==0)">
                    {{validity[0] == 1 ? '' : validityRange[0][validity[0]].name}}
                    {{validity[1] == 0 ? '' : validityRange[1][validity[1]].name}}
                    {{validity[2] == 0 ? '' : validityRange[2][validity[2]].name}}</span>
                  </picker>
                </div>
              </div>
              <div class="demo-buttons">
                <button class="cancel" v-show="info.type=='edit'" @click="deleting = true">删除此卡</button>
                <button class="done" formType="submit">保存</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showTool">
      <createcardtool @confirm="confirm" @cancel="showTool = false"
                      :price="faceValue?faceValue.price:''"
                      :times="faceValue?faceValue.times:''"
                      :gift="faceValue?faceValue.gift:''"
                      :type="cardType==0?'次':'元'"></createcardtool>
    </div>
    <div v-if="deleting">
      <confirm :title="'确认删除吗？删除后不可恢复！'" :confirm="'删除'" :cancel="'取消'"
               @confirm="deleteCard" @cancel="deleting = false"></confirm>
    </div>
  </div>
</template>

<script>
  import record from '@/components/input'
  import title from '@/components/title'
  import createcardtool from '@/components/createcardtool'
  import confirm from '@/components/confirm'
  import {copy} from '../../../utils/index.js'
  import custom from '@/components/custom'

  export default {
    components: {
      record, title, createcardtool, confirm, custom
    },

    data () {
      return {
        info: {},
        validity: [0, 0, 0],
        validityRange: [],
        discount: [0, 0, 0, 0],
        discountRange: [
          ['无折扣', 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          ['.'],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          ['折']
        ],
        card: undefined,
        newCard: {},
        rule: {},
        store: {},
        img: '',
        faceValue: null,
        cardType: 0,
        current: 0,
        showTool: false,
        deleting: false,
        firstLoad: true,
        titleHeight: null,
        cardName: '',
        isError: false,
        state: null
      }
    },
    computed: {
      computedCardName () {
        if (this.cardName) {
          if (this.cardName.length > 10 && this.cardName.length <= 20) {
            let middle = Math.ceil(this.cardName.length / 2)
            return this.cardName.substring(0, middle) + '\n' + this.cardName.substring(middle, this.cardName.length)
          } else {
            return this.cardName
          }
        } else {
          return '会员卡'
        }
      }
    },
    methods: {
      jumpToFace () {
        const url = '../face/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId
        wx.navigateTo({url})
      },
      switchChange () {
        this.state = !this.state
        let that = this
        this.$post('/storeCard/businessSetStorePrepaidCardState', {
          PrepaidCardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          State: this.state ? 1 : 0
        }, true).then(res => {
          that.$success('修改成功', true)
        })
      },
      validityChange (e) {
        this.validity = e.mp.detail.value
        if (this.validity[0] === 0 || (this.validity[0] === 1 && this.validity[1] === 0 && this.validity[2] === 0)) {
          this.newCard['ValidityDate'] = null
          this.store.ValidityDateTo = '永久有效'
          return
        }
        this.newCard['ValidityDate'] = (this.validity[0] - 1) * 365 + this.validity[1] * 30 + this.validity[2]
        this.store.ValidityDateTo = this.calcValidityDateTo(this.validity[0] * 365 + this.validity[1] * 30 + this.validity[2])
      },
      discountChange (e) {
        this.discount = e.mp.detail.value
      },
      changeValue (key, value) {
        this.newCard[key] = value
        if (key === 'CardName') {
          this.cardName = value
        }
      },
      radioChange (e) {
        this.rule.CardType = e.mp.detail.value
        this.cardType = e.mp.detail.value
      },
      swiperChange (e) {
        this.current = e.mp.detail.current
      },
      confirm (price, times, gift) {
        this.isError = false
        this.faceValue = {
          price: price,
          times: times,
          gift: gift
        }
        this.showTool = false
      },
      calcCardDiscount (discount) {
        if (this.cardType && discount && discount !== 10) {
          discount += ''
          if (discount.indexOf('.') === -1) {
            discount += '.0'
          }
          let discounts = (discount + '').split('.')
          this.discount = [10 - discounts[0] * 1, 0, 9 - discounts[1] * 1, 0]
        }
      },
      getCard () {
        let that = this
        this.$post('/storeCard/businessGetStorePrepaidCard', {
          PrepaidCardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          that.card = res
          that.state = res.State
          that.newCard = copy(that.card)
          that.cardName = res.CardName
          that.cardType = res.CardType
          that.calcValidityDate(res.ValidityDate)
          that.calcCardDiscount(res.CardDiscount)
          that.store.ValidityDateTo = that.calcValidityDateTo(res.ValidityDate)
          that.faceValue = {
            price: res.Price,
            times: res.CardValue,
            gift: res.CardGivingValue
          }
          that.img = res.CardImg
          that.firstLoad = false
        })
      },
      getCardSetting (callback) {
        let that = this
        this.$post('/storeCard/businessStorePrepaidCardSeting', {
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.rule = res
          if (callback) {
            callback()
          }
        })
      },
      calcValidityDate (validityDay) {
        if (validityDay === 0) {
          this.validity = [0, 0, 0]
        } else {
          this.validity[0] = 1 + Math.floor(validityDay / 365)
          this.validity[1] = Math.floor(validityDay % 365 / 30)
          this.validity[2] = validityDay % 365 % 30
        }
      },
      calcValidityDateTo (date) {
        if (date === 0) {
          return '永久'
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
      commit (e) {
        let childrens = this.$children
        let isError = false
        let that = this
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return false
        }
        if (this.faceValue === null) {
          this.isError = true
          return false
        }
        this.newCard.Uid = this.info.userId
        this.newCard.StoreId = this.info.storeId
        this.newCard.CardImg = this.img
        this.newCard.Price = this.faceValue.price
        this.newCard.CardValue = this.faceValue.times
        this.newCard.CardGivingValue = this.faceValue.gift
        this.newCard.CardName = e.mp.detail.value['CardName']
        this.newCard.CardDiscount = 10
        if (this.discount[0] !== 0) {
          this.newCard.CardDiscount = this.discountRange[0][this.discount[0]] + '.' + this.discountRange[2][this.discount[2]]
        }
        if (this.info.type === 'edit') {
          this.newCard.PrepaidCardId = this.info.cardId
          this.newCard.State = this.state ? 1 : 0
          this.$post('/storeCard/businessSetStorePrepaidCard', this.newCard, true).then(res => {
            that.$success('修改成功', true)
          })
        } else {
          this.newCard.CardType = this.cardType
          this.$post('/storeCard/businessAddStorePrepaidCard', this.newCard, true).then(res => {
            wx.showToast({
              title: '新建成功',
              mask: true
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
          })
        }
      },
      deleteCard () {
        this.deleting = false
        let that = this
        this.$post('/storeCard/businessDelStorePrepaidCard', {
          PrepaidCardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.$success('删除成功', true)
        })
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {Uid: this.info.userId, StoreId: this.info.storeId}).then(res => {
          that.store = res
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.card = undefined
      this.current = 0
      this.validity = [0, 0, 0]
      this.discount = [0, 0, 0, 0]
      this.firstLoad = true
      this.faceValue = null
      this.deleting = false
      this.cardName = '会员卡'
      this.newCard['CardName'] = '会员卡'
      this.isError = false
      this.cardType = 1
      this.state = null
      this.getStoreInfo()
      let that = this
      this.getCardSetting(function () {
        if (option.type === 'edit') {
          that.getCard()
        } else {
          that.firstLoad = false
          that.card = {
            CardName: '会员卡'
          }
          that.cardType = option.cardType
          that.img = that.rule.CardImages[0]
          that.newCard['ValidityDate'] = null
          that.store.ValidityDateTo = '永久有效'
        }
      })
    },
    onShow () {
      if (!this.firstLoad) {
        let globalData = this.getGlobalData()
        if (globalData.currentFaceIndex != null) {
          this.img = this.rule.CardImages[globalData.currentFaceIndex]
        }
      }
    },
    created () {
      let years = []
      for (var year = -1; year <= 6; year++) {
        years.push({
          name: year === -1 ? '永久有效' : year === 0 ? '' : year + '年',
          value: year
        })
      }
      this.validityRange.push(years)
      let months = []
      for (var month = 0; month <= 11; month++) {
        months.push({
          name: month === 0 ? '' : month + '月',
          value: month
        })
      }
      this.validityRange.push(months)
      let days = []
      for (var day = 0; day <= 29; day++) {
        days.push({
          name: day === 0 ? '' : day + '天',
          value: day
        })
      }
      this.validityRange.push(days)
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .card-create {
    width: 100vw;
    background-color: #f0f0f0;
    .create-context {
      background-color: white;
      position: relative;
    }
    .card-state {
      padding: 5vw;
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 75%;
          font-size: 4vw;
        }
        &:nth-child(2) {
          width: 25%;
          text-align: right;
        }
      }
    }
    .state-open {
      background: #ecf6ea;
      color: #78bc6d;
    }
    .state-close {
      background: #f6e3e3;
      color: #ff0000;
    }
    .card-panel {
      width: 100vw;
      height: 27vh;
      .card-demo {
        width: 80vw;
        margin: 0 auto;
        height: 25vh;
        border-radius: 10px;
      }
    }

    .info {
      width: 90vw;
      margin: 0 auto;
    }
    .store-right {
      img {
        display: inline-block;
        position: absolute;
        height: rpx(40);
        width: rpx(15);
        vertical-align: middle;
        top: rpx(170);
        right: 8vw;
      }
    }
    .create-card {
      width: 78vw;
      height: rpx(336);
      padding: rpx(20);
      box-shadow: 0 0 1vw 0 #7a7a7a;
      border-radius: 10px;
      background-color: #d5d5d5;
      margin: 0 auto;
      color: white;
      transform: scale(0.8, 0.8);
      .shadow {
        position: absolute;
        top: rpx(-2);
        left: rpx(-2);
        border: rpx(2) solid #cecece;
        background-color: #dbdbdb;
        width: 85vw;
        height: rpx(336);
        padding: rpx(20);
        border-radius: rpx(20);
        margin: 0 auto;
        opacity: 0.3;
      }

      .card-left {
        transform: rotate(7deg);
        position: absolute;
        left: 1vw;
      }

      .card-right {
        transform: rotate(-4deg);
        position: absolute;
        left: calc(15vw / 2 - 11px);
      }

      .card-hearder {
        height: 30%;
        line-height: 7vh;
      }

      .card-content {
        height: rpx(134);
        line-height: rpx(134);
        text-align: center;
        font-size: rpx(100);
        overflow: hidden;
        vertical-align: top;
        display: block;
        text {
          display: inline-block;
          vertical-align: top;
        }
      }

      .card-footer {
        height: 30%;
        padding-top: 1vh;
        padding-left: 1vw;
        line-height: 3vh;
        font-size: rpx(25);
        .footer-number {
          padding-top: rpx(4);
          text-shadow: 1px 1px 1px #7a7a7a;
          color: #dcc913;
          font-size: rpx(28);
        }
      }

      .header-logo {
        width: 6vh;
        height: 6vh;
        font-size: 0.5em;
        text-align: center;
        line-height: 5vh;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
        background-size: 100% 100%;
      }

      .header-name {
        height: 5vh;
        line-height: 5vh;
        display: inline-block;
        font-size: rpx(32);
        vertical-align: middle;
        margin-left: 3vw;
        width: 10vw;
        white-space: nowrap;
      }

      .header-code {
        height: 3vh;
        width: 3vh;
        display: inline-block;
        vertical-align: middle;
      }

    }
  }
</style>
