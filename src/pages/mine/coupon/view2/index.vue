<template>
  <div class="coupon-view2-page">
    <title :name="name"></title>
    <scroll-view class="coupon-create-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="coupon-create-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="card-state"
             :class="{'state-open':state,'state-close':!state}">
          <span>
            <text v-if="state==1">状态：已启用</text>
            <text
              v-if="state==0">状态：{{stateReason == 0 ? '已暂停' : stateReason == 1 ? '已暂停' : stateReason == 2 ? '已达到发行数量上限' : '优惠券截止日期已过'}}</text>
          </span>
          <span>
            <switch :checked="state" @change="switchChange" color="#78BC6D"/>
          </span>
        </div>
        <div class="coupon-create-context">
          <div class="same-coupon" v-for="(item,index) in cards">
            <div v-if="item.Coupons">
              <div v-for="(itemCoupon,index2) in item.Coupons">
                <coupon :coupon="itemCoupon"></coupon>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='4'">
              <div class="input-item">
                <span class="item-4">计算规则</span>
                <span class="item-5">{{item.IsOnlyOne ? '单次' : '累计'}}</span>
              </div>
              <div class="input-item">
                <span class="item-4">消费方式</span>
                <span class="item-5">{{item.ConsumptionType == 2 ? '卡内消费' : '仅付款'}}</span>
              </div>
              <div class="input-item">
                <span class="item-1">金额达到</span>
                <span class="item-2">{{item.MeetAmountMin ? item.MeetAmountMin + '元' : ''}}</span>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='5'">
              <div class="input-item">
                <span class="item-4">发放时间</span>
                <span class="item-5">{{item.SendGroupDate ? item.SendGroupDate : ''}}</span>
              </div>
              <div class="input-item">
                <span class="item-4">发放次数</span>
                <span class="item-5">
                  {{item.SendGroupTimes == 2 ? '按月发送' : item.SendGroupTimes == 3 ? '按年发送' : '只发一次'}}
                </span>
              </div>
              <div class="input-item">
                <span class="item-4">发放群体</span>
                <span class="item-5">全部会员</span>
              </div>
            </div>
            <div class="inputs" style="padding-top: 2vw" v-if="type=='6'">
              <div class="input-item">
                <span class="item-4">微信分享限制</span>
                <span class="item-5" v-if="item.ShareRegularCount>0">每次仅限{{item.ShareRegularCount}}名顾客领取</span>
                <span class="item-5" v-if="item.ShareRegularCount<=0">无限制</span>
              </div>
            </div>
            <div class="context-num" @click="jumpToReport(item)" :style="{'padding-top':type=='6'?'5vw':''}">
              <span>
                <div class="num-top">{{item.TotalSendCount}}</div>
                <div class="num-bottom">共发放 (张)</div>
              </span>
              <span>
                <div class="num-top">{{item.UsedCount}}</div>
                <div class="num-bottom">已使用 (张)</div>
              </span>
              <span>
                <div class="num-top">{{item.NoUsedCount}}</div>
                <div class="num-bottom">未使用 (张)</div>
              </span>
            </div>
            <div class="share-context" v-if="type=='6'">
              <div class="share-top"></div>
              <div class="share-logos">
                <span @click="openQrCodeDialog(item.CouponCenterId)">
                  <div class="share-logo">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-code.png"/>
                  </div>
                  <div class="share-name" style="color:#46218b;">
                    二维码
                  </div>
                </span>
                <span v-for="(itemCoupon,index2) in item.Coupons"
                      @click="openImageDialog(item.CouponCenterId,itemCoupon)">
                  <div class="share-logo">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-image.png"/>
                  </div>
                  <div class="share-name" style="color: #1498a8;">
                    分享朋友圈
                  </div>
                </span>
                <span @click="jumpToNutCard(item.CouponCenterId)">
                  <div class="share-logo">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-group.png"/>
                  </div>
                  <div class="share-name" style="color: #029700;">
                    微信分享
                  </div>
                </span>
              </div>
            </div>
            <span class="option-state" v-if="type=='5'" :style="{filter:item.State == 1?'':'grayscale(1)'}">
              <span>{{item.State == 1 ? '未开始' : '已发放'}}</span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/sale.png"/>
            </span>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="share-dialog" :class="{'hide-dialog':!showDialog}" :animation="animationBg">
      <div class="share-context" :animation="animationContext">
        <div class="share-canvas" :style="{height:isQrCode?'72vw':'96.7vw',padding:isQrCode?'13vw 0':'0'}">
          <img :src="isQrCode?shareCode:shareImagePath" style="width: 100%;height: 100%"/>
        </div>
        <div class="share-buttons">
          <span>
            <div @click="closeDialog">关闭</div>
          </span>
          <span>
            <div style="background: #ff6700" @click="downloadImage">
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/download-img.png"/>
              <text>下载</text>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="share-dialog"
         style="width: 100vw;height: 100vh;position: fixed;bottom: -200vh;opacity: 1;z-index: 1000;padding: 0;"
         :style="{bottom:showDialog?'-200vh':'-200vh'}">
      <div class="share-context" style="width: 100vw;height: 100vh;left: 0;top: 0;padding: 0;">
        <canvas canvas-id="shareImg" class="share-canvas" style="width: 100vw;height: 134.3vw;"
                disable-scroll="true"></canvas>
      </div>
    </div>
    <div class="coupon-setting" @click="jumpToEdit">
      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-setting.png"/>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import card from '@/components/card'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, card, coupon
    },

    data () {
      return {
        cards: [],
        name: '',
        type: '',
        state: 0,
        stateReason: '',
        changeData: 0,
        cardIndex: 0,
        topUrl: '',
        bottomUrl: '',
        bgUrl: '',
        shareCode: '',
        shareImagePath: '',
        animationBg: {},
        animationContext: {},
        isQrCode: false,
        showDialog: false,
        titleHeight: null
      }
    },
    methods: {
      jumpToEdit () {
        let url = '../create2/main?edit=1&userId=' + this.userId + '&storeId=' + this.storeId + '&type=' + this.type
        wx.navigateTo({url})
      },
      jumpToReport (item) {
        wx.setStorageSync('couponCenter', item)
        let url = '../details/main?userId=' + this.userId + '&storeId=' + this.storeId
        wx.navigateTo({url})
      },
      jumpToNutCard (id) {
        let that = this
        this.$post('/couponCenter/businessShareCouponGetRandomParam', {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterId: id
        }, true).then(res => {
          let path = 'pages/coupon/main?storeId=' + that.storeId + '&userId=' + that.userId + '&couponCenterId=' + id + '&param=' + res.RandomParam
          let url = that.getGlobalUrl().url
          if (url.indexOf('test') > 0) {
            path += '&type=test'
          } else if (url.indexOf('home') > 0) {
            path += '&type=home'
          }
          that.jumpToCoupon(path)
        })
      },
      jumpToCoupon (path) {
        console.log(path)
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: path,
          envVersion: 'trial'
        })
      },
      switchChange (e) {
        let that = this
        this.$post('/storeCouponCenter/businessStoreCouponCenterSet', {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterType: this.type,
          State: this.state ? 0 : 1
        }, true).then(res => {
          that.state = that.state ? 0 : 1
          that.$success('修改成功', true)
        })
      },
      downloadImage () {
        let that = this
        wx.saveImageToPhotosAlbum({
          filePath: that.isQrCode ? that.shareCode : that.shareImagePath,
          success: function () {
            that.$success('下载成功', false, function () {
              that.closeDialog()
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      openImageDialog (id, item) {
        let that = this
        this.isQrCode = false
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.getQrcode(id, function (res) {
          wx.getImageInfo({
            src: res.QrCodeUrl + '?x-oss-process=image/quality,q_40',
            success: function (resp) {
              that.shareCode = resp.path
              if (item.CouponType !== 3) {
                that.drawCanvasContext(item, null, function () {
                  wx.hideLoading()
                  that.showDialog = true
                  that.openDialogAnimation()
                })
              } else {
                wx.getImageInfo({
                  src: item.CouponIcon + '?x-oss-process=image/quality,q_40',
                  success: function (resp2) {
                    that.drawCanvasContext(item, resp2.path, function () {
                      wx.hideLoading()
                      that.showDialog = true
                      that.openDialogAnimation()
                    })
                  }
                })
              }
            }
          })
        })
      },
      openQrCodeDialog (id) {
        let that = this
        that.isQrCode = true
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.getQrcode(id, function (res) {
          wx.getImageInfo({
            src: res.QrCodeUrl + '?x-oss-process=image/quality,q_40',
            success: function (resp) {
              that.shareCode = resp.path
              wx.hideLoading()
              that.showDialog = true
              that.openDialogAnimation()
            }
          })
        })
      },
      openDialogAnimation () {
        let animationBg = wx.createAnimation()
        animationBg.opacity(1).step({duration: 200})
        this.animationBg = animationBg.export()
        let animationContext = wx.createAnimation()
        animationContext.top(this.titleHeight + 'px').step({duration: 200})
        this.animationContext = animationContext.export()
      },
      closeDialog () {
        let animationBg = wx.createAnimation()
        animationBg.opacity(0).step({duration: 200})
        this.animationBg = animationBg.export()
        let animationContext = wx.createAnimation()
        animationContext.top('20vh').step({duration: 200})
        this.animationContext = animationContext.export()
        setTimeout(function () {
          this.showDialog = false
        }.bind(this), 250)
      },
      getCouponCenter () {
        let that = this
        this.$post('/couponCenter/businessCouponCenterInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsByUserLevel: -1,
          CouponCenterType: this.type
        }, this.firstLoad).then(res => {
          that.state = res.State
          that.stateReason = res.StateReason
          for (let item of res.CouponCenterInfos) {
            item.Coupons = [that.calcCoupon(item.Coupons[0])]
          }
          that.cards = res.CouponCenterInfos
          that.firstLoad = false
          if (!res || !res.CouponCenterInfos || res.CouponCenterInfos.length === 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      getStoreInfo () {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsNotDefaultData: true
        }, this.firstLoad).then(res => {
          wx.getImageInfo({
            src: res.StoreLogo + '?x-oss-process=image/quality,q_40',
            success: function (resp) {
              wx.hideLoading()
              res.StoreLogo = resp.path
              that.store = res
              that.firstLoad = false
            }
          })
        })
      },
      getQrcode (id, callback) {
        this.$post('/couponCenter/businessCouponQrCodeShare', {
          Uid: this.userId,
          StoreId: this.storeId,
          CouponCenterId: id
        }).then(res => {
          callback(res)
        })
      },
      calcName () {
        this.cards = [{}]
        switch (this.type) {
          case '1':
            this.name = '开卡送券'
            break
          case '2':
            this.name = '续费送券'
            break
          case '3':
            this.name = '生日送券'
            break
          case '4':
            this.name = '满送券'
            break
          case '5':
            this.name = '群发券'
            break
          case '6':
            this.name = '定向券'
            break
        }
      },
      calcCoupon (coupon) {
        if (coupon.CouponType === 1) {
          let values = (coupon.CouponValue + '').split('.')
          coupon.value1 = values[0]
          if (values.length === 2) {
            coupon.value2 = values[1]
          } else {
            coupon.value2 = 0
          }
        }
        return coupon
      },
      uploadImages () {
        let that = this
        wx.getImageInfo({
          src: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/sharecoupon-bg.jpg' + '?x-oss-process=image/quality,q_50',
          success: function (resp) {
            that.bgUrl = resp.path
          }
        })
        wx.getImageInfo({
          src: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/coupon-top.png' + '?x-oss-process=image/quality,q_80',
          success: function (resp) {
            that.topUrl = resp.path
          }
        })
        wx.getImageInfo({
          src: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/coupon-bottom.png' + '?x-oss-process=image/quality,q_80',
          success: function (resp) {
            that.bottomUrl = resp.path
          }
        })
      },
      drawCanvasContext (coupon, image, callback) {
        let that = this
        const sysInfo = wx.getSystemInfoSync()
        const width = sysInfo.screenWidth
        const height = sysInfo.screenWidth * 1.343
        const context = wx.createCanvasContext('shareImg')
        context.save()
        // 活动背景
        context.save()
        context.drawImage(this.bgUrl, 0, 0, width, height)
        context.draw(true)
        // 绘制头像
        context.beginPath()
        context.setFillStyle('rgba(44, 63, 71, 1)')
        context.arc(width * 0.5, width * 0.17, width * 0.09, 0, 2 * Math.PI)
        context.fill()
        context.clip()
        context.drawImage(this.store.StoreLogo, width * 0.41, width * 0.08, width * 0.18, width * 0.18)
        context.restore()
        context.draw(true)
        // 推荐者名称
        context.beginPath()
        context.setFillStyle('#ffffff')
        context.setTextAlign('center')
        context.setFontSize(0.046 * width)
        context.fillText(this.store.StoreName, 0.5 * width, 0.318 * width, width)
        context.draw(true)
        // 标题背景
        context.save()
        context.drawImage(this.bottomUrl, 0.03 * width, 0.4 * width, 0.94 * width, 0.456 * width)
        context.draw(true)
        // 券背景
        context.save()
        context.drawImage('https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-bg.png', 0.095 * width, 0.47 * width, 0.8 * width, 0.21 * width)
        context.draw(true) // 0.92
        // 券内容
        context.save()
        context.setFillStyle('#ff6700')
        context.setTextAlign('left')
        // 宽度 = 0.27 * width
        console.log('宽度:' + 0.27 * width)
        if (coupon.CouponType === 0) {
          context.setFontSize(0.07 * width)
          let $width = context.measureText('￥').width
          console.log('￥:' + $width)
          context.setFontSize(0.1 * width)
          let valueWidth = context.measureText(coupon.CouponValue + '').width
          console.log('valueWidth:' + valueWidth)
          if ($width + valueWidth > 0.27 * width) {
            context.setFontSize(0.07 * width)
            context.fillText('￥', 0.1 * width, 0.6 * width)
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + $width, 0.6 * width, 0.27 * width - $width)
          } else {
            let paddingLeft = (0.27 * width - $width - valueWidth) / 2
            console.log('valueWidth:' + paddingLeft)
            context.setFontSize(0.07 * width)
            context.fillText('￥', 0.1 * width + paddingLeft, 0.6 * width)
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + paddingLeft + $width, 0.6 * width)
          }
        } else if (coupon.CouponType === 1) {
          context.setFontSize(0.1 * width)
          let value1 = context.measureText(coupon.value1 + '.').width
          context.setFontSize(0.08 * width)
          let value2 = context.measureText(coupon.value2 + '').width
          context.setFontSize(0.04 * width)
          let unit = context.measureText('折').width
          let paddingLeft = (0.27 * width - value1 - value2 - unit) / 2
          context.setFontSize(0.1 * width)
          context.fillText(coupon.value1 + '.', 0.1 * width + paddingLeft, 0.6 * width)
          context.setFontSize(0.08 * width)
          context.fillText(coupon.value2, 0.1 * width + paddingLeft + value1, 0.6 * width)
          context.setFontSize(0.04 * width)
          context.fillText('折', 0.1 * width + paddingLeft + value1 + value2, 0.6 * width)
        } else if (coupon.CouponType === 2) {
          context.setFontSize(0.1 * width)
          let value = context.measureText(coupon.CouponValue + '').width
          context.setFontSize(0.04 * width)
          let unit = context.measureText('元').width
          if (value + unit > 0.27 * width) {
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width, 0.6 * width, 0.27 * width - unit)
            context.setFontSize(0.04 * width)
            context.fillText('元', 0.1 * width + value, 0.6 * width)
          } else {
            let paddingLeft = (0.27 * width - value - unit) / 2
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + paddingLeft, 0.6 * width)
            context.setFontSize(0.04 * width)
            context.fillText('元', 0.1 * width + paddingLeft + value, 0.6 * width)
          }
        } else if (coupon.CouponType === 3) {
          context.beginPath()
          context.setFillStyle('#FFF1EC')
          context.arc(0.235 * width, 0.58 * width, width * 0.08, 0, 2 * Math.PI)
          context.fill()
          context.clip()
          context.drawImage(image, width * 0.155, width * 0.5, width * 0.16, width * 0.16)
          context.restore()
        }
        context.draw(true)
        // 券内容
        if (coupon.CouponType !== 3) {
          context.save()
          context.setFillStyle('#ff6700')
          context.setTextAlign('center')
          context.setFontSize(0.025 * width)
          if (coupon.CouponType === 0 || coupon.CouponType === 1) {
            context.fillText((coupon.IsMore ? '通用券' : '互斥券') + (coupon.IsBuyCard ? '仅购卡' : ''), 0.23 * width, 0.641 * width)
          } else if (coupon.CouponType === 2) {
            context.fillText('原价' + coupon.OriginalPrice + '元', 0.23 * width, 0.641 * width)
          }
          context.draw(true)
        }
        // 券标题
        context.save()
        context.setFillStyle('#000000')
        context.setTextAlign('left')
        context.setFontSize(0.05 * width)
        context.fillText(coupon.CouponTitle, 0.41 * width, 0.55 * width)
        context.draw(true)
        // 有效期
        let remark = coupon.CouponDescription
        if (remark && remark.length > 15) {
          remark = remark.substring(0, 14) + '...'
        }
        context.save()
        context.setFillStyle('#7e7e7e')
        context.setFontSize(0.025 * width)
        context.fillText('有效期：' + (coupon.RangeDate === '0-0-0' ? '永久有效' : (coupon.BeginDate + '至' + coupon.EndDate)), 0.41 * width, 0.6 * width)
        context.fillText('说   明：' + remark, 0.41 * width, 0.64 * width)
        context.draw(true)
        // 券覆盖
        context.save()
        context.drawImage(this.topUrl, 0.03 * width, 0.62 * width, 0.94 * width, 0.271 * width)
        context.draw(true) // 0.92
        // 门店信息背景
        context.setFillStyle('#ebefff')
        context.fillRect(0, width, width, 0.036 * width)
        context.draw(true)
        context.save()
        // 门店信息背景
        context.setFillStyle('#ffffff')
        context.fillRect(0, 1.035 * width, width, 0.308 * width)
        context.draw(true)
        context.save()
        // 门店信息
        context.save()
        context.setFillStyle('#181818')
        context.setFontSize(0.025 * width)
        context.fillText('地址：' + this.store.Address, 0.05 * width, 1.17 * width)
        context.fillText('电话：' + this.store.StoreMobile, 0.05 * width, 1.21 * width)
        context.draw(true)
        // 小程序码
        context.save()
        context.drawImage(this.shareCode, 0.69 * width, 1.06 * width, 0.2 * width, 0.2 * width)
        context.setFillStyle('#000')
        context.setFontSize(0.025 * width)
        context.fillText('长按小程序码领取', 0.69 * width, 1.31 * width)
        context.draw(true, function () {
          setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'shareImg',
              success: function (res) {
                that.shareImagePath = res.tempFilePath
                if (callback) {
                  callback()
                }
              },
              fail: function () {
                console.log('生成图片失败')
              }
            })
          }, 500)
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.type = option.type
      this.firstLoad = true
      this.calcName()
      this.getCouponCenter()
      if (this.type === '6') {
        this.uploadImages()
        this.getStoreInfo()
      }
      this.titleHeight = this.getGlobalData().titleHeight
      wx.removeStorageSync('coupon')
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      this.getCouponCenter()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .coupon-view2-page {
    height: 100vh;
    background-color: #f0f0f0;
    .coupon-create-scroll {
      height: 90vh;
      .coupon-create-main {
        min-height: 80vh;
        background: white;
        .card-state {
          padding: 4vw 5vw;
          span {
            display: inline-block;
            &:nth-child(1) {
              width: 75%;
              font-size: 4vw;
            }
            &:nth-child(2) {
              width: 25%;
              text-align: right;
            }
          }
          text {
            display: inline-block;
          }
        }
        .state-open {
          background: #ecf6ea;
          color: #78bc6d;
        }
        .state-close {
          background: #f6e3e3;
          color: #ff0000;
        }
        .coupon-create-context {
          padding-top: 5vw;
          .same-coupon {
            padding: 5vw 10vw;
            position: relative;
            border-bottom: rpx(1) solid #bbbbbb;
            .context-num {
              padding: 8vw 0 4vw 0;
              height: 8vw;
              line-height: 8vw;
              width: 110%;
              font-size: 2.8vw;
              position: relative;
              left: -5%;
              span {
                display: inline-block;
                box-sizing: border-box;
                width: 33%;
                text-align: center;
                &:nth-child(2) {
                  width: 34%;
                  border-left: rpx(1) solid #a7a7a7;
                  border-right: rpx(1) solid #a7a7a7;
                }
              }
              .num-top {
                color: #ff6700;
                font-size: 4.8vw;
                height: 4.5vw;
                line-height: 4.5vw;
                position: relative;
                top: -1vw;
              }
              .num-bottom {
                position: relative;
                bottom: -1vw;
                height: 3.5vw;
                line-height: 3.5vw;
              }
            }
            .share-context {
              padding-top: 1vw;
              .share-top {
                border-bottom: rpx(1) solid #dddddd;
              }
              .share-logos {
                padding-top: 5vw;
                font-size: 3.2vw;
                width: 81vw;
                position: relative;
                left: -0.5vw;
                span {
                  display: inline-block;
                  width: 27vw;
                  text-align: center;
                }
                img {
                  display: inline-block;
                  height: rpx(84);
                  width: rpx(84);
                }
                .share-logo {
                  height: rpx(84);
                  width: 100%;
                }
                .share-name {
                  padding-top: 2vw;
                }
              }
            }
            .option-state {
              display: inline-block;
              width: rpx(60);
              height: rpx(61);
              height: 0;
              position: absolute;
              top: calc(5vw - 25rpx);
              right: calc(10vw - 25rpx);
              font-size: rpx(15);
              color: white;
              text-align: center;
              line-height: rpx(61);
              img {
                position: absolute;
                left: 0;
                top: 0;
                display: inline-block;
                width: rpx(60);
                height: rpx(61);
              }
              span {
                position: relative;
                display: inline-block;
                z-index: 100;
              }
            }
          }
          .inputs {
            .input-item {
              font-size: 3.5vw;
              height: 10vw;
              line-height: 10vw;
              border-bottom: rpx(1) solid #dddddd;
              span {
                display: inline-block;
                height: 10vw;
                line-height: 10vw;
                vertical-align: top;
              }
              .item-1 {
                width: 70%;
              }
              .item-2 {
                width: 30%;
                text-align: right;
                color: #7e7e7e;
              }
              .item-4 {
                width: 45%;
              }
              .item-5 {
                width: 55%;
                text-align: right;
                color: #7e7e7e;
              }
              .item-3 {
                text-align: center;
                width: 5%;
                img {
                  width: rpx(13);
                  height: rpx(22);
                  display: inline-block;
                  vertical-align: middle;
                  position: relative;
                  top: rpx(-1);
                }
              }
            }
          }
        }
        .add-buttons {
          padding: 0 5vw;
          text-align: left;
          position: relative;
          top: -3vw;
          span {
            display: inline-block;
            padding: 1vw 3vw;
            border-radius: 5vw;
            text-align: center;
            font-size: 3vw;
            color: #ff6700;
            background: #f1f1f1;
          }
        }
        .coupon-buttons {
          padding: 5vw;
          text-align: right;
          span {
            display: inline-block;
            width: 30vw;
            height: 11vw;
            line-height: 11vw;
            border-radius: 10vw;
            border: rpx(1) solid #ff6700;
            color: #ff6700;
            text-align: center;
            font-size: 4.5vw;
            &:nth-child(1) {
              color: white;
              background: #ff6700;
              margin-left: 3vw;
            }
          }
        }
      }
    }
    .coupon-setting {
      position: fixed;
      width: rpx(126);
      height: rpx(126);
      bottom: 10vw;
      right: 5vw;
      img {
        width: rpx(126);
        height: rpx(126);
      }
    }
    .hide-dialog {
      bottom: -100vh !important;
    }
    .share-dialog {
      position: fixed;
      z-index: 1200;
      width: 90vw;
      padding: 8vh 5vw;
      height: 84vh;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.35);
      opacity: 0;
      .share-context {
        position: absolute;
        left: 5vw;
        top: 20vh;
        width: 72vw;
        padding: 8vw 9vw;
        height: 113vw;
        border-radius: 2vw;
        background: white;
        .share-canvas {
          width: 72vw;
          height: 96.7vw;
          position: relative;
        }
        .share-buttons {
          padding-top: 7vw;
          span {
            display: inline-block;
            width: 50%;
            text-align: center;
            &:nth-child(1) {
              color: #ff6700;
            }
            &:nth-child(2) {
              color: white;
            }
          }
          div {
            box-sizing: border-box;
            display: inline-block;
            width: 70%;
            border: rpx(1) solid #ff6700;
            border-radius: 6vw;
            font-size: 4.5vw;
            height: 11vw;
            line-height: 11vw;
          }
          img {
            display: inline-block;
            width: rpx(32);
            height: rpx(43);
            position: relative;
            top: 0.5vw;
          }
          text {
            display: inline-block;
            padding-left: 1.5vw;
          }
        }
      }
    }
  }
</style>
