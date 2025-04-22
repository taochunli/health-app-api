/**
 * 数据验证工具
 * 用于验证API请求参数
 */

// 验证电子邮件格式
const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// 验证手机号码格式（中国大陆）
const isValidPhoneNumber = (phone) => {
  const re = /^1[3-9]\d{9}$/;
  return re.test(String(phone));
};

// 验证用户名格式
const isValidUsername = (username) => {
  // 3-20个字符，只能包含字母、数字、下划线和减号
  const re = /^[a-zA-Z0-9_-]{3,20}$/;
  return re.test(username);
};

// 验证密码强度
const isStrongPassword = (password) => {
  // 至少8个字符，包含大小写字母和数字
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

// 验证ObjectId格式
const isValidObjectId = (id) => {
  const re = /^[0-9a-fA-F]{24}$/;
  return re.test(id);
};

// 检查必要字段是否存在
const validateRequiredFields = (object, fields) => {
  const missingFields = [];
  
  fields.forEach(field => {
    if (object[field] === undefined || object[field] === null || object[field] === '') {
      missingFields.push(field);
    }
  });
  
  return missingFields.length === 0 ? null : missingFields;
};

// 清理和过滤对象属性
const sanitizeObject = (object, allowedFields) => {
  const sanitizedObject = {};
  
  allowedFields.forEach(field => {
    if (object[field] !== undefined) {
      sanitizedObject[field] = object[field];
    }
  });
  
  return sanitizedObject;
};

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isValidUsername,
  isStrongPassword,
  isValidObjectId,
  validateRequiredFields,
  sanitizeObject
};
