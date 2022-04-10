// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索内容
    searchWord: null
  },

  //输入搜索内容
  getSearchInput: function(e) {
    this.setData({
      searchWord: e.detail.value 
    })
  },
  // 用户搜索,带着数据跳转到搜索列表页面再搜索
  search: function () {
    wx.navigateTo({
      url: '../search/searchList?searchWord=' + this.data.searchWord,
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