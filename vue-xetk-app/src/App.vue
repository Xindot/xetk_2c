<template>
  <div id="app" :class="'device-'+iconst.deviceName">
    <Header v-if="header.visible" ref="header" :fdata="header" />
    <transition :name="transitionName">
      <router-view ref="routerView" class="router-view" :class="routerViewClassObject" />
    </transition>
    <TabBar ref="tabBar" v-if="tabBar.visible" />
    <Msg ref="msg" />
  </div>
</template>

<script>
import wx from "wx";
import Header from "@/components/common/Header";
import TabBar from "@/components/common/TabBar.vue";
import Msg from "@/components/common/Msg.vue";
import { deviceName, browserName } from "@/utils/const";
import { api_jssdk } from "@/api/oilMan";
// import { api_wx_config } from '@/api/sunApi'

export default {
  name: "app",
  components: { Header, TabBar, Msg },
  data() {
    return {
      iconst: { deviceName },
      scrollTop: 0,
      header: {
        visible: false,
        relative: false,
        white: false,
        white_1: false,
        backgroundColor: "#ffffff",
        centerValue: "加载中..."
      },
      transitionName: "",
      tabBar: {
        visible: true
      },
      fixedBottom: {
        visible: false
      },
      keyboard: {
        focusin: false
      },
      routerList: [],
      routerGo: 0
    };
  },
  computed: {
    routerViewClassObject() {
      return {
        "have-header": this.header.visible,
        "have-tabBar": this.tabBar.visible,
        "heve-fixed-bottom": this.fixedBottom.visible
      };
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to,from)
      // 使用一个数组变量来存放访问过的路径，再路由变化时适当判断对路由进行推入推出
      this.routerList.push(from.path);
      let existPath = this.routerList.indexOf(to.path);
      if (existPath >= 0) {
        // 如果存在 推出
        this.routerList.splice(existPath, 1);
        // 如果是返回了，则去掉前一个路由
        let formPath = this.routerList.indexOf(from.path);
        this.routerList.splice(formPath, 1);
        this.routerGo = -1;
      } else {
        // 如果不存在 推入
        this.routerGo = 1;
      }
      if (to.meta.tabBar && from.meta.tabBar) {
        this.routerGo = 0;
      }
      if (from.path.includes("orderPayResult")) {
        this.routerGo = -1;
      }
      // console.log('$router.go',this.routerGo)
      this.transitionName = ["slide-right", "fade", "slide-left"][
        this.routerGo + 1
      ];
      if (to.meta.tabBar) {
        setTimeout(() => {
          this.routerList = [];
        }, 300);
      }
      // 根据默认信息设置头部
      this.setMeta(to);
    }
  },
  created() {
    if (browserName === "wx") {
      this.getWxJssdk();
    }
    // 加载时设置头部
    this.setMeta(this.$route);
    // 修改window对象
    this.resetWindow();
    // 监听页面刷新
    window.addEventListener("beforeunload", this.beforeunloadFn, false);
  },
  mounted() {
    window.sessionStorage.setItem(
      "routes:Match",
      JSON.stringify(this.routesMatch)
    );
  },
  methods: {
    // 回到上一页
    backPrevPage(step) {
      this.$router.go(step || -1);
    },
    beforeunloadFn() {
      // console.log('页面刷新')
      window.sessionStorage.removeItem("Index:AllList");
    },
    // 动态设置头部
    setHeader(options) {
      if (options.centerValue) {
        this.header.centerValue = options.centerValue.replace("none", "");
      }
      if (options.backgroundColor) {
        this.header.backgroundColor = options.backgroundColor;
      }
      this.header.leftEvent = options.leftEvent || null;
      this.header.rightEvent = options.rightEvent || null;
    },
    // 显示头部或隐藏
    showHeader(options) {
      this.header.visible = options.visible || false;
    },
    // 根据默认信息设置头部
    setMeta(route) {
      if (!route) {
        return;
      }
      const meta = route.meta || "";
      if (!meta) {
        return;
      }
      let title = route.name || "";
      if (title) {
        document.title = title;
      }
      if (meta.tabBar) {
        this.tabBar.visible = true;
        if (this.$refs.tabBar) {
          this.$refs.tabBar.setSelectedIdx(route.path);
        }
      } else {
        this.tabBar.visible = false;
      }
      if (meta.header) {
        this.header.visible = true;
        this.header.relative = meta.header.relative || false;
        this.header.white = meta.header.white || false;
        this.header.white_1 = meta.header.white_1 || false;
        this.header.backgroundColor = meta.header.backgroundColor || "";
        this.header.centerValue = meta.header.centerValue || "";
        if (!this.header.centerValue) {
          this.header.centerTabs = meta.header.centerTabs || null;
        }
        this.header.leftType = meta.header.leftType || "";
        this.header.leftValue = meta.header.leftValue || "";
        this.header.leftEvent = null;
        this.header.rightType = meta.header.rightType || "";
        this.header.rightValue = meta.header.rightValue || "";
        this.header.rightColor = meta.header.rightColor || "";
        this.header.rightEvent = null;
      } else {
        this.header.visible = false;
      }
      if (meta.fixedBottom) {
        this.fixedBottom.visible = true;
      } else {
        this.fixedBottom.visible = false;
      }
      // 返回上一页
      window.backUrl = num => {
        this.$router.go(num || -1);
      };
      if (meta && meta.appWebViewIndex) {
        window.isBackUrl = false;
      } else {
        window.isBackUrl = true;
      }
    },
    resetWindow() {
      // showModal
      window.showModal = msg => {
        if (this.$refs.msg) {
          this.$refs.msg.showModal({
            ...msg,
            success: res => {
              msg.success && msg.success(res);
            }
          });
        }
      };
      // 定义全局消息 toast
      window.showToast = msg => {
        if (this.$refs.msg) {
          this.$refs.msg.showToast({
            ...msg,
            success: res => {
              msg.success && msg.success(res);
            }
          });
        }
      };
      // js 拦截修改alert对话框
      window.alert = str => {
        window.showToast({ title: str });
      };
      // js 拦截修改confirm对话框
      window.confirm = (tips, callback) => {
        if (this.$refs.msg) {
          this.$refs.msg.showModal({
            title: tips,
            success: res => {
              if (res.confirm) {
                callback && callback(true);
              } else {
                callback && callback(false);
              }
            }
          });
          return !callback;
        }
      };
      // 重新加载url
      window.reloadUrl = url => {
        // alert('reload')
        window.location.href = url || window.location.href;
        window.location.reload(); // this.$router.go(0)
      };
    },
    // // 监听手机端键盘弹出和收起事件
    // keyboardListener(){
    //   if (deviceName=='android') {
    //     const innerHeight = window.innerHeight;
    //     window.addEventListener('resize', () => {
    //       const newInnerHeight = window.innerHeight;
    //       if (innerHeight > newInnerHeight) {
    //         // this.keyboard.focusin = true // 键盘弹出事件处理
    //       } else {
    //         // this.keyboard.focusin = false // 键盘收起事件处理
    //         // window.scrollTo({ top: 0, behavior: 'smooth' });
    //       }
    //     });
    //   } else if (deviceName=='ios') {
    //     window.addEventListener('focusin', () => {
    //       // this.keyboard.focusin = true // 键盘弹出事件处理
    //     });
    //     window.addEventListener('focusout', () => {
    //       // this.keyboard.focusin = false // 键盘收起事件处理
    //       // window.scrollTo({ top: 0, behavior: 'smooth' });
    //     });
    //   }
    // },
    // 交互事件
    webviewEvent(_obj_) {
      // console.log('webviewEvent',_obj_)
      const _JSON_ = JSON.stringify({
        eventName: _obj_.eventName,
        eventData: _obj_.eventData
      });
      // app登录
      if (window.Android && window.Android.goNativeAppEvent) {
        window.Android.goNativeAppEvent(_JSON_);
      }
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.iOS
      ) {
        window.webkit.messageHandlers.iOS.postMessage(_JSON_);
      }
    },
    // 获取微信配置
    getWxJssdk() {
      window.wxReady = false;
      setTimeout(() => {
        window.wxReady = true;
      }, 10000);
      const f = {
        // fwh: 'gushitech',
        url: encodeURIComponent(window.location.href.split("#")[0])
      };
      api_jssdk(f).then(res => {
        // console.log(res);
        if (res.code == 0) {
          const conf = res.data;
          wx.config({
            debug: false,
            appId: conf.appId,
            timestamp: conf.timestamp,
            nonceStr: conf.nonceStr,
            signature: conf.signature,
            jsApiList: conf.jsApiList
          });
          // 微信配置ready
          wx.ready(() => {
            // console.log('微信配置ready');
            window.wx = wx;
            window.wxReady = true;
            this.wxGetLocation(res => {
              window.sessionStorage.setItem(
                "wxGetLocation:res",
                JSON.stringify(res)
              );
            });
          });
          wx.error(() => {
            // window.showModal({
            //   title: "微信配置有误",
            //   content: err,
            //   showCancel: false,
            //   confirmText: "知道了"
            // });
          });
        } else {
          alert(res.msg);
        }
      });
    },
    // 微信分享设置
    wx_share_set(share, callback) {
      if (!window.wxReady) {
        let num = 0;
        setTimeout(() => {
          num += 1; // console.log('wx_share_set 查询wxReady一次');
          window.sessionStorage.setItem("queryWxReady:num", num);
          callback
            ? this.wx_share_set(share, callback)
            : this.wx_share_set(share);
        }, 1000);
        return;
      }
      // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
        title: share.title,
        desc: share.desc,
        link: share.url,
        imgUrl: share.img,
        type: "", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: res => {
          callback && callback(res);
        },
        cancel: res => {
          callback && callback(res);
        }
      });
      // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title: share.title,
        link: share.url,
        imgUrl: share.img,
        success: res => {
          callback && callback(res);
        },
        cancel: res => {
          callback && callback(res);
        }
      });
      // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQQ({
        title: share.title,
        desc: share.desc,
        link: share.url,
        imgUrl: share.img,
        success: res => {
          callback && callback(res);
        },
        cancel: res => {
          callback && callback(res);
        }
      });
      // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQZone({
        title: share.title,
        desc: share.desc,
        link: share.url,
        imgUrl: share.img,
        success: res => {
          callback && callback(res);
        },
        cancel: res => {
          callback && callback(res);
        }
      });
    },
    // 获取定位
    wxGetLocation(callback) {
      if (!window.wxReady) {
        let num = 0;
        setTimeout(() => {
          num += 1; // console.log('wx_share_set 查询wxReady一次');
          window.sessionStorage.setItem("queryWxReady:num", num);
          callback && this.wxGetLocation(callback);
        }, 1000);
        return;
      }
      wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: res => {
          callback && callback(res);
        }
      });
    },
    // 微信导航
    wxOpenLocation(location) {
      if (!(location.latitude && location.longitude)) {
        alert("经纬度参数有误");
        return;
      }
      window.sessionStorage.setItem("location", JSON.stringify(location));
      if (browserName == "wx") {
        wx.openLocation({
          latitude: location.latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: location.longitude, // 经度，浮点数，范围为180 ~ -180。
          name: location.name || "", // 位置名
          address: location.address || "", // 地址详情说明
          scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
        });
      } else {
        alert("请在微信内部浏览器打开使用");
      }
    },
    // 微信官方推荐方式
    weixinPay_WeixinJSBridge(payInfo, callback) {
      window.sessionStorage.setItem("WeixinJSBridge:ok", true);
      if (typeof window.WeixinJSBridge === "undefined") {
        // 微信浏览器内置对象。参考微信官方文档
        // alert('微信浏览器');
        if (document.addEventListener) {
          // alert('浏览器监听');
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.onBridgeReady(payInfo, callback),
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent(
            "WeixinJSBridgeReady",
            this.onBridgeReady(payInfo, callback)
          );
          document.attachEvent(
            "onWeixinJSBridgeReady",
            this.onBridgeReady(payInfo, callback)
          );
        }
      } else {
        //  alert("直接回调");
        this.onBridgeReady(payInfo, callback);
      }
    },
    onBridgeReady(payInfo, callback) {
      window.sessionStorage.setItem(
        "WeixinJSBridgeReady:payInfo",
        JSON.stringify(payInfo)
      );
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: payInfo.appId,
          timeStamp: payInfo.timeStamp,
          nonceStr: payInfo.nonceStr,
          package: payInfo.package,
          signType: payInfo.signType || "MD5",
          paySign: payInfo.paySign
        },
        res => {
          // console.log("getBrandWCPayRequest=>", res);
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            alert("您已支付成功");
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            alert("您已取消支付");
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            alert("支付失败");
          } else {
            alert(res.err_msg || res.errMsg);
          }
          window.sessionStorage.setItem(
            "getBrandWCPayRequest:res",
            JSON.stringify(res)
          );
          callback(res);
        }
      );
    }
  }
};
</script>

