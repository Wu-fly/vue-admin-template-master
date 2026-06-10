import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // Determine whether the route requires permission
        const roles = store.getters.roles
        // 处理角色数组或字符串
        const roleArray = Array.isArray(roles) ? roles : [roles]

        if (to.meta && to.meta.roles) {
          // Check if the user has the required role
          const hasPermission = to.meta.roles.some(role => roleArray.includes(role))
          if (hasPermission) {
            next()
          } else {
            // No permission, redirect to 401 page
            next('/401')
            NProgress.done()
          }
        } else {
          next()
        }
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          // After getting user info, check role permission again
          const roles = store.getters.roles
          const roleArray = Array.isArray(roles) ? roles : [roles]

          if (to.meta && to.meta.roles) {
            const hasPermission = to.meta.roles.some(role => roleArray.includes(role))
            if (hasPermission) {
              next()
            } else {
              next('/401')
              NProgress.done()
            }
          } else {
            next()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
