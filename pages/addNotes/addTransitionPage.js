// pages/addNotes/addTransitionPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 这是未登录跳转的标记
    notLoginNum: 0,
    // 这是发布跳转的标记
    addNum: 0,
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
    let isUserInfo = wx.getStorageSync('userInfo')
    if (isUserInfo !== null && isUserInfo !== "") {
      // 这一块做已登录的发布跳转
      let isReleaseToJump = wx.getStorageSync('releaseToJump')
      if (isReleaseToJump.text === "已发布") {
        that.data.addNum = isReleaseToJump.num + 1
      }
      that.data.addNum++;
      if (that.data.addNum % 2 == 0) {
        let tabBarItem = wx.getStorageSync('beforeTabBar')
        let tabBarItemURL = tabBarItem.pagePath
        let jumpItem = {
          num: that.data.addNum,
          text: "返回"
        }
        wx.setStorageSync('releaseToJump', jumpItem)
        wx.switchTab({
            url: '../../' + tabBarItemURL
        });
      } else {
        let jumpItem = {
          num: that.data.addNum,
          text: "发布页面"
        }
        wx.setStorageSync('releaseToJump', jumpItem)
        wx.navigateTo({
          url: '../addNotes/addNotes'
        })
      }
    } else {
      // 这一块做未登录的登录跳转
      let isLoginToJump = wx.getStorageSync('loginToJump')
      if (isLoginToJump.text === "登录页面") {
        that.data.notLoginNum = isLoginToJump.num + 1
      }
      that.data.notLoginNum++;
      if (that.data.notLoginNum % 2 == 0) {
        let tabBarItem = wx.getStorageSync('beforeTabBar')
        let tabBarItemURL = tabBarItem.pagePath
        let jumpItem = {
          num: that.data.notLoginNum,
          text: "返回"
        }
        wx.setStorageSync('loginToJump', jumpItem)
        wx.switchTab({
            url: '../../' + tabBarItemURL
        });
      } else {
        let jumpItem = {
          num: that.data.notLoginNum,
          text: "登录提示"
        }
        wx.setStorageSync('loginToJump', jumpItem)
        wx.navigateTo({
          url: '../loginRemind/loginRemind'
        })
      }
    }
    
    // let isLoginToJump = wx.getStorageSync('loginToJump')
    // if (isLoginToJump === null || isLoginToJump === "") {
    // } else {
    //   console.log("判断进入了这里")
    //   let isUserInfo = wx.getStorageSync('userInfo')
    //   console.log(isUserInfo)
    //   console.log(typeof(isUserInfo))
    //   if (isUserInfo !== null && isUserInfo !== "") {
    //     wx.navigateTo({
    //       url: './addNotes'
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: '../loginRemind/loginRemind'
    //     })
    //   }
    //   return
    // }
    // this.data.num++;
    // if (this.data.num % 2 == 0) {
    //   console.log(wx.getStorageSync('beforeTabBar'))
    //   let tabBarItem = wx.getStorageSync('beforeTabBar')
    //   let tabBarItemURL = tabBarItem.pagePath
    //   console.log(tabBarItemURL)
    //   wx.switchTab({
    //       url: '../../' + tabBarItemURL
    //   });
    // } else {
    //   let isUserInfo = wx.getStorageSync('userInfo')
    //   console.log(isUserInfo)
    //   console.log(typeof(isUserInfo))
    //   if (isUserInfo !== null && isUserInfo !== "") {
    //     wx.navigateTo({
    //       url: './addNotes'
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: '../loginRemind/loginRemind'
    //     })
    //   }
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