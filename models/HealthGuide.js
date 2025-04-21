const mongoose = require('mongoose');

const healthGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['prevention', 'diet', 'exercise', 'psychology', 'other'],
    default: 'other',
    index: true
  }, // 指南类型
  category: {
    type: String,
    required: true,
    index: true
  }, // 分类
  summary: {
    type: String,
    required: true
  }, // 摘要
  content: {
    type: String,
    required: true
  }, // 正文内容
  tips: [String], // 健康小贴士
  targetAudience: [String], // 目标人群
  relatedDiseases: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Disease' 
  }], // 相关疾病
  seasonality: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'all-season'],
    default: 'all-season'
  }, // 季节性
  author: { // 作者信息
    name: String,
    title: String, // 职称
    institution: String // 机构
  },
  tags: [String], // 标签
  references: [{ // 参考资料
    title: String,
    source: String,
    url: String
  }],
  viewCount: { 
    type: Number, 
    default: 0 
  }, // 浏览次数
  publishDate: { 
    type: Date, 
    default: Date.now 
  }, // 发布日期
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  } // 最后更新时间
}, {
  timestamps: true
});

// 添加全文搜索索引
healthGuideSchema.index({ 
  title: 'text', 
  summary: 'text', 
  content: 'text',
  tags: 'text'
});

const HealthGuide = mongoose.model('HealthGuide', healthGuideSchema);

module.exports = HealthGuide;
