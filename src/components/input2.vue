<template>
  <div class="custom-box2">
    <span class="title" v-if="name!='余额'">{{name}}<text style="color: red">*</text></span>
    <span class="title" v-if="name=='余额'">余&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额<text style="color: red">*</text></span>
    <input v-if="info=='元'" v-model="newValue" class="model" :class="isError?'error':''" @input="onChange"
           @blur="onBlur"
           type="digit"
           maxlength="10"
           @focus="onFocus" :name="keyword"
           placeholder-style="color:#dadada"/>
    <input v-if="info=='次'" v-model="newValue" class="model" :class="isError?'error':''" @input="onChange"
           @blur="onBlur"
           type="number"
           maxlength="10"
           @focus="onFocus" :name="keyword"
           placeholder-style="color:#dadada"/>
    {{info}}
  </div>
</template>

<script>
  export default {
    props: ['name', 'value', 'keyword', 'validations', 'type', 'info'],
    data () {
      return {
        focus: false,
        value: '',
        newValue: '',
        isError: false,
        request: true
      }
    },
    methods: {
      onFocus () {
        this.isError = false
        this.focus = true
      },
      onChange (e) {
        if (e.mp.detail.value === '.' || e.mp.detail.value === '') {
          this.newValue = ''
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
      onBlur (e) {
        this.focus = false
        this.newValue = e.mp.detail.value
        this.validate()
      },
      validate () {
        this.isError = false
        if (this.request) {
          if (this.newValue === '' || this.newValue === undefined) {
            this.infomation = this.name + '不能为空'
            this.isError = true
          }
        }
        if (!this.isError && this.validations && this.validations.length > 0) {
          for (let validate of this.validations) {
            var reg = new RegExp(validate.ValidationFormula, 'g')
            if (!reg.test(this.newValue)) {
              this.isError = true
              this.infomation = validate.ValidationInstructions
            }
          }
        }
        return !this.isError
      },
      getValue () {
        return {
          name: this.keyword,
          value: this.newValue
        }
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

  .custom-box2 {
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
      overflow: hidden;
    }
    .error {
      border: rpx(1) solid red;
      background-color: #fff0f0;
    }
  }
</style>
