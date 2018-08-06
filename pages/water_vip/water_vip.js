import MQTT from '../../utils/mqtt'

const app = getApp()

Page({

  data: {
    money: 0,
    max_dosage: 0,
    tds: 0,
    isClose: false,
    client: null
  },

  onLoad(e) {
    this.init(e)

    this.socket(e.mac)
  },

  //MQTT
  socket(mac) {
    const that=this
    let client = new MQTT.Client('wss://api.ourslinks.com/mqtt', randomString())
    let options = {
      keepAliveInterval: 10,
      onSuccess: onConnect
    }

    client.onConnectionLost = onConnectionLost
    client.onMessageArrived = onMessageArrived
    client.connect(options)

    //MQTT连接
    function onConnect() {
      //订阅
      client.subscribe(`dt2014/js/${mac}`, {
        onSuccess() {
          console.log('订阅成功')
        }
      })
    }

    //MQTT消息
    function onMessageArrived(msg) {
      wx.showLoading({title: '结算中', mask: true})
      app.data.order_vip = JSON.parse(msg.payloadString)
      that.data.isClose = true
      wx.closeSocket({code: 1000})
      wx.redirectTo({url: '/pages/water_vip_over/water_vip_over'})
      wx.hideLoading()
    }

    //MQTT连接断开
    function onConnectionLost(res) {
      if (res.errorCode !== 0) {
        console.log('onConnectionLost:' + res.errorMessage)
        if (!that.data.isClose && !client.isConnected()) {
          client.connect(options)
        }
      }
    }
  },

  init(e) {
    this.data.mac_id = e.mac_id
    let tds = e.tds || 0
    if (tds !== undefined && Number(tds) === 0) {
      tds = 0
    } else if (tds !== undefined && tds.length === 1) {
      tds = '00' + tds
    } else if (tds !== undefined && tds.length === 2) {
      tds = '0' + tds
    }
    this.setData({
      tds
    })
  },

  onShow() {
    this.setData({
      money: wx.getStorageSync('money'),
      max_dosage: wx.getStorageSync('max_dosage')
    })
  },

  //停止取水
  stopWater() {
    wx.showLoading({title: '结算中', mask: true})
    app.api.close_water({
      user_id: wx.getStorageSync('user_id'),
      device_id: this.data.mac_id
    }).then(res => {
      // console.log(res)
      // app.data.order_vip = res.data
      // wx.redirectTo({url: '/pages/water_vip_over/water_vip_over'})
    })
  }
})

function randomString(len) {
  len = len || 32
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
