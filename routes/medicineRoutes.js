const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  getMedicineCategories,
  getMedicinesByIndication
} = require('../controllers/medicineController');

// 获取药品分类列表
router.get('/categories', getMedicineCategories);

// 通过适应症查找药物
router.get('/byIndication', getMedicinesByIndication);

// 获取药品列表
router.get('/', getMedicines);

// 获取药品详情
router.get('/:id', getMedicineById);

module.exports = router;
