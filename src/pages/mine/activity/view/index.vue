<template>
  <div class="ac-view-page">
    <div class="ac-view-bg"
         :style="{'background-image':'url('+activity.BgImg+'?x-oss-process=image/quality,q_50)',height:bgHeight}"></div>
    <div class="ac-view-bg2" :style="{height:bgHeight}"></div>
    <scroll-view class="ac-view-scroll" :scroll-y="!showDialog"
                 :style="{height:'100vh'}">
      <div class="ac-view-main"
           :style="{'min-height':'100vh'}">
        <div class="create-camera" :style="{'padding-top':statusBarHeight +5+'px'}">
          <span @click="navigateBack">
            <img class="title-icon" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/return2.png"/>
          </span>
        </div>
        <div class="create-context context-first">
          <div class="first-store">
            <span>
              <img :src="store.StoreLogo"/>
            </span>
            <span>
              <div>
                {{store.StoreName}}
              </div>
              <div class="store-info">
                <div>地址：{{store.Address}}</div>
                <div>活动截止：{{activity.BeginDate}}至{{activity.EndDate}}</div>
              </div>
            </span>
          </div>
          <div class="first-textarea">
            <text :style="{color:activity.State!=1?'#dddddd':''}">{{activity.Title}}</text>
          </div>
          <div class="first-coupon" v-if="activity.IsOneReward">
            <!--<div class="coupon">
              <span class="coupon-left">
                <div class="left-cash" v-if="coupon0.CouponType == 0">
                  <span>￥</span>
                  <span>{{coupon0.CouponValue}}</span>
                </div>
                <div class="left-discount" v-if="coupon0.CouponType == 1">
                  <span>{{coupon0.value1}}.</span>
                  <span>{{coupon0.value2}}</span>
                  <span>折</span>
                </div>
                <div class="left-discount" v-if="coupon0.CouponType == 2">
                  <span>{{coupon0.CouponValue}}</span>
                  <span></span>
                  <span>元</span>
                </div>
                <div class="left-gift" v-if="coupon0.CouponType == 3">
                  <div
                    :style="{'background-image':'url('+coupon0.CouponIcon+')','background-size':'100%,auto'}"></div>
                </div>
                <div class="left-type" v-if="coupon0.CouponType!=3">
                  <span v-if="coupon0.CouponType!=2">
                    {{coupon0.IsMore ? '通用券' : '互斥券'}}{{coupon0.IsBuyCard ? '仅购卡' : ''}}
                  </span>
                  <span v-if="coupon0.CouponType==2"
                        style="text-decoration:line-through; ">原价{{coupon0.OriginalPrice}}元</span>
                </div>
                <div class="left-circle-top"></div>
                <div class="left-circle-bottom"></div>
              </span>
              <span class="coupon-right">
                <div class="right-name">
                  {{coupon0.CouponTitle}}
                  <span v-if="coupon0.IsUseVip">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buycard.png"/>
                  </span>
                </div>
                <div class="right-date">
                  有效期：{{coupon0.BeginDate}}至{{coupon0.EndDate}}
                </div>
                <div class="right-remark" @click="couponRemark=coupon0.CouponDescription">
                  <span>说 明：{{coupon0.CouponDescription}}</span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-remark.png"/>
                </div>
              </span>
            </div>-->
            <coupon :coupon="coupon0" @remark="couponRemark=coupon0.CouponDescription"></coupon>
          </div>
          <div class="first-button" v-if="activity.IsOneReward">
            <span @click="getCoupon"
                  :style="{background:activity.State!=1?'#DDDDDD':''}">
              领取优惠券
            </span>
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/notbegin.png" v-if="activity.State==2">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/overdue.png" v-if="activity.State==3">
          </div>
          <div class="getcoupon-info">
             <span v-if="activity&&activity.Id&&activity.State!=1">
               {{activity.State == 3 ? activity.EndReason == 1 ? '已结束 活动时间:' + activity.BeginDate + '至' + activity.EndDate : '礼品券已发放完' : '未开始 活动时间:' + activity.BeginDate + '至' + activity.EndDate}}
             </span>
          </div>
        </div>
        <div v-if="activity.IsTwoReward" style="height: 98.5vw;overflow: hidden;" :animation="animationReceive">
          <div style="padding-top: 3vw"></div>
          <div class="create-context context-second">
            <div class="second-context">
              <div class="second-title">
                分享活动得奖品
              </div>
              <!--<div class="coupon">
              <span class="coupon-left">
                  <div class="left-cash" v-if="coupon1.CouponType == 0">
                    <span>￥</span>
                    <span>{{coupon1.CouponValue}}</span>
                  </div>
                  <div class="left-discount" v-if="coupon1.CouponType == 1">
                    <span>{{coupon1.value1}}.</span>
                    <span>{{coupon1.value2}}</span>
                    <span>折</span>
                  </div>
                  <div class="left-discount" v-if="coupon1.CouponType == 2">
                    <span>{{coupon1.CouponValue}}</span>
                    <span></span>
                    <span>元</span>
                  </div>
                  <div class="left-gift" v-if="coupon1.CouponType == 3">
                    <div
                      :style="{'background-image':'url('+coupon1.CouponIcon+')','background-size':'100%,auto'}"></div>
                  </div>
                  <div class="left-type" v-if="coupon1.CouponType!=3">
                    <span v-if="coupon1.CouponType!=2">
                      {{coupon1.IsMore ? '通用券' : '互斥券'}}{{coupon1.IsBuyCard ? '仅购卡' : ''}}
                    </span>
                    <span v-if="coupon1.CouponType==2"
                          style="text-decoration:line-through; ">原价{{coupon1.OriginalPrice}}元</span>
                  </div>
                  <div class="left-circle-top"></div>
                  <div class="left-circle-bottom"></div>
                </span>
                <span class="coupon-right">
                <div class="right-name">
                  {{coupon1.CouponType == 0 ? '代金券' : coupon1.CouponType == 1 ? '打折券' : coupon1.CouponType == 2 ? '服务券' : '礼品券'}}
                  <span v-if="coupon1.IsUseVip">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buycard.png"/>
                  </span>
                </div>
                <div class="right-date">
                  有效期：{{coupon1.BeginDate}}至{{coupon1.EndDate}}
                </div>
                <div class="right-remark" @click="couponRemark=coupon1.CouponDescription">
                  <span>说 明：{{coupon1.CouponDescription}}</span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-remark.png"/>
                </div>
              </span>
              </div>-->
              <coupon :coupon="coupon1" @remark="couponRemark=coupon1.CouponDescription"></coupon>
              <div class="second-rule">
                <div>
                  奖励规则：{{activity.TwoReceiveLimit == 0 ? '只要转发，就可得奖品' : activity.TwoReceiveLimit == 1 ? '只要有人领取后即可得到奖品' : '新客到店消券后才可得到奖品'}}
                </div>
                <div>
                  奖励数量：{{activity.TwoReceiveCount ? activity.TwoReceiveLimit == 1 ? '被领取几份，得到几份' : '来消券几个(人)，相对应得到几份奖品' : '仅限一份'}}
                </div>
              </div>
              <div class="second-button">
                <button @click="showShareButtons">我要分享</button>
              </div>
            </div>
          </div>
        </div>
        <div class="create-context context-rule" v-if="activity.ActivityRules">
          <div class="rule-title">
            <span class="title-padding"></span>
            <span class="title-context">活动规则</span>
            <span class="title-padding"></span>
          </div>
          <div class="rule-context">
            <text>{{activity.ActivityRules}}</text>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 5vw;padding-bottom:25vw;background: rgba(44,63,71,0)">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div class="view-buttons">
      <span>
        <div class="buttons-bg" style="background: #f6741c" @click="jumpToEdit">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/view-edit.png" style="width:35rpx;height: 35rpx"/>
        </div>
        <div class="buttons-text">
          编辑
        </div>
      </span>
      <span>
        <div class="buttons-bg" style="background: #155baa" @click="jumpToReport">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/view-data.png" style="width:51rpx;height: 42rpx"/>
        </div>
        <div class="buttons-text">
          看数据
        </div>
      </span>
      <span>
        <div class="buttons-bg" style="background: #02b300" @click="showShareButtons">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/view-share.png" style="width:55rpx;height: 42rpx"/>
        </div>
        <div class="buttons-text">
          转发
        </div>
      </span>
    </div>
    <div class="view-buttons2" :animation="animation">
      <div class="buttons-close">
        <span @click="hideShareButtons">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </span>
      </div>
      <div class="buttons-context">
        <span>
          <div class="buttons-bg" @click="openMemberDialog">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-member.png"/>
          </div>
          <div class="buttons-text">
            群发会员
          </div>
        </span>
        <span>
          <button class="buttons-bg" @click="jumpToNutCard">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-group.png"/>
          </button>
          <div class="buttons-text">
            转发到群
          </div>
        </span>
        <span>
          <div class="buttons-bg" @click="openDialog">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-image.png"/>
          </div>
          <div class="buttons-text">
            生成分享图
          </div>
        </span>
        <span>
          <div class="buttons-bg" @click="openQrCodeDialog">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-code.png"/>
          </div>
          <div class="buttons-text">
            二维码
          </div>
        </span>
      </div>
      <div class="buttons-context">
        <span style="width: 50%">
          <button open-type="share" class="buttons-bg">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-group.png"/>
          </button>
          <div class="buttons-text">
            转发到群
          </div>
        </span>
        <span style="width: 50%">
          <div class="buttons-bg" style="width: 100%" @click="openDialog">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/share-image.png"/>
          </div>
          <div class="buttons-text" style="width: 100%">
            生成分享图
          </div>
        </span>
      </div>
    </div>
    <div class="share-dialog" :class="{'hide-dialog':!showDialog}" :animation="animationBg">
      <div class="share-context" :animation="animationContext">
        <div class="share-canvas" :style="{height:isQrCode?'72vw':'110vw',padding:isQrCode?'19vw 0':'0'}">
          <img :src="isQrCode?qrCode:shareImagePath" style="width: 100%;height: 100%"/>
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
         style="width: 100vw;height: 100vh;position: fixed;bottom: -200vh;opacity: 1;z-index: 1000;"
         :style="{bottom:showDialog?'-200vh':'-200vh'}">
      <div class="share-context" style="width: 100vw;height: 100vh;">
        <canvas canvas-id="shareImg" class="share-canvas" style="width: 100vw;height: 152.8vw;"
                disable-scroll="true"></canvas>
      </div>
    </div>
    <div class="send-dialog" :animation="sendBg" :class="{'hide-dialog':!showMemberDialog}">
      <div class="send-context" :animation="sendContext">
        <div class="context-title">
          群发给会员
        </div>
        <div class="context-context">
          <span class="context-left">1、</span>
          <span class="context-right">
            <div>当会员进入到坚果卡包时，在首页进行弹窗提醒，引导会员进入到活动页面</div>
            <div class="send-switch" :style="{color:isOpenMember?'#78bc6d':'#dddddd'}">
              {{isOpenMember ? '已经打开' : '等待开启'}}
              <switch :checked="isOpenMember" :disabled="isOpenMember" color="#78bc6d"
                      @change="openMember"/>
            </div>
          </span>
          <div style="padding-top: 3vw;visibility: hidden">
            <span class="context-left">2、</span>
            <span class="context-right">
            <div>通过微信发送活动通知</div>
            <div class="send-switch" :style="{color:isOpenWeixin?'#78bc6d':'#dddddd'}">
              {{isOpenWeixin ? '已经打开' : '等待开启'}}
              <switch :checked="isOpenWeixin" :disabled="isOpenWeixin" color="#78bc6d" @change="openWeixin"/>
            </div>
          </span>
          </div>
          <div class="send-buttons">
            <span @click="closeMemberDialog">关闭</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpenMember&&isOpenMember1">
      <confirm :title="'打开后不可关闭，要打开吗？'" :confirm="'确认打开'" :cancel="'取消'"
               @confirm="sendActivityInfo" @cancel="isOpenMember = false"></confirm>
    </div>
    <div v-if="isOpenWeixin&&isOpenWeixin1">
      <confirm :title="'打开后不可关闭，要打开吗？'" :confirm="'确认打开'" :cancel="'取消'"
               @confirm="sendWeixinActinfo" @cancel="isOpenWeixin = false"></confirm>
    </div>
    <div v-if="couponRemark">
      <remark :text="couponRemark" @close="couponRemark = ''"></remark>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import confirm from '@/components/confirm'
  import remark from '@/components/remark'
  import coupon from '@/components/coupon'

  export default {
    components: {
      title, confirm, remark, coupon
    },

    data () {
      return {
        couponRemark: '',
        title: '',
        bgUrl: '',
        store: {},
        activity: {},
        activityBg: {},
        coupon0: {},
        coupon1: {},
        animation: {},
        animationBg: {},
        animationContext: {},
        sendBg: {},
        sendContext: {},
        animationReceive: {},
        showMemberDialog: false,
        isAdminShare: false,
        showDialog: false,
        shareCode: '',
        shareImagePath: '',
        qrCode: '',
        user: {},
        bgHeight: '',
        isQrCode: false,
        statusBarHeight: '',
        isOpenMember: false,
        isOpenWeixin: false,
        isOpenMember1: false,
        isOpenWeixin1: false,
        receive: '' // 是否先领奖
      }
    },
    methods: {
      jumpToNutCard () {
        let path = 'pages/activity/main?storeId=' + this.storeId + '&userId=' + this.userId + '&activityId=' + this.activityId
        let url = this.getGlobalUrl().url
        if (url.indexOf('test') > 0) {
          path += '&type=test'
        } else if (url.indexOf('home') > 0) {
          path += '&type=home'
        }
        wx.navigateToMiniProgram({
          appId: 'wx7133eb2f1b1aaac2',
          path: path,
          envVersion: 'trial'
        })
      },
      jumpToData (type, name, value) {
        let url = '../data/main?type=' + type + '&name=' + name + (value ? '&value=' + value : '')
        wx.navigateTo({url})
      },
      jumpToEdit () {
        let url = '../create/main?type=edit&userId=' + this.userId + '&storeId=' + this.storeId + '&activityId=' + this.activityId
        wx.navigateTo({url})
      },
      jumpToReport () {
        let url = '../report/main?userId=' + this.userId + '&storeId=' + this.storeId + '&activityId=' + this.activityId
        wx.navigateTo({url})
      },
      navigateBack () {
        wx.navigateBack({
          delta: 1
        })
      },
      openMember (e) {
        this.isOpenMember = e.mp.detail.value
      },
      openWeixin (e) {
        this.isOpenWeixin = e.mp.detail.value
      },
      receiveChange (e) {
        if (e.mp) {
          this.receive = e.mp.detail.value
        } else {
          this.receive = e
        }
        wx.setStorageSync('receive' + this.activityId, this.receive)
        if (this.receive) {
          let animationReceive = wx.createAnimation()
          animationReceive.height('0').step({duration: 200})
          this.animationReceive = animationReceive.export()
        } else {
          let animationReceive = wx.createAnimation()
          animationReceive.height('98.5vw').step({duration: 200})
          this.animationReceive = animationReceive.export()
        }
      },
      openDialog () {
        let that = this
        that.isQrCode = false
        if (this.shareImagePath) {
          that.showDialog = true
          this.openDialogAnimation()
          return
        }
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.$post('/activity/businessGetShareQrCode', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          Receive: this.receive
        }).then(res => {
          that.showDialog = true
          wx.getImageInfo({
            src: res.Message,
            success: function (resp) {
              that.shareCode = resp.path
              let coupon = that.coupon0 ? that.coupon0 : that.coupon1
              if (coupon.CouponType === 3) {
                wx.getImageInfo({
                  src: coupon.CouponIcon,
                  success: function (resp2) {
                    that.drawCanvasContext(coupon, resp2.path, function () {
                      wx.hideLoading()
                      that.openDialogAnimation()
                    })
                  }
                })
              } else {
                that.drawCanvasContext(coupon, null, function () {
                  wx.hideLoading()
                  that.openDialogAnimation()
                })
              }
            }
          })
        })
      },
      openQrCodeDialog () {
        let that = this
        that.isQrCode = true
        if (this.qrCode) {
          that.showDialog = true
          this.openDialogAnimation()
          return
        }
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.$post('/activity/businessGetShareQrCode', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          Receive: this.receive
        }).then(res => {
          that.showDialog = true
          wx.getImageInfo({
            src: res.Message,
            success: function (resp) {
              wx.hideLoading()
              that.qrCode = resp.path
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
      openMemberDialog () {
        this.showMemberDialog = true
        let animationBg = wx.createAnimation()
        animationBg.opacity(1).step({duration: 200})
        this.sendBg = animationBg.export()
        let animationContext = wx.createAnimation()
        animationContext.top('18vh').step({duration: 200})
        this.sendContext = animationContext.export()
      },
      closeMemberDialog () {
        let animationBg = wx.createAnimation()
        animationBg.opacity(0).step({duration: 200})
        this.sendBg = animationBg.export()
        let animationContext = wx.createAnimation()
        animationContext.top('27vh').step({duration: 200})
        this.sendContext = animationContext.export()
        setTimeout(function () {
          this.showMemberDialog = false
        }.bind(this), 250)
      },
      downloadImage () {
        let that = this
        wx.saveImageToPhotosAlbum({
          filePath: that.isQrCode ? that.qrCode : that.shareImagePath,
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
      getStoreInfo () {
        let that = this
        wx.getImageInfo({
          src: this.user.logo,
          success: function (resp) {
            that.user.logo = resp.path
          }
        })
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.userId,
          StoreId: this.storeId,
          IsNotDefaultData: true
        }, this.firstLoad).then(res => {
          that.store = res
        })
      },
      showShareButtons () {
        let animation = wx.createAnimation()
        animation.bottom('0vw').step({duration: 200})
        this.animation = animation.export()
      },
      hideShareButtons () {
        let animation = wx.createAnimation()
        animation.bottom('-29vw').step({duration: 200})
        this.animation = animation.export()
      },
      getActivityInfo (callback) {
        let that = this
        this.$post('/activity/businessGetActivity', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId
        }, this.firstLoad).then(res => {
          that.activity = res
          if (callback) {
            callback()
          }
          wx.getImageInfo({
            src: res.BgImg + '?x-oss-process=image/quality,q_50',
            success: function (resp) {
              that.activityBg = resp
              that.bgHeight = (resp.height / resp.width * 100) + 'vw'
            }
          })
          for (let coupon of res.Coupons) {
            if (coupon.AcType) {
              that.coupon1 = that.calcCoupon(coupon)
            } else {
              that.coupon0 = that.calcCoupon(coupon)
            }
          }
        })
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
      drawCanvasContext (coupon, image, callback) {
        let that = this
        const sysInfo = wx.getSystemInfoSync()
        const width = sysInfo.screenWidth
        const height = sysInfo.screenWidth * 1.528
        const context = wx.createCanvasContext('shareImg')
        context.save()
        // 绘制背景
        context.setFillStyle('rgba(44, 63, 71, 1)')
        context.fillRect(0, 0, width, height)
        context.draw()
        // 活动背景
        context.save()
        context.drawImage(this.activityBg.path, 0, 0, width, this.activityBg.height / this.activityBg.width * width)
        context.draw(true)
        // 背景遮罩
        const grd = context.createLinearGradient(0, this.activityBg.height / this.activityBg.width * width * 0.5, 0, this.activityBg.height / this.activityBg.width * width)
        grd.addColorStop(0, 'rgba(44, 63, 71, 0.35)')
        grd.addColorStop(1, 'rgba(44, 63, 71, 1)')
        context.setFillStyle(grd)
        context.fillRect(0, this.activityBg.height / this.activityBg.width * width * 0.5, width, this.activityBg.height / this.activityBg.width * width * 0.52)
        context.draw(true)
        // 背景遮罩
        context.setFillStyle('rgba(44, 63, 71, 0.35)')
        context.fillRect(0, 0, width, this.activityBg.height / this.activityBg.width * width * 0.5)
        context.draw(true)
        context.save()
        // 绘制头像
        context.beginPath()
        context.setFillStyle('rgba(44, 63, 71, 1)')
        context.arc(width * 0.5, width * 0.24, width * 0.09, 0, 2 * Math.PI)
        context.fill()
        context.clip()
        context.drawImage(this.user.logo, width * 0.41, width * 0.15, width * 0.18, width * 0.18)
        context.restore()
        context.draw(true)
        // 推荐者名称
        context.beginPath()
        context.setFillStyle('#ffffff')
        context.setTextAlign('center')
        context.setFontSize(0.046 * width)
        context.fillText('⌈' + this.user.name + '⌋ 的推荐', 0.5 * width, 0.388 * width, width)
        context.draw(true)
        // 内容背景
        context.save()
        context.setFillStyle('rgba(255, 255, 255, 1)')
        context.fillRect(0.04 * width, 0.515 * width, 0.92 * width, 0.98 * width)
        context.draw(true)
        // 标题背景
        context.save()
        context.drawImage('https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ac-bg.png', 0.03 * width, 0.59 * width, 0.92 * width, 0.52 * width)
        context.draw(true)
        // 标题
        let title = this.activity.Title.split(/[\s\n]/)
        let titles = []
        for (let i in title) {
          if (title[i] === '') {
            continue
          }
          titles.push(title[i])
        }
        context.setFillStyle('#00886b')
        context.setTextAlign('center')
        context.setFontSize(0.08 * width)
        context.font = 'normal bold ' + (0.08 * width) + 'px sans-serif'
        console.log('normal 700 ' + Math.round(0.08 * width) + 'px sans-serif')
        if (titles.length === 1) {
          context.fillText(titles[0], 0.5 * width, (0.66 + 0.1 * 1) * width, width)
        } else if (titles.length === 2) {
          context.fillText(titles[0], 0.5 * width, (0.66 + 0.1 * 0.5) * width, width)
          context.fillText(titles[1], 0.5 * width, (0.66 + 0.1 * 1.5) * width, width)
        } else {
          for (let i in titles) {
            context.fillText(titles[i], 0.5 * width, (0.66 + 0.1 * i) * width, width)
          }
        }
        context.draw(true)
        // 券背景
        context.save()
        context.drawImage('https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-bg.png', 0.095 * width, 0.92 * width, 0.8 * width, 0.21 * width)
        context.draw(true)
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
            context.fillText('￥', 0.1 * width, 1.05 * width)
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + $width, 1.05 * width, 0.27 * width - $width)
          } else {
            let paddingLeft = (0.27 * width - $width - valueWidth) / 2
            console.log('valueWidth:' + paddingLeft)
            context.setFontSize(0.07 * width)
            context.fillText('￥', 0.1 * width + paddingLeft, 1.05 * width)
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + paddingLeft + $width, 1.05 * width)
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
          context.fillText(coupon.value1 + '.', 0.1 * width + paddingLeft, 1.05 * width)
          context.setFontSize(0.08 * width)
          context.fillText(coupon.value2, 0.1 * width + paddingLeft + value1, 1.05 * width)
          context.setFontSize(0.04 * width)
          context.fillText('折', 0.1 * width + paddingLeft + value1 + value2, 1.05 * width)
        } else if (coupon.CouponType === 2) {
          context.setFontSize(0.1 * width)
          let value = context.measureText(coupon.CouponValue + '').width
          context.setFontSize(0.04 * width)
          let unit = context.measureText('元').width
          if (value + unit > 0.27 * width) {
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width, 1.05 * width, 0.27 * width - unit)
            context.setFontSize(0.04 * width)
            context.fillText('元', 0.1 * width + value, 1.05 * width)
          } else {
            let paddingLeft = (0.27 * width - value - unit) / 2
            context.setFontSize(0.1 * width)
            context.fillText(coupon.CouponValue, 0.1 * width + paddingLeft, 1.05 * width)
            context.setFontSize(0.04 * width)
            context.fillText('元', 0.1 * width + paddingLeft + value, 1.05 * width)
          }
        } else if (coupon.CouponType === 3) {
          context.beginPath()
          context.setFillStyle('#FFF1EC')
          context.arc(0.235 * width, 1.03 * width, width * 0.08, 0, 2 * Math.PI)
          context.fill()
          context.clip()
          context.drawImage(image, width * 0.155, width * 0.95, width * 0.16, width * 0.16)
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
            context.fillText((coupon.IsMore ? '通用券' : '互斥券') + (coupon.IsBuyCard ? '仅购卡' : ''), 0.23 * width, 1.091 * width)
          } else if (coupon.CouponType === 2) {
            context.fillText('原价' + coupon.OriginalPrice + '元', 0.23 * width, 1.091 * width)
          }
          context.draw(true)
        }
        // 券标题
        context.save()
        context.setFillStyle('#000000')
        context.setTextAlign('left')
        context.setFontSize(0.05 * width)
        context.fillText(coupon.CouponTitle, 0.41 * width, 1 * width)
        context.draw(true)
        // 有效期
        let remark = coupon.CouponDescription
        if (remark && remark.length > 15) {
          remark = remark.substring(0, 14) + '...'
        }
        context.save()
        context.setFillStyle('#7e7e7e')
        context.setFontSize(0.025 * width)
        context.fillText('有效期：' + coupon.BeginDate + '至' + coupon.EndDate, 0.41 * width, 1.05 * width)
        context.fillText('说   明：' + remark, 0.41 * width, 1.09 * width)
        context.draw(true)
        // 门店信息
        context.save()
        context.setFillStyle('#000')
        context.setFontSize(0.045 * width)
        context.fillText(this.store.StoreName, 0.095 * width, 1.34 * width)
        context.setFillStyle('#181818')
        context.setFontSize(0.025 * width)
        context.fillText('地址：' + this.store.Address, 0.095 * width, 1.39 * width)
        context.fillText('电话：' + this.store.StoreMobile, 0.095 * width, 1.42 * width)
        context.draw(true)
        // 小程序码
        context.save()
        context.drawImage(this.shareCode, 0.69 * width, 1.2 * width, 0.2 * width, 0.2 * width)
        context.setFillStyle('#000')
        context.setFontSize(0.025 * width)
        context.fillText('长按小程序码领取', 0.69 * width, 1.45 * width)
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
      },
      sendActivityInfo () {
        wx.setStorageSync('isOpenMember' + this.activityId, true)
        let that = this
        this.$post('/activity/businessUpdateActivityIsTop', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          IsTop: 1
        }, true).then(res => {
          that.$success('发送成功')
        })
      },
      sendWeixinActinfo () {
        let that = this
        this.isOpenWeixin = false
        this.$post('/activity/businessUpdateActivityIsWechat', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId,
          IsSendWechat: 0
        }, true).then(res => {
          that.$success('发送成功')
          that.isOpenWeixin = true
          wx.setStorageSync('isOpenWeixin' + that.activityId, true)
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.activityId = option.id
      this.bgUrl = ''
      this.bgHeight = ''
      this.shareImagePath = ''
      this.shareCode = ''
      this.showDialog = false
      this.showMemberDialog = false
      this.titleHeight = this.getGlobalData().titleHeight
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.user = this.getGlobalData().user
      console.log(this.user)
      this.hideShareButtons()
      this.getStoreInfo()
      let receive = wx.getStorageSync('receive' + this.activityId)
      if (receive) {
        this.receiveChange(true)
      } else {
        this.receiveChange(false)
      }
      if (wx.getStorageSync('isOpenMember' + this.activityId)) {
        this.isOpenMember = true
        this.isOpenMember1 = false
      } else {
        this.isOpenMember = false
        this.isOpenMember1 = true
      }
      if (wx.getStorageSync('isOpenWeixin' + this.activityId)) {
        this.isOpenWeixin = true
        this.isOpenWeixin1 = false
      } else {
        this.isOpenWeixin = false
        this.isOpenWeixin1 = true
      }
    },
    onShow (e) {
      console.log(e)
      let that = this
      this.getActivityInfo(function () {
        console.log(1 + e)
        that.shareImagePath = ''
        that.shareCode = ''
      })
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .ac-view-page {
    height: 100vh;
    background-color: #2c3f47;
    .ac-view-bg {
      width: 100%;
      max-height: 100vh;
      background-size: 100%, auto;
      background-repeat: no-repeat;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .ac-view-bg2 {
      background-image: repeating-linear-gradient(rgba(44, 63, 71, 0.35), rgba(44, 63, 71, 0.35) 20%, rgba(44, 63, 71, 0.35) 20%, rgba(44, 63, 71, 0.7) 50%, rgba(44, 63, 71, 0.7) 50%, rgba(44, 63, 71, 1) 100%);
      width: 100%;
      max-height: 100vh;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
    .ac-view-scroll {
      height: 90vh;
      position: relative;
      z-index: 10;
      .ac-view-main {
        padding: 0 2.5vw;
        .create-camera {
          span {
            display: inline-block;
            width: 17vw;
            height: 17vw;
          }
          .title-icon {
            display: inline-block;
            width: rpx(18);
            height: rpx(31);
            padding-left: 0.83vw;
          }
        }
        .create-context {
          margin-top: 3vw;
          //border: rpx(1) solid red;
          height: 10vw;
          border-radius: 3vw;
          .coupon {
            height: 22vw;
            background: #fff1ec;
            border-radius: 0.8vw;
            position: relative;
            left: -0.5vw;
            .coupon-left {
              position: relative;
              color: #ff6700;
              display: inline-block;
              height: 100%;
              width: 35%;
              text-align: center;
              .left-discount {
                padding-top: 2.7vw;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 10vw;
                  }
                  &:nth-child(2) {
                    font-size: 7vw;
                  }
                  &:nth-child(3) {
                    font-size: 4vw;
                  }
                }
              }
              .left-cash {
                padding-top: 2.7vw;
                white-space: nowrap;
                span {
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 6.5vw;
                  }
                  &:nth-child(2) {
                    font-size: 9.5vw;
                  }
                }
              }
              .left-gift {
                text-align: center;
                padding-top: 2.5vw;
                div {
                  display: inline-block;
                  width: 17vw;
                  padding-top: 4vw;
                  height: 13vw;
                  border-radius: 50%;
                  font-size: 2.5vw;
                  position: relative;
                  background: rgba(250, 230, 224, 1);
                  img {
                    display: inline-block;
                    width: rpx(51);
                    height: rpx(38);
                  }
                  span {
                    display: block;
                    position: absolute;
                    bottom: 3.5vw;
                    width: 17vw;
                    text-align: center;
                    color: #e5c5bb;
                  }
                }
              }
              .left-type {
                font-size: 2.5vw;
                span {
                  position: relative;
                  top: -1vw;
                  display: inline-block;
                  padding: 0 1.5vw;
                  background: #ffddd1;
                  border-radius: 2vw;
                }
              }
              .left-circle-top {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white;
                position: absolute;
                right: -1vw;
                top: -1.2vw;
              }
              .left-circle-bottom {
                height: 2vw;
                width: 2vw;
                border-radius: 50%;
                background: white;
                position: absolute;
                right: -1vw;
                bottom: -1.2vw;
              }
            }
            .coupon-left:after {
              content: ' ';
              width: 0;
              height: 100%;
              position: absolute;
              top: 0;
            }
            .coupon-left:after {
              border-left: rpx(2) dotted white;
              right: rpx(-1);
            }
            .coupon-right {
              display: inline-block;
              vertical-align: top;
              box-sizing: border-box;
              width: 65%;
              height: 100%;
              padding-top: 3.8vw;
              padding-left: 3.4vw;
              .right-name {
                font-size: 4.7vw;
                img {
                  display: inline-block;
                  width: rpx(100);
                  height: rpx(26);
                }
              }
              .right-date {
                padding-top: 2vw;
                font-size: 2.5vw;
                color: #7e7e7e;
              }
              .right-remark {
                font-size: 2.5vw;
                color: #7e7e7e;
                position: relative;
                span {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  display: inline-block;
                  width: 80%;
                }
                img {
                  width: rpx(17);
                  height: rpx(17);
                  position: absolute;
                  right: 7vw;
                  bottom: rpx(7);
                }
              }
            }
          }
          .coupon:after {
            content: ' ';
            width: 0;
            height: 100%;
            position: absolute;
            top: 0;
          }
          .coupon:after {
            border-left: rpx(4) dotted white;
            right: rpx(-2);
          }
        }
        .context-first {
          height: auto !important;
          position: relative;
          background: white;
          .first-store {
            line-height: 25vw;
            height: 32vw;
            padding: 0 5vw;
            span {
              display: inline-block;
              height: 25vw;
              line-height: 25vw;
              vertical-align: top;
              img {
                width: 17vw;
                height: 17vw;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
              }
              &:nth-child(1) {
                width: 17vw;
              }
              &:nth-child(2) {
                padding-top: 5vw;
                padding-left: 3vw;
                line-height: 8.5vw;
                width: 65vw;
                overflow: hidden;
              }
            }
            .store-info {
              font-size: 2.5vw;
              line-height: 3.5vw;
              color: #181818;
            }
          }
          .first-textarea {
            padding: 2vw 5vw 5vw 5vw;
            background-image: url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/ac-bg.png);
            background-size: 100%, auto;
            height: 30vw;
            line-height: 30vw;
            text {
              width: 100%;
              display: inline-block;
              line-height: 10vw;
              text-align: center;
              color: #00886b;
              font-size: 7vw;
              font-weight: 600;
              vertical-align: middle;
              word-wrap: break-word;
              word-break: normal;
            }
          }
          .first-coupon {
            padding: 6vw;
          }
          .first-button {
            padding-top: 4vw;
            text-align: center;
            position: relative;
            span {
              display: inline-block;
              height: 13vw;
              line-height: 13vw;
              width: 50vw;
              border-radius: 10vw;
              font-size: 4.5vw;
              background: #ff6700;
              color: white;
            }
            img {
              top: -5vw;
              right: 27vw;
              position: absolute;
              height: rpx(182);
              width: rpx(184);
            }
          }
          .getcoupon-info {
            height: 10vw;
            line-height: 9vw;
            text-align: center;
            span {
              display: inline-block;
              height: 4.5vw;
              line-height: 4.5vw;
              font-size: 3vw;
              background: #ff0000;
              color: white;
              border-radius: 5vw;
              padding: 0 2vw;
            }
          }
        }
        .context-second {
          background-image: repeating-linear-gradient(135deg, #ffffff, #ffffff rpx(20), #3291ff rpx(20), #3291ff rpx(40), #ffffff rpx(40), #ffffff rpx(60), #ff2c2c rpx(60), #ff2c2c rpx(80));
          padding: 2vw;
          height: 91.5vw;
          overflow: hidden;
          margin-top: 0;
          .second-context {
            background: white;
            border-radius: 2vw;
            height: 82.5vw;
            padding: 4.5vw;
            .second-title {
              font-size: 7.5vw;
              padding-bottom: 7.5vw;
            }
            .second-rule {
              padding-top: 5vw;
              font-size: 3.5vw;
              line-height: 5vw;
            }
            .second-button {
              padding-top: 10vw;
              text-align: center;
              button {
                display: inline-block;
                height: 13vw;
                line-height: 13vw;
                width: 50vw;
                border-radius: 10vw;
                font-size: 4.5vw;
                background: #ff6700;
                color: white;
              }
            }
          }
        }
        .context-rule {
          padding: 5vw 4.5vw 4vw 4.5vw;
          background: white;
          height: auto !important;
          .rule-title {
            span {
              display: inline-block;
              vertical-align: top;
              height: 5vw;
            }
            .title-padding {
              width: 30vw;
              border-bottom: rpx(1) dotted black;
            }
            .title-context {
              font-size: 4.2vw;
              width: 25vw;
              text-align: center;
              height: 10vw;
              line-height: 10vw;
            }
          }
          .rule-context {
            padding: 0 2vw 2vw 2vw;
            font-size: 3.7vw;
            line-height: 6vw;
            color: #7e7e7e;
          }
        }
        .save-button {
          padding: 3vw;
          margin-top: 6vw;
          span {
            display: inline-block;
            width: 100%;
            height: 11vw;
            line-height: 11vw;
            border-radius: 5vw;
            text-align: center;
            color: white;
            background: #FF6700;
          }
        }
      }
    }
    .view-buttons {
      position: fixed;
      bottom: 0;
      height: 19vw;
      width: 100%;
      z-index: 100;
      padding-top: 4vw;
      padding-left: 13vw;
      background: #f8f8f8;
      span {
        display: inline-block;
        width: 30.5vw;
        &:nth-child(3) {
          width: 15vw;
        }
      }
      .buttons-bg {
        width: 12.5vw;
        height: 12.5vw;
        line-height: 10vw;
        text-align: center;
        border-radius: 50%;
        img {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          top: rpx(7);
        }
      }
      .buttons-text {
        padding-top: 0.5vw;
        width: 12.5vw;
        text-align: center;
        font-size: 2.8vw;
        color: #a4a4a4;
      }
    }
    .view-buttons2 {
      position: fixed;
      bottom: -29vw;
      width: 100%;
      z-index: 101;
      background: #f8f8f8;
      height: 29vw;
      .buttons-close {
        height: 10vw;
        line-height: 10vw;
        width: 100vw;
        span {
          display: inline-block;
          vertical-align: top;
          height: 10vw;
          line-height: 10vw;
          &:nth-child(1) {
            width: 28vw;
            padding-left: 2vw;
          }
          &:nth-child(2) {
            width: 65vw;
            text-align: right;
            font-size: 2.8vw;
            color: #7e7e7e;
            switch {
              zoom: 0.6;
              position: relative;
              top: -0.5vw;
            }
            text {
              display: inline-block;
              padding-right: 2vw;
            }
          }
        }
        img {
          width: rpx(22);
          height: rpx(22);
          display: inline-block;
        }
      }
      .buttons-context {
        height: 19vw;
        width: 92vw;
        padding-left: 4vw;
        padding-right: 4vw;
        span {
          display: inline-block;
          width: 23vw;
        }
        .buttons-bg {
          width: 23vw;
          height: 13vw;
          line-height: 13vw;
          text-align: center;
          background: rgba(44, 63, 71, 0);
          img {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            height: rpx(84);
            width: rpx(84);
          }
        }
        .buttons-text {
          padding-top: 0.5vw;
          width: 23vw;
          text-align: center;
          font-size: 2.8vw;
          color: #a4a4a4;
        }
      }
    }
    .hide-dialog {
      bottom: -100vh !important;
    }
    .send-dialog {
      position: fixed;
      z-index: 300;
      width: 90vw;
      padding: 8vh 5vw;
      height: 84vh;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.35);
      .send-context {
        position: absolute;
        left: 5vw;
        top: 27vh;
        width: 72vw;
        padding: 8vw 9vw;
        height: 85vw;
        border-radius: 2vw;
        background: white;
        .context-context {
          padding-top: 3vw;
          span {
            display: inline-block;
            vertical-align: top;
            font-size: 3.5vw;
            color: #a7a7a7;
          }
          .context-left {
            width: 7%;
          }
          .context-right {
            width: 93%;
            .send-switch {
              padding: 6vw 0;
              font-size: 5vw;
              color: #78bc6d;
            }
          }
        }
        .send-buttons {
          padding-top: 7vw;
          text-align: center;
          span {
            box-sizing: border-box;
            display: inline-block;
            width: 35%;
            border: rpx(1) solid #ff6700;
            background: #ff6700;
            border-radius: 6vw;
            font-size: 4.5vw;
            height: 11vw;
            line-height: 11vw;
            color: white;
            text-align: center;
          }
        }
      }
    }
    .share-dialog {
      position: fixed;
      z-index: 200;
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
        height: 127vw;
        border-radius: 2vw;
        background: white;
        .share-canvas {
          width: 72vw;
          height: 110vw;
          position: relative;
          left: -0.5vw;
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
