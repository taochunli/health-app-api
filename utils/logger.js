const winston = require('winston');
require('dotenv').config();

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境变量判断日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// 自定义日志格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 定义日志输出
const transports = [
  // 控制台输出
  new winston.transports.Console(),
  
  // 错误日志文件
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  
  // 综合日志文件
  new winston.transports.File({ 
    filename: 'logs/combined.log' 
  }),
];

// 创建日志对象
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
