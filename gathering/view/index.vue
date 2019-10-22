<template>
  <div class="gathering-view-page">
    <div class="gathering-title-bg" :style="{height:titleHeight+'px'}">
    </div>
    <div class="gathering-create-bg">
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/gathering-bg.png" v-if="type==0"/>
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/gathering-bg2.png" v-if="type==1"/>
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/gathering-bg3.png" v-if="type==2"/>
    </div>
    <div class="create-context-tabs">
        <span class="first-tab" :class="type==0?'select':''">
          <div class="tab-top">
            <span>个人</span>
          </div>
          <div class="tab-bottom"></div>
          <div class="tab-top tab-shadow"></div>
          <div class="tab-bottom"></div>
        </span>
      <span class="first-tab second-tab" :class="type==1?'select':''">
          <div class="tab-top">
            <span>个体工商户</span>
          </div>
          <div class="tab-bottom"></div>
          <div class="tab-top tab-shadow"></div>
          <div class="tab-bottom"></div>
        </span>
      <span class="first-tab thrid-tab" :class="type==2?'select':''">
          <div class="tab-top">
            <span>企业/公司</span>
          </div>
          <div class="tab-bottom"></div>
          <div class="tab-top tab-shadow"></div>
          <div class="tab-bottom"></div>
        </span>
    </div>
    <title :name="'查看资料'" :noline="true" :service="true" :background="'rgba(240, 240, 240, 0)'"
           :color="'#ffffff'"></title>
    <scroll-view class="gathering-create-scroll" scroll-y="true">
      <div class="gathering-create-main" :style="{'min-height':'90vh'}">
        <div class="gathering-create-context">
          <div class="create-context" v-if="!isFirstLoad">
            <form @submit="submit">
              <div class="create-items" :class="isSaving?'error-items':''"
                   v-if="!(state!=-4&&state!=-3&&info.State==-4)">
                <inputBox :name="'店铺简称'" :request="true" :placeholder="'请填写简称'" :remark="'它有什么作用'"
                          :value="info.StoreSimpleName" :keyword="'StoreSimpleName'" @showRemark="showRemark"
                          :disabled="isDisabled"></inputBox>
                <inputBox :name="'联系人'" :request="true" :placeholder="'请填写联系人'"
                          :value="info.MerContactName" :keyword="'MerContactName'"
                          :disabled="isDisabled"></inputBox>
                <inputBox :name="'手机号'" :request="true" :placeholder="'真实手机号'"
                          :type="'number'"
                          :value="info.MerContactPhone" :keyword="'MerContactPhone'"
                          :disabled="isDisabled"></inputBox>
                <inputBox :name="'邮箱'" :request="true" :placeholder="'常用邮箱'"
                          :value="info.StoreEmail" :keyword="'StoreEmail'"
                          :disabled="isDisabled"></inputBox>
                <inputBox :name="'支付宝账号'" :request="true" :placeholder="'邮箱或手机号'" :remark="'在哪里查找'"
                          :value="info.AlipayAccount" :keyword="'AlipayAccount'" @showRemark="showRemark"
                          :disabled="isDisabled"></inputBox>
                <inputBox :name="'开户行地区'" :request="true" :type="'select'"
                          :keyword="'MerBank'" @addressChange="addressChange"
                          :provinceId="info.MerBankProvince" :cityId="info.MerBankCity"
                          :countryId="info.MerBankDistrict"
                          :disabled="isDisabled"></inputBox>
                <div v-if="showBank">
                  <inputBox :name="'开户行'" :request="true" :type="'bank'" :bankId="info.MerBankCode"
                            :keyword="'MerBankCode'" @bankChange="bankChange"
                            :disabled="isDisabled"></inputBox>
                  <div v-if="needBranch">
                    <div v-if="showBranch">
                      <inputBox :name="'开户支行'" :request="true" :type="'branch'"
                                :keyword="'MerBankBranchCode'" @bankChange="bankChange"
                                :bankId="info.MerBankBranchCode"
                                :provinceId="info.MerBankProvince" :cityId="info.MerBankCity"
                                :countryId="info.MerBankDistrict" :bankCode="info.MerBankCode"
                                :disabled="isDisabled"></inputBox>
                    </div>
                    <div class="gathering-box" v-if="!showBranch">
                      <div class="input" :style="{'border-bottom-color':isSaving?'red':''}">
                        <span class="name">
                          开户支行
                          <text>*</text>
                        </span>
                        <span style="color: #C4C4C4;width: 65%">
                          {{info.MerBankProvince && info.MerBankCode ? '' : '请先选择开户地区和开户行'}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="type==0">
                  <inputBox :name="'商户所在省份'" :request="true" :type="'select'"
                            :keyword="'Mer'" @addressChange="addressChange"
                            :provinceId="info.MerProvince" :cityId="info.MerCity"
                            :countryId="info.MerDistrict"
                            :disabled="isDisabled"></inputBox>
                  <inputBox :name="'商户详细地址'" :request="true" :placeholder="'请填写街道、门牌号'"
                            :value="info.MerAddress" :keyword="'MerAddress'"
                            :disabled="isDisabled"></inputBox>
                </div>
                <div class="photo-item">
                  <span class="item-name">身份证<text>*</text></span>
                  <span class="item-value" style="padding-right: 5.4vw"
                        @click="isDisabled?viewPhoto(info.ImgIdcardFornt):upload='ImgIdcardFornt'">
                    <span v-if="!info.ImgIdcardFornt">正面</span>
                    <div v-if="info.ImgIdcardFornt" :style="{'background-image':'url('+info.ImgIdcardFornt+')'}"></div>
                  </span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgIdcardBack):upload='ImgIdcardBack'">
                    <span v-if="!info.ImgIdcardBack">反面</span>
                    <div v-if="info.ImgIdcardBack" :style="{'background-image':'url('+info.ImgIdcardBack+')'}"></div>
                  </span>
                </div>
                <div class="photo-item">
                  <span class="item-name">银行卡<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgBankCard):upload='ImgBankCard'">
                    <span v-if="!info.ImgBankCard">正面</span>
                    <div v-if="info.ImgBankCard" :style="{'background-image':'url('+info.ImgBankCard+')'}"></div>
                  </span>
                </div>
                <div class="photo-item" v-if="type!=0">
                  <span class="item-name">营业执照<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgCorpCode):upload='ImgCorpCode'">
                    <span v-if="!info.ImgCorpCode">上传</span>
                    <div v-if="info.ImgCorpCode" :style="{'background-image':'url('+info.ImgCorpCode+')'}"></div>
                  </span>
                </div>
                <div class="photo-item" v-if="type==2">
                  <span class="item-name">开户许可证<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgOpBankCode):upload='ImgOpBankCode'">
                    <span v-if="!info.ImgOpBankCode">上传</span>
                    <div v-if="info.ImgOpBankCode" :style="{'background-image':'url('+info.ImgOpBankCode+')'}"></div>
                  </span>
                </div>
                <div class="photo-item">
                  <span class="item-name">门头照<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgShopPhoto):upload='ImgShopPhoto'">
                    <span v-if="!info.ImgShopPhoto">上传</span>
                    <div v-if="info.ImgShopPhoto" :style="{'background-image':'url('+info.ImgShopPhoto+')'}"></div>
                  </span>
                </div>
                <div class="photo-item">
                  <span class="item-name">前台照<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgCashierScene):upload='ImgCashierScene'">
                    <span v-if="!info.ImgCashierScene">上传</span>
                    <div v-if="info.ImgCashierScene"
                         :style="{'background-image':'url('+info.ImgCashierScene+')'}"></div>
                  </span>
                </div>
                <div class="photo-item">
                  <span class="item-name">店内全景<text>*</text></span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgPanoramic):upload='ImgPanoramic'">
                    <span v-if="!info.ImgPanoramic">上传</span>
                    <div v-if="info.ImgPanoramic" :style="{'background-image':'url('+info.ImgPanoramic+')'}"></div>
                  </span>
                </div>
                <div class="photo-item" v-if="type==3">
                  <span class="item-name">店内手持营业执照</span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgStoreCorpCode):takeAll('ImgStoreCorpCode')">
                    <span v-if="!info.ImgStoreCorpCode"
                          style="border: 0.1vw solid #BFBFBF;background: rgba(241, 241, 241, 1);color: #BDBDBD;">上传</span>
                    <div v-if="info.ImgStoreCorpCode"
                         :style="{'background-image':'url('+info.ImgStoreCorpCode+')'}"></div>
                  </span>
                </div>
                <div class="photo-item" v-if="type==3">
                  <span class="item-name">门头手持营业执照</span>
                  <span class="item-value"
                        @click="isDisabled?viewPhoto(info.ImgHandCorpCode):takeAll('ImgHandCorpCode')">
                    <span v-if="!info.ImgHandCorpCode"
                          style="border: 0.1vw solid #BFBFBF;background: rgba(241, 241, 241, 1);color: #BDBDBD;">上传</span>
                    <div v-if="info.ImgHandCorpCode"
                         :style="{'background-image':'url('+info.ImgHandCorpCode+')'}"></div>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 5vw">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="upload-dialog"
         v-if="upload"
         @click="upload=null">
      <div class="upload-context" @click.stop="">
        <div class="context-picture">
          <img style="width: 68.3vw;height: 43.4vw;"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/xukezheng.png"
               v-if="upload=='ImgOpBankCode'"/>
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/face.jpg" v-if="upload=='ImgIdcardFornt'"/>
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/back.jpg" v-if="upload=='ImgIdcardBack'"/>
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/bank.jpg" v-if="upload=='ImgBankCard'"/>
          <img style="width: 68.3vw;height: 58.9vw;"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/yingyezhizhao.png"
               v-if="upload=='ImgCorpCode'"/>
          <img style="width: 68.3vw;height: 38.2vw;"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/qiantaizhao.png"
               v-if="upload=='ImgCashierScene'"/>
          <img style="width: 68.3vw;height: 43.4vw;"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/dianneiquanjing.png"
               v-if="upload=='ImgPanoramic'"/>
          <img style="width: 68.3vw;height: 38.2vw;"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/mentouzhao.png"
               v-if="upload=='ImgShopPhoto'"/>
        </div>
        <div class="context-title">
          注意：身份证、银行卡、支付宝必须为同一人
        </div>
        <div class="context-item" @click.stop="takePhoto">
          拍照
        </div>
        <div class="context-item" @click.stop="choosePhoto">
          从相册选择
        </div>
      </div>
    </div>
    <div class="remark-dialog"
         v-if="remark!=null">
      <div class="remark-context">
        <div class="context-picture">
          <img v-if="remark=='AlipayAccount'" style="height: 61vw;width: 48.1vw"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/alipayhelp.jpg"/>
          <img v-if="remark=='StoreSimpleName'" style="width: 61vw;height: 48.1vw"
               src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/store-pay.png"/>
        </div>
        <div class="context-item" @click="remark=null">
          知道了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import inputBox from '@/components/gatheringbox'

  export default {
    components: {
      title, inputBox
    },

    data () {
      return {
        info: {},
        weixin: {},
        type: 0,
        upload: null,
        remark: null,
        isDisabled: false,
        isSaving: false,
        isFirstLoad: true,
        showBank: false,
        needBranch: false,
        showBranch: false,
        state: -4, // 状态 -4未创建 -3未通过 -1提交升级 0正在审核 1通过审核 10已通过
        titleHeight: null
      }
    },
    methods: {
      showRemark (name) {
        this.remark = name
      },
      takeAll (upload) {
        if (this.isDisabled) {
          return
        }
        this.upload = upload
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera', 'album'],
          success (res) {
            that.uploadImg(res.tempFilePaths[0])
          }
        })
      },
      takePhoto () {
        if (this.isDisabled) {
          return
        }
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success (res) {
            that.uploadImg(res.tempFilePaths[0])
          }
        })
      },
      choosePhoto () {
        if (this.isDisabled) {
          return
        }
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success (res) {
            that.uploadImg(res.tempFilePaths[0])
          }
        })
      },
      uploadImg (src) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        let that = this
        wx.uploadFile({
          url: that.url + '/Common/uploadFileForXcx',
          filePath: src,
          name: 'file',
          formData: {
            Uid: that.userId,
            StoreId: that.storeId,
            Type: 3,
            FileType: 0
          },
          success: function (res) {
            let data = JSON.parse(res.data)
            that.info[that.upload] = data.Data[0].FilePath
            wx.hideLoading()
            if (that.upload === 'ImgBankCard') {
              that.checkBankCode()
            }
            that.upload = null
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      viewPhoto (url) {
        if (url) {
          wx.previewImage({
            urls: [url]
          })
        }
      },
      addressChange (type, data) {
        if (type === 'MerBank') {
          this.info.MerBankProvince = data[0]
          this.info.MerBankCity = data[1]
          this.info.MerBankDistrict = data[2]
          if (this.showBranch) {
            this.showBranch = false
            setTimeout(function () {
              this.showBranch = true
            }.bind(this), 200)
          } else if (this.info.MerBankCode) {
            this.showBranch = true
          }
        } else {
          this.info.MerProvince = data[0]
          this.info.MerCity = data[1]
          this.info.MerDistrict = data[2]
        }
        this.changeData += 1
      },
      bankChange (name, value) {
        this.info[name] = value
        if (this.showBranch && name === 'MerBankCode') {
          this.showBranch = false
          setTimeout(function () {
            this.showBranch = true
          }.bind(this), 200)
        } else if (this.info.MerBankProvince) {
          this.showBranch = true
        }
        this.changeData += 1
      },
      checkBankCode () {
        let that = this
        that.showBank = false
        this.$post('/base/getBankName', {
          BankCardImg: that.info.ImgBankCard,
          Uid: that.userId,
          StoreId: that.storeId
        }, true).then(res => {
          if (res.BankNameCode) {
            that.info.MerBankCode = res.BankNameCode
            that.needBranch = res.IsNeedBankBranch
          } else {
            that.needBranch = true
          }
          that.showBank = true
        })
      },
      getGatheringInfo () {
        let that = this
        this.$post('/merchant/businessCertificationGetInfo', {
          Uid: that.userId,
          StoreId: that.storeId
        }, true).then(res => {
          if (res) {
            that.info = res
            res.State = -1
            res.StoreType = that.type
            that.state = res.State
            if (res.MerBankCode) {
              that.showBank = true
            }
            if (res.MerBankProvince && res.MerBankCode && res.MerBankBranchCode) {
              that.showBranch = true
              that.needBranch = true
            }
            // that.changeType(that.type)
          }
          that.isFirstLoad = false
        })
      },
      getWeixinInfo () {
        let that = this
        this.$post('/merchant/businessCertificationGetMerState', {
          Uid: that.userId,
          StoreId: that.storeId
        }, true).then(res => {
          if (res) {
            that.weixin = res
          }
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.type = option.type * 1
      this.isDisabled = true
      this.isSaving = false
      this.isFirstLoad = true
      this.showBranch = false
      this.showBank = false
      this.needBranch = false
      this.getGatheringInfo()
      this.url = this.getGlobalUrl().url
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .gathering-view-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .gathering-create-bg {
      position: fixed;
      width: 100vw;
      height: 37vw;
      top: 0;
      left: 0;
      overflow: hidden;
      z-index: 100;
      img {
        width: 100vw;
        height: 53vw;
        position: relative;
        top: -8vw;
      }
    }
    .create-context-tabs {
      position: fixed;
      top: 27.9vw;
      height: 9.1vw;
      left: 3.7vw;
      span {
        display: inline-block;
      }
      .first-tab {
        width: 33.3vw;
        height: 9.1vw;
        position: relative;
        .tab-top {
          position: absolute;
          top: 0.5vw;
          left: 0.5vw;
          height: 7.1vw;
          width: 25vw;
          background: #999999;
          overflow: hidden;
          border-top-left-radius: 1vw;
          border-top-right-radius: 1vw;
          text-align: center;
          box-sizing: border-box;
          font-size: 3.7vw;
          color: #fff;
          padding-top: 2.2vw;
          z-index: 4;
          span {
            display: inline-block;
            height: 3.5vw;
            line-height: 3.5vw;
          }
          .tab-already {
            transform: rotate(45deg);
            position: absolute;
            font-size: 1.6vw;
            height: 2.8vw;
            line-height: 2.8vw;
            width: 10vw;
            right: -2.5vw;
            top: 1vw;
            background: #78BC6D;
            color: white;
          }
        }
        .tab-bottom {
          position: absolute;
          bottom: 0vw;
          left: 0;
          height: 0;
          width: 25vw;
          border-width: 0 0.5vw 2vw 0.5vw;
          border-style: none solid solid;
          border-color: transparent transparent #999999;
          z-index: 3;
        }
        .tab-shadow {
          box-shadow: 0vw 0 1.5vw 0.4vw rgba(0, 0, 0, 0.08);
          z-index: 1;
        }
      }
      .thrid-tab {
        width: 26vw;
      }
      .select {
        .tab-top {
          background: white;
          color: #000000;
        }
        .tab-bottom {
          border-color: transparent transparent white;
        }
      }
      z-index: 101;
    }
    .gathering-title-bg {
      position: fixed;
      width: 100vw;
      top: 0;
      left: 0;
      background: linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0));
      z-index: 150;
    }
    .gathering-create-scroll {
      height: 100vh;
      position: fixed;
      top: 0;
      z-index: 10;
      .gathering-create-main {
        .gathering-create-context {
          padding: 36.9vw 3.7vw 0 3.7vw;
          .create-context {
            background: rgba(255, 255, 255, 1);
            border-bottom-left-radius: 1.9vw;
            border-bottom-right-radius: 1.9vw;
            box-shadow: 0vw 0.5vw 3vw 1vw rgba(0, 0, 0, 0.08);
            padding-top: 4vw;
            padding-bottom: 10vw;
            position: relative;
            z-index: 2;
            .create-remark {
              box-sizing: border-box;
              padding: 3vw 6.3vw;
              background: #fff4ce;
              font-size: 3.1vw;
              color: rgba(119, 84, 23, 1);
              line-height: 5.2vw;
              letter-spacing: 0.4vw;
              .remark-item {
                span {
                  display: inline-block;
                  vertical-align: top;
                  &:nth-child(1) {
                    width: 7%;
                  }
                  &:nth-child(2) {
                    width: 93%;
                  }
                }
              }
            }
            .create-state {
              height: 34vw;
              padding-bottom: 4vw;
              position: relative;
              .state-fail {
                padding-top: 6vw;
                text-align: center;
                .fail-icon {
                  height: 8.3vw;
                  img {
                    display: inline-block;
                    vertical-align: top;
                    width: 7.8vw;
                    height: 7.8vw;
                  }
                }
                .fail-title {
                  padding-top: 2vw;
                  font-size: 3.5vw;
                  color: #FB462A;
                  height: 3vw;
                  line-height: 3vw;
                  padding-bottom: 1vw;
                }
                .fail-context {
                  height: 2.8vw;
                  line-height: 3.3vw;
                  color: #AAAAAA;
                  font-size: 2.8vw;
                }
              }
              .state-success {
                padding-top: 7.7vw;
                span {
                  display: inline-block;
                  vertical-align: top;
                }
                .success-icon {
                  padding-left: 23.1vw;
                  padding-top: 0.5vw;
                  width: 7.1vw;
                  height: 7.1vw;
                  padding-right: 2.6vw;
                  img {
                    display: inline-block;
                    vertical-align: top;
                    width: 7.1vw;
                    height: 7.1vw;
                  }
                }
                .success-title {
                  font-size: 2.8vw;
                  color: #FB841F;
                  height: 2.8vw;
                  line-height: 2.8vw;
                  padding-bottom: 0.5vw;
                }
                .success-context {
                  line-height: 3.7vw;
                  color: #AAAAAA;
                  font-size: 2.4vw;
                }
              }
              .state-bottom {
                height: 3.1vw;
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                background: #F0F0F0;
              }
            }
            .create-weixin {
              padding: 1.8vw 5vw 0 5vw;
              .weixin-item {
                height: 11.3vw;
                line-height: 11.3vw;
                border-bottom: 0.1vw solid #BCBCBC;
                span {
                  display: inline-block;
                  vertical-align: top;
                  height: 11.3vw;
                  line-height: 11.3vw;
                  font-size: 3.3vw;
                  &:nth-child(1) {
                    width: 85%;
                    color: black;
                  }
                  &:nth-child(2) {
                    width: 15%;
                    text-align: right;
                    color: #FF0000;
                  }
                }
              }
            }
            .create-success {
              .create-success-top {
                height: 3.1vw;
                background: #f0f0f0;
                position: relative;
                top: -0.2vw;
              }
              .create-success-context {
                text-align: center;
                padding: 5.7vw 6.5vw 0 6.5vw;
                .context-success {
                  padding: 4.3vw 6vw;
                  background: rgba(241, 241, 241, 1);
                  border-radius: 1.9vw;
                  text-align: left;
                  .success-title {
                    font-size: 4.4vw;
                    color: rgba(55, 183, 52, 1);
                    padding-bottom: 3vw;
                  }
                  .success-text {
                    line-height: 5.6vw;
                    font-size: 2.8vw;
                    padding-bottom: 4.5vw;
                  }
                  .success-card {
                    width: 52vw;
                    height: 33vw;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                .success-button {
                  padding-top: 11vw;
                  span {
                    display: inline-block;
                    width: 56.8vw;
                    height: 11.4vw;
                    line-height: 11.3vw;
                    box-sizing: border-box;
                    border: 0.1vw solid rgb(255, 103, 0);
                    border-radius: 1.9vw;
                    color: rgb(255, 103, 0);
                    font-size: 4.4vw;
                  }
                }
              }
            }
            .create-items {
              padding: 3vw 4.8vw;
              .photo-item {
                padding-top: 4.3vw;
                height: 13.6vw;
                span {
                  display: inline-block;
                  vertical-align: top;
                }
                text {
                  color: red;
                }
                .item-name {
                  height: 3.4vw;
                  line-height: 3.4vw;
                  padding-top: 1.6vw;
                  font-size: 3.7vw;
                  color: #181818;
                  width: 21vw;
                }
                .item-value {
                  width: 25.2vw;
                  height: 13.6vw;
                  span {
                    width: 25.2vw;
                    height: 13.6vw;
                    line-height: 13.5vw;
                    border-radius: 1.9vw;
                    box-sizing: border-box;
                    text-align: center;
                    font-size: 2.6vw;
                    border: 0.1vw solid #BFBFBF;
                    background: rgba(241, 241, 241, 1);
                    color: #BDBDBD;
                  }
                  div {
                    display: inline-block;
                    width: 25.2vw;
                    height: 13.6vw;
                    line-height: 13.5vw;
                    border-radius: 1.9vw;
                    background-color: rgba(241, 241, 241, 1);
                    background-size: 100%, 100%;
                    background-repeat: no-repeat;
                    background-position: center;
                  }
                  img {
                    display: inline-block;
                    width: 25.2vw;
                    height: 13.6vw;
                    border-radius: 1.9vw;
                  }
                }
              }
            }
            .error-items {
              .photo-item {
                .item-value {
                  span {
                    border: rpx(1) solid red !important;
                    background-color: #fff0f0 !important;
                    color: red !important;
                  }
                }
              }
            }
            .create-button {
              padding: 11.4vw 18.5vw 0vw 18.5vw;
              text-align: center;
              button {
                width: 55.6vw;
                height: 11.1vw;
                line-height: 11.1vw;
                display: inline-block;
                background: rgb(255, 103, 0);
                border-radius: 5.5vw;
                color: rgba(255, 255, 255, 1);
                font-size: 4.3vw;
              }
            }
          }
        }
      }
      .demo-footer {
        background: rgba(255, 255, 255, 0) !important;
      }
    }
    .upload-dialog {
      height: 75vh;
      padding-top: 25vh;
      width: 100vw;
      position: fixed;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      top: 0;
      .upload-context {
        background: #ffffff;
        display: inline-block;
        width: 80.4vw;
        border-radius: 1.9vw;
        .context-picture {
          padding-top: 5.9vw;
          img {
            display: inline-block;
            width: 68.2vw;
            height: 38.1vw;
          }
        }
        .context-title {
          padding-top: 4vw;
          padding-bottom: 5.1vw;
          font-size: 3.3vw;
          height: 3.1vw;
          line-height: 3.1vw;
          color: rgba(23, 23, 23, 1);
        }
        .context-item {
          border-top: 0.1vw solid #BCBCBC;
          height: 12.2vw;
          line-height: 12.2vw;
          box-sizing: border-box;
          font-size: 4.1vw;
          color: rgba(55, 183, 52, 1);
        }
      }
    }
    .remark-dialog {
      height: 75vh;
      padding-top: 25vh;
      width: 100vw;
      position: fixed;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      top: 0;
      .remark-context {
        background: #ffffff;
        display: inline-block;
        width: 80.4vw;
        border-radius: 1.9vw;
        text-align: center;
        .context-picture {
          padding-top: 6.9vw;
          padding-bottom: 6.2vw;
          img {
            display: inline-block;
          }
        }
        .context-item {
          border-top: 0.1vw solid #BCBCBC;
          height: 15.3vw;
          line-height: 15.3vw;
          box-sizing: border-box;
          font-size: 4.4vw;
          color: rgba(55, 183, 52, 1);
        }
      }
    }
  }
</style>
