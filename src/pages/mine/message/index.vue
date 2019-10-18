<template>
  <div class="demo-page message">
    <title :name="'群发消息'"></title>
    <div class="menu">
      <span class="day" :class="{'select':current==0}" @click="current=0">信息设置</span>
      <span class="month" :class="{'select':current==1}" @click="change(1)">历史记录</span>
    </div>
    <div class="swiper"
         :style="{height:'calc(91.5vh - ' + titleHeight + 'px)'}">
      <div v-show="current==0">
        <div class="table" :style="{height:'calc(91.5vh - ' + titleHeight + 'px)'}">
          <div :style="{height:'calc(81.5vh - ' + titleHeight + 'px)'}">
            <div class="message-new">
              <form @submit="save">
                <tool :type="'input'" :value="value"></tool>
                <tool :type="'textarea'" :value="value"></tool>

                <div class="time">
                  <picker mode="multiSelector"
                          :range="validityRange"
                          :value="validity"
                          @change="validityChange"
                          @columnchange="columnchange"
                          :range-key="'name'">
                  <span>
                    {{validityRange[0][validity[0]].name}}{{validityRange[1][validity[1]].name}}{{validityRange[2][validity[2]].name}}
                    {{validityRange[3][validity[3]].value}}:{{validityRange[4][validity[4]].value}}
                  </span>
                  </picker>
                </div>
                <div class="m-member">
                  <span>所有会员<text style="color: #a7a7a7">(暂不支持筛选)</text></span>
                </div>
                <div class="commit">
                  <button formType="submit">保存</button>
                </div>
              </form>
            </div>
          </div>
          <div class="demo-footer" style="padding-top: 0">
            <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
          </div>
        </div>
      </div>

      <div v-show="current==1">
        <scroll-view scroll-y="true" class="table" @scrolltolower="scrolltolower"
                     :style="{height:'calc(91.5vh - ' + titleHeight + 'px)'}">
          <div :style="{'min-height':'calc(81.5vh - ' + titleHeight + 'px)'}">
            <div v-show="items.length>0">
              <div class="message-item" v-for="item in items">
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
                <div></div>
                <div class="buttons">
                  <span style="width: 45vw">
                    <span v-if="item.State==0" class="edit" @click="jumpToEdit(item)">编辑</span>
                    <span class="delete" :class="item.State==1?'unable':''" @click="deleteItem(item)">删除</span>
                  </span>
                  <span class="detail" @click="jumpToDetail(item)">查看详情</span>
                  <span class="img">
                    <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/right2.png"/>
                  </span>
                </div>
              </div>
              <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
              <div class="footer" v-show="isLoading">加载中...</div>
            </div>
            <div class="demo-noitems" v-show="items.length==0&&!isLoading">
              还没有数据哦 =_="
            </div>
          </div>
          <div class="demo-footer" v-show="isOver||items.length==0" style="padding-top: 0">
            <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
          </div>
        </scroll-view>
      </div>
    </div>
    <div v-if="deleting">
      <confirm :title="'确认删除吗？删除后不可恢复！'" :confirm="'删除'" :cancel="'取消'"
               @confirm="doDelete" @cancel="deleting = false"></confirm>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import tool from '@/components/messagetool'
  import confirm from '@/components/confirm'

  export default {
    components: {
      title, tool, confirm
    },

    data () {
      return {
        titleHeight: null,
        value: '',
        items: [],
        validityRange: [],
        validity: [0, 0, 0, 0, 0],
        current: 0,
        isOver: false,
        isLoading: false,
        titleError: false,
        valueError: false,
        page: 1,
        deleting: false
      }
    },
    methods: {
      jumpToEdit (item) {
        const url = '../edit/main?userId=' + this.userId + '&storeId=' + this.storeId + '&messageId=' + item.Id
        wx.navigateTo({url})
      },
      jumpToDetail (item) {
        const url = '../detail/main?userId=' + this.userId + '&storeId=' + this.storeId + '&messageId=' + item.Id
        wx.navigateTo({url})
      },
      deleteItem (item) {
        if (item.State === 1) {
          return
        }
        this.currentItem = item
        this.deleting = true
      },
      doDelete () {
        let that = this
        this.deleting = false
        this.$post('/message/businessDeleteMessage', {
          Uid: that.userId,
          StoreId: that.storeId,
          MessageId: this.currentItem.Id
        }, true).then(res => {
          that.$success('删除成功')
          that.getItems(1)
        })
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getItems(this.page)
      },
      change (e) {
        this.current = 1
        if (this.current === 1 && this.items.length === 0) {
          this.getItems(1)
        }
      },
      columnchange (e) {
        console.log(e.mp.detail)
        if (e.mp.detail.column === 1) {
          let number = 31
          if (e.mp.detail.value === 3 || e.mp.detail.value === 5 || e.mp.detail.value === 8 || e.mp.detail.value === 10) {
            number = 30
          } else if (e.mp.detail.value === 1) {
            number = 29
          }

          let days = []
          for (var day = 1; day <= number; day++) {
            days.push({
              name: day + '日',
              value: day
            })
          }
          this.validityRange[2] = days
        }
      },
      validityChange (e) {
        this.validity = e.mp.detail.value
      },
      save (e) {
        let childrens = this.$children
        let isError = false
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (isError) {
          return
        }
        let that = this
        let message = e.mp.detail.value
        message.Uid = this.userId
        message.StoreId = this.storeId
        message.MessRange = 0
        message.SendDate = this.validityRange[0][this.validity[0]].value +
          '-' + this.validityRange[1][this.validity[1]].value +
          '-' + this.validityRange[2][this.validity[2]].value +
          ' ' + this.validityRange[3][this.validity[3]].value +
          ':' + this.validityRange[4][this.validity[4]].value
        this.$post('/message/businessAddMessage', message).then(res => {
          that.$success('保存成功', false)
          that.current = 1
          that.getItems(1)
          that.reset()
        })
      },
      reset () {
        let childrens = this.$children
        for (let children of childrens) {
          if (children.reset) {
            children.reset()
          }
        }
        let date = new Date()
        this.validity = [0, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()]
      },
      getItems (page) {
        let that = this
        this.isLoading = true
        this.$post('/message/businessGetMessageList', {
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          if (res.Data.length < 10) {
            that.isOver = true
          }
          for (let i in res.Data) {
            that.items.push(res.Data[i])
          }
          if (page === 1) {
            that.items = res.Data
          }
          that.isLoading = false
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.current = 0
      this.isOver = false
      this.page = 1
      this.titleHeight = this.getGlobalData().titleHeight
      let date = new Date()
      this.validity = [0, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()]
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.current === 1) {
        this.isOver = false
        this.page = 1
        this.getItems(1)
      }
    },
    created () {
      let curretnYear = new Date().getFullYear()
      let years = []
      for (var year = curretnYear; year <= curretnYear + 1; year++) {
        years.push({
          name: year + '年',
          value: year
        })
      }
      this.validityRange.push(years)
      let months = []
      for (var month = 1; month <= 12; month++) {
        months.push({
          name: month + '月',
          value: month
        })
      }
      this.validityRange.push(months)
      let days = []
      for (var day = 1; day <= 31; day++) {
        days.push({
          name: day + '日',
          value: day
        })
      }
      this.validityRange.push(days)
      let hours = []
      for (var hour = 0; hour <= 24; hour++) {
        hours.push({
          name: (hour < 10 ? '0' + hour : hour) + '时',
          value: (hour < 10 ? '0' + hour : hour)
        })
      }
      this.validityRange.push(hours)
      let minutes = []
      for (var minute = 0; minute <= 59; minute++) {
        minutes.push({
          name: (minute < 10 ? '0' + minute : minute) + '分',
          value: (minute < 10 ? '0' + minute : minute)
        })
      }
      this.validityRange.push(minutes)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .message {
    background: #f0f0f0;
    .menu {
      height: 8.5vh;
      line-height: 8.5vh;
      text-align: center;
      font-size: rpx(28);
      color: #ff6700;
      background-color: #f0f0f0;
      .day {
        border-radius: rpx(15) 0 0 rpx(15);
        display: inline-block;
        height: rpx(55);
        line-height: rpx(55);
        border: rpx(1) solid #ff6700;
        text-align: center;
        width: 33vw;
        background-color: white;
      }
      .month {
        border-radius: 0 rpx(15) rpx(15) 0;
        display: inline-block;
        border: rpx(1) solid #ff6700;
        text-align: center;
        height: rpx(55);
        line-height: rpx(55);
        width: 33vw;
        background-color: white;
      }
      .select {
        color: white;
        background-color: #ff6700;
      }
    }
    .swiper {
      height: 83vh;
      .table {
        height: 83vh;
        width: 100vw;
        .block {
          padding: 1vh 5vw;
          background-color: #f0f0f0;
          font-size: rpx(45);
        }
        .title {
          width: 100vw;
          height: 5vh;
          padding-top: 2.3vh;
        }
        .year {
          padding-left: 5vw;
          font-size: rpx(60);
        }
        .logo {
          width: 19vw;
          height: rpx(60);
          line-height: rpx(60);
          text-align: center;
          background-color: #78bc6d;
          border-radius: 0 rpx(35) rpx(35) 0;
          font-size: rpx(36);
          color: white;
        }
        .move-left {
          position: relative;
          left: -5vw;
        }
        .collect-itemone {
          width: 90vw;
          font-size: rpx(29);
          margin: 0 auto;
          border-bottom: rpx(1) solid #dddddd;
          line-height: 8vh;
          span {
            display: inline-block;
            &:nth-child(1) {
              width: 42vw;
            }
            &:nth-child(2) {
              width: 10vw;
            }
            &:nth-child(3) {
              width: 38vw;
              text-align: right;
              font-size: rpx(33);
            }
          }
        }
        .collect-total {
          color: #7e7e7e;
          border-bottom: rpx(2) solid #dddddd;
        }
        .last-item {
          border-bottom: 0 solid white;
        }
      }

    }
    .message-new {
      padding: 1vh 5vw 1vh 5vw;
      background-color: white;
      .input {
        input {
          width: 89vw;
          padding-left: 1vw;
          height: 6vh;
          line-height: 6vh;
          font-size: rpx(30);
          border-bottom: 1px solid #d5d5d5;
          display: block;
        }
      }
      .textarea {
        padding-top: 2vh;
        textarea {
          width: 84vw;
          height: 24vh;
          font-size: rpx(30);
          border: 1px solid #d5d5d5;
          display: block;
          padding: 1vh 3vw;
        }
        .number {
          text-align: right;
          font-size: rpx(28);
          padding-top: 1vh;
          color: #ababb1;
        }
      }
      .time {
        padding-top: 1vh;
        span {
          width: 89vw;
          padding-left: 1vw;
          height: 6vh;
          line-height: 6vh;
          font-size: rpx(30);
          border-bottom: 1px solid #d5d5d5;
          display: block;
        }
      }
      .m-member {
        span {
          width: 89vw;
          padding-left: 1vw;
          height: 6vh;
          line-height: 6vh;
          font-size: rpx(30);
          border-bottom: 1px solid #d5d5d5;
          display: block;
        }
      }
      .commit {
        padding-top: 2vh;
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
    .message-item {
      width: 87vw;
      margin: 0 auto;
      margin-bottom: 2vh;
      border-radius: rpx(5);
      padding: 3vh 3vw 0 3vw;
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
        height: rpx(150);
        overflow: hidden;
        text-overflow: ellipsis;
        color: #a6a6a6;
      }
      div:nth-child(4) {
        padding-top: rpx(25);
        border-bottom: rpx(1) solid #d4d4d4;
      }
      .buttons {
        height: rpx(90);
        line-height: rpx(90);
        span {
          display: inline-block;
          height: rpx(55);
          line-height: rpx(55);
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
        .unable {
          color: #a7a7a7;
          border: rpx(1) solid #a7a7a7;
        }
        .detail {
          width: 35vw;
          text-align: right;
          font-size: rpx(25);
          color: #bfbfbf;
        }
        .img {
          width: 5vw;
          text-align: right;
          img {
            display: inline-block;
            height: rpx(21);
            width: rpx(13);
            vertical-align: middle;
            position: relative;
          }
        }
      }
    }
  }
</style>
