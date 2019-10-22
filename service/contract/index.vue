<template>
  <div class="service-contract-page">
    <title :name="'我要合同'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-contract-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-contract-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-contract-context">
          <div class="contract-top">
            <div>
              1、您提交审请后，我方将在5个工作日内寄出
            </div>
            <div>
              2、该合同分为一式两份且均已加盖我司公章，当您收到后请贵司法人签字后寄回其中一份
            </div>
            <div>
              3、寄回时如选择圆通、申通、韵达、汇通、中通、顺丰可选择到付，由我方支付运费。拒收其它任何邮寄方式。
            </div>
          </div>
          <div class="contract-context"
               :style="{padding:state == -1?'':'9.9vw 13.5vw 11.2vw 13.5vw'}">
            <div class="context-title">
              <span>
                <div class="title-icon"></div>
              </span>
              <span>
                {{state == -1 ? '收件人信息' : state ? '已发货' : '待发货'}}
              </span>
              <span @click="state = -1" v-if="state==0">
                修改
              </span>
              <span @click="deleting = true" v-if="state==0">
                删除
              </span>
            </div>
            <div class="context-items" v-if="state==-1">
              <div class="context-item">
                <div>
                    <span>
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/table-name.png" style="width: 3.2vw;height: 3.7vw"/>
                    </span>
                  <span>
                      <input v-model="name" placeholder="请输入姓名" placeholder-style="color:#BFBFBF"/>
                    </span>
                </div>
              </div>
              <div class="context-item">
                <div>
                    <span>
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/table-phone.png" style="width: 3.4vw;height: 3.4vw"/>
                    </span>
                  <span>
                      <input v-model="phone" placeholder="请输入电话" type="number" maxlength="11"
                             placeholder-style="color:#BFBFBF"/>
                    </span>
                </div>
              </div>
              <div class="context-item">
                <picker mode="region" :value="addressArray" @change="addressChange">
                  <div>
                      <span>
                        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/table-address.png" style="width: 3.4vw;height: 3.5vw"/>
                      </span>
                    <span :style="{color:address?'':'#BFBFBF'}">
                        {{address ? address : '请输入所在地区'}}
                      </span>
                  </div>
                </picker>
              </div>
              <div class="context-item">
                <div>
                    <span>
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/table-area.png" style="width: 2.9vw;height: 3.4vw"/>
                    </span>
                  <span>
                      <input v-model="area" placeholder="请输入全部地址" placeholder-style="color:#BFBFBF"/>
                    </span>
                </div>
              </div>
            </div>
            <div class="context-button" v-if="state==-1">
              <span @click="doSave">保存</span>
            </div>
            <div class="context-view" v-if="state!=-1">
              <div class="view-top">
                <span>{{name}}</span>
                <span>{{phone}}</span>
              </div>
              <div class="view-middle">
                {{info.ReceivePovince}}
                {{info.ReceiveCity}}
                {{info.ReceiveDistrict}}
                {{info.ReceiveAddress}}
              </div>
              <div class="view-middle2">
                通常五个工作日内寄出，遇节假日顺延。
              </div>
              <div class="view-bottom" v-if="state==1">
                <div>快递：{{info.ExpressName}}</div>
                <div>单号：{{info.ExpressNo}}</div>
                <div>寄出时间：{{info.ExpressDate}}</div>
              </div>
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

    data () {
      return {
        info: {},
        state: '',
        address: '',
        name: '',
        phone: '',
        area: '',
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
      getInfo () {
        let that = this
        this.$post('/askForItems/businessGetAskForItemsInfo', {
          AskForType: 1,
          Uid: this.userId,
          StoreId: this.storeId
        }, true).then(res => {
          if (res) {
            that.state = res.ExpressState
            that.name = res.Consignee
            that.phone = res.ReceiveMobile
            that.addressArray = [res.ReceivePovince, res.ReceiveCity, res.ReceiveDistrict]
            that.address = res.ReceivePovince + res.ReceiveCity + res.ReceiveDistrict
            that.area = res.ReceiveAddress
            that.info = res
          } else {
            that.state = -1
            that.getPhone()
          }
        })
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
          that.address = ''
          that.name = ''
          that.area = ''
          that.phone = ''
          that.addressArray = []
          that.getInfo()
        })
      },
      doSave () {
        if (!this.name) {
          wx.showToast({
            title: '请输入姓名',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        } else if (!this.phone) {
          wx.showToast({
            title: '请输入电话',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        } else if (!this.address) {
          wx.showToast({
            title: '请选择地区',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        } else if (!this.area) {
          wx.showToast({
            title: '请输入地址',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        let that = this
        let params = {
          AskForType: 1,
          Consignee: this.name,
          ReceiveMobile: this.phone,
          ReceivePovince: this.addressArray[0],
          ReceiveCity: this.addressArray[1],
          ReceiveDistrict: this.addressArray[2],
          ReceiveAddress: this.area,
          Uid: this.userId,
          StoreId: this.storeId
        }
        this.$post('/askForItems/businessUpdateAskForItemsInfo', params, true).then(res => {
          that.$success('保存成功', false)
          that.getInfo()
        })
      },
      getPhone () {
        let that = this
        this.$post('/askForItems/businessGetStoreUserMobile', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          if (res.UserMobile) {
            that.phone = res.UserMobile
          }
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.state = ''
      this.address = ''
      this.name = ''
      this.area = ''
      this.phone = ''
      this.deleting = false
      this.addressArray = []
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
        .service-contract-context {
          .contract-top {
            padding: 4vw 8vw 4vw 8vw;
            background: rgba(255, 237, 173, 1);
            color: #76541E;
            font-size: 2.8vw;
            letter-spacing: 0.3vw;
            line-height: 4.8vw;
          }
          .contract-context {
            padding: 9.9vw 13.7vw 11.2vw 13.7vw;
            background: white;
            .context-title {
              height: 4.4vw;
              line-height: 4.4vw;
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
              padding-top: 1.7vw;
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
          }
        }
      }
    }
  }
</style>
