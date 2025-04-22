/**
 * 网络请求工具类
 */

const config = require('./config');
const Storage = require('./storage');

/**
 * 请求拦截器
 * @param {Object} options - 请求配置
 * @returns {Object} 处理后的请求配置
 */
const requestInterceptor = (options) => {
  // 添加token到header
  const token = Storage.getToken();
  if (token && !options.header.Authorization) {
    options.header.Authorization = `Bearer ${token}`;
  }
  
  // 添加其他通用header
  options.header = {
    'Content-Type': 'application/json',
    ...options.header
  };
  
  return options;
};

/**
 * 响应拦截器
 * @param {Object} response - 响应数据
 * @param {Object} options - 请求配置
 * @returns {Promise} 处理后的响应数据
 */
const responseInterceptor = (response, options) => {
  const { statusCode, data } = response;
  
  // 请求成功
  if (statusCode >= 200 && statusCode < 300) {
    // 判断业务状态码
    if (data.code === 0 || data.code === 200 || data.success) {
      return Promise.resolve(data);
    } else {
      // 业务错误
      const errMsg = data.msg || data.message || '请求失败';
      console.error(`[API Error] ${options.url}: ${errMsg}`);
      
      // 特定错误码处理
      if (data.code === 401) {
        // token失效，清除登录状态
        Storage.remove('token');
        Storage.remove('userInfo');
        
        // 跳转登录页
        wx.navigateTo({
          url: config.pages.login
        });
      }
      
      return Promise.reject(data);
    }
  }
  
  // HTTP错误
  const errMsg = data.msg || data.message || `请求失败(${statusCode})`;
  console.error(`[HTTP Error] ${statusCode} ${options.url}: ${errMsg}`);
  
  if (statusCode === 401) {
    // token失效，清除登录状态
    Storage.remove('token');
    Storage.remove('userInfo');
    
    // 跳转登录页
    wx.navigateTo({
      url: config.pages.login
    });
  }
  
  return Promise.reject({
    code: statusCode,
    msg: errMsg
  });
};

/**
 * 错误处理器
 * @param {Error} error - 错误对象
 * @param {Object} options - 请求配置
 * @returns {Promise} 处理后的错误
 */
const errorHandler = (error, options) => {
  console.error(`[Request Error] ${options.url}:`, error);
  
  // 网络错误
  const errMsg = error.errMsg || error.message || '网络请求失败';
  
  // 超时处理
  if (errMsg.includes('timeout')) {
    wx.showToast({
      title: '请求超时，请稍后重试',
      icon: 'none'
    });
  } else {
    wx.showToast({
      title: errMsg,
      icon: 'none'
    });
  }
  
  return Promise.reject({
    code: -1,
    msg: errMsg
  });
};

/**
 * 发送请求
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求Promise
 */
const request = (options) => {
  // 拼接完整URL
  const baseUrl = config.baseURL;
  options.url = options.url.startsWith('http') ? options.url : `${baseUrl}${options.url}`;
  
  // 默认配置
  options.timeout = options.timeout || config.requestTimeout;
  options.header = options.header || {};
  
  // 请求拦截
  options = requestInterceptor(options);
  
  // 发起请求
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (response) => {
        try {
          responseInterceptor(response, options)
            .then(resolve)
            .catch(reject);
        } catch (error) {
          errorHandler(error, options)
            .catch(reject);
        }
      },
      fail: (error) => {
        errorHandler(error, options)
          .catch(reject);
      }
    });
  });
};

// 请求方法
const Request = {
  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求参数
   * @param {Object} [options] - 其他配置
   * @returns {Promise} 请求Promise
   */
  get: (url, data = {}, options = {}) => {
    return request({
      method: 'GET',
      url,
      data,
      ...options
    });
  },
  
  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求参数
   * @param {Object} [options] - 其他配置
   * @returns {Promise} 请求Promise
   */
  post: (url, data = {}, options = {}) => {
    return request({
      method: 'POST',
      url,
      data,
      ...options
    });
  },
  
  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求参数
   * @param {Object} [options] - 其他配置
   * @returns {Promise} 请求Promise
   */
  put: (url, data = {}, options = {}) => {
    return request({
      method: 'PUT',
      url,
      data,
      ...options
    });
  },
  
  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求参数
   * @param {Object} [options] - 其他配置
   * @returns {Promise} 请求Promise
   */
  delete: (url, data = {}, options = {}) => {
    return request({
      method: 'DELETE',
      url,
      data,
      ...options
    });
  },
  
  /**
   * 上传文件
   * @param {string} url - 请求地址
   * @param {string} filePath - 文件路径
   * @param {string} [name='file'] - 文件参数名
   * @param {Object} [formData] - 表单数据
   * @param {Object} [options] - 其他配置
   * @returns {Promise} 请求Promise
   */
  upload: (url, filePath, name = 'file', formData = {}, options = {}) => {
    // 拼接完整URL
    const baseUrl = config.baseURL;
    url = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    // 默认配置
    const header = options.header || {};
    
    // 添加token到header
    const token = Storage.getToken();
    if (token && !header.Authorization) {
      header.Authorization = `Bearer ${token}`;
    }
    
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url,
        filePath,
        name,
        formData,
        header,
        success: (response) => {
          try {
            // 微信上传接口返回的是字符串，需要转换为对象
            const data = JSON.parse(response.data);
            response.data = data;
            
            responseInterceptor(response, { url })
              .then(resolve)
              .catch(reject);
          } catch (error) {
            errorHandler(error, { url })
              .catch(reject);
          }
        },
        fail: (error) => {
          errorHandler(error, { url })
            .catch(reject);
        }
      });
      
      // 返回上传任务，以支持进度监听
      if (options.onProgress) {
        uploadTask.onProgressUpdate((progress) => {
          options.onProgress(progress);
        });
      }
    });
  }
};

module.exports = Request;
