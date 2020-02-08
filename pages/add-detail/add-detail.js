// pages/add-detail/index.js
import {
  turnToLogin
} from '../../lib/loginRequire.js'
const app = getApp()
const db = wx.cloud.database()
const productsCollection = db.collection('products')
Page({
  data: {
    imgList: [],
    imgs: "../images/camera.png",
    fileIDs: [],//图片返回路径
    title: "",
    descripe: '',
    price: '',
    type_index: null,
    picker: ['口红', '面霜', '眉笔', '唇膏', '洗面奶', '护肤品', '洗发水', '其他'],
    loadModal: false,
    load_text: "正在上传信息"
  },
  //表单更改
  adInputChange: function (e) {
    let that = this;
    // console.log(e)
    if (e.currentTarget.dataset.obj === "title") {
      that.setData({
        title: e.detail.value,
      })
    } else if (e.currentTarget.dataset.obj === "price") {
      that.setData({
        price: e.detail.value,
      })
    } else if (e.currentTarget.dataset.obj === "descripe") {
      that.setData({
        descripe: e.detail.value,
      })
    }
  },
  //类型选择
  PickerChange(e) {
    // console.log(e);
    this.setData({
      type_index: Number(e.detail.value) + 1
    })
  },

  /*uploadImgHandle: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempImg: tempFilePaths
        })
      }
    })
  },*/

  //添加图
  /* selectImage: function () {
      let that = this;
      wx.chooseImage({ 
        sizeType: ['original', 'compressed'],//图片形式
        sourceType: ['album', 'camera'],//图片来源
        success: function (res) {
          res.tempFilePaths.forEach(function (item) {
            that.data.imgs.push({
              img: item
            })
          })
          that.setData({
            imgList: that.data.imgs
          })
          // console.log(that.data.imgList)
        },
      })
    },
    // 删除图片
    deleteImg: function (e) {
      var imgList = this.data.imgList;
      var index = e.currentTarget.dataset.index;
      imgList.splice(index, 1);
      this.setData({
        imgList: imgList,
        imgs: imgList
      });
    },
    // 预览图片
    previewImg: function (e) {
      //获取当前图片的下标
      var index = e.currentTarget.dataset.index;
      //所有图片
      var imgList = this.data.imgList.map(function (item) {
        return item.img;
      });
  
      wx.previewImage({
        //当前显示图片
        current: imgList[index],
        //所有图片
        urls: imgList
      })
    },*/
  //发布提交
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.getStorageSync("sessionid")) {
    //   turnToLogin('login required')
    // }
    /////添加
    var that = this;
    wx.cloud.callFunction({
      name: "update",
      success: function (res) {
        var mockdata = res.result.data;
        var ba = [];
        var i = 1;
      },
      fail: console.error
    })
  },
  res: function (e) {
    var that = this;
    const db = wx.cloud.database()
    wx.showLoading({
      title: '提交中',
    })
  
    db.collection('user').add({
      data: {
      
        title: e.detail.value.title,
        descripe: e.detail.value.descripe,
        price: e.detail.value.price,
        picker: e.detail.value.picker,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.switchTab({
          url: '../index/index',
        })
        this.setData({
          title: e.detail.value.title,
          descripe: e.detail.value.descripe,
          price: e.detail.value.price,
          picker: e.detail.value.picker,
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    wx.showToast({
      title: '发布成功'
    })
  },

  chooseImage() {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              imgs: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到users集合表
            const db = wx.cloud.database();
            db.collection("user").add({
              data: {
                imgs: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const router = app.globalData.currentRouter;
    app.globalData.currentRouter = this.route;
    wx.switchTab({
      url: '/' + router,
    });
  },
}
)