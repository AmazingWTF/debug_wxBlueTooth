// pages/index/index.js
const app = getApp()
const bluetooth = app.blueTooth
Page({

  /**
   * 页面的初始数据
   */

  data: {
    devicesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log('wx.openBluetoothAdapter: ')
    // bluetooth('openBluetoothAdapter', {
    //   success (res) {
        bluetooth('getBluetoothAdapterState', {
          success(res) {
            if (res.available) {
              // open
              bluetooth('stopBluetoothDevicesDiscovery', {
                success: function (res) {
                  bluetooth('startBluetoothDevicesDiscovery', {
                    success() {
                    }
                  })
                },
                fail: function (res) { },
                complete: function (res) { }
              })
            } else {
              _this.showModal()
            }
          },
          fail() {
            _this.showModal()
          }
        })
    //   }
    // })
    

    let str = ''
  },

  showModal () {
    wx.showModal({
      title: '请打开蓝牙',
      content: 'openBlueTooth',
      showCancel: true,
      cancelText: '取消',
      confirmText: '已打开',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    let _this = this
    console.log('index page onShow')
    let count = 0

  },

  onStateChange() {
    console.log('onStateChage ------')
    wx.onBluetoothAdapterStateChange((res) => {
      console.log('state chaged')
      console.log(res)
    })
  },

  open: function () {
    let _this = this
    // 初始化蓝牙
    bluetooth('openBluetoothAdapter', {
      success(res) {
        console.log('------------openBluetoothAdapter------------------------')
        console.log(res)
        // 监听蓝牙状态变化
      },
      fail(err) {
        console.log('openBluetoothAdapter fail')
        console.warn(err)
      }
    })
  },

  close: function () {
    let _this = this
    // 关闭蓝牙模块
    bluetooth('closeBluetoothAdapter', {
      success(res) {
        console.log('------------closeBluetoothAdapter------------------------')
        console.log(res)
      }
    })
  },

  watchSelf: function () {
    let _this = this
    bluetooth('getBluetoothAdapterState', {
      success(res) {
        console.log('------------getBluetoothAdapterState------------------------')
        console.log(res)
      },
      fail: function (res) {
        console.log('fail')
        console.log(res)
      },
      complete: function (re) {
        console.log('complete')
        console.log(re)
      }
    })
  },

  startSearch: function () {
    let _this = this
    bluetooth('startBluetoothDevicesDiscovery', {
      data: {
        // services: ['0000180A-0000-1000-8000-00805F9B34FB'],
        // services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
        // services: ['F000FFC0-0451-4000-B000-000000000000'],
        // services: ['0000AF00-0000-1000-8000-00805F9B34FB'],

        services: ['11223344-5566-7788-99AA-BBCCDDEEFF00'],
        // services: ['11223344-5566-7788-99AA-BBCCDDEEFF00'],
        // services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
        allowDuplicatesKey: false,
      },
      success(res) {
        console.log('------------startBluetoothDevicesDiscovery------------------------')

        // wx.onBluetoothDeviceFound(function (res) {
        //   console.log(res.devices[0])
        //   let advertisData = res.devices[0].advertisData
        //   let devices = _this.data.devicesList
        //   for (let i = 0; i < devices.length; i++) {
        //     if (devices[i].deviceId === res.devices[0].deviceId) {
        //       return
        //     }
        //   }
        //   devices.push(res.devices[0])
        //   _this.setData({
        //     devicesList: devices
        //   })
        //   // let data = res.devices[0]
        //   // console.log(res.devices[0].name, '---',  _this.ab2hex(data.advertisData), '------')
        // })
      }
    })
  },

  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  // 16进制转字符串
  hexCharCodeToStr(hexCharCodeStr) {
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
  },

  endSearch: function () {
    let _this = this
    bluetooth('stopBluetoothDevicesDiscovery', {
      success(r) {
        if (!r.discovering) {  // 不在搜索状态，否则重复调用报错
          bluetooth('stopBluetoothDevicesDiscovery', {
            success(res) {
              console.log('------------stopBluetoothDevicesDiscovery------------------------')
              console.log(res)
              console.log('_this.data.devicesList:')
              console.log(_this.data.devicesList)
            }
          })
        }
      }
    })
  },

  allDevices: function () {
    let _this = this
    bluetooth('getBluetoothDevices', {
      success(res) {
        console.log('------------getBluetoothDevices------------------------')
        console.log(res)
      }
    })
  },

  deviceFound: function () {
    let _this = this
    bluetooth('onBluetoothDeviceFound', function (res) {
      console.log('device found trigger')
      console.log(res)
    })
  },

  // 跳转连接设备页面
  toConnect: function (res) {
    console.log(res)
    const deviceId = res.currentTarget.dataset.deviceid
    const name = res.currentTarget.dataset.name
    wx.setStorage({
      key: 'deviceId',
      data: deviceId,
    })
    wx.navigateTo({
      url: `../../pages/connect/connect?deviceId=${deviceId}&name=${name}`,
    })
  },

  valueChange: function (res) {
    console.log('valueChange')
    console.log(res)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let _this = this

  },

})
