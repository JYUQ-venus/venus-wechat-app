// pages/competition/nojointeamdetail/nojointeamdetail.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    teamlogosrc:"",
    teamname:"",
    peoplenum:"",
    addrcity:"",
    clubid:"",
    auditJoin:"",
    gamedatarry: [],
    isAuthorization: true,
    playerNum: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      options: options
    })
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userInfo']){
          self.initData()
        }else{
          self.setData({
            isAuthorization: false
          })
        }
      }
    })

  },
  initData(){
    const { options } = this.data
    let parmas = Object.assign({}, {id: options.id}, {eventId: options.eventId}, {thirdSession: wx.getStorageSync('sessionKey')})
    api.getClubPeopleDetails({data: parmas}).then(res => {
      let data = res.data
      if(data.state){
        let teamLeader = data.userListEventData.find(json => json.captain == 1)
        this.setData({
          teamLeader: teamLeader,
          teamlogosrc: data.club.clubLogo,
          teamname: data.club.name,
          addrcity: data.club.city,
          numberPlayers: data.club.numberPlayers,
          clubid: data.club.id,
          playerList: data.userListEventData,
          playerNum: data.userListEventData.length,
          auditJoin: data.auditJoin
        })
      }
    })
  },
  //申请加入
  join:function(){
    if (this.data.auditJoin != 0){
      return
    }else{
      let parmas = Object.assign({}, {thirdSession: wx.getStorageSync('sessionKey')}, {clubId: this.data.clubid}, {auditJoin: 1})
      api.applyAddTeam({data: parmas}).then(res => {
        let data = res.data
        if(data.captain == 1 || data.players == 2 || data.auditJoin == 2){
          wx.showModal({
            title: '提示',
            content: '您已在其他球队内，不能申请其他球队',
            showCancel: false
          })
          return
        }
        this.setData({
          auditJoin: 1
        })
      })
    }
  },
  onGotUserInfo: function(e){
    util.setStorageSync({
      key: 'userInfo',
      data: e.detail.userInfo
    })
    this.setData({
      isAuthorization: true
    }, () => {
      app.getWechatInfo('other').then(res => {
        if(res == 'ok'){
          const { user } = wx.getStorageSync('userInfo')
          if (user == null) {
            wx.redirectTo({
              url: `/src/register/register`,
            })
          }else{
            this.initData()
          }
        }
      })
    })
  },
  //选项卡
  selected:function(){
    this.setData({
      selected:true,
      selected1:false,
    })
  },
  selected1: function () {
    this.setData({
      selected1:true,
      selected:false
    })
  },
  // 监听用户下拉刷新动作
  onPullDownRefresh: function(){
    wx.reLaunch({
      url: `/src/index`
    })
  }
})
