// pages/flash_card/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_id : null,
    book_name : null,
    id : null,
    front : null,
    back : null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var card_id = options.card_id
    var book_id = options.book_id
    if (! book_id) {
      wx.showModal({
        content: '必须先选择抽认本，如果没有请新建抽认本',
        mask: true,
        complete: function() {
          wx.navigateTo({
            url: '../book/list',
          })
        }
      })
    }

    console.log("this book is " + book_id)
    this.setData({
      'book_id': book_id
    })

    if (card_id) {
      this.getCardInfo(card_id)
    }
  },

  getCardInfo: function (card_id) {
    var that = this
    app.wxRequest(
      "GET",
      "flash_card/card/" + card_id,
      {},
      function(res) {
        var info = res.data.data
        if (info) {
          that.setData({
            id: info.id,
            front: info.front,
            back: info.back
          })
        }
        return false
      },
      function(err) {
        console.log("get the card information error")
      })
  },

  submitCardInfo: function(event) {
    console.log(event)
    console.log("test")
    let {front, back} = event.detail.value

    console.log(front)
    console.log(back)
    console.log(this)
    if (front && back) {
      var from_data = {
        "front": front,
        "back": back,
        "book_id": this.data.book_id
      }
      if (this.data.id) {
        this.updateFlashCard(this.data.id,from_data)
      }
      else {
        this.addFlashCard(from_data)
      }
    }
    else {
      wx.showModal({
        content: "请填写完整抽认卡",
        mask: true,
        complete: function() {
          return false
        }
      })
    }
  },

  addFlashCard: function(data) {
    var that = this
    app.wxRequest(
      "POST",
      "flash_card/card",
      data,
      function(res) {
        wx.showToast({
          title: '提交成功',
          success: function(res) {
            // wx.navigateBack({
            //   delta: 1,
            // })
            wx.navigateTo({
              url: "../flash_card/list?book_id=" + that.data.book_id
            })
          }
        })
      },
      function(err) {
        wx.showToast({
          title: '提交失败，请稍后再试',
          success: function(res) {
            wx.navigateBack({
              delta: 1,
            })
            // wx.redirectTo({
            //   url: "../flash_card/list?book_id=" + that.data.book_id
            // })
          }
        })
      })
  },
  updateFlashCard: function(id,data) {
    var that = this
    app.wxRequest(
      "POST",
      "flash_card/card/" + id,
      data,
      function(res) {
        wx.showToast({
          title: '提交成功',
          success: function(res) {
            wx.navigateBack({
              delta: 1,
            })
            // wx.redirectTo({
            //   url: "../flash_card/list?book_id=" + that.data.book_id
            // })
          }
        })
      },
      function(err) {
        wx.showToast({
          title: '提交失败，请稍后再试',
          success: function(res) {
            wx.navigateBack({
              delta: 1,
            })
            // wx.redirectTo({
            //   url: "../flash_card/list?book_id=" + that.data.book_id
            // })
          }
        })
      })
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