<template>
  <div class="ac-create-page">
    <div class="ac-create-bg"
         :style="{'background-image':'url('+(bgUrl?bgUrl:demoBgUrl)+'?x-oss-process=image/quality,q_50)',height:bgHeight}"></div>
    <div class="ac-create-bg2" :style="{height:bgHeight}"></div>
    <scroll-view class="ac-create-scroll" scroll-y="true"
                 :style="{height:'100vh'}">
      <div class="ac-create-main"
           :style="{'min-height':'100vh'}">
        <div class="create-camera" :style="{'padding-top':statusBarHeight +5+'px'}">
          <span @click="navigateBack">
            <img class="title-icon" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/return2.png"/>
          </span>
          <div @click="choosePhoto">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/camera.png"/>
            <span>店内或门头照片</span>
          </div>
          <span></span>
        </div>
        <div class="create-context context-first">
          <div class="first-edit">
            <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/ac-edit.png"/>点击大字即可编辑
          </div>
          <div style="padding-top: 7vw"></div>
          <div class="first-textarea" @click="isFocus=true"
               :style="{background:'url(https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/ac-bg.png)','background-size':'100%,auto'}">
            <textarea v-model="title"
                      @focus="isFocus=true"
                      @blur="isFocus=false"
                      @input="textreaInput"
                      @linechange="lineChange"
                      :focus="isFocus"
                      auto-height="true"/>
            <div class="first-remark" v-if="!title&&isFocus==false" @click="isFocus=true">
              <div>新店开业</div>
              <div>现在办卡就送X元代金卷</div>
            </div>
          </div>
        </div>
        <div class="create-context context-coupon" :animation="getAnimation">
          <div class="coupon-title" :class="{'no-context':!getCoupon}">
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon.png"/>
            </span>
            <span>新客奖励</span>
            <span>
              <switch :checked="getCoupon" color="#78bc6d" @change="getCouponChange"/>
            </span>
          </div>
          <div class="coupon-context">
            <div class="no-coupon" @click="jumpToGift(0)" v-if="coupon0==null">
              + 添加礼品
            </div>
            <div class="gift-coupon" v-if="coupon0" @click="jumpToGift(0)">
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
                    <span v-if="coupon0.UseMinMoney">
                      满{{coupon0.UseMinMoney}}元可用
                    </span>
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
                  <div class="right-remark" @click.stop="couponRemark=coupon0.CouponDescription">
                    <span>说 明：{{coupon0.CouponDescription}}</span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-remark.png"/>
                  </div>
                </span>
              </div>-->
              <coupon :coupon="coupon0" @remark="couponRemark=coupon0.CouponDescription"></coupon>
            </div>
            <div class="coupon-rule coupon-rule1">
              <picker @change="memberLimitChange" :value="memberLimit" :range="memberLimits">
                <span>领取限制</span>
                <span>{{memberLimits[memberLimit]}}</span>
                <span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </picker>
            </div>
            <div class="coupon-rule">
              <picker @change="phoneLimitChange" :value="phoneLimit" :range="phoneLimits">
                <span>领取者手机</span>
                <span>{{phoneLimits[phoneLimit]}}</span>
                <span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </picker>
            </div>
          </div>
        </div>
        <div class="create-context context-coupon" style="height:76.5vw;" :animation="shareAnimation">
          <div class="coupon-title" :class="{'no-context':!shareCoupon}">
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon.png"/>
            </span>
            <span>转发人奖励</span>
            <span>
              <switch :checked="shareCoupon" color="#78bc6d" @change="shareCouponChange"/>
            </span>
          </div>
          <div class="coupon-context">
            <div class="no-coupon" v-if="!coupon1" @click="jumpToGift(1)">
              + 添加礼品
            </div>
            <div class="gift-coupon" v-if="coupon1" @click="jumpToGift(1)">
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
                    {{coupon1.CouponTitle}}
                    <span v-if="coupon1.IsUseVip">
                      <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/buycard.png"/>
                    </span>
                  </div>
                  <div class="right-date">
                    有效期：{{coupon1.BeginDate}}至{{coupon1.EndDate}}
                  </div>
                  <div class="right-remark" @click.stop="couponRemark=coupon1.CouponDescription">
                    <span>说 明：{{coupon1.CouponDescription}}</span>
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/coupon-remark.png"/>
                  </div>
                </span>
              </div>-->
              <coupon :coupon="coupon1" @remark="couponRemark=coupon1.CouponDescription"></coupon>
            </div>
            <div class="coupon-rule coupon-rule1">
              <picker @change="getCouponLimitChange" :value="getCouponLimit" :range="getCouponLimits">
                <span>奖励限制</span>
                <span>{{getCouponLimits[getCouponLimit]}}</span>
                <span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </picker>
            </div>
            <div class="coupon-rule coupon-rule1" style="padding-top: 0">
              <picker @change="qtyLimitChange" :value="qtyLimit" :range="qtyLimits">
                <span>奖励数量</span>
                <span>{{qtyLimits[qtyLimit]}}</span>
                <span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </picker>
            </div>
            <div class="coupon-rule">
              <picker @change="phone1LimitChange" :value="phone1Limit" :range="phoneLimits">
                <span>转发者手机</span>
                <span>{{phoneLimits[phone1Limit]}}</span>
                <span>
                  <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                </span>
              </picker>
            </div>
          </div>
        </div>
        <div class="create-context context-rule">
          <div class="activity-rule" style="border-bottom: 1rpx solid #dddddd"
               @click="jumpToData('textarea','活动规则',activityRule)">
            <span>活动规则</span>
            <span>{{activityRule ? activityRule : '请填写(可不写)'}}</span>
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
          <div class="activity-rule" @click="jumpToData('date','活动截止')">
            <span>活动截止</span>
            <span>{{beginDate ? beginDate + '至' + endDate : '请选择'}}</span>
            <span>
              <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
            </span>
          </div>
        </div>
        <div class="save-button">
          <span @click="doSave">保 存</span>
        </div>
        <div class="save-button" style="padding-top: 0vw;margin-top: 2vw" v-if="activityId">
          <span @click="deleting = true">删 除</span>
        </div>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="deleting">
      <confirm :title="'确认删除吗？'" :text="'该活动删除后不可恢复；且已经发放出去的券不会撤回，仍然有效！'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
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
        isFocus: false,
        bgUrl: '',
        bgHeight: '',
        getAnimation: {},
        shareAnimation: {},
        coupon0: null,
        coupon1: null,
        titleHeight: null,
        getCoupon: true,
        shareCoupon: true,
        memberLimit: 0,
        phoneLimit: 0,
        phone1Limit: 0,
        shareLimit: 0,
        getCouponLimit: 0,
        qtyLimit: 0,
        memberLimits: ['任何人都可以领取', '仅新客可以领取', '仅会员可以领取'],
        phoneLimits: ['不需要', '须提供手机号才可领券'],
        shareLimits: ['领奖后允许再次转发', '不允许转发'],
        getCouponLimits: ['只要转发，就可得奖品', '只要有人领取后即可得到奖品', '新客到店消券后才可得到奖品'],
        qtyLimits: ['仅限一份', '被领取几份，得到几份'],
        activityRule: '',
        beginDate: '',
        endDate: '',
        statusBarHeight: null,
        demoBgUrl: '',
        activityId: '',
        deleting: false,
        changeData: 0
      }
    },
    methods: {
      jumpToData (type, name, value) {
        let url = '../data/main?type=' + type + '&name=' + name + (value ? '&value=' + value : '')
        if (type === 'date' && this.beginDate) {
          url = url + '&beginDate=' + this.beginDate + '&endDate=' + this.endDate
        }
        wx.navigateTo({url})
      },
      navigateBack () {
        wx.navigateBack({
          delta: 1
        })
      },
      choosePhoto () {
        let that = this
        wx.chooseImage({
          sizeType: ['compressed'],
          count: 1,
          success: function (res) {
            // that.bgUrl = res.tempFilePaths[0]
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            console.log(res)
            wx.uploadFile({
              url: that.url + '/Common/uploadFileForXcx',
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                Uid: that.userId,
                StoreId: that.storeId,
                Type: 1,
                FileType: 0
              },
              success: function (res) {
                let data = JSON.parse(res.data)
                wx.getImageInfo({
                  src: data.Data[0].FilePath + '?x-oss-process=image/quality,q_50',
                  success: function (resp) {
                    console.log(resp.width)
                    console.log(resp.height)
                    that.bgHeight = (resp.height / resp.width * 100) + 'vw'
                    that.bgUrl = data.Data[0].FilePath
                    wx.hideLoading()
                  }
                })
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        })
      },
      textreaInput (e) {
        // let values = (e.mp.detail.value + '1').split(/[\s\n]/)
        // if (values.length > 3) {
        // this.title = e.mp.detail.value.substring(0, e.mp.detail.value.length - 1)
        // } else {
        this.title = e.mp.detail.value
        // }
      },
      lineChange (e) {
        if (e.mp.detail.lineCount > 3) {
          this.title = this.title.substring(0, this.title.length - 1)
        }
      },
      memberLimitChange (e) {
        this.memberLimit = e.mp.detail.value
      },
      phoneLimitChange (e) {
        this.phoneLimit = e.mp.detail.value
      },
      phone1LimitChange (e) {
        this.phone1Limit = e.mp.detail.value
      },
      shareLimitChange (e) {
        this.shareLimit = e.mp.detail.value
      },
      getCouponLimitChange (e) {
        if (e.mp) {
          this.getCouponLimit = e.mp.detail.value
        } else {
          this.getCouponLimit = e
        }
        console.log(e)
        if (this.getCouponLimit === '0') {
          this.qtyLimits = ['仅限一份']
        } else if (this.getCouponLimit === '1') {
          this.qtyLimits = ['仅限一份', '被领取几份，得到几份']
        } else if (this.getCouponLimit === '2') {
          this.qtyLimits = ['仅限一份', '来消券几个(人)，相对应得到几份奖品']
        }
        this.qtyLimit = 0
        this.changeData += 1
      },
      qtyLimitChange (e) {
        this.qtyLimit = e.mp.detail.value
      },
      jumpToGift (type) {
        let url = '../gift/main?storeId=' + this.storeId + '&userId=' + this.userId + '&type=' + type
        if (type === 0) {
          if (this.coupon0) {
            wx.setStorageSync('coupon', this.coupon0)
          }
        } else if (type === 1) {
          if (this.coupon1) {
            wx.setStorageSync('coupon', this.coupon1)
          }
        }
        wx.navigateTo({url})
      },
      getCouponChange (e) {
        if (e.mp) {
          this.getCoupon = e.mp.detail.value
        } else {
          this.getCoupon = e
        }
        if (this.getCoupon) {
          let getAnimation = wx.createAnimation()
          getAnimation.height('65.5vw').step({duration: 200})
          this.getAnimation = getAnimation.export()
        } else {
          let getAnimation = wx.createAnimation()
          getAnimation.height('15vw').step({duration: 200})
          this.getAnimation = getAnimation.export()
        }
      },
      shareCouponChange (e) {
        if (e.mp) {
          this.shareCoupon = e.mp.detail.value
        } else {
          this.shareCoupon = e
        }
        if (this.shareCoupon) {
          let shareAnimation = wx.createAnimation()
          shareAnimation.height('76.5vw').step({duration: 200})
          this.shareAnimation = shareAnimation.export()
        } else {
          let shareAnimation = wx.createAnimation()
          shareAnimation.height('15vw').step({duration: 200})
          this.shareAnimation = shareAnimation.export()
        }
      },
      getActivityInfo () {
        let that = this
        this.$post('/activity/businessGetActivity', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId
        }, true).then(res => {
          that.activity = res
          that.title = res.Title
          that.bgUrl = res.BgImg
          wx.getImageInfo({
            src: res.BgImg,
            success: function (resp) {
              that.bgHeight = (resp.height / resp.width * 100) + 'vw'
              wx.hideLoading()
            }
          })
          that.getCouponChange(res.IsOneReward)
          that.shareCouponChange(res.IsTwoReward)
          that.shareLimit = res.ShareLimit
          that.getCouponLimitChange(res.TwoReceiveLimit)
          that.memberLimit = res.OneReceiveLimit
          that.phoneLimit = res.OneIsMobile ? 1 : 0
          that.phone1Limit = res.TwoIsMobile ? 1 : 0
          that.qtyLimit = res.TwoReceiveCount
          that.activityRule = res.ActivityRules
          that.beginDate = res.BeginDate
          that.endDate = res.EndDate
          for (let item of res.Coupons) {
            if (item.CouponType === 1) {
              let values = (item.CouponValue + '').split('.')
              item.value1 = values[0]
              if (values.length === 2) {
                item.value2 = values[1]
              } else {
                item.value2 = 0
              }
            }
            if (item.AcType) {
              that.coupon1 = item
            } else {
              that.coupon0 = item
            }
          }
        })
      },
      doSave () {
        if (this.getCoupon && !this.coupon0) {
          wx.showToast({
            title: '请添加新客券',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        } else if (this.shareCoupon && !this.coupon1) {
          wx.showToast({
            title: '请添加转发券',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        } else if (!this.beginDate || !this.endDate) {
          wx.showToast({
            title: '请选择截止时间',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        let coupons = []
        if (this.getCoupon) {
          coupons.push(this.coupon0)
        }
        if (this.shareCoupon) {
          coupons.push(this.coupon1)
        }
        let activity = {
          Title: this.title,
          BgImg: this.bgUrl,
          IsOneReward: this.getCoupon,
          IsTwoReward: this.shareCoupon,
          OneReceiveLimit: this.memberLimit,
          OneIsMobile: this.phoneLimit * 1,
          TwoIsMobile: this.phone1Limit * 1,
          ShareLimit: this.shareLimit,
          TwoReceiveLimit: this.getCouponLimit,
          TwoReceiveCount: this.qtyLimit,
          ActivityRules: this.activityRule,
          BeginDate: this.beginDate,
          EndDate: this.endDate,
          Coupons: coupons,
          ActivityType: 0,
          Uid: this.userId,
          StoreId: this.storeId
        }
        let that = this
        if (this.activityId) {
          activity.Id = this.activityId
          this.$post('/activity/businessUpdateActivity', activity, true).then(res => {
            that.$success('修改成功', true)
          })
        } else {
          this.$post('/activity/businessAddActivity', activity, true).then(res => {
            that.$success('保存成功', true)
          })
        }
      },
      doDelete () {
        this.$post('/activity/businessDelActivity', {
          Uid: this.userId,
          StoreId: this.storeId,
          ActivityId: this.activityId
        }, true).then(res => {
          wx.showToast({
            title: '删除成功',
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        })
      },
      cleanData () {
        this.bgUrl = ''
        this.activityId = ''
        this.coupon0 = null
        this.coupon1 = null
        this.title = ''
        this.memberLimit = 0
        this.phoneLimit = 0
        this.phone1Limit = 0
        this.shareLimit = 0
        this.getCouponLimitChange(0)
        this.qtyLimit = 0
        this.activityRule = ''
        this.beginDate = ''
        this.endDate = ''
        this.getCoupon = true
        this.shareCoupon = true
        this.deleting = false
        this.getCouponChange(true)
        this.shareCouponChange(true)
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.cleanData()
      this.titleHeight = this.getGlobalData().titleHeight
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.url = this.getGlobalUrl().url
      if (option.type === 'edit') {
        this.activityId = option.activityId
        this.getActivityInfo()
      } else {
        let that = this
        that.demoBgUrl = 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/activity-bg.jpg'
        wx.getImageInfo({
          src: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Images/activity-bg.jpg?x-oss-process=image/quality,q_50',
          success: function (resp) {
            that.bgHeight = (resp.height / resp.width * 100) + 'vw'
          }
        })
      }
    },
    onShow () {
      let coupon = wx.getStorageSync('coupon')
      if (coupon) {
        if (coupon.CouponType === 1) {
          let values = (coupon.CouponValue + '').split('.')
          coupon.value1 = values[0]
          if (values.length === 2) {
            coupon.value2 = values[1]
          } else {
            coupon.value2 = 0
          }
        }
        if (coupon.AcType === '1') {
          if (this.coupon1 && this.coupon1.Id) {
            coupon.Id = this.coupon1.Id
          }
          this.coupon1 = coupon
        } else {
          if (this.coupon0 && this.coupon0.Id) {
            coupon.Id = this.coupon0.Id
          }
          this.coupon0 = coupon
        }
        wx.removeStorageSync('coupon')
      }
      let data = wx.getStorageSync('data')
      if (data) {
        if (data.key === 'date') {
          this.beginDate = data.value.beginDate
          this.endDate = data.value.endDate
        } else if (data.key === 'rule') {
          this.activityRule = data.value
        }
        wx.removeStorageSync('data')
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .ac-create-page {
    height: 100vh;
    background-color: #2c3f47;
    .ac-create-bg {
      width: 100%;
      max-height: 100vh;
      background-size: 100%, auto;
      background-repeat: no-repeat;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .ac-create-bg2 {
      background-image: repeating-linear-gradient(rgba(44, 63, 71, 0.35), rgba(44, 63, 71, 0.35) 20%, rgba(44, 63, 71, 0.35) 20%, rgba(44, 63, 71, 0.7) 50%, rgba(44, 63, 71, 0.7) 50%, rgba(44, 63, 71, 1) 100%);
      width: 100%;
      max-height: 100vh;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
    .ac-create-scroll {
      height: 90vh;
      position: relative;
      z-index: 10;
      .ac-create-main {
        padding: 0 2.5vw;
        .create-camera {
          span {
            display: inline-block;
            width: 39vw;
            vertical-align: top;
          }
          .title-icon {
            display: inline-block;
            width: rpx(18);
            height: rpx(31);
            padding-left: 0.83vw;
          }
          div {
            display: inline-block;
            text-align: center;
            width: 17vw;
            padding-top: 3.5vw;
            height: 13.5vw;
            border-radius: 50%;
            font-size: 2vw;
            position: relative;
            background: rgba(0, 136, 107, 0.76);
            img {
              display: inline-block;
              width: rpx(51);
              height: rpx(38);
            }
            span {
              display: block;
              position: absolute;
              bottom: 4.5vw;
              width: 17vw;
              text-align: center;
              color: white;
            }
          }
        }
        .create-context {
          margin-top: 3vw;
          //border: rpx(1) solid red;
          height: 10vw;
          border-radius: 3vw;

        }
        .context-rule {
          padding-left: 5vw;
          height: 27vw;
          background: white;
          .activity-rule {
            height: 13.5vw;
            line-height: 13.5vw;
            font-size: 3.8vw;
            span {
              display: inline-block;
              height: 13.5vw;
              line-height: 13.5vw;
              vertical-align: top;
              &:nth-child(1) {
                width: 30%;
                font-weight: 600;
              }
              &:nth-child(2) {
                width: 63%;
                color: #7e7e7e;
                text-align: right;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              &:nth-child(3) {
                width: 7%;
                color: #7e7e7e;
                text-align: center;
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
        .context-first {
          height: 40vw;
          position: relative;
          background: white;
          .first-edit {
            font-size: 2vw;
            position: absolute;
            left: 3vw;
            top: 2vw;
            color: #c9c9c9;
            img {
              width: rpx(17);
              height: rpx(17);
              display: inline-block;
              position: relative;
              top: 0.3vw;
              left: -0.5vw;
            }
          }
          .first-textarea {
            padding: 0vw 5vw 3vw 5vw;
            position: relative;
            height: 30vw;
            line-height: 30vw;
            textarea {
              width: 100%;
              line-height: 10vw;
              text-align: center;
              color: #00886b;
              font-size: 7vw;
              font-weight: 600;
              z-index: 20;
              position: relative;
              background: rgba(240, 240, 240, 0);
              vertical-align: middle;
              display: inline-block;
            }
            .first-remark {
              width: 100%;
              padding-top: 4.5vw;
              height: 22.5vw;
              line-height: 9vw;
              text-align: center;
              color: #00886b;
              font-size: 7vw;
              font-weight: 600;
              position: absolute;
              z-index: 21;
              left: 0;
              top: 1vw;
            }
          }
        }
        .context-coupon {
          margin-top: 2vw;
          height: 65.5vw;
          position: relative;
          padding: 1vw 2vw;
          background: white;
          overflow: hidden;
          .coupon-title {
            height: 15vw;
            font-size: 3.8vw;
            font-weight: 600;
            line-height: 15vw;
            border-bottom: rpx(1) solid #dddddd;
            img {
              width: rpx(51);
              height: rpx(51);
              display: inline-block;
              position: relative;
              top: rpx(15);
            }
            span {
              height: 15vw;
              line-height: 15vw;
              display: inline-block;
              vertical-align: top;
              &:nth-child(1) {
                width: 9.5vw;
              }
              &:nth-child(2) {
                width: 61vw;
              }
              &:nth-child(3) {
                width: 20vw;
                text-align: right;
              }
            }
          }
          .no-context {
            border-bottom: 0 !important;
          }
          .coupon-context {
            padding-left: 9vw;
            padding-top: 4.2vw;
            .no-coupon {
              border-radius: 1vw;
              text-align: center;
              height: 22vw;
              line-height: 22vw;
              font-size: 4.7vw;
              color: #dadada;
              background: #f1f1f1;
            }
            .gift-coupon {
              .coupon {
                height: 22vw;
                background: #fff1ec;
                border-radius: 0.8vw;
                position: relative;
                .coupon-left {
                  position: relative;
                  color: #ff6700;
                  display: inline-block;
                  height: 100%;
                  width: 35%;
                  text-align: center;
                  .left-cash {
                    padding-top: 2.7vw;
                    height: 13.3vw;
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
                  .left-discount {
                    padding-top: 2.7vw;
                    height: 13.3vw;
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
            .coupon-rule {
              height: 11vw;
              line-height: 11vw;
              font-size: 3.2vw;
              span {
                display: inline-block;
                height: 11vw;
                line-height: 11vw;
                vertical-align: top;
                &:nth-child(1) {
                  width: 25%;
                }
                &:nth-child(2) {
                  width: 68%;
                  color: #7e7e7e;
                  text-align: right;
                }
                &:nth-child(3) {
                  width: 7%;
                  color: #7e7e7e;
                  text-align: center;
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
            .coupon-rule1 {
              border-bottom: rpx(1) solid #dddddd;
              padding-top: 2vw;
            }
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
  }
</style>
