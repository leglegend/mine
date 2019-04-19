<template>
  <div class="create">
    <title :name="'新增会员'"></title>
    <scroll-view class="create-scroll" scroll-y="true" v-if="cards.length>0"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div v-if="!firstLoad" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 2vh"></div>
        <div class="create-logo">
          <img src="/static/createlogo.png"/>
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
                <img src="/static/right2.png"/>
              </span>
            </div>

            <!--<inputBoxTwo :name="'充值金额'" :keyword="'SumValue'" :info="'元'"></inputBoxTwo>
            <inputBoxTwo :name="'购买'+(type?'金额':'次数')" :keyword="'SumOtherValue'" :info="type?'元':'次'"></inputBoxTwo>-->
            <inputBoxTwo :name="'余额'" :keyword="'CardValue'" :info="type?'元':'次'"></inputBoxTwo>
            <div class="param">
              <span class="title">有效期至</span>
              <span>
              <picker class="picker" @change="changeValidityDate" mode="date" :value="validityDate">
                <view class="model"
                      :style="{color:validityDate==''?'#7e7e7e':''}">{{validityDate == '' ? '请选择' : validityDate}}</view>
              </picker>
            </span>
            </div>
            <div class="commit">
              <button @click="createMember">保存</button>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="nocards" v-if="firstLoad==false&&cards.length==0">
      没有会员卡哦 =_="
    </div>
    <div v-if="showHelp==true">
      <help @confirm="confirm"></help>
    </div>
  </div>
</template>

<script>
  import inputBox from '@/components/input'
  import inputBoxTwo from '@/components/input2'
  import title from '@/components/title'
  import help from '@/components/createhelp'

  export default {
    components: {
      inputBox, title, inputBoxTwo, help
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
        firstLoad: true,
        showHelp: false
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
      }
    },
    methods: {
      confirm () {
        this.showHelp = false
        wx.navigateBack({
          delta: 1
        })
      },
      jumpToFace () {
        const url = '../face/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId
        wx.navigateTo({url})
      },
      changeValue (key, value) {
        for (var i in this.userInfos) {
          if (this.userInfos[i].ControlName === key) {
            this.userInfos[i].ControlValue = value
          }
        }
        if (key === 'phone') {
          this.phone = value
        }
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
            title: '清选择持有卡片',
            image: '/static/warn.png'
          })
          isError = true
        }
        if (isError) {
          return false
        }
        console.log(values)
        this.$post('/user/businessAddStoreUser', {
          UserMobile: this.phone,
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          UserInfos: this.userInfos,
          ValidityDate: this.validityDate,
          CardValue: values['CardValue'],
          PrepaidCardId: this.currentFace.PrepaidCardId
        }, true).then(res => {
          if (wx.getStorageSync('createhelp') === true) {
            that.$success('创建成功', true)
          } else {
            that.showHelp = true
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
      this.type = 0
      let that = this
      this.getCardSetting(function () {
        that.getCustomControls()
      })
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (!this.firstLoad) {
        let globalData = this.getGlobalData()
        if (globalData.currentFaceIndex != null) {
          this.currentFace = this.cards[globalData.currentFaceIndex]
          this.type = this.currentFace.CardType
        }
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
