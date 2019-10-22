<template>
  <div class="adjust">
    <title :name="'调整余额'"></title>
    <scroll-view scroll-y="true" class="adjust-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="background-color: white;padding-bottom: 3vh">
          <!--<div class="adjust-bg"
               :style="{'background':'url('+user.UserImg+'?x-oss-process=image/blur,r_40,s_15/resize,m_lfit,h_200,w_200)','background-size':'100%,100%'}">
          </div>-->
          <!--<div class="context-top">
            <div></div>
          </div>-->
          <div style="position: relative;z-index: 2">
            <div class="info">
              <span class="logo"
                    v-bind:style="{background:'url('+user.UserImg+')','background-size':'100%,100%'}"></span>
              <div class="nick">
                {{user.RemarkName ? user.RemarkName : user.UserStoreName ? user.UserStoreName : user.UserName}}
              </div>
            </div>
            <div style="background: white">
              <div class="adjust-card">
                <card :card="currentCard" @showMore="showMore=true"></card>
              </div>
              <div class="balance-form" v-if="currentCard.CardType">
                <span>当前余额</span>
                <span><text>￥</text>{{currentCard.CardPrice}}</span>
                <span @click="first=first*-1">
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-add.png"
                       v-if="first==1">
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-sub.png"
                       v-if="first==-1">
                </span>
                <span :style="{color:first>0?'#FE0000':'#6AB35E'}">
                  <input v-model="value" type="digit"/>
                  <text>元</text>
                </span>
              </div>
              <div class="times-form" v-if="!currentCard.CardType">
                <div class="times-item" v-for="(item,index) in services">
                  <span>{{item.ItemName}}</span>
                  <span>{{item.CardValue}}次</span>
                  <span @click="changeType(index)">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-sub.png"
                         v-if="item.type<0"/>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-add.png"
                         v-if="item.type>0"/>
                  </span>
                  <span :style="{color:item.type>0?'#FE0000':'#6AB35E'}">
                    <input v-model="item.value" type="number"/>
                    <text>次</text>
                  </span>
                  <span @click="doAdd(index)">加</span>
                  <span @click="doSub(index)">减</span>
                  <span @click="subItem(index)" v-if="services.length>1">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/deletevalue.png"/>
                  </span>
                </div>
                <div class="times-add" @click="showAddModel">
                  <span>+</span>
                  <span>添加服务项</span>
                </div>
              </div>
              <div class="operat">
                <div class="param">
                  <span class="title">有效期至</span>
                  <span>
                    <span style="display: inline-block;width: 35vw">
                      <picker class="picker" @change.stop="changeValidityDate" mode="date" :value="validityDate"
                              :disabled="isForever">
                        <view class="model"
                              :style="{color:changed?'red':'',background:isForever?'#f0f0f0':''}">{{isForever ? '永久' : validityDate}}</view>
                      </picker>
                    </span>
                  </span>
                  <div class="checkbox">
                    <checkbox-group @change.stop="changeDate">
                      <checkbox :checked="isForever" value="forever">永久有效</checkbox>
                    </checkbox-group>
                  </div>
                </div>
                <div class="commit">
                  <span @click="isOverdue?showToast=true:showConfirm = true" v-if="cardNumber>1"
                        :class="isOverdue?'overdue-button2':''">删除此卡</span>
                  <span v-if="cardNumber<=1" style="visibility: hidden"></span>
                  <span @click="isOverdue?showToast=true:commit()" :class="isOverdue?'overdue-button':''">保存</span>
                </div>
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
    <div v-if="showAdd">
      <add :items="newServices" @close="showAdd = false" @save="addItem"></add>
    </div>
    <div v-if="showConfirm">
      <confirm :title="'确认删除此卡?'" @cancel="showConfirm=false" @confirm="doDelete"></confirm>
    </div>
    <div v-if="showMore">
      <more :services="currentCard.Services" @close="showMore=false"></more>
    </div>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import card from '@/components/card'
  import add from '@/components/addservice'
  import confirm from '@/components/confirm'
  import more from '@/components/services'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      title, card, add, confirm, more, renewtoast
    },
    data () {
      return {
        user: {},
        card: {},
        currentCard: {},
        services: [],
        newServices: [],
        validityDate: '',
        value: 0,
        first: -1,
        tag: null,
        changed: false,
        isForever: false,
        changeData: 0,
        showAdd: false,
        showConfirm: false,
        showMore: false,
        showToast: false,
        cardNumber: 1,
        titleHeight: ''
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      }
    },
    methods: {
      changeType (index) {
        this.services[index].type = this.services[index].type * -1
        this.changeData += 1
      },
      showAddModel () {
        let items = []
        for (let item of this.services) {
          items.push({
            ItemId: item.ItemId,
            ItemName: item.ItemName,
            CardValue: item.CardValue,
            type: item.type,
            value: item.value
          })
        }
        items.push({})
        this.newServices = items
        this.showAdd = true
      },
      doAdd (index) {
        let value = this.services[index].value
        if (value === '' || value === null || value === undefined) {
          value = 0
        }
        if (value === 0) {
          this.services[index].type = 1
        }
        value = value * 1 * this.services[index].type + 1
        this.services[index].value = Math.abs(value)
        this.changeData += 1
      },
      doSub (index) {
        let value = this.services[index].value
        if (value === '' || value === null || value === undefined) {
          value = 0
        }
        if (value === 0) {
          this.services[index].type = -1
        }
        value = value * 1 * this.services[index].type - 1
        this.services[index].value = Math.abs(value)
        this.changeData += 1
      },
      addItem (items) {
        let cards = []
        for (let item of items) {
          item.CardValue = item.CardValue * 1
          if (!item.type) {
            item.type = -1
          }
          cards.push(item)
        }
        this.services = cards
        this.showAdd = false
      },
      subItem (index) {
        let items = []
        for (let i = 0; i < this.services.length; i++) {
          if (i !== index) {
            items.push(this.services[i])
          }
        }
        this.services = items
      },
      getUserCardBalance () {
        let that = this
        if (this.info.memberId) {
          this.$post('/card/businessGetUserCardBalance', {
            UserId: this.info.memberId,
            CardId: this.info.cardId,
            Uid: this.info.userId,
            StoreId: this.info.storeId,
            ChildCardId: this.info.childCardId
          }).then(res => {
            that.user = res
            that.card = res.Card
            that.validityDate = res.Card.ValidityDate
            if (that.validityDate !== '永久有效' && that.validityDate !== '永久') {
              that.validityDate = that.validityDate.replace('年', '-').replace('月', '-').replace('日', '')
              that.isForever = false
            } else {
              that.isForever = true
            }
            for (let item of res.StoreUserInfo) {
              if (item.ControlName === 'user_store_name') {
                that.user.UserName = item.ControlValue
              }
            }
            if (that.user.CardType === 0) {
              that.first = 1
            }
          })
        } else {
          setTimeout(function () {
            that.getUserCardBalance()
          }, 500)
        }
      },
      changeValidityDate (e) {
        this.validityDate = e.mp.detail.value
        this.changed = true
      },
      changeDate (e) {
        this.isForever = !this.isForever
      },
      radioChange (e) {
        this.tag = e.mp.detail.value
      },
      commit () {
        let params = {}
        if (this.currentCard.CardType) {
          params = {
            UserId: this.info.memberId,
            CardId: this.info.childCardId,
            Uid: this.info.userId,
            StoreId: this.info.storeId,
            PayModel: 1,
            ConsumptionTag: this.value * this.first >= 0 ? 4 : 2,
            ConsumptionType: this.currentCard.CardType,
            ConsumptionValue: Math.abs(this.value * this.first),
            ValidityDate: this.isForever ? '' : this.validityDate
          }
        } else {
          let items = []
          for (let item of this.services) {
            if (item.ItemId) {
              items.push({
                ItemId: item.ItemId,
                ItemName: item.ItemName,
                OperationValue: item.value * item.type
              })
            } else {
              items.push({
                ItemName: item.ItemName,
                OperationValue: item.CardValue * 1 + (item.value ? (item.value * item.type) : 0)
              })
            }
          }
          for (let old of this.olds) {
            for (let item of items) {
              if (old.ItemName === item.ItemName && !item.ItemId) {
                console.log(item)
                console.log(old)
                item.ItemId = old.ItemId
                item.OperationValue = item.OperationValue - old.CardValue
              }
            }
          }
          params = {
            UserId: this.info.memberId,
            CardId: this.info.childCardId,
            Uid: this.info.userId,
            StoreId: this.info.storeId,
            ConsumptionType: this.currentCard.CardType,
            OperationServicesModel: items,
            ValidityDate: this.isForever ? '' : this.validityDate
          }
        }
        this.$post('/consumption/businessOperationUserConsumption', params, true).then(res => {
          wx.showToast({
            icon: 'success',
            mask: true,
            title: '修改成功'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        })
      },
      doDelete () {
        this.$post('/card/businessCancelUserCardChild', {
          CardChildId: this.info.childCardId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          wx.showToast({
            icon: 'success',
            mask: true,
            title: '删除成功'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.cardNumber = option.number * 1
      this.value = ''
      this.tag = null
      this.first = -1
      this.changed = false
      this.showAdd = false
      this.showConfirm = false
      this.showMore = false
      this.showToast = false
      this.olds = []
      let currentCard = wx.getStorageSync('adjustCard')
      console.log(currentCard)
      if (currentCard) {
        this.currentCard = currentCard
        wx.removeStorageSync('adjustCard')
        if (this.currentCard.CardType === 0) {
          this.services = this.currentCard.Services
          this.olds = []
          for (let item of this.services) {
            item.type = -1
            this.olds.push({
              ItemId: item.ItemId,
              ItemName: item.ItemName,
              CardValue: item.CardValue
            })
          }
        }
      }
      this.getUserCardBalance()
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

  .adjust {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .adjust-scroll {
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
      .adjust-card {
        width: 82.7vw;
        height: 49.4vw;
        margin: 0 auto;
        position: relative;
        padding-top: 6.9vw;
        padding-bottom: 10vw;
      }
      .balance-form {
        padding: 0 0 6vw 6.7vw;
        height: 8.9vw;
        line-height: 8.9vw;
        span {
          display: inline-block;
          vertical-align: top;
          box-sizing: border-box;
          height: 8.9vw;
          line-height: 8.9vw;
          &:nth-child(1) {
            color: #181818;
            font-size: 3.7vw;
          }
          &:nth-child(2) {
            color: #7E7E7E;
            font-size: 4.3vw;
            padding: 0 3.5vw;
            text {
              font-size: 3.2vw;
            }
          }
          &:nth-child(3) {
            color: #7E7E7E;
            font-size: 4.3vw;
            padding: 1.3vw 3vw 0 0;
            img {
              display: inline-block;
              vertical-align: top;
              width: 6.1vw;
              height: 6.1vw;
            }
          }
          &:nth-child(4) {
            width: 29.7vw;
            background: rgba(240, 240, 240, 1);
            border-radius: 0.9vw;
            font-size: 5.6vw;
            padding-left: 3.1vw;
            text {
              display: inline-block;
              color: #BABABA;
              height: 8.9vw;
              line-height: 8.9vw;
              vertical-align: top;
            }
          }
          input {
            height: 8.9vw;
            line-height: 8.9vw;
            font-size: 5.6vw;
            width: 19vw;
            display: inline-block;
          }
        }
      }
      .times-form {
        padding: 0 0 5.6vw 5.6vw;
        .times-item {
          height: 7vw;
          line-height: 7vw;
          padding-bottom: 4.4vw;
          span {
            display: inline-block;
            vertical-align: top;
            height: 7vw;
            line-height: 7vw;
            box-sizing: border-box;
            &:nth-child(1) {
              min-width: 13.9vw;
              max-width: 18vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #181818;
              font-size: 3.5vw;
              text-align: center;
            }
            &:nth-child(2) {
              width: 14.2vw;
              text-align: center;
              color: #7E7E7E;
              font-size: 4.1vw;
            }
            &:nth-child(3) {
              padding-top: 1.2vw;
              width: 8.4vw;
              img {
                width: 5vw;
                height: 4.4vw;
                display: inline-block;
                vertical-align: top;
              }
            }
            &:nth-child(4) {
              width: 17.4vw;
              height: 6.7vw;
              line-height: 6.7vw;
              padding-left: 2.5vw;
              background: #F0F0F0;
              border-radius: 0.9vw;
              input {
                display: inline-block;
                height: 6.7vw;
                line-height: 6.7vw;
                font-size: 4.4vw;
                width: 8.8vw;
                vertical-align: top;
              }
              text {
                display: inline-block;
                height: 6.7vw;
                line-height: 6.7vw;
                font-size: 3.5vw;
                color: #BABABA;
                vertical-align: top;
              }
            }
            &:nth-child(5) {
              margin-left: 10vw;
              width: 7vw;
              background: #FFF3EB;
              border-radius: 0.9vw;
              text-align: center;
              color: #FE0000;
              font-size: 3.1vw;
            }
            &:nth-child(6) {
              margin-left: 2.6vw;
              width: 7vw;
              background: #ECF6EA;
              border-radius: 0.9vw;
              text-align: center;
              color: #6AB35E;
              font-size: 3.1vw;
            }
            &:nth-child(7) {
              margin-left: 6.3vw;
              width: 7vw;
              padding-top: 0.7vw;
              padding-right: 2vw;
              img {
                display: inline-block;
                vertical-align: top;
                width: 4.4vw;
                height: 4.4vw;
              }
            }
          }
        }
        .times-add {
          padding-top: 0.8vw;
          height: 4.4vw;
          line-height: 4.4vw;
          box-sizing: border-box;
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
      }
      .operat {
        font-size: 3.7vw;
        padding-left: 6.7vw;
        .param {
          height: 7.6vh;
          .title {
            color: #181818;
            height: rpx(50);
            line-height: rpx(50);
            width: 18vw;
            display: inline-block;
            vertical-align: top;
          }
          .value {
            display: inline-block;
            height: rpx(50);
            line-height: rpx(50);
            span {
              display: inline-block;
              width: 19vw;
              margin-right: 4vw;
              height: rpx(50);
              line-height: rpx(50);
              border: rpx(1) solid #bbbbbb;
              text-align: center;
              border-radius: rpx(25);
              color: #7e7e7e;
              background-color: white;
            }
            .selected {
              border: rpx(1) solid #ff6700;
              color: #ff6700;
              background-color: #fff3eb;
            }
          }
          .calc {
            display: inline-block;
            .calc-num {
              font-size: rpx(45);
              display: inline-block;
              height: rpx(60);
              line-height: rpx(60);
              width: 35vw;
              text-align: left;
              border: rpx(1) solid #f0f0f0;
              background-color: #f0f0f0;
              border-radius: rpx(5);
              margin-right: 5vw;
              vertical-align: middle;
              color: #7e7e7e;
              .calc-left {
                display: inline-block;
                height: rpx(60);
                line-height: rpx(60);
                width: 26vw;
                padding-left: 2vw;
              }
              .num-title {
                text-align: left;
                display: inline-block;
                position: relative;
                top: -0.3vw;
              }
              .num-times {
                width: 5vw;
                vertical-align: top;
                color: #828282;
              }
              input {
                width: 20vw;
                height: rpx(60);
                vertical-align: top;
                line-height: rpx(60);
                display: inline-block;
              }
            }
            .calc-add {
              display: inline-block;
              color: red;
              background-color: #fff3eb;
              display: inline-block;
              height: rpx(60);
              line-height: rpx(60);
              width: 9vw;
              text-align: center;
              border-radius: rpx(5);
              margin-right: 2vw;
              vertical-align: middle;
            }
            .calc-add:active {
              background-color: #d7cbc3;
            }
            .calc-sub {
              display: inline-block;
              color: #77bb6b;
              background-color: #ecf6ea;
              display: inline-block;
              height: rpx(60);
              line-height: rpx(60);
              width: 9vw;
              text-align: center;
              border-radius: rpx(5);
              margin-right: 2vw;
              vertical-align: middle;
            }
            .calc-sub:active {
              background-color: #65a458;
            }
          }
          .picker {
            display: inline-block;
            height: rpx(52);
          }
          .model {
            display: inline-block;
            width: 35vw;
            height: rpx(50);
            line-height: rpx(50);
            border: 1px solid #bbbbbb;
            text-align: center;
            border-radius: rpx(25);
            color: #7e7e7e;
          }
          &:nth-child(3) {
            height: 9.7vh;
          }
          .checkbox {
            display: inline-block;
            padding-left: 3vw;
            color: #bbbbbb;
          }
        }
        .commit {
          padding: 2vw 5vw 8vw 0vw;
          text-align: right;
          span:nth-child(1) {
            display: inline-block;
            height: rpx(80);
            line-height: rpx(78);
            text-align: center;
            background-color: white;
            border-radius: rpx(40);
            font-size: rpx(35);
            color: #ff6700;
            width: 28vw;
            box-sizing: border-box;
            border: rpx(1) solid #ff6700;
          }
          span:nth-child(2) {
            margin-left: 3vw;
            display: inline-block;
            height: rpx(80);
            line-height: rpx(80);
            text-align: center;
            background-color: #ff6700;
            border-radius: rpx(40);
            font-size: rpx(35);
            color: white;
            width: 28vw;
          }
        }
      }
    }
  }
</style>
