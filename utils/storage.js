/**
 * 本地存储工具类
 */

const config = require('./config');

const Storage = {
  /**
   * 设置缓存
   * @param {string} key - 缓存键名
   * @param {any} value - 缓存内容
   * @param {number} [expireTime] - 过期时间(毫秒)，不传则使用默认配置时间
   */
  set: (key, value, expireTime) => {
    const prefixedKey = `${config.cachePrefix}${key}`;
    const expireAt = Date.now() + (expireTime || config.cacheTime);
    const data = {
      value,
      expireAt
    };
    
    try {
      wx.setStorageSync(prefixedKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  /**
   * 获取缓存
   * @param {string} key - 缓存键名
   * @param {any} [defaultValue] - 默认值，当缓存不存在或已过期时返回
   * @returns {any} 缓存值或默认值
   */
  get: (key, defaultValue = null) => {
    const prefixedKey = `${config.cachePrefix}${key}`;
    
    try {
      const dataStr = wx.getStorageSync(prefixedKey);
      if (!dataStr) return defaultValue;
      
      const data = JSON.parse(dataStr);
      
      // 检查是否过期
      if (data.expireAt && data.expireAt < Date.now()) {
        Storage.remove(key);
        return defaultValue;
      }
      
      return data.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  /**
   * 移除缓存
   * @param {string} key - 缓存键名
   */
  remove: (key) => {
    const prefixedKey = `${config.cachePrefix}${key}`;
    
    try {
      wx.removeStorageSync(prefixedKey);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  /**
   * 清空所有缓存
   */
  clear: () => {
    try {
      wx.clearStorageSync();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
  
  /**
   * 获取用户信息
   */
  getUserInfo: () => {
    return Storage.get('userInfo');
  },
  
  /**
   * 设置用户信息
   * @param {Object} userInfo - 用户信息对象
   */
  setUserInfo: (userInfo) => {
    return Storage.set('userInfo', userInfo);
  },
  
  /**
   * 获取授权令牌
   */
  getToken: () => {
    return Storage.get('token');
  },
  
  /**
   * 设置授权令牌
   * @param {string} token - 授权令牌
   * @param {number} [expireTime] - 过期时间(毫秒)
   */
  setToken: (token, expireTime) => {
    return Storage.set('token', token, expireTime);
  },
  
  /**
   * 获取AI聊天历史
   */
  getAiChatHistory: () => {
    return Storage.get('aiChatHistory', []);
  },
  
  /**
   * 保存AI聊天历史
   * @param {Array} history - 聊天历史数组
   */
  saveAiChatHistory: (history) => {
    // 限制保存数量
    if (history.length > config.maxAiChatHistory) {
      history = history.slice(history.length - config.maxAiChatHistory);
    }
    return Storage.set('aiChatHistory', history);
  }
};

module.exports = Storage;
