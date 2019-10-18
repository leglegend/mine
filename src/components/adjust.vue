<template>
  <div class="adjust-model" @click="doClose" :animation="modelAnimation">
    <div class="adjust-context" :animation="contextAnimation" @click.stop="">
      <div class="context-top">
        <div></div>
      </div>
      <div class="context-middle">
        <div class="context-logo">
          <img @click="jumpToDetails(member)" :src="member.UserImg"/>
        </div>
        <div class="member-name">
          {{member.RemarkName ? member.RemarkName : member.UserStoreName ? member.UserStoreName : member.UserName}}
          <span @click="doClose">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png">
          </span>
        </div>
        <div class="edit-card" @click="jumpToAdjust">
          更多操作
          <span>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right3.png">
          </span>
        </div>
        <scroll-view scroll-y="true" class="context-cards" :scroll-top="scrollTop">
          <div class="adjust-cards">
            <div style="height: 3vw" v-if="cards.length==1"></div>
            <div class="item-card" v-for="(item,index) in cards" @click="chooseCard(item)"
                 :style="{top:2 +index+'vw'}">
              <card :card="item" @showMore="showMore=true"></card>
            </div>
            <div class="balance-form" v-if="currentCard.CardType">
              <div class="balance-switch" v-if="currentCard.CardDiscount<10" @click="original=!original">
                <span :style="{background:original?'#ffffff':''}">原价</span>
                <span :style="{background:!original?'#ffffff':''}">应付</span>
              </div>
              <div class="balance-input">
                <span>当前余额</span>
                <span><text>￥</text>{{currentCard.CardPrice}}</span>
                <span @click="type=type*-1">
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-add.png"
                       v-if="type==1">
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/adjust-sub.png"
                       v-if="type==-1">
                </span>
                <span :style="{color:type>0?'#FE0000':'#6AB35E'}">
                  <input v-model="value" type="digit"/>
                  <text>元</text>
                </span>
              </div>
              <div class="balance-pay" :style="{visibility:original?'':'hidden'}"
                   v-if="currentCard.CardDiscount<10&&type==-1">
                <div>
                  <span>商家折扣<text v-if="original">（{{currentCard.CardDiscount * 1000 / 1000}}折）</text></span>
                  <span
                    v-if="original">{{value ? '-' + (10 * 1000 - currentCard.CardDiscount * 1000) * value / 10000 : ''}}</span>
                  <span v-if="!original" style="color: black;">{{currentCard.CardDiscount * 1000 / 1000}}折（已享受）</span>
                </div>
                <div>
                  <span>会员卡内应付</span>
                  <span v-if="original"
                        style="font-size: 5vw">{{value ? currentCard.CardDiscount * 1000 / 10000 * value : ''}}</span>
                </div>
              </div>
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
              </div>
              <div class="times-add" @click="showAddModel">
                <span>+</span>
                <span>添加服务项</span>
              </div>
            </div>
            <div class="save-button">
              <span @click="isOverdue?showToast=true:doSave()" :class="isOverdue?'overdue-button':''">保存</span>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
    </div>
    <div v-if="showAdd">
      <add :items="newServices" :oldItems="services" @close="showAdd = false" @save="addItem"></add>
    </div>
    <div v-if="showMore">
      <more :services="currentCard.Services" @close="showMore=false"></more>
    </div>
  </div>
</template>

