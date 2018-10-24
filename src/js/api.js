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

// /eastStarEvent/wxUser/queryClubDetailsCaptain
export const getTeamDetails = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/queryClubDetailsCaptain`, options)

// 球队消息列表
export const getMessageList = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/queryClubDetailsCaptainMessage`, options)

// 踢出队员 eastStarEvent/wxUser/deleteRemovePlayer
export const deleteRemovePlayer = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/deleteRemovePlayer`,options)

// 是否创建团队成功
export const isCreatedSuccessfully = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/registerUser`, options)

// 选择城市 eastStarEvent/wxClub/queryClub
export const selectCityClub = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxClub/queryClub`, options)

// 根据thirdSession换取队长的名字
export const getLeaderName = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxClub/registerClubCaptain`, options)

// 获取团队详情 eastStarEvent/wxClub/queryClubDetails
export const getClubPeopleDetails = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxClub/queryClubDetails`, options)

// 申请加入 eastStarEvent/wxClub/applyJoinClub
export const applyAddTeam = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxClub/applyJoinClub`, options)

// 任命为队长 eastStarEvent/wxUser/updateAppointedCaptain
export const appointmentCaptain = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/updateAppointedCaptain`, options)

// 获取验证码 /eastStarEvent/smss/verificationCode
export const getVerCode = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/smss/verificationCode`, options)

// 提交注册信息 /eastStarEvent/wxUser/registerUser
export const postSignInfo = (options) => _apiPOST(`${API_ROOT}/eastStarEvent/wxUser/registerUser`, options)
