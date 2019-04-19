<template>
  <div class="adjust">
    <title :name="'调整余额'"></title>
    <scroll-view scroll-y="true" class="adjust-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div style="background-color: white;padding-bottom: 3vh">
          <div class="info">
            <span class="logo" v-bind:style="{background:'url('+user.UserImg+')','background-size':'100%,100%'}"></span>

            <div class="nick"> {{user.UserName}}</div>

          </div>
          <div class="operat">
            <div class="param">
              <span class="title">当前余额</span>
              <span class="value">{{card.CardPrice}}{{card.CardType ? '元' : '次'}}</span>
            </div>
            <div class="param">
              <span class="title">调整余额</span>
              <span class="calc" v-if="card.CardType">
                <span class="calc-num">
                  <span class="calc-left" :style="{color:value==0?'':first<0?'#6ab35e':'red'}">
                    <span class="num-title"
                          :style="{visibility:value==''?'hidden':'visible'}">{{first < 0 ? '-' : '+'}}</span>
                    <input v-model="value" type="number"/>
                  </span>
                  <span class="num-times">{{card.CardType ? '元' : '次'}}</span>
                </span>
                <span class="calc-add" @click="first=1">加</span>
                <span class="calc-sub"
                      @click="first=-1">减</span>
              </span>
              <span class="calc" v-if="!card.CardType">
                <span class="calc-num">
                  <span class="calc-left" :style="{color:first<0?'#6ab35e':'red'}">
                    <span class="num-title"
                          :style="{visibility:value==''?'hidden':'visible'}">{{first < 0 ? '-' : '+'}}</span>
                    <input v-model="value" type="number"/>
                  </span>
                  <span class="num-times">{{card.CardType ? '元' : '次'}}</span>
                </span>
                <span class="calc-add" @click="addEvent">加</span>
                <span class="calc-sub"
                      @click="subEvent">减</span>
              </span>
            </div>
            <div class="param">
              <span class="title">有效期至</span>
              <span>
              <picker class="picker" @change="changeValidityDate" mode="date" :value="validityDate">
                <view class="model" :style="{color:changed?'red':''}">{{validityDate}}</view>
              </picker>
            </span>
            </div>
            <div class="commit">
              <span @click="commit">保存</span>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import title from '@/components/title'

  export default {
    components: {
      title
    },
    data () {
      return {
        user: {},
        card: {},
        validityDate: '',
        value: 0,
        first: -1,
        tag: null,
        changed: false,
        titleHeight: ''
      }
    },
    methods: {
      addEvent () {
        if (this.value === '') {
          this.value = 1
          this.first = 1
        } else if ((this.value === 1 || this.value === '1') && this.first === -1) {
          this.value = ''
        } else if (this.first === -1) {
          this.value = this.value * 1 - 1
        } else {
          this.value = this.value * 1 + 1
        }
      },
      subEvent () {
        if (this.value === '') {
          this.value = 1
          this.first = -1
        } else if ((this.value === 1 || this.value === '1') && this.first === 1) {
          this.value = ''
        } else if (this.first === 1) {
          this.value = this.value * 1 - 1
        } else {
          this.value = this.value * 1 + 1
        }
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
      radioChange (e) {
        this.tag = e.mp.detail.value
      },
      commit () {
        this.$post('/consumption/businessOperationUserConsumption', {
          UserId: this.info.memberId,
          CardId: this.info.childCardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          ConsumptionTag: this.value * this.first >= 0 ? 4 : 2,
          ConsumptionType: this.user.CardType,
          ConsumptionValue: Math.abs(this.value * this.first),
          ValidityDate: this.validityDate === this.user.ValidityDate ? '' : this.validityDate
        }).then(res => {
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
      }
    },
    onLoad (option) {
      this.info = option
      this.value = ''
      this.tag = null
      this.first = -1
      this.changed = false
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
      .info {
        padding-top: 2vh;
        text-align: center;
        .logo {
          height: 15vw;
          width: 15vw;
          border-radius: 50%;
          display: inline-block;
        }
        .nick {
          font-size: rpx(35);
          font-weight: 600;
          height: 6vh;
          position: relative;
          top: -0.5vh;
        }
      }
      .operat {
        font-size: rpx(28);
        padding: 0 6vw;
        .param {
          height: 7.6vh;
          .title {
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
        }
        .commit {
          padding: 1vh 0vw 4vh 0vw;
          text-align: right;

          span {
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
