// pages/competition/nojointeamdetail/nojointeamdetail.js
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
    memberlistArray:{
       leadername:"",
       leaderhead:"",
       memberdetail:[]
    },
    gamedatarry: []
  },
  //申请加入
  join:function(){
    if (this.data.auditJoin!= 0){
      return
    }else{
      var that = this
      wx.request({
        url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/applyJoinClub',
        data: {
          thirdSession: wx.getStorageSync('thirdSession'),
          clubId:that.data.clubid,
          auditJoin: 1
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if(res.data.state==true){
            that.setData({
              auditJoin:1,
            })
          }
        }
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'-----------options')
    this.setData({
      auditJoin:options.auditJoin
    })
    var that= this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/queryClubDetails',
      data: {
        id: options.id,
        eventId: options.eventId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, '----------????')
        if (res.data.state==true){
          that.setData({
            teamlogosrc: res.data.club.clubLogo,
            teamname: res.data.club.name,
            peoplenum: res.data.club.numberPlayers,
            addrcity: res.data.club.city,
            clubid: res.data.club.id,
            gamedatarry: res.data.userListEventData
          })
          var group = []
          for (let i = 0; i < res.data.userListEventData.length;i++){
            if (res.data.userListEventData[i].captain==1){
              that.setData({
                "memberlistArray.leadername":res.data.userListEventData[i].name,
                "memberlistArray.leaderhead":res.data.userListEventData[i].headimg
              })
            }else{
              group.push(res.data.userListEventData[i])
              that.setData({
                "memberlistArray.memberdetail": group
              })
            }
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

  }
})
