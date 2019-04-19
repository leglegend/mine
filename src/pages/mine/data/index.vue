<template>
  <div class="data-page">
    <title :name="name"></title>
    <scroll-view class="data-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - '+titleHeight +'px)'}">
      <div class="data-main" :style="{'min-height':'calc(90vh - '+titleHeight +'px)'}">
        <div class="data-upload" v-if="type=='upload'">
          <div class="data-title">
            <span style="color:red">* </span>
            <span>文字必须清楚可见</span>
          </div>
          <div class="data-img">
            <img src="/static/prove.jpg" v-if="optionName=='ImgCorpCode'"/>
            <img src="/static/face.jpg" v-if="optionName=='ImgIdcardFornt'"/>
            <img src="/static/back.jpg" v-if="optionName=='ImgIdcardBack'"/>
            <img src="/static/bank.jpg" v-if="optionName=='ImgBankCard'"/>
            <img src="/static/handcard.jpg" v-if="optionName=='ImgHandBankCard'"/>
            <img src="/static/handid.jpg" v-if="optionName=='ImgHandIdcard'"/>
          </div>
          <div class="data-button">
            <span @click="takePhoto">拍 照</span>
          </div>
          <div class="data-button">
            <span @click="choosePhoto">从相册选择</span>
          </div>
        </div>
        <div class="data-address" v-if="type=='address'">
          <div class="section">
            <picker mode="multiSelector"
                    @change="multiPickerChange"
                    @columnchange="multiPickerColumnChange"
                    @cancel="doCancelArea"
                    range-key="Name"
                    :value="multiIndex"
                    :range="multiArray" class="picker">
              <span class="picker">
                <span>{{province}}</span>
                <span style="padding-left: 2vw">{{city}}</span>
                <span style="padding-left: 2vw">{{country}}</span>
              </span>
            </picker>
            <span class="section-area" @click="chooseArea">
              <img src="/static/address.png" style="width: 23rpx;height: 32rpx;display: inline-block"/>
            </span>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-title" style="padding-left: 5vw">
            <span style="color:red">* </span>
            <span>必须与营业执照上的地址一致</span>
          </div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <div class="data-address" v-if="type=='bank'||type=='branch'">
          <div class="section">
            <picker mode="selector"
                    @change="pickerChange"
                    @cancel="doCancelBank"
                    :range-key="type=='bank'?'BankName':'BankBranchName'"
                    :value="bankIndex"
                    :range="banks" class="picker">
              <span class="picker">
                <span>{{bank}}</span>
              </span>
            </picker>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-title" style="padding-left: 5vw">
            <span style="color:red">* </span>
            <span>必须与营业执照上的银行一致</span>
          </div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <div class="data-address" v-if="type=='store'">
          <div class="section">
            <picker mode="multiSelector"
                    @change="storePickerChange"
                    @columnchange="storePickerColumnChange"
                    @cancel="doCancelStore"
                    range-key="Name"
                    :value="storeIndex"
                    :range="storeArray" class="picker">
              <span class="picker">
                <span>{{store}}</span>
                <span style="padding-left: 2vw">{{shop}}</span>
              </span>
            </picker>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-title" style="padding-left: 5vw">
            <span style="color:red">* </span>
            <span>必须与营业执照上的银行一致</span>
          </div>
          <div class="data-button">
            <span @click="doSave">完成</span>
          </div>
        </div>
        <div class="data-address" v-if="type=='input'">
          <div class="section">
            <input v-model="value"
                   class="picker"/>
            <span class="section-area" @click="value=''">
              <img src="/static/deletevalue.png" style="width: 28rpx;height: 28rpx;display: inline-block"/>
            </span>
          </div>
          <div style="padding: 1vw"></div>
          <div class="data-title" style="padding-left: 5vw">
            <span style="color:red">* </span>
            <span>必须与营业执照上的银行一致</span>
          </div>
          <div class="data-button">
            <span @click="doSave">完成</span>
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
        logs: [],
        type: '',
        name: '',
        value: '',
        optionName: '',
        titleHeight: null,
        provinces: [],
        cities: [],
        countries: [],
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        country: '',
        countryId: '',
        multiIndex: [0, 0, 0],
        multiArray: [[0], [0], [0]],
        store: '',
        storeId: '',
        shop: '',
        shopId: '',
        storeIndex: [0, 0],
        storeArray: [[0], [0]],
        stores: [],
        shops: [],
        banks: [],
        bankIndex: 0,
        bank: '',
        bankId: '',
        changeValue: false
      }
    },
    methods: {
      doCancelArea () {
        let that = this
        this.multiIndex = [0, 0, 0]
        if (this.provinceId === '') {
          this.getProvince(function () {
            that.getCity(that.provinces[0].ClassId, function () {
              that.getCountry(that.cities[0].ClassId)
            })
          })
        } else {
          for (let province in that.provinces) {
            if (that.provinces[province].ClassId === that.provinceId) {
              that.multiIndex[0] = province
              that.province = that.provinces[province].Name
            }
          }
          that.getCity(that.provinceId, function () {
            for (let city in that.cities) {
              if (that.cities[city].ClassId === that.cityId) {
                that.multiIndex[1] = city
                that.city = that.cities[city].Name
              }
            }
            that.getCountry(that.cityId ? that.cityId : that.cities[0].ClassId, function () {
              for (let country in that.countries) {
                if (that.countries[country].ClassId === that.countryId) {
                  that.multiIndex[2] = country
                  that.country = that.countries[country].Name
                }
              }
            })
          })
        }
      },
      doCancelBank () {
        this.bankIndex = 0
        if (this.bankId) {
          for (let i in this.banks) {
            if (this.bankId === this.banks[i].BankCode) {
              this.bank = this.banks[i].BankName
              this.bankIndex = i
            }
            if (this.bankId === this.banks[i].BankBranchCode) {
              this.bank = this.banks[i].BankBranchName
              this.bankIndex = i
            }
          }
        }
      },
      doCancelStore () {
        let that = this
        this.storeIndex = [0, 0]
        if (this.storeId) {
          for (let i in this.stores) {
            if (this.storeId === this.stores[i].ClassId) {
              this.storeIndex[0] = i
              this.store = this.stores[i].Name
            }
          }
          this.getShops(this.storeId, function () {
            for (let i in that.shops) {
              if (that.shopId === that.shops[i].ClassId) {
                that.storeIndex[1] = i
                that.shop = that.shops[i].Name
              }
            }
          })
        } else {
          let shopId = that.stores[0].ClassId
          that.getShops(shopId)
        }
      },
      storePickerChange (e) {
        this.storeIndex = e.mp.detail.value
        this.store = this.storeArray[0][this.storeIndex[0]].Name
        this.storeId = this.storeArray[0][this.storeIndex[0]].ClassId
        this.shop = this.storeArray[1][this.storeIndex[1]].Name
        this.shopId = this.storeArray[1][this.storeIndex[1]].ClassId
      },
      storePickerColumnChange (e) {
        let detail = e.mp.detail
        let that = this
        if (detail.column === 0) {
          this.storeIndex[0] = detail.value
          this.storeIndex[1] = 0
          that.getShops(that.stores[detail.value].ClassId)
        }
      },
      multiPickerChange (e) {
        this.multiIndex = e.mp.detail.value
        this.province = this.multiArray[0][this.multiIndex[0]].Name
        this.provinceId = this.multiArray[0][this.multiIndex[0]].ClassId
        this.city = this.multiArray[1][this.multiIndex[1]].Name
        this.cityId = this.multiArray[1][this.multiIndex[1]].ClassId
        this.country = this.multiArray[2][this.multiIndex[2]].Name
        this.countryId = this.multiArray[2][this.multiIndex[2]].ClassId
      },
      pickerChange (e) {
        this.bankIndex = e.mp.detail.value
        this.bank = this.banks[this.bankIndex].BankName ? this.banks[this.bankIndex].BankName : this.banks[this.bankIndex].BankBranchName
        this.bankId = this.banks[this.bankIndex].BankCode ? this.banks[this.bankIndex].BankCode : this.banks[this.bankIndex].BankBranchCode
      },
      multiPickerColumnChange (e) {
        let detail = e.mp.detail
        let that = this
        if (detail.column === 0) {
          this.multiIndex = [detail.value, 0, 0]
          that.getCity(that.provinces[detail.value].ClassId, function () {
            that.getCountry(that.cities[0].ClassId)
          })
        } else if (detail.column === 1) {
          this.multiIndex[1] = detail.value
          this.multiIndex[2] = 0
          that.getCountry(that.cities[detail.value].ClassId)
        }
      },
      takePhoto () {
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success (res) {
            that.uploadImg(res.tempFilePaths[0])
          }
        })
      },
      choosePhoto () {
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success (res) {
            that.uploadImg(res.tempFilePaths[0])
          }
        })
      },
      uploadImg (src) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        let that = this
        wx.uploadFile({
          url: that.url + '/Common/uploadFileForXcx',
          filePath: src,
          name: 'file',
          formData: {
            Uid: that.option.userId,
            StoreId: that.option.storeId,
            Type: 3,
            FileType: 0
          },
          success: function (res) {
            let data = JSON.parse(res.data)
            that.value = data.Data[0].FilePath
            that.doSave()
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      getProvince (callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: '0'
        }).then(res => {
          that.multiArray[0] = res.AreasData
          that.provinces = res.AreasData
          if (callback) {
            callback()
          }
        })
      },
      getCity (provinceId, callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: provinceId
        }).then(res => {
          that.multiArray[1] = res.AreasData
          that.cities = res.AreasData
          if (callback) {
            callback()
          }
        })
      },
      getCountry (cityId, callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: cityId
        }).then(res => {
          that.multiArray[2] = res.AreasData
          that.countries = res.AreasData
          if (callback) {
            callback()
          }
        })
      },
      chooseArea () {
        let that = this
        wx.chooseLocation({
          success: function (res) {
            if (res.address === '') {
              return
            }
            let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/
            let REGION_PROVINCE
            let addressBean = {
              REGION_PROVINCE: null,
              REGION_COUNTRY: null,
              REGION_CITY: null,
              ADDRESS: null
            }

            function regexAddressBean (address, addressBean) {
              regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g
              var addxress = regex.exec(address)
              addressBean.REGION_CITY = addxress[1]
              addressBean.REGION_COUNTRY = addxress[2]
              addressBean.ADDRESS = addxress[3] + '(' + res.name + ')'
              console.log(addxress)
            }

            if (!(REGION_PROVINCE = regex.exec(res.address))) {
              regex = /^(.*?(省|自治区))(.*?)$/
              REGION_PROVINCE = regex.exec(res.address)
              addressBean.REGION_PROVINCE = REGION_PROVINCE[1]
              regexAddressBean(REGION_PROVINCE[3], addressBean)
            } else {
              addressBean.REGION_PROVINCE = REGION_PROVINCE[1]
              regexAddressBean(res.address, addressBean)
            }
            that.province = addressBean.REGION_PROVINCE.replace('市', '')
            that.city = addressBean.REGION_CITY
            that.country = addressBean.REGION_COUNTRY
            that.multiIndex[0] = 0
            for (let province in that.provinces) {
              if (that.provinces[province].Name === that.province) {
                that.multiIndex[0] = province
                that.provinceId = that.provinces[province].ClassId
              }
            }
            that.getCity(that.provinceId, function () {
              that.multiIndex[1] = 0
              for (let city in that.cities) {
                if (that.cities[city].Name === that.city) {
                  that.multiIndex[1] = city
                  that.cityId = that.cities[city].ClassId
                }
              }
              that.getCountry(that.cityId, function () {
                that.multiIndex[2] = 0
                for (let country in that.countries) {
                  if (that.countries[country].Name === that.country) {
                    that.multiIndex[2] = country
                    that.countryId = that.countries[country].ClassId
                  }
                }
              })
            })
          }
        })
      },
      getBanks (callback) {
        let that = this
        this.$post('/base/getBank', {}).then(res => {
          that.banks = res.BankData
          if (callback) {
            callback()
          }
        })
      },
      getBankBranchs (callback) {
        let that = this
        this.$post('/base/getBankBranch', {
          BankCode: this.option.bankId,
          ProvinceId: this.option.provinceId,
          CityId: this.option.cityId
        }).then(res => {
          that.banks = res.BankBranchData
          if (callback) {
            callback()
          }
        })
      },
      getStores (callback) {
        let that = this
        this.$post('/base/getStoreClass', {
          RootId: '0'
        }).then(res => {
          that.storeArray[0] = res.StoreClassData
          that.stores = res.StoreClassData
          if (callback) {
            callback()
          }
        })
      },
      getShops (classId, callback) {
        let that = this
        this.$post('/base/getStoreClass', {
          RootId: classId
        }).then(res => {
          that.storeArray[1] = res.StoreClassData
          that.shops = res.StoreClassData
          if (callback) {
            callback()
          }
        })
      },
      doSave () {
        if ((this.type === 'input' && this.value === '') || (this.type === 'address' && this.provinceId === '')) {
          wx.showToast({
            title: '不能为空',
            image: '/static/warn.png'
          })
          return
        }
        let that = this
        let param = {}
        param['StoreId'] = this.option.storeId
        param['Uid'] = this.option.userId
        if (this.type === 'input') {
          param[this.option.name] = this.value
        } else if (this.type === 'address') {
          param['MerProvince'] = this.provinceId
          param['MerCity'] = this.cityId
          param['MerDistrict'] = this.countryId
        } else if (this.type === 'store') {
          param['MerLevel1No'] = this.storeId
          param['MerLevel2No'] = this.shopId
        } else if (this.type === 'bank') {
          param['HeadBankCode'] = this.bankId
        } else if (this.type === 'branch') {
          param['BankCode'] = this.bankId
        } else if (this.type === 'upload') {
          param[this.option.name] = this.value
        }
        this.$post('/merchant/businessSetMerchantInfo', param, true).then(res => {
          that.$success('保存成功', true)
        })
      }
    },
    onLoad (option) {
      this.type = option.type
      this.option = option
      this.value = ''
      let that = this
      if (option.type === 'upload') {
        this.name = '上传开户许可证'
        this.optionName = option.name
      } else if (option.type === 'address') {
        this.name = '所在地区'
        if (option.provinceId) {
          this.provinceId = option.provinceId
          if (option.cityId) {
            this.cityId = option.cityId
            if (option.countryId) {
              this.countryId = option.countryId
            }
          }
        }
        this.getProvince(function () {
          that.doCancelArea()
        })
      } else if (option.type === 'store') {
        this.name = '门店分类'
        if (option.storeCode) {
          this.storeId = option.storeCode
          if (option.shopId) {
            this.shopId = option.shopId
          }
        }
        this.getStores(function () {
          that.doCancelStore()
        })
      } else if (option.type === 'bank') {
        this.name = '开户行'
        if (option.bankId) {
          this.bankId = option.bankId
        }
        this.getBanks(function () {
          that.doCancelBank()
        })
      } else if (option.type === 'branch') {
        this.name = '开户支行'
        if (option.branchId) {
          this.bankId = option.branchId
        }
        this.getBankBranchs(function () {
          that.doCancelBank()
        })
      } else if (option.type === 'input') {
        if (option.value) {
          this.value = option.value
        }
        if (option.name === 'LegalName') {
          this.name = '真实姓名'
        } else if (option.name === 'LegalIdCard') {
          this.name = '身份证号'
        } else if (option.name === 'MerContactPhone') {
          this.name = '手机号'
        } else if (option.name === 'MerAddress') {
          this.name = '详细地址'
        }
      }
      this.titleHeight = this.getGlobalData().titleHeight
      this.url = this.getGlobalUrl().url
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .data-page {
    height: 100vh;
    background-color: #f0f0f0;
    .data-scroll {
      height: 90vh;
      .data-main {
        min-height: 80vh;
        .data-upload {
          padding: 5vw;
          .data-img {
            text-align: center;
            padding: 7vw 0 10vw 0;
            img {
              display: inline-block;
              width: rpx(470);
              height: rpx(333);
            }
          }
          .data-button {
            padding: 3vw 5vw;
            text-align: center;
            font-size: 4vw;
            span {
              width: 80vw;
              height: 11vw;
              line-height: 11vw;
              background: #ff6700;
              border-radius: 6vw;
              color: white;
              display: inline-block;
            }
          }
        }
        .data-address {
          padding-top: 3vw;
          .section {
            background: white;
            height: 12vw;
            line-height: 12vw;
            padding: 0 5vw;
            width: 90vw;
            .picker {
              width: 80vw;
              display: inline-block;
              height: 12vw;
              line-height: 12vw;
              vertical-align: top;
              color: #7e7e7e;
              font-size: 4vw;
            }
            .section-area {
              width: 9vw;
              padding-right: 1vw;
              display: inline-block;
              height: 12vw;
              line-height: 12vw;
              vertical-align: top;
              text-align: right;
            }
          }
          .data-button {
            padding: 3vw 5vw;
            text-align: right;
            font-size: 4vw;
            span {
              width: 25vw;
              height: 11vw;
              line-height: 11vw;
              background: #ff6700;
              border-radius: 6vw;
              color: white;
              display: inline-block;
              text-align: center;
            }
          }
        }
        .data-title {
          font-size: 3vw;
          color: #bfbfbf;
        }
      }
    }
  }
</style>
