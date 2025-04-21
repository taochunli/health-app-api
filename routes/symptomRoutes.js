const express = require('express');
const router = express.Router();
const {
  getSymptoms,
  getSymptomById,
  getBodyPartsList,
  searchSymptoms
} = require('../controllers/symptomController');

// 获取身体部位列表
router.get('/bodyParts', getBodyPartsList);

// 搜索症状
router.get('/search', searchSymptoms);

// 获取症状列表
router.get('/', getSymptoms);

// 获取症状详情
router.get('/:id', getSymptomById);

module.exports = router;
