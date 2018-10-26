// pages/competition/raceintro/raceintro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    raceimg:"",
    raceid:"",
    clubid:""
  },

  // 去填写报名信息
  gosigninfo:function(){
    wx.navigateTo({
      url: '../submitsigninfor/submitsigninfor?clubId=' + this.data.clubid + '&eventId='+this.data.raceid+'',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var raceid = options.raceid
    var clubid = options.clubid
    this.setData({
      raceid: raceid,
      clubid: clubid
    })
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxEvent/queryEvent',
      data: {
        eventId: raceid,
        clubId:clubid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          raceimg: res.data.evnetList[0].introduction
        })
      }
    })
  }
})
