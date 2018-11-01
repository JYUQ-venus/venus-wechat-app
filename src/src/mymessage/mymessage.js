// pages/competition/mymessage/mymessage.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchts:true,
    condition:false,
    infoarr:[],
    clubId:'',
    user_info:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    that.setData({
      clubId: options.clubId
    })
    let parmas = Object.assign({}, {thirdSession : wx.getStorageSync('sessionKey')})
    api.getMessageList({data: parmas}).then(json => {
      let data = json.data
      this.setData({
        infoarr: data.clubMessageList
      }, () => {
        wx.hideLoading()
      })
    })
  },
  //查看信息
  viewdetails:function(e){
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxUser/queryRegisterUser',
      data: {
        id: e.currentTarget.dataset.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          user_info: res.data.userObject,
          switchts : false
        })
      }
    })

  },

  //点击确定
  close:function(){
    this.setData({
      switchts:true
    })
  },
  // 点击同意
  agree:function(e){
    var that = this
    api.updateClubUserStatus({data: {
      thirdSession: wx.getStorageSync('sessionKey'),
      id: e.currentTarget.dataset.id,
      clubId: that.data.clubId,
      auditJoin:2,
    }}).then(res => {
      if(res.data.players == 2){
        wx.showModal({
          title: '提示',
          content: 'ta已在其他球队内，不能加入您的球队',
          showCancel: false,
          success: function(res){
            if(res.confirm){
              that.clearMessage(that.data.clubId, e.currentTarget.dataset.id)
            }
          }

        })
        return
      }
      let arr = that.data.infoarr;
      let index = e.target.dataset.index;
      if (arr[index].auditJoin == 1) {
        arr[index].auditJoin = 2
      }
      that.setData({
        infoarr: arr
      })
    })
  },
  clearMessage: function(cid, id){
    const { infoarr } = this.data
    console.log(infoarr)
    let index = infoarr.findIndex(json => json.id == id)
    api.clubUserDeleteByPrimaryKey({data: {
      clubId: cid,
      id: id
    }}).then(json => {
      infoarr.splice(index, 1)
      this.setData({
        infoarr: infoarr
      })
    })
  },
  ignore:function(e){
    var that = this
    api.updateClubUserStatus({data: {
      thirdSession: wx.getStorageSync('sessionKey'),
      id: e.currentTarget.dataset.id,
      clubId: that.data.clubId,
      auditJoin:0,
    }}).then(res => {
      var arr = that.data.infoarr;
      var index = e.target.dataset.index;
      if (arr[index].auditJoin == 1) {
        arr[index].auditJoin = 3
      }
      that.setData({
        infoarr: arr
      })
    })
  }
})
