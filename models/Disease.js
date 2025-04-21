const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  alias: [String], // 别名/俗称
  overview: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  symptoms: [{
    symptom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Symptom'
    },
    description: String,
    commonness: {
      type: String,
      enum: ['common', 'uncommon', 'rare'],
      default: 'common'
    }
  }],
  causes: [String], // 病因
  riskFactors: [String], // 风险因素
  complications: [String], // 并发症
  diagnosis: { // 诊断方法
    methods: [String], // 诊断手段
    examinations: [String] // 检查项目
  },
  treatments: {
    overview: String, // 治疗概述
    medications: [{ // 药物治疗
      type: String, // 药物类型
      examples: [{ // 药物示例
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine'
        },
        usage: String // 用法用量
      }]
    }],
    surgeries: [String], // 手术治疗
    otherTreatments: [String] // 其他治疗
  },
  preventions: [String], // 预防措施
  whenToSeeDoctor: String, // 何时就医
  prognosis: String, // 预后
  references: [{ // 参考资料
    title: String,
    source: String,
    url: String,
    date: Date
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
diseaseSchema.index({ 
  name: 'text', 
  alias: 'text', 
  overview: 'text',
  category: 'text'
});

const Disease = mongoose.model('Disease', diseaseSchema);

module.exports = Disease;
