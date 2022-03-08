// pages/userLogin/userLogin.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户名或手机号
    UNOrTel: null,
    // 密码
    password: null,
    // 校验规则
    UNOrTelRule: [{
      required: true
    }],
    PWRule: [{
      required: true
    }],
  },

  // 点击登录
  onClickLogin: function () {
    // 这里直接将this进行保存，因为不确定之后this是否会被改变
    var that = this;
    // 防止用户信息填写出现空缺，或者是空串
    if (that.data.UNOrTel === null || that.data.UNOrTel === "" || that.data.password === null || that.data.password === "") {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        mask: true
      })
      return
    }
    // 向后台发送登录请求 现在的请求还不用带上cookie，但是要将cookie保存下来
    wx.request({
      url: 'http://localhost:8888/tbUser/userLogin',
      data: {
        username: that.data.UNOrTel,
        tel: that.data.UNOrTel,
        password: that.data.password
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        } else {
          wx.setStorageSync('userInfo', res.data.data)
          app.globalData.userInfo = res.data.data
          // 登录成功跳转首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  // 获取账号
  changeUNOrTel: function (event) {
    this.setData({
      UNOrTel: event.detail.value
    })
  },
  // 获取密码
  changePW: function (event) {
    this.setData({
      password: event.detail.value
    })
  },
  // 点击注册账号
  onRegisterNavigate: function  (event) {
    //页面跳转  ---页面跳转以后 需要展示注册页面
    var id = event.currentTarget.dataset.id
    //进行页面跳转
    wx.navigateTo({
      url: '../userRegister/userRegister?id=' + id,
    })
  },

  // 点击忘记密码，找回密码页面
  onForgetPWNavigate: function (event) {
    //页面跳转  ---页面跳转以后 需要展示找回密码页面
    var id = event.currentTarget.dataset.id
    // 进行页面跳转
    wx.navigateTo({
      url: '../forgetPW/forgetPW?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})