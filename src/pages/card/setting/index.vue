<template>
  <div class="setting">
    <title :name="'会员资料设置'"></title>
    <scroll-view scroll-y="true" class="setting-scroll"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="setting-title">
          <span>?</span>
          <span>
            <div>1、请选择需要会员提供的信息</div>
            <div>2、没必要的不要选，以免用户注册时产生反感！</div>
          </span>
        </div>
        <div class="setting-context">
          <div class="title">
            <span>需要的资料</span>
            <span style="text-align: right">是否必须填写</span>
          </div>
          <div class="check-panel">
            <div class="check">
              <span class="left">
                <span class="name">手机号</span>
              </span>
              <span class="value">
                <switch v-bind:checked="true" disabled="true" color="#CACAD0"/>
              </span>
            </div>
            <div class="check" v-for="(item,index) in checked">
              <span class="left">
                <span class="name">{{item.ControlInstructions}}</span>
              </span>
              <span class="value">
                <switch @change="switchChange(item)" v-bind:checked="item.IsMust" color="#78bc6d"/>
              </span>
            </div>
          </div>
          <div class="select-panel">
            <checkbox-group @change="checkboxChange">
              <label class="checkbox" v-for="item in items" :key="item.Id">
                <checkbox v-bind:checked="item.isChecked" v-bind:value="item.Id"/>
                {{item.ControlInstructions}}
              </label>
            </checkbox-group>
          </div>
        </div>
      </div>
      <div class="demo-footer" style="padding-top: 0vh">
        <img class="demo-nutcards" src="/static/nutcards.png"/>
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
        items: [],
        checked: [],
        isChoosing: false,
        titleHeight: null
      }
    },
    methods: {
      getCustomControls () {
        let that = this
        this.$post('/store/businessGetCustomControls', {Uid: this.userId, StoreId: this.storeId}).then(res => {
          that.checked = res.StoreControls
          for (var i in res.CustomControls) {
            res.CustomControls[i].isChecked = false
            res.CustomControls[i].Cid = res.CustomControls[i].Id
            for (var j in that.checked) {
              if (that.checked[j].Cid === res.CustomControls[i].Id) {
                res.CustomControls[i].isChecked = true
              }
            }
          }
          that.items = res.CustomControls
        })
      },
      switchChange (item) {
        if (item.IsMust === 1) {
          item.IsMust = 0
        } else {
          item.IsMust = 1
        }
        this.$post('/store/businessSetCustomControls', {
          Uid: this.userId,
          StoreId: this.storeId,
          Cid: item.Cid,
          ControlName: item.ControlName,
          ControlInstructions: item.ControlInstructions,
          IsMust: item.IsMust,
          State: 1
        }).then(res => {
        })
      },
      doSave () {
        this.$success('保存成功', true)
      },
      checkboxChange (e) {
        let id = ''

        if (e.mp.detail.value.length > this.checked.length) {
          id = parseInt(e.mp.detail.value[e.mp.detail.value.length - 1])
        } else {
          for (let check of this.checked) {
            let isHave = false
            for (let item of e.mp.detail.value) {
              if (parseInt(item) === check.Cid) {
                isHave = true
              }
            }
            if (!isHave) {
              id = check.Cid
            }
          }
        }
        let current = {}
        for (var i in this.items) {
          if (id === this.items[i].Id) {
            current = this.items[i]
          }
        }
        if (current.isChecked) {
          let items = []
          current.isChecked = false
          for (var j in this.checked) {
            if (current.Id !== this.checked[j].Cid) {
              items.push(this.checked[j])
            }
          }
          this.checked = items
        } else {
          current.isChecked = true
          current.Cid = current.Id
          this.checked.push(current)
        }
        this.refreshChecked()
        this.$post('/store/businessSetCustomControls', {
          Uid: this.userId,
          StoreId: this.storeId,
          Cid: current.Id,
          ControlName: current.ControlName,
          ControlInstructions: current.ControlInstructions,
          IsMust: current.IsMust,
          State: current.isChecked ? 1 : 0
        }).then(res => {
        })
      },
      refreshChecked () {
        var temp
        let arr = []
        for (let item of this.checked) {
          arr.push(item)
        }
        let i = arr.length
        while (i > 0) {
          for (var j = 0; j < i - 1; j++) {
            if (arr[j].Cid > arr[j + 1].Cid) {
              temp = {
                Cid: arr[j].Cid,
                ControlInstructions: arr[j].ControlInstructions,
                ControlName: arr[j].ControlName,
                Id: arr[j].Id,
                IsMust: arr[j].IsMust,
                isChecked: arr[j].isChecked
              }
              arr[j] = {
                Cid: arr[j + 1].Cid,
                ControlInstructions: arr[j + 1].ControlInstructions,
                ControlName: arr[j + 1].ControlName,
                Id: arr[j + 1].Id,
                IsMust: arr[j + 1].IsMust,
                isChecked: arr[j + 1].isChecked
              }
              arr[j + 1] = temp
            }
          }
          i--
        }
        this.checked = []
        this.checked = arr
      }
    },
    onLoad (option) {
      this.userId = option.userId
      this.storeId = option.storeId
      this.getCustomControls(1)
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

  .setting {
    height: 100vh;
    font-size: rpx(26);
    background-color: #f0f0f0;
    .setting-scroll {
      height: 90vh;
      .setting-title {
        padding: 3.5vh 5vw 2vh 5vw;
        font-size: rpx(26);
        background-color: #ffedad;
        span {
          display: inline-block;
          line-height: 3vh;
          vertical-align: top;
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
      .setting-context {
        width: 90vw;
        padding: 3vh 5vw;
        background-color: white;
        .title {
          height: 5vh;
          line-height: 5vh;
          color: #a6a6a6;
          span {
            display: inline-block;
            width: 42vw;
            padding: 0 1vw;
          }
        }
        .commit {
          padding: 4.5vh 0;
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
            font-size: rpx(40);
            color: white;
          }
        }
      }
    }

    .check-panel {
      padding-bottom: 4vh;
      border-bottom: 1px solid #d5d5d5;
      .check {
        width: 90vw;
        height: 7vh;
        line-height: 7vh;
        span {
          display: inline-block;
          width: 45vw;
        }
        .left {
          height: 7vh;
          line-height: 7vh;
          vertical-align: middle;
          .name {
            border-radius: 15px;
            width: 20vw;
            text-align: center;
            height: 4vh;
            line-height: 4vh;
            background-color: #f0f0f0;
            vertical-align: middle;
          }
        }
        .value {
          height: 7vh;
          line-height: 7vh;
          vertical-align: middle;
          text-align: right;
          width: 43vw;
        }
      }
    }
    .select-panel {
      padding-top: 3vh;
      label {
        width: 22vw;
        height: 6vh;
        line-height: 6vh;
        display: inline-block;
      }
    }
  }
</style>
