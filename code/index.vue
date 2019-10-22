<template>
  <div class="code-page demo-page">
    <title :name="'打印店铺码'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="qrcode">
          <img :src="url" @click="showLogo"/>
        </div>
        <div class="code-title">
          请打印此码放置前台提供顾客扫描
        </div>
        <div class="code-info">
          <div>1、散客扫描此码可直接付款</div>
          <div>2、会员扫描后可直接打开电子会员卡</div>
          <div>3、散客可通过此码注册/购买会员</div>
        </div>
        <div class="button">
          <span @click="saveImg">保存图片</span>
        </div>
        <div class="no-alipay" v-if="isAccount==false">
          <div>
            注意：您还没有设置收款账户，顾客付款后您将无法取到该款项。
            <span @click="jumpToAccount">马上去设置</span>
          </div>
        </div>
        <div class="no-alipay" v-if="isAccount==true">
          <div>
            依各商户意见，现提供赠送台牌活动，仅一万个，数量有限，送完即止。
            <span @click="jumpToTable">马上去领取</span>
          </div>
        </div>
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
        url: '',
        titleHeight: null,
        isAccount: true,
        account: null
      }
    },
    methods: {
      jumpToAccount () {
        const url = '../gathering/alipay/main?userId=' + this.userId + '&storeId=' + this.storeId + (this.account ? '&name=' + this.account.AccountName + '&account=' + this.account.AccountId + '&state=' + this.account.State : '')
        wx.navigateTo({url})
      },
      jumpToTable () {
        const url = '../service/table/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      getQrCode () {
        let that = this
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.$post('/store/businessGetStorePayQrCode', {Uid: this.userId, StoreId: this.storeId}).then(res => {
          that.url = res.PayQrCodeImg
          that.downloadUrl = res.DownloadImg
          setTimeout(function () {
            wx.hideLoading()
          }, 300)
        })
      },
      showLogo () {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [this.downloadUrl] // 需要预览的图片http链接列表
        })
      },
      saveImg () {
        let that = this
        wx.showLoading({title: '加载中...'})
        console.log(that.downloadUrl)
        wx.downloadFile({
          url: that.downloadUrl,
          success: function (res) {
            console.log(res)
            if (res.errMsg === 'downloadFile:ok') {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail: function () {
                  wx.hideLoading()
                }
              })
            }
          }
        })
      },
      getAccount () {
        let that = this
        this.$post('/store/businessGetStorePayAccount', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          if (res) {
            that.account = res
            that.isAccount = true
          } else {
            that.isAccount = false
          }
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.isAccount = true
      this.account = null
      this.url = ''
      this.getQrCode()
      this.getAccount()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .code-page {
    height: 100vh;
    background-color: #79bc6d;
    .qrcode {
      text-align: center;
      padding-top: 7vh;
      img {
        display: inline-block;
        width: 50vw;
        height: 50vw;
      }
    }
    .code-title {
      font-size: rpx(30);
      padding: 1vh 0;
      text-align: center;
      color: white;
    }
    .code-info {
      margin-left: 25vw;
      font-size: rpx(25);
      padding-top: 1vh;
      color: white;
    }
    .button {
      text-align: center;
      padding-top: 4vh;
      color: white;
      span {
        display: inline-block;
        width: 32vw;
        height: 10vw;
        line-height: 10vw;
        text-align: center;
        font-size: rpx(32);
        border-radius: rpx(35);
        background-color: #ff6700;
      }
    }
    .no-alipay {
      padding: 10vw;
      font-size: 3.5vw;
      line-height: 6vw;
      div {
        border-radius: 3vw;
        background: #ffedad;
        color: #ff1109;
        padding: 2vw 4vw;
      }
      span {
        color: #003d82;
        text-decoration: underline;
      }
    }
  }
</style>
