<template>
  <div class="demo-page mobile-page">
    <title :name="'我的账号'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context">
          <div style="padding: 1vh"></div>
          <div class="phone-title">请输入新手机号</div>
          <div class="phone-context">
            <div class="context">
              <div class="phone-number"
                   :style="{'border-bottom':phoneError==true?'1rpx solid red':'1rpx solid #efefef'}">
                <span>
                  +86
                </span>
                <span>
                  <input :placeholder="'请输入'" :placeholder-style="'font-size: 35rpx'" type="number"
                         @input="phoneChange" @focus="phoneError==false?'':phoneError=null" v-model="phone"/>
                </span>
                <div class="context-error" v-show="phoneError == true"></div>
              </div>
              <div class="phone-code" v-show="phoneError==false">
                <span>
                </span>
                <span>
                  <span class="code"><input :placeholder="'填写验证码'" :placeholder-style="'font-size: 26rpx'"
                                            type="number" v-model="code"/></span>
                  <span class="code-button" @click="sendCode" :class="isSending?'not-code':'get-code'">
                    {{isSending ? '重新获取(' + time + 's)' : '获取验证码'}}
                  </span>
                </span>
              </div>
              <div class="save" @click="commit" v-show="code.length==4">确定</div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
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
        titleHeight: null,
        phone: '',
        code: '',
        isSending: false,
        phoneError: null,
        message: '',
        time: 30
      }
    },
    methods: {
      getPhoneNumber (e) {
        console.log(e.mp.detail.errMsg)
        console.log(e.mp.detail.iv)
        console.log(e.mp.detail.encryptedData)
      },
      commit () {
        let childrens = this.$children
        let isError = false
        let that = this
        for (let children of childrens) {
          if (children.validate === undefined) {
            continue
          }
          if (!children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return false
        }
        this.$post('/user/setUserMobile', {
          Uid: this.userId,
          StoreId: this.storeId,
          SmsCode: this.code,
          UserMobile: this.phone
        }, true).then(res => {
          that.$success('保存成功', true)
          let globalData = that.getGlobalData()
          globalData.user.mobile = that.mobile
        })
      },
      setTime () {
        setTimeout(function () {
          if (this.time === 0) {
            this.isSending = false
            this.time = 30
          } else {
            this.time -= 1
            this.setTime()
          }
        }.bind(this), 1000)
      },
      phoneChange (e) {
        let that = this
        that.phone = e.mp.detail.value
        if (this.phone === '') {
          this.message = '手机号不能为空'
          this.phoneError = true
          return
        } else if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.phone))) {
          this.message = '手机号格式错误'
          this.phoneError = true
          return
        }
        this.$post('/user/checkUserMobile', {
          Uid: this.userId,
          StoreId: this.storeId,
          OperationType: 1,
          UserMobile: this.phone
        }).then(res => {
          that.phoneError = !res.IsUse
          if (!res.IsUse) {
            that.message = '该手机号已被注册'
          }
        })
      },
      codeChange (e) {
        this.code = e.mp.detail.value
      },
      sendCode () {
        let that = this
        if (that.isSending) {
          return
        }
        this.$post('/common/sendSms', {
          Uid: this.userId,
          Type: 3,
          Mobile: this.phone
        }).then(res => {
          that.isSending = true
          that.setTime()
        })
      }
    },
    onLoad (res) {
      this.userId = res.userId
      this.storeId = res.storeId
      this.phone = ''
      this.code = ''
      this.phoneError = null
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mobile-page {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .phone-title {
      background-color: white;
      padding: rpx(50) 0 0 rpx(40);
      font-size: rpx(42);
    }
    .phone-context {
      width: 100vw;
      .context {
        width: 90vw;
        padding: 0 5vw 4vh 5vw;
        height: 62vh;
        background-color: white;
        .phone-number {
          height: rpx(100);
          line-height: rpx(100);
          // border-bottom: rpx(1) solid #efefef;
          padding-top: rpx(10);
          overflow: hidden;
          span {
            display: inline-block;
            height: rpx(100);
            line-height: rpx(100);
            vertical-align: middle;
            &:nth-child(1) {
              width: calc(10vw - 5rpx);
              padding-left: rpx(5);
              font-size: rpx(28);
              position: relative;
              bottom: rpx(-8);
            }
            &:nth-child(2) {
              width: 80vw;
              font-size: rpx(50);
            }
          }
          input {
            width: 80vw;
            font-size: rpx(50);
            height: rpx(100);
            line-height: rpx(100);
            display: inline-block;
          }
          .context-error {
            color: red;
            font-size: rpx(25);
            position: absolute;
            top: rpx(245);
            padding-left: 10vw;
          }
        }
        .phone-code {
          height: rpx(88);
          line-height: rpx(88);
          span {
            display: inline-block;
            height: rpx(88);
            line-height: rpx(88);
            vertical-align: middle;
            &:nth-child(1) {
              width: 10vw;
            }
            &:nth-child(2) {
              width: 80vw;
              font-size: rpx(38);
              border-bottom: rpx(1) solid #efefef;
            }
            .code {
              width: 55vw;
            }
            .code-button {
              height: rpx(55);
              line-height: rpx(55);
              width: calc(25vw - 5rpx);
              font-size: rpx(30);
              border: rpx(1) solid red;
              text-align: center;
              border-radius: rpx(30);
              font-size: rpx(27);
            }
            .get-code {
              border: rpx(1) solid #ff6700;
              color: #ff6700;
            }
            .not-code {
              border: rpx(1) solid #bfbfbf;
              color: #bfbfbf;
            }
            input {
              width: 55vw;
              font-size: rpx(38);
              height: rpx(88);
              line-height: rpx(88);
              display: inline-block;
            }
          }
        }
      }

      .save {
        margin-top: 6vh;
        margin-left: 60vw;
        width: 32vw;
        border-radius: 25px;
        color: white;
        background-color: #ff6700;
        height: 7vh;
        line-height: 7vh;
        text-align: center;
        &:active {
          background-color: #e66200;
        }
      }
    }
  }
</style>
