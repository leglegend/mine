<template>
  <div class="custom">
    <div class="input" :style="{'border-bottom-color':focus?'#7e7e7e':error?'red':'#d5d5d5'}">
      <span class="name">
        {{title}}
        <span class="request" v-if="request">*</span>
      </span>
      <input v-if="type=='input'" class="value"
             v-model="newValue"
             :placeholder="info?info:'请填写'"
             :name="name"
             @input="onChange"
             @blur="onBlur"
             @focus="onFocus"
             placeholder-style="color:#dadada"/>
      <radio-group v-if="type=='radio'" class="value" @change="radioChange">
        <radio class="radio" value="1" :checked="newValue==1">男</radio>
        <radio class="radio" value="0" :checked="newValue==0">女</radio>
      </radio-group>
      <radio-group v-if="type=='radio-type'" class="value" @change="radioChange">
        <radio class="radio" value="0" :checked="newValue==0">计次卡</radio>
        <radio class="radio" value="1" :checked="newValue==1">储值卡</radio>
      </radio-group>
    </div>
    <!--<div class="error" :style="{'visibility':error?'visible':'hidden'}">{{infomation}}</div>-->
  </div>
</template>

<script>
  export default {
    props: ['title', 'name', 'request', 'value', 'validations', 'type', 'info'],
    data () {
      return {
        focus: false,
        value: '',
        error: false,
        infomation: '',
        newValue: ''
      }
    },
    methods: {
      onFocus () {
        this.error = false
        this.focus = true
      },
      onBlur (e) {
        this.focus = false
        this.newValue = e.mp.detail.value
        this.validate()
        this.$emit('changeName', this.name, e.mp.detail.value)
      },
      onChange (e) {
        this.newValue = e.mp.detail.value
      },
      radioChange (e) {
        this.newValue = e.mp.detail.value
        this.validate()
      },
      validate () {
        this.error = false
        if (this.request) {
          if (this.newValue === '' || this.newValue === undefined) {
            this.infomation = this.title + '不能为空'
            this.error = true
          }
        }
        if (!this.error && this.validations && this.validations.length > 0) {
          for (let validate of this.validations) {
            var reg = new RegExp(validate.ValidationFormula, 'g')
            if (!reg.test(this.newValue)) {
              this.error = true
              this.infomation = validate.ValidationInstructions
            }
          }
        }
        return !this.error
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

  .custom {
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
