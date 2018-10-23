import { checkStatus, checkSystemUser } from './utils'
import * as util from './utils'
import moment from './moment'
import * as constants from './constants'
const Promise = require('./bluebird')
// const sha1 = require('./sha1')

const requestType = (type, url, options = {}) => {
  const app  = getApp()

  options.method                 = type
  options.url                    = url
  options.header                 = options.header || {}
  options.header['Content-type'] = 'application/x-www-form-urlencoded;'

  function callAPI (resolve, reject) {
    const params = Object.assign({}, options, {
      success (res) {
        if (options.isHiddenError) {
          resolve(res)
        }
        console.log(res, 'data')
        checkStatus(Object.assign({}, res, {
          isHideErrorMsg : options.isHideErrorMsg
        })).then(resolve, reject)
      },
      fail (error) {
        reject(error)
      }
    })
    console.log('请求API-=-=-=-',params)
    wx.request(params)
  }

  return new Promise(callAPI)
}

export const _apiPOST = (url, options) => requestType('POST', url, options)

export const _apiGET = (url, options) => requestType('GET', url, options)

export const _apiPUT = (url, options) => requestType('PUT', url, options)

export const _apiDELETE = (url, options) => requestType('DELETE', url, options)

// export const api = (options) => {
//   return wx.request(options)
// }
