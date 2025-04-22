// pages/login/login.js
const Request = require('../../utils/request');
const Storage = require('../../utils/storage');
const { APIS } = require('../../utils/api');
const config = require('../../utils/config');

Page({
  data: {
    username: '',
    password: '',
    agreed: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 检查是否是从其他页面跳转过来的
    this.setData({
      redirectUrl: options.redirect || '/pages/home/home'
    });
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
    const { username, password, agreed, redirectUrl } = this.data;
    
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
    
    // 显示加载中
    this.setData({ loading: true });
    wx.showLoading({
      title: '登录中...',
    });
    
    // 调用登录API
    Request.post(APIS.user.login, {
      username: username,
      password: password
    })
    .then(res => {
      // 登录成功
      const { token, userInfo, expireTime } = res.data;
      
      // 保存登录状态和用户信息
      Storage.setToken(token, expireTime);
      Storage.setUserInfo(userInfo);
      
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      // 登录成功后跳转
      setTimeout(() => {
        if (redirectUrl.startsWith('/pages/')) {
          wx.switchTab({
            url: redirectUrl,
            fail: () => {
              // 如果不是tabBar页面，使用navigateTo
              wx.navigateTo({
                url: redirectUrl,
                fail: () => {
                  // 如果仍然失败，回到首页
                  wx.switchTab({
                    url: '/pages/home/home'
                  });
                }
              });
            }
          });
        } else {
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }, 1500);
    })
    .catch(err => {
      wx.hideLoading();
      this.setData({ loading: false });
      
      wx.showToast({
        title: err.msg || '登录失败，请重试',
        icon: 'none'
      });
    });
  },

  /**
   * 跳转到注册
   */
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  
  /**
   * 查看用户协议
   */
  viewUserAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    });
  },
  
  /**
   * 查看隐私政策
   */
  viewPrivacyPolicy: function() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=privacy'
    });
  }
})
