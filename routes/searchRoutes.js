const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');

// 综合搜索
router.get('/', search);

module.exports = router;
