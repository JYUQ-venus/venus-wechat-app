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
      let capIndex = data.userListEventData.findIndex(json => json.id == teamLeader.id)
      // data.userListEventData.splice(capIndex, 1)
      this.setData({
        clubInfo: data.club,
        teamLeader: teamLeader,
        messagelist: data.clubMessageList,
        playerNum: data.userListEventData.length,
        playerList: data.userListEventData,
        peopleList: data.uList,
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
      url: '/src/editeammember/editeammember?userid=' + that.data.playerList[e.currentTarget.dataset.index].id + '&position=' + that.data.playerList[e.currentTarget.dataset.index].teamPosition + '&racenum=' + that.data.playerList[e.currentTarget.dataset.index].raceNumber
    })
  },
  //任命队长
  bindrenming: function(e) {
    var that = this
    const { currentTarget: { dataset: { playid, clubid } } } = e
    let parmas = Object.assign({}, {captainId: this.data.userId}, {playersId: playid}, {clubId: clubid})
    wx.showModal({
      title: '提示',
      content: '确定任命ta为队长吗?',
      success (res) {
        if (res.confirm) {
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //踢出队友
  del: function(e) {
    var that = this
    const { clubInfo, playerList } = this.data
    const { currentTarget: { dataset: { userid } } } = e
    let parmas = Object.assign({}, {clubId: clubInfo.id}, {userId: userid}, {type: 3})
    let index = playerList.findIndex(json => json.id == userid)
    wx.showModal({
      title: '提示',
      content: '确定删除ta吗?',
      success: function(res){
        if(res.confirm){
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
        }else{
          console.log('click close')
        }
      }
    })
  },
  //去报名
  gosign: function(e) {
    const { currentTarget: { dataset: { race, club, statu, actstatu } } } = e
    switch (actstatu) {
      case 0:
        this.showModal('报名未开始')
        break;
      case 1:
        if(statu == 0){
          wx.navigateTo({
            url: `/src/raceintro/raceintro?raceid=${race}&&clubid=${club}`
          })
        }else{
          this.showModal('已报名')
        }
        break;
      case 2:
        this.showModal('未开赛')
        break;
      case 4:
        this.showModal('比赛中')
        break;
      case 5:
        this.showModal('比赛结束')
        break;
      default:

    }
  },
  showModal: function(content){
    wx.showToast({
      title: content,
      image: '../../images/warn.png',
      duration: 2000
    })
  },
//   int state = 0;// 赛事状态 0未报名 1 报名中 2报名结束 3未开赛 4比赛中 5比赛结束
// if (d <= suts) {
//   System.out.println("报名未开始");
//   state = 0;
// } else if (d > suts && d <= sute) {
//   System.out.println("报名中");
//   state = 1;
// } else if (d > sute && d <= gts) {
//   System.out.println("报名结束未开赛");
//   state = 2;
// } else if (d > gts && d <= gte) {
//   System.out.println("比赛中");
//   state = 4;
// } else if (d >= gte) {
//   System.out.println("比赛结束");
//   state = 5;
// }
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    const { clubInfo } = this.data
    // const { user } = wx.getStorageSync('userInfo')
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
