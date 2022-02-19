// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 这是未登录的标记
    notLogin: false,
  },
  loginToJump: function () {
    wx.switchTab({
      url: '../personal/personal',
    })
  },
  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
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
    var that = this
    let isUserInfo = wx.getStorageSync('userInfo')
    if (isUserInfo === null || isUserInfo === "") {
      that.setData({
        notLogin: true
      }) 
    } else {
      that.setData({
        notLogin: false
      })
    }
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