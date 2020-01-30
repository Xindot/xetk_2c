<template>
  <div class="header">
    <div class="menu">
      <div class="width-1">
        <div class="left">
          <img src="http://s1.nianran.net/assets/2020/paste/20200123170758.png" class="logo-icon" @click="goPage('index')">
        </div>
        <div class="center">
          <span>一个有质量的IT面试题库，助力于程序员的自我修养</span>
        </div>
        <div class="right">
          <div class="user">
            <i class="el-icon-user"></i>
            <span class="s-1" @click="showLogin('0')"> 登录 </span>
            <span> / </span>
            <span class="s-1" @click="showLogin('1')"> 注册 </span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-bg" v-if="loginDialog.visible">
      <div>
        <i class="el-icon-close" @click="loginDialog.visible=false"></i>
        <p class="p-1">
          <img src="http://s1.nianran.net/assets/2020/paste/20200123170758.png">
          <span>{{['用邮箱密码登录','用邮箱注册','找回密码'][loginDialog.status]}}</span>
        </p>
        <p class="v-tips" style="height:20px;line-height:20px;">{{vTips}}</p>
        <p class="p-2" style="margin-top:0;">
          <input type="text" v-model="loginDialog.form.account" placeholder="邮箱">
        </p>
        <p class="p-2" v-if="loginDialog.status>='1'">
          <input type="text" v-model="loginDialog.form.code" placeholder="验证码" style="width:40%;">
          <button @click="getVCodeFn" :disabled="getVCode.doing||getVCode.seconds>0">{{getVCode.seconds>0?getVCode.seconds+'s':'获取邮箱验证码'}}</button>
        </p>
        <p class="p-2">
          <input type="password" v-model="loginDialog.form.password" placeholder="密码">
        </p>
        <p class="p-2" v-if="loginDialog.status>='1'">
          <input type="password" v-model="loginDialog.form.password2" placeholder="确认密码">
        </p>
        <p class="p-3-0" v-if="loginDialog.status=='0'">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </p>
        <p class="p-3">
          <button @click="submitFn">{{['登录','注册','确定'][loginDialog.status]}}</button>
        </p>
        <p class="p-4" v-if="loginDialog.status=='0'">
          <span @click="loginDialog.status='2'">忘记密码？</span>
        </p>
        <p style="height:60px;"></p>
        <p class="p-5" :class="'s-'+loginDialog.status">
          <span @click="loginDialog.status=['1','0','0'][loginDialog.status]">
            {{['还没有帐号，去注册','已经有帐号，去登录','已经有帐号，去登录'][loginDialog.status]}}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
≈S
<script>
import { checkEmail } from "@/utils/const";
import {
  SunApi_user_vcode,
  SunApi_user_login,
  SunApi_user_register
} from "@/api/SunApi";

