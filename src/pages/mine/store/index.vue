<template>
  <div class="demo-page store">
    <title :name="'绑定店铺'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context">
          <div class="button" v-if="!isSuccess" @click="unbind">
            <div>解除绑定</div>
          </div>
          <div class="infomation" v-if="isSuccess">
            <div>
              <img src="/static/accept.png"/>
            </div>
            <div>
              已解除绑定
            </div>
            <div>
              点击完成，将为您创建自己的店铺！
            </div>
            <div>
              <span class="done" @click="done">完成</span>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-if="deleting">
      <confirm :title="'确认解除绑定吗？解除后可再次扫码加入！'" :confirm="'解除'" :cancel="'取消'"
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
        deleting: false,
        isSuccess: false
      }
    },
    methods: {
      unbind () {
        this.deleting = true
      },
      deleteItem () {
        this.deleting = true
      },
      done () {
        wx.removeStorageSync('auth')
        const url = '../../index/main'
        wx.reLaunch({url})
      },
      doDelete () {
        let that = this
        this.deleting = false
        this.$post('/user/businessRemoveAdmin', {
          Uid: that.userId,
          StoreId: that.storeId,
          UserId: that.userId
        }, true).then(res => {
          that.isSuccess = true
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .store {
    height: 100vh;
    background-color: #f0f0f0;
    .button {
      padding-top: 2vh;
      div {
        height: 7vh;
        line-height: 7vh;
        text-align: center;
        font-size: rpx(30);
        color: #ff6700;
        background-color: white;
      }
    }
    .infomation {
      div {
        text-align: center;
        &:nth-child(1) {
          padding-top: 7vh;
          img {
            display: inline-block;
            border-radius: 50%;
            border: rpx(1) solid #f2f2f2;
            width: rpx(180);
            height: rpx(180);
          }
        }
        &:nth-child(2) {
          padding-top: 1vh;
          font-size: rpx(33);
        }
        &:nth-child(3) {
          padding-top: 1vh;
          font-size: rpx(26);
          color: #a7a7a7;
        }
        &:nth-child(4) {
          padding-top: 11vh;
          padding-bottom: 17vh;
          span {
            display: inline-block;
            width: 35vw;
            height: rpx(80);
            line-height: rpx(80);
            border-radius: rpx(40);
            font-size: rpx(35);
          }
          .accept {
            color: white;
            background-color: #78bc6d;
          }
          .done {
            border: rpx(1) solid #78bc6d;
            color: #78bc6d;
            background-color: white;
            width: 30vw;
          }
        }
      }
    }
  }
</style>
