const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  icon: String, // 图标URL
  bodyPart: {
    type: String,
    index: true
  }, // 身体部位
  category: {
    type: String,
    enum: ['head', 'chest', 'abdomen', 'limbs', 'skin', 'general', 'other'],
    default: 'other',
    index: true
  },
  severity: {
    hasLevels: Boolean, // 是否有严重程度分级
    levels: [{ // 严重程度分级描述
      level: String,
      description: String
    }]
  },
  commonDisorders: [{ // 常见相关疾病
    disease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease'
    },
    likelihood: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  selfCare: [String], // 自我处理方法
  redFlags: [String], // 危险信号（需要立即就医的情况）
  references: [{ // 参考资料
    title: String,
    source: String,
    url: String
  }],
  viewCount: { 
    type: Number, 
    default: 0 
  }, // 浏览次数
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// 添加全文搜索索引
symptomSchema.index({ 
  name: 'text', 
  description: 'text', 
  bodyPart: 'text' 
});

const Symptom = mongoose.model('Symptom', symptomSchema);

module.exports = Symptom;
