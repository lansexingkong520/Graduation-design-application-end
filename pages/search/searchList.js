// pages/search/searchList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键字
    searchWord: "",
    // 在这个页面可以先将帖子所有信息搜出来，然后点击进去的时候带着跳转
    searchLists: [],
    searchListLeft: [],
    searchListRight: [],
    // 帖子起始搜索
    searchStart: 0,
    // 帖子一次搜索数量，先定10个(如果没有图片的话，10个可能不太够)
    size: 10
  },
  
  // 获取搜索内容
  getSearchList: function () {
    var that = this
    wx.request({
      url: 'http://localhost:8888/tbPost/searchList',
      data: {
        size: that.data.size,
        start: that.data.searchStart,
        search: that.data.searchWord
      },
      success (res) {
        if (res.data.code !== "200") {
          return
        }
        for (var i = 0; i < res.data.data.length; i++) {
          if (i % 2 == 0) {
            that.data.searchListLeft.push(res.data.data[i])
          } else {
            that.data.searchListRight.push(res.data.data[i])
          }
        }
        that.data.searchLists.push(res.data.data)
        that.setData({
          searchLists: res.data.data,
          searchListLeft: that.data.searchListLeft,
          searchListRight: that.data.searchListRight
        })
      }
    })
  },
  // 查看帖子详情
  viewDetails (e) {
    //拿到单个帖子详情
    var item = e.currentTarget.dataset.item
    //将对象转为string
    var itemBean = JSON.stringify(item)
    wx.navigateTo({
      url: '../viewDetail/viewDetail?itemBean=' + itemBean,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      searchWord: options.searchWord
    })
    that.getSearchList()
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
    var that = this
    that.data.searchStart += 1
    that.getSearchList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})