export default {
  data() {
    return {
      loginDialog: {
        visible: false,
        status: "0", // 0login 1register 2forgetpwd
        form: {
          account: "",
          code: "",
          password: "",
          password2: ""
        },
        doing: false
      },
      getVCode: {
        seconds: 0,
        doing: false
      },
      vTips: ""
    };
  },
  created() {},
  methods: {
    goPage(route) {
      this.$router.push(this.routesMatch[route]);
    },
    showLogin(status) {
      this.loginDialog.visible = true;
      this.loginDialog.status = status;
    },
    getVCodeFn() {
      this.vTips = "";
      const f = this.loginDialog.form || {};
      if (!f.account) {
        this.vTips = "注册帐号的邮箱不能为空";
        return;
      }
      if (!checkEmail(f.account)) {
        this.vTips = "注册帐号的邮箱格式不正确";
        return;
      }
      const f1 = {
        account: f.account,
        SignName: "小鹅题库",
        scene: 1
      };
      this.getVCode.doing = true;
      SunApi_user_vcode(f1).then(res => {
        this.getVCode.doing = false;
        if (res.code == 200) {
          this.getVCode.seconds = 59;
          const timer = setInterval(() => {
            if (this.getVCode.seconds > 0) {
              this.getVCode.seconds -= 1;
            } else {
              clearInterval(timer);
            }
          }, 1000);
          this.$notify.success({
            title: "成功提示",
            message: res.msg || `邮箱验证码已发送`
          });
        } else {
          this.vTips = res.msg || `获取邮箱验证码失败，请稍后重试`;
        }
      });
    },
    submitFn() {
      this.vTips = "";
      const status = this.loginDialog.status || "0";
      const f = this.loginDialog.form || {};
      if (!f.account) {
        this.vTips = "邮箱不能为空";
        return;
      }
      if (!checkEmail(f.account)) {
        this.vTips = "邮箱格式不正确";
        return;
      }
      if (status == "1") {
        if (!f.code) {
          this.vTips = "验证码不能为空";
          return;
        }
      }
      if (!f.password) {
        this.vTips = "密码不能为空";
        return;
      }
      if (status == "1") {
        if (f.password != f.password2) {
          this.vTips = "两次输入的密码不相同";
          return;
        }
      }
      this.loginDialog.doing = true;
      setTimeout(() => {
        this.loginDialog.doing = false;
      }, 5000);
      const apiName = [SunApi_user_login, SunApi_user_register][status];
      apiName(f).then(res => {
        if (res.code == 200) {
          this.$notify.success({
            title: "成功提示",
            message: res.msg || [`登录成功`, `注册成功`][status]
          });
          window.localStorage.setItem("token", res.row.token);
          window.localStorage.setItem(
            "userInfo",
            JSON.stringify({ account: f.account, ...res.row })
          );
        } else {
          this.vTips = res.msg || `操作失败，请稍后重试`;
        }
        this.loginDialog.doing = false;
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.header {
  width: 100%;
  position: relative;
  font-size: 14px;
  .menu {
    width: 100%;
    background-color: #0f9982;
    color: #fff;
    .width-1 {
      height: 50px;
      line-height: 50px;
      background-color: #0f9982;
      margin: auto;
      text-align: left;
      > div {
        display: inline-block;
        &.left {
          width: 20%;
          text-align: left;
        }
        &.center {
          width: 60%;
          // text-align: left;
          @media (max-width: 768px) {
            display: none;
          }
        }
        &.right {
          width: 20%;
          text-align: right;
          @media (max-width: 768px) {
            display: none;
          }
        }
      }
      .logo-icon {
        cursor: pointer;
        height: 40px;
        vertical-align: middle;
      }
      .user {
        .s-1 {
          cursor: pointer;
        }
      }
    }
  }
  .login-bg {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    > div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: #fff;
      width: 360px;
      left: 0;
      right: 0;
      margin: auto;
      padding: 20px;
      box-sizing: border-box;
      text-align: left;
      font-size: 16px;
      .el-icon-close {
        font-size: 24px;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        &:hover {
          color: #0f9982;
        }
      }
      .p-1 {
        padding: 15px 0;
        img {
          width: 120px;
          background-color: #0f9982;
          vertical-align: -10px;
          position: relative;
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
      .p-2 {
        margin-top: 15px;
        input {
          width: 100%;
          height: 40px;
          padding: 10px 8px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          font-size: 14px;
          color: #666;
        }
        button {
          height: 40px;
          line-height: 40px;
          width: 40%;
          font-size: 14px;
          cursor: pointer;
          color: #169a83;
          background-color: #f0f6ff;
          border: 0;
          border-radius: 3px;
          vertical-align: top;
          margin-left: 5%;
        }
      }
      .p-3-0 {
        margin-top: 15px;
        font-size: 12px;
      }
      .p-3 {
        margin-top: 15px;
        button {
          height: 40px;
          line-height: 40px;
          width: 100%;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          color: #fff;
          background-color: #0f9982;
          border: 0;
          border-radius: 3px;
        }
      }
      .p-4 {
        margin-top: 10px;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        text-align: right;
        > span {
          &:hover {
            opacity: 0.75;
          }
        }
      }
      .p-5 {
        background-color: #f0f6ff;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        color: #0f9982;
        &.s-0 {
          color: #606266;
        }
        > span {
          cursor: pointer;
          &:hover {
            opacity: 0.75;
          }
        }
      }
    }
  }
}
</style>
