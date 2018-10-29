// pages/competition/teamset/teamset.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logosrc:'',
    teamname:'',
    city:'',
    teaminfo:'',
    clubId:"",
    qrcode:""
  },
  // 更换球队logo
  bindlogo:function(e){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: 'https://slb.qmxsportseducation.com/eastStarEvent/upload/picture',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
           var res=JSON.parse(res.data)
            that.setData({
              logosrc: res.url
            })
            wx.request({
              url:'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/updateClubDetails',
              data: {
                id:that.data.clubId,
                clubLogo: that.data.logosrc
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
              }
            })
          }
        })
      }
    })
  },
  editname:function(){
    var that=this
    wx.navigateTo({
      url: '../editname/editname?clubId=' + that.data.clubId + '&teamname='+that.data.teamname+'',
    })
  },
  editcity: function () {
    var that = this
    console.log("clubId===="+that.data.clubId + ".city===" + that.data.city)
    wx.navigateTo({
      url: '../editcity/editcity?clubId=' + that.data.clubId + '&city=' + that.data.city + '',
    })
  },
  editintro: function () {
    var that = this
    wx.navigateTo({
      url: '../editintro/editintro?clubId=' + that.data.clubId + '&teaminfo=' + that.data.teaminfo + '',
    })
  },
  //解散球队
  dissolve:function(){
    var that=this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/updateClubStatus',
      data: {
        id: that.data.clubId,
        clubStatus:1,
        thirdSession: wx.getStorageSync('thirdSession')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
         wx.showToast({
          title: '已提交申请',
          icon: 'success',
          duration: 2000
        })
      }
    })

  },
  // 预览二维码
  previmg:function(){
    const { qrcode } = this.data
    wx.previewImage({
      current: qrcode,
      urls: [qrcode]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      clubId:options.clubId
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
    var that = this
    wx.request({
      url: 'https://slb.qmxsportseducation.com/eastStarEvent/wxClub/queryClubById',
      data: {
        id: that.data.clubId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          logosrc: res.data.club.clubLogo,
          teamname: res.data.club.name,
          city: res.data.club.city,
          teaminfo: res.data.club.introduction,
          qrcode:res.data.club.qrCode
        })
        if (that.data.teaminfo == " ") {
          that.setData({
            teaminfo: "请填写简介"
          })
        }
      }
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
