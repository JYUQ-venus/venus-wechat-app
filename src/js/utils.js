import moment from './moment'
// var amapFile = require('./amap-wx')
// var myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})
const { requstUrl } = require('./constants')

const canvas_common = {};

const innerAudioContext = wx.getBackgroundAudioManager()

export const parseUrl = (url) => {
  if (!url) {
    return ''
  }

  url = decodeURIComponent(url)
// remove any preceding url and split
  url = url.substring(url.indexOf('?')+1).split('&');

  var params = {}, pair, d = decodeURIComponent;
  // march and parse
  for (var i = url.length - 1; i >= 0; i--) {
    pair = url[i].split('=');
    params[d(pair[0])] = d(pair[1] || '');
  }

  return params;
}


export const  uploadFile = (image, data) => {
  let array = []
  return new Promise((resolve, result) => {
    image && image.map(json => {
      var uploadTask = wx.uploadFile({
        url: requstUrl + data.url,
        filePath: json.img,
        name: data.name,
        header: {
          'content-type': 'multipart/form-data',
          'up-type': data.type,
          'openId': data.openId
        },
        success: function(res){
          let data = res.data
          let code = data.substring(11, 13)
          // if(code == '1'){
          //   array.push('ok')
          //   if(array.length == image.length){
          //     setTimeout(() => {
          //       resolve('ok')
          //     }, 1500)
          //   }
          // }
          // console.log(code,'success')
        },
        fail: function(e){
          // console.log(e,'error')
        },
        complete: function(res){
          // console.log(res,'complete')
        }
      })
      uploadTask.onProgressUpdate((res) => {
        if(res.progress == 100){
          array.push('ok')
          if(array.length == image.length){
            setTimeout(() => {
              resolve('ok')
            }, 1500)
          }
        }
      })
    })
  })
}

export const wechatLogin = () => {
  return new Promise((resolve, result) => {
    if (wx.login) {
      wx.login({
        success (loginres){
          resolve(loginres)
        },
        fail (res){
          result(res,'errorLogin')
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  })
}

export const wechatGetUserInfo = () => {
  return new Promise((resolve, result) => {
    wx.getUserInfo({
      withCredentials: true,
      success (data){
        data.userInfo.encryptedData = data.encryptedData
        data.userInfo.iv = data.iv
        resolve(data.userInfo)
      },
      fail (res){
        result()
      }
    })
  })
}

// sha1
export const sha1 = (data) => {
  /*
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
   * in FIPS PUB 180-1
   * Version 2.1-BETA Copyright Paul Johnston 2000 - 2002.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for details.
   */
  /*
   * Configurable variables. You may need to tweak these to be compatible with
   * the server-side, but the defaults work in most cases.
   */
  var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase     */
  var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */
  var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  function hex_sha1(s) {
   return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
  }
  function b64_sha1(s) {
   return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
  }
  function str_sha1(s) {
   return binb2str(core_sha1(str2binb(s), s.length * chrsz));
  }
  function hex_hmac_sha1(key, data) {
   return binb2hex(core_hmac_sha1(key, data));
  }
  function b64_hmac_sha1(key, data) {
   return binb2b64(core_hmac_sha1(key, data));
  }
  function str_hmac_sha1(key, data) {
   return binb2str(core_hmac_sha1(key, data));
  }
  /*
   * Perform a simple self-test to see if the VM is working
   */
  function sha1_vm_test() {
   return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
  }
  /*
   * Calculate the SHA-1 of an array of big-endian words, and a bit length
   */
  function core_sha1(x, len) {
   /* append padding */
   x[len >> 5] |= 0x80 << (24 - len % 32);
   x[((len + 64 >> 9) << 4) + 15] = len;
   var w = Array(80);
   var a = 1732584193;
   var b = -271733879;
   var c = -1732584194;
   var d = 271733878;
   var e = -1009589776;
   for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for (var j = 0; j < 80; j++) {
     if (j < 16) w[j] = x[i + j];
     else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
     var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
     e = d;
     d = c;
     c = rol(b, 30);
     b = a;
     a = t;
    }
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
   }
   return Array(a, b, c, d, e);
  }
  /*
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  function sha1_ft(t, b, c, d) {
   if (t < 20) return (b & c) | ((~b) & d);
   if (t < 40) return b ^ c ^ d;
   if (t < 60) return (b & c) | (b & d) | (c & d);
   return b ^ c ^ d;
  }
  /*
   * Determine the appropriate additive constant for the current iteration
   */
  function sha1_kt(t) {
   return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
  }
  /*
   * Calculate the HMAC-SHA1 of a key and some data
   */
  function core_hmac_sha1(key, data) {
   var bkey = str2binb(key);
   if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
   var ipad = Array(16),
    opad = Array(16);
   for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
   }
   var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
   return core_sha1(opad.concat(hash), 512 + 160);
  }
  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y) {
   var lsw = (x & 0xFFFF) + (y & 0xFFFF);
   var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
   return (msw << 16) | (lsw & 0xFFFF);
  }
  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function rol(num, cnt) {
   return (num << cnt) | (num >>> (32 - cnt));
  }
  /*
   * Convert an 8-bit or 16-bit string to an array of big-endian words
   * In 8-bit function, characters >255 have their hi-byte silently ignored.
   */
  function str2binb(str) {
   var bin = Array();
   var mask = (1 << chrsz) - 1;
   for (var i = 0; i < str.length * chrsz; i += chrsz)
   bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
   return bin;
  }
  /*
   * Convert an array of big-endian words to a string
   */
  function binb2str(bin) {
   var str = "";
   var mask = (1 << chrsz) - 1;
   for (var i = 0; i < bin.length * 32; i += chrsz)
   str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
   return str;
  }
  /*
   * Convert an array of big-endian words to a hex string.
   */
  function binb2hex(binarray) {
   var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
   var str = "";
   for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
   }
   return str;
  }
  /*
   * Convert an array of big-endian words to a base-64 string
   */
  function binb2b64(binarray) {
   var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
   var str = "";
   for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
    for (var j = 0; j < 4; j++) {
     if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
     else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
    }
   }
   return str;
  }

  return hex_sha1(data)
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */

