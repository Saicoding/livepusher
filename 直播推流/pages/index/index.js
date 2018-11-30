// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fairLevel:0,
    whiteningLevel:0,
    show: true,
    showSet:false,
    clarity:"RTC"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
  },

  /** 
     * 点击视频显示控制面板
     */
  toogleShow: function (e) {
    let self = this;

    let show = self.data.show;
    let showSet = self.data.showSet;

    console.log(showSet)

    if(showSet){
      show = true;
      showSet = false;
    }else{
      show = true;
    }

    self.setData({
      show: show,
      showSet: showSet
    })
  },

  /**
   * 切换显示视频设置
   */
  myset:function(){
    let self = this;
    let showSet = self.data.showSet;


    this.setData({
      showSet: true,
      show:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.ctx = wx.createLivePusherContext('pusher');
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    let user = wx.getStorageSync("user");

    if (user) {
      let k = user.k;
      let zcode = user.zcode;

      let id = k + zcode

      self.setData({
        id: id
      })

    } else {
      let url = encodeURIComponent('/pages/index/index');

      wx.navigateTo({
        url: '/pages/login1/login1?url=' + url + '&ifGoPage=false',
      })
    }
  },

  /**
   * 改变清晰度
   */
  changeClarity:function(e){
    let clarity =  e.currentTarget.dataset.clarity;
    this.setData({
      clarity:clarity
    })
  },

  bindStart:function(){
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  /**
   * 退出登录
   */
  loginOut:function(){
    wx.showModal({
      content: '您确定要退出登录吗？',
      confirmColor: '#0097f5',
      success(res) {
        if (res.confirm) {
          let url = encodeURIComponent('/pages/mine/mineIndex/mineIndex');
          wx.removeStorageSync('user');

          wx.removeStorage({
            key: 'user',
            success: function (res) {
              let url = encodeURIComponent('/pages/index/index');
              wx.navigateTo({
                url: '/pages/login1/login1?url=' + url + '&ifGoPage=false',
              })
            },
          })
        }
      }
    })
  },
  /**
   * 设置美颜
   */
  setFair:function(e){
    let fair = e.currentTarget.dataset.fair;
    let fairLevel = this.data.fairLevel;
    
    if (fair == "0" && fairLevel >0){//点了减号
      fairLevel--;
      this.setData({
        fairLevel: fairLevel
      })
    }

    if(fair == "1" && fairLevel < 9){
      fairLevel++;
      this.setData({
        fairLevel: fairLevel
      })
    }
  },

  /**
   * 设置美白
   */
  setWhitening:function(e){
    let whitening = e.currentTarget.dataset.whitening;
    let whiteningLevel = this.data.whiteningLevel;

    if (whitening == "0" && whiteningLevel > 0) {//点了减号
      whiteningLevel--;
      this.setData({
        whiteningLevel: whiteningLevel
      })
    }

    if (whitening == "1" && whiteningLevel < 9) {
      whiteningLevel++;
      this.setData({
        whiteningLevel: whiteningLevel
      })
    }
  },

})