// import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  api_user_accessToken
} from '@/api/oilMan'
import {
  isString,
  isArray,
  isJson
} from '@/utils/verify'

// Vue.use(VueRouter)

// indexPage
import IndexPage from '@pages/Index' // 首页
import IndexOilCardPage from '@pages/Index/oilCard' // 油卡充值: 1油卡套餐充值 0油卡直充
import IndexPhoneBillPage from '@pages/Index/phoneBill' // 话费充值
import IndexSecurityPage from '@pages/Index/security' // 安全保障
// findPage
import FindPage from '@pages/Find' // 发现
import FindNearGasPage from '@pages/Find/neargas'

// mePage
import MePage from '@pages/Me' // 我的
import MeLoginPage from '@pages/Me/Login' // 登录 注册
import MeWxLoginPage from '@pages/Me/Login/wx' // 微信登录
import MeLoginAgreementPage from '@pages/Me/Login/agreement' // 用户使用协议
import MeOilCardPage from '@pages/Me/OilCard' // 我的油卡
import MeOilCardAddPage from '@pages/Me/OilCard/add' // 添加油卡
import MeOilCardGetPage from '@pages/Me/OilCard/get' // 领取油卡
import MeCouponPage from '@pages/Me/Coupon' // 优惠券
import MeOrderListPage from '@pages/Me/Order/list' // 订单：oil油卡订单 phone话费订单
import MeOrderDetailPage from '@pages/Me/Order/detail' // 订单详情
import MeOrderPayPage from '@pages/Me/Order/pay' // 订单支付
import MeOrderPayResultPage from '@pages/Me/Order/payResult' // 支付结果 1支付成功 0支付失败
import MeFaqPage from '@pages/Me/FAQ' // 常见问题
import MeAboutPage from '@pages/Me/About' // 关于我们
import MeKefuPage from '@pages/Me/Kefu' // 客服
import MeAppPage from '@pages/Me/App' // 下载app
import MeAddressPage from '@pages/Me/Address/list' // 我的地址
import MeAddressEditPage from '@pages/Me/Address/edit' // 编辑收货地址
import MeCarListPage from '@pages/Me/Car/list' // 我的车辆列表
import MeCarAddPage from '@pages/Me/Car/add' // 新增我的车辆
import MeCarLawPage from '@pages/Me/Car/law' // 违章查询
import MeSettingPage from '@pages/Me/Setting' // 设置
import MeSetPwdPage from '@pages/Me/Setting/setPwd' // 设置密码
import MeBindMobilePage from '@pages/Me/Setting/bindMobile' // 绑定手机号

// hd 活动
import MeHd168Page from '@pages/Hd/NewPerson/168' // 168
import MeHd1620Page from '@pages/Hd/NewPerson/1620' // 1620
import MeHdInvitePage from '@pages/Hd/Invite' // 邀请活动

// mall 商城
import MallDevPage from '@pages/Mall/dev'
import MallPage from '@pages/Mall'
import MallGoodsClassPage from '@pages/Mall/goodsClass'
import MallGoodsDetailPage from '@pages/Mall/goodsDetail'
import MallCreateOrderPage from '@pages/Mall/createOrder'
import MallOrderDetailPage from '@pages/Mall/orderDetail'
import MallOrder56Page from '@pages/Mall/order56'

// icon
import i_add from '@/assets/icon/me/oilCard/add@2x.png'

