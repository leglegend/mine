<template>
  <div class="card-benefit">
    <title :name="'会员权益说明'"></title>
    <div scroll-y="true" class="benefit-scroll"
         :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="benefit-title">
          <span>?</span>
          <span>
            <div>向会员说明该会员卡可以享受的权益</div>
          </span>
        </div>
        <div class="benefit-context">
          <textarea class="input" v-model="value" maxlength="1000" :placeholder="'请填写内容'"/>
          <div class="number" :style="{color:value.length==1000?'red':''}">已写{{value.length}}字/最多1000字</div>
          <div class="commit">
            <button @click="saveBenefit">保存</button>
          </div>
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

  export default {
    components: {
      title
    },

    data () {
      return {
        value: '',
        titleHeight: ''
      }
    },
    methods: {
      getBenefit () {
        let that = this
        this.$post('/store/businessGetCardInterests', {Uid: this.info.userId, StoreId: this.info.storeId}).then(res => {
          that.value = res.CardInstructions ? res.CardInstructions : ''
        })
      },
      saveBenefit () {
        let that = this
        this.$post('/store/businessSetCardInterests', {
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          CardInstructions: this.value
        }, true).then(res => {
          that.$success('保存成功', true)
        })
      }
    },
    onLoad (option) {
      this.info = option
      this.getBenefit()
    },
    created () {
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .card-benefit {
    height: 100vh;
    background-color: #f0f0f0;
    .benefit-scroll {
      height: 90vh;
      .benefit-title {
        padding: 2.5vh 5vw 2vh 5vw;
        font-size: rpx(26);
        background-color: #ffedad;
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
            background-color: #c48f21;
            color: #ffedad;
          }
          &:nth-child(2) {
            padding-left: 2vw;
            color: #c48f21;
          }
        }
      }
      .benefit-context {
        padding: 3vh 5vw;
        background-color: white;
        .input {
          width: 84vw;
          height: 50vh;
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
