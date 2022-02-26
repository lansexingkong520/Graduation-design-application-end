// pages/addAddress/addAddress.js
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'ZPOBZ-D6I36-3SNST-MFNE5-4O5L5-COBMX'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索地址
    searchAdd: null,
    // 关键字搜索的返回值
    suggestion: []
  },

  //数据回填方法(这里不做回填了，直接做成选择就返回页面)
  // 因为用的是navigateBack，无法传参，就存入Storage，然后addNotes在onShow取得数据，
  // 不论发布没发布，只要离开addNotes页面，Storage的地址就要清除
  backfill: function (e) {
    var id = e.currentTarget.id;
    wx.setStorageSync('addLocation', this.data.suggestion[id])
    wx.navigateBack({
      delta: 1,
    })
  },
  //触发关键词输入提示事件
  getsuggest: function(e) {
    var that = this;
    if (e.detail.value === null || e.detail.value === '') {
      return
    }
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        that.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  // 点击取消，清空输入框搜索字段和已搜出的内容
  // 同时要在搜索那里做好判断，如果搜索字段为空，就不要去触发搜索了，不然会报错的
  clearInput: function () {
    var that = this
    that.setData({
      searchAdd: '',
      suggestion: []
    })
  },
  searchAddress: function (e) {
    var that = this
    that.setData({
      searchAdd: e.detail.value
    })
    // wx.navigateBack({
    //   delta: 1,
    // })
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