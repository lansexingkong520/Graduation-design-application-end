// pages/editInfo/editInfo.js
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isShowModal: false,
    isShowSexModal: false,
    // 修改的是用户名
    isEditName: false,
    name: "",
    // 修改的是个人简介
    isEditIntroduction: false,
    introduction: ""
  },

  // 点击头像进行修改
  headImgChange: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success(res) {
        that.uploadOneByOne(res.tempFilePaths);
      }
    })
  },
  // 将本地选中的图片上传
  uploadOneByOne: function (imgPaths) {
    var that = this
    wx.uploadFile({
      url: 'http://localhost:8888/upHeadFile',
      filePath: imgPaths[0],
      // 之前一直上传文件为空，是因为这个name没有与后端的方法接收的参数名字一致，这里在之后需要十分注意
      name: 'file',
      success:function (res) {
        // 如果图片上传成功，就在这里请求修改信息。
        console.log(res)
        console.log(JSON.parse(res.data).data.picid)
        wx.request({
          url: 'http://localhost:8888/tbUser/modifyUserInfo',
          data: {
            uid: that.data.userInfo.uid,
            picuid: JSON.parse(res.data).data.picid,
          },
          method: 'POST',
          success: function (res) {
            if (res.data.code !== "200") {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
              return
            } else {
              wx.setStorageSync('userInfo', res.data.data)
              app.globalData.userInfo = res.data.data
              that.setData({
                userInfo: res.data.data
              })
            }
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title: res.msg,
          icon: 'error',
        })
      }
    })
  },
  // 点击弹出修改用户名的弹窗
  onClickEditName: function () {
    var that = this
    that.setData({
      isShowModal: true,
      isEditName: true,
      name: that.data.userInfo.username
    })
  },
  nameChange: function (event) {
    this.setData({
      name: event.detail.value
    })
  },
  // 点击弹出修改性别的弹窗
  onClickEditSex: function () {
    this.setData({
      isShowSexModal: true,
    })
  },
  sexChange: function (event) {
    var that = this
    if (event.currentTarget.dataset.item === that.data.userInfo.sex) {
      that.hideDialog()
      return
    }
    let data = {
      uid: that.data.userInfo.uid,
      sex: event.currentTarget.dataset.item,
    }
    wx.request({
      url: 'http://localhost:8888/tbUser/modifyUserInfo',
      data: data,
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
          return
        } else {
          wx.setStorageSync('userInfo', res.data.data)
          app.globalData.userInfo = res.data.data
          that.setData({
            userInfo: res.data.data
          })
          that.hideDialog()
        }
      }
    })
  },
  // 点击弹出修改个人简介的弹窗
  onClickEditIntroduction: function () {
    var that = this
    that.setData({
      isShowModal: true,
      isEditIntroduction: true,
      introduction: that.data.userInfo.selfintroduction
    })
  },
  introductionChange: function (event) {
    this.setData({
      introduction: event.detail.value
    })
  },
  // 点击修改按钮 
  onConfirm: function () {
    var that = this
    let data = {}
    if (that.data.isEditName === true) {
      // 防止用户填写出现空缺
      if (that.data.name === null || that.data.name === "") {
        wx.showToast({
          title: '用户名不能为空',
          icon: 'error',
          mask: true
        })
        return
      }
      data = {
        uid: that.data.userInfo.uid,
        username: that.data.name,
      }
    }
    if (that.data.isEditIntroduction === true) {
      data = {
        uid: that.data.userInfo.uid,
        selfintroduction: that.data.introduction,
      }
    }
    wx.request({
      url: 'http://localhost:8888/tbUser/modifyUserInfo',
      data: data,
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
          return
        } else {
          wx.setStorageSync('userInfo', res.data.data)
          app.globalData.userInfo = res.data.data
          that.setData({
            userInfo: res.data.data
          })
          that.hideDialog()
        }
      }
    })
  },
  // 点击取消按钮
  onCancel: function () {
    this.hideDialog()
  },
  hideDialog: function () {
    this.setData({
      isShowModal: false,
      isShowSexModal: false,
      isEditName: false,
      isEditIntroduction: false
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
    wx.setNavigationBarTitle({
      title: '编辑资料',
    })
    var that= this
    // 获取用户的信息
    app.onGetUserInfo()
    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(that.data.userInfo)
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