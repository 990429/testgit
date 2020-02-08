//import {login} from '../../api/http'
// pages/login/login.js

let app = getApp();
// 获取云数据库引用
const db = wx.cloud.database();
//const admin = db.collection('adminlist');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: null,
    password: null,
    checked: false
  },
  //表单更改
  adInputChange: function(e) {
    let that = this;
    // console.log(e)
    if(e.currentTarget.dataset.obj === "number") {
    that.setData({
    number: e.detail.value,
  })
  }else if (e.currentTarget.dataset.obj === "password") {
      that.setData({
        password: e.detail.value,
      })
    } 
  },
  //勾选框更改
  checkboxChange(e) {
    if (e.detail.value == '') {
      this.setData({
        checked: false,
      })
    } else {
      this.setData({
        checked: true,
      })
    }
  },
  //登录
  signIn: function (e)  {
    let that = this;
    if (that.data.number && that.data.password && that.data.checked) {
      //登录获取用户信息
      db.collection('adminlist').where({ number: that.data.number }).get({
        success: function (res) {
          let userinfo = res.data;
          console.log(userinfo);
            if (userinfo && userinfo.length>0) { //用户存在
            let user=userinfo[0];
              if (that.data.password !== user.password) {  //判断密码是否正确
                wx.showToast({
                  title: '密码错误！！',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '登录成功！',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      //要延时执行的代码
                      wx.switchTab({
                        url: '/pages/my/my'
                      });
                    }, 1000) //延迟时间
                  },
                })
              }
            } else {   //不存在
              wx.showToast({
                title: '用户不存在',
                icon: 'success',
                duration: 2500
              })
            }
          
        }
      })
    }
    else{
      wx.showToast({
        title: '请填写完整',
        icon: 'success',
        duration: 2500
      })
    }
    },
  
  toRegisterPage() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }

  })