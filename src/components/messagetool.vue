<template>
  <div class="message-tool">
    <div class="input1" :class="isError?'error2':''" v-if="type=='input'">
      <input
        placeholder="输入标题"
        name="MessTitle"
        v-model="newValue"
        @blur="onBlur"
        @focus="onFocus"/>
    </div>
    <div class="textarea1" v-if="type=='textarea'">
      <div class="input-text" :class="isError?'error1':''">
        <textarea v-model="newValue" maxlength="1000" name="MessInfo" fixed="true" placeholder="请输入详细说明"/>
      </div>
      <div class="number" :style="{color:newValue.length==1000?'red':''}">已写{{newValue.length}}字/最多1000字</div>
    </div>
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
      onBlur (e) {
        this.focus = false
        this.newValue = e.mp.detail.value
        this.validate()
      },
      validate () {
        this.isError = false
        if (this.newValue === '' || this.newValue === undefined) {
          this.isError = true
        }
        return !this.isError
      },
      reset () {
        this.newValue = ''
        this.isError = false
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

  .message-tool {
    .input1 {
      border-bottom: rpx(1) solid #d5d5d5;
      input {
        width: 89vw;
        padding-left: 1vw;
        height: 6vh;
        line-height: 6vh;
        font-size: rpx(30);
        display: block;
      }
    }
    .textarea1 {
      padding-top: 2.5vh;
      .input-text {
        border: rpx(1) solid #d5d5d5;
      }
      textarea {
        width: 84vw;
        height: 28vh;
        font-size: rpx(30);
        display: block;
        padding: 1vh 3vw;
        border: 0;
      }
      .number {
        text-align: right;
        font-size: rpx(28);
        padding-top: 1vh;
        color: #ababb1;
      }
    }
    .error1 {
      border: rpx(1) solid red !important;
    }
    .error2 {
      border-bottom: rpx(1) solid red;
    }
  }
</style>