<script>
  import card from '@/components/card'
  import add from '@/components/addservice'
  import more from '@/components/services'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      card, add, more, renewtoast
    },
    data () {
      return {
        member: {},
        cards: [],
        services: [],
        newServices: [{}],
        currentCard: {},
        type: -1,
        value: '',
        scrollTop: 10000,
        changeData: 0,
        showAdd: false,
        showMore: false,
        showToast: false,
        modelAnimation: {},
        original: 1,
        contextAnimation: {}
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      }
    },
    methods: {
      jumpToDetails (item) {
        const url = '../persion/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + item.UserId + '&cardId=' + item.CardId
        wx.navigateTo({url})
      },
      jumpToAdjust () {
        wx.setStorageSync('adjustCard', this.currentCard)
        const url = '../adjust/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + this.member.UserId + '&cardId=' + this.member.CardId + '&childCardId=' + this.currentCard.Id + '&number=' + this.cards.length
        wx.navigateTo({url})
      },
      doClose () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('-180vw').step({duration: 200})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('close')
        }.bind(this), 250)
      },
      showAddModel () {
        let items = []
        for (let item of this.services) {
          if (item.isNew) {
            items.push({
              ItemName: item.ItemName,
              CardValue: item.CardValue,
              type: item.type,
              value: item.value
            })
          }
        }
        if (items.length > 0) {
          this.newServices = items
          this.newServices.push({})
        } else {
          this.newServices = [{}]
        }
        this.showAdd = true
      },
      chooseCard (card) {
        let cards = []
        let join = false
        for (let item of this.cards) {
          if (join) {
            cards.push(item)
          }
          if (item.Id === card.Id) {
            join = true
          }
        }
        for (let item of this.cards) {
          if (item.Id === card.Id) {
            cards.push(item)
            break
          }
          cards.push(item)
        }

        this.cards = cards
        this.currentCard = cards[cards.length - 1]
        if (this.currentCard.CardType === 0) {
          for (let item of this.currentCard.Services) {
            item.type = -1
            item.value = ''
          }
          this.services = this.currentCard.Services
        }
        this.scrollTop += 1
        setTimeout(function () {
          this.scrollTop += ''
        }.bind(this), 200)
      },
      changeType (index) {
        this.services[index].type = this.services[index].type * -1
        this.changeData += 1
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
        for (let item of this.services) {
          if (!item.isNew) {
            cards.push(item)
          }
        }
        for (let item of items) {
          item.CardValue = item.CardValue * 1
          item.isNew = true
          item.type = item.type ? item.type : -1
          item.value = item.value
          cards.push(item)
        }
        this.services = cards
        this.showAdd = false
      },
      doSave () {
        let that = this
        let params = {}
        if (this.currentCard.CardType) {
          params = {
            UserId: this.member.UserId,
            CardId: this.currentCard.Id,
            Uid: this.userId,
            StoreId: this.storeId,
            PayModel: this.original ? 0 : 1,
            ConsumptionTag: this.value * this.type >= 0 ? 4 : 2,
            ConsumptionType: this.currentCard.CardType,
            ConsumptionValue: Math.abs(this.value * this.type)
          }
        } else {
          let items = []
          for (let item of this.services) {
            if (item.isNew) {
              items.push({
                ItemName: item.ItemName,
                OperationValue: item.CardValue * 1 + (item.value ? (item.value * item.type) : 0)
              })
            } else {
              items.push({
                ItemId: item.ItemId,
                ItemName: item.ItemName,
                OperationValue: item.value * item.type
              })
            }
          }
          params = {
            UserId: this.member.UserId,
            CardId: this.currentCard.Id,
            Uid: this.userId,
            StoreId: this.storeId,
            ConsumptionType: this.currentCard.CardType,
            OperationServicesModel: items
          }
        }
        this.$post('/consumption/businessOperationUserConsumption', params, true).then(res => {
          wx.showToast({
            icon: 'success',
            mask: true,
            title: '修改成功'
          })
          setTimeout(function () {
            that.doClose()
          }, 1500)
        })
      }
    },
    onLoad () {
      let option = wx.getStorageSync('member')
      this.storeId = option.storeId
      this.userId = option.userId
      this.member = option.member
      let cards = []
      for (let i = option.member.Cards.length - 1; i >= 0; i--) {
        cards.push(option.member.Cards[i])
      }
      this.cards = cards
      this.currentCard = cards[cards.length - 1]
      if (this.currentCard.CardType === 0) {
        let items = []
        for (let item of this.currentCard.Services) {
          item.type = -1
          items.push(item)
        }
        this.services = items
      }
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('0').step({duration: 150})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0.35)').step({duration: 150})
        this.modelAnimation = modelAnimation.export()
      }.bind(this), 50)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .adjust-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1001;
    background-color: rgba(0, 0, 0, 0);
    .adjust-context {
      position: absolute;
      left: 0;
      bottom: -170vw;
      height: 165vw;
      width: 100vw;
      .context-top {
        width: 100vw;
        left: 50vw;
        position: absolute;
        top: 9.5vw;
        z-index: 1;
        div {
          position: relative;
          width: 300vw;
          height: 300vw;
          background: white;
          left: -150vw;
          border-radius: 50%;
          border: 1vw solid white;
          box-sizing: border-box;
        }
      }
      .context-middle {
        position: relative;
        z-index: 10;
        .context-logo {
          text-align: center;
          height: 19.1vw;
          line-height: 19.1vw;
          img {
            display: inline-block;
            vertical-align: top;
            border-radius: 50%;
            height: 19.1vw;
            width: 19.1vw;
          }
        }
        .member-name {
          text-align: center;
          color: #181818;
          font-size: 4.3vw;
          height: 4.3vw;
          line-height: 4.3vw;
          padding-top: 1.4vw;
          position: relative;
          span {
            display: inline-block;
            position: absolute;
            left: 0;
            top: -4vw;
            height: 5vw;
            padding: 5vw 5vw 5vw 3.3vw;
            width: 5vw;
          }
          img {
            display: inline-block;
            vertical-align: top;
            width: 4.1vw;
            height: 4.1vw;
          }
        }
        .edit-card {
          padding-top: 3.9vw;
          padding-right: 6.1vw;
          text-align: right;
          color: #A5A5A5;
          font-size: 3.3vw;
          height: 3.3vw;
          line-height: 3.3vw;
          span {
            display: inline-block;
            height: 2.4vw;
            vertical-align: top;
            padding: 0.9vw 0 0 0.7vw;
          }
          img {
            display: inline-block;
            vertical-align: top;
            height: 1.5vw;
            width: 1.1vw;
          }
        }
        .context-cards {
          width: 110vw;
          position: relative;
          left: 0;
          height: 133.3vw;
          z-index: 1002;
          .adjust-cards {
            padding-top: 3.6vw;
            position: relative;
            .item-card {
              width: 78vw;
              height: 10vw;
              margin-left: 11vw;
              color: white;
              top: 0;
              position: relative;
              position: sticky !important;
              display: inline-block;
              z-index: 1003;
              .new-card-demo {
                left: 0;
                top: 0;
                z-index: 1004;
                transform: scale(0.93, 0.93);
                transform-origin: 10% 10%;
              }
            }
            .balance-form {
              padding: 43vw 0 6vw 6.7vw;
              .balance-switch {
                width: 22vw;
                font-size: 3.2vw;
                height: 6vw;
                line-height: 6vw;
                background: #f0f0f0;
                border-radius: 5vw;
                text-align: center;
                position: relative;
                top: 0vw;
                color: #9a9a9a;
                border: rpx(1) solid #f0f0f0;
                white-space: nowrap;
                span {
                  width: 11.5vw !important;
                  border-radius: 5vw;
                  display: inline-block;
                  &:nth-child(2) {
                    position: relative;
                    left: -1vw;
                  }
                }
              }
              .balance-input {
                padding-top: 2vw;
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
              .balance-pay {
                font-size: 3vw;
                padding: 1.5vw 0;
                line-height: 6vw;
                width: 70vw;
                span {
                  display: inline-block;
                  height: 6vw;
                  vertical-align: top;
                  &:nth-child(1) {
                    text-align: left;
                    width: 50%;
                  }
                  &:nth-child(2) {
                    text-align: right;
                    color: red;
                    width: 50%;
                  }
                }
              }
            }
            .times-form {
              padding: 41vw 0 5.6vw 5.6vw;
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
            .adjust-remark {
              width: 100vw;
              font-size: 3.1vw;
              text-align: center;
              color: #BABABA;
              height: 3.2vw;
              line-height: 3.2vw;
            }
            .save-button {
              padding: 6vw 0 5vw 62.3vw;
              span {
                display: inline-block;
                width: 31.8vw;
                height: 13.3vw;
                line-height: 13.3vw;
                text-align: center;
                color: white;
                border-radius: 8vw;
                font-size: 5.5vw;
                background: #ff6700;
              }
            }
          }
        }
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          color: transparent;
        }
      }
    }
  }
</style>
