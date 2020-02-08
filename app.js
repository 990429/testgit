1//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'sitp2019-tjzy',
      traceUser:true
    })
  },
  globalData: {
    currentRouter: null,
    userInfo: null,
    user: null,
    studentId: null,
    js_code: null,
    globalBGColor: '#0BDDB8 ',
    bgRed: 11,
    bgGreen: 221,
    bgBlue: 185,
  }
})