const Mock = require('mockjs')

// 生成模拟图书数据
const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(5, 10)',
    author: '@name',
    publisher: '@word(5, 10)',
    price: '@float(10, 200, 2, 2)',
    'status|1': ['available', 'borrowed', 'reserved'],
    publish_date: '@date(yyyy-MM-dd)',
    isbn: '@string("number", 13)',
    description: '@paragraph(1, 3)'
  }]
})

module.exports = [
  // 获取图书列表（支持分页）
  {
    url: '/vue-admin-template/book/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10, title, author, status } = config.query
      let items = [...data.items]
      
      // 搜索过滤
      if (title) {
        items = items.filter(item => item.title.includes(title))
      }
      if (author) {
        items = items.filter(item => item.author.includes(author))
      }
      if (status) {
        items = items.filter(item => item.status === status)
      }
      
      // 分页处理
      const total = items.length
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedItems = items.slice(start, end)
      
      return {
        code: 20000,
        data: {
          total: total,
          items: paginatedItems
        }
      }
    }
  },

  // 获取单本图书详情
  {
    url: '/vue-admin-template/book/detail/:id',
    type: 'get',
    response: config => {
      const { id } = config.params
      const book = data.items.find(item => item.id === id)
      
      if (book) {
        return {
          code: 20000,
          data: book
        }
      } else {
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  },

  // 新增图书
  {
    url: '/vue-admin-template/book/create',
    type: 'post',
    response: config => {
      const newBook = {
        id: Mock.mock('@id'),
        ...config.body,
        publish_date: config.body.publish_date || Mock.mock('@date(yyyy-MM-dd)'),
        isbn: Mock.mock('@string("number", 13)')
      }
      data.items.unshift(newBook)
      
      return {
        code: 20000,
        data: newBook,
        message: '新增成功'
      }
    }
  },

  // 更新图书
  {
    url: '/vue-admin-template/book/update/:id',
    type: 'put',
    response: config => {
      const { id } = config.params
      const index = data.items.findIndex(item => item.id === id)
      
      if (index !== -1) {
        data.items[index] = { ...data.items[index], ...config.body }
        return {
          code: 20000,
          data: data.items[index],
          message: '更新成功'
        }
      } else {
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  },

  // 删除图书
  {
    url: '/vue-admin-template/book/delete/:id',
    type: 'delete',
    response: config => {
      const { id } = config.params
      const index = data.items.findIndex(item => item.id === id)
      
      if (index !== -1) {
        data.items.splice(index, 1)
        return {
          code: 20000,
          message: '删除成功'
        }
      } else {
        return {
          code: 50000,
          message: '图书不存在'
        }
      }
    }
  }
]