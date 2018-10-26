// pages/competition/submitsigninfor/submitsigninfor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    event:"",
    eventId:'',
    clubId: "",
    eventCityAddress:[],
    ecid:"",
    teamname:"",
    signcityArray: [],
    addressindex:"",
    array: [],
    index: "",
    egid:"",
    eventGroupList:[],
    inputteamleader:"",
    inputleaderphone:""
  },

  //选择所在城市地点
  bindPickercityChange: function (e) {
    this.setData({
      addressindex: e.detail.value,
    })
    this.setData({
      ecid: e.currentTarget.dataset.id[e.detail.value],
    })
  },

  inputleaderphone:function(e){
    this.setData({
      inputleaderphone: e.detail.value,
    })
  },

  inputteamleader: function (e) {
    this.setData({
      inputteamleader: e.detail.value,
    })
  },

  //选择组别
  bindPickerChange: function (e) {
    this.setData({
      index:e.detail.value,
    })
    this.setData({
      egid: e.currentTarget.dataset.id[e.detail.value],
    })
  },

  //提交信息
  signsubmit:function(){
    var that = this;
    var eventClub = {
      clubId:that.data.clubId,
      eventId: that.data.eventId,
      eventCityAddress:that.data.ecid,
      leader: that.data.inputteamleader,
      leaderPhone: that.data.inputleaderphone,
      cName:that.data.teamname,
      eventGroupId: that.data.egid
    }
    if (that.data.egid == "" || that.data.inputteamleader == "" || that.data.inputleaderphone == ""){
      wx.showToast({
        title: '请完善报名信息132',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.inputleaderphone))) {
      wx.showToast({
        title: '手机号格式有误',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxEvent/addRegistrationInformation',
      data: {
        eventClub: eventClub
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url:`/src/index`,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      clubId: options.clubId,
      eventId: options.eventId
    })
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxEvent/insertUpdatePages',
      data: {
        clubId: options.clubId,
        eventId: options.eventId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var cityaddrarr = [];
        var ecid=[];
        for (let i = 0; i < res.data.eventCityList.length;i++){
          var strarr = res.data.eventCityList[i].ecCity +res.data.eventCityList[i].ecAddress
          cityaddrarr.push(strarr)
          ecid.push(res.data.eventCityList[i].ecId)
          that.setData({
            eventCityAddress:ecid
          })
        }
        var groplist = []
        var egid=[]
        for (let j = 0; j < res.data.eventGroupList.length;j++){
          groplist.push(res.data.eventGroupList[j].egGroupName)
          egid.push(res.data.eventGroupList[j].egId)
          that.setData({
            eventGroupList: egid
          })
        }
        that.setData({
          event:res.data.event.name,
          teamname:res.data.club.name,
          signcityArray: cityaddrarr,
          array: groplist
        })
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