export const md5 = (data) => {
  var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
  var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
  var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

  /*
  * These are the functions you'll usually want to call
  * They take string arguments and return either hex or base-64 encoded strings
  */
  function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
  function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
  function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
  function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
  function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
  function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

  /*
  * Perform a simple self-test to see if the VM is working
  */
  function md5_vm_test()
  {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length
  */
  function core_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data
  */
  function core_hmac_md5(key, data)
  {
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
  * Convert a string to an array of little-endian words
  * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
  */
  function str2binl(str)
  {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2str(bin)
  {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
  }

  /*
  * Convert an array of little-endian words to a hex string.
  */
  function binl2hex(binarray)
  {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
      str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
      hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
  }

  /*
  * Convert an array of little-endian words to a base-64 string
  */
  function binl2b64(binarray)
  {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
      var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
      | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
      |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
        else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
      }
    }
    return str;
  }

  return hex_md5(data)
}

// 24小时制  ’上午 08：00‘
export const startAtText = (str) => {
  let time = moment(str).toDate().pattern('HH:mm')
  let hour = parseInt(moment(str).toDate().pattern('HH'))
  let minute = parseInt(moment(str).toDate().pattern('mm'))

  if (hour < 9) {
      return "早上 " + time;
  } else if (hour < 11 && minute < 30) {
      return "上午 " + time;
  } else if (hour < 13 && minute < 30) {
      return "中午 " + time;
  } else if (hour < 18) {
      return "下午 " + time;
  } else {
      return "晚上 " + time;
  }
}

export const isUrl = (str) => {
　　var url = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
　　return url.test(str);
}

export const setStorage = (obj = {}) => {
  wx.setStorage(obj)
}

export const setStorageSync = (obj = {}) => {
  const { key, data } = obj
  try {
    wx.setStorageSync(key, data)
  } catch (e) {
  }
}

export const getStorage = (key) => {
  try {
    return wx.getStorageSync(key)

  } catch (e) {
    return ''
  }
}

export const setEntities = (options = {}) => {
  const app = getApp()
  if (!options) {
    return
  }

  const { key, value, status } = options

  if (!key || !value) {
    return
  }

  app.globalData.entities[key] = value
}


export const clearStorage = () => {
  wx.clearStorage()
}

export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
  // Do something when catch error
  }
}

