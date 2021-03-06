// pages/competition/Z_index/Z_index.js
import * as api from '../js/api'
import * as util from '../js/utils'
// import * as constants from './js/constants'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intro: "",
    clubId: "",
    isAuthorization: true,
  },

  /**
   * 生命周期函数--监听页面显示
   */
   onLoad(options){
     this.setData({
       options: options
     })
   },
  onShow () {
    let self = this
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userInfo'] && wx.getStorageSync('wechatInfo')){
          app.getWechatInfo().then(res => {
            if(res == 'ok'){
              self.initData()
            }
          })
        }else{
          self.setData({
            isAuthorization: false
          })
        }
      }
    })
  },
  initData(){
    const { user } = wx.getStorageSync('userInfo')
    const { options } = this.data
    if (user == null) {
      let loginStatus = options.status == 'share' ? options.status : ''
      wx.navigateTo({
        url: `/src/register/register?loginStatus=${loginStatus}`,
      })
      return
    }
    if(options.status == 'share'){
      wx.reLaunch({
        url: `/src/nojointeamdetail/nojointeamdetail?id=${options.id}&&eventId=${options.eventId}`
      })
      return
    }
    // console.log('是否是队长' + user.auditJoin)
    if (user.auditJoin == 2) {
      if (user.captain == 0) {
        wx.redirectTo({
          url: `/src/jointeamdetail/jointeamdetail?id=${user.clubId}&eventId=${user.eId}&auditJoin=${user.auditJoin}`,
        })
      } else if (user.captain == 1) {
        wx.redirectTo({
          url: `/src/myteam/myteam`,
        })
      }
    } else {
      wx.redirectTo({
        url: `/src/teamlist/teamlist?reviewStatus=${user.reviewStatus}`,
      })
    }
  },
  // 获取授权信息
  onGotUserInfo: function(e){
    if(e.detail.userInfo){
      util.setStorageSync({
        key: 'wechatInfo',
        data: e.detail.userInfo
      })
      this.setData({
        isAuthorization: true
      }, () => {
        app.getWechatInfo().then(res => {
          if(res == 'ok'){
            this.initData()
          }
        })
      })
    }else{
      this.setData({
        isAuthorization: false
      })
    }
  }
})
