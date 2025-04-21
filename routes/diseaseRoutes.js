const express = require('express');
const router = express.Router();
const {
  getDiseases,
  getDiseaseById,
  searchDiseases,
  getDiseaseCategories
} = require('../controllers/diseaseController');

// 获取疾病分类列表
router.get('/categories', getDiseaseCategories);

// 搜索疾病
router.get('/search', searchDiseases);

// 获取疾病列表
router.get('/', getDiseases);

// 获取疾病详情
router.get('/:id', getDiseaseById);

module.exports = router;
