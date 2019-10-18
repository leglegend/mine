<template>
  <div class="add-card-page">
    <title :name="'添加会员卡'"></title>
    <scroll-view scroll-y="true" class="add-card-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="background-color: white;padding-bottom: 3vh">
          <div class="adjust-bg"
               :style="{'background':'url('+user.UserImg+'?x-oss-process=image/blur,r_40,s_15/resize,m_lfit,h_200,w_200)','background-size':'100%,100%'}">
          </div>
          <div class="context-top">
            <div></div>
          </div>
          <div style="position: relative;z-index: 2">
            <div class="info">
              <span class="logo"
                    v-bind:style="{background:'url('+user.UserImg+')','background-size':'100%,100%'}"></span>
              <div class="nick">
                {{user.RemarkName ? user.RemarkName : user.StoreUserName ? user.StoreUserName : user.UserName}}
              </div>
            </div>
            <div style="padding: 10vw 5vw;background-color: white;">
              <div class="create-card">
                <span>持有卡片<text style="color: red">*</text></span>
                <span
                  :style="{background:'url('+currentCard.CardImg+')','background-size':'100%,100%'}"
                  @click="jumpToFace"
                  v-if="currentCard!=null">
                  <span class="card-title"
                        :style="{'font-size':currentCard&&currentCard.CardName&&currentCard.CardName.length>5?currentCard.CardName.length<10?(75-currentCard.CardName.length*5+'rpx'):'28rpx':'','line-height':currentCard&&currentCard.CardName&&currentCard.CardName.length>10?'12vw':''}">
                    {{computedCardName}}
                  </span>
                </span>
                <span :style="{'font-size':'3vw',color:'#bfbfbf'}" @click="jumpToFace"
                      v-if="currentCard==null">选择持有会员卡</span>
                <span @click="jumpToFace">
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </div>

              <div v-if="type==1" style="font-size: 28rpx;">
                <inputBoxTwo :name="'余额'" :keyword="'CardValue'" :info="type?'元':'次'"></inputBoxTwo>
              </div>
              <div v-if="type==0">
                <div class="param" v-for="(item,index) in services">
                  <span class="title">
                    {{item.ItemName}}
                    <text style="color: red">*</text>
                  </span>
                  <span class="model">
                    <input v-model="item.CardValue" type="number" placeholder="请输入余额"
                           placeholder-style="color:#BABABA"/>
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
                    <input v-model="item.CardValue" type="number" placeholder="请输入余额"
                           placeholder-style="color:#BABABA"/>
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
                <button @click="isOverdue?showToast=true:doSave()" :class="isOverdue?'overdue-button':''">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
    </div>
    <div v-if="showAdd">
      <add @close="showAdd=false" @save="doAddService" :items="newServices" :gifts="newGifts" :type="'create'"></add>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import add from '@/components/addservice'
  import inputBoxTwo from '@/components/input2'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      title, add, inputBoxTwo, renewtoast
    },
    data () {
      return {
        user: {},
        currentCard: null,
        value: 0,
        type: null,
        validityDate: '',
        showAdd: false,
        services: [],
        newServices: [],
        gifts: [],
        newGifts: [],
        isFirstLoad: true,
        cardIds: [],
        showToast: false,
        titleHeight: ''
      }
    },
    computed: {
      computedCardName () {
        if (this.currentCard && this.currentCard.CardName) {
          if (this.currentCard.CardName.length > 10 && this.currentCard.CardName.length <= 20) {
            let middle = Math.ceil(this.currentCard.CardName.length / 2)
            return this.currentCard.CardName.substring(0, middle) + '\n' + this.currentCard.CardName.substring(middle, this.currentCard.CardName.length)
          } else {
            return this.currentCard.CardName
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
        wx.setStorageSync('cardIds', this.cardIds)
        console.log(this.cardIds)
        const url = '../face/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId
        wx.navigateTo({url})
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
      doSave () {
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
        if (this.currentCard === null) {
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
        this.$post('/card/businessAddUserCard', {
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          ValidityDate: this.validityDate,
          CardValue: values['CardValue'] ? values['CardValue'] : 10,
          PrepaidCardId: this.currentCard.PrepaidCardId,
          OperationServicesModel: services
        }, true).then(res => {
          that.$success('添加成功', true)
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.value = ''
      this.validityDate = ''
      this.type = null
      this.showAdd = false
      this.isFirstLoad = true
      this.currentCard = null
      this.services = []
      this.gifts = []
      this.cardIds = []
      this.showToast = false
      let info = wx.getStorageSync('addCardInfo')
      this.user = info.user
      this.cardIds = info.cardIds
      wx.removeStorageSync('addCardInfo')
    },
    onShow () {
      if (this.isFirstLoad) {
        this.isFirstLoad = false
        return
      }
      let currentCard = wx.getStorageSync('cardFace')
      if (currentCard) {
        this.currentCard = currentCard
        this.type = currentCard.CardType
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
    },
    created () {
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .add-card-page {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .add-card-scroll {
      width: 100vw;
      height: 90vh;
      .adjust-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vw;
        z-index: 0;
      }
      .context-top {
        width: 100vw;
        left: 0;
        height: 100vw;
        overflow: hidden;
        position: absolute;
        top: 16vw;
        z-index: 1;
        div {
          position: relative;
          width: 300vw;
          height: 300vw;
          background: white;
          left: -100vw;
          border-radius: 50%;
          border: 1vw solid white;
          box-sizing: border-box;
        }
      }
      .info {
        padding-top: 6.5vw;
        text-align: center;
        .logo {
          height: 17vw;
          width: 17vw;
          border-radius: 50%;
          display: inline-block;
        }
        .nick {
          font-size: 4.3vw;
          font-weight: 600;
          height: 4.3vw;
          line-height: 4.3vw;
          padding-top: 1.3vw;
        }
      }
      .create-card {
        height: 24vw;
        line-height: 24vw;
        padding-bottom: 3vh;
        vertical-align: top;
        font-size: rpx(28);
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
        font-size: rpx(28);
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
  }
</style>
