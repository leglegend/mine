<template>
  <div class="custom-box">
    <div class="input" :style="{'border-bottom-color':focus?'#7e7e7e':isError?'red':'#d5d5d5'}">
      <span class="name">
        <text v-if="name"><text v-for="item in name"
                                :style="{visibility:item=='囧'?'hidden':''}">{{item}}</text></text>
        <span class="request" v-if="request">*</span>
      </span>
      <input v-if="type=='input'&&name=='售囧价'" class="value" v-model="newValue" :placeholder="'请输入'" @input="onNumberChange"
             @blur="onBlur" :name="keyword"
             @focus="onFocus" type="digit" :maxlength="max?max:-1"
             placeholder-style="color:#dadada"/>
      <input v-if="type=='input'&&context&&name!='售囧价'" class="value" :value="newValue" :placeholder="'请输入'" @input="onChange"
             @blur="onBlur" :name="keyword"
             @focus="onFocus" :type="context?context:'text'" :maxlength="max?max:-1"
             placeholder-style="color:#dadada"/>
      <input v-if="type=='input'&&!context&&name!='售囧价'" class="value" v-model="newValue" :placeholder="'请输入'" @input="onChange"
             @blur="onBlur" :name="keyword"
             @focus="onFocus" type="text" :maxlength="max?max:-1"
             placeholder-style="color:#dadada"/>
      <radio-group v-if="type=='radio'" class="value" @change="radioChange">
        <radio class="radio" value="1" :checked="newValue==1">男</radio>
        <radio class="radio" value="2" :checked="newValue==2">女</radio>
      </radio-group>
      <radio-group v-if="type=='radio-type'" class="value" @change="radioChange">
        <radio class="radio" value="0" :checked="newValue==0">计次卡</radio>
        <radio class="radio" value="1" :checked="newValue==1">储值卡</radio>
      </radio-group>
      <picker v-if="type=='date'" class="value" @change="onChange" mode="date" :value="newValue">
        <view class="value"
              :style="{color:newValue?'':'#dadada'}">{{newValue ? newValue : '请选择' }}
        </view>
      </picker>
      <div class="price-box" v-if="name=='售囧价'">
        元
      </div>
    </div>
    <!--<div class="error" :style="{'visibility':isError?'visible':'hidden'}">{{infomation}}</div>-->
  </div>
</template>

<script>
  export default {
    props: ['name', 'request', 'value', 'keyword', 'validations', 'type', 'context', 'max'],
    data () {
      return {
        focus: false,
        newValue: '',
        isError: false,
        infomation: '',
        changeData: 0
      }
    },
    methods: {
      onFocus () {
        this.isError = false
        this.focus = true
      },
      onBlur (e) {
        this.focus = false
        this.newValue = e.mp.detail.value
        this.validate()
        this.$emit('changeValue', this.keyword, e.mp.detail.value)
      },
      onNumberChange (e) {
        if (e.mp.detail.value === '.' || e.mp.detail.value === '') {
          this.newValue = ''
          return
        }
        if (e.mp.detail.value === '0.0' || e.mp.detail.value === '0.00') {
          this.newValue = '0.'
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
        this.newValue = value
      },
      onChange (e) {
        this.newValue = e.mp.detail.value
        this.$emit('changeValue', this.keyword, e.mp.detail.value)
      },
      radioChange (e) {
        this.newValue = e.mp.detail.value
        this.validate()
        this.$emit('changeValue', this.keyword, e.mp.detail.value)
      },
      validate () {
        this.isError = false
        if (this.keyword === 'car_number' && this.newValue !== '' && this.newValue !== undefined && this.newValue !== null) {
          this.newValue = this.newValue.toUpperCase()
          this.$emit('changeValue', 'car_number', this.newValue)
        }
        if (this.request) {
          if (this.newValue === '' || this.newValue === undefined) {
            this.infomation = this.name + '不能为空'
            this.isError = true
          }
        }
        if (!this.isError && this.validations && this.validations.length > 0 && this.newValue !== '' && this.newValue !== undefined && this.newValue !== null) {
          for (let validate of this.validations) {
            var reg = new RegExp(validate.ValidationFormula, 'g')
            if (!reg.test(this.newValue)) {
              this.isError = true
              this.infomation = validate.ValidationInstructions
            }
          }
        }
        return !this.isError
      }
    },
    mounted () {
      this.newValue = this.value
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .custom-box {
    height: 7vh;
    line-height: 7vh;
    .input {
      width: 90vw;
      height: 7vh;
      line-height: 7vh;
      border-bottom: rpx(1) solid #bbbbbb;
      font-size: rpx(28);
      position: relative;
      .name {
        height: 7vh;
        line-height: 7vh;
        width: 19vw;
        padding-left: 1vw;
        vertical-align: top;
        display: inline-block;
        .request {
          color: red;
        }
      }
      .value {
        display: inline-block;
        width: 70vw;
        vertical-align: top;
        height: 7vh;
        line-height: 7vh;
        color: #7e7e7e;
        .radio {
          display: inline-block;
          width: 25vw;
        }
      }
      .price-box {
        position: absolute;
        right: 0;
        height: 7vh;
        line-height: 7vh;
        font-size: rpx(28);
        top: 0;
      }
    }

    .error {
      color: red;
      font-size: 0.7em;
      height: 2vh;
    }

    .inputing {
      border-bottom: 1px solid #7e7e7e;
    }
  }
</style>
