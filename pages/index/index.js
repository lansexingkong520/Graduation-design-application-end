// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    // 用户信息（存在即为登录）
    userInfo: null,
    // "关注、推荐"的切换
    segmentActiveKey: ["one","two"],
    // 切换的标识 "0"为关注 "1"为推荐
    segmentActiveKeyTag: 1,
    // 推荐的帖子，在这个页面可以先将帖子所有信息搜出来，然后点击进去的时候带着跳转
    recommends: [],
    recommendLeft: [],
    recommendRight: [],
    // 推荐帖子起始搜索
    recommendStart: 0,
    // 帖子一次搜索数量，先定10个(如果没有图片的话，10个可能不太够)
    size: 10,
    // 关注的帖子
    attentions: [],
    // 关注帖子起始搜索
    attentionStart: 0
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
  getRecommendList() {
    var that = this
    if (that.data.segmentActiveKeyTag === 0) {
      wx.request({
        url: 'http://localhost:8888/tbPost/getAttentionList',
        data: {
          userid: app.globalData.userInfo.uid,
          // size: that.data.size,
          size: 5,
          start: that.data.attentionStart
        },
        success (res) {
          if (res.data.code !== "200") {
            return
          }
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              var imgHeights = []
              for (var i = 0; i < item.postPicture.length; i++) {
                imgHeights.push(item.postPicture[i].height/item.postPicture[i].width)
              }
              var maxHeight = Math.max.apply(null, imgHeights) * 288
              item.maxHeight = maxHeight
              item.replytime = item.time.substring(0, 10),
              // 每个关注贴是否展开，默认为否
              item.isExpand = false
              that.data.attentions.push(item)
            })
            that.setData({
              attentions: that.data.attentions
            })
          }
        }
      })
    }
    if (that.data.segmentActiveKeyTag === 1) {
      wx.request({
        url: 'http://localhost:8888/tbPost/getRecommendList',
        data: {
          size: that.data.size,
          start: that.data.recommendStart
        },
        success (res) {
          if (res.data.code !== "200") {
            return
          }
          for (var i = 0; i < res.data.data.length; i++) {
            if (i % 2 == 0) {
              that.data.recommendLeft.push(res.data.data[i])
            } else {
              that.data.recommendRight.push(res.data.data[i])
            }
          }
          that.data.recommends.push(res.data.data)
          that.setData({
            recommends: res.data.data,
            recommendLeft: that.data.recommendLeft,
            recommendRight: that.data.recommendRight
          })
        }
      })
    }
  },
  // 点击关注和推荐的切换
  changeTabs: function (e) {
    var that = this
    that.setData({
      segmentActiveKeyTag: e.detail.currentIndex
    })
    if (that.data.userInfo !== null && e.detail.currentIndex === 0 && that.data.attentions.length === 0) {
      that.getRecommendList()
    }
  },
  // 点击关注帖子是否展开的状态改变
  changeExpand: function (e) {
    var that = this
    that.data.attentions.forEach((item, index) => {
      if (item.postid === e.currentTarget.dataset.item.postid) {
        item.isExpand = true
      }
    })
    that.setData({
      attentions: that.data.attentions
    })
  },
  // 未登录时跳转到个人中心界面去登录
  loginToJump: function () {
    wx.switchTab({
      url: '../personal/personal',
    })
  },
  onLoad() {
    // 不在这里做列表的刷新，因为只要这个页面建好之后就不会触发onLoad事件
    this.getRecommendList()
  },
  onShow() {
    var that = this
    that.setData({
      recommends: [],
      recommendLeft: [],
      recommendRight: [],
      recommendStart: 0
    })
    this.getRecommendList()
    let beforeTabBar = {
      index: 0,
      pagePath: "pages/index/index",
      text: "首页"
    }
    wx.setStorageSync('beforeTabBar', beforeTabBar)
    // 用app.globalData.userInfo会出现每一次编译都是未登录的状态
    // 好坏参半吧，还是可以借鉴一些其他小程序是否有保存，还是可以存一个在Storage
    app.onGetUserInfo()
    that.setData({
      userInfo: app.globalData.userInfo
    })
    // let isUserInfo = wx.getStorageSync('userInfo')

    // if (isUserInfo === null || isUserInfo === "") {
    //   that.setData({
    //     userInfo: null
    //   }) 
    // } else {
    //   that.setData({
    //     userInfo: isUserInfo
    //   })
    // }
  },
  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
  },
  // 这里做触底监听，触底之后再搜索然后加入数据，并不是删除而是加入，先用push将数据push进去再改动值
  onReachBottom() {
    var that = this
    if (that.data.segmentActiveKeyTag === 0) {
      that.data.attentionStart += 1
    }
    if (that.data.segmentActiveKeyTag === 1) {
      that.data.recommendStart += 1
    }
    that.getRecommendList()
  }
})