// 路由规则：含支付页面驼峰payPage(参数下划线_拼接) 普通页面下划线_ webview页面斜线/
const routes = [{
  path: '/',
  redirect: '/index',
}, {
  path: '/index',
  match: 'index',
  name: '油惠侠',
  meta: {
    tabBar: true
  },
  component: IndexPage,
}, {
  path: '/index_oilCard_*', // 1油卡套餐充值 0油卡直充
  match: {
    'oildirect': '/index_oilCard_0',
    'oilpackage': '/index_oilCard_1'
  },
  name: '油惠侠',
  meta: {
    header: {
      white: true,
      backgroundColor: 'transparent',
      centerValue: '油卡充值'
    },
    fixedBottom: true
  },
  component: IndexOilCardPage,
}, {
  path: '/index_phoneBill',
  match: ['phonepackage', 'phonedirect'],
  name: '油惠侠',
  meta: {
    header: {
      centerValue: '话费充值'
    },
    fixedBottom: true
  },
  component: IndexPhoneBillPage,
}, {
  path: '/index/security',
  match: ['safepage', 'safePage'],
  name: '油惠侠',
  meta: {
    header: {
      centerValue: '安全保障'
    },
    appWebViewIndex: true,
  },
  component: IndexSecurityPage,
}, {
  path: '/find',
  match: ['find', 'hotactivity'],
  name: '发现',
  meta: {
    tabBar: true
  },
  component: FindPage,
}, {
  path: '/find_neargas',
  match: 'neargas',
  name: '发现',
  meta: {
    header: {
      centerValue: '附近加油站'
    }
  },
  component: FindNearGasPage,
}, {
  path: '/me',
  match: 'me',
  name: '个人中心',
  meta: {
    tabBar: true
  },
  component: MePage,
}, {
  path: '/me_login',
  match: ['login', 'register'],
  name: '登录',
  component: MeLoginPage,
}, {
  path: '/me_wxLogin',
  match: 'wxLogin',
  name: '微信登录',
  component: MeWxLoginPage,
}, {
  path: '/me/login/agreement',
  match: 'user-agreement',
  name: '登录',
  meta: {
    header: {
      centerValue: '用户使用协议'
    },
    appWebViewIndex: true,
  },
  component: MeLoginAgreementPage,
}, {
  path: '/me_oilCard',
  match: 'myOilCard',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '我的油卡',
      rightType: 'icon',
      rightValue: i_add
    }
  },
  component: MeOilCardPage,
}, {
  path: '/me_oilCard_add',
  match: 'addOilCard',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '添加油卡'
    }
  },
  component: MeOilCardAddPage,
}, {
  path: '/meOilCardGet', // 含支付
  match: 'getoilcard',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '领取油卡'
    },
    fixedBottom: true
  },
  component: MeOilCardGetPage,
}, {
  path: '/me_coupon',
  match: 'myCoupon',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '我的优惠券'
    }
  },
  component: MeCouponPage,
}, {
  path: '/me_orderList_*', // mall商城订单 oil油卡订单 phone话费订单
  match: {
    'mallOrderList': '/me_orderList_mall',
    'oilOrderList': '/me_orderList_oil',
    'phoneOrderList': '/me_orderList_phone'
  },
  name: '个人中心',
  meta: {
    header: {
      centerValue: '油卡订单'
    }
  },
  component: MeOrderListPage,
}, {
  path: '/meOrderDetail_*_:id', // 含支付
  match: {
    'oilOrderDetail': '/meOrderDetail_oil',
    'phoneOrderDetail': '/meOrderDetail_phone'
  },
  name: '个人中心',
  meta: {
    header: {
      centerValue: '订单详情'
    }
  },
  component: MeOrderDetailPage,
}, {
  path: '/meOrderPay_*', // 含支付
  match: {
    'oilOrderPay': '/meOrderPay_oil',
    'phoneOrderPay': '/meOrderPay_phone'
  },
  name: '个人中心',
  meta: {
    header: {
      centerValue: '订单支付'
    }
  },
  component: MeOrderPayPage,
}, {
  path: '/me_orderPayResult_*',
  match: {
    'oilOrderPayResult': '/me_orderPayResult_oil',
    'phoneOrderPayResult': '/me_orderPayResult_phone',
    'mallOrderPayResult': '/me_orderPayResult_mall'
  },
  name: '个人中心',
  meta: {
    header: {
      centerValue: '支付结果'
    }
  },
  component: MeOrderPayResultPage,
}, {
  path: '/me/faq',
  match: 'faq',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '常见问题'
    },
    appWebViewIndex: true,
  },
  component: MeFaqPage,
}, {
  path: '/me/about',
  match: 'about',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '关于我们'
    },
    appWebViewIndex: true,
  },
  component: MeAboutPage,
}, {
  path: '/me_kefu',
  match: 'customerservice',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '联系客服'
    }
  },
  component: MeKefuPage,
}, {
  path: '/app',
  match: 'app',
  name: '下载App',
  component: MeAppPage,
}, {
  path: '/me_address',
  match: 'myAddress',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '我的地址'
    },
    fixedBottom: true
  },
  component: MeAddressPage,
}, {
  path: '/me_address_edit',
  match: 'myAddressEdit',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '编辑收货地址',
      rightValue: '保存',
      rightColor: '#FD6067'
    }
  },
  component: MeAddressEditPage,
}, {
  path: '/me/car/list',
  match: ['myCarList', 'carviolation'],
  name: '我的车辆',
  meta: {
    header: {
      centerValue: '车辆管理'
    },
    fixedBottom: true,
    appWebViewIndex: true,
  },
  component: MeCarListPage,
}, {
  path: '/me_car_add',
  match: 'myCarAdd',
  name: '我的车辆',
  meta: {
    header: {
      centerValue: '添加车辆'
    }
  },
  component: MeCarAddPage,
}, {
  path: '/me_car_law',
  match: 'myCarLaw',
  name: '我的车辆',
  meta: {
    header: {
      centerValue: '违章查询'
    }
  },
  component: MeCarLawPage,
}, {
  path: '/me_setting',
  match: 'setting',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '设置'
    }
  },
  component: MeSettingPage,
}, {
  path: '/me_setting_bindMobile',
  match: 'bindMobile',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '绑定手机号'
    }
  },
  component: MeBindMobilePage,
}, {
  path: '/me_setting_setPwd',
  match: 'setPwd',
  name: '个人中心',
  meta: {
    header: {
      centerValue: '设置新密码'
    }
  },
  component: MeSetPwdPage,
}, {
  path: '/hd/168',
  match: ['newPerson', 'Share'],
  name: '全民狂欢日,抢百元优惠券',
  meta: {
    header: {
      white: true,
      backgroundColor: 'transparent'
    },
    appWebViewIndex: true,
  },
  component: MeHd168Page,
}, {
  path: '/hd/1620',
  match: ['newPerson1620', 'Share1620'],
  name: '全民狂欢日,抢百元优惠券',
  meta: {
    header: {
      white: true,
      backgroundColor: 'transparent'
    },
    appWebViewIndex: true,
  },
  component: MeHd1620Page,
}, {
  path: '/hd/invite',
  match: ['invite', 'intive'],
  name: '邀请好友有礼相送',
  meta: {
    header: {
      white: true,
      backgroundColor: 'transparent'
    },
    appWebViewIndex: true,
  },
  component: MeHdInvitePage,
}, {
  path: '/mall_dev',
  match: 'mallDev',
  name: '精美商城',
  meta: {
    header: {
      backgroundColor: 'transparent'
    },
    appWebViewIndex: true,
  },
  component: MallDevPage,
}, {
  path: '/mall',
  match: ['mall', 'hotmarket'],
  name: '精美商城',
  // meta: {
  //   header: {
  //     white: true,
  //     backgroundColor: 'transparent'
  //   },
  // },
  meta: {
    tabBar: true
  },
  component: MallPage,
}, {
  path: '/mall_goods_class',
  match: 'mallGoodsClass',
  name: '商城列表',
  meta: {
    header: {
      centerValue: ''
    },
  },
  component: MallGoodsClassPage,
}, {
  path: '/mall_goods_detail_*',
  match: {
    'mallGoodsDetail': '/mall_goods_detail'
  },
  name: '商品详情',
  meta: {
    header: {
      white_1: true,
      backgroundColor: 'transparent'
    },
    fixedBottom: true,
  },
  component: MallGoodsDetailPage,
}, {
  path: '/mall_create_order', //含支付
  match: 'mallCreateOrder',
  name: '精品商城',
  meta: {
    header: {
      centerValue: '订单确认'
    },
  },
  component: MallCreateOrderPage,
}, {
  path: '/mall_orderDetail_:id', // 含支付
  match: {
    'mallOrderDetail': '/mall_orderDetail',
  },
  name: '精品商城',
  meta: {
    header: {
      centerValue: '订单详情'
    }
  },
  component: MallOrderDetailPage,
}, {
  path: '/mall_order56', // 含支付
  match: 'mallOrder56',
  name: '精品商城',
  meta: {
    header: {
      centerValue: '物流信息'
    }
  },
  component: MallOrder56Page,
}]


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

  const iOS = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.iOS
  const Android = window.Android
  const sharePage = window.location.href.includes('share=1')
  // 如果是app
  if (Android || iOS || sharePage) {
    if (n.meta && n.meta.header && n.meta.header.centerValue) {
      n.name = n.meta.header.centerValue
    }
    if (n.meta) {
      n.meta.header = false
    }
  }
}

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

const wxQauth2 = (code, next) => {
  api_user_accessToken({
    code
  }).then(res => {
    // console.log(res)
    let wxOauth2Status = ''
    if (res.access_token && res.openid) {
      window.localStorage.setItem('openid:wxQauth2', res.openid)
      wxOauth2Status = 'success'
    } else {
      wxOauth2Status = 'fail'
    }
    next({
      path: routesMatch['wxLogin'],
      query: {
        wxOauth2Status,
        wxOauth2Data: JSON.stringify(res),
      }
    })
  })
}

route.beforeEach((to, from, next) => {
  //获取当前页面链接进入路由签名
  // console.log(to,from)
  // if(from.name===null&&to.meta){
  //   to.meta.header = false
  // }
  const {
    code,
    backUrl,
    state
  } = to.query
  //判断有没有code
  if (state == 'backUrl' && code && backUrl) {
    // console.log(code,backUrl)
    wxQauth2(code, next)
  } else {
    next()
  }
})

export default route