// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fairLevel:0,
    whiteningLevel:0,
    show: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let styles = [{
        "select": 0
      },
      {
        "select": 0
      },
      {
        "select": 0
      },
      {
        "select": 1
      }
    ];

    let styles1 = [{
        "type": "warn"
      },
      {
        "type": "default",
        "disabled": true,
        "str":"暂停直播"
      },
      {
        "type": "warn"
      },
      {
        "type": "warn"
      }
    ];

    this.setData({
      styles: styles,
      styles1: styles1
    })
  },

  /** 
     * 点击视频显示控制面板
     */
  toogleShow: function (e) {
    let self = this;

    let show = self.data.show;

    if (!show) {
      let myInterval = self.data.myInterval;
      clearInterval(myInterval);
      let interval = setTimeout(function () {
        self.setData({
          show: false
        })
      }, 3000)
      self.setData({
        myInterval: interval
      })
    }

    self.setData({
      show: !self.data.show
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

  changeType: function(e) {
    let self = this;
    let type = e.currentTarget.dataset.type;
    let styles = [{
        "select": 0
      },
      {
        "select": 0
      },
      {
        "select": 0
      },
      {
        "select": 0
      }
    ];

    styles[type - 1].select = 1;

    self.setData({
      styles: styles
    })
  },

  changeType1: function(e) {
    let self = this;

    let click = e.currentTarget.dataset.click;
    let styles1 = self.data.styles1;

    switch (click) {
      //点击开始直播
      case "1":
        if (styles1[0].type == "warn") { //如果没有开始直播
          styles1[1].type = "warn"
          styles1[1].disabled = false;
          styles1[0].type = "primary";
        }else{
          styles1[0].type = "warn";
          styles1[1].disabled = true;
          styles1[1].type = "default";
        }
        break;

        //点击暂停直播
      case "2":
        if (styles1[1].type == "warn") { //如果没有开始直播
          styles1[1].type = "primary";
          styles1[1].str = "继续直播"
        } else if (styles1[1].type == "primary") {
          styles1[1].type = "warn"
          styles1[1].str = "暂停直播"
        }
        break;

        //点击切换摄像头
      case "3":
        if (styles1[2].type == "warn") { //如果没有开始直播
          styles1[2].type = "primary";
        } else {
          styles1[2].type = "warn"
        }
        break;

        //点击切换静音
      case "4":
        if (styles1[3].type == "warn") { //如果没有开始直播
          styles1[3].type = "primary";
        } else {
          styles1[3].type = "warn"
        }
        break;
    }

    self.setData({
      styles1: styles1
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
    let set = e.currentTarget.dataset.set;
    if(set == "0"){//点了减号
      
    }
  },

  /**
   * 设置美白
   */
  setWhitening:function(e){

  }
})