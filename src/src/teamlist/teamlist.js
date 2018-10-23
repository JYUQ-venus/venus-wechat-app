// pages/competition/teamlist/teamlist.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityindex:"",
    city: [],
    searchvalue:"",
    teamlistArray:[],
    reviewStatus:0,
    createstatu:0
  },
  changeSearchval:function(ev){
    this.setData({
      searchvalue: ev.detail.value
    })
  },
  //选择城市
  bindPickercity: function (e) {
    var that = this;
    var team = that.data.teamlistArray
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      cityindex: e.detail.value
    })
    console.log(that.data.city[e.detail.value])
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/queryClub',
      data: {
        city: that.data.city[e.detail.value],
        thirdSession: wx.getStorageSync('thirdSession'),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()        
        that.setData({
          teamlistArray: res.data.clubList,
        })
      }
    })
  },
  //点击搜索
  searchtap:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that =this
    var searchvalue = that.data.searchvalue
    console.log(searchvalue)
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/queryClub',
      data: {
        name: searchvalue,
        thirdSession: wx.getStorageSync('thirdSession')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()       
        console.log('返回-------------')
        console.log(res)
        console.log(res.data.clubList) 
        that.setData({
          teamlistArray : res.data.clubList
        })
      }
    })
  },
  //创建球队
  bindcreateam:function(){
    if (this.data.reviewStatus == 1){
      wx.showToast({
        title: '您已经创建球队',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    if (this.data.createstatu == 1){
      wx.showToast({
        title: '您已申请球队',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: '../createam/createam',
    })
  },
  //点击申请
  apply:function(e){
    let statu = e.currentTarget.dataset.statu;
    console.log(statu)
    if (statu != 0 || this.data.reviewStatus == 1) {
      return
    }
    var that =this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/applyJoinClub',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        clubId: e.currentTarget.dataset.id,
        auditJoin:1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if(res.data.state==true){
          var arr = that.data.teamlistArray;
          console.log(arr)
          var index = e.target.dataset.index;
          if (arr[index].auditJoin == 0) {
            arr[index].auditJoin = 1
            that.data.createstatu = 1
          }
          that.setData({
            teamlistArray: arr
          })
        }
      }
    })
  },

  gototeamdetail:function(e){
    var teamid = e.currentTarget.dataset.id
    var auditJoin = e.currentTarget.dataset.statu
    var eventId = e.currentTarget.dataset.event
    wx.navigateTo({
      url: '../nojointeamdetail/nojointeamdetail?id=' + teamid + '&auditJoin=' + auditJoin + '&&eventId=' + eventId + '',
      // url: '../Z_index/Z_index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    var people={
      thirdSession: wx.getStorageSync('thirdSession')
    }
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/registerUser',
      data: {
        user: JSON.stringify(people),
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.refuseReason != "" && res.data.refuseReason!=undefined && wx.getStorageSync('first')!=1){
          wx.showModal({
            title: '提示',
            content: "您创建的球队未通过审核,原因为:" + res.data.refuseReason,
            success: function (res) {
              wx.setStorageSync('first', 1)
            }
          })
        }
        that.setData({
          teamlistArray: res.data.clubList,
          reviewStatus: res.data.reviewStatus
        })
        var cityarr = []
        if (res.data.clubList != null){
          cityarr.push("全部")
          for (var i = 0; i < res.data.clubList.length; i++) {
            cityarr.push(res.data.clubList[i].city)
            that.setData({
              city: Array.from(new Set(cityarr))
            });
          }
        }
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.reLaunch({
    //   url: '../Z_index/Z_index'
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../Z_index/Z_index'
    // })
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