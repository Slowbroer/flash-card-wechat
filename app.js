// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    URL:"http://127.0.0.1:5000/",
    authFailCode: 405,
  },
  wxRequest(method, uri, data, callback, errFun, needToken=true) {
    if (needToken) {
      token = wx.getStorageSync('auth_token')
      if (! token){
        wx.navigateTo("/pages/index/index")
      }
    }
    wx.request({
      url: this.globalData.URL + uri,
      method: method,
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'token': token
      },
      success: function(res){
        status = res.data.status
        if (status == null) { // 没有状态值，报错
          return false
        }
        // 如果是身份验证失败的，跳转到首页进行登陆
        if (status == this.globalData.authFailCode && uri != "auth") {
          wx.removeStorageSync('auth_token')
          wx.redirectTo({
            url: "pages/index/index"
          })
        }
        if (status == 200) {
          callback(res)
        }
        return false
      },
      fail: function(err){
        errFun(err)
      }
    })
  }
})
