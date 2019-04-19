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
            <div class="nick">{{user.UserName}}</div>
          </div>
          <div style="width: 90vw;margin: 0 auto">
            <div v-if="phone&&userId=='0'">
              <inputBox :keyword="'phone'"
                        :name="'电话'"
                        :request="true"
                        :type="'input'"
                        :context="'number'"
                        :max="'11'"
                        :value="phone"
                        @changeValue="changeValue"></inputBox>
            </div>
            <div v-if="!phone&&userId=='0'">
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
          </div>
          <div class="noItems" v-if="items.length==0">
            没有可编辑资料 =_="
          </div>
          <div class="commit" v-if="items.length>0">
            <span @click="deleting = true">删除会员</span>
            <span @click="commit">保存</span>
          </div>
          <div class="commit" style="text-align: center" v-if="items.length==0">
            <span @click="deleting = true">删除会员</span>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="deleting">
      <confirm :title="'确定删除该会员吗？'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
    </div>
  </div>
</template>

<script>
  import inputBox from '@/components/input'
  import title from '@/components/title'
  import confirm from '@/components/confirm'

  export default {
    components: {
      inputBox, title, confirm
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
        titleHeight: null,
        deleting: false
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
          UserMobile: this.userId === '0' ? this.phone : null,
          UserId: this.info.memberId,
          CardId: this.info.cardId,
          Uid: this.info.userId,
          StoreId: this.info.storeId,
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
          this.phone = value
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
          that.phone = res.UserMobile
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
          for (let item of res.StoreUserInfo) {
            if (item.ControlName === 'user_store_name') {
              that.user.UserName = item.ControlValue
            }
          }
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
