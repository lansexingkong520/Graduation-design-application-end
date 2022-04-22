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
    },
    // "笔记、收藏"的切换
    segmentActiveKey: ["one","two"],
    // 切换的标识 "0"为用户笔记 "1"为收藏
    segmentActiveKeyTag: 0,
    // 用户的笔记
    notes: [],
    noteLeft: [],
    noteRight: [],
    // 笔记起始搜索
    noteStart: 0,
    // 帖子一次搜索数量，先定10个(如果没有图片的话，10个可能不太够)
    size: 10,
    // 收藏的帖子
    collections: [],
    collectionLeft: [],
    collectionRight: [],
    // 收藏帖子起始搜索
    collectionStart: 0
  },

  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
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
  // 获取帖子信息
  getPostList() {
    var that = this
    if (that.data.segmentActiveKeyTag === 0) {
      wx.request({
        url: 'http://localhost:8888/tbPost/getNoteList',
        data: {
          userid: app.globalData.userInfo.uid,
          size: that.data.size,
          start: that.data.noteStart
        },
        success (res) {
          if (res.data.code !== "200") {
            return
          }
          for (var i = 0; i < res.data.data.length; i++) {
            if (i % 2 == 0) {
              that.data.noteLeft.push(res.data.data[i])
            } else {
              that.data.noteRight.push(res.data.data[i])
            }
            that.data.notes.push(res.data.data[i])
          }
          that.setData({
            notes: that.data.notes,
            noteLeft: that.data.noteLeft,
            noteRight: that.data.noteRight
          })
        }
      })
    }
    if (that.data.segmentActiveKeyTag === 1) {
      wx.request({
        url: 'http://localhost:8888/tbPost/getCollectionList',
        data: {
          userid: app.globalData.userInfo.uid,
          size: that.data.size,
          start: that.data.collectionStart
        },
        success (res) {
          if (res.data.code !== "200") {
            return
          }
          for (var i = 0; i < res.data.data.length; i++) {
            if (i % 2 == 0) {
              that.data.collectionLeft.push(res.data.data[i])
            } else {
              that.data.collectionRight.push(res.data.data[i])
            }
            that.data.collections.push(res.data.data[i])
          }
          that.setData({
            collections: that.data.collections,
            collectionLeft: that.data.collectionLeft,
            collectionRight: that.data.collectionRight
          })
        }
      })
    }
  },
  // 点击笔记和收藏的切换
  changeTabs: function (e) {
    var that = this
    that.setData({
      segmentActiveKeyTag: e.detail.currentIndex,
      notes: [],
      noteLeft: [],
      noteRight: [],
      // 笔记起始搜索
      noteStart: 0,
      // 收藏的帖子
      collections: [],
      collectionLeft: [],
      collectionRight: [],
      // 收藏帖子起始搜索
      collectionStart: 0
    })
    that.getPostList()
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
    var that = this
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 因为小程序的onLoad和onReady只加载最初的一次，所以只有在onShow里面加载列表内容
   * 但是onShow每次显示都会进行调用，所以就选择清空之前的数据，重新搜索用户的笔记和收藏。
   */
  onShow: function () {
    var that = this
    if (app.globalData.userInfo === null) {
      that.setData({
        isLogin: true
      }) 
    } else {
      that.setData({
        isLogin: false,
        userInfo: app.globalData.userInfo,
        notes: [],
        noteLeft: [],
        noteRight: [],
        // 笔记起始搜索
        noteStart: 0,
        // 收藏的帖子
        collections: [],
        collectionLeft: [],
        collectionRight: [],
        // 收藏帖子起始搜索
        collectionStart: 0
      })
      that.getPostList()
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
    if (that.data.segmentActiveKeyTag === 0) {
      that.data.noteStart += 1
    }
    if (that.data.segmentActiveKeyTag === 1) {
      that.data.collectionStart += 1
    }
    that.getPostList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})