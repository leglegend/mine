<template>
  <div class="addservice-model" :animation="modelAnimation" @click.stop="doClose">
    <div class="addservice-context" :animation="contextAnimation" @click.stop="">
      <div class="context-top">
        <span @click="doClose">
          <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/close2.png"/>
        </span>
      </div>
      <div class="context-middle">
        <div class="context-title">
          <span>服务项目</span>
          <span>额度(次)</span>
        </div>
        <div class="service-item" v-for="(item,index) in items"
             :style="{'z-index':item.showTags?5000:2000}">
          <span>
            <input :focus="item.showTags||(focus&&index==items.length-1&&!item.ItemName)" v-model="item.ItemName"
                   placeholder="如：理发"
                   @focus="showTags(item,1)" @blur="onBlur(item)" placeholder-style="color:#BABABA"
                   @input="item.ItemId=null"
                   adjust-position="false"/>
          </span>
          <span>
            <input v-model="item.CardValue" type="number" placeholder="如：5" placeholder-style="color:#BABABA"
                   adjust-position="false" :focus="numberFocus&&item.numberFocus" @focus="onNumberFocus(item)"
                   @input="item.ItemId=null"
                   @blur="onNumberBlur(item)"/>
          </span>
          <span class="item-add" v-if="index==items.length-1" @click="addItem">
            +
          </span>
          <span class="item-sub" v-if="index!=items.length-1" @click="subItem(index)">
            <text></text>
          </span>
          <div class="item-tags" v-if="item.showTags&&tags&&tags.length>0"
               :class="index==items.length-1&&(!gifts||gifts.length==0)?'item-bottom':'item-top'">
            <div v-for="(tag,tagIndex) in tags" @click="changeName(item,tag.ItemName)">
              {{tag.ItemName}}
            </div>
          </div>
        </div>
        <div v-if="type=='create'">
          <div class="context-gift">
            <img @click="changeGift" v-if="gifts&&gifts.length>0"
                 src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/hasgift.png"/>
            <img @click="changeGift" v-if="!gifts||gifts.length==0"
                 src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/nogift.png"/>
            <span @click="changeGift">再赠</span>
          </div>
          <div :class="gifts&&gifts.length>0?'':'service-gone'">
            <div class="service-item" v-for="(item,index) in gifts"
                 :style="{'z-index':item.showTags?5000:2000}">
            <span>
              <input :focus="item.showTags||(giftFocus&&index==gifts.length-1)" v-model="item.ItemName"
                     placeholder="如：理发"
                     adjust-position="false"
                     @focus="showTags(item,0)" @blur="onBlur(item)" @input="item.ItemId=null"
                     placeholder-style="color:#BABABA"/>
            </span>
              <span>
              <input v-model="item.CardValue" type="number" placeholder="如：5" adjust-position="false"
                     placeholder-style="color:#BABABA" :focus="numberFocus&&item.numberFocus"
                     @focus="onNumberFocus(item)" @input="item.ItemId=null"
                     @blur="onNumberBlur(item)"/>
            </span>
              <span class="item-add" v-if="index==gifts.length-1" @click="addGift">
              +
            </span>
              <span class="item-sub" v-if="index!=gifts.length-1" @click="subGift(index)">
              <text></text>
            </span>
              <div class="item-tags" v-if="item.showTags&&tags&&tags.length>0"
                   :class="index==gifts.length-1?'item-bottom':'item-top'">
                <div v-for="(tag,tagIndex) in tags" @click="changeName(item,tag.ItemName)">
                  {{tag.ItemName}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="save-button">
          <span @click="doSave">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['items', 'gifts', 'type', 'oldItems'],
    data () {
      return {
        tags: [],
        allTags: [],
        focus: false,
        giftFocus: false,
        numberFocus: true,
        changeData: 0,
        modelAnimation: {},
        contextAnimation: {}
      }
    },
    methods: {
      showTags (item, type) {
        item.showTags = true
        let names = []
        let tags = []
        if (type) {
          if (this.oldItems && this.oldItems.length > 0) {
            for (let item of this.oldItems) {
              names.push(item.ItemName)
            }
          }
          for (let item of this.items) {
            names.push(item.ItemName)
          }
        } else {
          for (let item of this.gifts) {
            names.push(item.ItemName)
          }
        }
        for (let item of this.allTags) {
          if (names.indexOf(item.ItemName) < 0) {
            tags.push(item)
          }
        }
        this.tags = tags
        this.changeData += 1
      },
      onBlur (item) {
        item.showTags = false
        this.focus = false
        this.giftFocus = false
        this.changeData += 1
      },
      onNumberFocus (item) {
        item.numberFocus = true
        this.changeData += 1
      },
      onNumberBlur (item) {
        item.numberFocus = false
        this.changeData += 1
      },
      changeName (item, name) {
        item.ItemName = name
        item.ItemId = null
        item.showTags = false
        item.numberFocus = true
        this.focus = false
        this.giftFocus = false
        this.changeData += 1
      },
      addItem () {
        this.items.push({})
        setTimeout(function () {
          this.focus = true
        }.bind(this), 100)
      },
      addGift () {
        this.gifts.push({
          IsGift: true
        })
        setTimeout(function () {
          this.giftFocus = true
        }.bind(this), 100)
      },
      subGift (index) {
        let items = []
        for (let i = 0; i < this.gifts.length; i++) {
          if (i !== index) {
            items.push(this.gifts[i])
          }
        }
        this.gifts = items
      },
      subItem (index) {
        let items = []
        for (let i = 0; i < this.items.length; i++) {
          if (i !== index) {
            items.push(this.items[i])
          }
        }
        this.items = items
      },
      changeGift () {
        if (this.gifts.length === 0) {
          this.gifts = [{
            showTags: true,
            IsGift: true
          }]
        } else {
          this.gifts = []
        }
      },
      doSave () {
        let items = []
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].showTags = false
          if ((this.items[i].CardValue || this.items[i].CardValue === 0) && this.items[i].ItemName && i !== this.items.length - 1) {
            items.push(this.items[i])
          } else {
            if (i === this.items.length - 1 && (this.items[i].CardValue || this.items[i].CardValue === 0) && this.items[i].ItemName) {
              items.push(this.items[i])
            } else if (i !== 0 && (i === this.items.length - 1) && !(this.items[i].CardValue || this.items[i].CardValue === 0) && !this.items[i].ItemName) {

            } else {
              wx.showToast({
                title: '不能为空',
                image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
              })
              return
            }
          }
        }
        let gifts = []
        if (this.gifts) {
          for (let i = 0; i < this.gifts.length; i++) {
            this.gifts[i].showTags = false
            this.gifts[i].numberFocus = false
            if ((this.gifts[i].CardValue || this.gifts[i].CardValue === 0) && this.gifts[i].ItemName && i !== this.gifts.length - 1) {
              gifts.push(this.gifts[i])
            } else {
              if (i === this.gifts.length - 1 && (this.gifts[i].CardValue || this.gifts[i].CardValue === 0) && this.gifts[i].ItemName) {
                gifts.push(this.gifts[i])
              } else if (i !== 0 && (i === this.gifts.length - 1) && !(this.gifts[i].CardValue || this.gifts[i].CardValue === 0) && !this.gifts[i].ItemName) {
              } else {
                wx.showToast({
                  title: '不能为空',
                  image: 'https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/warn.png'
                })
                return
              }
            }
          }
        }

        this.focus = false
        this.giftFocus = false
        this.numberFocus = false
        this.changeData += 1
        // 去重
        let newItems = []
        let nameList = []
        for (let item of items) {
          item.CardValue *= 1
          if (nameList.indexOf(item.ItemName) >= 0) {
            for (let newItem of newItems) {
              if (newItem.ItemName === item.ItemName) {
                newItem.CardValue += item.CardValue
                newItem.ItemId = null
              }
            }
          } else {
            newItems.push(item)
            nameList.push(item.ItemName)
          }
        }
        let newGifts = []
        nameList = []
        if (gifts && gifts.length > 0) {
          for (let item of gifts) {
            item.CardValue *= 1
            if (nameList.indexOf(item.ItemName) >= 0) {
              for (let newItem of newGifts) {
                if (newItem.ItemName === item.ItemName) {
                  newItem.CardValue += item.CardValue
                  newItem.ItemId = null
                }
              }
            } else {
              newGifts.push(item)
              nameList.push(item.ItemName)
            }
          }
        }
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('-150vw').step({duration: 300})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('save', newItems, newGifts)
        }.bind(this), 300)
      },
      doClose () {
        this.focus = false
        this.giftFocus = false
        this.numberFocus = false
        for (let item of this.items) {
          item.showTags = false
        }
        if (this.gifts) {
          for (let item of this.gifts) {
            item.showTags = false
          }
        }
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('-150vw').step({duration: 300})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0)').step({duration: 200})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.$emit('close')
        }.bind(this), 300)
      }
    },
    onLoad () {
      let tags = wx.getStorageSync('serviceTags')
      if (tags && tags.length > 0) {
        this.allTags = tags
        console.log(tags)
      }
    },
    mounted () {
      setTimeout(function () {
        let contextAnimation = wx.createAnimation()
        contextAnimation.bottom('70vw').step({duration: 300})
        this.contextAnimation = contextAnimation.export()

        let modelAnimation = wx.createAnimation()
        modelAnimation.backgroundColor('rgba(0, 0, 0, 0.35)').step({duration: 150})
        this.modelAnimation = modelAnimation.export()
        setTimeout(function () {
          this.focus = true
        }.bind(this), 400)
      }.bind(this), 50)
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .addservice-model {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 2001;
    background-color: rgba(0, 0, 0, 0);
    .addservice-context {
      position: absolute;
      background: white;
      left: 0;
      bottom: -150vw;
      width: 100vw;
      .context-top {
        height: 16vw;
        span {
          display: inline-block;
          vertical-align: top;
          height: 4.3vw;
          width: 10vw;
          padding: 4.8vw;
        }
        img {
          display: inline-block;
          vertical-align: top;
          height: 4.3vw;
          width: 4.2vw;
        }
      }
      .context-middle {
        .context-title {
          padding-bottom: 4.1vw;
          span {
            display: inline-block;
            height: 4.2vw;
            line-height: 4.2vw;
            font-size: 4.4vw;
            color: black;
            white-space: nowrap;
            &:nth-child(1) {
              width: 16.9vw;
              padding-left: 16.4vw;
            }
            &:nth-child(2) {
              width: 16vw;
              padding-left: 30.6vw;
            }
          }
        }
        .service-gone {
          position: relative;
          left: 100vw;
        }
        .service-item {
          padding-left: 13.2vw;
          height: 8.3vw;
          line-height: 8.3vw;
          padding-bottom: 5vw;
          position: relative;
          z-index: 2002;
          span {
            display: inline-block;
            vertical-align: top;
            height: 8.3vw;
            line-height: 8.3vw;
            box-sizing: border-box;
            &:nth-child(1) {
              width: 33.6vw;
              background: rgba(241, 241, 241, 1);
              border-radius: 4.2vw;
              padding-left: 5.5vw;
              input {
                width: 24vw;
              }
            }
            &:nth-child(2) {
              margin-left: 12.9vw;
              width: 21.2vw;
              background: rgba(241, 241, 241, 1);
              border-radius: 4.2vw;
              padding-left: 5.5vw;
              input {
                width: 13vw;
              }
            }
          }
          input {
            display: inline-block;
            height: 8.3vw;
            line-height: 8.3vw;
            color: #6F6F6F;
            font-size: 3.5vw;
            z-index: 2002;
          }
          .item-add {
            padding-left: 2.8vw;
            width: 8vw;
            font-size: 3.8vw;
            padding-right: 2.4vw;
            font-weight: 700;
            color: black;
          }
          .item-sub {
            padding-top: 4vw;
            padding-left: 2.9vw;
            padding-right: 2.4vw;
            text {
              width: 2.8vw;
              display: inline-block;
              vertical-align: top;
              height: 0.5vw;
              background: #CCCCCC;
            }
          }
          .item-tags {
            position: absolute;
            left: 13.2vw;
            width: 73.3vw;
            padding: 2.6vw 3.7vw;
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 1.9vw;
            z-index: 3000;
            div {
              display: inline-block;
              margin-right: 2.7vw;
              margin-bottom: 2.1vw;
              background: rgba(0, 0, 0, 0.4);
              padding: 1.1vw 2.4vw;
              font-size: 2.6vw;
              color: white;
              border-radius: 2.4vw;
              height: 2.4vw;
              line-height: 2.4vw;
            }
          }
          .item-top {
            top: 10.8vw;
          }
          .item-bottom {
            bottom: 14vw;
          }
        }
        .context-gift {
          padding-left: 13.2vw;
          padding-top: 1.5vw;
          padding-bottom: 2.9vw;
          height: 4.1vw;
          line-height: 4.1vw;
          font-size: 3.9vw;
          img {
            display: inline-block;
            width: 4.1vw;
            height: 4.1vw;
            vertical-align: top;
          }
          span {
            display: inline-block;
            height: 4.1vw;
            vertical-align: top;
            line-height: 4.1vw;
            padding-left: 1vw;
          }
        }
        .save-button {
          padding-top: 1.8vw;
          padding-bottom: 6.7vw;
          padding-left: 62.4vw;
          span {
            display: inline-block;
            width: 24.4vw;
            height: 8.9vw;
            line-height: 8.9vw;
            font-size: 3.5vw;
            border-radius: 4.5vw;
            text-align: center;
            color: white;
            background: #FF6F00;
          }
        }
      }
    }
  }
</style>
