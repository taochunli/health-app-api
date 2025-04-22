/**
 * API功能类
 * 用于实现查询结果过滤、排序、字段选择和分页等功能
 */
class APIFeatures {
  /**
   * 构造函数
   * @param {Object} query - Mongoose查询对象
   * @param {Object} queryString - 请求中的查询参数
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * 实现过滤功能
   * 支持过滤条件、范围查询等
   */
  filter() {
    const queryObj = { ...this.queryString };
    
    // 排除特殊查询字段
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // 处理范围查询运算符
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    this.query = this.query.find(JSON.parse(queryStr));
    
    return this;
  }

  /**
   * 实现排序功能
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // 默认按创建时间降序排序
      this.query = this.query.sort('-createdAt');
    }
    
    return this;
  }

  /**
   * 实现字段选择功能
   */
  limitFields
