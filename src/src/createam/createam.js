// pages/competition/createam/createam.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamlogosrc:"",
    teamname:"",
    flag:1,
    region:"请选择城市",
    leadername:""
  },

  //上传球队logo
  choseteamlogo:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          teamlogosrc: res.tempFilePaths
        })
      }
    })
  },
  changeTeamname:function(e){
    this.setData({
      teamname:e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value[1],
      flag:0
    })
  },
  //创建球队
  bindcreateam:function(){
    if (this.data.teamlogosrc==""){
      wx.showToast({
        title: '请上传logo',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    if (this.data.teamname== "" || this.data.region==""){
      wx.showToast({
        title: '请完善信息',
        image: '../../img/warn.png',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/registerClubCheck',
      method: 'POST',
      data: {
        name: that.data.teamname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if(res.data.state==true){
          // wx.hideLoading()
          wx.uploadFile({
            url: 'https://slb.qmxsportseducation.com/eastStarEvent/upload/picture',
            filePath: that.data.teamlogosrc[0],
            name: 'file',
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              wx.setStorageSync('first', 0)
              var resdata = JSON.parse(res.data)
              that.setData({
                teamlogosrc: resdata.url
              })
              var club = {
                thirdSession: wx.getStorageSync('thirdSession'),
                clubLogo: that.data.teamlogosrc,
                name: that.data.teamname,
                city: that.data.region,
                numberPlayers: 0,
                introduction: " ",
                reviewStatus: 1,
                refuseReason: "",
                clubStatus: 0,
                clubReason: ""
              }
              wx.request({
                url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/registerClub',
                method: 'POST',
                data: {
                  club: JSON.stringify(club),
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log('创建球队')
                  console.log(JSON.stringify(club))
                  console.log(res)
                  if (res.data.state == true) {
                    wx.hideLoading()
                    wx.showToast({
                      // 审核
                      title: '已提交',
                      image: '../../img/subsuccess.png',
                      duration: 2000
                    })
                    // let pages = getCurrentPages();//当前页面
                    // let prevPage = pages[pages.length - 2];//上一页面
                    // prevPage.setData({//直接给上移页面赋值
                    //   reviewStatus: 1,
                    // });
                    // wx.navigateBack(1)
                    wx.redirectTo({
                      url: '../Z_index/Z_index',
                    })
                  }else{
                    wx.showToast({
                      title: '网络开小差了',
                      image: '../../img/warn.png',
                      duration: 2000
                    })
                  }
                }
              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            image: '../../img/warn.png',
            duration: 2000
          })
        }
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    //根据thirdSession换取队长的名字
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/registerClubCaptain',
      method: 'POST',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          leadername: res.data.captain
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