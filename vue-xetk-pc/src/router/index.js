import VueRouter from "vue-router";

import {
  isString,
  isArray,
  isJson
} from '@/utils/verify'

import IndexPage from '@pages/index'
import LoginPage from '@pages/login'

const routes = [{
    path: '/',
    match: {
      'index': '/'
    },
    component: IndexPage
  },
  {
    path: '/login',
    match: {
      'login': '/login',
      "register": '/login?t=register'
    },
    name: '登录',
    meta: {
      loginPage: true
    },
    component: LoginPage,
  },
]

// 内部跳转 路由映射表
const routesMatch = {}
for (let i = 0; i < routes.length; i++) {
  const n = routes[i];
  if (n.match) {
    if (isString(n.match)) {
      routesMatch[n.match] = n.path
    }
    if (isJson(n.match)) {
      Object.assign(routesMatch, {
        ...n.match
      })
    }
    if (isArray(n.match)) {
      for (let i = 0; i < n.match.length; i++) {
        routesMatch[n.match[i]] = n.path
      }
    }
  }
}

window.sessionStorage.setItem('routesMatch', JSON.stringify(routesMatch))


const route = new VueRouter({
  // mode: 'hash',
  routes,
  routesMatch,
  // 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。
  // 在路由配置中使用scrollBehavior
  scrollBehavior(to, from, savedPosition) {
    // console.log(savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

export default route