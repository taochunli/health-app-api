const Disease = require('../models/Disease');
const asyncHandler = require('express-async-handler');

/**
 * 获取疾病列表
 * @route GET /api/health/diseases
 * @access Public
 */
const getDiseases = asyncHandler(async (req, res) => {
  const { 
    category, 
    keyword,
    page = 1, 
    limit = 10 
  } = req.query;
  
  // 构建查询条件
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { alias: { $regex: keyword, $options: 'i' } }
    ];
  }
  
  // 执行分页查询
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const diseases = await Disease.find(query)
    .select('name category overview viewCount lastUpdated')
    .skip(skip)
    .limit(limitNum)
    .sort({ viewCount: -1, name: 1 });
  
  const total = await Disease.countDocuments(query);
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      list: diseases,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
});

/**
 * 获取疾病详情
 * @route GET /api/health/diseases/:id
 * @access Public
 */
const getDiseaseById = asyncHandler(async (req, res) => {
  const disease = await Disease.findById(req.params.id)
    .populate({
      path: 'symptoms.symptom',
      select: 'name description icon bodyPart'
    })
    .populate({
      path: 'treatments.medications.examples.medicine',
      select: 'name commonName format dosage'
    });
  
  if (disease) {
    // 更新浏览次数
    disease.viewCount += 1;
    await disease.save();
    
    res.json({
      code: 0,
      message: 'success',
      data: disease
    });
  } else {
    res.status(404);
    throw new Error('未找到疾病信息');
  }
});

/**
 * 搜索疾病
 * @route GET /api/health/diseases/search
 * @access Public
 */
const searchDiseases = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    res.status(400);
    throw new Error('请提供搜索关键词');
  }
  
  // 执行文本搜索
  const diseases = await Disease.find(
    { $text: { $search: keyword } },
    { score: { $meta: 'textScore' } }
  )
  .select('name category overview')
  .sort({ score: { $meta: 'textScore' } })
  .limit(20);
  
  res.json({
    code: 0,
    message: 'success',
    data: diseases
  });
});

/**
 * 获取疾病分类列表
 * @route GET /api/health/diseases/categories
 * @access Public
 */
const getDiseaseCategories = asyncHandler(async (req, res) => {
  const categories = await Disease.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  res.json({
    code: 0,
    message: 'success',
    data: categories.map(c => ({
      name: c._id,
      count: c.count
    }))
  });
});

module.exports = {
  getDiseases,
  getDiseaseById,
  searchDiseases,
  getDiseaseCategories
};
