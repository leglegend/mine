<template>
  <div class="demo-page message-detail">
    <title :name="'消息内容'"></title>
    <scroll-view class="demo-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="demo-main"
           :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="buttons">
          <span v-if="item.State==0" class="edit" @click="jumpToEdit">编辑</span>
          <span v-if="item.State==0" class="delete" @click="deleteItem">删除</span>
        </div>
        <div class="message-context">
          <div class="message-item">
            <div>
              <span>{{item.MessTitle}}</span>
              <span :style="{color:item.State?'#78bc6d':'red'}">{{item.State == 1 ? '发送完毕' : '等待发送中'}}</span>
            </div>
            <div>
              <span>发送时间：{{item.SendDate}}</span>
              <span>会员：所有</span>
            </div>
            <div>
              {{item.MessInfo}}
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
        item: {},
        deleting: false
      }
    },
    methods: {
      jumpToEdit () {
        const url = '../edit/main?userId=' + this.userId + '&storeId=' + this.storeId + '&messageId=' + this.messageId
        wx.navigateTo({url})
      },
      deleteItem () {
        this.deleting = true
      },
      doDelete () {
        let that = this
        this.deleting = false
        this.$post('/message/businessDeleteMessage', {
          Uid: that.userId,
          StoreId: that.storeId,
          MessageId: this.messageId
        }, true).then(res => {
          that.$success('删除成功', true)
        })
      },
      getMessage () {
        let that = this
        this.$post('/message/businessGetMessage', {
          Uid: that.userId,
          StoreId: that.storeId,
          MessageId: that.messageId
        }).then(res => {
          that.item = res
          that.firstLoad = false
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.messageId = res.messageId
      this.getMessage()
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad === false) {
        this.getMessage()
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .message-detail {
    background-color: #f0f0f0;
    .buttons {
      text-align: right;
      padding: 1vh 5vw;
      span {
        display: inline-block;
        height: rpx(55);
        line-height: rpx(55);
        background-color: white;
      }
      .edit {
        width: 20vw;
        border: rpx(1) solid #ffbb8d;
        text-align: center;
        border-radius: rpx(30);
        font-size: rpx(27);
        margin-right: 3vw;
        color: #ff986b;
      }
      .delete {
        width: 20vw;
        border: rpx(1) solid #ffbb8d;
        text-align: center;
        border-radius: rpx(30);
        font-size: rpx(27);
        color: #ff986b;
      }
    }
    .message-context {
      padding: 1vh 0;
    }
    .message-item {
      width: 87vw;
      margin: 0 auto;
      border-radius: rpx(5);
      padding: 3vh 3vw 5vh 3vw;
      background-color: white;
      div:nth-child(1) {
        span {
          display: inline-block;
          &:nth-child(1) {
            width: 60vw;
            font-size: rpx(32);
            vertical-align: bottom;
          }
          &:nth-child(2) {
            width: 27vw;
            font-size: rpx(26);
            text-align: right;
            vertical-align: bottom;
          }
        }
      }
      div:nth-child(2) {
        padding-top: rpx(10);
        padding-bottom: rpx(25);
        font-size: rpx(26);
        color: #bfbfbf;
        span {
          display: inline-block;
          &:nth-child(1) {
            width: 52vw;
          }
        }
      }
      div:nth-child(3) {
        padding: 0 rpx(5);
        font-size: rpx(25);
        line-height: rpx(50);
        color: #a6a6a6;
      }
    }
  }
</style>
