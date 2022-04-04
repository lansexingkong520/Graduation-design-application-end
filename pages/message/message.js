// pages/message/message.js
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 这是未登录的标记
    notLogin: false,
    // 管理员信息
    tbAdmin: {},
    // 消息实体
    messageBean: [],
    size: 5,
    messageStart: 0
  },
  // 获取系统信息
  getMessageList() {
    var that = this
    wx.request({
      url: 'http://localhost:8888/tbSystemmessages/getMessageList',
      data: {
        size: that.data.size,
        start: that.data.messageStart
      },
      success (res) {
        if (res.data.code !== "200") {
          return
        }
        console.log(res.data)
        if (res.data.data.tbSystemmessagesList.length !== 0) {
          res.data.data.tbSystemmessagesList.forEach(item => {
            item.replytime = item.time.substring(0, 10)
            that.data.messageBean.push(item)
          })
        }
        that.setData({
          messageBean: that.data.messageBean,
          tbAdmin: res.data.data.tbAdmin
        })
      }
    })
    
  },
  // 未登录时跳转到个人中心界面去登录
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
    if (app.globalData.userInfo === null) {
      that.setData({
        notLogin: true
      }) 
    } else {
      that.setData({
        notLogin: false
      }) 
      this.getMessageList()
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
    var that = this
    that.data.messageStart += 1
    that.getMessageList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})