// pages/book/list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books:[
      
    ]
  },

  bookClick: function(event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    if (id) {
      console.log("jump to book " + id)
      wx.navigateTo({
        url: '../flash_card/list?book_id=' + id + "&book_name=" + name
      })
    }
    return false
  },

  addBook: function(event) {
    wx.navigateTo({
      url: "../book/info"
    })
  },

  editBook: function(event) {
    var book_id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: "../book/info?book_id=" + book_id
    })
  },

  deleteBook: function (event) {
    var that = this
    var book_id = event.currentTarget.dataset.id
    wx.showModal({
      content: '删除该抽认本会同时将里面的抽认卡全部删除，确定要删除该抽认本吗',
      mask: true,
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(
            "DELETE",
            "flash_card/book/" + book_id,
            {},
            function (res) {
              app.wxRequest(
                "GET",
                'flash_card/book',
                {},
                function (res) {
                  // loading the book list
                  that.setData({books:res.data.data.items})
                },
                function (err) {}
              )
            }
          )
        } else if (res.cancel) {
          return false
        }
      }
    })


  },

  checkBook: function (event) {
    var book_id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: "../check/check?book_id=" + book_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this
    app.wxRequest(
      "GET",
      'flash_card/book',
      {},
      function (res) {
        // loading the book list
        that.setData({books:res.data.data.items})
      },
      function (err) {}
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