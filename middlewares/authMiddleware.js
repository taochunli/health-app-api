const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 验证访问令牌
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // 检查请求头中的授权令牌
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 获取用户信息(不含密码)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('未授权，用户不存在');
      }
      
      next();
    } else {
      res.status(401);
      throw new Error('未授权，无令牌');
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

/**
 * 验证管理员权限
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('没有管理员权限');
  }
};

module.exports = { protect, admin };
