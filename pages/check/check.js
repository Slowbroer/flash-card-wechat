// pages/check/check.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_id: null,
    card_id: null,
    front : '',
    back: '',
    cardType: 1, // 1 front, 0 back
    animation1: null,//正面卡片动画
    animation2: null,//背面卡片动画
  },

  animation: wx.createAnimation({
    duration: 1000,
    timingFunction: 'linear'
   }),

   rotateFn(e) {
    let that = this
    let id = this.data.cardType
    // 正面朝上
    if(id == 1) {
      this.setData({
      animation1: that.animation.rotateY(180).step().export(),
      animation2: that.animation.rotateY(0).step().export()
      })
    } else { //反面朝上
      this.setData({
      animation1: that.animation.rotateY(0).step().export(),
      animation2: that.animation.rotateY(180).step().export()
      })
    }
    this.setData({
      cardType: 1 - id
    })
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var book_id = options.book_id
    // var book_name = options.book_name
    this.setData({
      "book_id": book_id
    })
    if (! book_id) {
      wx.showModal({
        content: '必须先选择抽记本，如果没有请新建抽记本',
        mask: true,
        complete: function() {
          wx.navigateTo({
            url: '../book/list',
          })
        }
      })
    }

    app.wxRequest(
      "POST",
      "flash_card/check/init",
      {
        "book_id": book_id
      },
      function(res){
        that.getCardInfo(book_id)
      },
      function(err){
        console.log('get cards error')
        return false
      })
  },

  getCardInfo: function(book_id){
    var that = this
    app.wxRequest(
      "GET",
      "flash_card/check",
      {
        "book_id": book_id
      },
      function(res){
        console.log(res.data.data)
        if (res.data.data && res.data.data.length !== 0) {
          that.setData({
            card_id: res.data.data.id,
            front: res.data.data.front,
            back: res.data.data.back,
          })
        }
      },
      function(err){
        console.log('get card info error')
        return false
      })
  },

  nextCardInfo: function(event){
    var that = this
    var book_id = event.currentTarget.dataset.book
    app.wxRequest(
      "GET",
      "flash_card/check",
      {
        "book_id": book_id
      },
      function(res){
        if (res.data.data) {
          that.setData({
            card_id: res.data.data.id,
            front: res.data.data.front,
            back: res.data.data.back,
          })
        }
      },
      function(err){
        console.log('get next card info error')
        return false
      })
  },


  sendCheckResult: function(event){
    var that = this
    var result = event.currentTarget.dataset.result
    var book_id = this.data.book_id
    var card_id = this.data.card_id
    app.wxRequest(
      "POST",
      "flash_card/check/" + card_id,
      {
        "book_id": book_id,
        "result": result
      },
      function (res){
        that.getCardInfo(book_id)
      },
      function (err){
        console.log('send check result error')
        return false
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})