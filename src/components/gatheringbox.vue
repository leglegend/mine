<template>
  <div class="gathering-box">
    <div class="input" v-if="!type||type=='number'"
         :style="{'border-bottom-color':focus?'#7e7e7e':isError?'red':'#BFBFBF'}">
      <span class="name">
        {{name}}
        <text v-if="request">*</text>
      </span>
      <span :style="{width:remark?'':'65%',color:disabled?'#868686':''}">
        <input :type="type?type:'text'" :value="newValue" :placeholder="placeholder"
               :name="keyword"
               :disabled="disabled"
               @blur="onBlur"
               @focus="onFocus" :maxlength="max?max:-1"
               placeholder-style="color:#C4C4C4"/>
      </span>
      <span v-if="remark" @click="showRemark">
        {{remark}}
      </span>
    </div>
    <div class="section" v-if="type=='select'"
         :style="{'border-bottom-color':isError?'red':'#BFBFBF'}">
      <span class="section-name">
        {{name}}
        <text v-if="request">*</text>
      </span>
      <span class="picker-class">
        <picker mode="multiSelector"
                @change="multiPickerChange"
                @columnchange="multiPickerColumnChange"
                @cancel="doCancelArea"
                range-key="Name"
                :value="multiIndex"
                :disabled="disabled"
                :range="multiArray" class="picker">
          <span class="picker" :style="{color:disabled?'#868686':''}" v-if="province">
            <span>{{province}}</span>
            <span style="padding-left: 1.5vw">{{city}}</span>
            <span style="padding-left: 1.5vw">{{country}}</span>
          </span>
          <span class="picker" v-if="!province" style="color:#C4C4C4">
            请选择
          </span>
        </picker>
      </span>
      <span class="section-area" @click="chooseArea" v-if="!disabled">
        <img src="https://linkfit-pro.oss-cn-hangzhou.aliyuncs.com/Business/static/address.png" style="width: 23rpx;height: 32rpx;display: inline-block"/>
      </span>
    </div>
    <div class="section" v-if="type=='bank'"
         :style="{'border-bottom-color':isError?'red':'#BFBFBF'}">
      <span class="section-name">
        {{name}}
        <text v-if="request">*</text>
      </span>
      <span class="picker-class">
        <picker mode="selector"
                @change="pickerChange"
                @cancel="doCancelBank"
                :range-key="type=='bank'?'BankName':'BankBranchName'"
                :value="bankIndex"
                :disabled="disabled"
                :range="banks" class="picker">
          <span class="picker" :style="{color:disabled?'#868686':''}" v-if="bank">
            <span>{{bank}}</span>
          </span>
          <span class="picker" v-if="!bank" style="color:#C4C4C4">
            请选择
          </span>
        </picker>
      </span>
    </div>
    <div class="input" v-if="type=='branch'" :style="{'border-bottom-color':focus?'#7e7e7e':isError?'red':'#BFBFBF'}">
      <span class="name">
        {{name}}
        <text v-if="request">*</text>
      </span>
      <span :style="{width:remark?'':'65%',color:disabled?'#868686':''}">
        <input :type="type?type:'text'" :value="newValue" :placeholder="placeholder"
               :name="keyword"
               :disabled="disabled"
               @blur="onBlur"
               @focus="onFocus" :maxlength="max?max:-1"
               @input="onChange"
               placeholder-style="color:#C4C4C4"/>
      </span>
      <span v-if="remark" @click="showRemark">
        {{remark}}
      </span>
    </div>
    <div class="select-banks" v-if="selectBanks.length>0&&type=='branch'">
      <scroll-view class="select-items" scroll-y="true"
                   :style="{height:selectBanks.length>6?'42vw':selectBanks.length*7+'vw'}">
        <div class="select-item" v-for="item in selectBanks" @click="selectBanck(item.BankBranchCode)">
          {{item.BankBranchName}}
        </div>
      </scroll-view>
      <div class="select-remark" @click="selectBanks=[]">关闭提示</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['name', 'request', 'disabled', 'value', 'keyword', 'placeholder', 'remark', 'type', 'provinceId', 'cityId', 'countryId', 'bankCode', 'bankId'],
    data () {
      return {
        focus: false,
        newValue: '',
        isError: false,
        provinces: [],
        cities: [],
        countries: [],
        province: '',
        city: '',
        country: '',
        multiIndex: [0, 0, 0],
        multiArray: [[0], [0], [0]],
        banks: [],
        selectBanks: [],
        bankIndex: 0,
        bank: '',
        changeData: 0
      }
    },
    methods: {
      onFocus () {
        this.isError = false
        this.focus = true
        if (this.newValue === '' || this.newValue === null) {
          this.selectBanks = this.banks
        } else {
          let banks = []
          for (let item of this.banks) {
            if (item.BankBranchName.indexOf(this.newValue) !== -1) {
              banks.push(item)
            }
          }
          if (banks.length > 0) {
            this.selectBanks = banks
          }
        }
      },
      onBlur (e) {
        this.focus = false
        this.newValue = e.mp.detail.value
        this.validate()
      },
      onChange (e) {
        this.newValue = e.mp.detail.value
        if (e.mp.detail.value === '' || e.mp.detail.value === null) {
          this.selectBanks = this.banks
        } else {
          let banks = []
          for (let item of this.banks) {
            if (item.BankBranchName.indexOf(e.mp.detail.value) !== -1) {
              banks.push(item)
            }
            if (item.BankBranchName === e.mp.detail.value) {
              this.selectBanck(item.BankBranchCode)
              return
            }
          }
          if (banks.length > 0) {
            this.selectBanks = banks
          }
        }
      },
      validate () {
        this.isError = false
        if (this.request && (this.type === 'bank' || this.type === 'branch')) {
          if (this.bankId === '' || this.bankId === undefined) {
            this.isError = true
          }
        } else if (this.request && this.type === 'select') {
          if (this.provinceId === '' || this.provinceId === undefined) {
            this.isError = true
          }
        } else {
          if (this.newValue === '' || this.newValue === undefined) {
            this.isError = true
          }
        }
        return !this.isError
      },
      showRemark () {
        this.$emit('showRemark', this.keyword)
      },
      selectBanck (bankId) {
        for (let i in this.banks) {
          if (bankId === this.banks[i].BankBranchCode) {
            this.newValue = this.banks[i].BankBranchName
            this.bankId = bankId
            this.selectBanks = []
            this.$emit('bankChange', this.keyword, this.bankId)
            this.validate()
          }
        }
      },
      multiPickerChange (e) {
        this.isError = false
        this.multiIndex = e.mp.detail.value
        this.province = this.multiArray[0][this.multiIndex[0]].Name
        this.provinceId = this.multiArray[0][this.multiIndex[0]].ClassId
        this.city = this.multiArray[1][this.multiIndex[1]].Name
        this.cityId = this.multiArray[1][this.multiIndex[1]].ClassId
        this.country = this.multiArray[2][this.multiIndex[2]].Name
        this.countryId = this.multiArray[2][this.multiIndex[2]].ClassId
        this.$emit('addressChange', this.keyword, [this.provinceId, this.cityId, this.countryId])
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
      doCancelArea () {
        let that = this
        console.log(this.keyword + ' ' + this.provinceId + ' ' + that.cityId)
        if (this.provinceId === '' || this.provinceId === undefined) {
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
                  that.changeData += 1
                }
              }
            })
          })
        }
      },
      chooseArea () {
        let that = this
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success: function () {
                  that.chooseLocation()
                }
              })
            } else {
              that.chooseLocation()
            }
          }
        })
      },
      chooseLocation () {
        let that = this
        wx.chooseLocation({
          success: function (res) {
            console.log('----------------------------------')
            console.log(res)
            console.log('----------------------------------')
            if (res.address === '' || res.poiid === 'City') {
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
                    that.doCancelArea()
                    that.$emit('addressChange', that.keyword, [that.provinceId, that.cityId, that.countryId])
                  }
                }
              })
            })
          }
        })
      },
      pickerChange (e) {
        this.isError = false
        this.bankIndex = e.mp.detail.value
        this.bank = this.banks[this.bankIndex].BankName ? this.banks[this.bankIndex].BankName : this.banks[this.bankIndex].BankBranchName
        this.bankId = this.banks[this.bankIndex].BankCode ? this.banks[this.bankIndex].BankCode : this.banks[this.bankIndex].BankBranchCode
        this.$emit('bankChange', this.keyword, this.bankId)
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
          BankCode: this.bankCode,
          ProvinceId: this.provinceId,
          CityId: this.cityId,
          DistrictId: this.countryId
        }).then(res => {
          that.banks = res.BankBranchData
          if (callback) {
            callback()
          }
        })
      }
    },
    mounted () {
      this.newValue = this.value
    },
    onLoad (option) {
      this.storeId = option.storeId
      this.userId = option.userId
      let that = this
      if (this.keyword === 'Mer' || this.keyword === 'MerBank') {
        console.log('lalalalala')
        this.getProvince(function () {
          that.doCancelArea()
        })
      }
      if (this.type === 'bank') {
        console.log('hahahaha')
        this.getBanks(function () {
          that.doCancelBank()
        })
      }
      if (this.type === 'branch') {
        this.getBankBranchs(function () {
          if (that.bankId) {
            that.selectBanck(that.bankId)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .gathering-box {
    position: relative;
    height: 13.1vw;
    .input {
      height: 13.1vw;
      line-height: 13vw;
      border-bottom: 0.1vw solid #BFBFBF;
      text {
        color: red;
      }
      span {
        display: inline-block;
        height: 13vw;
        line-height: 13vw;
        vertical-align: top;
        &:nth-child(1) {
          color: #181818;
          font-size: 3.7vw;
          width: 35%;
        }
        &:nth-child(2) {
          color: #181818;
          font-size: 3.7vw;
          width: 40%;
        }
        &:nth-child(3) {
          color: #004CA1;
          font-size: 3.1vw;
          width: 25%;
          text-decoration: underline;
          text-align: right;
        }
      }
      input {
        width: 100%;
        height: 100%;
        line-height: 100%;
        display: inline-block;
      }
    }
    .section {
      height: 13.1vw;
      line-height: 13vw;
      border-bottom: 0.1vw solid #BFBFBF;
      span {
        display: inline-block;
        vertical-align: top;
      }
      text {
        color: red;
      }
      .section-name {
        font-size: 3.7vw;
        color: #181818;
        width: 35%;
      }
      .picker {
        color: #181818;
        font-size: 3.7vw;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
      .picker-class {
        display: inline-block;
        width: 58%;
      }
      .section-area {
        width: 5%;
        padding-left: 2%;
        display: inline-block;
        height: 13vw;
        line-height: 13vw;
        vertical-align: top;
        text-align: left;
        position: relative;
        top: 0.7vw;
      }
    }
    .select-banks {
      width: 65%;
      left: 35%;
      position: absolute;
      top: 13.1vw;
      background: white;
      border: 0.1vw solid #BFBFBF;
      box-sizing: border-box;
      z-index: 3;
      .select-item {
        padding-left: 2vw;
        height: 7vw;
        line-height: 7vw;
        color: #181818;
        font-size: 3.7vw;
        box-sizing: border-box;
        border-bottom: 0.1vw solid #BFBFBF;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .select-remark {
        height: 4vw;
        line-height: 4vw;
        font-size: 2.5vw;
        color: white;
        background: #BFBFBF;
        text-align: center;
      }
    }

    .error {
      color: red;
      font-size: 0.7em;
      height: 2vh;
    }

    .inputing {
      border-bottom: 1px solid #7e7e7e;
    }
  }
</style>
