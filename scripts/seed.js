/**
 * 数据库种子脚本
 * 用于向数据库中导入初始数据
 * 
 * 使用方法: node scripts/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Disease = require('../models/Disease');
const Symptom = require('../models/Symptom');
const Medicine = require('../models/Medicine');
const HealthGuide = require('../models/HealthGuide');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => {
  console.error('MongoDB 连接失败:', err.message);
  process.exit(1);
});

// 示例用户数据
const userData = [
  {
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800000000',
    role: 'admin',
    gender: 'male'
  },
  {
    username: 'user01',
    password: 'test123',
    name: '测试用户',
    email: 'user@example.com',
    phone: '13900000000',
    role: 'user',
    gender: 'female'
  }
];

// 示例症状数据
const symptomData = [
  {
    name: '头痛',
    description: '头部的疼痛或不适感，可能是钝痛、尖锐疼痛或搏动性疼痛。',
    icon: 'headache.png',
    bodyPart: '头部',
    category: 'head',
    severity: {
      hasLevels: true,
      levels: [
        { level: '轻度', description: '可以忍受的轻微疼痛，不影响日常活动' },
        { level: '中度', description: '明显的疼痛，可能影响日常活动和注意力' },
        { level: '重度', description: '剧烈疼痛，严重影响日常生活和工作' }
      ]
    },
    selfCare: [
      '充分休息',
      '避免噪音和强光',
      '适量饮水',
      '可服用非处方止痛药'
    ],
    redFlags: [
      '突然发生的剧烈头痛',
      '伴随发热、颈部僵硬',
      '头痛伴随意识改变或混乱',
      '头痛伴随视力问题或言语困难'
    ]
  },
  {
    name: '咳嗽',
    description: '身体清除呼吸道异物或分泌物的自然反应，可能是干咳或有痰咳嗽。',
    icon: 'cough.png',
    bodyPart: '胸部',
    category: 'chest',
    severity: {
      hasLevels: true,
      levels: [
        { level: '轻度', description: '偶尔咳嗽，不影响日常活动' },
        { level: '中度', description: '频繁咳嗽，影响睡眠或日常活动' },
        { level: '重度', description: '持续剧烈咳嗽，可能导致呕吐、胸痛或呼吸困难' }
      ]
    },
    selfCare: [
      '保持充分休息',
      '多喝温水',
      '使用加湿器增加空气湿度',
      '避免刺激物如烟雾和灰尘'
    ],
    redFlags: [
      '咳血',
      '呼吸困难或胸痛',
      '持续高烧',
      '咳嗽超过3周'
    ]
  }
];

// 示例疾病数据
const diseaseData = [
  {
    name: '普通感冒',
    alias: ['伤风', '感冒'],
    overview: '普通感冒是由病毒感染引起的上呼吸道感染。症状通常包括喉咙痛、鼻塞、流鼻涕、咳嗽和轻度发热。',
    category: '呼吸系统疾病',
    causes: ['病毒感染', '主要是鼻病毒', '季节性传播'],
    riskFactors: ['免疫力低下', '季节变化', '接触感冒患者'],
    complications: ['鼻窦感染', '中耳炎', '支气管炎'],
    diagnosis: {
      methods: ['临床症状评估', '体格检查'],
      examinations: ['一般不需要特殊检查', '严重或复杂情况可能需要鼻拭子检测']
    },
    treatments: {
      overview: '普通感冒通常是自限性疾病，治疗主要是对症支持。',
      medications: [
        {
          type: '解热镇痛药',
          examples: []
        },
        {
          type: '抗组胺药',
          examples: []
        }
      ],
      surgeries: [],
      otherTreatments: ['充分休息', '多喝水', '保持室内湿度适宜']
    },
    preventions: [
      '勤洗手',
      '避免接触感冒患者',
      '保持良好的生活习惯',
      '提高免疫力'
    ],
    whenToSeeDoctor: '如果症状持续超过10天，或症状特别严重，或出现呼吸困难、持续高烧等症状，应及时就医。',
    references: [
      {
        title: '感冒诊疗指南',
        source: '中华医学会呼吸病学分会',
        url: 'https://example.com/cold-guidelines'
      }
    ]
  },
  {
    name: '2型糖尿病',
    alias: ['成人发病型糖尿病', '非胰岛素依赖型糖尿病'],
    overview: '2型糖尿病是一种代谢性疾病，特征是高血糖，是由于胰岛素抵抗和相对胰岛素分泌不足引起的。',
    category: '内分泌系统疾病',
    causes: ['胰岛素抵抗', '胰岛素分泌不足', '遗传因素', '环境因素'],
    riskFactors: ['肥胖', '家族史', '缺乏锻炼', '年龄增长', '不健康饮食'],
    complications: [
      '心血管疾病', 
      '神经病变', 
      '肾病', 
      '视网膜病变', 
      '足部问题'
    ],
    diagnosis: {
      methods: ['空腹血糖检测', '糖化血红蛋白(HbA1c)检测', '口服葡萄糖耐量试验'],
      examinations: ['血糖监测', '尿液检查', '心血管风险评估']
    },
    treatments: {
      overview: '2型糖尿病的治疗目标是控制血糖，预防并发症。',
      medications: [
        {
          type: '双胍类',
          examples: []
        },
        {
          type: '磺脲类',
          examples: []
        }
      ],
      surgeries: ['胃旁路手术（针对肥胖患者）'],
      otherTreatments: ['饮食控制', '规律运动', '血糖监测', '糖尿病教育']
    },
    preventions: [
      '保持健康体重', 
      '健康饮食', 
      '规律锻炼', 
      '定期体检', 
      '避免吸烟'
    ],
    whenToSeeDoctor: '如果您出现多尿、多饮、多食、体重无故减轻等症状，尤其是有糖尿病家族史的人，应该及时就医。',
    references: [
      {
        title: '中国2型糖尿病防治指南',
        source: '中华医学会糖尿病学分会',
        url: 'https://example.com/diabetes-guidelines'
      }
    ]
  }
];

// 示例药品数据
const medicineData = [
  {
    name: '布洛芬',
    commonName: '布洛芬',
    tradeName: ['芬必得', '美林', '痛速宁'],
    category: '非甾体抗炎药',
    drugClass: '解热镇痛药',
    format: '片剂, 胶囊, 口服液',
    ingredients: ['布洛芬'],
    indications: ['发热', '轻至中度疼痛', '炎症', '关节炎', '痛经'],
    dosage: '成人：200-400mg，每6-8小时一次，最大剂量每日不超过1200mg。儿童：根据体重确定剂量。',
    sideEffects: [
      { effect: '胃肠道不适', frequency: 'common' },
      { effect: '恶心', frequency: 'common' },
      { effect: '头痛', frequency: 'uncommon' },
      { effect: '皮疹', frequency: 'rare' }
    ],
    contraindications: [
      '对布洛芬或其他非甾体抗炎药过敏',
      '活动性消化道溃疡或出血',
      '严重心力衰竭',
      '妊娠晚期'
    ],
    specialPrecautions: [
      '肾功能不全患者慎用',
      '老年患者应减量',
      '长期使用可能增加心血管风险'
    ],
    storage: '密封保存，避光，常温保存',
    pregnancy: {
      category: 'C/D',
      description: '妊娠前两个三月应谨慎使用，最后三个月禁用'
    }
  },
  {
    name: '氯雷他定',
    commonName: '氯雷他定',
    tradeName: ['开瑞坦', '开思亭'],
    category: '抗过敏药',
    drugClass: '第二代抗组胺药',
    format: '片剂, 糖浆',
    ingredients: ['氯雷他定'],
    indications: ['过敏性鼻炎', '慢性荨麻疹', '皮肤瘙痒'],
    dosage: '成人和12岁以上儿童：10mg，每日一次。2-12岁儿童：5mg，每日一次。',
    sideEffects: [
      { effect: '嗜睡', frequency: 'uncommon' },
      { effect: '口干', frequency: 'common' },
      { effect: '头痛', frequency: 'uncommon' }
    ],
    contraindications: [
      '对氯雷他定过敏'
    ],
    specialPrecautions: [
      '肝功能受损患者应减量',
      '肾功能不全患者需调整剂量'
    ],
    storage: '密封保存，避光，常温保存',
    pregnancy: {
      category: 'B',
      description: '仅在必要时使用'
    }
  }
];

// 示例健康指南数据
const healthGuideData = [
  {
    title: '如何预防感冒',
    type: 'prevention',
    category: '呼吸系统健康',
    summary: '本文介绍了预防感冒的实用方法，包括个人卫生习惯、增强免疫力和环境管理等方面的建议。',
    content: '感冒是最常见的呼吸道感染疾病之一，虽然通常不会导致严重后果，但会影响工作和生活质量。预防感冒的关键在于养成良好的卫生习惯、增强免疫力和减少病毒暴露机会。\n\n一、个人卫生习惯\n1. 勤洗手：使用肥皂和流动水洗手，至少20秒\n2. 避免用未洗的手触摸眼睛、鼻子和嘴巴\n3. 咳嗽或打喷嚏时用纸巾或肘部遮挡\n\n二、增强免疫力\n1. 保持充足睡眠\n2. 均衡饮食，摄入富含维生素C和维生素D的食物\n3. 适度运动，每周至少150分钟中等强度活动\n4. 保持良好心态，减少压力\n\n三、环境管理\n1. 保持室内通风\n2. 定期清洁和消毒常接触的物体表面\n3. 避免前往人群密集的场所，特别是在流感季节\n\n四、其他预防措施\n1. 流感季节考虑接种流感疫苗\n2. 保持适当的室内湿度（40%-60%）\n3. 避免接触感冒患者\n\n记住，没有任何单一措施可以完全预防感冒，综合采取以上措施才能最大程度降低感染风险。',
    tips: [
      '洗手时要注意清洁指缝和指甲缝',
      '保持室内湿度可以使用加湿器',
      '维生素C丰富的食物包括柑橘类水果、猕猴桃、草莓等',
      '感冒流行期间减少参加聚会和赴宴'
    ],
    targetAudience: ['一般人群', '学生', '老年人', '办公室工作者'],
    seasonality: 'all-season',
    author: {
      name: '张医生',
      title: '呼吸科主任医师',
      institution: '某三甲医院'
    },
    tags: ['感冒', '预防', '免疫力', '卫生习惯'],
    references: [
      {
        title: '感冒预防指南',
        source: '中国疾病预防控制中心',
        url: 'https://example.com/cold-prevention'
      }
    ]
  },
  {
    title: '健康饮食指南：平衡膳食的基本原则',
    type: 'diet',
    category: '营养与饮食',
    summary: '本文介绍了健康饮食的基本原则，帮助读者建立科学的饮食观念，实现营养均衡，预防慢性疾病。',
    content: '良好的饮食习惯是维持健康的基础。本指南旨在提供实用的健康饮食建议，帮助您在日常生活中做出更明智的食物选择。\n\n一、均衡膳食的基本原则\n1. 多样性：摄入多种食物，确保获取全面的营养素\n2. 适量性：根据个人需求控制总能量摄入\n3. 平衡性：合理搭配各类食物的比例\n\n二、各类食物的推荐摄入量\n1. 谷类食物：每天250-400克，提倡全谷物\n2. 蔬菜水果：每天300-500克蔬菜，200-350克水果\n3. 蛋白质食物：每天适量摄入瘦肉、鱼、蛋、奶和豆制品\n4. 油脂：控制烹调油用量，每天25-30克\n5. 盐：每天不超过5克\n6. 糖：每天不超过50克\n\n三、健康饮食的具体建议\n1. 增加膳食纤维摄入：多吃蔬菜、水果、全谷物和豆类\n2. 减少油炸和高脂食品：选择蒸、煮、炖等烹饪方式\n3. 限制精制糖和含糖饮料：选择水、茶等无糖饮品\n4. 减少盐的摄入：少吃腌制和加工食品\n5. 规律进餐：建立固定的用餐时间表\n\n四、特殊人群的饮食建议\n1. 儿童青少年：保证充足的蛋白质和钙的摄入\n2. 老年人：增加优质蛋白和钙的摄入，注意补充维生素D\n3. 孕妇和哺乳期妇女：增加叶酸、铁、钙等营养素的摄入\n\n健康饮食应成为一种生活方式，而不是短期的节食。通过逐步改变饮食习惯，您可以享受美食的同时也呵护自己的健康。',
    tips: [
      '购物时先看食品标签，选择低盐低糖的产品',
      '尝试每周安排一天素食日',
      '烹饪时使用香草和香料替代部分盐',
      '餐前喝一杯水有助于控制食量'
    ],
    targetAudience: ['一般人群', '慢性病患者', '健康关注者'],
    seasonality: 'all-season',
    author: {
      name: '李营养师',
      title: '临床营养师',
      institution: '某营养研究中心'
    },
    tags: ['饮食', '营养', '膳食平衡', '健康生活'],
    references: [
      {
        title: '中国居民膳食指南',
        source: '中国营养学会',
        url: 'https://example.com/dietary-guidelines'
      }
    ]
  }
];

// 导入数据到数据库的函数
const importData = async () => {
  try {
    // 清空现有数据
    await User.deleteMany();
    await Disease.deleteMany();
    await Symptom.deleteMany();
    await Medicine.deleteMany();
    await HealthGuide.deleteMany();
    
    console.log('数据库已清空');
    
    // 创建用户
    const createdUsers = await User.create(userData);
    console.log(`已导入 ${createdUsers.length} 个用户`);
    
    // 创建症状
    const createdSymptoms = await Symptom.create(symptomData);
    console.log(`已导入 ${createdSymptoms.length} 个症状`);
    
    // 创建疾病并关联症状
    const headache = createdSymptoms.find(s => s.name === '头痛');
    const cough = createdSymptoms.find(s => s.name === '咳嗽');
    
    if (headache && cough) {
      // 为感冒添加症状关联
      const coldIndex = diseaseData.findIndex(d => d.name === '普通感冒');
      if (coldIndex !== -1) {
        diseaseData[coldIndex].symptoms = [
          {
            symptom: cough._id,
            description: '干咳或有痰咳嗽',
            commonness: 'common'
          },
          {
            symptom: headache._id,
            description: '轻至中度头痛',
            commonness: 'common'
          }
        ];
      }
    }
    
    const createdDiseases = await Disease.create(diseaseData);
    console.log(`已导入 ${createdDiseases.length} 种疾病`);
    
    // 更新症状的相关疾病
    const cold = createdDiseases.find(d => d.name === '普通感冒');
    
    if (cold) {
      if (headache) {
        headache.commonDisorders = [
          {
            disease: cold._id,
            likelihood: 'high'
          }
        ];
        await headache.save();
      }
      
      if (cough) {
        cough.commonDisorders = [
          {
            disease: cold._id,
            likelihood: 'high'
          }
        ];
        await cough.save();
      }
    }
    
    // 创建药品
    const createdMedicines = await Medicine.create(medicineData);
    console.log(`已导入 ${createdMedicines.length} 种药品`);
    
    // 关联药物到疾病
    const ibuprofen = createdMedicines.find(m => m.name === '布洛芬');
    const loratadine = createdMedicines.find(m => m.name === '氯雷他定');
    
    if (ibuprofen && cold) {
      // 更新感冒的药物治疗
      cold.treatments.medications.forEach(med => {
        if (med.type === '解热镇痛药') {
          med.examples = [
            {
              medicine: ibuprofen._id,
              usage: '成人：200-400mg，每6-8小时一次'
            }
          ];
        }
      });
      await cold.save();
    }
    
    // 创建健康指南
    const createdGuides = await HealthGuide.create(healthGuideData);
    console.log(`已导入 ${createdGuides.length} 份健康指南`);
    
    // 关联健康指南到疾病
    const coldPreventionGuide = createdGuides.find(g => g.title === '如何预防感冒');
    
    if (coldPreventionGuide && cold) {
      coldPreventionGuide.relatedDiseases = [cold._id];
      await coldPreventionGuide.save();
    }
    
    console.log('数据导入完成');
    process.exit();
  } catch (error) {
    console.error(`导入失败: ${error.message}`);
    process.exit(1);
  }
};

// 执行导入
importData();
