// pages/addNotes/addNotes.js
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 笔记图片
    imgs: [],
    // 图片上传后得到的图片id
    imgsID: [],
    // 图片的宽度对应加进去
    imgWidth: [],
    //  图片的高度对应加进去
    imgHeight: [],
    // 图片数量
    count: 0,
    // 图片最大数量
    maxCount: 9,
    // 笔记标题
    title: "",
    // 笔记内容
    content: "",
    // 笔记话题
    topic: null,
    // 笔记附加地点名字
    place: null,
    // 笔记附加地点地址
    address: null,
    // 地点的纬度
    latitude: null,
    // 地点的经度
    longitude: null
  },
  // 上传图片
  // 这是本地选中图片
  bindUpload: function (e) {
    this.data.count = this.data.maxCount - this.data.imgs.length
    var that = this
    // wx.chooseImage 已经不更新了，用chooseMedia可以选择图片或者视频
    // 在初期先用着chooseImage，chooseMedia可以等后期升级的时候使用
    wx.chooseImage({
      count: that.data.count,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success(res) {
        var successUp = 0; //成功
        var failUp = 0; //失败
        var length = res.tempFilePaths.length; //总数
        var count = 0; //第几张
        that.uploadOneByOne(res.tempFilePaths,successUp,failUp,count,length);
      }
    })
  },
  // 将本地选中的图片上传（因为在一般的for循环中可能会漏图片，就用递归的方式来处理）
  uploadOneByOne: function (imgPaths,successUp, failUp, count, length) {
    var that = this
    wx.uploadFile({
      url: 'http://localhost:8888/upfile',
      filePath: imgPaths[count],
      // 之前一直上传文件为空，是因为这个name没有与后端的方法接收的参数名字一致，这里在之后需要十分注意
      name: 'file',
      success:function (res) {
        successUp++;
        // 这里的图片直接用本地，因为上传后端之后资源的加载也需要时间，而这个时间大于渲染响应的时间
        // 如果用数据库保存的地址，会导致这时的图片加载出现问题（404）
        that.data.imgs.push(imgPaths[count])
        that.data.imgsID.push(JSON.parse(res.data).data.picid)
        that.setData({
          imgs: that.data.imgs,
          imgsID: that.data.imgsID
        })
      },
      fail:function(res){
        failUp++;
      },
      complete:function(res){
        count++;//下一张
        if(count !== length){
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
        }
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index
          that.data.imgs.splice(index, 1)
          that.data.imgsID.splice(index, 1)
          that.setData({
            imgs: that.data.imgs,
            imgsID: that.data.imgsID,
            imgWidth: [],
            imgHeight: []
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },
  // 在这里获取图片的高度和宽度并存入数据库（帖子查看需要）
  imageLoad: function (e) {
    var that = this
    that.data.imgWidth.push(e.detail.width)
    that.data.imgHeight.push(e.detail.height)
    that.setData({
      imgWidth: that.data.imgWidth,
      imgHeight: that.data.imgHeight
    })
  },
  // 获取笔记标题
  bindKeyInputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  // 获取笔记内容
  bindKeyInputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 笔记添加地点
  onAddAddress: function () {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  // 笔记取消地点
  deletePlace: function () {
    var that = this
    that.setData({
      place: '',
      address: '',
      latitude: null,
      longitude: null
    })
    // wx.removeStorageSync('addLocation')
  },
  // 取消发布笔记，撤回
  cancelRelease: function () {
    // 跳转到发布过渡页面，用这个跳回
    wx.navigateBack({
      delta: 1,
    })
  },
  // 发布笔记，发布成功则直接跳到首页，不成功则提醒用户，不跳转
  releaseNotes: function (e) {
    var that = this
    if (that.data.title == "" || that.data.title == null) {
      wx.showToast({
        title: '笔记标题要写哦~',
        icon: 'none',
        mask: true
      })
      return
    }
    if (that.data.content == "" || that.data.content == null) {
      wx.showToast({
        title: '笔记内容要写哦~',
        icon: 'none',
        mask: true
      })
      return
    }
    // let puid = wx.getStorageSync('userInfo').uid
    // 向后台发送添加请求
    wx.request({
      url: 'http://localhost:8888/tbPost/addPost',
      data: {
        title: that.data.title,
        content: that.data.content,
        topic: that.data.topic,
        place: that.data.place,
        address: that.data.address,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        puid: app.globalData.userInfo.uid,
        pics: that.data.imgsID,
        width: that.data.imgWidth,
        height: that.data.imgHeight
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        } else {
          console.log(res)
          // 这里的处理是为了之前的发笔记过渡页
          let jumpItem = wx.getStorageSync('releaseToJump')
          let number = jumpItem.num
          jumpItem = {
            num: number,
            text: "已发布"
          }
          wx.setStorageSync('releaseToJump', jumpItem)
          wx.setStorageSync('postChange', 'true')
          // 发布成功跳转首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
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
    // 先做地址有没有的判断，有就写上，没有就过（因为添加地址用的是navigateBack，这个不能带参数）
    // wx.setStorageSync('addLocation', this.data.suggestion[id])
    var that = this
    var location = wx.getStorageSync('addLocation')
    if (location !== null && location !== "") {
      that.setData({
        place: location.title,
        address: location.addr,
        latitude: location.latitude,
        longitude: location.longitude
      })
      // 这里直接进行地点Storage的销毁
      wx.removeStorageSync('addLocation')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})