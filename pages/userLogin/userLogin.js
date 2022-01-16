// pages/userLogin/userLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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