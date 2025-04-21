const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  commonName: String, // 通用名
  tradeName: [String], // 商品名列表
  category: {
    type: String,
    required: true,
    index: true
  }, // 药品类别
  drugClass: String, // 药物分类
  format: String, // 剂型
  ingredients: [String], // 成分
  indications: [String], // 适应症
  dosage: String, // 用法用量
  sideEffects: [{ // 副作用
    effect: String,
    frequency: {
      type: String,
      enum: ['common', 'uncommon', 'rare'],
      default: 'uncommon'
    }
  }],
  contraindications: [String], // 禁忌症
  interactions: [{ // 药物相互作用
    with: String, // 与何药物
    effect: String, // 相互作用效果
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  specialPrecautions: [String], // 特殊注意事项
  storage: String, // 储存条件
  pregnancy: { // 孕妇用药分级
    category: String,
    description: String
  },
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
medicineSchema.index({ 
  name: 'text', 
  commonName: 'text', 
  tradeName: 'text', 
  indications: 'text' 
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
