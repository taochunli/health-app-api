const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
require('dotenv').config();

// 连接数据库
connectDB();

// 初始化Express应用
const app = express();

// 中间件
app.use(helmet()); // 安全HTTP头
app.use(cors()); // 跨域支持
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: false })); // 解析URL编码请求体
app.use(morgan('dev')); // 请求日志

// 根路由 - API健康检查
app.get('/', (req, res) => {
  res.json({ 
    message: '欢迎使用健康医疗小程序API',
    status: 'online', 
    version: '1.0.0' 
  });
});

// API路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/health/diseases', require('./routes/diseaseRoutes'));
app.use('/api/health/symptoms', require('./routes/symptomRoutes'));
app.use('/api/health/medicines', require('./routes/medicineRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}, 环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // 用于测试
