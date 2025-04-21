const Disease = require('../models/Disease');
const Symptom = require('../models/Symptom');
const Medicine = require('../models/Medicine');
const HealthGuide = require('../models/HealthGuide');
const asyncHandler = require('express-async-handler');

/**
 * 综合搜索
 * @route GET /api/search
 * @access Public
 */
const search = asyncHandler(async (req, res) => {
  const { keyword, type } = req.query;
  
  if (!keyword) {
    res.status(400);
    throw new Error('请提供搜索关键词');
  }
  
  let results = {};
  
  // 根据搜索类型执行不同的查询
  if (!type || type === 'all') {
    // 综合搜索所有类型
    const [diseases, symptoms, medicines, healthGuides] = await Promise.all([
      Disease.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' } }
      )
      .select('name category overview')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5),
      
      Symptom.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' } }
      )
      .select('name description bodyPart')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5),
      
      Medicine.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' } }
      )
      .select('name commonName category indications')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5),
      
      HealthGuide.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' } }
      )
      .select('title type category summary')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
    ]);
    
    results = {
      diseases,
      symptoms,
      medicines,
      healthGuides
    };
    
  } else {
    // 特定类型搜索
    let model, fields;
    
    switch (type) {
      case 'disease':
        model = Disease;
        fields = 'name category overview';
        break;
      case 'symptom':
        model = Symptom;
        fields = 'name description bodyPart';
        break;
      case 'medicine':
        model = Medicine;
        fields = 'name commonName category indications';
        break;
      case 'guide':
        model = HealthGuide;
        fields = 'title type category summary';
        break;
      default:
        res.status(400);
        throw new Error('不支持的搜索类型');
    }
    
    const items = await model.find(
      { $text: { $search: keyword } },
      { score: { $meta: 'textScore' } }
    )
    .select(fields)
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
    
    results = { items };
  }
  
  // 记录搜索结果数量
  const counts = {
    diseases: results.diseases ? results.diseases.length : (results.items && type === 'disease' ? results.items.length : 0),
    symptoms: results.symptoms ? results.symptoms.length : (results.items && type === 'symptom' ? results.items.length : 0),
    medicines: results.medicines ? results.medicines.length : (results.items && type === 'medicine' ? results.items.length : 0),
    healthGuides: results.healthGuides ? results.healthGuides.length : (results.items && type === 'guide' ? results.items.length : 0)
  };
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      keyword,
      type: type || 'all',
      counts,
      results
    }
  });
});

module.exports = {
  search
};
