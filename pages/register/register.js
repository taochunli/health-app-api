// pages/register/register.js
const Request = require('../../utils/request');
const Storage = require('../../utils/storage');
const { APIS } = require('../../utils/api');

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verificationCode: '',
    agreed: false,
    countdown: 0,
    loading: false
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
   * 确认密码
   */
  inputConfirmPassword: function(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  /**
   * 输入手机号
   */
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 输入验证码
   */
  inputVerificationCode: function(e) {
    this.setData({
      verificationCode: e.detail.value
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
   * 获取验证码
   */
  getVerificationCode: function() {
    const { phone, countdown } = this.data;
    
    if (countdown > 0) return;
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    // 校验手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '发送中...',
    });
    
    // 调用发送验证码API
    Request.post(APIS.user.sendVerificationCode, { phone })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '验证码已发送',
          icon: 'success'
        });
        
        // 开始倒计时
        this.setData({ countdown: 60 });
        this.startCountdown();
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.msg || '发送失败，请重试',
          icon: 'none'
        });
      });
  },

  /**
   * 倒计时
   */
  startCountdown: function() {
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
        return;
      }
      
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  /**
   * 注册
   */
  register: function() {
    const { username, password, confirmPassword, phone, verificationCode, agreed } = this.data;
    
    // 表单验证
    if (!username) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    
    if (password.length < 6) {
      wx.showToast({ title: '密码长度不能少于6位', icon: 'none' });
      return;
    }
    
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' });
      return;
    }
    
    if (!phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    
    if (!verificationCode) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    
    if (!agreed) {
      wx.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
      return;
    }
    
    // 显示加载中
    this.setData({ loading: true });
    wx.showLoading({ title: '注册中...' });
    
    // 调用注册API
    Request.post(APIS.user.register, {
      username,
      password,
      phone,
      verificationCode
    })
    .then(res => {
      wx.hideLoading();
      this.setData({ loading: false });
      
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500
      });
      
      // 注册成功后返回登录页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    })
    .catch(err => {
      wx.hideLoading();
      this.setData({ loading: false });
      
      wx.showToast({
        title: err.msg || '注册失败，请重试',
        icon: 'none'
      });
    });
  },

  /**
   * 返回登录页
   */
  goToLogin: function() {
    wx.navigateBack();
  }
})
