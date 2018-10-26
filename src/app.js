import * as api from './js/api'
import * as util from './js/utils'
import * as constants from './js/constants'

var appConfig = {
    getWechatInfo () {
      let that = this
      return new Promise ((resolve, result) => {
        util.wechatLogin().then((login) => {
          that.weChatSignin(login.code, resolve, result)
        })
      })
    },
    globalData: {
      wechatInfo     : null,
      userInfo       : null,
      entities       : {
        deviceInfo     : wx.getSystemInfoSync()
      }
    },
    weChatSignin (code, solve, sult) {
      const self = this
      let parmas = Object.assign({}, {code: code})
      api.getWechatInfo({
        data: parmas
      }).then(json => {
        wx.setStorageSync('sessionKey', json.data.thirdSession)
        self.getUserInfo(json.data.thirdSession, solve, sult)
      })
    },
    getUserInfo(sessionId, solve, sult){
      let parmas = Object.assign({}, {thirdSession: sessionId})
      api.getUserInfo({data: parmas}).then(json => {
        wx.setStorageSync('userInfo', json.data)
        solve('ok')
        // util.setStorageSync({
        //   key: 'user-key',
        //   data: userId
        // })
        // api.getIsSign().then(json => {
        //   app.globalData.isSign = json.data.result.isSign
        // })
      }).catch(() => {
        sult()
      })
    }
}

App(appConfig)

export var app = getApp()
