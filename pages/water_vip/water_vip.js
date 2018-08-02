const app = getApp()

Page({

  data: {
    money: 0,
    max_dosage: 0,
    tds: 0
  },

  onLoad(e) {
    this.data.mac_id = e.mac_id
    let tds = e.tds
    if (tds !== undefined && Number(tds) === 0) {
      tds = 0
    } else if (tds !== undefined && tds.length === 1) {
      tds = '00' + tds
    }else if (tds !== undefined && tds.length === 2) {
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

  stopWater() {
    app.api.close_water({
      user_id: wx.getStorageSync('user_id'),
      device_id: this.data.mac_id
    }).then(res => {
      app.data.order_vip = res.data
      wx.redirectTo({url: '/pages/water_vip_over/water_vip_over'})
    })
  }
})
