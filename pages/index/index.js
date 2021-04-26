// index.js
// 获取应用实例
const app = getApp()

function login_success(res){
  console.log(res)
  if (res.data.status != 200){
    console.log('login failed')
    return false
  } 
  // jump to the book list 
  wx.setStorage({
    data: res.data.data.token,
    key: 'auth_token',
  })
  console.log("redirect to book list")
  wx.redirectTo({
    url: "../book/list"
  })
}

function login_fail(err){
  console.log("login failed")
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    wx.hideShareMenu();
    var that = this
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 获取token，如果有token就跳转到book列表页面，如果没有token的话就执行登陆操作
    var token = wx.getStorage({
      key: 'auth_token',
      success(res) {
        console.log(res.data) // token
        if (res.data) {
          // jump to book list
          console.log('local token is :' + res.data)
          wx.redirectTo({
            url: "../book/list"
          })
        }
      },
      fail() {
        wx.login({
          success (res) {
            if (res.code) {
              // console.log(res.code)
              var auth_data = {
                code: res.code,
                // password: Date.parse(new Date()),
                nickname: that.data.userInfo.nickName
              }
              // 后端请求登陆
              app.wxRequest("POST","flash_card/auth",auth_data,login_success,login_fail,false)
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
