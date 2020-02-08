// pages/home-page/home-page.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {
      nearby: [],
      Recommend: [],
      food: [],
      Electronics: [],
      Clothes: [],
      Else: [],
      Book: [],
      car: [],
      TabletPC: [],
      Game: [],
      HouseholdElectricAppliances: [],
      Toymusicalinstrument: [],
      Outdoorsport: [],
      Ticketing: [],
      Computer: [],
      DailyUse: [],
      OfficeEquipment: [],
    },
    navList: [{
      name: "食品",
      Egname: "food"
    }, {
      name: "服饰",
      Egname: "Clothes"
    },{
      name: "图书",
      Egname: "Book"
    },{
      name: "生活用品",
      Egname: "DailyUse"
    },{
      name: "办公用具",
      Egname: "OfficeEquipment"
    },{
      name: "玩具乐器",
      Egname: "Toymusicalinstrument"
    },{
      name: "数码用品",
      Egname: "Electronics"
    },{
      name: "其他",
      Egname: "Else"
    }],
  },
  loadList: function (type, page) {   //加载首页瀑布流数据
    var that = this;
    wx.request({    //发送请求
      url:'https://www.baidu.com' /*'https://liyan6987.cn/goods/get_goods_list'*/, // 仅为示例，并非真实的接口地址
      type: 'get',
      data: {
        page: page,
        type: type,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'cookie':wx.getStorageSync("sessionid")//读取cookie
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.loadList(1, 1);
    this.loadList(2, 1);
    this.loadList(3, 1);
    this.loadList(4, 1);
    this.loadList(5, 1);
    this.loadList(6, 1);
    this.loadList(7, 1);
    this.loadList(8, 1);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.currentRouter = this.route
    console.log(app.globalData.currentRouter)
  },

 
  /**
   * 用户点击首页搜索
   */
  homeSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  /**
   * 用户点击瀑布流事件
   */
})