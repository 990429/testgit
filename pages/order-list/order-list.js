// pages/order-list/index.js
import {
  turnToLogin
} from '../../lib/loginRequire.js'

var page = [1, 1, 1, 1]; //分页标识：第几次获取（当前页数）
var allPages = [1, 1, 1, 1]; //分页标识：总页数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值
    relation_id: 1, //发请求用：1:卖出;2:发布;3:喜欢
    statusType: ["我发布的", "我卖出的", "我买到的", "我想要的"],
    winHeight: "", //窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    lowerThreshold: '30rpx',
    // upperThreshold: 50,
    // hideHeader: true,
    hideBottom: true,
    // refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    orderList: []

  },

  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    // let relation_id =null;
    // switch (e.detail.current) {
    //   case 0: relation_id = 2;break;
    //   case 1: relation_id = 1;break;
    //   // case 2: relation_id = 4;break;
    //   case 3: relation_id = 3;break;
    // }
    // this.setData({
    //   relation_id: relation_id
    // });
    this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.index;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      })
      // let relation_id = null;
      // switch (this.data.currentTab) {
      //   case 0: relation_id = 2;break;
      //   case 1: relation_id = 1;break;
      //   // case 2: relation_id = 4;break;
      //   case 3: relation_id = 3;break;
      // }
      // this.setData({
      //   relation_id: relation_id
      // });
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //跳转
  getOrder: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/goods-detail/index?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  //跳转聊天
  tapChat: function() {
    wx.navigateTo({
      url: "/components/chat/chat"
    });
  },

  //清除页面数据
  clearCache: function(index) {
    if (index) {
      //下拉刷新时清除指定页面
      page[index] = 1;
      let item = this.data.orderList;
      item[index] = [];
      this.setData({
        orderList: item
      })
    } else {
      //初始化所有数据
      page = [1, 1, 1, 1]; //分页标识归零
      this.setData({
        orderList: [
          [],
          [],
          [],
          []
        ] //文章列表数组清空
      });
    }
  },

  //scroll-view监听用户下拉刷新动作
  refresh: function() {
    var that = this;
    let currentTab = that.data.currentTab
    // console.log('下拉刷新');
    var date = new Date();
    that.setData({
      // refreshTime: date.toLocaleTimeString(),
      // hideHeader: false,
      hideBottom: true
    })
    that.clearCache(currentTab);
    that.getUserGoods(Number(currentTab), page[currentTab])
  },

  //scroll-view页面上拉触底事件的处理函数
  loadMore: function() {
    var that = this;
    var currentTab = that.data.currentTab
    if (that.data.orderList[currentTab].length) {
      console.log('上拉加载更多');
      var page_index = page[currentTab]
      that.setData({
        hideBottom: false
      })
      that.getUserGoods(Number(currentTab), page_index); //后台获取新数据并追加渲染
    }
  },

  //获取页面数据
  getUserGoods: function(currentTab, pg = 1, tip = 0) {
    //currentTab表示当前导航值；pg表示当前要加载页数(一页10个)。传0返回全部，不传默认第一页；tip可选，默认为0
    // console.log(page)
    let that = this;
    if (currentTab != undefined) {
      let relation_id = 1;
      switch (currentTab) {
        case 0:
          relation_id = 2;
          break;
        case 1:
          relation_id = 1;
          break;
          // case 2: relation_id = 4;break;
        case 3:
          relation_id = 3;
          break;
      }
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync("sessionid") //读取cookie
      };
      wx.request({
        url: 'https://liyan6987.cn/user/get_user_goods',
        method: 'get',
        header: header,
        data: {
          relation_id: relation_id,
          page: pg,
        },
        success(res) {
          if (res.statusCode == 200) {
            if (pg == 1) {
              //初始加载/下拉刷新
              setTimeout(function() {
                // allPages[currentTab] = res.data.allpages;
                let item = that.data.orderList;
                item[currentTab] = res.data.goods;
                that.setData({
                  orderList: item,
                  // hideHeader: true
                })
              }, 400)
            } else {
              //上拉触底获取更多
              if (res.data.total == 0) {
                //已经是最后一页
                that.setData({
                  loadMoreData: '已经到底喽~'
                })
                return;
              } else {
                setTimeout(function() {
                  console.log('加载更多');
                  // allPages[currentTab] = res.data.allpages;
                  let item = that.data.orderList;
                  item[currentTab].push.apply(item[currentTab], res.data.goods);
                  that.setData({
                    orderList: item,
                    hideBottom: true
                  })
                }, 500)
              }
            }
            page[currentTab]++;
          } else if (res.statusCode == 202) {
            turnToLogin(res.data.message)
            // wx.showToast({
            //   title: '请求错误',
            //   icon: 'none',
            //   image: '/images/info.png',
            //   duration: 2000,
            // })
          }
        },
        fail(err) {
          wx.showToast({
            title: '数据异常',
            icon: 'none',
            image: '/images/info.png',
            duration: 2000,
          })
        },
        complete() {
          wx.stopPullDownRefresh()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    //页面跳转
    if (options && options.type) {
      this.setData({
        currentTab: options.type
      });
      // let relation_id = 1;
      // switch (options.type) {
      //   case 0: relation_id = 2;break;
      //   case 1: relation_id = 1;break;
      //   // case 2: relation_id = 4;break;
      //   case 3: relation_id = 3;break;
      // }
      // this.setData({
      //   relation_id: relation_id
      // });
      this.clearCache();
      this.getUserGoods(0, page[0])
      this.getUserGoods(1, page[1])
      this.getUserGoods(3, page[3])
    }

    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100; //计算swiper的高度
        that.setData({
          winHeight: calc
        });
      }
    });
  },
})