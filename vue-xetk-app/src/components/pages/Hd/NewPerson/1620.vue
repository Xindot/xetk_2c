<template>
  <div class="view-hd1620">
    <div class="main">
      <div :class="{'have-header':header.visible}">
        <div v-for="(el,index) in list" :key="index" :class="'index-'+index">
          <img :src="el" alt @click="index==3&&goOilpackagePage()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { browserName, iOS, Android } from "@/utils/const";
export default {
  data() {
    return {
      nativeAppInfo: null,
      list: [
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/1620/1620@2x_01.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/1620/1620@2x_02.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/1620/1620@2x_03.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/1620/btn@2x.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/1620/1620@2x_04.png"
      ],
      header: {
        visible: true
      },
      shareObj: {
        title: "全民狂欢日,抢百元优惠券", // 分享标题
        desc: "新人注册领1620元优惠券，先到先得", // 分享描述
        url: "", // 分享链接
        img: "https://h5.gushitech.com/oilWeb/logo/logo-1@2x-w50.png" // 分享图标
      }
    };
  },
  created() {
    this.header.visible = !!this.$route.meta.header;
    this.nativeAppInfo = JSON.parse(this.$route.query.nativeAppInfo || null);
    this.shareObj.url = this.getShareUrl();
  },
  mounted() {
    if (iOS() || Android()) {
      if (this.nativeAppInfo && this.nativeAppInfo.appToken) {
        window.localStorage.setItem("token", this.nativeAppInfo.appToken);
      } else {
        window.localStorage.setItem("token", "");
      }
    }
    // 维信分享设置
    if (browserName === "wx") {
      const shareObj = {
        title: this.shareObj.title,
        desc: this.shareObj.desc,
        url: this.shareObj.url,
        img: this.shareObj.img
      };
      this.$parent.wx_share_set(shareObj, res => {
        window.sessionStorage.setItem("wxShare:res", JSON.stringify(res));
      });
    }
  },
  methods: {
    getShareUrl() {
      this.userInfo = JSON.parse(
        window.localStorage.getItem("MeIndex:userInfo") || null
      );
      this.open_code = (this.userInfo && this.userInfo.open_code) || "0";
      const href =
        window.location.origin + window.location.pathname + "#/hd/1620";
      const share = href.includes("?")
        ? `&share=1&open_code=${this.open_code}`
        : `?share=1&open_code=${this.open_code}`;
      return href + share;
    },
    goOilpackagePage() {
      const token = window.localStorage.getItem("token") || "";
      if (!token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      window.showModal({
        title: "恭喜您，优惠券大礼包领取成功！您可以马上使用！",
        // showCancel:false,
        confirmText: "马上使用",
        success: res => {
          if (res.confirm) {
            if (iOS() || Android()) {
              this.$parent.webviewEvent({
                eventName: "router",
                eventData: {
                  redirect_type: "app",
                  url: "oilpackage"
                }
              });
            } else {
              this.$router.push(this.routesMatch["oilpackage"]);
            }
          }
        }
      });
    },
    goReceiveCoupon() {
      const token = window.localStorage.getItem("token") || "";
      if (!token) {
        if (iOS() || Android()) {
          this.$parent.webviewEvent({
            eventName: "router",
            eventData: {
              redirect_type: "app",
              url: "login"
            }
          });
        } else {
          // 登录
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
        }
        return;
      }
      if (iOS() || Android()) {
        this.$parent.webviewEvent({
          eventName: "router",
          eventData: {
            redirect_type: "app",
            url: "myCoupon"
          }
        });
      } else {
        // alert('去优惠券列表')
        this.$router.push(this.routesMatch["myCoupon"]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-hd1620 {
  .main {
    > div {
      &.have-header {
        margin-top: -44px;
      }
      > div {
        font-size: 0;
        position: relative;
        img {
          width: 100%;
        }
        &.index-3 {
          img {
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            width: 90%;
            transform: translateY(-125%);
          }
        }
      }
    }
  }
}
</style>
