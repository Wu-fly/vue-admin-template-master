<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
// 导入用户名格式验证工具函数，用于校验用户名是否合法
import { validUsername } from '@/utils/validate'

/**
 * 登录页面组件
 * 负责提供用户登录界面，包含用户名/密码输入、表单验证、登录请求等核心功能
 * 登录全链路流程：
 * 1. 用户输入用户名和密码
 * 2. 表单验证（用户名格式、密码长度）
 * 3. 调用 Vuex action 发起登录请求
 * 4. 登录成功 → 跳转到目标页面（优先 redirect 参数，否则首页）
 * 5. 登录失败 → 显示错误提示
 */
export default {
  // 组件名称标识
  name: 'Login',

  /**
   * 组件数据定义
   * 返回组件所需的响应式数据对象
   */
  data() {
    /**
     * 用户名自定义验证规则
     * @param {Object} rule - Element UI 表单验证规则配置对象
     * @param {String} value - 用户输入的用户名
     * @param {Function} callback - 验证结果回调函数
     */
    const validateUsername = (rule, value, callback) => {
      // 调用工具函数验证用户名格式是否符合要求
      if (!validUsername(value)) {
        // 验证失败，传递错误信息
        callback(new Error('Please enter the correct user name'))
      } else {
        // 验证通过，无参数调用回调
        callback()
      }
    }

    /**
     * 密码自定义验证规则
     * @param {Object} rule - Element UI 表单验证规则配置对象
     * @param {String} value - 用户输入的密码
     * @param {Function} callback - 验证结果回调函数
     */
    const validatePassword = (rule, value, callback) => {
      // 验证密码长度至少6位
      if (value.length < 6) {
        // 验证失败，传递错误信息
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        // 验证通过，无参数调用回调
        callback()
      }
    }

    // 返回组件数据对象
    return {
      // 登录表单数据对象，包含用户名和密码
      loginForm: {
        username: 'admin',  // 默认用户名
        password: '111111'  // 默认密码
      },
      // 表单验证规则配置
      loginRules: {
        // 用户名验证规则：必填，失焦触发，使用自定义验证器
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // 密码验证规则：必填，失焦触发，使用自定义验证器
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,           // 登录请求加载状态标识
      passwordType: 'password', // 密码输入框类型（password/text）
      redirect: undefined       // 登录成功后重定向路径，从URL参数获取
    }
  },

  /**
   * 监听属性配置
   * 监听路由变化，获取登录前的访问路径
   */
  watch: {
    // 监听 $route 对象变化
    $route: {
      // 路由变化时的处理函数
      handler: function(route) {
        // 从路由查询参数中提取 redirect 值，用于登录成功后重定向
        this.redirect = route.query && route.query.redirect
      },
      immediate: true  // 组件初始化时立即执行一次
    }
  },

  /**
   * 组件方法定义
   */
  methods: {
    /**
     * 切换密码显示/隐藏状态
     * 切换密码输入框的 type 属性，实现密码明文/密文切换
     */
    showPwd() {
      // 判断当前密码类型并切换
      if (this.passwordType === 'password') {
        this.passwordType = ''  // 切换为明文显示
      } else {
        this.passwordType = 'password'  // 切换为密文显示
      }
      // 切换后重新聚焦到密码输入框，提升用户体验
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    /**
     * 处理登录请求
     * 触发表单验证并发起登录请求
     */
    handleLogin() {
      // 调用 Element UI 表单验证方法
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 表单验证通过，开始登录流程
          this.loading = true  // 设置加载状态为true，显示加载动画

          // 调用 Vuex 的 user/login action 执行登录
          // loginForm 包含用户名和密码
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 登录成功，跳转到目标页面
            // 如果有 redirect 参数则跳转到该路径，否则跳转到首页
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false  // 关闭加载状态
          }).catch(() => {
            // 登录失败，关闭加载状态
            this.loading = false
          })
        } else {
          // 表单验证失败，输出错误信息到控制台
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
