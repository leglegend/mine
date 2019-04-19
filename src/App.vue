<script>
  export default {
    created () {
      let system = wx.getSystemInfoSync()
      system.statusBarHeight += 4
      if (system.platform.toLowerCase() === 'android') {
        system.statusBarHeight += 4
        this.getGlobalData().platform = 'android'
      } else {
        this.getGlobalData().platform = 'ios'
      }
      this.getGlobalData().statusBarHeight = system.statusBarHeight
      this.getGlobalData().titleHeight = system.statusBarHeight + 32 + 8
      this.getGlobalData().screenWidth = system.screenWidth
    },
    onShow: function (e) {
      console.log(e)
      let globalData = this.getGlobalData()
      if (globalData.user && globalData.user.type !== 0) {
        this.$post('/user/businessGetAdminPermissions', {
          Uid: globalData.user.Userid,
          StoreId: globalData.user.StoreId,
          Userid: globalData.user.Userid
        }).then(res => {
          wx.setStorage({
            key: 'auth',
            data: res.AdminPermissions
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  @function rpx($value) {
    @return $value * 1rpx;
  }

  button::after {
    border: none;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200 rpx 0;
    box-sizing: border-box;
  }

  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }

  .demo-footer {
    width: 100vw;
    line-height: 10vh;
    height: 10vh;
    padding-top: 5vh;
    text-align: center;
    background-color: #f0f0f0;
    .demo-nutcards {
      width: rpx(139);
      height: rpx(59);
      display: inline-block;
      vertical-align: middle;
      position: relative;
      top: -0.5vw;
    }
  }

  .demo-bottom {
    position: absolute;
    bottom: rpx(-1);
    height: rpx(1);
    width: 100vw
  }

  .footer {
    width: 100vw;
    font-size: 0.8em;
    line-height: 10vh;
    height: 10vh;
    margin: 0 auto;
    text-align: center;
    background-color: #f0f0f0;
    color: #bfbfbf;
  }

  .demo-noitems {
    width: 100vw;
    font-size: 0.8em;
    line-height: 15vh;
    text-align: center;
    color: #bfbfbf;
  }

  .demo-noauth {
    .noauth-top {
      background: linear-gradient(to right, #ff8100, #ff6700);
      .noauth-title {
        width: 100vw;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: rpx(35);
        color: white;
      }
    }
    .demo-noauthcontext {
      width: 100vw;
      font-size: rpx(30);
      line-height: 20vh;
      text-align: center;
      color: #bfbfbf;
    }
  }

  .demo-page {
    height: 100vh;
    //background-color: #f0f0f0;
    .demo-scroll {
      height: 90vh;
      .demo-main {
        min-height: 80vh;
      }
    }
  }

  .demo-buttons {
    padding: 2vh 0;
    text-align: right;
    .done {
      display: inline-block;
      height: rpx(80);
      line-height: rpx(80);
      text-align: center;
      background-color: #ff6700;
      border-radius: rpx(40);
      font-size: rpx(35);
      color: white;
      width: 28vw;
      font-size: rpx(35);
      color: white;
    }
    .cancel {
      display: inline-block;
      height: rpx(80);
      line-height: rpx(80);
      text-align: center;
      background-color: white;
      border: rpx(1) solid #ff6700;
      border-radius: rpx(40);
      font-size: rpx(35);
      width: 28vw;
      font-size: rpx(35);
      color: #ff6700;
      margin-right: 3vw;
    }
  }

  .demo-input {
    width: 90vw;
    height: 7vh;
    line-height: 7vh;
    border-bottom: rpx(1) solid #bbbbbb;
    font-size: rpx(28);
    .name {
      height: 7vh;
      line-height: 7vh;
      width: 19vw;
      padding-left: 1vw;
      vertical-align: top;
      display: inline-block;
      .request {
        color: red;
      }
    }
    .value {
      display: inline-block;
      width: 70vw;
      vertical-align: top;
      height: 7vh;
      line-height: 7vh;
      color: #7e7e7e;
      .radio {
        display: inline-block;
        width: 25vw;
      }
    }
  }

</style>
