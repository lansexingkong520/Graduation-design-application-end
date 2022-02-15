// pages/userRegister/userRegister.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户名
    userName: null,
    // 密码
    password: null,
    // 确认密码
    confirmPW: null,
    // 手机号
    tel: null,
    // 验证码
    code: null,
    // 校验规则
    userNRule: [{
      required: true
    }],
    PWRule: [{
      required: true
    }],
    CPWRule: [{
      required: true
    }],
    telRule:[{
      required: true
    },{
      min: 11,
      max: 11,
      message: '长度需要为11个数字'
    }],
    codeRule: [{
      required: true
    }]
  },

  // 用户注册
  onClickRegister: function () {
    // 这里直接将this进行保存，因为不确定之后this是否会被改变
    var that = this;
    // 防止用户信息填写出现空缺，或者是空串
    if (that.data.userName === null || that.data.password === null || that.data.confirmPW === null || that.data.tel === null || that.data.code === null || that.data.userName === "" || that.data.password === "" || that.data.confirmPW === "" || that.data.tel === "" || that.data.code === "") {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        mask: true
      })
      return
    }
    // 向后台发送注册请求 现在的请求要开始带上获取到的cookie了
    wx.request({
      url: 'http://localhost:8888/tbUser/userRegister',
      data: {
        username: that.data.userName,
        password: that.data.password,
        tel: that.data.tel,
        captcha: that.data.code
      },
      header: app.globalData.header,
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "success"
          }).then(
            // 跳转到用户登录页面，因为在注册页面，可以此方法返回
            wx.navigateBack({
              delta: 1,
            })
          )
        }
      }
    })
  },
  // 发送请求，获取验证码（要先验证是否有手机号才能进行验证码的发送）
  onClickCode: function () {
    // 这里直接将this进行保存，因为后面的第二次请求this就没了，所以可以先保存
    var that = this;
    if (this.data.tel === null) {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'error',
        duration: 2000,
        mask: true
      })
      return
    }
    // 向后台发送请求，验证手机号是否已注册，已注册的手机号就不能用
    // 后台的接收不是对象，所以header要修改
    wx.request({
      url: 'http://localhost:8888/tbUser/validTel',
      header: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      data: {
        tel: this.data.tel
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code === "200") {
          wx.request({
            url: 'http://localhost:8888/tbUser/sendCaptcha',
            header: {
              "Content-Type":"application/x-www-form-urlencoded"
            },
            data: {
              // 这里的值用that.data.tel，因为this第二次请求就没用了
              tel: that.data.tel,
              role: "register"
            },
            method: 'POST',
            success: function (res) {
              if (res.data.code === "200") {
                app.globalData.header.Cookie = 'JSESSIONID=' + res.data.data.sessionid;
              }
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      },
    })
  },
  // 获取用户名，并检测用户名是否已注册
  changeUName: function (event) {
    this.setData({
      userName: event.detail.value
    })
    if (this.data.userName === "") {
      wx.showToast({
        title: '用户名不可为空',
        icon: "none"
      })
      return
    }
    if (this.data.userName !== "") {
      wx.request({
        url: 'http://localhost:8888/tbUser/validUN',
        data: {
          username: this.data.userName
        },
        success: function (res) {
          console.log(res)
          if (res.data.code !== "200") {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              mask: true
            })
          }
        }
      })
    }
  },
  // 获取密码
  changePW: function (event) {
    this.setData({
      password: event.detail.value
    })
  },
  // 获取确认密码并判断
  changeCPW: function (event) {
    this.setData({
      confirmPW: event.detail.value
    })
    if (this.data.password !== this.data.confirmPW) {
      wx.showToast({
        title: '确认密码不一致',
        icon: 'error',
        duration: 2000,
        mask: true
      })
    }
  },
  // 获取手机号
  changeTel: function (event) {
    this.setData({
      tel: event.detail.value
    })
  },
  // 获取用户输入的验证码
  changeCode: function (event) {
    this.setData({
      code: event.detail.value
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