export const handleError = (data, statusCode) => {
  switch (statusCode) {
    case 500:
    case 502:
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#48d9d8',
        content: '网络出了点小差~'
      })
      break
    default:
      break
  }
}

export const checkErrorMsg = (data, statusCode, isHideErrorMsg) => {
  if (!data || isHideErrorMsg) {
    return
  }
  let message = data._error && data._error.message
  if (message) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: message
    })
    return
  }

  handleError(data, statusCode)
}

export const clrearLoginStatus = () => {
  let app = getApp()
  removeStorage('current_user')
  app.globalData.wechatInfo = null
  app.globalData.userInfo = null
  return app.getWechatInfo()
}

export const checkStatus = (res) => {
  if (!res) {
    return
  }

  const data = res.data
  const statusCode = res.statusCode || 200

  return new Promise((resolve, reject) => {
    switch (statusCode) {
      case 401:
        clrearLoginStatus().then(resolve.bind(null, res), reject)
        break
      case 403:
      case 422:
      case 400:
      case 402:
      case 500:
      case 502:
      case 404:
        checkErrorMsg(data, statusCode, res.isHideErrorMsg)
        reject(res)
        break
      case 200:
      case 204:
      case 201:
        resolve(res)
        break
    }
  })
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "\u65e5",
    "1" : "\u4e00",
    "2" : "\u4e8c",
    "3" : "\u4e09",
    "4" : "\u56db",
    "5" : "\u4e94",
    "6" : "\u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f/u671f" : "\u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

export const timesBlock = ((start,end) => {
  var time = []
  var count = end - start
  var currentStart = start
  for (let i = 1; i <= count; i++) {
    let st = fullZero(currentStart)
    let st_n  = fullZero(currentStart + 1)
    time.push({
        idT   : currentStart + '-' + '1',
        hour : currentStart,
        minutes: 0,
        name : st + ':' + '00',
        //name : st + ':' + '00' + '-' + st + ':' + '30',
        selectTime : st + ':' + '00' + '-' + st + ':' + '30',
        status : 'normal',
        recordTime : st + ':' + '00'
    })

    time.push({
      idT   : currentStart + '-' + '2',
      hour : currentStart,
      minutes: 30,
      name : st + ':' + '30',
      //name : st + ':' + '30' + '-' + st_n + ':' + '00',
      selectTime : st + ':' + '30' + '-' + st_n + ':' + '00',
      status : 'normal',
      recordTime : st + ':' + '30'
    })

    ++currentStart
  }

  function fullZero (number) {
    if (number <= 9) {
      return '0' + number
    }

    return number
  }

  return time

})(0,24)


/**
* Base64 encode / decode
**/
const Base64 = {
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }

      }

      output = Base64._utf8_decode(output);

      return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }

      }

      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }

      }

      return string;
  }

}

// 获取当前用户位置
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        resolve(res)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

// 高德根据经纬度获取位置信息
export const getRegeo = (lat, lon) => {
  // let location = `${lon},${lat}`
  return new Promise((resolve, reject) => {
    myAmapFun.getRegeo({
      success: function(res){
        resolve(res)
      },
      fail: function(err){
        reject(err)
      }
    })
  })
}

export const toPay = (res) => {
  let app = getApp()
  // const data = res.wxapp
  app.globalData.wechatPay = res
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp : res.timeStamp,
      nonceStr  : res.nonceStr,
      package   : res.package,
      signType  : res.signType,
      paySign   : res.sign,
      success (res) {
        wx.showToast({
          title: '支付成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          resolve(res)
        }, 1000)
      },
      fail (error) {
        wx.showToast({
          title: '支付失败！',
          icon: 'success',
          duration: 2000
        })
        reject(error)
      },
      complete () {

      }
    })
  })
}

// 在Call api之前storage取一次
export const checkEntities = ({ key, api, params }) => {
  let app = getApp()
  const data = app.globalData.entities[key]

  return new Promise((resolve, reject) => {
    if (data) {
      return resolve(data)
    }

    api(params).then(res => {
      const data = res.data
      app.globalData.entities[key] = data
      resolve(data)
    }, reject)
  })
}

