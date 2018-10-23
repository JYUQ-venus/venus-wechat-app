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
    clubfinfo: {},
    messagelist: [],
    memberlistArray: {
      leadername: "",
      leaderhead: "",
      memberdetail: []
    },
    gamedatarry: [],
    gamehonorarry: [],
    signracelist: [],
    captainId: "",
    status: ""
  },

  //选项卡
  selected: function() {
    this.setData({
      selected: true,
      selected1: false,
      selected2: false,
      selected3: false,
    })
  },
  selected1: function() {
    this.setData({
      selected1: true,
      selected: false,
      selected2: false,
      selected3: false
    })
  },

  selected2: function() {
    this.setData({
      selected2: true,
      selected: false,
      selected1: false,
      selected3: false
    })
  },

  selected3: function() {
    this.setData({
      selected3: true,
      selected: false,
      selected1: false,
      selected2: false
    })
  },

  //球队设置
  bindteamset: function() {

    var that = this
    console.log('that.data.clubfinfo.id===' + that.data.clubfinfo.id)
    wx.navigateTo({
      url: '../teamset/teamset?clubId=' + that.data.clubfinfo.id + '',
    })
  },

  //跳转消息页面
  bindmessage: function() {
    var that = this
    wx.navigateTo({
      url: '../mymessage/mymessage?clubId=' + that.data.clubfinfo.id + '',
    })
  },
  gomemberdetail: function(e) {
    var that = this
    wx.navigateTo({
      url: '../editeammember/editeammember?userid=' + that.data.memberlistArray.memberdetail[e.currentTarget.dataset.index].id + '&position=' + that.data.memberlistArray.memberdetail[e.currentTarget.dataset.index].teamPosition + '&racenum=' + that.data.memberlistArray.memberdetail[e.currentTarget.dataset.index].raceNumber
    })
  },
  //任命队长
  bindrenming: function(e) {
    var that = this
    console.log("captainId=" + that.data.captainId)
    console.log("playersId=" + e.currentTarget.dataset.playid)
    console.log("clubId=" + e.currentTarget.dataset.clubid)
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/updateAppointedCaptain',
      data: {
        captainId: that.data.captainId,
        playersId: e.currentTarget.dataset.playid,
        clubId: e.currentTarget.dataset.clubid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('任命成功')
        wx.showToast({
          title: '任命成功',
          icon: 'success',
          duration: 2000
        })
        wx.reLaunch({
          url: '../Z_index/Z_index'
        })
      }
    })
  },

  //踢出队友
  del: function(e) {
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/deleteRemovePlayer',
      data: {
        clubId: that.data.clubfinfo.id,
        userId: e.currentTarget.dataset.userid,
        type: 3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.state == true) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          var nowarry = that.data.memberlistArray.memberdetail;
          var hh = nowarry.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            "memberlistArray.memberdetail": nowarry
          })
        }
      }
    })
  },
  //去报名
  gosign: function(e) {
    var raceid = e.currentTarget.dataset.race;
    var clubid = e.currentTarget.dataset.club;
    var registstatu = e.currentTarget.dataset.statu
    var actstatu = e.currentTarget.dataset.actstatu
    console.log(raceid + ',' + clubid)
    if (actstatu == 1) {
      if (registstatu == 0) {
        wx.navigateTo({
          url: '../raceintro/raceintro?raceid=' + raceid + '&clubid=' + clubid + ''
        })
      }
    } else {
      wx.showToast({
        title: '报名已结束',
        image: '../../img/warn.png',
        duration: 2000
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      status: options.reviewStatus
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(wx.getStorageSync('thirdSession'));
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/queryClubDetailsCaptain',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        reviewStatus: that.data.status
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        // console.log(res.data,'阿斯蒂芬贺卡健身房的科技');
        let data = res.data
        console.log(data,'---------data')
        that.setData({
          clubfinfo: data.club,
          gamedatarry: data.userListEventData,
          signracelist: data.eventList,
          gamehonorarry: data.userList
        })
        var messlist = []
        for (let i = 0; i < data.clubMessageList.length; i++) {
          if (data.clubMessageList[i].auditJoin == 1) {
            messlist.push(data.clubMessageList[i])
            that.setData({
              messagelist: messlist,
            })
          }
        }
        var group = []
        for (let i = 0; i < data.userListEventData.length; i++) {
          if (data.userListEventData[i].captain == 1) {
            that.setData({
              "memberlistArray.leadername": data.userListEventData[i].name,
              "memberlistArray.leaderhead": data.userListEventData[i].headimg,
              captainId: data.userListEventData[i].id
            })
          } else {
            group.push(data.userListEventData[i])
            that.setData({
              "memberlistArray.memberdetail": group
            })
          }
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // wx.reLaunch({
    //   url: '../Z_index/Z_index'
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    const { clubfinfo } = this.data
    // const { user } = wx.getStorageSync('userInfo')
    console.log(clubfinfo.id)
    return {
      title: '快来加入我的球队',
      path: `/pages/competition/nojointeamdetail/nojointeamdetail?clubId=${clubfinfo.id}`
    }
  }
})
