<template>
  <div class="service-contract-page">
    <title :name="'我要合同'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-contract-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-contract-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-contract-context">
          <div class="contract-top">
            <div>
              <text>*</text>
              请填写邮箱地址，我们将发送盖章合同电子版
            </div>
          </div>
          <div class="contract-context" v-if="state==-1&&softVersion!=1">
            <div class="context-title">
              <span>
                <div class="title-icon"></div>
              </span>
              <span>
                收件人邮箱
              </span>
            </div>
            <div class="export-email">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/email.png"/>
              </span>
              <span>
                <input v-model="email" placeholder="请输入电子邮箱地址" placeholder-style="color:#BFBFBF"/>
              </span>
            </div>
            <div class="context-button">
              <span @click="doSave">保存</span>
            </div>
          </div>
          <div class="contract-context" v-if="softVersion==1">
            <div class="contract-0">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/contract-0.png"/>
            </div>
            <div class="contract-0-title">
              申请签订电子合同需要为付费用户
            </div>
            <div class="edit-button" style="padding-top: 20.6vw">
              <span @click="goBack">我知道了</span>
            </div>
          </div>
          <div class="contract-context" v-if="state==1&&softVersion!=1">
            <div class="contract-1">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/contract-1.png"/>
            </div>
            <div class="contract-1-title">
              <div>已发送</div>
              <div v-if="email">{{email}}</div>
              <div v-if="email">请注意查收</div>
            </div>
          </div>
          <div class="contract-context" v-if="state==0&&softVersion!=1">
            <div class="contract-2">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/contract-2.png"/>
            </div>
            <div class="contract-2-title">
              <div>{{email}}</div>
              <div>通常五个工作日内发送，遇节假日顺延。</div>
            </div>
            <div class="edit-button" style="padding-top: 11.7vw">
              <span @click="doEdit">修改</span>
            </div>
            <div class="edit-button delete-button" style="padding-top: 2.4vw">
              <span @click="deleting=true">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="deleting">
      <confirm :title="'确认要删除吗?'" @cancel="deleting = false" @confirm="doDelete"></confirm>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import confirm from '@/components/confirm'

  export default {
    components: {
      title, confirm
    },
    computed: {
      softVersion () {
        return this.$store.getters.GET_SOFTVERSION
      }
    },
    data () {
      return {
        info: {},
        state: '',
        email: '',
        deleting: false,
        addressArray: [],
        titleHeight: null
      }
    },
    methods: {
      addressChange (e) {
        this.addressArray = e.mp.detail.value
        this.address = this.addressArray[0] + this.addressArray[1] + this.addressArray[2]
      },
      goBack () {
        wx.navigateBack({
          delta: 1
        })
      },
      getInfo () {
        let that = this
        this.$post('/askForItems/businessGetAgreementInfo', {
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.info = res
          that.state = res.ExpressState
          if (res.ReceiveEmail) {
            that.email = res.ReceiveEmail
          }
          if (that.state === -1) {
            that.getEmail()
          }
        })
      },
      doEdit () {
        this.state = -1
        if (!this.email) {
          this.getEmail()
        }
      },
      doDelete () {
        let that = this
        this.$post('/askForItems/businessDeleteAskForItem', {
          AskForType: 1,
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          that.$success('删除成功', false)
          that.state = ''
          that.getInfo()
        })
      },
      doSave () {
        if (!this.email) {
          wx.showToast({
            title: '请输入邮箱',
            image: '/static/warn.png'
          })
          return
        }
        let that = this
        let params = {
          ReceiveEmail: this.email,
          Uid: this.userId,
          StoreId: this.storeId
        }
        this.$post('/askForItems/businessReceiveAgreement', params, true).then(res => {
          that.$success('保存成功', false)
          that.getInfo()
        })
      },
      getEmail () {
        let that = this
        this.$post('/store/businessGetStoreEmail', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          if (!that.email) {
            that.email = res.UserEmail
          }
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.state = ''
      this.email = ''
      this.info = {}
      this.deleting = false
      this.getInfo()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-contract-page {
    height: 100vh;
    background-color: #f0f0f0;
    .service-contract-scroll {
      height: 90vh;
      .service-contract-main {
        min-height: 80vh;
        background: white;
        .service-contract-context {
          .contract-top {
            padding: 4vw 8vw 4vw 8vw;
            background: rgba(255, 237, 173, 1);
            color: #76541E;
            font-size: 2.8vw;
            letter-spacing: 0.3vw;
            line-height: 4.8vw;
            text {
              color: #FF0000;
            }
          }
          .contract-context {
            padding: 9.9vw 13.7vw 11.2vw 13.7vw;
            background: white;
            .context-title {
              padding-top: 28vw;
              height: 4.4vw;
              line-height: 4.4vw;
              padding-bottom: 7vw;
              span {
                display: inline-block;
                vertical-align: top;
                &:nth-child(1) {
                  padding-top: 1.5vw;
                }
                &:nth-child(2) {
                  padding-left: 1.8vw;
                  width: 40.7vw;
                  color: #2E2E30;
                  font-size: 3.7vw;
                  height: 4.4vw;
                  line-height: 4.4vw;
                  font-family: MicrosoftYaHei-Bold;
                  font-weight: 700;
                }
                &:nth-child(3) {
                  height: 4.4vw;
                  line-height: 4.1vw;
                  text-align: center;
                  width: 11.8vw;
                  border: 0.3vw solid rgba(214, 180, 122, 1);
                  border-radius: 2.2vw;
                  box-sizing: border-box;
                  font-size: 2.6vw;
                  color: rgba(214, 180, 122, 1);
                }
                &:nth-child(4) {
                  margin-left: 3.6vw;
                  height: 4.4vw;
                  line-height: 4.1vw;
                  text-align: center;
                  width: 11.8vw;
                  border: 0.3vw solid rgba(214, 180, 122, 1);
                  border-radius: 2.2vw;
                  box-sizing: border-box;
                  font-size: 2.6vw;
                  color: rgba(214, 180, 122, 1);
                }
              }
              .title-icon {
                width: 3vw;
                height: 1vw;
                background: rgba(214, 180, 122, 1);
              }
            }
            .export-email {
              height: 10.9vw;
              line-height: 10.9vw;
              background: rgba(249, 249, 249, 1);
              border-radius: 5.5vw;
              span {
                display: inline-block;
                height: 10.9vw;
                line-height: 10.9vw;
                vertical-align: top;
                &:nth-child(1) {
                  padding-left: 5.6vw;
                  width: 5.7vw;
                }
                &:nth-child(2) {
                  width: 60vw;
                  font-size: 3.3vw;
                }
              }
              input {
                width: 60vw;
                height: 10.9vw;
                line-height: 10.9vw;
              }
              img {
                display: inline-block;
                width: 3.7vw;
                height: 2.9vw;
                vertical-align: middle;
                position: relative;
                top: -0.5vw;
              }
            }
            .context-items {
              padding-top: 5.2vw;
              .context-item {
                padding-bottom: 4.1vw;
                font-size: 3.3vw;
                div {
                  height: 10.9vw;
                  line-height: 10.9vw;
                  box-sizing: border-box;
                  padding-left: 8.6vw;
                  background: rgba(249, 249, 249, 1);
                  border-radius: 5.5vw;
                }
                span {
                  display: inline-block;
                  height: 10.9vw;
                  line-height: 10.9vw;
                  vertical-align: top;
                  &:nth-child(1) {
                    width: 5.7vw;
                  }
                  &:nth-child(2) {
                    width: 58.2vw;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                }
                input {
                  display: inline-block;
                  width: 100%;
                  height: 10.9vw;
                  line-height: 10.9vw;
                }
                img {
                  display: inline-block;
                  vertical-align: middle;
                  position: relative;
                  top: -0.3vw;
                }
              }
            }
            .context-button {
              text-align: center;
              padding-top: 25vw;
              padding-bottom: 2.8vw;
              span {
                display: inline-block;
                width: 47.4vw;
                height: 9.2vw;
                line-height: 9.2vw;
                background: linear-gradient(90deg, rgba(215, 180, 117, 1), rgba(229, 198, 142, 1), rgba(245, 216, 169, 1));
                border-radius: 4.6vw;
                letter-spacing: 1.5vw;
                font-size: 3.7vw;
                font-family: MicrosoftYaHei-Bold;
                font-weight: 700;
                color: #76541E;
              }
            }
            .context-view {
              padding-top: 5vw;
              .view-top {
                height: 3.5vw;
                line-height: 3.5vw;
                span {
                  display: inline-block;
                  height: 3.5vw;
                  line-height: 3.5vw;
                  font-size: 3.5vw;
                  &:nth-child(1) {
                    padding-right: 4vw;
                  }
                  &:nth-child(2) {
                    color: #ACADB3;
                  }
                }
              }
              .view-middle {
                padding-top: 1vw;
                font-size: 3.1vw;
                line-height: 6vw;
              }
              .view-middle2 {
                padding-top: 4vw;
                height: 3.1vw;
                line-height: 3.1vw;
                font-size: 3.1vw;
                color: rgba(172, 173, 179, 1);
                padding-bottom: 1vw;
              }
              .view-bottom {
                padding-top: 5vw;
                font-size: 2.6vw;
                color: rgba(172, 173, 179, 1);
                line-height: 4.4vw;
              }
            }
            .contract-0 {
              padding-top: 10vw;
              text-align: center;
              img {
                width: 36.9vw;
                height: 25.7vw;
                display: inline-block;
              }
            }
            .contract-1 {
              padding-top: 7vw;
              text-align: center;
              img {
                width: 36.9vw;
                height: 27.2vw;
                display: inline-block;
              }
            }
            .contract-2 {
              padding-top: 5.1vw;
              text-align: center;
              img {
                width: 37.1vw;
                height: 31vw;
                display: inline-block;
              }
            }
            .contract-0-title {
              padding-top: 4.7vw;
              text-align: center;
              line-height: 3.9vw;
              font-size: 4.1vw;
              color: #76541E;
            }
            .contract-1-title {
              padding-top: 1.4vw;
              text-align: center;
              div {
                &:nth-child(1) {
                  font-size: 5vw;
                  color: #76541E;
                  line-height: 4.7vw;
                }
                &:nth-child(2) {
                  padding-top: 10vw;
                  font-size: 4.4vw;
                  color: #2E2E30;
                  line-height: 4.2vw;
                }
                &:nth-child(3) {
                  padding-top: 1.9vw;
                  font-size: 4.4vw;
                  color: #ACADB3;
                  line-height: 4.2vw;
                }
              }

            }
            .contract-2-title {
              padding-top: 0.2vw;
              text-align: center;
              div {
                padding-top: 1.4vw;
                line-height: 3.7vw;
                color: #ACADB3;
                font-size: 3.7vw;
              }
            }
            .edit-button {
              text-align: center;
              span {
                display: inline-block;
                vertical-align: top;
                width: 44.4vw;
                height: 9.4vw;
                line-height: 9.4vw;
                border: 1px solid rgba(204, 160, 82, 1);
                font-size: 3.7vw;
                letter-spacing: 0.5vw;
                color: #D6B47A;
                border-radius: 4.7vw;
              }
            }
            .delete-button {
              span {
                color: #C4C1C4;
                border: 1px solid #C4C1C4;
              }
            }
          }
        }
      }
    }
  }
</style>
