// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onGetUserInfo() {
    let uInfo = wx.getStorageSync('userInfo')
    if (uInfo !== "") {
      this.globalData.userInfo = uInfo
    }
  },
  globalData: {
    userInfo: null,
    header: {
      'Cookie': ''
    }
  }
})
