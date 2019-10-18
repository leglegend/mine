<template>
  <div class="edit">
    <title :name="'编辑资料'"></title>

    <scroll-view scroll-y="true" class="edit-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div style="padding: 1vh"></div>
        <div style="padding-bottom: 5vh;background-color: white">
          <div class="info">
            <span class="logo" v-bind:style="{background:'url('+user.UserImg+')','background-size':'100%,100%'}"></span>
            <div class="nick">
              {{user.RemarkName ? user.RemarkName : user.UserStoreName ? user.UserStoreName : user.UserName}}
            </div>
          </div>
          <div style="width: 90vw;margin: 0 auto">
            <div v-if="phone&&userId=='0'&&!isFirstLoad">
              <inputBox :keyword="'phone'"
                        :name="'电话'"
                        :request="true"
                        :type="'input'"
                        :context="'number'"
                        :max="'11'"
                        :value="phone"
                        @changeValue="changeValue"></inputBox>
            </div>
            <div v-if="!phone&&userId=='0'&&!isFirstLoad">
              <inputBox :keyword="'phone'"
                        :name="'电话'"
                        :request="true"
                        :type="'input'"
                        :context="'number'"
                        :max="'11'"
                        :value="phone"
                        @changeValue="changeValue"></inputBox>
            </div>
            <inputBox v-for="(item,index) in items"
                      :key="index"
                      :keyword="item.ControlName"
                      :name="item.ControlInstructions"
                      :request="item.IsMust"
                      :value="item.ControlValue"
                      :validations="item.ControlsValidations"
                      :type="item.ControlType"
                      @changeValue="changeValue"></inputBox>
            <div v-if="!isFirstLoad">
              <inputBox :keyword="'remarkName'"
                        :name="'备注名'"
                        :type="'input'"
                        :value="remarkName"
                        @changeValue="changeValue"></inputBox>
            </div>
          </div>
          <div class="commit">
            <span @click="isOverdue?showToast=true:deleting=true" :class="isOverdue?'overdue-button2':''">删除会员</span>
            <span @click="isOverdue?showToast=true:commit()" :class="isOverdue?'overdue-button':''">保存</span>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="deleting">
      <confirm :title="'确定删除该会员吗？'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
    </div>
    <div v-if="showToast">
      <renewtoast @close="showToast = false"></renewtoast>
    </div>
  </div>
</template>

<script>
  import inputBox from '@/components/input'
  import title from '@/components/title'
  import confirm from '@/components/confirm'
  import renewtoast from '@/components/renewtoast'

  export default {
    components: {
      inputBox, title, confirm, renewtoast
    },

    data () {
      return {
        item: {
          phone: '121'
        },
        items: [],
        userInfos: [],
        user: {},
        userId: '',
        phone: '',
        remarkName: '',
        newInfo: {
          phone: '',
          remarkName: ''
        },
        showToast: false,
        titleHeight: null,
        isFirstLoad: true,
        deleting: false
      }
    },
    computed: {
      isOverdue () {
        return this.$store.getters.GET_ISOVERDUE
      }
    },
    methods: {
      commit () {
        let childrens = this.$children
        let isError = false
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return false
        }
        let that = this
        this.$post('/user/businessSetStoreUser', {
          UserMobile: this.userId === '0' ? this.newInfo['phone'] : null,
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          RemarkName: this.newInfo['remarkName'],
          UserInfos: this.userInfos
        }, true).then(res => {
          that.$success('修改成功', true)
        })
      },
      doDelete () {
        this.deleting = false
        this.$post('/card/businessCancelUserCard', {
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }, true).then(res => {
          wx.showToast({
            title: '已删除',
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        })
      },
      changeValue (key, value) {
        for (var i in this.userInfos) {
          if (this.userInfos[i].ControlName === key) {
            this.userInfos[i].ControlValue = value
          }
        }
        if (key === 'phone') {
          this.newInfo['phone'] = value
        } else if (key === 'remarkName') {
          this.newInfo['remarkName'] = value
        }
      },
      getCustomControls () {
        let that = this
        this.$post('/user/businessGetStoreUser', {
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          if (res.UserInfos && res.UserInfos.length > 0) {
            that.items = res.UserInfos
          }
          for (let item of that.items) {
            that.userInfos.push({
              ControlName: item.ControlName,
              ControlValue: item.ControlValue
            })
          }
        })
      },
      getUserInfo () {
        let that = this
        this.$post('/user/businessGetUserInfo', {
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId
        }).then(res => {
          that.user = res
          that.phone = res.UserMobile
          if (res.RemarkName) {
            this.remarkName = res.RemarkName
            this.newInfo['remarkName'] = res.RemarkName
          }
          for (let item of res.StoreUserInfo) {
            if (item.ControlName === 'user_store_name') {
              that.user.UserName = item.ControlValue
            }
          }
          that.isFirstLoad = false
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.userId = option.memberId
      this.items = []
      this.userInfos = []
      this.user = {}
      this.phone = ''
      this.remarkName = ''
      this.newInfo = {
        phone: '',
        remarkName: ''
      }
      this.isFirstLoad = true
      this.showToast = false
      this.getCustomControls()
      this.getUserInfo()
      this.titleHeight = this.getGlobalData().titleHeight
    }

  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .edit {
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    .edit-scroll {
      width: 100vw;
      height: 90vh;
      .info {
        padding-top: 2vh;
        text-align: center;
        .logo {
          height: 6vh;
          width: 6vh;
          border-radius: 50%;
          display: inline-block;
        }
        .nick {
          font-size: rpx(35);
          font-weight: 600;
          height: 6vh;
          position: relative;
          top: -0.5vh;
        }
      }
      .noItems {
        text-align: center;
        height: 15vw;
        line-height: 15vw;
        color: #bfbfbf;
        font-size: 3vw;
      }
      .commit {
        padding: 4.5vh 5vw;
        text-align: right;
        span {
          display: inline-block;
          height: rpx(80);
          line-height: rpx(80);
          text-align: center;
          background-color: #ff6700;
          border: rpx(1) solid #ff6700;
          border-radius: rpx(40);
          font-size: rpx(35);
          color: white;
          width: 28vw;
          &:nth-child(1) {
            background-color: white;
            color: #ff6700;
          }
          &:nth-child(2) {
            margin-left: 4vw;
          }
        }
      }
    }
  }
</style>
