<template>
  <div class="createcard-model" :animation="modelAnimation">
    <div class="model-top" @click="doCancel"></div>
    <div class="model-buy" :animation="contextAnimation">
      <!--:style="{animation:isOver?'turnOff 200ms':'turnOn 200ms'}"-->
      <div class="model-close">
        <span @click="doCancel">取消</span>
        <span @click="doConfirm">确定</span>
      </div>
      <div class="molde-success">
        <div class="context">
          <span class="create-input">
            <div class="name">售价(元)<span class="request">*</span></div>
            <input class="value" type="digit" maxlength="8" @input="valueChange1" @blur="onBlur(1)"
                   v-model="price" @focus="onFocus(1)" :focus="focus"
                   :style="{'background':focus1?'#f0f0f0':isError1?'#FFF0F0':'#f0f0f0'}"
                   placeholder-style="color:#dadada"/>
          </span>
          <span class="create-input">
            <div class="name">卡额度({{type}})<span class="request">*</span></div>
            <input class="value" type="digit" maxlength="8" @input="valueChange2" @blur="onBlur(2)"
                   v-model="times" @focus="onFocus(2)"
                   :style="{'background':focus2?'#f0f0f0':isError2?'#FFF0F0':'#f0f0f0'}"
                   placeholder-style="color:#dadada"/>
          </span>
          <span class="create-input">
            <div class="name">赠送({{type}})</div>
            <input class="value" type="digit" maxlength="8" @input="valueChange3" @blur="onBlur(3)"
                   v-model="gift" @focus="onFocus(3)"
                   style="color:#ff6700;"
                   :style="{'background':focus3?'#f0f0f0':isError3?'#FFF0F0':'#f0f0f0'}"
                   placeholder-style="color:#dadada"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'price', 'times', 'gift', 'type'],
    data () {
      return {
        modelAnimation: {},
        contextAnimation: {},
        focus: false,
        focus1: false,
        focus2: false,
        focus3: false,
        isError1: false,
        isError2: false,
        isError3: false,
        isOver: false,
        bottom: ''
      }
    },
    methods: {
      onFocus (num) {
        if (num === 1) {
          this.focus1 = true
          this.focus = true
          this.isError1 = false
        } else if (num === 2) {
          this.focus2 = true
          this.isError2 = false
        } else if (num === 3) {
          this.focus3 = true
        }
      },
      valueChange1 (e) {
        if (e.mp.detail.value === '.' || e.mp.detail.value === '') {
          this.price = ''
          return
        }
        if (e.mp.detail.value === '0.0' || e.mp.detail.value === '0.00') {
          this.price = '0.'
          return
        }
        let value = e.mp.detail.value
        value = value.replace(/[^\d.]/g, '')
        value = value.replace(/\.{2,}/g, '.')
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1')
        if (value.indexOf('.') < 0 && value !== '') {
          value = Math.floor(value * 100) / 100
        }
        this.price = value
      },
      valueChange2 (e) {
        if (e.mp.detail.value === '.' || e.mp.detail.value === '') {
          this.times = ''
          return
        }
        let value = e.mp.detail.value
        value = value.replace(/[^\d.]/g, '')
        value = value.replace(/\.{2,}/g, '.')
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1')
        if (value.indexOf('.') < 0 && value !== '') {
          value = Math.floor(value * 100) / 100
        }
        this.times = value
      },
      valueChange3 (e) {
        if (e.mp.detail.value === '.' || e.mp.detail.value === '') {
          this.gift = ''
          return
        }
        let value = e.mp.detail.value
        value = value.replace(/[^\d.]/g, '')
        value = value.replace(/\.{2,}/g, '.')
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1')
        if (value.indexOf('.') < 0 && value !== '') {
          value = Math.floor(value * 100) / 100
        }
        this.gift = value
      },
      onBlur (num) {
        if (num === 1) {
          this.focus1 = false
          this.focus = false
          this.isError1 = this.price === ''
        } else if (num === 2) {
          this.focus2 = false
          this.isError2 = this.times === ''
        } else if (num === 3) {
          this.focus3 = false
        }
      },
      doCancel () {
        this.focus = false
        this.isOver = true
        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('-68vw').step({duration: 200})
        this.contextAnimation = contextAnimation.export()
        setTimeout(function () {
          this.$emit('cancel')
        }.bind(this), 150)
      },
      doConfirm () {
        this.onBlur(1)
        this.onBlur(2)
        this.onBlur(3)
        if (this.isError1 || this.isError2 || this.isError3) {
          return
        }
        this.isOver = true
        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('-68vw').step({duration: 200})
        this.contextAnimation = contextAnimation.export()
        setTimeout(function () {
          this.$emit('confirm', this.price, this.times, this.gift)
        }.bind(this), 150)
      }
    },
    mounted () {
      this.isOver = false
      setTimeout(function () {
        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0.35)').step({duration: 150})
        this.modelAnimation = modelAnimation.export()

        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('30vh').step({duration: 150})
        this.contextAnimation = contextAnimation.export()
      }.bind(this), 50)
      setTimeout(function () {
        this.focus = true
      }.bind(this), 250)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .createcard-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1001;
    background-color: rgba(138, 138, 138, 0);
    .model-top {
      width: 100vw;
      height: calc(100vh - 68vw);
      position: fixed;
      top: 0;
    }
    .model-buy {
      width: 100vw;
      height: 68vw;
      position: fixed;
      bottom: -68vw;
      background-color: white;
      .model-close {
        padding-left: 3vw;
        padding-right: 3vw;
        border-bottom: rpx(1) solid #eee9e5;
        height: 10vw;
        line-height: 10vw;
        font-size: 4vw;
        color: #b2b2b2;
        span {
          display: inline-block;
          width: 47vw;
          height: 10vw;
          line-height: 10vw;
          &:nth-child(2) {
            text-align: right;
            color: #ff6700;
          }
        }
      }
      .molde-success {
        width: 100vw;
        padding-top: 1vh;
        .context {
          padding: 13vw 5vw 1vh 5vw;
          white-space: nowrap;
          overflow: hidden;
          .create-input {
            display: inline-block;
            width: 30vw;
            .name {
              height: 7vh;
              line-height: 7vh;
              width: 30vw;
              font-size: 4vw;
              padding-left: 3vw;
              .request {
                color: red;
              }
            }
            .value {
              padding: 0 3vw;
              width: 20vw;
              background: #f0f0f0;
              color: #808080;
              border-radius: 5vw;
              height: 10vw;
              line-height: 10vw;
              font-size: 5.5vw;
            }
          }
        }
        .buttons {
          padding: rpx(20) rpx(40);
          text-align: right;
          font-size: rpx(34);
          span {
            display: inline-block;
            border-radius: rpx(40);
            width: rpx(165);
            height: rpx(78);
            line-height: rpx(78);
            text-align: center;
            border: rpx(1) solid #ff6700;
            margin-left: rpx(27)
          }
          .cancel {
            color: #ff6700;
            &:active {
              background-color: #e6e6e6;
            }
          }
          .confirm {
            color: white;
            background-color: #ff6700;
            &:active {
              background-color: #e66100;
            }
          }
        }
      }
    }
    @keyframes turnOn {
      from {
        bottom: -70vw;
      }
      to {
        bottom: 0;
      }
    }
    @keyframes turnOff {
      from {
        bottom: 0;
      }
      to {
        bottom: -70vw;
      }
    }
  }
</style>
