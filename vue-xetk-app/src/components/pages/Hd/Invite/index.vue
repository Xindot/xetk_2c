<template>
  <div class="view-invite">
    <div class="main">
      <div :class="{'have-header':header.visible}">
        <div>
          <p v-for="(el,index) in list" :key="index" :class="'p-'+index">
            <img :src="el" alt @click="goInvite(el,index)" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { browserName, iOS, Android } from "@/utils/const";
import { api_user_info } from "@/api/oilMan";
export default {
  data() {
    return {
      list: [
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/invite2/bg@2x_01.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/invite2/bg@2x_02.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/invite2/btn@2x.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/invite2/bg@2x_03.png",
        "https://s1.nianran.net/static/d3lemon/assets/img/hd/invite2/bg@2x_04.png"
      ],
      nativeAppInfo: null,
      userInfo: null,
      open_code: null,
      header: {
        visible: true
      },
      shareObj: {
        title: "油惠侠-加油充值超值优惠!",
        desc: "我在油惠侠领到168元新手红包,注册即到!",
        url: "",
        img: "https://h5.gushitech.com/oilv2/logo/logo-1@2x-w50.png"
      }
      // https://s1.nianran.net/static/d3lemon/assets/icon/logo-1@2x.png?imageView2/1/w/50/h/50/q/100
    };
  },
  created() {
    this.header.visible = !!this.$route.meta.header;
    this.nativeAppInfo = JSON.parse(this.$route.query.nativeAppInfo || null);
  },
  mounted() {
    if (iOS() || Android()) {
      if (this.nativeAppInfo && this.nativeAppInfo.appToken) {
        window.localStorage.setItem("token", this.nativeAppInfo.appToken);
        this.getUserInfo();
      } else {
        window.localStorage.setItem("token", "");
      }
    } else {
      this.shareObj.url = this.getShareUrl();
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
    getUserInfo() {
      api_user_info().then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.userInfo = res.data;
          if (this.userInfo) {
            window.localStorage.setItem(
              "MeIndex:userInfo",
              JSON.stringify(this.userInfo)
            );
            this.shareObj.url = this.getShareUrl();
          }
        } else {
          alert(res.msg);
        }
      });
    },
    getShareUrl() {
      this.userInfo = JSON.parse(
        window.localStorage.getItem("MeIndex:userInfo") || null
      );
      this.open_code = (this.userInfo && this.userInfo.open_code) || "0";
      const path = this.routesMatch["login"];
      const href = `${window.location.origin}${window.location.pathname}#${path}?reg=1`;
      const share = href.includes("?")
        ? `&share=1&open_code=${this.open_code}`
        : `?share=1&open_code=${this.open_code}`;
      return href + share;
    },
    goInvite(el, index) {
      // console.log(el, index);
      if (index == 2) {
        // alert("goInvite");
        this.goShare();
      }
    },
    goShare() {
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
      if (!this.shareObj.url) {
        // alert("分享url不正确");
        this.shareObj.url = this.getShareUrl();
      }
      if (iOS() || Android()) {
        this.$parent.webviewEvent({
          eventName: "share",
          // 给app的
          eventData: {
            title: this.shareObj.title,
            desc: this.shareObj.desc,
            url: this.shareObj.url,
            img: this.shareObj.img
          }
        });
      } else {
        window.showModal({
          title: "点击页面右上角”···“分享到朋友或朋友圈"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-invite {
  .main {
    > div {
      &.have-header {
        margin-top: -44px;
      }
      > div {
        p {
          &.p-2 {
            transform: translateY(-100%);
            height: 0;
            img {
              width: 66%;
            }
          }
          font-size: 0;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
