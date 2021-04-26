// pages/book/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "name": null,
    "id": null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this
    var book_id = options.book_id
    if (book_id) {
      app.wxRequest(
        "GET",
        "flash_card/book/" + book_id,
        {},
        function (res){
          that.setData({
            id: book_id,
            name: res.data.data.name
          }) 
        },
        function (err){

        }
      )
    }
  },

  submitBookInfo: function(event) {
    // var book_name = event.currentTarget.dataset.name
    let {name} = event.detail.value
    if (! name){
      wx.showModal({
        content: "抽记本名字不能为空",
        mask: true,
        complete: function() {
          return false
        }
      })
      return false
    }
    var book_id = this.data.id
    var uri = book_id ? "flash_card/book/" + book_id : "flash_card/book"
    var that = this
    app.wxRequest(
      "POST",
      uri,
      {
        name: name
      },
      function(res) {
        wx.redirectTo({
          url: '../book/list',
        })
      },
      function(err) {
        wx.redirectTo({
          url: '../book/list',
        })
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