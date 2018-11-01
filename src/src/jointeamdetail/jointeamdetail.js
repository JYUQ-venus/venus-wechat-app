// pages/competition/myteam/myteam.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

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
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    // console.log('options.reviewStatus')
    // console.log(options.reviewStatus)
    // this.setData({
    //   status: options.reviewStatus
    // })
    wx.showLoading({
      title: '加载中',
    })
    // var that = this
    let parmas = Object.assign({}, {thirdSession: wx.getStorageSync('sessionKey')}, {reviewStatus: options.reviewStatus})
    api.getTeamDetails({data: parmas}).then(res => {
      wx.hideLoading()
      this.setData({
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
          this.setData({
            "memberlistArray.leadername": res.data.userListEventData[i].name,
            "memberlistArray.leaderhead": res.data.userListEventData[i].headimg,
          })
        } else {
          group.push(res.data.userListEventData[i])
          this.setData({
            "memberlistArray.memberdetail":group
          })
        }
      }
    })
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
            url: '/src/index',
          })
       }
      })
  },
  // 点击报名按钮
  tip: function () {
    wx.showToast({
      title: '您无此权限',
      image: '../../images/warn.png',
      duration: 2000
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { clubfinfo } = this.data
    return {
      title: '快来加入我的球队',
      path: `/src/index?id=${clubfinfo.id}&&eventId=${clubfinfo.eventId}&&status=share`
    }
  },
  // 监听用户下拉刷新动作
  onPullDownRefresh: function(){
    wx.reLaunch({
      url: `/src/index`
    })
  }
})
