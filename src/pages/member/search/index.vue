<template>
  <div class="search">
    <title :name="'筛选会员'"></title>
    <div style="position: relative;" :style="{height:'calc(100vh - ' +titleHeight+'px)'}">
      <div class="result-filter" v-show="type=='result'" style="position: absolute;z-index: 1000">
        <div class="select">
          <span class="selected" v-if="Validity==0||Validity==1">处于有效期</span>
          <span class="selected" v-if="Validity==0||Validity==2">卡已过期</span>
          <span class="selected" v-if="HaveMony==0||HaveMony==1">有余额</span>
          <span class="selected" v-if="HaveMony==0||HaveMony==2">余额为0</span>
          <span class="selected" v-if="Sex==0||Sex==1">男</span>
          <span class="selected" v-if="Sex==0||Sex==2">女</span>
        </div>
        <div class="panel">
          <div v-show="ConsumptionDateStart!=''||ConsumptionDateEnd!=''">
            <span>消费日期：</span>
            <span>{{ConsumptionDateStart}} 至 {{ConsumptionDateEnd}}</span>
          </div>
          <div v-show="OpenCardDateStart!=''||OpenCardDateEnd!=''">
            <span>开卡日起：</span>
            <span>{{OpenCardDateStart}} 至 {{OpenCardDateEnd}}</span>
          </div>
          <div v-show="ConsumptionMonyMin!=''||ConsumptionMonyMax!=''">
            <span>消费范围：</span>
            <span>{{ConsumptionMonyMin}} ~ {{ConsumptionMonyMax}}</span>
          </div>
          <div v-show="ConsumptionSumMin!=''||ConsumptionSumMax!=''">
            <span>消费次数：</span>
            <span>{{ConsumptionSumMin}} ~ {{ConsumptionSumMax}}</span>
          </div>
          <div v-show="CardSumMin!=''||CardSumMax!=''">
            <span>剩余次数：</span>
            <span>{{CardSumMin}} ~ {{CardSumMax}}</span>
          </div>
        </div>
        <div class="change-button" @click="exchange">
          <span>更换条件<img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/filter.png"/></span>
        </div>
      </div>
      <div class="condition" v-show="type=='search'">
        <div class="select">
          <span v-bind:class="{'selected':Validity==0||Validity==1}" @click="changeSelect('Validity',1)">有效期内</span>
          <span v-bind:class="{'selected':Validity==0||Validity==2}" @click="changeSelect('Validity',2)">卡已过期</span>
          <span v-bind:class="{'selected':HaveMony==0||HaveMony==1}" @click="changeSelect('HaveMony',1)">有余额</span>
          <span v-bind:class="{'selected':HaveMony==0||HaveMony==2}" @click="changeSelect('HaveMony',2)">余额为0</span>
          <span v-bind:class="{'selected':Sex==0||Sex==1}" @click="changeSelect('Sex',1)">男性</span>
          <span v-bind:class="{'selected':Sex==0||Sex==2}" @click="changeSelect('Sex',2)">女性</span>
        </div>
        <div class="params">
          <div class="param">
            <div class="title">消费日期</div>
            <div>
              <picker class="picker" @change="consumptionDateStart" mode="date" :value="ConsumptionDateStart">
                <view class="model">{{ConsumptionDateStart}}</view>
              </picker>
              —
              <picker class="picker" @change="consumptionDateEnd" mode="date" :value="ConsumptionDateEnd">
                <view class="model">{{ConsumptionDateEnd}}</view>
              </picker>
            </div>
          </div>

          <div class="param">
            <div class="title">开卡日期</div>
            <div>
              <picker class="picker" @change="openCardDateStart" mode="date" :value="OpenCardDateStart">
                <view class="model">{{OpenCardDateStart}}</view>
              </picker>
              —
              <picker class="picker" @change="openCardDateEnd" mode="date" :value="OpenCardDateEnd">
                <view class="model">{{OpenCardDateEnd}}</view>
              </picker>
            </div>
          </div>

          <div class="param">
            <div class="title">消费(元)</div>
            <div>
              <input class="model" v-model="ConsumptionMonyMin" type="number" adjust-position="false"/>
              —
              <input class="model" v-model="ConsumptionMonyMax" type="number" adjust-position="false"/>
            </div>
          </div>

          <div class="param">
            <div class="title">消费次数</div>
            <div>
              <input class="model" v-model="ConsumptionSumMin" type="number" adjust-position="false"/>
              —
              <input class="model" v-model="ConsumptionSumMax" type="number" adjust-position="false"/>
            </div>
          </div>

          <div class="param">
            <div class="title">剩余次数</div>
            <div>
              <input class="model" v-model="CardSumMin" type="number" adjust-position="false"/>
              —
              <input class="model" v-model="CardSumMax" type="number" adjust-position="false"/>
            </div>
          </div>
        </div>
        <div class="buttons">
          <span class="reset" @click="reset">重置</span>
          <span class="confirm" @click="confirm(1)">确定</span>
        </div>
        <div class="switch" @click="type='result'"><img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/top.png"/></div>
      </div>
      <scroll-view class="searchresult" scroll-y="true" @scrolltolower="scrolltolower"
                   :style="{height:'calc(100vh - ' +titleHeight+'px)'}">
        <div :style="{'min-height':'calc(90vh - ' +titleHeight+'px)'}">
          <div class="result-filter" style="border: 0">
            <div class="select">
              <span class="selected" v-if="Validity==0||Validity==1">处于有效期</span>
              <span class="selected" v-if="Validity==0||Validity==2">卡已过期</span>
              <span class="selected" v-if="HaveMony==0||HaveMony==1">有余额</span>
              <span class="selected" v-if="HaveMony==0||HaveMony==2">余额为0</span>
              <span class="selected" v-if="Sex==0||Sex==1">男</span>
              <span class="selected" v-if="Sex==0||Sex==2">女</span>
            </div>
            <div class="panel">
              <div v-show="ConsumptionDateStart!=''&&ConsumptionDateEnd!=''">
                <span>消费日期：</span>
                <span>{{ConsumptionDateStart}}至{{ConsumptionDateEnd}}</span>
              </div>
              <div v-show="OpenCardDateStart!=''&&OpenCardDateEnd!=''">
                <span>开卡日起：</span>
                <span>{{OpenCardDateStart}}至{{OpenCardDateEnd}}</span>
              </div>
              <div v-show="ConsumptionMonyMin!=''&&ConsumptionMonyMax!=''">
                <span>消费范围：</span>
                <span>{{ConsumptionMonyMin}}~{{ConsumptionMonyMax}}</span>
              </div>
              <div v-show="ConsumptionSumMin!=''&&ConsumptionSumMax!=''">
                <span>消费次数：</span>
                <span>{{ConsumptionSumMin}}~{{ConsumptionSumMax}}</span>
              </div>
              <div v-show="CardSumMin!=''&&CardSumMax!=''">
                <span>剩余次数：</span>
                <span>{{CardSumMin}}~{{CardSumMax}}</span>
              </div>
            </div>
            <div class="filter-face"></div>
          </div>
          <div class="items" v-show="items.length>0">
            <div class="number">共找到{{total}}名</div>
            <a v-for="(item,index) in items" v-on:click="jumpToDetails(item)">
              <item :key="index" :item="item" :last="index==items.length-1"></item>
            </a>
            <div class="footer" v-show="isOver">—— &nbsp;没有更多了哦&nbsp; ——</div>
            <div class="footer" v-show="isLoading">加载中...</div>
          </div>
          <div class="no-items" v-show="items.length==0&&!isLoading">
            <div>共找到0名会员=_="</div>
            <div>请检查或更换查询条件</div>
          </div>
        </div>
        <div class="demo-footer" v-show="items.length==0||isOver" style="padding-top: 0">
          <img class="demo-nutcards" src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nutcards.png"/>
        </div>
        <div class="demo-bottom"></div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import item from '@/components/mbr'
  import title from '@/components/title'

  export default {
    components: {
      item, title
    },

    data () {
      return {
        type: 'search',
        titleHeight: null,
        Sex: null, // 性别0 all  1男 2女
        Validity: null, // 有效期0 all  1有效 2过期
        HaveMony: null, // 余额0 all  1有 2无
        ConsumptionDateStart: '', // 消费日期开始
        ConsumptionDateEnd: '', // 消费日期结束
        OpenCardDateStart: '', // 开卡日期开始
        OpenCardDateEnd: '', // 开卡日期结束
        ConsumptionMonyMin: '',
        ConsumptionMonyMax: '',
        ConsumptionSumMin: '',
        ConsumptionSumMax: '',
        CardSumMin: '',
        CardSumMax: '',
        items: [],
        isLoading: false, // 正在加载明细
        isOver: false, // 消费明细是否加载完
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
        this.confirm(this.page)
      },
      consumptionDateStart (e) {
        this.ConsumptionDateStart = e.mp.detail.value
      },
      consumptionDateEnd (e) {
        this.ConsumptionDateEnd = e.mp.detail.value
      },
      openCardDateStart (e) {
        this.OpenCardDateStart = e.mp.detail.value
      },
      openCardDateEnd (e) {
        this.OpenCardDateEnd = e.mp.detail.value
      },
      changeSelect (type, sex) {
        if (this[type] === null) {
          this[type] = sex
          return
        }

        if (sex === 1) {
          if (this[type] === 0) {
            this[type] = 2
          } else if (this[type] === 1) {
            this[type] = null
          } else if (this[type] === 2) {
            this[type] = 0
          }
        } else {
          if (this[type] === 0) {
            this[type] = 1
          } else if (this[type] === 1) {
            this[type] = 0
          } else if (this[type] === 2) {
            this[type] = null
          }
        }
      },
      reset () {
        this.Sex = null
        this.Validity = null
        this.HaveMony = null
        this.ConsumptionDateStart = ''
        this.ConsumptionDateEnd = ''
        this.OpenCardDateStart = ''
        this.OpenCardDateEnd = ''
        this.ConsumptionMonyMin = ''
        this.ConsumptionMonyMax = ''
        this.ConsumptionSumMin = ''
        this.ConsumptionSumMax = ''
        this.CardSumMin = ''
        this.CardSumMax = ''
      },
      confirm (page) {
        let that = this
        this.type = 'result'
        this.$post('/card/businessGetUserCards', {
          Sex: this.Sex,
          Validity: this.Validity,
          HaveMony: this.HaveMony,
          ConsumptionDateStart: this.ConsumptionDateStart ? this.ConsumptionDateStart + ' 00:00' : null,
          ConsumptionDateEnd: this.ConsumptionDateEnd ? this.ConsumptionDateEnd + ' 23:59' : null,
          OpenCardDateStart: this.OpenCardDateStart ? this.OpenCardDateStart + ' 00:00' : null,
          OpenCardDateEnd: this.OpenCardDateEnd ? this.OpenCardDateEnd + ' 23:59' : null,
          ConsumptionMonyMin: this.ConsumptionMonyMin,
          ConsumptionMonyMax: this.ConsumptionMonyMax,
          ConsumptionSumMin: this.ConsumptionSumMin,
          ConsumptionSumMax: this.ConsumptionSumMax,
          CardSumMin: this.CardSumMin,
          CardSumMax: this.CardSumMax,
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
          this.total = res.TotalCount
          this.isLoading = false
        })
      },
      exchange () {
        this.type = 'search'
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.reset()
      this.type = 'search'
      this.items = []
      this.isOver = false
      this.page = 1
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .search {
    width: 100vw;
    height: 100vh;
    background: #f0f0f0;
    .condition {
      width: 95vw;
      padding-left: 5vw;
      background: white;
      position: absolute;
      top: 0;
      z-index: 1000;
      .select {
        span {
          display: inline-block;
          width: 20vw;
          margin-top: 1vh;
          margin-right: 2vw;
          margin-bottom: 1vh;
          height: rpx(50);
          line-height: rpx(50);
          text-align: center;
          border-radius: 15px;
          font-size: rpx(26);
          border: rpx(1) solid #f0f0f0;
          background: #f0f0f0;
          color: #7e7e7e;
        }
        .selected {
          background-color: #fff3eb;
          color: #ff6700;
          border: rpx(1) solid #ff6700;
        }
      }
      .params {
        padding-top: 2.7vh;
        color: #7e7e7e;
        .param {
          height: 7.3vh;
          white-space: nowrap;
          font-size: rpx(26);
          div {
            display: inline-block;
            vertical-align: top;
            width: 17vw;
          }
          .title {
            height: rpx(50);
            line-height: rpx(50);
            padding-left: 0.5vw;
            color: #7e7e7e;
          }
          .picker {
            display: inline-block;
            height: rpx(50);
          }
          .model {
            display: inline-block;
            width: 33vw;
            height: rpx(50);
            line-height: rpx(50);
            background: #f0f0f0;
            border-radius: 15px;
            vertical-align: top;
            text-align: center;
            color: black;
          }
        }
      }
      .buttons {
        width: 90vw;
        margin: 0 auto;
        text-align: center;
        span {
          display: inline-block;
          border-radius: 25px;
          height: 6vh;
          line-height: 6vh;
          text-align: center;
          border: rpx(1) solid #ff6700;
          width: 28vw;
          margin: 2vh 4vw;
          margin-left: 0;
          font-size: rpx(35);
        }
        .reset {
          color: #ff6700;
        }
        .confirm {
          color: white;
          background-color: #ff6700;
        }
      }
      .switch {
        text-align: center;
        width: 90vw;
        height: 2vh;
        line-height: 2vh;
        padding-bottom: 1vh;
        img {
          width: rpx(64);
          height: rpx(18);
        }
      }
    }
    .result-filter {
      border-bottom: rpx(1) solid #bfbfbf;
      padding-bottom: 1.5vh;
      position: relative;
      background: white;
      .select {
        padding: 0 5vw;
        width: 90vw;
        padding-bottom: 2vh;
        display: inline-block;
        .selected {
          display: inline-block;
          height: rpx(45);
          line-height: rpx(45);
          padding: 0 rpx(30);
          font-size: rpx(26);
          border: rpx(1) solid #f0f0f0;
          background: #f0f0f0;
          vertical-align: top;
          border-radius: rpx(25);
          margin-right: rpx(10);
          margin-bottom: rpx(5);
        }
      }
      .panel {
        width: 90vw;
        margin: 0 auto;
        div {
          font-size: rpx(26);
          height: 4.1vh;
          span:nth-child(1) {
            color: #a7a7a7;
          }
        }
      }
      .change-button {
        span {
          position: absolute;
          bottom: rpx(-50);
          height: rpx(50);
          text-align: center;
          display: inline-block;
          width: 26vw;
          left: calc(37vw - 1rpx);
          font-size: rpx(31);
          height: rpx(50);
          line-height: rpx(50);
          vertical-align: top;
          border: rpx(1) solid #bfbfbf;
          border-radius: 0 0 rpx(10) rpx(10);
          background: white;
          color: #ff6700;
        }
        img {
          display: inline-block;
          width: rpx(34);
          height: rpx(29);
          vertical-align: middle;
        }
      }
      .filter-face {
        width: 100vw;
        position: absolute;
        height: 100%;
        top: 0;
        background-color: #f0f0f0;
      }
    }
    .searchresult {
      width: 100vw;
      height: 90vh;
      text-align: left;
    }
    .no-items {
      text-align: center;
      padding-top: 15vh;
      line-height: 4vh;
      color: #858585;
      div:nth-child(1) {
        font-size: rpx(30);
      }
      div:nth-child(2) {
        font-size: rpx(25);
      }
    }
    .items {
      background: white;
      margin-top: 2vh;
      .number {
        padding: 3.7vh 5vw 0 5vw;
        font-size: rpx(33);
        font-weight: 600;
      }
    }
  }
</style>