<style lang="scss">
// -webkit-overflow-scrolling : touch;
html,
body {
  height: 100%;
  // overflow: auto;
  // -webkit-overflow-scrolling: touch;
}
html,
body,
p,
ul {
  margin: 0;
  padding: 0;
}
body {
  background-color: #eeeeee;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  margin: auto;
  &.device-pc {
    max-width: $fixed-max-width;
    > .header,
    > .tab-bar,
    > .view-msg {
      max-width: $fixed-max-width;
    }
    > .router-view {
      .fixed,
      .fixed-top,
      .fixed-bottom {
        max-width: $fixed-max-width;
      }
    }
    > .view-msg {
      .fixed-center {
        max-width: $fixed-max-width;
      }
    }
  }
}

.fixed,
.fixed-top,
.fixed-bottom {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  z-index: 9;
}
.fixed-top {
  top: 0;
}
.fixed-bottom {
  bottom: 0;
  transform: translateZ(0);
}

input {
  font-size: 14px;
}

//
input,
button,
select,
textarea {
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  border: none;
}

// input placeholder
::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: $input-placeholder-color;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: $input-placeholder-color;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: $input-placeholder-color;
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: $input-placeholder-color;
}

.float-right {
  float: right;
}
/* 伪类清除浮动 开始 */
.clear-float::after {
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}
.clear-float {
  zoom: 1;
}
/* 伪类清除浮动 结束 */

.router-view {
  position: relative;
  .main {
    position: absolute;
    width: 100%;
    top: 0;
    padding: 0;
  }
  &.have-header {
    .main {
      padding-top: 44px;
    }
  }
  &.have-tabBar,
  &.heve-fixed-bottom {
    .main {
      padding-bottom: 60px;
    }
  }
}

/* 页面切换过渡 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-enter,
.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
}
//
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
//
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter,
.slide-down-leave-active {
  opacity: 0;
  transform: translateY(100%);
}
.slide-down-enter,
.slide-up-leave-active {
  opacity: 0;
  transform: translateY(-100%);
}
/* 页面切换过渡 */

/*省略号*/
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 1;
  // overflow: hidden;
}
/**/
</style>
