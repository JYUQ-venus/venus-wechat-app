let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

// const api = require('./apiUtils')
const constants = require('./constants')

const API_ROOT = extConfig.host || constants.requstUrl

import { _apiPOST, _apiGET, _apiPUT, _apiDELETE } from './apiUtils'

const REQUEST_TYPE = ['GET','POST','PUT','DELETE']

// 存储用户formId /api/account/setFormId
export const getUserInfo = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/loginUser`, options)

// 获取用户信息
export const getWechatInfo = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wx/onLogin`, options)
