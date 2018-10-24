// pages/competition/myteam/myteam.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectStatus: 1,
    clubInfo: {},
    messagelist: [],
    playerList: [],
    teamLeader: {},
    gamedatarry: [],
    gamehonorarry: [],
    signracelist: [],
    captainId: "",
    status: ""
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(wx.getStorageSync('thirdSession'));
    let self = this
    let parmas = Object.assign({}, {thirdSession: wx.getStorageSync('sessionKey')}, {reviewStatus: self.data.status})
    api.getTeamDetails({data: parmas}).then(json => {
      let data = json.data
      let teamLeader = data.userListEventData.find(json => json.captain == 1)
      console.log(teamLeader,'-----------json')
      let capIndex = data.userListEventData.findIndex(json => json.id == teamLeader.id)
      data.userListEventData.splice(capIndex, 1)
      this.setData({
        clubInfo: data.club,
        teamLeader: teamLeader,
        messagelist: data.clubMessageList,
        playerNum: data.userListEventData.length,
        playerList: data.userListEventData,
        signracelist: data.eventList,
        gamehonorarry: data.userList,
        userId: data.userId
      })
    })
  },
  //选项卡
  selectTabs: function(e) {
    const { currentTarget: { dataset: { status } } } = e
    this.setData({
      selectStatus: status
    })
  },

  //球队设置
  bindteamset: function() {

    // var that = this
    const { clubInfo } = this.data
    console.log('that.data.clubfinfo.id===' + clubInfo.id)
    wx.navigateTo({
      url: `/src/teamset/teamset?clubId=${clubInfo.id}`,
    })
  },

  //跳转消息页面
  bindmessage: function() {
    // var that = this
    const { clubInfo } = this.data
    wx.navigateTo({
      url: `/src/mymessage/mymessage?clubId=${clubInfo.id}`,
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
    const { currentTarget: { dataset: { playid, clubid } } } = e
    let parmas = Object.assign({}, {captainId: this.data.userId}, {playersId: playid}, {clubId: clubid})
    api.appointmentCaptain({data: parmas}).then(json => {
      wx.showToast({
        title: '任命成功',
        icon: 'success',
        duration: 2000
      })
      wx.reLaunch({
        url: `/src/jointeamdetail/jointeamdetail?id=${e.currentTarget.dataset.clubid}&&eventId=${that.data.clubInfo.eventId}`
      })
    })
  },

  //踢出队友
  del: function(e) {
    var that = this
    const { clubInfo, playerList } = this.data
    const { currentTarget: { dataset: { userid } } } = e
    let parmas = Object.assign({}, {clubId: clubInfo.id}, {userId: userid}, {type: 3})
    let index = playerList.findIndex(json => json.id == userid)
    api.deleteRemovePlayer({data: parmas}).then(json => {
      if (json.data.state == true) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        playerList.splice(index, 1)
        that.setData({
          playerList: playerList
        })
      }
    })
  },
  //去报名
  gosign: function(e) {
    var raceid = e.currentTarget.dataset.race;
    var clubid = e.currentTarget.dataset.club;
    var registstatu = e.currentTarget.dataset.statu
    var actstatu = e.currentTarget.dataset.actstatu
    if (actstatu == 1) {
      if (registstatu == 0) {
        wx.navigateTo({
          url: `/src/raceintro/raceintro?raceid=${raceid}&&clubid=${clubid}`
        })
      }
    } else {
      wx.showToast({
        title: '报名已结束',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    const { clubInfo } = this.data
    // const { user } = wx.getStorageSync('userInfo')
    console.log(clubInfo)
    return {
      title: '快来加入我的球队',
      path: `/src/index?id=${clubInfo.id}&&eventId=${clubInfo.eventId}&&status=share`
    }
  },
  // 监听用户下拉刷新动作
  onPullDownRefresh: function(){
    wx.reLaunch({
      url: `/src/index`
    })
  }
})
