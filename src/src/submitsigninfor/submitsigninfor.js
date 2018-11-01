// pages/competition/submitsigninfor/submitsigninfor.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

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
    api.addRegistrationInformation({data: {
      eventClub: JSON.stringify(eventClub)
    }}).then(res => {
      if(res.data.state){
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000,
          success: function(){
            setTimeout(() => {
              wx.redirectTo({
                url:`/src/index`,
              })
            })
          }
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

    api.insertUpdatePages({
      data: {
        clubId: options.clubId,
        eventId: options.eventId
      }
    }).then(res => {
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
    })
  }
})
