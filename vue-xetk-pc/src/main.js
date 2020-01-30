import Vue from 'vue'
import hljs from 'hljs' //导入代码高亮文件
import VueClipboard from 'vue-clipboard2'
import {
  Message
} from 'element-ui'

import App from './App.vue'
import router from './router';

Vue.use(VueClipboard)

// highlight增加行号
// https://blog.csdn.net/Fmuma/article/details/83063538
const highlightCode = (el = document) => {
  let highlight = el.querySelectorAll('pre code')
  highlight.forEach((block) => {
    // 行号插件
    hljs.highlightBlock(block)
  })
  hljs.initLineNumbersOnLoad();
}

//自定义一个代码高亮指令
// Vue.directive('highlight', (el) => {
//   highlightCode(el)
// })

Vue.prototype.highlightCode = highlightCode

// 全局路由映射
Vue.prototype.routesMatch = router.options.routesMatch

Vue.config.productionTip = false

Vue.prototype.$copyResult = (message, type) => {
  Message.closeAll()
  Message({
    message,
    type,
    center: true,
    offset: 60,
    // duration: 0
  })
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')