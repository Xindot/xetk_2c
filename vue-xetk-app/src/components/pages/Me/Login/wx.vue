<template>
  <div class="view-login">
    <div class="main">
      <div :style="'min-height:'+w_height+'px;'">
        <div class="l-1">
          <p>
            <img :src="icons.i_arrow_w" alt class="icon-close" @click="goBackPage" />
          </p>
        </div>
        <div class="l-2">
          <div class="l-2-1">
            <img :src="icons.i_logo" alt />
            <p>油惠侠</p>
          </div>
          <div class="l-2-2">
            <div class="login-btn" @click="goWxOauth2LoginPage">
              <span>微信授权登录</span>
            </div>
          </div>
        </div>
        <div class="user-agreement" @click="goPage('user-agreement')">
          <p>已阅读并同意《用户协议》</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_arrow_w, i_logo } from "@/utils/icons";
import { browserName } from "@/utils/const";
import { api_user_wxRegister } from "@/api/oilMan";
import { verifyMobile11 } from "@/utils/verify";

export default {
  data() {
    return {
      w_height: window.innerHeight,
      icons: { i_arrow_w, i_logo }
    };
  },
  created() {
    // console.log(this.$route)
    const { wxOauth2Status, wxOauth2Data } = this.$route.query;
    if (wxOauth2Status == "success") {
      const rd = JSON.parse(wxOauth2Data);
      if (rd.access_token && rd.openid) {
        this.wxLogin(rd);
      }
    } else if (wxOauth2Status == "fail") {
      alert("微信授权失败，请稍后重试");
    }
  },
  mounted() {},
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    goPage(path) {
      this.$router.push(this.routesMatch[path]);
    },
    // 微信登录
    wxLogin(rd) {
      const f = {
        access_token: rd.access_token,
        openid: rd.openid
      };
      api_user_wxRegister(f)
        .then(res => {
          // console.log(res)
          if (res.code == 0 && res.data && res.data.token && res.data.open_id) {
            const mobile = res.data.mobile || "";
            // console.log("mobile=>", mobile);
            window.localStorage.setItem("openid", res.data.open_id);
            if (mobile && verifyMobile11(mobile)) {
              window.localStorage.setItem("token", res.data.token);
              alert("恭喜您，微信登录成功！");
              this.$router.push(this.routesMatch["me"]);
            } else {
              window.localStorage.setItem("token", "");
              this.$router.push(this.routesMatch["bindMobile"]);
            }
          } else {
            alert(res.msg);
          }
        })
        .catch(err => {
          // console.log(err)
          window.showModal({
            title: "错误提示",
            content: err,
            showCancel: false,
            confirmText: "知道了"
          });
        });
    },
    // 去微信授权登录
    goWxOauth2LoginPage() {
      if (browserName != "wx") {
        alert("请在微信客户端打开链接");
        return;
      }
      const backUrl = "wxLogin";
      const currentUrl = `${window.location.origin}${
        window.location.pathname
      }#/me/wxLogin`;
      const returnUrl = encodeURIComponent(`${currentUrl}?backUrl=${backUrl}`);
      const wxFwh = {
        APPID: "wxd1233280b6b4d4d7",
        REDIRECT_URI: encodeURIComponent(
          `http://www.gushitech.com/mp/login/wx-h5.html?returnUrl=${returnUrl}`
        ),
        SCOPE: "snsapi_userinfo",
        STATE: "backUrl"
      };
      const wxTargetUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        wxFwh.APPID
      }&redirect_uri=${wxFwh.REDIRECT_URI}&response_type=code&scope=${
        wxFwh.SCOPE
      }&state=${wxFwh.STATE}#wechat_redirect`;
      // console.log('wxTargetUrl=>', wxTargetUrl);
      window.location.href = wxTargetUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
// $background-image-to-bottom: $background-image-to-bottom;

.view-login {
  .main {
    > div {
      min-height: 100%;
      background-image: $background-image-to-bottom;
      padding: 15px;
      box-sizing: border-box;
      color: $default-color;
      .l-1 {
        color: #ffffff;
        height: 30px;
        p {
          height: 100%;
          position: relative;
          font-size: 0;
          text-align: right;
          img {
            &.icon-close {
              position: absolute;
              left: 5px;
              top: 50%;
              width: 13.5px;
              height: 13.5px;
              transform: translateY(-50%) rotate(-135deg);
            }
          }
        }
      }
      .l-2 {
        margin-top: 30px;
        background-color: #ffffff;
        border-radius: 5px;
        .l-2-1 {
          text-align: center;
          img {
            height: 100px;
            transform: translateY(-50%);
          }
          p {
            margin-top: -60px;
          }
        }
        .l-2-2 {
          padding: 20px;
          box-sizing: border-box;
          > div {
            &.login-btn {
              padding: 7px 0;
              box-sizing: border-box;
              color: #ffffff;
              font-size: 18px;
              border-radius: $btn-border-radius;
              background-image: $background-image-to-right;
            }
          }
        }
      }
      .user-agreement {
        font-size: 13px;
        color: #ffffff;
        margin-top: 20px;
        padding: 10px;
      }
    }
  }
}
</style>

