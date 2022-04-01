// pages/personal/personal.js
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标记是否登录
    isLogin: false,
    // 用户信息
    userInfo:{
      // 用户名
      name: "",
      // 用户编号
      id: 0,
      picURL: ""
    }
  },

  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
  },

  // 点击登录页面
  onClickNavigateLogin: function (event) {
    //页面跳转  ---页面跳转以后 需要展示登录页面
    var id = event.currentTarget.dataset.id
    //进行页面跳转
    wx.navigateTo({
      url: '../userLogin/userLogin?id=' + id,
    })
  },
  // 点击跳转编辑资料
  jumpToEdit: function () {
    // 页面跳转, 因为storage里有用户信息，所以用户信息直接取，不用传
    wx.navigateTo({
      url: '../editInfo/editInfo',
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
    var that = this
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo === null) {
      that.setData({
        isLogin: true
      }) 
    } else {
      that.setData({
        isLogin: false,
        userInfo: app.globalData.userInfo
      }) 
    }
    // let isUserInfo = wx.getStorageSync('userInfo')
    // if (isUserInfo === null || isUserInfo === "") {
    //   that.setData({
    //     isLogin: true
    //   }) 
    // } else {
    //   that.setData({
    //     isLogin: false,
    //     userInfo: {
    //       name: isUserInfo.username,
    //       id: isUserInfo.uid,
    //       picURL: isUserInfo.picURL
    //     }
    //   }) 
    // }
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