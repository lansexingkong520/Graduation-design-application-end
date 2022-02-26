// pages/viewDetail/viewDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕宽度
    screenWidth: 0,
    // 帖子实体
    postBean: {},
    // 帖子发布时间
    releaseTime: null,
    // 每个帖子取最大的高
    maxImgHeight: 0,
    // 图片地址
    imgUrls: [],
    // 图片滑块动画切换时间
    duration: 500
  },

  // 跳转到路线规划插件页面
  jumpToRoutePlan: function () {
    var that = this
    let plugin = requirePlugin('routePlan');
    let key = 'ZPOBZ-D6I36-3SNST-MFNE5-4O5L5-COBMX';  //使用在腾讯位置服务申请的key
    let referer = '美食美刻-用户端';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': that.data.postBean.place,
      'latitude': that.data.postBean.latitude,
      'longitude': that.data.postBean.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowWidth = wx.getSystemInfoSync().windowWidth
    var that=this
    var itemBean = JSON.parse(options.itemBean)
    var imgHeights = []
    for (var i = 0; i < itemBean.postPicture.length; i++) {
      imgHeights.push(itemBean.postPicture[i].height/itemBean.postPicture[i].width)
    }
    var maxHeight = Math.max.apply(null, imgHeights) * windowWidth
    that.setData({
      screenWidth: windowWidth,
      postBean: itemBean,
      releaseTime: itemBean.time.substring(0, 10),
      imgUrls: itemBean.postPicture,
      maxImgHeight: maxHeight
    })
    console.log(that.data.postBean)
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