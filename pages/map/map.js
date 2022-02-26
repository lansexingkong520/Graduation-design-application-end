// pages/map/map.js
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: null,
    latitude: null,
    address: null,
    speed: null,
    accuracy: null
  },
  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'ZPOBZ-D6I36-3SNST-MFNE5-4O5L5-COBMX'
    });
    this.mapCtx = wx.createMapContext('myMap')

    // 直接获取地址
    // var that = this
    // qqmapsdk.reverseGeocoder({
    //   success: function (res) {
    //     //获取当前地址成功
    //     console.log(res);
    //     that.setData({
    //       latitude: res.result.location.lat,
    //       longitude: res.result.location.lng,
    //       address: res.result.address
    //     })
    //   },
    //   fail: function (res) {
    //     console.log('获取当前地址失败');
    //   }
    // })

    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({//赋值
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      }, 
      //定位失败回调      
      fail: function() {
        console.log("getLocationFail")
      }
    })
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