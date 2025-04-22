Page({
  data: {
    username: '',
    password: '',
    agreed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 输入用户名
   */
  inputUsername: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  /**
   * 输入密码
   */
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 勾选协议
   */
  checkboxChange: function(e) {
    this.setData({
      agreed: e.detail.value.length > 0
    });
  },

  /**
   * 登录
   */
  login: function() {
    const { username, password, agreed } = this.data;
    
    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }
    
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    
    if (!agreed) {
      wx.showToast({
        title: '请先阅读并同意用户协议',
        icon: 'none'
      });
      return;
    }
    
    // 模拟登录成功
    wx.showLoading({
      title: '登录中...',
    });
    
    // 模拟请求延时
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存登录状态
      wx.setStorageSync('isLoggedIn', true);
      wx.setStorageSync('userInfo', { username: username });
      
      // 返回上一页而不是跳转到首页
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  },

  /**
   * 跳转到注册
   */
  goToRegister: function() {
    wx.showToast({
      title: '注册功能暂未开放',
      icon: 'none'
    });
  }
})
