//import {register} from '../../api/http'
// pages/register/register.js

const app = getApp()

const db = wx.cloud.database();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //倒计时
    second:60,
    //按钮可点击
    disabled: false,
    number: null,
    password: null,
    vc:null,
    sendVc:null
  },
  


  //表单更改
  adInputChange: function (e) {
    let that = this;
    // console.log(e)
    if (e.currentTarget.dataset.obj === "password") {
      that.setData({
        password: e.detail.value,
      })
    } else if (e.currentTarget.dataset.obj === "number") {
      that.setData({
        number: e.detail.value,
      })
    } else if (e.currentTarget.dataset.obj === "vc") {
      that.setData({
        vc: e.detail.value,
      })
    }
  },
 

//生成随机验证码
  createVCode() {
    var sendVc;
    //首先默认code为空字符串
    sendVc = '';
    //设置长度，这里看需求，我这里设置了4
    var codeLength = 4;
    //设置随机字符
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    //循环codeLength 我设置的4就是循环4次
    for (var i = 0; i < codeLength; i++) {
      //设置随机数范围,这设置为0 ~ 10
      var index = Math.floor(Math.random() * 10);
      //字符串拼接 将每次随机的字符 进行拼接
      sendVc += random[index];
    }
    //将拼接好的字符串赋值给展示的code
    this.setData({
      sendVc: sendVc
    })
  },

//发送邮件，获取验证码
getVCode(){
  if (this.data.number == '' || this.data.number == null || this.data.number == undefined  ){
    wx.showToast({
      title: '请先填写学号!',
      duration: 2000
    })
  }else{
    //验证码倒计时
    this.setData({ status: true })
    let time = setInterval(() => {
      let second = this.data.second;
      second--;
      this.setData({ second: second });

      if (second == 0) {
        clearInterval(time);
        this.setData({ second: 60, status: false });
      }
    }, 1000)
  //生成验证码
    this.createVCode();
  //发送邮件
    wx.cloud.callFunction({
      name: "sendMail",
      data: {
        number: this.data.number,
        VCode: this.data.sendVc
      },
      success(res) {
        console.log("邮件发送成功", res)
        wx.showToast({
          title: '邮件已发送',
          duration: 2000
        })
      },
      fail(res) {
        console.log("邮件发送失败", res)
      }
    })
  }
},

  //注册
  registerNew: function (e) {
    var that = this;
    if (that.data.number == '') {
      console.log('a')
      wx.showToast({
        title: '学号不能为空',
        duration: 2000
      })
    } else if (that.data.password == '') {
      console.log('b')
      wx.showToast({
        title: '密码不能为空',
        duration: 2000
      })
    } else if (that.data.vc == '') {
      console.log('c')
      wx.showToast({
        title: '请填写验证码',
        duration: 2000
      })
    }
    db.collection('adminlist').where({ number: that.data.number }).get({
      success: function (res) {
        let userinfo = res.data;
        console.log(res.data.length)
        console.log(userinfo)
        if (userinfo && userinfo.length>0) {
          let user = userinfo[0];
          if(user && user.number){
          wx.showToast({
            title: '该学号已经注册了',
            duration: 2000
          })
          }
        } else {
          if (that.data.vc == that.data.sendVc){
          that.saveuserinfo();
          }
          else{
            wx.showToast({
              title: '验证码输入错误',
              duration: 2000
            })
          }
        }
      }
    })
  },

  saveuserinfo:function(e) {
    var that = this;
    db.collection('adminlist').add({
      data: {
        number: that.data.number,
        password: that.data.password,
      },
      success: function (res) {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000, 
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateTo({
                url: '/pages/login/login'
              });
            }, 1000) //延迟时间
          },

        })
        
      }
    })
  },

})