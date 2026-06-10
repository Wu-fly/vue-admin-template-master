import request from '@/utils/request'

/**
 * 获取图书列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} [params.title] - 书名搜索
 * @param {string} [params.author] - 作者搜索
 * @param {string} [params.status] - 状态筛选
 */
export function getBookList(params) {
  return request({
    url: '/vue-admin-template/book/list',
    method: 'get',
    params
  })
}

/**
 * 获取图书详情
 * @param {string} id - 图书ID
 */
export function getBookDetail(id) {
  return request({
    url: `/vue-admin-template/book/detail/${id}`,
    method: 'get'
  })
}

/**
 * 新增图书
 * @param {Object} data - 图书数据
 * @param {string} data.title - 书名
 * @param {string} data.author - 作者
 * @param {string} [data.publisher] - 出版社
 * @param {number} [data.price] - 价格
 * @param {string} [data.status] - 状态
 * @param {string} [data.publish_date] - 出版日期
 * @param {string} [data.description] - 简介
 */
export function createBook(data) {
  return request({
    url: '/vue-admin-template/book/create',
    method: 'post',
    data
  })
}

/**
 * 更新图书
 * @param {string} id - 图书ID
 * @param {Object} data - 更新的数据
 */
export function updateBook(id, data) {
  return request({
    url: `/vue-admin-template/book/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除图书
 * @param {string} id - 图书ID
 */
export function deleteBook(id) {
  return request({
    url: `/vue-admin-template/book/delete/${id}`,
    method: 'delete'
  })
}
