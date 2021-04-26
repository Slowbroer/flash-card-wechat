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
    // URL:"http://127.0.0.1:5000/",
    URL:"https://www.slowbro.cn/",
    authFailCode: 401,
  },
  wxRequest: function(method, uri, data, callback, errFun, needToken=true) {
    if (needToken) {
      var token = wx.getStorageSync('auth_token')
      if (! token){
        wx.navigateTo({
          url: "/pages/index/index"
        })
      }
    }

    var authFailCode = this.globalData.authFailCode
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: this.globalData.URL + uri,
      method: method,
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "JWT " + token
      },
      success: function(res){
        console.log("request "+uri+" success")
        var status = res.data.status
        if (status == null) { // 没有状态值，报错
          return false
        }
        // 如果是身份验证失败的，跳转到首页进行登陆
        if (status == authFailCode && uri != "auth") {
          wx.removeStorageSync('auth_token')
          wx.redirectTo({
            url: "/pages/index/index"
          })
        }
        if (status == 200) {
          console.log("callback the success")
          callback(res)
        }
        wx.showModal({
          content: res.data.msg,
          mask: true,
          complete: function() {
            return false
          }
        })
        return false
      },
      fail: function(err){
        console.log("request "+uri+" failed")
        return false
        errFun(err)
      }
    })
    wx.hideLoading({
      success: (res) => {},
    })
  }
})
