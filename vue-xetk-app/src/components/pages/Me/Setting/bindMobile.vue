<template>
  <div class="view-bindMobile">
    <div class="main">
      <div>
        <div class="m-list">
          <div v-for="(el,index) in list" :key="index">
            <div class="right" :class="'r-'+el.key">
              <input
                v-if="el.inputType=='tel'"
                type="tel"
                v-model="bindForm[el.key]"
                :placeholder="el.placeholder"
                :maxlength="el.maxlength"
              />
              <input
                v-else-if="el.inputType=='password'"
                type="password"
                v-model="bindForm[el.key]"
                :placeholder="el.placeholder"
                :maxlength="el.maxlength"
              />
              <input
                v-else
                type="text"
                v-model="bindForm[el.key]"
                :placeholder="el.placeholder"
                :maxlength="el.maxlength"
              />
              <span v-if="el.key=='sms_code'" @click="(!getVCode.status)&&getVCodeAction()">
                <span
                  :style="60-getVCode.seconds>0?'opacity:.5;':'opacity:1;'"
                >获取验证码{{60-getVCode.seconds>0 ? ('('+getVCode.seconds+'s)') : ''}}</span>
              </span>
            </div>
          </div>
          <div class="btn" @click="submitBind">
            <p>提交</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import { verifyMobile11 } from "@/utils/verify";
import { api_user_changeMobile, api_sms_send } from "@/api/oilMan";
export default {
  data() {
    return {
      originPhone: null,
      list: [
        {
          placeholder: "请输入手机号",
          key: "mobile",
          maxlength: 11,
          inputType: "tel"
        },
        {
          placeholder: "请输入密码",
          key: "password",
          maxlength: 50,
          inputType: "password"
        },
        {
          placeholder: "请再输入密码",
          key: "password2",
          maxlength: 50,
          inputType: "password"
        },
        {
          placeholder: "请输入验证码",
          key: "sms_code",
          maxlength: 4,
          inputType: "tel"
        }
      ],
      getVCode: {
        seconds: 60
      },
      bindForm: {
        mobile: "",
        password: "",
        password2: "",
        sms_code: "",
        openid: ""
      }
    };
  },
  created() {
    if (this._GD_.userInfo) {
      this.userInfo = this._GD_.userInfo;
    } else {
      this.userInfo = JSON.parse(
        window.localStorage.getItem("MeIndex:userInfo") || null
      );
    }
    if (this.userInfo) {
      this.originPhone = this.userInfo.phone;
    }
    this.bindForm.openid = window.localStorage.getItem("openid") || "";
  },
  methods: {
    getVCodeAction() {
      // console.log('getVCodeAction')
      const f = {
        mobile: this.bindForm.mobile,
        type: 4 // 类型,默认为1,1注册验证,2登陆验证,3修改密码验证,4绑定手机号
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
    submitBind() {
      const f = JSON.parse(JSON.stringify(this.bindForm));
      for (let i = 0; i < this.list.length; i++) {
        const el = this.list[i];
        if (f[el.key] == "") {
          alert(el.placeholder);
          return;
        }
      }
      if (!verifyMobile11(f.mobile)) {
        alert("手机号格式不正确");
        return;
      }
      if (f.password != f.password2) {
        alert("两次输入的密码不一样");
        return;
      }
      // console.log(f)
      f.password = md5(f.password);
      api_user_changeMobile(f).then(res => {
        // console.log(res)
        if (res.code == 0) {
          alert("绑定成功");
          setTimeout(() => {
            this.$router.go(-2);
          }, 300);
        } else {
          alert(res.msg);
          // window.showModal({title:res.msg,showCancel:false,confirmText:'知道了'})
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-bindMobile {
  .main {
    > div {
      padding: 15px;
      box-sizing: border-box;
      text-align: left;
      .m-list {
        border-radius: 10px;
        background-color: #ffffff;
        padding: 20px;
        font-size: 17px;
        color: $default-color;
        > div {
          line-height: $list-one-height;
          border-bottom: solid 1px #eeeeee;
          > div {
            display: inline-block;
            &.left {
              width: 35%;
            }
            &.right {
              position: relative;
              // width: 65%;
              width: 100%;
              &.r-sms_code {
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
                  border-radius: 10px;
                  background-image: $background-image-to-right;
                }
                input {
                  width: 50%;
                }
              }
              input {
                font-size: $default-font-size;
                color: #333333;
                width: 100%;
                height: 30px;
              }
            }
          }
        }
        .btn {
          margin-top: 20px;
          border-radius: $btn-border-radius;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 18px;
          color: #ffffff;
          background-image: $background-image-to-right;
        }
      }
    }
  }
}
</style>
