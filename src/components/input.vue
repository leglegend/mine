<template>
  <div class="custom-box">
    <div class="input" :style="{'border-bottom-color':focus?'#7e7e7e':isError?'red':'#d5d5d5'}">
      <span class="name">
        {{name}}
        <span class="request" v-if="request">*</span>
      </span>
      <input v-if="type=='input'&&context" class="value" :value="newValue" :placeholder="'请输入'" @input="onChange"
             @blur="onBlur"
             @focus="onFocus" :type="context?context:'text'" :maxlength="max?max:-1"
             placeholder-style="color:#dadada"/>
      <input v-if="type=='input'&&!context" class="value" v-model="newValue" :placeholder="'请输入'" @input="onChange"
             @blur="onBlur"
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
        value: '',
        newValue: '',
        isError: false,
        infomation: '',
        keyword: ''
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
