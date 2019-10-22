<template>
  <div class="keyword">
    <title :name="'搜索会员'" :noline="true"></title>
    <div class="key-searck">
      <div class="search">
        <span>
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/search2.png"/>
        </span>
        <input @blur="onBlur" @focus="onFocus" :focus="true"/>
      </div>
    </div>
    <scroll-view class="keyword-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(94vh - 1rpx - ' +titleHeight+'px)'}">
      <div :style="{'min-height':'calc(84vh - 1rpx - ' +titleHeight+'px)'}">
        <div class="items" v-show="items.length>0">
          <div class="items-total">共找到{{total}}名</div>
          <a v-for="(item,index) in items" v-on:click="jumpToDetails(item)">
            <item :key="index" :item="item" :last="index==items.length-1" :keyword="value"></item>
          </a>
          <div style="padding: 2vw;background: white"></div>
          <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
          <div class="footer" v-show="isLoading">加载中...</div>
        </div>
        <div class="cue" v-show="showCue">
          <div>可以按以下条件搜索</div>
          <div>
            <span>手机号</span>
            <span>卡号</span>
            <span>姓名</span>
            <span>微信昵称</span>
          </div>
        </div>
        <div class="no-items" v-show="!showCue&&items.length==0&&!isLoading">
          <div>共找到0名会员=_="</div>
          <div>请检查输入的关键字或更换条件</div>
        </div>
      </div>
      <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
        <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
      </div>
      <div class="demo-bottom"></div>
    </scroll-view>
  </div>
</template>

<script>
  import item from '@/components/mbrforkeyword'
  import title from '@/components/title'

  export default {
    components: {
      item, title
    },

    data () {
      return {
        statusBarHeight: null,
        titleHeight: null,
        items: [],
        value: null,
        isLoading: true, // 正在加载明细
        isOver: false, // 消费明细是否加载完
        showCue: true,
        total: 0,
        page: 1 // 消费明细当前页
      }
    },
    methods: {
      jumpToDetails (item) {
        const url = '../persion/main?userId=' + this.userId + '&storeId=' + this.storeId + '&memberId=' + item.UserId + '&cardId=' + item.CardId
        wx.navigateTo({url})
      },
      scrolltolower () {
        if (this.isLoading || this.isOver) {
          return
        }
        this.page += 1
        this.getMembers(this.page)
      },
      onBlur (e) {
        this.value = e.mp.detail.value
        if (this.value === '') {
          this.items = []
          return
        }
        this.showCue = false
        this.getMembers(1)
      },
      onFocus () {
        this.items = []
        this.showCue = true
      },
      getMembers (page) {
        let that = this
        this.isLoading = true
        this.type = 'result'
        this.$post('/card/businessGetUserCards', {
          KeyWord: this.value,
          Uid: that.userId,
          StoreId: that.storeId,
          PageSize: 10,
          PageIndex: page
        }).then(res => {
          if (res.Data.length < 10) {
            that.isOver = true
          }
          if (page === 1) {
            that.items = res.Data
          } else {
            for (let i in res.Data) {
              that.items.push(res.Data[i])
            }
          }
          that.total = res.TotalCount
          this.isLoading = false
        })
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.showCue = true
      this.items = []
      this.isOver = false
      this.page = 1
      this.statusBarHeight = this.getGlobalData().statusBarHeight
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .keyword {
    width: 100vw;
    height: 100vh;
    background: #f0f0f0;
    .key-searck {
      width: 100vw;
      height: 6vh;
      border-bottom: rpx(1) solid #bebebe;
      background: white;
      .search {
        width: 90vw;
        margin: 0 auto;
        display: block;
        background: #f3f3f3;
        border-radius: rpx(10);
        height: rpx(50);
        line-height: rpx(50);
        span {
          display: inline-block;
          height: rpx(50);
          line-height: rpx(50);
          vertical-align: top;
          width: 8vw;
          text-align: center;
        }
        img {
          display: inline-block;
          width: rpx(22);
          height: rpx(22);
        }
        input {
          display: inline-block;
          height: rpx(50);
          width: 80vw;
          font-size: rpx(25);
          vertical-align: top;
        }
      }
    }
    .keyword-scroll {
      height: 84vh;
      width: 100vw;
      .items {
        width: 100vw;
        background: white;
        margin-top: 2vh;
        .items-total {
          padding-top: 4vh;
          padding-left: 5vw;
          font-size: rpx(35);
          font-weight: 600;
        }
      }
      .cue {
        padding: 3vh 5vw;
        font-size: rpx(26);
        div:nth-child(2) {
          padding: 2vh 5vw;
          span {
            display: inline-block;
            text-align: center;
            height: rpx(55);
            line-height: rpx(55);
            width: 17.5vw;
            margin-right: 2vw;
            border-radius: rpx(25);
            color: #7e7e7e;
            background: #e4e4e4;
          }
        }
      }
      .no-items {
        text-align: center;
        padding-top: 5vh;
        line-height: 4vh;
        color: #858585;
        div:nth-child(1) {
          font-size: rpx(30);
        }
        div:nth-child(2) {
          font-size: rpx(25);
        }
      }
    }
  }
</style>
