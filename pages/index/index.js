// pages/index/index.js
const app = getApp()
const blueTooth = app.blueTooth

const MAC = '4C:E1:73:B7:88:FE'
let _deviceId = ''
const serviceId = '11223344-5566-7788-99AA-BBCCDDEEFF00'
const characteristicId = '00004A5B-0000-1000-8000-00805F9B34FB'

const hex_command_str = 'F05876362F314663794B4944433573305268435578554F4E533359495265514F476D642F45626B7961396F362B4E5A445A3053763762434258423757487A4D676A55534F4655486A714F4F677854617771525577364B49513D3DF1'

// import { formatTime, ab2hex, hexCharCodeToStr, hexTObuffer, writeVal } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */

  data: {
    devicesList: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log('wx.openBluetoothAdapter: ')
    // 初始化ble
    blueTooth('openBluetoothAdapter', {
      success (res) {
        // 获取设备状态
        blueTooth('getBluetoothAdapterState', {
          success(res) {
            // 可用
            if (res.available) {
              // blueTooth('stopBluetoothDevicesDiscovery', {
              //   success: function (res) {
                  // 开始搜索 
                  blueTooth('startBluetoothDevicesDiscovery', {
                    success(res) {
                      // 每隔500ms获取所有设备
                      setInterval(() => {
                        blueTooth('getBluetoothDevices', {
                          success (e) {
                            const device_list = e.devices
                            for (let i = 0; i < device_list.length; i++) {
                              const device_mac = hexCharCodeToStr(ab2hex(device_list[i].advertisData))
                              device_mac && console.log(device_mac)
                              if (device_mac === MAC) {
                                _deviceId = device_list[i].deviceId
                                console.log('this device\'s id is :', _deviceId)
                                // 创建连接
                                blueTooth('createBLEConnection', {
                                  success () {
                                    let arr = []
                                    for (let j = 0; j < hex_command_str.length; j++) {
                                      arr.push(hex_command_str.slice(j * 40, (j+1) * 40))
                                    }
                                    // 写入数据
                                    writeVal(arr, {
                                      deviceId: _deviceId,
                                      serviceId,
                                      characteristicId
                                    })
                                  }
                                })
                                // 停止搜索
                                blueTooth('stopBluetoothDevicesDiscovery', {})

                              }
                            }
                          }
                        })
                      }, 500)
                    }
                  })
              //   },
              //   fail: function (res) { },
              //   complete: function (res) { }
              // })
            } else {
              _this.showModal()
            }
          },
          fail() {
            _this.showModal()
          }
        })
      }
    })
    

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
    blueTooth('openBluetoothAdapter', {
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
    blueTooth('closeBluetoothAdapter', {
      success(res) {
        console.log('------------closeBluetoothAdapter------------------------')
        console.log(res)
      }
    })
  },

  watchSelf: function () {
    let _this = this
    blueTooth('getBluetoothAdapterState', {
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
    blueTooth('startBluetoothDevicesDiscovery', {
      data: {
        // services: ['0000180A-0000-1000-8000-00805F9B34FB'],
        // services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
        // services: ['F000FFC0-0451-4000-B000-000000000000'],
        // services: ['0000AF00-0000-1000-8000-00805F9B34FB'],

        // services: ['11223344-5566-7788-99AA-BBCCDDEEFF00'],
        // services: ['11223344-5566-7788-99AA-BBCCDDEEFF00'],
        // services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
        // services: ['FFF0'],
        allowDuplicatesKey: false,
      },
      success(res) {
        console.log('------------startBluetoothDevicesDiscovery------------------------')

        wx.onBluetoothDeviceFound(function (res) {
          console.log(res.devices[0])
          let advertisData = res.devices[0].advertisData
          let devices = _this.data.devicesList
          for (let i = 0; i < devices.length; i++) {
            if (devices[i].deviceId === res.devices[0].deviceId) {
              return
            }
          }
          devices.push(res.devices[0])
          _this.setData({
            devicesList: devices
          })
          // let data = res.devices[0]
          // console.log(res.devices[0].name, '---',  _this.ab2hex(data.advertisData), '------')
        })
      }
    })
  },

  endSearch: function () {
    let _this = this
    blueTooth('stopBluetoothDevicesDiscovery', {
      success(r) {
        if (!r.discovering) {  // 不在搜索状态，否则重复调用报错
          blueTooth('stopBluetoothDevicesDiscovery', {
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
    blueTooth('getBluetoothDevices', {
      success(res) {
        console.log('------------getBluetoothDevices------------------------')
        console.log(res)
      }
    })
  },

  deviceFound: function () {
    let _this = this
    blueTooth('onBluetoothDeviceFound', function (res) {
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

  allConnectedDevices () {
    blueTooth('getConnectedBluetoothDevices', {
      success () {

      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let _this = this

  },

})


// 设备连接之后，将 deviceid 存储，监听到断开之后，直接静默连接
// onBLEConnectionStateChange 监听连接状态变化


// onBluetoothAdapterStateChange 接口可以监听手机蓝牙所有状态变化(开关蓝牙、初始化、关闭蓝牙模块、开始搜索、停止搜索)
// ios系统蓝牙不论是否打开，onBluetoothAdapterStateChange 接口都可以监听到所有状态
// Android必须初始化蓝牙模块之后才能监听状态变化(意为打开蓝牙，并且初始化之后开启的监听才能监听到所有状态变化)，


// 平台不同（Android / IOS）或者 接口不同，返回的状态码不一样，错误统一处理困难

// 安卓上，关闭蓝牙，初始化蓝牙，再调用getBluetoothAdapterState 查看本机状态，可以调用成功
// 安卓上，关闭蓝牙，调用关闭接口会报10000，但是ios会调用成功

// 安卓上，关闭蓝牙，调用stopdiscover接口，上报10001，但是IOS调用成功

// 安卓上，关闭蓝牙，调用getBluetoothDevices接口，10001， 但是IOS上是10000

// 

// openBluetoothAdapter
// closeBluetoothAdapter 
// getBluetoothAdapterState 
// onBluetoothAdapterStateChange  
// startBluetoothDevicesDiscovery
// stopBluetoothDevicesDiscovery
// getBluetoothDevices
// createBLEConnection
// closeBLEConnection
// getBLEDeviceServices
// getBLEDeviceCharacteristics
// writeBLECharacteristicValue
// notifyBLECharacteristicValueChange
// onBLECharacteristicValueChange
// 
// 
// 


// 关闭蓝牙:
// closeBluetoothAdapter (安卓失败10001，ios成功)
// 
// 
// 
// 
// 
// 
// 
//