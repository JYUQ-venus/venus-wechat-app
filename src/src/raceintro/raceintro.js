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
    const {options} = this.data
    wx.navigateTo({
      url: `/src/submitsigninfor/submitsigninfor?clubId=${options.clubid}&&eventId=${options.raceid}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      options: options
    })
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxEvent/queryEvent',
      data: {
        eventId: options.raceid,
        clubId: options.clubid
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
