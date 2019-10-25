<template>
  <div class="card-store">
    <div v-show="!chooseImg" :style="{height:titleHeight +'px'}">
      <title :name="'商家资料'"></title>
    </div>
    <scroll-view scroll-y="true" class="store-scroll" v-show="!chooseImg"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="store-title">
          <span>?</span>
          <span>
            <div>图标与名称将显示在会员卡卡面上</div>
            <div>地址电话将显示于会员卡明显位置，方便会员查看</div>
          </span>
        </div>
        <div class="store-context" v-if="!firstLoad">
          <form @submit="commit">
            <div class="store-logo" :style="{'border-color':error?'red':''}" @click="uploadTap">
              <span>商家图标<text style="color: red">*</text></span>
              <span class="logo"
                    :style="{background:'url('+logoUrl+')','background-size':'100%,100%'}"></span>
            </div>
            <inputBox :name="'StoreName'"
                      :title="'商家名称'"
                      :request="true"
                      :value="store.StoreName"
                      :type="'input'"
                      @changeValue="changeValue"></inputBox>
            <inputBox :name="'Address'"
                      :title="'店铺地址'"
                      :value="store.Address"
                      :type="'input'"
                      @changeValue="changeValue"></inputBox>
            <inputBox :name="'StoreMobile'"
                      :title="'联系电话'"
                      :value="store.StoreMobile"
                      :type="'input'"
                      @changeValue="changeValue"></inputBox>
            <div class="store-logo">
              <span>店铺行业</span>
              <picker @change="industryChange" :value="industryIndex" :range="industries">
                <span class="industry">
                  {{industries[industryIndex]}}
                </span>
              </picker>
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
      <div class="demo-bottom"></div>
    </scroll-view>
    <div v-show="chooseImg">
      <we-cropper
        ref="cropper"
        :option="cropperOpt"
        @ready="cropperReady"
        @beforeDraw="cropperBeforeDraw"
        @beforeImageLoad="cropperBeforeImageLoad"
        @beforeLoad="cropperLoad"
      ></we-cropper>
      <div class="cropper-buttons">
        <div
          class="upload"
          @tap="uploadTap">
          重新选择
        </div>
        <div
          class="getCropperImage"
          @tap="getCropperImage">
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import inputBox from '@/components/custom'
  import title from '@/components/title'
  import WeCropper from 'mpvue-cropper'

  let wecropper

  const device = wx.getSystemInfoSync()
  const width = device.windowWidth
  const height = device.windowHeight - 50

  export default {
    components: {
      inputBox, title, WeCropper
    },

    data () {
      return {
        logs: [],
        store: {},
        industryIndex: 0,
        industries: ['通用行业', '美容美发', '美妆美甲', '美体SPA', '汽车美容', '儿童乐园', '游戏健身', '餐饮食品', '运动场馆', '教育培训', '糕点零售', '洗浴按摩', '休闲娱乐', '摄影写真', '皮具保养', '宠物养护'],
        logoUrl: '',
        titleHeight: null,
        cropper: null,
        chooseImg: false,
        firstLoad: true,
        cropperOpt: {
          id: 'cropper',
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300
          }
        }
      }
    },
    methods: {
      jumpToTime () {
        const url = '../time/main?userId=' + this.info.userId + '&storeId=' + this.info.storeId
        wx.navigateTo({url})
      },
      changeValue (key, value) {
        this.store[key] = value
      },
      industryChange (e) {
        this.industryIndex = e.mp.detail.value * 1
      },
      changeLogo () {
        let that = this
        this.error = false
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: function (res) {
            that.logoUrl = res.tempFilePaths[0]
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            console.log(res)
            wx.uploadFile({
              url: 'https://testbapi.link-fit.com/api' + '/Common/uploadFileForXcx',
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                Uid: that.info.userId,
                StoreId: that.info.storeId,
                Type: 1,
                FileType: 0
              },
              success: function (res) {
                let data = JSON.parse(res.data)
                that.store.StoreLogo = data.Data[0].FilePath
                that.logoUrl = data.Data[0].FilePath
                wx.hideLoading()
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        })
      },
      changeStartTime (e) {
        this.store.WorkingTimeStart = e.mp.detail.value
      },
      changeEndTime (e) {
        this.store.WorkingTimeEnd = e.mp.detail.value
      },
      uploadLogo (name, base) {
        let that = this
        this.$post('/common/uploadFile', {
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          Type: 1,
          FileType: 0,
          Files: [{
            FileExtensionsName: name,
            File: base
          }]
        }).then(res => {
          console.log(res[0].FilePath)
          that.store.StoreLogo = res[0].FilePath
          that.logoUrl = res[0].FilePath
        })
      },
      commit (e) {
        let childrens = this.$children
        let isError = false
        for (let children of childrens) {
          if (children.validate && !children.validate()) {
            isError = true
          }
        }
        if (this.logoUrl === '' || this.logoUrl === undefined || this.logoUrl === null) {
          this.error = true
          isError = true
        }
        if (isError) {
          return false
        }
        this.setStoreInfo(e.mp.detail.value)
      },
      getStoreInfo () {
        let that = this
        this.$post('/store/businessGetStoreInfo', {
          Uid: this.info.userId,
          StoreId: this.info.storeId,
          IsNotDefaultData: true
        }).then(res => {
          if (res.WorkingTimeStart === undefined) {
            res.WorkingTimeStart = ''
          }
          if (res.WorkingTimeEnd === undefined) {
            res.WorkingTimeEnd = ''
          }
          if (res.StoreTypeId) {
            that.industryIndex = res.StoreTypeId
          }
          that.store = res
          that.logoUrl = res.StoreLogo
          that.firstLoad = false
          that.$store.commit('storeInfo', res)
        })
      },
      setStoreInfo (store) {
        store.Uid = this.info.userId
        store.StoreId = this.info.storeId
        store.StoreLogo = this.logoUrl
        store.StoreTypeId = this.industryIndex
        let that = this
        this.$post('/store/businessSetStoreInfo', store, true).then(res => {
          that.$success('保存成功', true)
          that.getStoreInfo()
        })
      },
      cropperReady (...args) {
        console.log('cropper ready!')
      },
      cropperBeforeImageLoad (...args) {
        console.log('before image load')
      },
      cropperLoad (...args) {
        console.log('image loaded')
      },
      cropperBeforeDraw (...args) {
        // Todo: 绘制水印等等
      },
      uploadTap () {
        this.chooseImg = false
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            const src = res.tempFilePaths[0]
            //  获取裁剪图片资源后，给data添加src属性及其值
            this.chooseImg = true
            wecropper.pushOrigin(src)
          },
          fail: (res) => {
            this.chooseImg = false
          }
        })
      },
      getCropperImage () {
        let that = this
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wecropper.getCropperImage()
          .then((src) => {
            console.log(that.url)
            wx.uploadFile({
              url: that.url + '/Common/uploadFileForXcx',
              filePath: src,
              name: 'file',
              formData: {
                Uid: that.info.userId,
                StoreId: that.info.storeId,
                Type: 1,
                FileType: 0
              },
              success: function (res) {
                let data = JSON.parse(res.data)
                that.store.StoreLogo = data.Data[0].FilePath
                that.logoUrl = data.Data[0].FilePath
                that.chooseImg = false
                wx.hideLoading()
              },
              fail: function (res) {
                console.log(res)
              }
            })
          })
          .catch(e => {
            console.error('获取图片失败')
          })
      }
    },
    onLoad (option) {
      this.info = option
      this.firstLoad = true
      this.industryIndex = 0
      this.getStoreInfo()
      this.titleHeight = this.getGlobalData().titleHeight
      this.chooseImg = false
      this.url = this.getGlobalUrl().url
    },
    mounted () {
      wecropper = this.$refs.cropper
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .card-store {
    height: 100vh;
    background-color: #f0f0f0;
    .store-scroll {
      height: 90vh;
      .store-title {
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
      .store-context {
        padding: 3.5vh 5vw;
        background-color: white;
        .store-logo {
          width: 90vw;
          height: 7vh;
          line-height: 7vh;
          border-bottom: rpx(1) solid #bbbbbb;
          font-size: rpx(28);
          span {
            display: inline-block;
            vertical-align: top;
            height: 7vh;
            line-height: 7vh;
            &:nth-child(1) {
              margin-left: 1vw;
              width: 19vw;
            }
          }
          picker {
            display: inline-block;
            width: 70vw;
          }
          .industry {
            width: 80vw;
            color: #7e7e7e;
            font-size: rpx(28);
          }
          .logo {
            margin: 0.5vh 0;
            height: 6vh;
            line-height: 6vh;
            width: 6vh;
            border-radius: 50%;
          }
        }
        .date-select {
          height: 7vh;
          line-height: 7vh;
          border-bottom: rpx(1) solid #bbbbbb;
          font-size: rpx(28);
          .title {
            display: inline-block;
            vertical-align: top;
            height: 7vh;
            line-height: 7vh;
            margin-left: 1vw;
            width: 19vw;
          }
          .picker {
            display: inline-block;
            height: 7vh;
            line-height: 7vh;
            vertical-align: top;
          }
          .model {
            display: inline-block;
            height: 5vh;
            height: 7vh;
            line-height: 7vh;
            vertical-align: top;
            color: #a6a6a6;
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
  }

  .cropper-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #e5e5e5;
  }

  .cropper-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .cropper-buttons .upload, .cropper-buttons .getCropperImage {
    width: 50%;
    text-align: center;
  }

  .cropper {
    position: absolute;
    top: 0;
    left: 0;
  }

  .cropper-buttons {
    background-color: rgba(0, 0, 0, 0.95);
    color: #04b00f;
  }
</style>
