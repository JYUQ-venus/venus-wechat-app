// pages/competition/editname/editname.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubId:"",
    valuename:""
  },
  editname:function(e){
    this.setData({
      valuename: e.detail.value
    })
  },
  
  //保存
  bindsave:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/updateClubDetails',
      data: {
        id:that.data.clubId,
        name: that.data.valuename
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        wx.navigateBack(1)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.clubId
    var name=options.teamname
    this.setData({
      valuename: name,
      clubId:id
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