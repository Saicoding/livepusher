// pages/index/index.js
let API_URL = "https://xcx2.chinaplat.com/laoxie/";
let app = getApp();
let hasInterval = false; //默认没有计时器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fairLevel: 0,
    whiteningLevel: 0,
    show: true,
    showSet: false,
    clarity: "RTC",
    isPlaying: false,
    isPauseing: false, //是否暂停中
    isVoiceOn: false, //是否开启声音，默认开启
    nums: 0, //直播间人数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    this.setData({
      videoBitrate: 0,
      audioBitrate: 0,
      videoFPS: 0,
      videoGOP: 0,
      netSpeed: 0
    })
  },

  /**
   * 直播状态改变时
   */
  stateChange: function(e) {
    let code = e.detail.code;

    switch (code) {
      case 1001:
        this.setData({
          prompt: "已经连接推流服务器"
        })
        break;
      case 1002:
        this.setData({
          prompt: "已经与服务器握手完毕,开始推流"
        })
        break;
      case 1003:
        this.setData({
          prompt: "打开摄像头成功"
        })
        break;
      case 1004:
        this.setData({
          prompt: "录屏启动成功"
        })
        break;
      case -1301:
        this.setData({
          prompt: "打开摄像头失败"
        })
        break;
      case 1101:
      case 1102:
        this.setData({
          prompt: "网络状况不佳"
        })
        break;
      case -1308:
        this.setData({
          prompt: "开始录屏失败，可能是被用户拒绝"
        })
        break;
      case -1308:
        this.setData({
          prompt: "开始录屏失败，可能是被用户拒绝"
        })
        break;
      case 1006:
      case 1005:
      case 1008:
      case 3005:
      case 1007:
        this.setData({
          prompt: "",
        })
        break;
      case -1307:
        this.setData({
          prompt: "网络断连"
        })
        break;
      default:
        this.setData({
          prompt: code
        })
        break;
    }
  },

  /**
   * 网络状态
   */
  netstatus: function(e) {
    let info = e.detail.info;
    let videoBitrate = info.videoBitrate; //当前视频编/码器输出的比特率，单位 kbps
    let audioBitrate = info.audioBitrate; //当前音频编/码器输出的比特率，单位 kbps
    let videoFPS = info.videoFPS; //当前视频帧率
    let videoGOP = info.videoGOP; //当前视频 GOP,也就是每两个关键帧(I帧)间隔时长，单位 s
    let netSpeed = info.netSpeed; //当前的发送/接收速度
    let netJitter = info.netJitter; //网络抖动情况，抖动越大，网络越不稳定

    this.setData({
      videoBitrate: videoBitrate,
      audioBitrate: audioBitrate,
      videoFPS: videoFPS,
      videoGOP: videoGOP,
      netSpeed: netSpeed,
      netJitter: netJitter
    })
  },

  /**
   * 发生错误时
   */
  error: function(e) {
    let message = e.detailerrMsg;
    let errorCode = e.detail.errorCode
    this.setData({
      errorCode: errorCode,
      message: message
    })
  },

  /** 
   * 点击视频显示控制面板
   */
  toogleShow: function(e) {
    let self = this;

    let show = self.data.show;
    let showSet = self.data.showSet;

    if (showSet) {
      show = true;
      showSet = false;
    } else {
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
  myset: function() {
    let self = this;
    let showSet = self.data.showSet;


    this.setData({
      showSet: true,
      show: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.ctx = wx.createLivePusherContext('pusher', this);

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

      let id = zcode + k

      self.setData({
        id: id
      })

      if (!hasInterval) {
        hasInterval = true;
        let LoginRandom = user.Login_random;
        let zcode = user.zcode;

        let interval = setInterval((res) => {
          app.post(API_URL, "action=getRoomNums&Loginrandom=" + LoginRandom + "&zcode=" + zcode, false, false, "").then((res) => {
            let nums = res.data.data[0].nums;

            self.setData({
              nums: nums
            })
          })
        }, 2000)
      }
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
  changeClarity: function(e) {
    let clarity = e.currentTarget.dataset.clarity;
    this.setData({
      clarity: clarity
    })
  },

  /**
   * 开始直播或者恢复直播
   */
  start: function() {
    let self = this;
    let isPauseing = self.data.isPauseing; //是否是暂停中

    if (isPauseing) { //如果暂停
      this.ctx.resume({ //恢复直播
        success: res => {
          self.setData({
            isPlaying: true,
            isPauseing: false,
            isVoiceOn: false,
          })
        },
        fail: res => {
          console.log('start fail')
        }
      })
    } else {
      this.ctx.start({
        success: res => {
          self.setData({
            isPlaying: true,
            isVoiceOn: false,
          })
        },
        fail: res => {
          console.log('start fail')
        }
      })
    }
  },

  /**
   * 暂停直播
   */
  pause: function() {
    let self = this;
    this.ctx.pause({
      success: res => {
        self.setData({
          isVoiceOn: true,
          isPlaying: false,
          isPauseing: true,
          videoBitrate: 0,
          audioBitrate: 0,
          videoFPS: 0,
          videoGOP: 0,
          netSpeed: 0
        })
      }
    })
  },

  /**
   * 停止直播
   */
  stop: function() {
    let self = this;
    this.ctx.stop({
      success: res => {
        self.setData({
          isPlaying: false,
          isVoiceOn: true,
          videoBitrate: 0,
          audioBitrate: 0,
          videoFPS: 0,
          videoGOP: 0,
          netSpeed: 0
        })
      }
    })
  },

  /**
   * 退出登录
   */
  loginOut: function() {
    wx.showModal({
      content: '您确定要退出登录吗？',
      confirmColor: '#0097f5',
      success(res) {
        if (res.confirm) {
          let url = encodeURIComponent('/pages/mine/mineIndex/mineIndex');
          wx.removeStorageSync('user');

          wx.removeStorage({
            key: 'user',
            success: function(res) {
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
  setFair: function(e) {
    let fair = e.currentTarget.dataset.fair;
    let fairLevel = this.data.fairLevel;

    if (fair == "0" && fairLevel > 0) { //点了减号
      fairLevel--;
      this.setData({
        fairLevel: fairLevel
      })
    }

    if (fair == "1" && fairLevel < 9) {
      fairLevel++;
      this.setData({
        fairLevel: fairLevel
      })
    }
  },

  /**
   * 设置美白
   */
  setWhitening: function(e) {
    let whitening = e.currentTarget.dataset.whitening;
    let whiteningLevel = this.data.whiteningLevel;

    if (whitening == "0" && whiteningLevel > 0) { //点了减号
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
  /**
   * 设置是否静音
   */
  setVoice: function() {
    this.setData({
      isVoiceOn: !this.data.isVoiceOn
    })
  },

  /**
   * 设置前后摄像头
   */
  setCamera: function() {
    let self = this;
    this.ctx.switchCamera({
      success: function() {}
    })
  }

})