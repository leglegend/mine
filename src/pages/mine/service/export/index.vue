<template>
  <div class="service-export-page">
    <title :name="'导出会员数据'" :noline="true" :service="true" :background="'#2E2E30'" :color="'#ffffff'"></title>
    <scroll-view class="service-export-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="service-export-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="service-export-context">
          <div class="export-top">
            <div>
              1、您可以随时导出您的会员数据
            </div>
            <div style="padding-top: 1.5vw">
              2、每天仅可导出一次，每次导出约5分钟内完成
            </div>
          </div>
          <div class="export-options">
            <span class="export-option">
              <span>姓名<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>手机<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>卡号<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>所持会员卡<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>卡类型<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>卡余额<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
            <span class="export-option">
              <span>有效期<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/export-check.png"/></span>
            </span>
          </div>
          <div class="export-context">
            <div class="export-email">
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/email.png"/>
              </span>
              <span>
                邮件：
              </span>
              <span>
                <input v-model="email" placeholder="我们将发送到您指定的邮箱" placeholder-style="color:#BFBFBF"/>
              </span>
            </div>
            <div class="export-button">
              <span @click="doSave">导出</span>
            </div>
          </div>
          <div style="padding-top: 2.5vw;background: #f0f0f0"></div>
          <div class="export-items">
            <div class="export-item" v-for="(item,index) in items" :style="{border:index==items.length-1?'0':''}">
              <span>
                <div>{{item.ExportEmail}}</div>
                <div>{{item.CreateDate}}</div>
              </span>
              <span>{{item.State ? item.State == 1 ? '已导出' : '导出中' : '导出失败'}}</span>
            </div>
          </div>
          <div class="footer" v-show="isOver&&items.length>0">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" v-show="isOver&&items.length==0">还没有数据 =_="</div>
          <div class="footer" v-show="isLoading">加载中...</div>
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
        email: '',
        items: [],
        page: 1,
        changeDate: 0,
        isLoading: false, // 正在加载明细
        isOver: false // 消费明细是否加载完
      }
    },
    methods: {
      doSave () {
        if (!this.email) {
          wx.showToast({
            title: '请输入邮箱',
            image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
          })
          return
        }
        let that = this
        this.$post('/store/businessApplicationExportUserData', {
          Uid: this.userId,
          StoreId: this.storeId,
          ExportEmail: this.email
        }, true).then(res => {
          that.$success('申请成功', false)
          that.page = 1
          that.isOver = false
          that.getItems(1)
          that.getOneItem()
        })
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.isLoading = true
        this.getItems(this.page)
      },
      getOneItem () {
        setTimeout(function () {
          let that = this
          this.$post('/store/businessGetExportUserDataLog', {
            Uid: this.userId,
            StoreId: this.storeId,
            PageSize: 1,
            PageIndex: 1
          }).then(res => {
            if (res.Data.length > 0) {
              that.items[0] = res.Data[0]
              if (res.Data[0].State === 2) {
                that.getOneItem()
              }
              that.changeDate += 1
            }
          })
        }.bind(this), 1000)
      },
      getItems (page) {
        let that = this
        this.$post('/store/businessGetExportUserDataLog', {
          Uid: this.userId,
          StoreId: this.storeId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          that.isLoading = false
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let item of res.Data) {
              that.items.push(item)
            }
          }
          if (res.Data.length < 10) {
            that.isOver = true
          }
        })
      },
      getEmail () {
        let that = this
        this.$post('/store/businessGetStoreEmail', {
          Uid: this.userId,
          StoreId: this.storeId
        }).then(res => {
          if (res.UserEmail) {
            that.email = res.UserEmail
          }
        })
      }
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      this.email = ''
      this.isLoading = false
      this.isOver = false
      this.page = 1
      this.getItems(1)
      this.getEmail()
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .service-export-page {
    height: 100vh;
    background-color: #f0f0f0;
    .service-export-scroll {
      height: 90vh;
      .service-export-main {
        min-height: 80vh;
        .service-export-context {
          .export-top {
            padding: 4.2vw 0 4.2vw 15vw;
            background: rgba(255, 237, 173, 1);
            color: #76541E;
            font-size: 2.8vw;
            letter-spacing: 0.5vw;
          }
          .export-options {
            padding: 5.6vw 3.8vw 0 3.5vw;
            background: white;
            span {
              display: inline-block;
            }
            .export-option {
              padding: 0 1.2vw 4.6vw 1.2vw;
              span {
                width: 20.6vw;
                height: 7.4vw;
                line-height: 7vw;
                border: 0.4vw solid rgba(213, 171, 102, 1);
                border-radius: 3.7vw;
                box-sizing: border-box;
                text-align: center;
                font-size: 3.1vw;
                color: #D5AB66;
                position: relative;
              }
              img {
                display: inline-block;
                position: absolute;
                width: 2.8vw;
                height: 2.8vw;
                top: -0.4vw;
                right: -0.4vw;
              }
            }
          }
          .export-context {
            padding: 1vw 4.5vw 5.6vw 4.5vw;
            background: white;
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
                  width: 5.9vw;
                }
                &:nth-child(2) {
                  width: 12.8vw;
                  font-size: 3.7vw;
                  font-weight: 700;
                  color: rgba(194, 194, 194, 1);
                }
                &:nth-child(3) {
                  width: 66vw;
                  font-size: 3.7vw;
                  font-size: 3.3vw;
                }
              }
              input {
                width: 66vw;
                height: 10.9vw;
                line-height: 10.9vw;
              }
              img {
                display: inline-block;
                width: 4vw;
                height: 3.1vw;
                vertical-align: middle;
                position: relative;
                top: -0.5vw;
              }
            }
            .export-button {
              padding-top: 5vw;
              padding-bottom: 2.3vw;
              text-align: center;
              span {
                display: inline-block;
                width: 47.4vw;
                line-height: 9.2vw;
                height: 9.2vw;
                background: linear-gradient(90deg, rgba(215, 180, 117, 1), rgba(229, 198, 142, 1), rgba(245, 216, 169, 1));
                border-radius: 4.6vw;
                letter-spacing: 1.5vw;
                font-size: 3.7vw;
                font-family: MicrosoftYaHei-Bold;
                font-weight: 700;
                color: rgba(118, 84, 30, 1);
              }
            }
          }
          .export-items {
            background: white;
            padding: 0 9.4vw;
            .export-item {
              padding: 4.9vw 0 4.7vw 0;
              border-bottom: 0.1vw solid rgba(191, 191, 191, 1);
              span {
                display: inline-block;
                vertical-align: top;
                &:nth-child(1) {
                  width: 80%;
                }
                &:nth-child(2) {
                  width: 20%;
                  padding-top: 2vw;
                  line-height: 3.3vw;
                  text-align: right;
                  font-size: 3.5vw;
                  font-family: PingFang-SC-Bold;
                  font-weight: 500;
                }
              }
              div {
                &:nth-child(1) {
                  color: rgba(46, 46, 48, 1);
                  line-height: 3.1vw;
                  height: 3.1vw;
                  font-size: 3.3vw;
                }
                &:nth-child(2) {
                  padding-top: 1.9vw;
                  color: #ACADB3;
                  line-height: 2.2vw;
                  height: 2.2vw;
                  font-size: 3vw;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
