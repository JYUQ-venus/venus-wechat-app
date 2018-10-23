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
  onLoad () {
    let self = this
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userInfo']){
          app.getWechatInfo().then(res => {
            console.log(res,'---------res')
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
    if (user == null) {
      wx.redirectTo({
        url: '../register/register',
      })
      return
    }
    if (user.auditJoin == 2) {
      console.log('是否是队长' + user.captain)
      if (user.captain == 0) {
        wx.redirectTo({
          url: '../jointeamdetail/jointeamdetail?id=' + user.clubId + '&eventId=' + user.eId + '&auditJoin=' + user.auditJoin,
        })
      } else if (user.captain == 1) {
        wx.redirectTo({
          url: '../myteam/myteam?reviewStatus=' + user.reviewStatus + '',
        })
      }
    } else {
      wx.redirectTo({
        url: '../teamlist/teamlist?reviewStatus=' + user.reviewStatus + '',
      })
    }
  },
  // 获取授权信息
  onGotUserInfo: function(e){
    console.log(e,'-----------e')
    util.setStorageSync({
      key: 'userInfo',
      data: e.detail.userInfo
    })
    this.setData({
      isAuthorization: true
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