export const initSystemInfo = () => {

  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: function(res) {
        resolve(res)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

export const WXshare = (callback) => {
  wx.getSystemInfo({
      success: function(res) {
        const { version } = res
        let versionNum = version.split('.')
        if(versionNum[0] > 6){
          return
        }
        if(versionNum[0] == 6 && versionNum[1] > 5){
          return
        }
        if(versionNum[0] == 6 && versionNum[1] == 5 && versionNum[2] && versionNum[2] >= 8){
          return
        }
        callback && callback()
      }
    })
}


export const isSysTemUser = () => {
  let app = getApp()
  const userInfo = app.globalData.userInfo || {}

  return userInfo.id
}


export const loactionAddress = (callback) => {
  return new Promise((resolve, reject) => {
    myAmapFun.getRegeo({
      success:function(data){
          let address = data[0].regeocodeData.formatted_address.replace((data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.district),"")
          let startLocation = [data[0].longitude, data[0].latitude]
          let latitude = data[0].latitude
          let longitude = data[0].longitude
          let search_location = [data[0].longitude, data[0].latitude]
          let city = data[0].regeocodeData.addressComponent.city.length == 0 ? data[0].regeocodeData.addressComponent.province : data[0].regeocodeData.addressComponent.city
          let district = data[0].regeocodeData.addressComponent.district
          let province = data[0].regeocodeData.addressComponent.province
          let params = {
            startAddress: address,
            startLocation: startLocation,
            latitude: latitude,
            longitude: longitude,
            search_location: search_location,
            initial_city: city,
            district: district,
            province: province
          }
          resolve(params)
      },
      fail:function(e){
        wx.hideLoading()
        wx.getSetting({
          success: function(res){
            if(res.authSetting['scope.userLocation']){
              return
            }else{
              wx.showModal({
                title: '提示',
                content: '获取当前位置失败',
                confirmText: '确定',
                success(){
                  if (wx.openSetting) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userLocation']) {
                          // callback()
                        }
                      }
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    })
                  }
                }
              })
            }
          }
        })
        reject()
      }
    })
  })
}

export const selectDay = () => {
  const moment = require('./moment')
  let dayArray = []
  let showDayArray = []
  for(let i = 1; i <= 7; i++ ){
    dayArray.push(moment().add(i - 1, 'days').toDate().pattern('yyyy-MM-dd'))
    switch (i) {
      case 1:
        showDayArray.push('今天')
        break;
      case 2:
        showDayArray.push('明天')
        break;
      case 3:
        showDayArray.push('后天')
        break;
      default:
       showDayArray.push(moment().add(i - 1, 'days').toDate().pattern('MM月dd日'))
    }
  }
  let parmas = Object.assign({}, {showDayArray: showDayArray}, {dayArray: dayArray})
  return parmas
}

export const selectHour = () => {
  let showArray = []
  let hourArray = []
  for(let i = 0; i <= 23; i++){
    if(i < 10){
      showArray.push('0' + i + '时')
      hourArray.push('0' + i)
    }else{
      showArray.push(i + '时')
      hourArray.push(i)
    }
  }
  let parmas = Object.assign({}, {showHourArray: showArray}, {hourArray: hourArray})
  return parmas
}

export const selectMinute = () => {
  let showMinuteArray = []
  let new_showMinuteArray = []
  let minuteArray = []
  let mew_minuteArray = []
  for(let i = 0; i < 60; i++){
      if(i < 10){
        showMinuteArray.push('0' + parseInt(i/10)*10 + '分')
        minuteArray.push('0' + parseInt(i/10)*10)
      }else{
        showMinuteArray.push(parseInt(i/10)*10 + '分')
        minuteArray.push(parseInt(i/10)*10)
      }
  }
  for(var i = 0; i < showMinuteArray.length - 1; i++){
　　 if(new_showMinuteArray.indexOf(showMinuteArray[i]) == -1){
        new_showMinuteArray.push(showMinuteArray[i]);
　　 }
    if(mew_minuteArray.indexOf(minuteArray[i]) == -1){
        mew_minuteArray.push(minuteArray[i]);
　　 }
  }
  let parmas = Object.assign({}, {showMinuteArray: new_showMinuteArray}, {minuteArray: mew_minuteArray})
  return parmas
}


