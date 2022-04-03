// pages/viewDetail/viewDetail.js
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 屏幕宽度
    screenWidth: 0,
    // 用户信息（存在即为登录）
    userInfo: null,
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
    commentBeanList: [],
    // 是否关注帖子用户或者发帖者是本人,0未关注，1已关注，2本人
    followedOrSelf: null,
    // 用户是否收藏此帖子
    isCollect: null,
    // 其他操作是否弹出
    isPopup: false,
    // 删除帖子确认
    confirmDelete: false
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
    if (that.data.userInfo === null) {
      wx.showToast({
        title: '请您先登录，再进行评论，谢谢！',
        icon: 'none',
        duration: 3000
      })
      return
    }
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
  // 评论删除，先确认是否删除
  CommentDelete: function (e) {
    var that = this
    console.log(e)
    that.hideOtherOperation()
    wx.showModal({
      title: "提示",
      content: "是否删除此评论",
      success: function (res) {
        if (res.confirm) {
          // 判断是评论还是回复, 评论有个标志distinguish为0
          if (e.currentTarget.dataset.item.distinguish === 0) {
            wx.request({
              url: 'http://localhost:8888/tbComment/deleteComment/' + e.currentTarget.dataset.item.cid,
              method: 'Delete',
              success: function (res) {
                wx.showToast({
                  title: '评论已删除',
                  duration: 3000
                })
                that.setData({
                  commentBeanList: []
                })
                that.getCommentList()
              },
              fail: function (res) {
                wx.showToast({
                  title: '评论删除失败',
                })
              }
            })
          }else {
            wx.request({
              url: 'http://localhost:8888/tbCommentreply/deleteReply/' + e.currentTarget.dataset.item.crid,
              method: 'Delete',
              success: function (res) {
                wx.showToast({
                  title: '评论已删除',
                  duration: 3000
                })
                that.setData({
                  commentBeanList: []
                })
                that.getCommentList()
              },
              fail: function (res) {
                wx.showToast({
                  title: '评论删除失败',
                })
              }
            })
          }
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
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
  // 查看用户是否关注帖子发布者
  seeUserIsFollowPublisher: function () {
    var that = this
    if (that.data.postBean.puid === app.globalData.userInfo.uid) {
      that.setData({
        followedOrSelf: 2
      })
    } else {
      wx.request({
        url: 'http://localhost:8888/userAttention/seeUserIsFollowPublisher',
        data: {
          userId: app.globalData.userInfo.uid,
          attentionId: that.data.postBean.puid
        },
        success: function (res) {
          if (res.data.code !== "200") {
            return
          }
          if (res.data.data === false) {
            that.setData({
              followedOrSelf: 0
            })
          } else {
            that.setData({
              followedOrSelf: 1
            })
          }
        } 
      })
    }
  },
  // 切换关注状态
  switchAttentionState: function (e) {
    var that = this
    if (that.data.userInfo === null) {
      wx.showToast({
        title: '请您先登录，再进行用户关注，谢谢！',
        icon: 'none',
        duration: 3000
      })
      return
    }
    // 直接将获取到的e.currentTarget.dataset.item传给后端来做
    wx.request({
      url: 'http://localhost:8888/userAttention/switchAttentionState',
      data: {
        switchFollow: e.currentTarget.dataset.item,
        userId: app.globalData.userInfo.uid,
        attentionId: that.data.postBean.puid
      },
      success: function (res) {
        that.setData({
          followedOrSelf: res.data.data
        })
      }
    })
  },
  // 如果是用户是帖子发布者就进行其他操作
  // 获取其他操作菜单
  getOtherOperations: function () {
    this.setData({
      isPopup: true
    })
  },
  // 隐藏操作菜单
  hideOtherOperation: function () {
    this.setData({
      isPopup: false
    })
  },
  // 跳转到编辑帖子页面
  postEdit: function () {
    var itemBean = JSON.stringify(this.data.postBean)
    this.hideOtherOperation()
    wx.navigateTo({
      url: '../editPost/editPost?itemBean=' + itemBean,
    })
  },
  // 帖子删除
  postDelete: function () {
    var that = this
    that.hideOtherOperation()
    that.setData({
      confirmDelete: true
    })
  },
  // 点击删除按钮 
  onConfirm: function () {
    var that = this
    // 原来这里先进行了返回操作
    wx.navigateBack({
      delta: 0,
    })
    wx.request({
      url: 'http://localhost:8888/tbPost/deletePost/' + that.data.postBean.postid,
      method: 'Delete',
      success: function (res) {
      }
    })
  },
  // 点击取消按钮
  onCancel: function () {
    this.hideDialog()
  },
  hideDialog: function () {
    this.setData({
      confirmDelete: false,
    })
  },
  // 进入页面调用查看用户是否收藏此帖子
  seeUserFavoritesPost: function () {
    var that = this
    wx.request({
      url: 'http://localhost:8888/postCollection/seeUserFavoritesPost',
      data: {
        collectorid: app.globalData.userInfo.uid,
        favoritesid: that.data.postBean.postid
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code !== "200") {
          return
        }
        that.setData({
          isCollect: res.data.data
        })
      
      } 
    })
  },
  // 切换收藏帖子状态
  switchCollectState: function (e) {
    var that = this
    if (that.data.userInfo === null) {
      wx.showToast({
        title: '请您先登录，再进行帖子收藏，谢谢！',
        icon: 'none',
        duration: 3000
      })
      return
    }
    // 直接将获取到的e.currentTarget.dataset.item传给后端来做
    wx.request({
      url: 'http://localhost:8888/postCollection/switchCollectState',
      data: {
        isCollect: e.currentTarget.dataset.item,
        collectorid: app.globalData.userInfo.uid,
        favoritesid: that.data.postBean.puid
      },
      success: function (res) {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          isCollect: res.data.data
        })
      }
    })
  },
  // 初始化时单独提出来的方法
  init: function (itemBean) {
    var that=this
    var windowWidth = wx.getSystemInfoSync().windowWidth
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
  },
  /**
   * 生命周期函数--监听页面加载
   * 在这里要注意，如果是wx.navigateBack，不会进入onLoad，只能在onShow里面去弄
   */
  onLoad: function (options) {
    var that=this
    let itemBean = JSON.parse(options.itemBean)
    that.init(itemBean)
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
    let editPost = wx.getStorageSync('editPost')
    if (editPost !== "" && editPost.isEdit === 'yes') {
      let itemBean = editPost.itemBean
      wx.removeStorageSync('editPost')
      that.init(itemBean)
    }
    // 用户登录的情况下才看是否关注
    app.onGetUserInfo()
    that.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo !== null) {
      // 进入页面调用查看用户是否关注帖子发布者
      this.seeUserIsFollowPublisher()
      // 进入页面调用查看用户是否收藏此帖子
      this.seeUserFavoritesPost()
    } else {
      that.setData({
        followedOrSelf: 0,
        isCollect: false
      })
    }
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