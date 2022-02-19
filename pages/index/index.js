// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    // "关注、推荐"的切换
    segmentActiveKey: ["one","two"],
    // 切换的标识 "0"为关注 "1"为推荐
    segmentActiveKeyTag: 1,
    // 推荐的帖子，在这个页面可以先将帖子所有信息搜出来，然后点击进去的时候带着跳转
    recommends: [],
    // 推荐帖子起始搜索
    recommendStart: 0,
    // 帖子一次搜索数量，先定10个
    size: 10
    // userInfo: {},
  },
  // // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  // 获取帖子信息
  getRecommendList() {
    var that = this
    // if (that.data.segmentActiveKeyTag === 0) {

    // }
    if (that.data.segmentActiveKeyTag === 1) {
      wx.request({
        url: 'http://localhost:8888/tbPost/getRecommendList',
        data: {
          size: that.data.size,
          start: that.data.recommendStart
        },
        success (res) {
          console.log(res.data)
          that.setData({
            recommends: res.data.data
          })
        }
      })
    }

  },
  onLoad() {
    this.getRecommendList()
  },
  onShow() {
    let beforeTabBar = {
      index: 0,
      pagePath: "pages/index/index",
      text: "首页"
    }
    wx.setStorageSync('beforeTabBar', beforeTabBar)
  },
  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
  }
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res)
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
