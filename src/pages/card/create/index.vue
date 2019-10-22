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
        <div class="demo-context create-context" v-if="firstLoad==false">
          <div @click="jumpToFace">
            <div class="create-card">
              <card :card="newCard" :name="cardName" @showMore="showMore=true"></card>
            </div>
            <div class="store-right">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </div>
          </div>

          <form @submit="commit">
            <div v-if="card!=undefined" class="info">
              <custom :name="'CardName'"
                      :title="'卡囧名'"
                      :request="true"
                      :type="'input'"
                      :value="card.CardName"
                      @changeName="changeValue"></custom>

              <div class="demo-input" @click="showTool=true" v-if="cardType==1"
                   :style="{'border-bottom':isError?'1rpx solid red':'1rpx solid #bbbbbb'}">
                <span class="name">面值<span class="request">*</span></span>
                <span class="value" :style="{color:faceValue == null?'#dadada':'#7e7e7e'}">
                  {{faceValue == null ? '请输入' : faceValue.price + '元/' + faceValue.times + (cardType == 0 ? '次' : '元')}}
                  <span style="display: inline-block;color: red;padding-left: 5vw"
                        v-if="faceValue!=null&&faceValue.gift!=''">额外赠{{faceValue.gift + (cardType == 0 ? '次' : '元')}}</span>
                </span>
              </div>

              <div v-if="cardType==0">
                <record :keyword="'Price'"
                        :name="'售囧价'"
                        :request="true"
                        :context="'digit'"
                        :type="'input'"
                        :value="card.Price"></record>
              </div>

              <div class="demo-input" @click="showAddModel" v-if="cardType==0"
                   :style="{'border-bottom':isError?'1rpx solid red':'1rpx solid #bbbbbb'}">
                <span class="name"><text>项<text style="visibility: hidden;">囧</text>目</text><span
                  class="request">*</span></span>
                <span class="value"
                      style="white-space: nowrap;overflow: hidden;"
                      :style="{color:services.length==0 ?'#dadada':'#7e7e7e'}">
                  {{services.length == 0 ? '请输入' : ''}}
                  <span style="display: inline-block;vertical-align: top;height: 7vh;line-height: 7vh"
                        v-for="(item,index) in services">
                    {{item.ItemName + item.CardValue + '次' + (index == services.length - 1 ? '' : '、')}}
                  </span>
                  <span class="gift-box" v-for="(item,index) in gifts">
                    {{'赠' + item.ItemName + item.CardValue + '次'}}
                  </span>
                  <span style="display: inline-block;color: red;padding-left: 5vw"
                        v-if="faceValue!=null&&faceValue.gift!=''">额外赠{{faceValue.gift + (cardType == 0 ? '次' : '元')}}</span>
                </span>
              </div>

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
                <button class="cancel" v-show="info.type=='edit'"
                        @click="isOverdue?showToast=true:deleting = true" :class="isOverdue?'overdue-button2':''">删除此卡
                </button>
                <button class="done" formType="submit" :class="isOverdue?'overdue-button':''">保存</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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
    <div v-if="showAdd">
      <add @close="showAdd=false" @save="doAddService" :items="newServices" :gifts="newGifts" :type="'create'"></add>
    </div>
    <div v-if="showMore">
      <more :services="services" @close="showMore=false"></more>
    </div>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
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
  import card from '@/components/card'
  import add from '@/components/addservice'
  import more from '@/components/services'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      record, title, createcardtool, confirm, custom, card, add, more, renewtoast
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
        state: null,
        changeData: 0,
        services: [],
        newServices: [{}],
        gifts: [],
        newGifts: [],
        showAdd: false,
        showToast: false,
        showMore: false
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
      },
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
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
          this.newCard['ValidityDateTo'] = '永久有效'
          this.newCard['ValidityDateTime'] = '永久有效'
          return
        }
        this.newCard['ValidityDate'] = (this.validity[0] - 1) * 365 + this.validity[1] * 30 + this.validity[2]
        this.store.ValidityDateTo = this.calcValidityDateTo(this.validity[0] * 365 + this.validity[1] * 30 + this.validity[2])
        this.newCard['ValidityDateTo'] = this.store.ValidityDateTo
        this.newCard['ValidityDateTime'] = this.calcValidityDateTime((this.validity[0] - 1) * 365 + this.validity[1] * 30 + this.validity[2])
        this.changeData += 1
      },
      discountChange (e) {
        this.discount = e.mp.detail.value
        if (this.discount[0] !== 0) {
          this.newCard.CardDiscount = (this.discountRange[0][this.discount[0]] + '.' + this.discountRange[2][this.discount[2]]) * 1
        } else {
          this.newCard.CardDiscount = 10
        }
        this.changeData += 1
      },
      changeValue (key, value) {
        this.newCard[key] = value
        if (key === 'CardName') {
          this.cardName = value
          this.newCard.CardName = value
        }
        this.changeData += 1
      },
      confirm (price, times, gift) {
        this.isError = false
        this.faceValue = {
          price: price,
          times: times,
          gift: gift
        }
        this.showTool = false
        this.newCard.CardPrice = times
        this.newCard.CardGivingValue = gift
        this.changeData += 1
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
      doAddService (items, gifts) {
        console.log(items)
        console.log(gifts)
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
        this.isError = false
        this.showAdd = false
        this.newCard.Services = services
        this.changeData += 1
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
          that.newCard.StoreName = that.store.StoreName
          that.newCard.StoreLogo = that.store.StoreLogo
          that.cardName = res.CardName
          that.cardType = res.CardType
          that.calcValidityDate(res.ValidityDate)
          that.newCard.ValidityDateTime = that.calcValidityDateTime(res.ValidityDate)
          that.calcCardDiscount(res.CardDiscount)
          that.store.ValidityDateTo = that.calcValidityDateTo(res.ValidityDate)
          that.newCard.ValidityDateTo = that.calcValidityDateTo(res.ValidityDate)
          if (res.CardType) {
            that.faceValue = {
              price: res.Price,
              times: res.CardValue,
              gift: res.CardGivingValue
            }
          } else {
            for (let item of res.Services) {
              if (item.IsGift) {
                that.gifts.push(item)
              } else {
                that.services.push(item)
              }
            }
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
      calcValidityDateTime (validityDay) {
        if (validityDay === 0) {
          return '永久有效'
        }
        let year = Math.floor(validityDay / 365)
        let month = Math.floor(validityDay % 365 / 30)
        let day = validityDay % 365 % 30
        return (year === 0 ? '' : year + '年') + (month === 0 ? '' : month + '月') + (day === 0 ? '' : day + '天')
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
        if (this.$store.getters.GET_ISOVERDUE) {
          this.showToast = true
          return
        }
        let childrens = this.$children
        let isError = false
        let that = this
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        console.log(this.cardType)
        console.log(this.services)
        if (this.cardType * 1 === 1 && this.faceValue === null) {
          this.isError = true
          return false
        }
        if (this.cardType * 1 === 0 && this.services.length === 0) {
          this.isError = true
          return false
        }
        if (isError) {
          return false
        }
        this.newCard.Uid = this.info.userId
        this.newCard.StoreId = this.info.storeId
        this.newCard.CardImg = this.img
        if (this.cardType * 1 === 1) {
          this.newCard.Price = this.faceValue.price
          this.newCard.CardValue = this.faceValue.times
          this.newCard.CardGivingValue = this.faceValue.gift
        } else {
          let services = []
          for (let item of this.services) {
            services.push(item)
          }
          for (let item of this.gifts) {
            services.push(item)
          }
          this.newCard.Services = services
          this.newCard.CardValue = 10
          this.newCard.Price = e.mp.detail.value['Price']
        }
        this.newCard.CardName = e.mp.detail.value['CardName']
        this.newCard.CardDiscount = 10
        if (this.discount[0] !== 0) {
          this.newCard.CardDiscount = this.discountRange[0][this.discount[0]] + '.' + this.discountRange[2][this.discount[2]]
        }
        this.newCard.StoreName = null
        this.newCard.StoreLogo = null
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
          that.newCard['StoreName'] = res.StoreName
          that.newCard['StoreLogo'] = res.StoreLogo
          that.changeData += 1
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
      this.newCard = {}
      this.cardName = '会员卡'
      this.newCard['CardName'] = '会员卡'
      this.isError = false
      this.cardType = 1
      this.state = null
      this.services = []
      this.gifts = []
      this.showAdd = false
      this.showMore = false
      this.showToast = false
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
          that.newCard.CardType = option.cardType * 1
          that.img = that.rule.CardImages[0]
          that.newCard['ValidityDate'] = null
          that.newCard['ValidityDateTo'] = '永久有效'
          that.newCard['CardImg'] = that.rule.CardImages[0]
          that.store.ValidityDateTo = '永久有效'
        }
      })
    },
    onShow () {
      if (!this.firstLoad) {
        let globalData = this.getGlobalData()
        if (globalData.currentFaceIndex != null) {
          this.img = this.rule.CardImages[globalData.currentFaceIndex]
          this.newCard['CardImg'] = this.rule.CardImages[globalData.currentFaceIndex]
          this.changeData += 1
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
      padding-top: 5vw;
      position: relative;
      .gift-box {
        height: 4.3vw;
        line-height: 4.3vw;
        vertical-align: middle;
        padding: 0 2vw;
        height: 4.3vw;
        background: rgba(255, 103, 0, 0.1);
        border-radius: 2.1vw;
        margin-left: 1vw;
        color: #FF6700;
        font-size: 2.8vw;
        text-align: center;
      }
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
      width: 66.2vw;
      height: 39.52vw;
      margin: 0 auto;
      color: white;
      position: relative;
      .new-card-demo {
        left: 0;
        top: 0;
        transform: scale(0.8, 0.8);
        transform-origin: 0% 0%;
      }
    }
  }
</style>