export const switch_date = (data) => {
  const moment = require('./moment')
  let dayArray = []
  for(let i = 0; i < 7; i++ ){
    switch(moment().add(i, 'days').format('dddd')){
      case 'Monday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')}, {week_txt: '周一'}));
          break;
      case 'Tuesday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周二'}));
          break;
      case 'Wednesday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周三'}));
          break;
      case 'Thursday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周四'}));
          break;
      case 'Friday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周五'}));
          break;
      case 'Saturday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周六'}));
          break;
      case 'Sunday': dayArray.push(Object.assign({}, {date_format: moment().add(i, 'days').format('dddd')}, {date_pattern: moment().add(i, 'days').toDate().pattern('yyyy-MM-dd')},{week_txt: '周日'}));
          break;
      default:
          break;
    }
  }
  return dayArray
}

export const startBg = (num) => {
  // var rate = this.course.rate ? parseFloat(this.course.rate) : 0;
	if(num == 0){
		return `background-image: url('http://image.zhishisenlin.com/start0.png');`
	}else if(num > 0 && num <= 0.5){
		return `background-image: url('http://image.zhishisenlin.com/start0-5.png');`
	}else if(num > 0.5 && num <= 1){
		return `background-image: url('http://image.zhishisenlin.com/start1.png');`
	}else if(num > 1 && num <= 1.5){
		return `background-image: url('http://image.zhishisenlin.com/start1-5.png');`
	}else if(num > 1.5 && num <= 2){
		return `background-image: url('http://image.zhishisenlin.com/start2.png');`
	}else if(num > 2 && num <= 2.5){
		return `background-image: url('http://image.zhishisenlin.com/start2-5.png');`
	}else if(num > 2.5 && num <= 3){
		return `background-image: url('http://image.zhishisenlin.com/start3.png');`
	}else if(num > 3 && num <= 3.5){
		return `background-image: url('http://image.zhishisenlin.com/start3-5.png');`
	}else if(num > 3.5 && num <= 4){
		return `background-image: url('http://image.zhishisenlin.com/start4.png');`
	}else if(num > 4 && num <= 4.5){
		return `background-image: url('http://image.zhishisenlin.com/start4-5.png');`
	}else if(num > 4.5 && num <= 5){
		return `background-image: url('http://image.zhishisenlin.com/start5.png');`
	}else{
		return `background-image: url('http://image.zhishisenlin.com/start0.png');`
	}
}

export const weChatLowVersion = () => {
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
    showCancel: false,
    confirmText: '知道了'
  })
}

export const ObjectArray = (data) => {
  let new_arr = []
  for(let i = 1; i <= 24; i++){
    if(data[String(i)] || data[String('0'+i)] ){
      let parmas = Object.assign({}, {time_line: data[String(i)] || data[String('0'+i)]}, {time: i+':00'})
      new_arr.push(parmas)
    }
  }
  return new_arr
}

export const arrayUnque = (data) => {
  return new Promise((resolve, reject) => {
    for(var i = 0; i < data.length-1; i++){
       for(var j = i+1; j < data.length; j++){
           if(data[i].groupId == data[j].groupId){
              data.splice(j,1);//console.log(arr[j]);
              j--;
           }
       }
    }
    resolve(data)
  })
}

export const arrayUnqueInfo = (data) => {
  return new Promise((resolve, reject) => {
    data && data.map(json => {
      for(var i = 0; i < json.travelVo.length-1; i++){
         for(var j = i+1; j < json.travelVo.length; j++){
             if(json.travelVo[i].groupId == json.travelVo[j].groupId){
                json.travelVo.splice(j,1);//console.log(arr[j]);
                j--;
             }
         }
      }
    })
    resolve(data)
  })
}

