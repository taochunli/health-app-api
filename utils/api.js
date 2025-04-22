// API基础URL
const BASE_URL = 'https://example.com/api';

// 请求方法封装
const request = (url, method, data = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    
    // 合并请求头
    const defaultHeader = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      defaultHeader['Authorization'] = `Bearer ${token}`;
    }
    
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {...defaultHeader, ...header},
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            // 业务逻辑错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权，重新登录
          wx.removeStorageSync('token');
          wx.navigateTo({
            url: '/pages/login/login'
          });
          reject('未授权');
        } else {
          // 其他错误
          wx.showToast({
            title: '服务器错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// 请求方法
const API = {
  // GET请求
  get: (url, data = {}, header = {}) => {
    return request(url, 'GET', data, header);
  },
  
  // POST请求
  post: (url, data = {}, header = {}) => {
    return request(url, 'POST', data, header);
  },
  
  // PUT请求
  put: (url, data = {}, header = {}) => {
    return request(url, 'PUT', data, header);
  },
  
  // DELETE请求
  delete: (url, data = {}, header = {}) => {
    return request(url, 'DELETE', data, header);
  }
};

// API接口地址
const APIS = {
  // 用户相关
  user: {
    login: '/user/login',
    register: '/user/register',
    info: '/user/info',
    update: '/user/update'
  },
  
  // 健康相关
  health: {
    symptoms: '/health/symptoms',
    symptomDetail: '/health/symptom/detail',
    diseases: '/health/diseases',
    diseaseDetail: '/health/disease/detail'
  },
  
  // AI问答相关
  ai: {
    chat: '/ai/chat',
    history: '/ai/history'
  },
  
  // 健康预防相关
  prevention: {
    list: '/prevention/list',
    detail: '/prevention/detail'
  },
  
  // 饮食健康相关
  diet: {
    recommendations: '/diet/recommendations',
    detail: '/diet/detail'
  }
};

module.exports = {
  API,
  APIS
};
