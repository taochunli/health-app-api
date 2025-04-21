const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

/**
 * 用户注册
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, name, phone, email, gender } = req.body;
  
  // 检查用户是否已存在
  const userExists = await User.findOne({ username });
  
  if (userExists) {
    res.status(400);
    throw new Error('用户已存在');
  }
  
  // 创建新用户
  const user = await User.create({
    username,
    password,
    name: name || username,
    phone,
    email,
    gender
  });
  
  if (user) {
    res.status(201).json({
      code: 0,
      message: '注册成功',
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('无效的用户数据');
  }
});

/**
 * 用户登录
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  // 查找用户
  const user = await User.findOne({ username });
  
  // 验证用户和密码
  if (user && (await user.matchPassword(password))) {
    res.json({
      code: 0,
      message: '登录成功',
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(401);
    throw new Error('用户名或密码错误');
  }
});

/**
 * 获取用户信息
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      code: 0,
      message: 'success',
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

/**
 * 更新用户信息
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // 更新允许修改的字段
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;
    user.gender = req.body.gender || user.gender;
    
    // 只有提供了新密码才更新密码
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      code: 0,
      message: '更新成功',
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        gender: updatedUser.gender,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      }
    });
  } else {
    res.status(404);
    throw new Error('用户不存在');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
