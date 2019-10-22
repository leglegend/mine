<template>
  <div class="demo-page message-edit">
    <title :name="'群发消息'"></title>
    <div class="demo-scroll"
         :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="message-new">
          <form @submit="save" v-if="item!=null">

            <tool :type="'input'" :value="item.MessTitle"></tool>
            <tool :type="'textarea'" :value="item.MessInfo"></tool>

            <div class="time" v-if="!isLoading">
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
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import title from '@/components/title'
  import tool from '@/components/messagetool'

  export default {
    components: {
      title, tool
    },

    data () {
      return {
        titleHeight: null,
        item: null,
        validityRange: [],
        validity: [0, 0, 0, 0, 0],
        isLoading: true
      }
    },
    methods: {
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
        message.MessageId = this.messageId
        message.SendDate = this.validityRange[0][this.validity[0]].value +
          '-' + this.validityRange[1][this.validity[1]].value +
          '-' + this.validityRange[2][this.validity[2]].value +
          ' ' + this.validityRange[3][this.validity[3]].value +
          ':' + this.validityRange[4][this.validity[4]].value
        this.$post('/message/businessUpdateMessage', message).then(res => {
          that.$success('保存成功', true)
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
          let arr = res.SendDate.split(/[-: ]/)
          let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4])
          that.validity = [0, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()]
          that.isLoading = false
        })
      }
    },
    onLoad (res) {
      this.storeId = res.storeId
      this.userId = res.userId
      this.messageId = res.messageId
      this.isLoading = true
      this.item = null
      this.getMessage()
      this.titleHeight = this.getGlobalData().titleHeight
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
      console.log('初始化完了')
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .message-edit {
    background: #f0f0f0;
    .message-new {
      padding: 2vh 5vw;
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
        padding-top: 2.5vh;
        textarea {
          width: 84vw;
          height: 28vh;
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
        padding-top: 3vh;
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
      .commit {
        padding-top: 5vh;
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
</style>
