<template>
  <div class="demo-page store">
    <title :name="'绑定店铺'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="demo-context" v-for="(item,index) in stores">
          <div class="button">
            <div>
              <span class="store-name">{{item.StoreName}}</span>
              <span style="text-align: right;width: 40vw">
                <span class="store-remove" v-if="item.UserType">
                  <span @click="unbind(item)">解除绑定</span>
                </span>
                <span class="store-change" v-if="item.StoreId != storeId">
                  <span @click="changeStore(item)">切换店铺</span>
                </span>
              </span>
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
        isSuccess: false,
        current: {},
        storeId: '',
        stores: []
      }
    },
    methods: {
      unbind (item) {
        this.deleting = true
        this.current = item
      },
      done () {
        wx.removeStorageSync('auth')
        const url = '../../index/main'
        wx.reLaunch({url})
      },
      changeStore (item) {
        wx.removeStorageSync('auth')
        wx.setStorageSync('currentStore', item.StoreId)
        const url = '../../index/main'
        wx.reLaunch({url})
      },
      doDelete () {
        let that = this
        this.deleting = false
        this.$post('/user/businessRemoveAdmin', {
          Uid: that.userId,
          StoreId: that.current.StoreId,
          UserId: that.userId
        }, true).then(res => {
          that.isSuccess = true
          that.done()
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId * 1
      this.userId = res.userId
      console.log(this.storeId)
      let globalData = this.getGlobalData()
      this.stores = globalData.storeList
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
      padding-top: 4vw;
      div {
        height: 15vw;
        line-height: 15vw;
        text-align: center;
        font-size: rpx(30);
        background-color: white;
        padding: 0 5vw;
      }
      span {
        display: inline-block;
      }
      .store-name {
        width: 50vw;
        text-align: left;
      }
      .store-remove {
        width: 20vw;
        color: #ff6700;
        span {
          height: 7vw;
          line-height: 7vw;
          box-sizing: border-box;
          border: 0.1vw solid #ff6700;
          border-radius: 4vw;
          width: 18vw;
          font-size: rpx(25);
          text-align: center;
        }
      }
      .store-change {
        width: 20vw;
        color: white;
        span {
          height: 7vw;
          line-height: 7vw;
          background: #ff6700;
          border-radius: 4vw;
          width: 18vw;
          font-size: rpx(25);
          text-align: center;
        }
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
