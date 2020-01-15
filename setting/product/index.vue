<template>
  <div class="product-page">
    <title :name="'价目表'"></title>
    <scroll-view class="product-scroll" scroll-y="true" @scrolltolower="scrolltolower"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="product-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="product-info">
          * 为店铺设置服务和商品的名称价格
        </div>
        <div class="product-context">
          <div class="product-item-title">
            <span class="title-item" @click="currentSwiper=0">
              <div class="item-title" :style="{color:currentSwiper?'#000000':''}">服务</div>
              <div class="item-bottom" v-if="currentSwiper==0">
                <span></span>
                <div></div>
              </div>
            </span>
            <span class="title-item" @click="currentSwiper=1">
              <div class="item-title" :style="{color:currentSwiper?'':'#000000'}">商品</div>
              <div class="item-bottom" v-if="currentSwiper==1">
                <span></span>
                 <div></div>
              </div>
            </span>
          </div>
          <div class="product-swiper" v-if="currentSwiper==0">
            <span class="product-item-out" v-for="item in services" :key="index">
              <div class="product-item" @click="jumpToDetail(item,0)">
                <div class="item-img" :style="{background:'url('+item.ItemImg+')','background-size':'100%,auto'}">
                  <div class="img-top" v-if="item.IsCardDiscount">
                    <span>会员折扣</span>
                  </div>
                  <div class="no-img" v-if="!item.ItemImg">
                    <span></span>
                    <span>{{item.ItemName}}</span>
                  </div>
                </div>
                <div class="item-title">
                  {{item.ItemName}}
                </div>
                <div class="item-price">
                  <span class="price-old">
                    {{item.ItemVipPrice ? '原价' : '价格'}}¥{{item.ItemPrice}}
                  </span>
                  <span class="price-new" v-if="item.ItemVipPrice">
                    会员价¥{{item.ItemVipPrice}}
                  </span>
                </div>
              </div>
            </span>
            <div class="product-item-out">
              <div class="product-item" @click="jumpToCreate(0)">
                <div class="item-add">
                  <span></span>
                  <div></div>
                </div>
                <div class="item-add-title">
                  添加服务
                </div>
              </div>
            </div>
          </div>
          <div class="product-swiper" v-if="currentSwiper==1">
            <span class="product-item-out" v-for="item in items" :key="index">
              <div class="product-item" @click="jumpToDetail(item,1)">
                <div class="item-img" :style="{background:'url('+item.ProductImg+')','background-size':'100%,auto'}">
                  <div class="img-top" v-if="item.IsCardDiscount">
                    <span>会员折扣</span>
                  </div>
                  <div class="no-img" v-if="!item.ProductImg">
                    <span></span>
                    <span>{{item.ProductName}}</span>
                  </div>
                </div>
                <div class="item-title">
                  {{item.ProductName}}
                </div>
                <div class="item-price">
                  <span class="price-old">
                    {{item.VipPrice ? '原价' : '价格'}}¥{{item.Price}}
                  </span>
                  <span class="price-new" v-if="item.VipPrice">
                    会员价¥{{item.VipPrice}}
                  </span>
                </div>
              </div>
            </span>
            <div class="product-item-out">
              <div class="product-item" @click="jumpToCreate(1)">
                <div class="item-add">
                  <span></span>
                  <div></div>
                </div>
                <div class="item-add-title">
                  添加商品
                </div>
              </div>
            </div>
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
        items: [],
        services: [],
        currentSwiper: 0,
        productLength: 1,
        isLoading: false,
        isOver: false,
        titleHeight: null
      }
    },
    methods: {
      jumpToDetail (item, type) {
        const url = '../create/main?id=' + (item.Id || item.ItemId) + '&type=' + type
        wx.navigateTo({url})
      },
      jumpToCreate (type) {
        const url = '../create/main?type=' + type
        wx.navigateTo({url})
      },
      swiperChange (e) {
        this.currentSwiper = e.mp.detail.current
      },
      scrolltolower () {
        if (this.isLoading || this.isOver || this.currentSwiper === 0) {
          return
        }
        this.isLoading = true
        this.page += 1
        this.getItems(this.page)
      },
      getItems (page) {
        let that = this
        this.isLoading = true
        this.$post('/storeProduct/businessGetStoreProduct', {
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
      },
      getServices () {
        let that = this
        this.$post('/serviceItem/getServiceItemList', {
          RequestDataType: 1
        }).then(res => {
          that.services = res.Items
        })
      }
    },
    onLoad () {
      this.currentSwiper = 0
      this.page = 1
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      this.getItems(1)
      this.getServices()
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .product-page {
    height: 100vh;
    background-color: #f0f0f0;
    .product-scroll {
      height: 90vh;
      .product-main {
        min-height: 80vh;
        background: white;
        .product-info {
          height: 9.4vw;
          line-height: 9.4vw;
          background: #FFEDAD;
          color: #C48F21;
          font-size: 3.1vw;
          padding-left: 4.7vw;
        }
        .product-context {
          .product-item-title {
            span {
              display: inline-block;
              vertical-align: top;
            }
            padding-top: 4.4vw;
            text-align: center;
            font-size: 3.5vw;
            font-weight: 600;
            .title-item {
              width: 30vw;
              .item-title {
                color: #FF6700;
                line-height: 3.5vw;
                padding-bottom: 1.8vw;
              }
              .item-bottom {
                height: 0.8vw;
                position: relative;
                span {
                  width: 14.4vw;
                  background: #FF6700;
                  border-radius: 0.7vw;
                  height: 0.8vw;
                  vertical-align: top;
                }
                div {
                  width: 0;
                  height: 0;
                  border: 0.8vw solid;
                  border-color: transparent transparent #FF6700 transparent;
                  position: absolute;
                  bottom: 0.8vw;
                  left: 14.2vw;
                }
              }
            }
          }
          .product-swiper {
            padding: 6.3vw 3vw;
            .product-item-out {
              display: inline-block;
              vertical-align: top;
              padding: 0 2.8vw 6.9vw 2.8vw;
            }
            .product-item {
              width: 40.6vw;
              height: 40.6vw;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(243, 244, 248, 1);
              border-radius: 0.9vw;
              font-size: 2.8vw;
              box-shadow: 0px 1.1vw 1.9vw 0px rgba(0, 0, 0, 0.09);
              overflow: hidden;
              span {
                display: inline-block;
                vertical-align: top;
              }
              .item-img {
                height: 28vw;
                border-bottom: 0.1vw solid rgba(243, 244, 248, 1);
                position: relative;
                text-align: center;
                .img-top {
                  position: absolute;
                  top: 0;
                  right: -0.8vw;
                  width: 12vw;
                  height: 3.9vw;
                  line-height: 3.9vw;
                  // background: #FF6700;
                  color: white;
                  font-size: 2.2vw;
                  text-align: center;
                  z-index: 10;
                  span {
                    position: relative;
                    z-index: 100;
                  }
                }
                .no-img {
                  text-align: center;
                  padding: 2vw 0;
                  line-height: 12vw;
                  height: 28vw;
                  font-size: 10vw;
                  font-weight: 800;
                  color: #E9E9E9;
                  width: 22vw;
                  overflow: hidden;
                  word-break: break-all;
                  word-wrap: break-word;
                  display: inline-block;
                  span {
                    display: inline-block;
                    line-height: 12vw;
                    vertical-align: middle;
                    max-height: 24vw;
                    overflow: hidden;
                    &:nth-child(1) {
                      width: 0;
                      height: 24vw;
                    }
                    &:nth-child(2) {
                      width: 22vw;
                    }
                  }
                }
                .img-top:before {
                  content: '';
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  background-color: #FF6700;
                  transform: skewX(25deg);
                  z-index: 9;
                }
              }
              .item-title {
                line-height: 2.8vw;
                padding-top: 2.2vw;
                padding-bottom: 1.9vw;
                padding-left: 3.4vw;
              }
              .item-price {
                padding-left: 3.4vw;
                line-height: 2.8vw;
                color: #7E7E7E;
                .price-new {
                  color: #FF6A03;
                  padding-left: 1vw;
                }
              }
              .item-add {
                padding-top: 20vw;
                text-align: center;
                height: 2vw;
                position: relative;
                span {
                  display: inline-block;
                  vertical-align: top;
                  width: 10vw;
                  border-radius: 0.7vw;
                  height: 1.3vw;
                  background: #E9E9E9;
                }
                div {
                  position: absolute;
                  height: 10vw;
                  width: 1.3vw;
                  border-radius: 0.7vw;
                  background: #E9E9E9;
                  left: 19.5vw;
                  top: 15.8vw;
                }
              }
              .item-add-title {
                text-align: center;
                line-height: 3.9vw;
                color: #E9E9E9;
                font-size: 3.9vw;
                padding-top: 6.5vw;
              }
            }
          }
        }
      }
    }
  }
</style>
