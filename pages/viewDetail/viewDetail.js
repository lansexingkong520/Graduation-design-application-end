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
    // 帖子评论起始搜索
    commentStart: 0,
    // 评论一次搜索数量
    size: 10,
    // 回复分页查询，这里用数组对象。
    replyArrays: [],
    // 每个帖子图片滑块取最大的高
    maxImgHeight: 0,
    // 图片地址
    imgUrls: [],
    // 图片滑块动画切换时间
    duration: 500,
    // 用户输入的评论
    inputComment: null,
    // input输入框变换焦点：
    replyFoucs: false,
    // 输入框占位符
    placeholder: '说点什么吧',
    // 用户回复类型，回复评论1，和回复评论的回复2
    commentType: 0,
    // 暂存回复主体信息
    commentItem: {},
    // 评论实体列表
    commentBeanList: []
  },

  // 进入页面获取评论
  getCommentList: function () {
    var that = this
    wx.request({
      url: 'http://localhost:8888/tbComment/getCommentList',
      data: {
        postId: that.data.postBean.postid,
        size: that.data.size,
        start: that.data.commentStart
      },
      success: function (res) {
        if (res.data.code !== "200") {
          return
        }
        res.data.data.forEach(item => {
          that.data.commentBeanList.push(item)
        })
        that.setData({
          commentBeanList: that.data.commentBeanList
        })
        console.log(that.data.commentBeanList)
      }
    })
  },
  // 查询更多回复
  queryMoreReply: function (e) {
    var that = this
    // 写评论回复分页时用到的属性
    var paging = {
      cid: e.currentTarget.dataset.item.cid,
      start: 1,
      size: 5
    }
    var confirmCid = that.data.replyArrays.some(item => item.cid === e.currentTarget.dataset.item.cid)
    if (confirmCid) {
      that.data.replyArrays.forEach((item, indexs) => {
        if(item.cid === e.currentTarget.dataset.item.cid){
          item.start += 1
          paging.start = item.start
        } 
      })
    } else {
      that.data.replyArrays.push(paging)
    }
    that.setData({
      replyArrays: that.data.replyArrays
    })
    wx.request({
      url: 'http://localhost:8888/tbCommentreply/getCommentreplyList',
      data: paging,
      success: function (res) {
        if (res.data.code !== "200") {
          return
        }
        that.data.commentBeanList.forEach(item => {
          if (item.cid === paging.cid) {
            res.data.data.forEach(items => {
              item.commentReplyBeanList.push(items)
            })
            item.replyCount = item.replyCount - res.data.data.length
          }
        })
        that.setData({
          commentBeanList: that.data.commentBeanList
        })
        console.log(that.data.commentBeanList)
      }
    })
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
  // 获取用户输入的评论内容
  getInputComment: function (e) {
    var that = this
    that.setData({
      inputComment: e.detail.value
    })
  },
  // 回车键发送评论(因为真机测试不了，不能弹出虚拟键盘，所以就用input自带的方法去发送评论)
  // 后面进行修改，改成点击"发送"键, 还是改回来吧
  sendComment: function () {
    var that = this
    var cuid = wx.getStorageSync('userInfo').uid
    if (that.data.replyFoucs === false) {
      // 这里是发表评论
      wx.request({
        url: 'http://localhost:8888/tbComment/addComment',
        data: {
          message: that.data.inputComment,
          cuid: cuid,
          cpostid: that.data.postBean.postid
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code !== "200") {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
            return
          }
          // 新的评论插入在最前面
          that.data.commentBeanList.unshift(res.data.data)
          that.setData({
            commentBeanList: that.data.commentBeanList,
            inputComment: ''
          })
          that.replyOutofFocus()
        }
      })
    } else {
      // 这里是发表回复
      // 在这里需要进行区分是回复的评论还是回复的回复，因为这两者取的参数可能不太相同
      // 不同的话就分情况设置data，把data抽离
      var data = {}
      if (that.data.commentType === 1) {
        var commentrelation = {
          commentid: that.data.commentItem.cid,
          responsetype: that.data.commentType,
          answerid: that.data.commentItem.cid
        }
        data = {
          content: that.data.inputComment,
          ccrid: that.data.commentItem.cid,
          ccruid: that.data.commentItem.cuid,
          cruid: cuid,
          commentrelation: commentrelation
        }
      } else if (that.data.commentType === 2) {
        var commentrelation = {
          commentid: that.data.commentItem.commentrelation.commentid,
          responsetype: that.data.commentType,
          answerid: that.data.commentItem.crid
        }
        data = {
          content: that.data.inputComment,
          ccrid: that.data.commentItem.crid,
          ccruid: that.data.commentItem.cruid,
          cruid: cuid,
          commentrelation: commentrelation
        }
      }
      wx.request({
        url: 'http://localhost:8888/tbCommentreply/addCommentReply',
        data: data,
        method: 'POST',
        success: function (res) {
          if (res.data.code !== "200") {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
            return
          }
          // 新的回复插入在最前面，先找到对应的评论，再插入回复
          // 暂存回复的列表
          var ccrBeanList = []
          that.data.commentBeanList.forEach(item => {
            if (item.cid === res.data.data.commentrelation.commentid && res.data.data.commentrelation.responsetype === 1) {
              if (item.commentReplyBeanList === undefined || item.commentReplyBeanList === null) {
                ccrBeanList.push(res.data.data)
                item.commentReplyBeanList = ccrBeanList
              } else {
                ccrBeanList = item.commentReplyBeanList
                ccrBeanList.unshift(res.data.data)
                item.commentReplyBeanList = ccrBeanList
              }
            } else if(item.cid === res.data.data.commentrelation.commentid && res.data.data.commentrelation.responsetype === 2) {
              // item.commentReplyBeanList.forEach((itemS, index) => {
              //   if (itemS.crid === res.data.data.commentrelation.answerid) {
              //     item.commentReplyBeanList.splice(index+1, 0 , res.data.data)
              //   }
              // })
              // 看小红书平时的评论都是加在评论数组最后的，所以还是可以直接用push
              item.commentReplyBeanList.push(res.data.data)
            }
          })
          // that.data.commentBeanList.unshift(res.data.data)
          that.setData({
            commentBeanList: that.data.commentBeanList,
            inputComment: ''
          })
          that.replyOutofFocus()
        }
      })
    }
  },
  // 回复评论，变换回复条件评论框获得焦点，看看如果input框失去焦点，就变成评论文章
  changeReply: function (e) {
    var that = this
    var type = 0
    if (e.currentTarget.dataset.item.cpostid !== undefined) {
      type = 1
    } else if (e.currentTarget.dataset.item.crid !== undefined) {
      type = 2
    }
    that.setData({
      commentItem: e.currentTarget.dataset.item,
      replyFoucs: true,
      placeholder: '回复 ' + e.currentTarget.dataset.item.tbUser.username,
      commentType: type
    })
  },
  // 评论框失焦，一切复原(回复的评论发送后也要调用此方法进行失焦和清空),如果自动触发则不用管
  replyOutofFocus: function () {
    var that = this
    that.setData({
      replyFoucs: false,
      placeholder: '说点什么吧',
      inputComment: ''
    })
  },
  // 点击评论图标，页面滚动到评论那里
  scrollToComment: function () {
    var that= this;
    var query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    query.select("#comments").boundingClientRect();
    query.exec(function (res) {
      var data= res[0].scrollTop + res[1].top - 10;   // 顶部距离该id值得距离
      wx.pageScrollTo({
        scrollTop: data,
        duration: 300,
      });
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
    // 进入页面调用查看评论方法
    this.getCommentList()
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
    that.data.commentStart += 1
    that.getCommentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})