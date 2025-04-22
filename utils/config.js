/**
 * 全局配置文件
 */

const config = {
  // 应用信息
  appName: '知禾小筑',
  appVersion: '1.0.0',
  
  // API配置
  baseURL: 'https://api.healthapp.example.com',
  requestTimeout: 10000, // 请求超时时间(毫秒)
  
  // 登录相关
  tokenExpireTime: 7 * 24 * 60 * 60 * 1000, // token过期时间(7天)
  
  // 缓存相关
  cachePrefix: 'health_', // 缓存前缀
  cacheTime: 30 * 24 * 60 * 60 * 1000, // 默认缓存时间(30天)
  
  // AI聊天相关
  maxAiChatHistory: 100, // 最大AI聊天历史记录条数
  
  // 路径配置
  pages: {
    login: '/pages/login/login',
    home: '/pages/home/home',
    ai: '/pages/ai/ai',
    profile: '/pages/profile/profile',
    symptomDetail: '/pages/symptomdetail/symptomdetail',
    diseaseDetail: '/pages/diseasedetail/diseasedetail'
  },
  
  // 图标路径
  icons: {
    home: '/images/home.png',
    homeActive: '/images/home-active.png',
    ai: '/images/ai.png',
    aiActive: '/images/ai-active.png',
    profile: '/images/profile.png',
    profileActive: '/images/profile-active.png'
  }
};

module.exports = config;
