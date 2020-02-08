// pages/add/add.js
let app = getApp()
Page({
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(app.globalData.currentRouter.indexOf('/add-detail'))
    if (app.globalData.currentRouter.indexOf('/add-detail') == -1) {
      wx.navigateTo({
        url: '/pages/add-detail/add-detail',
        success: (result) => { },
        fail: () => { },
        complete: () => { }
      });
    }
  },
})