export const getDrivingRoute = (start, end) => {
  let start_loc = typeof(start) == 'string' ? start : start.join(',')
  let end_loc = typeof(end) == 'string' ? end : end.join(',')
  return new Promise((resolve, result) => {
    myAmapFun.getDrivingRoute({
      origin: start_loc,
      destination: end_loc,
      success: function(res){
        let time = parseInt(res.paths[0].duration/60) + '分钟'
        let distance = (Number(res.paths[0].distance)/1000).toFixed(1)
        let params = Object.assign({}, {duration: time}, {distance: distance})
        resolve(params)
      }
    })
  })
}

export const getPlanning = (parmas) => {
  let start_loc = typeof(parmas.start) == 'string' ? parmas.start : parmas.start.join(',')
  let end_loc = typeof(parmas.end) == 'string' ? parmas.end : parmas.end.join(',')
  let waypoints = typeof(parmas.waypoints) == 'object' ? parmas.waypoints.map(json =>　{
    return json.join(',')
  }).join(';') : parmas.waypoints
  return new Promise((resolve, result) => {
    myAmapFun.getDrivingRoute({
      origin: start_loc,
      destination: end_loc,
      waypoints: waypoints,
      strategy: parmas.strategy,
      success: function(data){
        let points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          let steps = data.paths[0].steps;
          for(let i = 0; i < steps.length; i++){
            let poLen = steps[i].polyline.split(';');
            for(let j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        let s = data.paths[0].duration, t
        if(s > -1){
            let hour = Math.floor(s/3600)
            let min = Math.floor(s/60) % 60
            if(hour != 0){
              hour = hour+'小时'
            }else{
              hour = ''
            }

            if(min != 0){
              min = min+'分钟'
            }else{
              min = ''
            }

            t = hour + min
        }
        let distance = (Number(data.paths[0].distance)/1000).toFixed(1)
        let parmas = Object.assign({}, {points: points}, {time: t}, {distance: distance})
        resolve(parmas)
      }
    })
  })
}


export const getWalkingRoute = (start, end) => {
  let start_loc = typeof(start) == 'string' ? start : start.join(',')
  let end_loc = typeof(end) == 'string' ? end : end.join(',')
  return new Promise((resolve, result) => {
    myAmapFun.getWalkingRoute({
      origin: start_loc,
      destination: end_loc,
      success: function(res){
        let time = parseInt(res.paths[0].duration/60) + '分钟'
        let distance = (Number(res.paths[0].distance)/1000).toFixed(1)
        let params = Object.assign({}, {duration: time}, {distance: distance})
        resolve(params)
      }
    })
  })
}

export const getServiceImg = (url) => {
  return new Promise((resolve, result) => {
    wx.downloadFile({
      url: url,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        }
      },
      fail: function(e){
        console.log(e)
      }
    })
  })
}

export const isAuthorized = () => {
  var app = getApp()
  return new Promise((resolve, result) => {
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userInfo']){
          resolve('authorized')
        }else{
          resolve('noAuthorized')
        }
      }
    })
  })
}

