const Symptom = require('../models/Symptom');
const asyncHandler = require('express-async-handler');

/**
 * 获取症状列表
 * @route GET /api/health/symptoms
 * @access Public
 */
const getSymptoms = asyncHandler(async (req, res) => {
  const { 
    category, 
    bodyPart,
    keyword,
    page = 1, 
    limit = 10 
  } = req.query;
  
  // 构建查询条件
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (bodyPart) {
    query.bodyPart = bodyPart;
  }
  
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }
  
  // 执行分页查询
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const symptoms = await Symptom.find(query)
    .select('name description icon bodyPart category viewCount')
    .skip(skip)
    .limit(limitNum)
    .sort({ viewCount: -1, name: 1 });
  
  const total = await Symptom.countDocuments(query);
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      list: symptoms,
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
 * 获取症状详情
 * @route GET /api/health/symptoms/:id
 * @access Public
 */
const getSymptomById = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findById(req.params.id)
    .populate({
      path: 'commonDisorders.disease',
      select: 'name overview category'
    });
  
  if (symptom) {
    // 更新浏览次数
    symptom.viewCount += 1;
    await symptom.save();
    
    res.json({
      code: 0,
      message: 'success',
      data: symptom
    });
  } else {
    res.status(404);
    throw new Error('未找到症状信息');
  }
});

/**
 * 获取身体部位症状列表
 * @route GET /api/health/symptoms/bodyParts
 * @access Public
 */
const getBodyPartsList = asyncHandler(async (req, res) => {
  const bodyParts = await Symptom.aggregate([
    { $group: { _id: '$bodyPart', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  res.json({
    code: 0,
    message: 'success',
    data: bodyParts.map(p => ({
      name: p._id,
      count: p.count
    })).filter(p => p.name) // 过滤掉null值
  });
});

/**
 * 搜索症状
 * @route GET /api/health/symptoms/search
 * @access Public
 */
const searchSymptoms = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    res.status(400);
    throw new Error('请提供搜索关键词');
  }
  
  // 执行文本搜索
  const symptoms = await Symptom.find(
    { $text: { $search: keyword } },
    { score: { $meta: 'textScore' } }
  )
  .select('name description bodyPart category')
  .sort({ score: { $meta: 'textScore' } })
  .limit(20);
  
  res.json({
    code: 0,
    message: 'success',
    data: symptoms
  });
});

module.exports = {
  getSymptoms,
  getSymptomById,
  getBodyPartsList,
  searchSymptoms
};
