<template>
  <div class="demo-page permission">
    <title :name="'权限管理'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context">
          <div class="infomation">
            <div class="logo">
              <img :src="admin.UserImg"/>
            </div>
            <div>{{admin.UserName}}</div>
          </div>
          <div class="permissions">
            <div class="ptop">
              <span></span>
            </div>
            <div class="clerk-name" @click="jumpToName">
              <span>店员姓名</span>
              <span>{{admin.StoreUserName ? admin.StoreUserName : '请填写'}}</span>
              <span>
                <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
              </span>
            </div>
            <div class="permission-item" v-for="(item,index) in items">
              <span>
                <div>
                  {{item.PName}}
                </div>
                <div>
                  {{item.PInfo}}
                </div>
              </span>
              <span>
                <switch @change="switchChange(index,item)" :checked="item.State"/>
              </span>
            </div>
            <div class="delete" @click="deleteAdmin">
              移除店员
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
      <confirm :title="'确认删除吗？删除后不可恢复！'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
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
        titleHeight: null,
        items: [],
        admin: {},
        deleting: false,
        isFirstLoad: true
      }
    },
    methods: {
      jumpToName () {
        const url = '../name/main?userId=' + this.userId + '&storeId=' + this.storeId + '&adminId=' + this.adminId
        wx.navigateTo({url})
      },
      switchChange (index, item) {
        let that = this
        this.$post('/user/businessSetAdminPermissions', {
          Uid: this.userId,
          StoreId: this.storeId,
          Userid: this.adminId,
          Pid: item.Pid,
          State: item.State === 0 ? 1 : 0
        }).then(res => {
          that.items[index].State = item.State === 0 ? 1 : 0
        })
      },
      deleteAdmin () {
        this.deleting = true
      },
      doDelete () {
        let that = this
        that.deleting = false
        this.$post('/user/businessRemoveAdmin', {
          Uid: this.userId,
          StoreId: this.storeId,
          UserId: this.adminId
        }, true).then(res => {
          that.$success('删除成功', true)
        })
      },
      getPermissions () {
        let that = this
        this.$post('/user/businessGetAdminPermissions', {
          Uid: this.userId,
          StoreId: this.storeId,
          Userid: this.adminId
        }, this.isFirstLoad).then(res => {
          that.items = res.AdminPermissions
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.adminId = res.adminId
      this.items = []
      this.deleting = false
      this.isFirstLoad = true
      let globalData = this.getGlobalData()
      if (globalData.admin) {
        this.admin = globalData.admin
      }
      this.getPermissions()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.isFirstLoad === false) {
        let globalData = this.getGlobalData()
        this.admin = globalData.admin
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .permission {
    background-color: #f0f0f0;
    .infomation {
      text-align: center;
      padding-bottom: 3vh;
      div {
        &:nth-child(1) {
          padding-top: 3.2vh;
          img {
            border-radius: 50%;
            display: inline-block;
            width: 19vw;
            height: 19vw;
          }
        }
        &:nth-child(2) {
          font-size: rpx(30);
          font-weight: 600;
        }
      }
    }
    .permissions {
      width: 91vw;
      margin: 0 auto;
      background-color: white;
      border-radius: rpx(10);
      padding: 2.5vh 2vw 0 2vw;
      position: relative;
      .ptop {
        width: 95vw;
        position: absolute;
        top: rpx(-20);
        left: rpx(0);
        text-align: center;
        span {
          background-color: white;
          width: rpx(20);
          height: rpx(20);
          transform: rotate(45deg);
          display: inline-block;
        }

      }
      .clerk-name {
        padding-left: 3vw;
        height: 6.5vh;
        line-height: 6.5vh;
        border-bottom: rpx(1) solid #dddddd;
        span {
          display: inline-block;
          height: 6.5vh;
          line-height: 6.5vh;
          vertical-align: top;
          &:nth-child(1) {
            font-size: rpx(28);
            color: #ff6700;
            width: 18vw;
          }
          &:nth-child(2) {
            font-size: rpx(28);
            color: #ff6700;
            width: 67vw;
            font-size: rpx(25);
            color: #a7a7a7;
          }
        }
        img {
          display: inline-block;
          height: rpx(21);
          width: rpx(13);
          vertical-align: middle;
          position: relative;
          top: rpx(-1);
        }
      }
      .permission-item {
        padding: 3.5vw 0vw 3.5vw 3vw;
        border-bottom: rpx(1) solid #dddddd;
        div:nth-child(1) {
          font-size: rpx(28);
          padding-bottom: rpx(8);
        }
        div:nth-child(2) {
          padding-left: rpx(3);
          font-size: rpx(27);
          color: #a7a7a7;
          width: 60vw;
          padding-bottom: 2vw;
        }
        span {
          display: inline-block;
          &:nth-child(1) {
            width: 70vw;
            vertical-align: middle;
          }
          &:nth-child(2) {
            vertical-align: middle;
          }
        }
      }
      .delete {
        text-align: center;
        font-size: rpx(28);
        color: #ff6700;
        height: 8vh;
        line-height: 8vh;
      }
    }
  }
</style>
