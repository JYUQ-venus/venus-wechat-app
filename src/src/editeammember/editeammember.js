// pages/competition/editeammember/editeammember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    teamPosition: "",
    raceNumber:""
  },
  editposition: function (e) {
    this.setData({
      teamPosition: e.detail.value
    })
  },
  editnumber:function(e){
    this.setData({
      raceNumber: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userId: options.userid,
      raceNumber: options.racenum,
      teamPosition: options.position
    })
  },

  bindsave: function(){
    wx.showLoading({
      title: '保存中',
    })
    var that=this
    if (that.data.teamPosition==""){
      wx.showToast({
        title: '位置不能为空',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    if (that.data.raceNumber == ""){
      wx.showToast({
        title: '背号不能为空',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/updateUser', 
      data: {
        id: that.data.userId,
        teamPosition: that.data.teamPosition,
        raceNumber: that.data.raceNumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.state==true){
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
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