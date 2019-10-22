<template>
  <div class="mine-name">
    <title :name="'店员姓名'"></title>
    <scroll-view scroll-y="true" class="name-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="name-title">
          <span>?</span>
          <span>
            <div>当该店员操作顾客会员卡时，方便核对操作人！</div>
          </span>
        </div>
        <div class="name-context">
          <input class="input"
                 placeholder="请填写店员姓名"
                 name="name"
                 v-model="value"/>
          <div class="commit">
            <button @click="save">保存</button>
          </div>
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
        value: ''
      }
    },
    methods: {
      save () {
        let that = this
        this.$post('/user/businessSetAdminName', {
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          UserName: this.value,
          UserId: this.info.adminId
        }).then(res => {
          let globalData = that.getGlobalData()
          globalData.admin.StoreUserName = that.value
          that.$success('保存成功', true)
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.value = ''
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .mine-name {
    height: 100vh;
    background-color: #f0f0f0;
    .name-scroll {
      height: 90vh;
      .name-title {
        padding: 2.5vh 5vw 2vh 5vw;
        font-size: rpx(26);
        span {
          display: inline-block;
          line-height: 3vh;
          vertical-align: top;
          color: #ff6700;
          &:nth-child(1) {
            width: 3vh;
            text-align: center;
            line-height: 3vh;
            font-size: rpx(25);
            font-weight: bold;
            border-radius: 50%;
            background-color: #fddec9;
          }
          &:nth-child(2) {
            padding-left: 2vw;
          }
        }
      }
      .name-context {
        padding: 3vh 5vw;
        background-color: white;
        .input {
          width: 84vw;
          height: 5vh;
          line-height: 5vh;
          font-size: rpx(30);
          border-bottom: 1px solid #d5d5d5;
          display: block;
        }
        .commit {
          padding: 4vh 0;
          padding-bottom: 0vh;
          text-align: right;
          button {
            display: inline-block;
            height: rpx(80);
            line-height: rpx(80);
            text-align: center;
            background-color: #ff6700;
            border-radius: rpx(40);
            font-size: rpx(35);
            color: white;
            width: 28vw;
            font-size: rpx(35);
            color: white;
          }
        }
      }
    }
  }
</style>
