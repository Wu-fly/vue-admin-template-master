/**
 * 图书管理 Mock 接口模块
 * 提供图书的增删改查功能，支持分页和搜索过滤
 * 
 * 图书数据结构：
 * @typedef {Object} Book
 * @property {string} id - 图书唯一标识
 * @property {string} title - 书名
 * @property {string} author - 作者
 * @property {string} publisher - 出版社
 * @property {number} price - 价格
 * @property {string} status - 状态（available:可借/borrowed:已借/reserved:预约）
 * @property {string} publish_date - 出版日期
 * @property {string} isbn - ISBN号
 * @property {string} description - 简介
 */

// 引入 Mock.js 库用于生成模拟数据
const Mock = require('mockjs')

/**
 * 生成模拟图书数据
 * 使用 Mock.js 生成30条图书记录，包含各种字段的随机数据
 */
const data = Mock.mock({
  // 生成30条数据，格式为数组
  'items|30': [{
    id: '@id',                       // 随机生成唯一ID
    title: '@sentence(5, 10)',       // 随机生成5-10个单词的书名
    author: '@name',                 // 随机生成作者姓名
    publisher: '@word(5, 10)',       // 随机生成5-10个字符的出版社名称
    price: '@float(10, 200, 2, 2)',  // 随机生成10-200之间的价格，保留2位小数
    'status|1': ['available', 'borrowed', 'reserved'],  // 随机选取一个状态
    publish_date: '@date(yyyy-MM-dd)', // 随机生成日期
    isbn: '@string("number", 13)',   // 随机生成13位数字的ISBN号
    description: '@paragraph(1, 3)'  // 随机生成1-3段描述文字
  }]
})

/**
 * 导出 Mock 接口配置数组
 * 每个接口包含：url、type、response 三个属性
 */
module.exports = [
  /**
   * 获取图书列表接口
   * GET /vue-admin-template/book/list
   * 
   * 查询参数：
   * @param {number} [page=1] - 页码
   * @param {number} [limit=10] - 每页数量
   * @param {string} [title] - 书名搜索（模糊匹配）
   * @param {string} [author] - 作者搜索（模糊匹配）
   * @param {string} [status] - 状态筛选
   * 
   * 返回结果：
   * {
   *   code: 20000,
   *   data: {
   *     total: 总记录数,
   *     items: [图书数组]
   *   }
   * }
   */
  {
    url: '/vue-admin-template/book/list',
    type: 'get',
    response: config => {
      // 从请求参数中解构分页和筛选条件
      const { page = 1, limit = 10, title, author, status } = config.query
      // 创建数据副本，避免修改原数据
      let items = [...data.items]
      
      // 按书名搜索
      if (title) {
        items = items.filter(item => item.title.includes(title))
      }
      // 按作者搜索
      if (author) {
        items = items.filter(item => item.author.includes(author))
      }
      // 按状态筛选
      if (status) {
        items = items.filter(item => item.status === status)
      }
      
      // 计算分页参数
      const total = items.length
      const start = (page - 1) * limit
      const end = start + limit
      // 截取分页数据
      const paginatedItems = items.slice(start, end)
      
      // 返回成功响应
      return {
        code: 20000,
        data: {
          total: total,
          items: paginatedItems
        }
      }
    }
  },

  /**
   * 获取单本图书详情接口
   * GET /vue-admin-template/book/detail/:id
   * 
   * 路径参数：
   * @param {string} id - 图书ID
   * 
   * 返回结果：
   * 成功：{ code: 20000, data: 图书对象 }
   * 失败：{ code: 50000, message: '图书不存在' }
   */
  {
    url: '/vue-admin-template/book/detail/:id',
    type: 'get',
    response: config => {
      // 从路径参数中获取图书ID
      const { id } = config.params
      // 在数据中查找匹配的图书
      const book = data.items.find(item => item.id === id)
      
      // 找到图书返回详情
      if (book) {
        return {
          code: 20000,
          data: book
        }
      } else {
        // 未找到返回错误
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  },

  /**
   * 新增图书接口
   * POST /vue-admin-template/book/create
   * 
   * 请求体：
   * @param {string} title - 书名（必填）
   * @param {string} author - 作者（必填）
   * @param {string} [publisher] - 出版社
   * @param {number} [price] - 价格
   * @param {string} [status] - 状态
   * @param {string} [publish_date] - 出版日期
   * @param {string} [description] - 简介
   * 
   * 返回结果：
   * { code: 20000, data: 新增的图书对象, message: '新增成功' }
   */
  {
    url: '/vue-admin-template/book/create',
    type: 'post',
    response: config => {
      // 创建新图书对象，自动生成ID和ISBN
      const newBook = {
        id: Mock.mock('@id'),  // 生成新的唯一ID
        ...config.body,        // 合并请求体中的字段
        // 如果未提供出版日期，自动生成
        publish_date: config.body.publish_date || Mock.mock('@date(yyyy-MM-dd)'),
        // 自动生成ISBN号
        isbn: Mock.mock('@string("number", 13)')
      }
      // 将新图书添加到数据数组开头
      data.items.unshift(newBook)
      
      // 返回成功响应
      return {
        code: 20000,
        data: newBook,
        message: '新增成功'
      }
    }
  },

  /**
   * 更新图书接口
   * PUT /vue-admin-template/book/update/:id
   * 
   * 路径参数：
   * @param {string} id - 图书ID
   * 
   * 请求体：
   * @param {string} [title] - 书名
   * @param {string} [author] - 作者
   * @param {string} [publisher] - 出版社
   * @param {number} [price] - 价格
   * @param {string} [status] - 状态
   * @param {string} [publish_date] - 出版日期
   * @param {string} [description] - 简介
   * 
   * 返回结果：
   * 成功：{ code: 20000, data: 更新后的图书对象, message: '更新成功' }
   * 失败：{ code: 50000, message: '图书不存在' }
   */
  {
    url: '/vue-admin-template/book/update/:id',
    type: 'put',
    response: config => {
      // 从路径参数中获取图书ID
      const { id } = config.params
      // 查找图书在数组中的索引
      const index = data.items.findIndex(item => item.id === id)
      
      // 找到图书进行更新
      if (index !== -1) {
        // 合并更新字段到原对象
        data.items[index] = { ...data.items[index], ...config.body }
        return {
          code: 20000,
          data: data.items[index],
          message: '更新成功'
        }
      } else {
        // 未找到返回错误
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  },

  /**
   * 删除图书接口
   * DELETE /vue-admin-template/book/delete/:id
   * 
   * 路径参数：
   * @param {string} id - 图书ID
   * 
   * 返回结果：
   * 成功：{ code: 20000, message: '删除成功' }
   * 失败：{ code: 50000, message: '图书不存在' }
   */
  {
    url: '/vue-admin-template/book/delete/:id',
    type: 'delete',
    response: config => {
      // 从路径参数中获取图书ID
      const { id } = config.params
      // 查找图书在数组中的索引
      const index = data.items.findIndex(item => item.id === id)
      
      // 找到图书进行删除
      if (index !== -1) {
        // 从数组中移除该图书
        data.items.splice(index, 1)
        return {
          code: 20000,
          message: '删除成功'
        }
      } else {
        // 未找到返回错误
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  }
]