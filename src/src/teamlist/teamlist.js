// pages/competition/teamlist/teamlist.js
import * as api from '../../js/api'
import * as util from '../../js/utils'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityindex:"",
    city: [],
    searchvalue:"",
    teamlistArray:[],
    reviewStatus:0,
    createstatu:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    // var that=this
    let { city } = this.data
    let parmas = Object.assign({}, {thirdSession: wx.getStorageSync('sessionKey')})
    api.isCreatedSuccessfully({data: {user: JSON.stringify(parmas)}}).then(res => {
      if(res.data.auditJoinOneself == 2){
        wx.redirectTo({
          url: `/src/index`
        })
        return
      }
      if (res.data.reviewStatus == 3){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: `您创建的球队未通过审核,原因为:${res.data.refuseReason != '' ? res.data.refuseReason : '无'}`
        })
      }
      res.data.clubList && res.data.clubList.map(json => {
        city.push(json.city)
      })
      this.setData({
        teamlistArray: res.data.clubList,
        reviewStatus: res.data.reviewStatus,
        city: Array.from(new Set(city))
      }, () => {
        wx.hideLoading()
      })
    })
  },
  // 搜索
  changeSearchval:function(e){
    const { detail: { value } } = e
    wx.showLoading({
      title: '加载中',
    })

    let parmas = Object.assign({}, {name: value}, {thirdSession: wx.getStorageSync('sessionKey')})
    api.selectCityClub({data: parmas}).then(res => {
      this.setData({
        teamlistArray : res.data.clubList,
        searchvalue: value
      }, () => {
        wx.hideLoading()
      })
    })
  },
  //选择城市
  bindPickercity: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    const { city } = this.data
    const { detail: { value } } = e
    let parmas = Object.assign({}, {city: city[value]}, {thirdSession: wx.getStorageSync('sessionKey')})
    api.selectCityClub({data: parmas}).then(res => {
      this.setData({
        teamlistArray: res.data.clubList,
        cityindex: value
      }, () => {
        wx.hideLoading()
      })
    })
  },
  //创建球队
  bindcreateam:function(){
    if (this.data.reviewStatus == 2){
      wx.showToast({
        title: '您已经创建球队',
        image: '../../images/warn.png',
        duration: 2000
      })
      return
    }
    if (this.data.reviewStatus == 1){
      wx.showToast({
        title: '您已申请球队',
        image: '../../images/warn.png',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: `/src/createam/createam`,
    })
  },
  //点击申请
  apply:function(e){
    let statu = e.currentTarget.dataset.statu;
    if (statu != 0 || this.data.reviewStatus == 1) {
      return
    }
    let parmas = Object.assign({}, {thirdSession: wx.getStorageSync('sessionKey')}, {clubId: e.currentTarget.dataset.id}, {auditJoin: 1})
    api.applyAddTeam({data: parmas}).then(res => {
      if(res.data.state==true){
        let arr = this.data.teamlistArray;
        console.log(arr)
        let index = e.target.dataset.index;
        if (arr[index].auditJoin == 0) {
          arr[index].auditJoin = 1
          this.data.createstatu = 1
        }
        this.setData({
          teamlistArray: arr
        })
      }
    })
  },
  gototeamdetail:function(e){
    var teamid = e.currentTarget.dataset.id
    var auditJoin = e.currentTarget.dataset.statu
    var eventId = e.currentTarget.dataset.event
    wx.navigateTo({
      url: `/src/nojointeamdetail/nojointeamdetail?id=${teamid}&&eventId=${eventId}`
      // url: '../Z_index/Z_index',
    })
  },
  // 监听用户下拉刷新动作
  onPullDownRefresh: function(){
    wx.reLaunch({
      url: `/src/index`
    })
  }
})
