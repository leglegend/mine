<template>
  <div class="ident-page">
    <title :name="'认证身份'" :noline="true"></title>
    <div class="menu">
      <span class="menu-left" :class="{'select':current==0}" @click="current=0">个人</span>
      <span class="menu-middle" :class="{'select':current==1}" @click="current=1">个体工商户</span>
      <span class="menu-right" :class="{'select':current==2}" @click="current=2">企业（公司）</span>
      <div class="menu-bottom"></div>
    </div>
    <scroll-view class="ident-scroll" scroll-y="true"
                 :style="{height:'calc(100vh - 10vw - '+titleHeight +'px)'}">
      <div class="ident-main" :style="{'min-height':'calc(90vh - 10vw - '+titleHeight +'px)'}">
        <div class="main-title">
          <span>?</span>
          <span>
            <div>认证资料一般可以在24小时内审核完毕</div>
            <div>到账时间为D+1，即收款后第二天到账</div>
          </span>
        </div>
        <div class="ident-context" v-if="current==0">
          <div class="context-part">
            <div style="padding: 1vw"></div>
            <div class="input" @click="jumpToData('input','LegalName')">
              <span class="name">
                真实姓名
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalName?'':'#dadada'}">
                {{info.LegalName ? info.LegalName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','LegalIdCard')">
              <span class="name">
                身份证号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalIdCard?'':'#dadada'}">
                {{info.LegalIdCard ? info.LegalIdCard : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerContactPhone')">
              <span class="name">
                手机号码
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerContactPhone?'':'#dadada'}">
                {{info.MerContactPhone ? info.MerContactPhone : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('address')">
              <span class="name">
                所在省份
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:address?'':'#dadada'}">
                {{address ? address : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerAddress')">
              <span class="name">
                详细地址
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerAddress?'':'#dadada'}">
                {{info.MerAddress ? info.MerAddress : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('store')">
              <span class="name">
                经营范围
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:store?'':'#dadada'}">
                {{store ? store : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="input" @click="jumpToData('bank')">
              <span class="name">
                开户行
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:bank?'':'#dadada'}">
                {{bank ? bank : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('input','CardNo')">
              <span class="name">
                银行卡号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.CardNo?'':'#dadada'}">
                {{info.CardNo ? info.CardNo : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part" style="padding: 5vw">
            <div class="photo">
              <span class="name">
                身份证照片
                <span class="request">*</span>
              </span>
              <span class="value">
                <span class="value-span" v-if="info.ImgIdcardFornt==undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <span>上传正面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardFornt!=undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <img :src="info.ImgIdcardFornt"/>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack==undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <span>上传背面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack!=undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <img :src="info.ImgIdcardBack"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                结算银行卡
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgBankCard')">
                <span class="value-span" v-if="info.ImgBankCard==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgBankCard!=undefined">
                  <img :src="info.ImgBankCard"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                手持身份证
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgHandIdcard')">
                <span class="value-span" v-if="info.ImgHandIdcard==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgHandIdcard!=undefined">
                  <img :src="info.ImgHandIdcard"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                手持银行卡
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgHandBankCard')">
                <span class="value-span" v-if="info.ImgHandBankCard==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgHandBankCard!=undefined">
                  <img :src="info.ImgHandBankCard"/>
                </span>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="submit-button" @click="submit(2)">
              <span>
                确认并提交审核
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
        </div>
        <div class="ident-context" v-if="current==1">
          <div class="context-part">
            <div style="padding: 1vw"></div>
            <div class="input" @click="jumpToData('input','StoreFullName')">
              <span class="name">
                商户全称
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.StoreFullName?'':'#dadada'}">
                {{info.StoreFullName ? info.StoreFullName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','StoreName')">
              <span class="name">
                商户简称
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.StoreName?'':'#dadada'}">
                {{info.StoreName ? info.StoreName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerCertNo')">
              <span class="name">
                营业执照号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerCertNo?'':'#dadada'}">
                {{info.MerCertNo ? info.MerCertNo : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','LegalName')">
              <span class="name">
                法人姓名
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalName?'':'#dadada'}">
                {{info.LegalName ? info.LegalName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','LegalIdCard')">
              <span class="name">
                法人身份证号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalIdCard?'':'#dadada'}">
                {{info.LegalIdCard ? info.LegalIdCard : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerContactPhone')">
              <span class="name">
                手机号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerContactPhone?'':'#dadada'}">
                {{info.MerContactPhone ? info.MerContactPhone : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('address')">
              <span class="name">
                商户所在地区
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:address?'':'#dadada'}">
                {{address ? address : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('input','MerAddress')">
              <span class="name">
                详细地址
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerAddress?'':'#dadada'}">
                {{info.MerAddress ? info.MerAddress : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>

          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="input" @click="jumpToData('input','CardNo')">
              <span class="name">
                银行卡号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.CardNo?'':'#dadada'}">
                {{info.CardNo ? info.CardNo : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('bank')">
              <span class="name">
                开户银行
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:bank?'':'#dadada'}">
                {{bank ? bank : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('branch')">
              <span class="name">
                开户支行
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:branch?'':'#dadada'}">
                {{branch ? branch : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part" style="padding: 5vw">
            <div class="photo">
              <span class="name">
                法人身份证
                <span class="request">*</span>
              </span>
              <span class="value">
                <span class="value-span" v-if="info.ImgIdcardFornt==undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <span>上传正面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardFornt!=undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <img :src="info.ImgIdcardFornt"/>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack==undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <span>上传背面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack!=undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <img :src="info.ImgIdcardBack"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                结算银行卡
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgBankCard')">
                <span class="value-span" v-if="info.ImgBankCard==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgBankCard!=undefined">
                  <img :src="info.ImgBankCard"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                营业执照
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgCorpCode')">
                <span class="value-span" v-if="info.ImgCorpCode==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgCorpCode!=undefined">
                  <img :src="info.ImgCorpCode"/>
                </span>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="submit-button" @click="submit(0)">
              <span>
                确认并提交审核
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
        </div>
        <div class="ident-context" v-if="current==2">
          <div class="context-part">
            <div style="padding: 1vw"></div>
            <div class="input" @click="jumpToData('input','StoreFullName')">
              <span class="name">
                企业全称
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.StoreFullName?'':'#dadada'}">
                {{info.StoreFullName ? info.StoreFullName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','StoreName')">
              <span class="name">
                企业简称
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.StoreName?'':'#dadada'}">
                {{info.StoreName ? info.StoreName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerCertNo')">
              <span class="name">
                营业执照号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerCertNo?'':'#dadada'}">
                {{info.MerCertNo ? info.MerCertNo : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','LegalName')">
              <span class="name">
                法人姓名
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalName?'':'#dadada'}">
                {{info.LegalName ? info.LegalName : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','LegalIdCard')">
              <span class="name">
                法人身份证号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.LegalIdCard?'':'#dadada'}">
                {{info.LegalIdCard ? info.LegalIdCard : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('input','MerContactPhone')">
              <span class="name">
                手机号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerContactPhone?'':'#dadada'}">
                {{info.MerContactPhone ? info.MerContactPhone : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('address')">
              <span class="name">
                企业所在地区
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:address?'':'#dadada'}">
                {{address ? address : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('input','MerAddress')">
              <span class="name">
                详细地址
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.MerAddress?'':'#dadada'}">
                {{info.MerAddress ? info.MerAddress : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="input" @click="jumpToData('input','CardNo')">
              <span class="name">
                银行卡号
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:info.CardNo?'':'#dadada'}">
                {{info.CardNo ? info.CardNo : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input" @click="jumpToData('bank')">
              <span class="name">
                开户银行
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:bank?'':'#dadada'}">
                {{bank ? bank : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
            <div class="input no-line" @click="jumpToData('branch')">
              <span class="name">
                开户支行
                <span class="request">*</span>
              </span>
              <span class="value" :style="{color:branch?'':'#dadada'}">
                {{branch ? branch : '请填写'}}
              </span>
              <span class="logo">
                <img src="/static/right2.png"
                     style="width:13rpx;height: 22rpx;display: inline-block;vertical-align: middle"/>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part" style="padding: 5vw">
            <div class="photo">
              <span class="name">
                法人身份证
                <span class="request">*</span>
              </span>
              <span class="value">
                <span class="value-span" v-if="info.ImgIdcardFornt==undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <span>上传正面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardFornt!=undefined"
                      @click="jumpToData('upload','ImgIdcardFornt')">
                  <img :src="info.ImgIdcardFornt"/>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack==undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <span>上传背面</span>
                </span>
                <span class="value-span" v-if="info.ImgIdcardBack!=undefined"
                      @click="jumpToData('upload','ImgIdcardBack')">
                  <img :src="info.ImgIdcardBack"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                结算银行卡
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgBankCard')">
                <span class="value-span" v-if="info.ImgBankCard==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgBankCard!=undefined">
                  <img :src="info.ImgBankCard"/>
                </span>
              </span>
            </div>
            <div class="photo">
              <span class="name">
                营业执照
                <span class="request">*</span>
              </span>
              <span class="value" @click="jumpToData('upload','ImgCorpCode')">
                <span class="value-span" v-if="info.ImgCorpCode==undefined">
                  <span>上传图片</span>
                </span>
                <span class="value-span" v-if="info.ImgCorpCode!=undefined">
                  <img :src="info.ImgCorpCode"/>
                </span>
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
          <div class="context-part">
            <div class="submit-button" @click="submit(1)">
              <span>
                确认并提交审核
              </span>
            </div>
          </div>
          <div style="padding: 1.5vw"></div>
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
        info: {},
        address: '',
        store: '',
        bank: '',
        branch: '',
        firstLoad: true,
        current: 0,
        titleHeight: null
      }
    },
    methods: {
      jumpToData (type, name) {
        let url = '../data/main?userId=' +
          this.option.userId +
          '&storeId=' + this.option.storeId +
          '&type=' + type
        if (type === 'input') {
          url += '&name=' + name
          if (this.info[name]) {
            url += '&value=' + this.info[name]
          }
        } else if (type === 'address' && this.info.MerProvince) {
          url += '&provinceId=' + this.info.MerProvince
          if (this.info.MerCity) {
            url += '&cityId=' + this.info.MerCity
            if (this.info.MerDistrict) {
              url += '&countryId=' + this.info.MerDistrict
            }
          }
        } else if (type === 'store' && this.info.MerLevel1No) {
          url += '&storeCode=' + this.info.MerLevel1No
          if (this.info.MerLevel2No) {
            url += '&shopId=' + this.info.MerLevel2No
          }
        } else if (type === 'bank' && this.info.HeadBankCode) {
          url += '&bankId=' + this.info.HeadBankCode
        } else if (type === 'branch') {
          if (this.info.HeadBankCode === undefined) {
            wx.showToast({
              title: '请填写开户行',
              image: '/static/warn.png'
            })
            return
          }
          if (this.info.MerProvince === undefined || this.info.MerCity === undefined) {
            wx.showToast({
              title: '请填写地区',
              image: '/static/warn.png'
            })
            return
          }
          if (this.info.BankCode) {
            url += '&branchId=' + this.info.BankCode
          }
          url += '&bankId=' + this.info.HeadBankCode
          url += '&provinceId=' + this.info.MerProvince
          url += '&cityId=' + this.info.MerCity
        } else if (type === 'upload') {
          url += '&name=' + name
          url += '&value=' + (this.info[name] ? this.info[name] : '')
        }
        console.log(url)
        wx.navigateTo({url})
      },
      getMerchantInfo (callback) {
        let that = this
        this.$post('/merchant/businessGetMerchantInfo', {
          StoreId: this.option.storeId,
          Uid: this.option.userId
        }, !that.firstLoad).then(res => {
          that.info = res
          that.firstLoad = false
          if (callback) {
            callback()
          }
        })
      },
      calcMerchantInfo () {
        let that = this
        if (this.info.MerProvince) {
          this.address = ''
          this.getProvince(function () {
            if (that.info.MerCity) {
              that.getCity(function () {
                if (that.info.MerDistrict) {
                  that.getCountry()
                }
              })
            }
          })
        }
        if (this.info.MerLevel1No) {
          this.store = ''
          this.getStores(function () {
            if (that.info.MerLevel2No) {
              that.getShops()
            }
          })
        }
        if (this.info.HeadBankCode) {
          this.bank = ''
          this.getBanks()
        }
        if (this.info.BankCode) {
          this.branch = ''
          this.getBankBranchs()
        }
      },
      getProvince (callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: '0'
        }).then(res => {
          for (let item of res.AreasData) {
            if (item.ClassId === that.info.MerProvince) {
              that.address += item.Name
            }
          }
          if (callback) {
            callback()
          }
        })
      },
      getCity (callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: that.info.MerProvince
        }).then(res => {
          for (let item of res.AreasData) {
            if (item.ClassId === that.info.MerCity) {
              that.address += ' ' + item.Name
            }
          }
          if (callback) {
            callback()
          }
        })
      },
      getCountry (callback) {
        let that = this
        this.$post('/base/getAreas', {
          RootId: that.info.MerCity
        }).then(res => {
          for (let item of res.AreasData) {
            if (item.ClassId === that.info.MerDistrict) {
              that.address += ' ' + item.Name
            }
          }
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
          for (let item of res.StoreClassData) {
            if (item.ClassId === that.info.MerLevel1No) {
              that.store += ' ' + item.Name
            }
          }
          if (callback) {
            callback()
          }
        })
      },
      getShops (callback) {
        let that = this
        this.$post('/base/getStoreClass', {
          RootId: this.info.MerLevel1No
        }).then(res => {
          for (let item of res.StoreClassData) {
            if (item.ClassId === that.info.MerLevel2No) {
              that.store += ' ' + item.Name
            }
          }
          if (callback) {
            callback()
          }
        })
      },
      getBanks () {
        let that = this
        this.$post('/base/getBank', {}).then(res => {
          for (let item of res.BankData) {
            if (item.BankCode === that.info.HeadBankCode) {
              that.bank = item.BankName
            }
          }
        })
      },
      getBankBranchs () {
        let that = this
        this.$post('/base/getBankBranch', {
          BankCode: this.info.HeadBankCode,
          ProvinceId: this.info.MerProvince,
          CityId: this.info.MerCity
        }).then(res => {
          for (let item of res.BankBranchData) {
            if (item.BankBranchCode === that.info.BankCode) {
              that.branch = item.BankBranchName
            }
          }
        })
      },
      submit (num) {
        this.info.StoreId = this.option.storeId
        this.info.Uid = this.option.userId
        this.info.StoreType = num
        this.info.OperationType = 1
        let that = this
        this.$post('/merchant/businessSetMerchantInfo', this.info, true).then(res => {
          that.$success('保存成功', false)
        })
      }
    },
    onLoad (option) {
      this.option = option
      let that = this
      this.firstLoad = true
      this.getMerchantInfo(function () {
        that.calcMerchantInfo()
      })
      this.titleHeight = this.getGlobalData().titleHeight
    },
    onShow () {
      if (this.firstLoad) {
        return
      }
      let that = this
      this.getMerchantInfo(function () {
        that.calcMerchantInfo()
      })
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  .ident-page {
    height: 100vh;
    background-color: #f0f0f0;
    .menu {
      height: 10vw;
      text-align: center;
      font-size: rpx(28);
      color: #ff6700;
      position: relative;
      background-color: white;
      .menu-left {
        border-radius: rpx(15) 0 0 rpx(15);
        display: inline-block;
        height: rpx(55);
        line-height: rpx(55);
        border: rpx(1) solid #ff6700;
        text-align: center;
        width: 30vw;
        background-color: white;
      }
      .menu-middle {
        display: inline-block;
        border-top: rpx(1) solid #ff6700;
        border-bottom: rpx(1) solid #ff6700;
        text-align: center;
        height: rpx(55);
        line-height: rpx(55);
        width: 30vw;
        background-color: white;
      }
      .menu-right {
        border-radius: 0 rpx(15) rpx(15) 0;
        display: inline-block;
        border: rpx(1) solid #ff6700;
        text-align: center;
        height: rpx(55);
        line-height: rpx(55);
        width: 30vw;
        background-color: white;
      }
      .menu-bottom {
        position: absolute;
        bottom: rpx(-1);
        height: rpx(1);
        background: white;
        width: 100vw;
        z-index: 1001;
        border-bottom: rpx(1) solid #bfbfbf;
      }
      .select {
        color: white;
        background-color: #ff6700;
      }
    }
    .ident-scroll {
      height: 90vh;
      .ident-main {
        min-height: 80vh;
        .main-title {
          padding: 4vw 5vw;
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
        .ident-context {
          .context-part {
            padding: 0 5vw;
            background-color: white;
            .submit-button {
              text-align: center;
              padding: 10vw 0 15vw 0;
              span {
                color: white;
                background-color: #ff6700;
                display: inline-block;
                width: 60vw;
                height: 11vw;
                line-height: 11vw;
                font-size: 4.5vw;
                border-radius: 10vw;
              }
            }
          }
          .photo {
            width: 90vw;
            height: 20vw;
            line-height: 20vw;
            font-size: rpx(28);
            .name {
              height: 20vw;
              line-height: 20vw;
              width: 24vw;
              padding-left: 1vw;
              vertical-align: top;
              display: inline-block;
              .request {
                color: red;
              }
            }
            .value {
              display: inline-block;
              span {
                display: inline-block;
              }
              .value-span {
                padding-right: 5vw;
                span {
                  height: 15vw;
                  line-height: 15vw;
                  background-color: #f0f0f0;
                  width: 25vw;
                  text-align: center;
                  font-size: 3vw;
                  color: #dadada;
                  border-radius: 3vw;
                }
                img {
                  height: 15vw;
                  line-height: 15vw;
                  width: 25vw;
                  border-radius: 3vw;
                  display: inline-block;
                  vertical-align: middle;
                  border: rpx(1) solid #f0f0f0;
                }
              }
            }
          }
          .input {
            width: 90vw;
            height: 12vw;
            line-height: 12vw;
            border-bottom: rpx(1) solid #bbbbbb;
            font-size: rpx(28);
            .name {
              height: 12vw;
              line-height: 12vw;
              width: 25vw;
              padding-left: 1vw;
              vertical-align: top;
              display: inline-block;
              .request {
                color: red;
              }
            }
            .value {
              display: inline-block;
              width: 59vw;
              text-align: right;
              vertical-align: top;
              height: 12vw;
              line-height: 12vw;
              color: #7e7e7e;
              .radio {
                display: inline-block;
                width: 25vw;
              }
            }
            .logo {
              display: inline-block;
              width: 5vw;
              text-align: right;
              vertical-align: top;
              height: 12vw;
              line-height: 12vw;
            }
          }
          .no-line {
            border-bottom: 0 solid #bbbbbb;
          }
        }
      }
    }
  }
</style>
