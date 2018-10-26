// pages/competition/register.js
import * as api from '../../js/api'
import * as util from '../../js/utils'

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clubId: "",
    eventId: "",
    userheadimg: "",
    usernickname: "",
    username: "",
    userphone: "",
    codenum: "",
    codestate: '发送验证码',
    codeflag: true,
    verificationCode: "",
    userschool: "",
    usersex: "",
    userbirthday: "",
    userheight: "",
    userweight: "",
    userposition: "",
    usernum: "",
    useridentity: "",
    userintroduce: "",
    imgsrc: "",
    show:true,
  },

  // 获取name值
  changeName: function (ev) {
    this.setData({
      username: ev.detail.value
    })
  },
  //获取手机号
  changePhone: function (ev) {
    this.setData({
      userphone: ev.detail.value
    })
  },

  //发送验证码
  sendcode: function () {
    var that = this
    var phone = that.data.userphone;
    if (phone == "") {
      wx.showToast({
        title: '请填写手机号',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号格式有误',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    if (phone != '' && that.data.codeflag) {
      var content = "";
      for (var i = 0; i < 4; i++) {
        content += Math.floor(Math.random() * 10);
      }
      let parmas = Object.assign({}, {mobiles: phone}, {content: content})
      api.getVerCode({data: parmas}).then(res => {
        if (res.data == "OK") {
          that.setData({
            verificationCode: content
          })
        }
      })
      that.data.codeflag = false
      let currentTime = 60
      var interval = setInterval(function () {
        currentTime--;
        that.setData({
          codestate: '(' + currentTime + ')s'
        })
        if (currentTime == 0) {
          clearInterval(interval)
          that.setData({
            codestate: '发送验证码'
          })
          that.data.codeflag = true
        }
      }, 1000)
    }
  },
  getCode: function (ev) {
    this.setData({
      codenum: ev.detail.value
    })
  },
  //获取学校
  changeSchool: function (ev) {
    this.setData({
      userschool: ev.detail.value
    })
  },

  //身高
  changeHeight: function (ev) {
    this.setData({
      userheight: ev.detail.value
    })
  },

  //体重
  changeWeight: function (ev) {
    this.setData({
      userweight: ev.detail.value
    })
  },

  //位置
  changePlace: function (ev) {
    this.setData({
      userposition: ev.detail.value
    })
  },

  //背号
  changeNum: function (ev) {
    this.setData({
      usernum: ev.detail.value
    })
  },
  //身份证号
  changeIdentity: function (ev) {
    this.setData({
      userbirthday: ev.detail.value.substring(6, 10) + "-" + ev.detail.value.substring(10, 12) + "-" + ev.detail.value.substring(12, 14)
    })
    this.setData({
      useridentity: ev.detail.value
    })
    if (parseInt(ev.detail.value.substr(16, 1)) % 2 == 1) {
      this.setData({
        usersex: 1 //男
      })
    } else {
      this.setData({
        usersex: 0 //女
      })
    }
  },
  //个人介绍
  changeIntroduce: function (ev) {
    this.setData({
      userintroduce: ev.detail.value
    })
  },
  //上传身份证
  bindchosepicure: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        _this.setData({
          imgsrc: res.tempFilePaths
        })
      }
    })
  },
  bindSubmitTap: function () {
    wx.showLoading({
      title: '请等待',
    })
    this.setData({
      userheadimg: wx.getStorageSync('avatarUrl'),
      usernickname: wx.getStorageSync('nickName')
    })
    var that = this;
    //判断
    if (that.data.username == "" || that.data.userphone == "" || that.data.userheight == "" || that.data.userweight == "" || that.data.useridentity == "") {
      wx.showToast({
        title: '信息不完整',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    if (that.data.imgsrc == "") {
      wx.showToast({
        title: '请上传证件照',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    if (that.data.codenum != that.data.verificationCode) {
      wx.showToast({
        title: '验证码不正确',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }
    let isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    if (that.data.useridentity.idCard !== "" && isIDCard1.test(that.data.useridentity) == false) {
      wx.showToast({
        title: '身份证格式不正确',
        image: '../../images/warn.png',
        duration: 2000
      })
      return;
    }

    wx.uploadFile({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/upload/picture',
      filePath: that.data.imgsrc[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var resdata = JSON.parse(res.data)
        that.setData({
          imgsrc: resdata.url
        })
        let userInfo = wx.getStorageSync('wechatInfo')
        let people = {
          thirdSession: wx.getStorageSync('sessionKey'),
          captain: 0,
          auditJoin: 0,
          headimg: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          name: that.data.username,
          sex: that.data.usersex,
          birthday: that.data.userbirthday,
          idCard: that.data.useridentity,
          profilePicture: that.data.imgsrc,
          phone: that.data.userphone,
          height: that.data.userheight,
          weight: that.data.userweight,
          universities: that.data.userschool,
          raceNumber: that.data.usernum,
          teamPosition: that.data.userposition,
          introduction: that.data.userintroduce,
          profilePicture: that.data.imgsrc
        }
        var _this = that
        api.postSignInfo({data: {user: JSON.stringify(people)}}).then(res => {
          wx.hideLoading()
          if(res.data.registered == 1){
            wx.showModal({
              title: '提示',
              content: '您已注册过，不能重复注册',
              showCancel: false
            })
            return
          }
          wx.showToast({
            title: '提交成功',
            image: '../../images/subsuccess.png',
            duration: 2000
          })
          if (_this.data.clubId != undefined) {
            wx.redirectTo({
              url: '../nojointeamdetail/nojointeamdetail?id=' + _this.data.clubId + '&eventId='+ _this.data.eventId + '&auditJoin=0',
            })
          } else {
            wx.redirectTo({
              url: `/src/index`
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
    this.setData({
      clubId: options.clubId,
      eventId: options.eventId,
    })
  }
})
