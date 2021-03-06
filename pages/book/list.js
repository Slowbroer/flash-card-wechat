// pages/book/list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [
      
    ],
    page: 0,
    first_show: true,
    refresh: false
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

  getBooks: function(){
    var that = this
    var page = ++that.data.page
    app.wxRequest(
      "GET",
      'flash_card/book',
      {
        "page": page
      },
      function (res) {
        var books = that.data.books
        // loading the book list
        that.setData({
          books: books.concat(res.data.data.items),
          page: page
        })
      },
      function (err) {}
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getBooks()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      'first_show': false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.refresh){
      this.setData({
        books:[],
        page:0
      })
      this.getBooks()
    }
    this.setData({
      refresh: false
    })
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
    this.setData({
      "books":[],
      "page":0
    })
    this.getBooks()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBooks()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})