<template>
  <div class="view-login">
    <div class="main">
      <div :style="'min-height:'+w_height+'px;'">
        <div class="l-1">
          <p v-if="reg!=1">
            <img :src="icons.i_arrow_w" alt class="icon-close" @click="goBackPage" />
            <span @click="loginTab=!loginTab">
              <span :class="{'selected':loginTab}">登录</span>
              <span>/</span>
              <span :class="{'selected':!loginTab}">注册</span>
            </span>
          </p>
        </div>
        <div class="l-2">
          <div class="l-2-1">
            <img :src="icons.i_logo" alt />
            <p>油惠侠</p>
          </div>
          <div class="l-2-2">
            <div class="phone" :class="{'focus':focus.mobile}">
              <input type="tel" maxlength="11" v-model="form.mobile" placeholder="请输入手机号" @focus="focus.mobile=true" @blur="focus.mobile=false" />
              <img v-show="form.mobile" :src="icons.i_clear" alt @click="form.mobile=''" />
            </div>
            <div v-if="(!loginTab)||(loginTab&&!pwdLogin)" class="v-code" :class="{'focus':focus.sms_code}">
              <input type="tel" maxlength="4" v-model="form.sms_code" placeholder="请输入验证码" @focus="focus.sms_code=true" @blur="focus.sms_code=false" />
              <span @click="(!getVCode.status)&&getVCodeAction()">
                <span :style="60-getVCode.seconds>0?'opacity:.5;':'opacity:1;'">获取验证码{{60-getVCode.seconds>0 ? ('('+getVCode.seconds+'s)') : ''}}</span>
              </span>
            </div>
            <div v-if="(!loginTab)||(loginTab&&pwdLogin)" class="pwd" :class="{'focus':focus.password}">
              <input :type="pwdEyeLook?'text':'password'" maxlength="30" v-model="form.password" placeholder="请输入密码" @focus="focus.password=true" @blur="focus.password=false" />
              <img v-show="form.password" :src="pwdEyeLook?icons.i_eye1:icons.i_eye0" alt @click="pwdEyeLook=!pwdEyeLook;" />
            </div>
            <div class="forget-pwd" v-if="loginTab&&pwdLogin">
              <span @click="goSetNewPwdPage">忘记密码</span>
            </div>
            <div class="login-btn" @click="goLoginRegisterAction">
              <span v-if="loginTab">登录</span>
              <span v-else>立即注册领取新人福利</span>
            </div>
            <div class="login-way" v-if="loginTab" @click="pwdLogin=!pwdLogin">
              <span v-if="!pwdLogin">密码登录</span>
              <span v-else>短信验证码登录</span>
            </div>
            <div class="login-d3f" v-if="loginTab">
              <p>其他登录方式</p>
              <div class="d3f-list">
                <div v-for="(el,index) in login3List" :key="index" @click="goLogin3Page(el)">
                  <img :src="el.icon" alt />
                  <p>{{el.text}}</p>
                </div>
              </div>
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
import md5 from "md5";
import {
  i_arrow_w,
  i_logo,
  i_wechat,
  i_clear,
  i_eye0,
  i_eye1
} from "@/utils/icons";
import { api_user_register, api_sms_send, api_user_login } from "@/api/oilMan";
import { verifyMobile11 } from "@/utils/verify";
export default {
  data() {
    return {
      w_height: window.innerHeight,
      icons: { i_arrow_w, i_logo, i_clear, i_eye0, i_eye1 },
      loginTab: true, // 注册 或 登录
      pwdLogin: true, // 密码登录 或 验证码登录
      pwdEyeLook: false, // 密码是否可看
      login3List: [
        {
          icon: i_wechat,
          text: "微信快速登录",
          key: "wechat"
        }
      ],
      focus: {
        mobile: false,
        password: false,
        sms_code: false
      },
      getVCode: {
        seconds: 60
      },
      form: {
        mobile: "",
        password: "",
        sms_code: "",
        open_code: ""
      }
    };
  },
  created() {
    // console.log(this.$route);
    this.reg = this.$route.query.reg || "0";
    if (this.reg == 1) {
      this.loginTab = false;
      document.title = "立即注册领取新人福利";
    }
    this.form.open_code = this.$route.query.open_code || "0";
    window.sessionStorage.setItem("form.open_code", this.form.open_code);
  },
  mounted() {
    // this.set_orderInfo({test:12345})
  },
  methods: {
    // 返回前页
    goBackPage() {
      this.$router.go(-1);
    },
    // 找回密码
    goSetNewPwdPage() {
      this.$router.push(`${this.routesMatch["setPwd"]}?t=find`);
    },
    // 获取验证码
    getVCodeAction() {
      // console.log('getVCodeAction')
      const f = {
        mobile: this.form.mobile,
        type: 1 // 类型,默认为1,1注册验证,2登陆验证,3修改密码验证,4绑定手机号
      };
      if (!f.mobile) {
        alert("请输入手机号码");
        return;
      }
      if (!verifyMobile11(f.mobile)) {
        alert("手机号格式不正确");
        return;
      }
      this.getVCode.seconds = 59;
      const timer = setInterval(() => {
        if (this.getVCode.seconds > 1) {
          this.getVCode.seconds -= 1;
        } else {
          clearInterval(timer);
          this.getVCode.seconds = 60;
        }
      }, 1000);
      // return
      api_sms_send(f).then(res => {
        // console.log(res)
        if (res.code == 0) {
          alert("验证码发送成功");
        } else {
          alert(res.msg);
        }
      });
    },
    // 登录注册
    goLoginRegisterAction() {
      const f = {
        mobile: this.form.mobile || "",
        password: this.form.password || "",
        sms_code: this.form.sms_code || "",
        open_code: this.form.open_code || ""
      };
      if (!this.loginTab) {
        if (!f.mobile) {
          alert("请输入手机号");
          return;
        }
        if (!verifyMobile11(f.mobile)) {
          alert("手机号格式不正确");
          return;
        }
        if (!f.sms_code) {
          alert("请输入验证码");
          return;
        }
        if (!f.password) {
          alert("请输入密码");
          return;
        }
        api_user_register(f).then(res => {
          // console.log(res)
          if (res.code == 0 && res.data && res.data.token) {
            window.localStorage.setItem("token", res.data.token);
            window.showModal({
              title: "恭喜您，注册成功！",
              showCancel: false,
              confirmText: "好的",
              success: res => {
                if (res.confirm) {
                  if (this.reg == 1) {
                    this.$router.push(this.routesMatch["app"]);
                  } else {
                    this.$router.go(-1);
                  }
                }
              }
            });
          } else {
            alert(res.msg);
          }
        });
      }
      if (this.loginTab) {
        if (!f.mobile) {
          alert("请输入手机号");
          return;
        }
        if (!verifyMobile11(f.mobile)) {
          alert("手机号格式不正确");
          return;
        }
        if (this.pwdLogin) {
          delete f.sms_code;
          if (!f.password) {
            alert("请输入密码");
            return;
          }
          f.password = md5(f.password);
        } else {
          delete f.password;
          if (!f.sms_code) {
            alert("请输入验证码");
            return;
          }
        }
        api_user_login(f).then(res => {
          if (res.code == 0 && res.data && res.data.token) {
            window.localStorage.setItem("token", res.data.token);
            alert("恭喜您，登录成功！");
            this.$router.go(-1);
          } else {
            alert(res.msg);
          }
        });
      }
    },
    // 去页面
    goPage(path) {
      this.$router.push(this.routesMatch[path]);
    },
    // 第三方登录页
    goLogin3Page(el) {
      if (el.key && el.key == "wechat") {
        this.$router.push(this.routesMatch["wxLogin"]);
      }
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
          > span {
            display: inline-block;
            font-size: 12px;
            .selected {
              font-size: 18px;
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
            position: relative;
            + div {
              margin-top: 10px;
            }
            input {
              font-size: 15px;
              line-height: 40px;
              width: 100%;
            }
            &.phone,
            &.pwd,
            &.v-code {
              border-bottom: solid 1px $border-color;
              &.focus {
                border-bottom: solid 1px $input-focus-border-color;
              }
            }
            &.phone {
              > img {
                height: 17px;
                position: absolute;
                z-index: 1;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                padding: 10px 0 10px 20px;
              }
            }
            &.pwd {
              > img {
                width: 17px;
                position: absolute;
                z-index: 1;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                padding: 10px 0 10px 20px;
              }
            }
            &.v-code {
              > span {
                display: inline-block;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                width: 40%;
                > span {
                  line-height: initial;
                  position: absolute;
                  z-index: 1;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  display: inline-block;
                  font-size: 12px;
                  padding: 3px 15px;
                  color: #ffffff;
                  border-radius: $semi-circle-border-radius;
                  background-image: $background-image-to-right;
                  box-sizing: border-box;
                }
              }
            }
            &.forget-pwd {
              font-size: 12px;
              color: #777777;
              text-align: right;
              margin: 0;
              > span {
                display: inline-block;
                padding: 10px 20px;
              }
            }
            &.login-btn {
              padding: 7px 0;
              box-sizing: border-box;
              color: #ffffff;
              font-size: 18px;
              border-radius: $btn-border-radius;
              background-image: $background-image-to-right;
            }
            &.login-way {
              font-size: 13px;
              color: #acacac;
              padding: 15px 15px 5px;
            }
            &.login-d3f {
              margin-top: 20px;
              padding: 5px 0;
              > p {
                font-size: 15px;
                color: $default-color;
              }
              .d3f-list {
                text-align: center;
                > div {
                  display: inline-block;
                  font-size: 0;
                  padding: 0 10px;
                  > img {
                    height: 40px;
                    margin: 10px;
                  }
                  > p {
                    font-size: 13px;
                    color: #acacac;
                  }
                }
              }
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

