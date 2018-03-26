//app.js
import { Toast } from 'components/wxu'

App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null
  },

  blueTooth: function (name, params) {  // 封装函数 统一处理异常状态
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
          // Toast({
          //   msg: '请先打开系统蓝牙',
          //   duration: 2000
          // })
        },
        complete(res) {
          // 异常状态处理
          console.log('complete')
          console.log(res)
          console.log(res.errMsg.indexOf('fail'))
          // if (res.errMsg.indexOf('fail') !== -1) {
          //   Toast({
          //     msg: res.errMsg,
          //     duration: 3000
          //   })
          // }
          // params.complete && params.complete(res)
          // return
          const errCode = res.errCode + ''
          let msg = ''
          if (errCode.indexOf('10000') !== -1) {
            msg = '未初始化蓝牙适配器'
          } else if (errCode.indexOf('10001') !== -1) {
            msg = '当前蓝牙适配器不可用'
          } else if (errCode.indexOf('10002') !== -1) {
            msg = '没有找到指定设备'
          } else if (errCode.indexOf('10003') !== -1) {
            msg = '连接失败'
          } else if (errCode.indexOf('10004') !== -1) {
            msg = '没有找到指定服务'
          } else if (errCode.indexOf('10005') !== -1) {
            msg = '没有找到指定特征值'
          } else if (errCode.indexOf('10006') !== -1) {
            msg = '当前连接已断开'
          } else if (errCode.indexOf('10007') !== -1) {
            msg = '当前特征值不支持此操作'
          } else if (errCode.indexOf('10008') !== -1) {
            msg = '其余所有系统上报的异常'
          } else if (errCode.indexOf('10009') !== -1) {
            msg = '系统版本低于4.3，不支持BLE'
          }
          Toast({
            msg,
            duration: 3000,
            success () {
              return false
            }
          })
        }
      })
    } else {
      console.error('function blueTooth params must be a function or an object in app.js')
    }
  }

  // 蓝牙关掉，
  // 提交订单，判断是否开启蓝牙，未开启蓝牙则告诉后端
  // 开启蓝牙，但是设备返回信息超时，则是设备问题
  // 

})