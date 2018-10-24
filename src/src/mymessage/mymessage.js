// pages/competition/mymessage/mymessage.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchts:true,
    condition:false,
    infoarr:[],
    clubId:'',
    user_info:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    that.setData({
      clubId: options.clubId
    })
    let parmas = Object.assign({}, {thirdSession : wx.getStorageSync('sessionKey')})
    api.getMessageList({data: parmas}).then(json => {
      let data = json.data
      this.setData({
        infoarr: data.clubMessageList
      }, () => {
        wx.hideLoading()
      })
    })
  },
  //查看信息
  viewdetails:function(e){
    console.log(e.currentTarget.dataset.id)
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/queryRegisterUser',
      data: {
        id: e.currentTarget.dataset.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.userObject)
        that.setData({
          user_info: res.data.userObject,
          switchts : false
        })
      }
    })

  },

  //点击确定
  close:function(){
    this.setData({
      switchts:true
    })
  },
  // 点击同意
  agree:function(e){
    var that = this
    console.log(wx.getStorageSync('thirdSession'))
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/updateClubUserStatus',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        id: e.currentTarget.dataset.id,
        clubId: that.data.clubId,
        auditJoin:2,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        var arr = that.data.infoarr;
        var index = e.target.dataset.index;
        if (arr[index].auditJoin == 1) {
          arr[index].auditJoin = 2
        }
        that.setData({
          infoarr: arr
        })
      }
    })
  },

  ignore:function(e){
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/updateClubUserStatus',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        id: e.currentTarget.dataset.id,
        clubId: that.data.clubId,
        auditJoin:0,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var arr = that.data.infoarr;
        var index = e.target.dataset.index;
        if (arr[index].auditJoin == 1) {
          arr[index].auditJoin = 3
        }
        that.setData({
          infoarr: arr
        })
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