// maohao
export const errorText = (data) => {
  wx.showModal({
    title: '提示',
    content: data.failMsg,
    showCancel: false,
    confirmColor: '#48d9d8',
    success: function(res){
      if (res.confirm) {
        if(data.failMsg == '请重新登录'){
          wx.navigateTo({
            url: `/src/start/index?pageType=error`
          })
        }
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

export const navigateToUrl = (page, data) => {
  let url = Object.keys(data).length != 0 ? `/src/${page}/index?` : `/src/${page}/index`
  for (let i in data){
    url = url + `${i}=${data[i]}&&`
  }
  wx.navigateTo({
    url: url
  })
}

export const redirectToUrl = (page, data) => {
  let url = Object.keys(data).length != 0 ? `/src/${page}/index?` : `/src/${page}/index`
  for (let i in data){
    url = url + `${i}=${data[i]}&&`
  }
  wx.redirectTo({
    url: url
  })
}

export const navigateBackUrl = (num) => {
  wx.navigateBack({
    delta: num
  })
}

export const analysisHtml = (data) => {
  let newData = []
  data && data.map(json => {
    if(json.name == 'p'){
      if(json.children){
        newData = htmlChildren(json.children, json.name, newData)
      }
    }else if(json.name == 'img'){
      if(json.attrs){
        newData.push(htmlAttrs(json.attrs, json.name, newData))
      }
    }
  })
  return newData
}

export const htmlChildren = (data, name, array) => {
  let parmas = {}
  data && data.map(json => {
    if(json.attrs){
      parmas = Object.assign({}, {type: json.name}, {detail: json.attrs.src ? json.attrs.src : ''})
    }else if(json.children){
      parmas = twoHtmlChildren(json.children, json.name)
    }else{
      parmas = Object.assign({}, {type: name}, {detail: json.text ? json.text : ''})
    }
    array.push(parmas)
  })
  return array
}

export const twoHtmlChildren = (data, name) => {
  let parmas = {}
  let array = []
  data.map(json => {
    parmas = Object.assign({}, {type: name}, {detail: json.text ? json.text : ''})
    // array.push(parmas)
  })
  return parmas
}

export const htmlAttrs = (data, name) => {
  let parmas = Object.assign({}, {type: name}, {detail: data.src ? data.src : ''})
  return parmas
}

export const unArray = (data) => {
    var temp = [];
    var index = [];
    var l = data.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if(l == 0){
              return
            }
            if (data[i].id === data[j].id){
                i++;
                j = i;
            }
        }
        temp.push(data[i]);
        index.push(i);
    }
    // console.log(index);
    return temp;
}

export const textByteLength = (text,num) => {
  // text byte length
  let strLength = 0;
  let rows=1;
  let str=0;
  let arr=[];
  for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
    }
  arr.push(text.slice(str, text.length));
  //返回值为：[处理文字的总字节长度，每行显示内容的数组，行数]
  return [strLength, arr, rows];

}

export const textLength = (text, num) => {
  let array = []
  text.replace(/\s|\xA0|\↵/g,"")
  let newT = text ? text.split('') : ''
  for(let i = 0; i <= newT.length; i++){
    if(i < num){
      array.push(newT[i])
    }
  }
  if(array.length == num){
    array.push('...')
  }
  return array.join('')
}

export const seeImage = (img, imgArr) => {
  wx.previewImage({
    current: img, // 当前显示图片的http链接
    urls: imgArr // 需要预览的图片http链接列表
  })
}

export const newsText = (data) => {
  switch (data.type) {
    case 2:
    data.newsText = `关注了你`
    break;
    case 3:
    data.newsText = `关注了你的课《${data.extra_info.topicName}》`
    break;
    case 5:
    data.newsText = `最近一周有99个人来过你的主页`
    break;
    case 8:
    data.newsText = `点赞了你的评论`
    break;
    case 9:
    data.newsText = `回复了你的评论`
    break;
  }
  return data
}

export const appBuryPoint = (data) => {
  const api = require('./api')
  data.date = moment().toDate().pattern('yyyy-MM-dd HH:mm:ss')
  api.appBuryPoint({data: data})
}

export const numConversion = (num) => {
  let array = []
  if(num%1 === 0){
    array.push(num)
    array.push('0')
  }else{
    num = String(num).split('.')
    array.push(num[0])
    array.push(num[1])
  }
  return array
}

export const secondOrMinute = (s) => {
  /**
 * 将秒转换为 分:秒
 * s int 秒数
*/
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h  =   Math.floor(s/60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s  =   s%60;
    //将变量转换为字符串
    h    +=    '';
    s    +=    '';
    //如果只有一位数，前面增加一个0
    h  =   (h.length==1)?'0'+h:h;
    s  =   (s.length==1)?'0'+s:s;
    return h+':'+s;
}

export const twoDimensionalArray = (data) => {
  // let data = unArray(arr)
  let subArrayNum = 2
  var dataArr = new Array(Math.ceil(data.length / subArrayNum));
  for(let i = 0; i < dataArr.length;i++) {
      dataArr[i] = new Array()
      for(let j = 0; j < subArrayNum; j++) {
          dataArr[i][j] = {}
      }
  }
  for(let i = 0; i < data.length;i++) {
      dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = data[i]
  }
  return dataArr
}

// export const startList = (data) => {
//   let data = []
//   for(let i = 0; i <= 4; i++){
//     data.id = data.id + 1
//     array.push(data)
//   }
//   return array
// }
