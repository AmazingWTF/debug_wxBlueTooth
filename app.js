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
          Toast({
            msg: '请先打开系统蓝牙',
            icon: 'clear',
            duration: 2000
          })
        },
        complete(res) {
          // 异常状态处理
          params.complete && params.complete(res)
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