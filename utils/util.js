const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const ab2hex = (buffer) => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// 16进制转字符串
const hexCharCodeToStr = (hexCharCodeStr) => {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x"
      ?
      trimedStr.substr(2)
      :
      trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    console.log("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

// 16 进制转 ArrayBuffer 
const hexTObuffer = (hex) => {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  })).buffer
}

const writeVal = (arr, info) => {
  if (arr.length <= 0) {
    return
  }
  bluetooth('writeBLECharacteristicValue', {
    data: {
      ...info,
      value: hexTObuffer(arr[0])
    },
    success: function () {
      console.log('success')
      console.log(arr[0])
      arr.shift()
      writeVal(arr, info)
    },
    fail: function () {
      console.log('fail')
      return
    },
    complete: function () {

    }
  })
}

const blueTooth = (name, params) => {  // 封装函数 统一处理异常状态
  let data = params.data || {}
  if (params instanceof Function) {
    wx[name](function (res) {
      params(res)
    })
  } else if (params instanceof Object) {
    wx[name]({
      ...data,
      success(res) {
        console.log(res)
        params.success && params.success(res)
      },
      fail(err) {  // 未打开蓝牙或者蓝牙未初始化
        console.log(err)
        Toast({
          msg: '请先打开系统蓝牙',
          duration: 2000
        })
      },
      complete(res) {
        // 异常状态处理
        console.log('complete')
        console.log(res)
        console.log(res.errMsg.indexOf('fail'))
        if (res.errMsg.indexOf('fail') !== -1) {
          Toast({
            msg: res.errMsg,
            duration: 3000
          })
        }
        params.complete && params.complete(res)
      }
    })
  } else {
    console.error('function blueTooth params must be a function or an object in app.js')
  }
}

module.exports = {
  formatTime,
  ab2hex,
  hexCharCodeToStr,
  hexTObuffer,
  blueTooth,
  writeVal
}


