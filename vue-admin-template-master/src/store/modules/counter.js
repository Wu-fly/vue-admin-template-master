/**
 * Vuex counter 模块
 * 提供计数器功能，支持递增和递减操作
 */

// 初始状态
const state = {
  // 计数器值
  count: 0
}

// 状态变更方法（同步）
const mutations = {
  /**
   * 增加计数器
   * @param {Object} state - 当前状态
   * @param {Number} step - 增加的步长，默认为1
   */
  INCREMENT(state, step = 1) {
    state.count += step
  },

  /**
   * 减少计数器
   * @param {Object} state - 当前状态
   * @param {Number} step - 减少的步长，默认为1
   */
  DECREMENT(state, step = 1) {
    state.count -= step
  }
}

// 异步操作方法
const actions = {
  /**
   * 异步增加计数器
   * @param {Object} context - 上下文对象，包含 commit 方法
   * @param {Number} step - 增加的步长
   */
  increment({ commit }, step) {
    commit('INCREMENT', step)
  },

  /**
   * 异步减少计数器
   * @param {Object} context - 上下文对象，包含 commit 方法
   * @param {Number} step - 减少的步长
   */
  decrement({ commit }, step) {
    commit('DECREMENT', step)
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
