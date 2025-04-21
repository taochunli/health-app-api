const Medicine = require('../models/Medicine');
const asyncHandler = require('express-async-handler');

/**
 * 获取药品列表
 * @route GET /api/health/medicines
 * @access Public
 */
const getMedicines = asyncHandler(async (req, res) => {
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
      { commonName: { $regex: keyword, $options: 'i' } },
      { tradeName: { $regex: keyword, $options: 'i' } }
    ];
  }
  
  // 执行分页查询
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const medicines = await Medicine.find(query)
    .select('name commonName category format indications viewCount')
    .skip(skip)
    .limit(limitNum)
    .sort({ viewCount: -1, name: 1 });
  
  const total = await Medicine.countDocuments(query);
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      list: medicines,
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
 * 获取药品详情
 * @route GET /api/health/medicines/:id
 * @access Public
 */
const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  
  if (medicine) {
    // 更新浏览次数
    medicine.viewCount += 1;
    await medicine.save();
    
    res.json({
      code: 0,
      message: 'success',
      data: medicine
    });
  } else {
    res.status(404);
    throw new Error('未找到药品信息');
  }
});

/**
 * 获取药品分类列表
 * @route GET /api/health/medicines/categories
 * @access Public
 */
const getMedicineCategories = asyncHandler(async (req, res) => {
  const categories = await Medicine.aggregate([
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

/**
 * 通过适应症查找药物
 * @route GET /api/health/medicines/byIndication
 * @access Public
 */
const getMedicinesByIndication = asyncHandler(async (req, res) => {
  const { indication } = req.query;
  
  if (!indication) {
    res.status(400);
    throw new Error('请提供适应症关键词');
  }
  
  const medicines = await Medicine.find({ 
    indications: { $regex: indication, $options: 'i' } 
  })
  .select('name commonName category indications format')
  .limit(20);
  
  res.json({
    code: 0,
    message: 'success',
    data: medicines
  });
});

module.exports = {
  getMedicines,
  getMedicineById,
  getMedicineCategories,
  getMedicinesByIndication
};
