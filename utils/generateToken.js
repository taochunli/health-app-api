const jwt = require('jsonwebtoken');

/**
 * 生成JWT令牌
 * @param {string} id 用户ID
 * @returns {string} JWT令牌
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

module.exports = generateToken;
