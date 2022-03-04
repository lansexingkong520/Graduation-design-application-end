// pages/map/map.js
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'ZPOBZ-D6I36-3SNST-MFNE5-4O5L5-COBMX' // 必填
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: null,
    latitude: null,
    address: null,
    speed: null,
    accuracy: null,
    // 地图的比例
    scale: 18,
    markers: [],
    // 这个存放具体的标记
    specificMark: null,
    // 搜索地点的参数
    searchPlace: null
  },
  // 监听tabBar事件
  onTabItemTap: function (item) {
    wx.setStorageSync('beforeTabBar', item)
  },
  // 获取用户地址周围餐饮
  getFood: function (longitude, latitude) {
    var that = this
    // 调用地点搜索的接口
    qqmapsdk.search({
      keyword:'美食',
      location:{
        longitude: longitude,
        latitude: latitude
      },
      // 搜索结果每页条目数
      page_size: 13,
      success: function(res) {
        console.log(res)
        res.data.forEach((item, index) => {
          item.id = index,
          item.longitude = item.location.lng,
          item.latitude = item.location.lat,
          item.iconPath = '/image/foodMarker.png',
          item.width = 30,
          item.height = 30
        })
        that.setData({
          markers:res.data,
          specificMark: null
        })
        console.log(that.data.markers)
      }
    })
  },
  // 因为开发者工具缩放不会变化，而新添的get。
  getFoodScale: function (northeast, southwest) {
    var that = this
    // 调用地点搜索的接口
    qqmapsdk.search({
      keyword:'美食',
      rectangle: southwest.latitude + ',' + southwest.longitude + ',' + northeast.latitude + ',' + northeast.longitude,
      // 搜索结果每页条目数
      page_size: 13,
      success: function(res) {
        res.data.forEach((item, index) => {
          item.id = index,
          item.longitude = item.location.lng,
          item.latitude = item.location.lat,
          item.iconPath = '/image/foodMarker.png',
          item.width = 30,
          item.height = 30
        })
        that.setData({
          markers:res.data,
          specificMark: null
        })
      }
    })
  },
  // 点击标记点时时触发
  getMarkerInfo: function(e) {
    var that = this
    var sm = that.data.markers[e.markerId]
    // 用_distance还是不对，因为随着中心点的变化，这个距离就会出现问题
    // sm['distance'] = Math.round(sm._distance)
    // 这里做一个距离计算
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //起点坐标 from参数不填默认当前地址，但是这里需要传入坐标，不然会频繁调用getLocation而报错
      from:{
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      //终点坐标
      to: [{
        location:sm.location
      }], 
      success: function(res) {//成功后的回调
        var res = res.result
        var distance = res.elements[0].distance
        if (distance <= 1000) {
          sm['distance'] = distance + '米'
        } else {
          sm['distance'] = (distance / 1000).toFixed(1) + '公里'
        }
        // sm['distance'] = distance
        that.setData({ 
          specificMark: sm
        });
      }
    });
  },
  // 点击"到这儿去"获取路线(跳转插件)
  getRoute: function () {
    var that = this
    console.log(that.data.specificMark.title)
    let plugin = requirePlugin('routePlan');
    let key = 'ZPOBZ-D6I36-3SNST-MFNE5-4O5L5-COBMX';  //使用在腾讯位置服务申请的key
    let referer = '美食美刻-用户端';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': that.data.specificMark.title,
      'latitude': that.data.specificMark.latitude,
      'longitude': that.data.specificMark.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  // 当地图进行移动的时候, 因为开发者工具不比真机，当地图缩放的时候开发者工具此方法不会触发
  // 因为还没打算上传进行真机，所以就先改变条件进行判断
  // 在缩放之后还需要进行小小的拖拽，因为此方法在开发者工具上根本不会触发
  regionchange : function (e) {
    var that = this
    if(e.type === 'end' && e.causedBy === "drag" && e.detail.scale === that.data.scale){
      that.mapCtx.getCenterLocation({
        success:res=>{
          that.getFood(res.longitude,res.latitude)
        }
      })
    } else if (e.type === 'end' && e.causedBy === "drag" && e.detail.scale < 18 && e.detail.scale >= 10){
      that.getFoodScale(e.detail.region.northeast, e.detail.region.southwest)
    }
    //  else if (e.type === 'end' && e.causedBy === "scale" ){
    //   console.log(123456789)
    // }
  },
  // 点击搜索，搜索某个地点的附近
  getSearchPlace: function () {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  // 搜索取消
  searchCancel: function () {
    var that = this
    that.setData({
      searchPlace: null
    })
  },
  //点击回到用户初始位置
  returnOriginalLocation (e){
    var that = this
    that.mapCtx.moveToLocation()
    that.getFood(that.data.longitude, that.data.latitude)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.mapCtx = wx.createMapContext('myMap')
    // 直接获取地址
    // var that = this
    // qqmapsdk.reverseGeocoder({
    //   success: function (res) {
    //     //获取当前地址成功
    //     console.log(res);
    //     that.setData({
    //       latitude: res.result.location.lat,
    //       longitude: res.result.location.lng,
    //       address: res.result.address
    //     })
    //   },
    //   fail: function (res) {
    //     console.log('获取当前地址失败');
    //   }
    // })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({//赋值
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy,
        })
        that.getFood(longitude, latitude)
      }, 
      //定位失败回调      
      fail: function() {
        console.log("getLocationFail")
      }
    })
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
    // 先做有没有的判断，有就写上，没有就过
    // wx.setStorageSync('addLocation', this.data.suggestion[id])
    var that = this
    var location = wx.getStorageSync('addLocation')
    if (location !== null && location !== "") {
      that.setData({
        searchPlace: location
      })
      // that.mapCtx.moveToLocation()
      console.log(location)
      var centerLocation = {
        longitude: location.longitude,
        latitude: location.latitude
      }
      that.mapCtx.moveToLocation(centerLocation)
      that.getFood(location.longitude, location.latitude)
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