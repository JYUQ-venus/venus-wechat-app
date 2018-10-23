// pages/competition/myteam/myteam.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    selected2: false,
    selected3: false,
    message:0,
    clubfinfo:{},
    memberlistArray: {
      leadername: "",
      leaderhead: "",
      memberdetail: []
    },
    gamedatarry: [],
    gamehonorarry: [],
    signracelist: [],
    userid:"",
    status:""
  },

  //选项卡
  selected: function () {
    this.setData({
      selected: true,
      selected1: false,
      selected2: false,
      selected3: false,
    })
  },
  selected1: function () {
    this.setData({
      selected1: true,
      selected: false,
      selected2: false,
      selected3: false
    })
  },

  selected2: function () {
    this.setData({
      selected2: true,
      selected: false,
      selected1: false,
      selected3: false
    })
  },

  selected3: function () {
    this.setData({
      selected3: true,
      selected: false,
      selected1: false,
      selected2: false
    })
  },
  bindexit:function(){
    var that = this
     wx.request({
       url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/deleteRemovePlayer',
       data: {
         clubId: that.data.clubfinfo.id,
         userId: that.data.userid
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         wx.showToast({
           title: '操作成功',
           icon: 'success',
           duration: 2000
         })
          wx.redirectTo({
            url: '../Z_index/Z_index',
          })
       }
      })
  },
  // 点击报名按钮
  tip: function () {
    wx.showToast({
      title: '您无此权限',
      image: '../../img/warn.png',
      duration: 2000
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log('options.reviewStatus')
    console.log(options.reviewStatus)
    this.setData({
      status: options.reviewStatus
    })
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/queryClubDetailsCaptain',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        reviewStatus:that.data.status
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          clubfinfo: res.data.club,
          messagelist: res.data.clubMessageList,
          gamedatarry: res.data.userListEventData,
          gamehonorarry: res.data.userList,
          signracelist: res.data.eventList,
          userid: res.data.userId
        })
        var group = []
        for (var i = 0; i < res.data.userListEventData.length; i++) {
          if (res.data.userListEventData[i].captain == 1) {
            that.setData({
              "memberlistArray.leadername": res.data.userListEventData[i].name,
              "memberlistArray.leaderhead": res.data.userListEventData[i].headimg,
            })
          } else {
            group.push(res.data.userListEventData[i])
            console.log(res.data.userListEventData[i])
            that.setData({
              "memberlistArray.memberdetail":group
            })
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
    return {
      title: '快来加入我的球队',
      path: '/pages/competition/register/register?clubId=' + that.data.clubfinfo.id + '&eventId=' + that.data.clubfinfo.eventId,
      success: function (res) {
        console.log(that.data.clubfinfo.id)
        console.log(that.data.clubfinfo.eventId)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})