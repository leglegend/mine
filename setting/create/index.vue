<template>
  <div class="product-create-page">
    <title :name="(id?'编辑':'创建')+(type?'商品':'服务')"></title>
    <scroll-view class="product-create-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="product-create-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="product-create-context" v-if="!isFristLoad">
          <form @submit="doSave">
            <div class="create-item">
              <inputBox :name="type?'ProductName':'ItemName'" :title="'名囧称'" :type="'text'" :info="'请输入'"
                        :value="product.ProductName||product.ItemName"
                        :request="true"/>
            </div>
            <div class="create-item">
              <inputBox :name="type?'Price':'ItemPrice'" :title="'价囧格'" :type="'digit'" :info="'请输入'"
                        :value="product.Price||product.ItemPrice"
                        :request="true"/>
            </div>
            <div class="create-item">
              <inputBox :name="type?'VipPrice':'ItemVipPrice'" :title="'会员价'" :type="'digit'" :info="'请输入'"
                        :value="product.VipPrice||product.ItemVipPrice||''"/>
            </div>
            <div class="create-item" v-if="type==0">
              <inputBox :name="'ItemUnit'" :title="'单位'" :type="'text'" :info="'次'"
                        :value="product.ItemUnit||''"/>
            </div>
            <div class="create-item-select">
              <span class="select-title">
                是否参与会员折扣
              </span>
              <span class="select-item" @click="discount=true">
                <img v-if="discount"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                <img v-if="!discount"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                是
              </span>
              <span class="select-item" @click="discount=false">
                <img v-if="!discount"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-check.png"/>
                <img v-if="discount"
                     src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/recharge-uncheck.png"/>
                否
              </span>
            </div>
            <div class="create-item-img">
              <span class="img-title">
                图<text style="visibility: hidden">囧</text>片
              </span>
              <span v-if="!productImg" class="img-add" @click="choosePhoto">上传图片</span>
              <span v-if="productImg" class="img-add" @click="choosePhoto"
                    :style="{background:'url('+productImg+')','background-size':'100%,auto'}"></span>
            </div>
            <div class="save-button">
              <button form-type="submit">保存</button>
            </div>
          </form>
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
  import inputBox from '@/components/inputBox'

  export default {
    components: {
      title, inputBox
    },

    data () {
      return {
        logs: [],
        productImg: '',
        discount: true,
        isFristLoad: true,
        product: {},
        type: 0,
        titleHeight: null
      }
    },
    methods: {
      choosePhoto () {
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            console.log(res)
            wx.uploadFile({
              url: that.url + '/Common/uploadFileForXcx',
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                Uid: getApp().globalData.userId,
                StoreId: getApp().globalData.storeId,
                Type: 1,
                FileType: 0
              },
              success: function (res) {
                let data = JSON.parse(res.data)
                that.productImg = data.Data[0].FilePath
                wx.hideLoading()
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        })
      },
      doSave (e) {
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
        let body = e.mp.detail.value
        body.IsCardDiscount = this.discount
        if (this.type) {
          body.ProductImg = this.productImg
        } else {
          body.ItemImg = this.productImg
        }
        if (this.id) {
          if (this.type) {
            body.ProductId = this.id
            this.$post('/StoreProduct/businessUpdateStoreProduct', body, true).then(res => {
              this.$success('修改成功', true)
            })
          } else {
            body.ItemId = this.id
            this.$post('/serviceItem/businessUpdateStoreServiceItem', body, true).then(res => {
              this.$success('修改成功', true)
            })
          }
        } else {
          if (this.type) {
            this.$post('/StoreProduct/businessAddStoreProduct', body, true).then(res => {
              this.$success('创建成功', true)
            })
          } else {
            this.$post('/serviceItem/businessAddStoreServiceItem', body, true).then(res => {
              this.$success('创建成功', true)
            })
          }
        }
      },
      getProduct () {
        this.$post('/StoreProduct/businessGetStoreProductById', {
          ProductId: this.id
        }, true).then(res => {
          this.product = res.ProductInfo
          this.discount = res.ProductInfo.IsCardDiscount
          this.productImg = res.ProductInfo.ProductImg
          this.isFristLoad = false
        })
      },
      getService () {
        this.$post('/serviceItem/getServiceItemInfo', {
          ItemId: this.id
        }, true).then(res => {
          this.product = res
          this.discount = res.IsCardDiscount
          this.productImg = res.ItemImg
          this.isFristLoad = false
        })
      }
    },
    onLoad (option) {
      this.isFristLoad = true
      this.product = {}
      this.discount = true
      this.productImg = ''
      this.id = ''
      this.type = option.type * 1
      if (option.id) {
        this.id = option.id
        if (this.type) {
          this.getProduct()
        } else {
          this.getService()
        }
      } else {
        setTimeout(function () {
          this.isFristLoad = false
        }.bind(this), 200)
      }
      this.url = this.getGlobalUrl().url
      this.titleHeight = this.getGlobalData().titleHeight
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .product-create-page {
    height: 100vh;
    background-color: #f0f0f0;
    .product-create-scroll {
      height: 90vh;
      .product-create-main {
        min-height: 80vh;
        background: white;
        .product-create-context {
          padding: 1.6vw 2.7vw;
          .create-item {
            height: 13.2vw;
            line-height: 13.2vw;
            .input-class {
              display: inline-block;
              vertical-align: top;
              width: 100%;
              height: 13.2vw;
              line-height: 13.2vw;
              font-size: 3.7vw;
              border-bottom: 0.1vw solid #E9E9E9;
              .input-request {
                display: inline-block;
                color: red;
              }
              span {
                padding-left: 2%;
                display: inline-block;
                vertical-align: top;
                line-height: 13.2vw;
                width: 20%;
              }
              input {
                width: 78%;
                display: inline-block;
                vertical-align: top;
                height: 13.2vw;
                line-height: 13.2vw;
              }
            }
          }
          .create-item-select {
            height: 13.2vw;
            line-height: 13.2vw;
            font-size: 3.7vw;
            border-bottom: 0.1vw solid #E9E9E9;
            padding-left: 2%;
            span {
              display: inline-block;
              line-height: 4.2vw;
              vertical-align: middle;
            }
            .select-title {
              width: 35vw;
              box-sizing: border-box;
            }
            img {
              width: 4.2vw;
              height: 4.2vw;
              display: inline-block;
              vertical-align: top;
            }
            .select-item {
              width: 15vw;
            }
          }
          .create-item-img {
            line-height: 22.6vw;
            span {
              display: inline-block;
              vertical-align: middle;
            }
            .img-title {
              font-size: 3.7vw;
              padding-left: 2%;
              width: 20%;
            }
            .img-add {
              width: 25.2vw;
              height: 13.6vw;
              line-height: 13.6vw;
              background: rgba(241, 241, 241, 1);
              border: 1px solid rgba(191, 191, 191, 1);
              border-radius: 1.9vw;
              color: #BDBDBD;
              font-size: 2.6vw;
              text-align: center;
            }
            img {
              display: inline-block;
              vertical-align: middle;
              width: 25.2vw;
              height: 13.6vw;
            }
          }
          .save-button {
            text-align: center;
            padding-top: 23vw;
            padding-bottom: 10vw;
            button {
              line-height: 11.1vw;
              background: #FF6703;
              border-radius: 5.6vw;
              width: 44.6vw;
              color: white;
              font-size: 4.3vw;
            }
          }
        }
      }
    }
  }
</style>
