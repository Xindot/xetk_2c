<template>
  <div class="view-setPwd">
    <div class="main">
      <div>
        <div class="pwd-list">
          <div v-for="(el,index) in list" :key="index">
            <div class="left">
              <span>{{el.label}}</span>
            </div>
            <div class="right" :class="'r-'+el.key">
              <input
                type="text"
                v-model="setForm[el.key]"
                :maxlength="el.maxlength"
                :placeholder="el.placeholder"
              />
              <span v-if="el.key=='sms_code'" @click="(!getVCode.status)&&getVCodeAction()">
                <span
                  :style="60-getVCode.seconds>0?'opacity:.5;':'opacity:1;'"
                >获取验证码{{60-getVCode.seconds>0 ? ('('+getVCode.seconds+'s)') : ''}}</span>
              </span>
            </div>
          </div>
          <div class="btn" @click="submitForm">
            <p>提交</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyMobile11 } from "@/utils/verify";
import { api_user_changePassword, api_sms_send } from "@/api/oilMan";
export default {
  data() {
    return {
      list: [
        {
          label: "手机号",
          placeholder: "请输入11位数字手机号码",
          key: "mobile",
          maxlength: 11
        },
        {
          label: "验证码",
          placeholder: "请输入验证码",
          key: "sms_code",
          maxlength: 4
        },
        {
          label: "新密码",
          placeholder: "请输入6-18位字母、数字组合",
          key: "password",
          maxlength: 50
        },
        {
          label: "确认新密码",
          placeholder: "请再次输入新密码",
          key: "password2",
          maxlength: 50
        }
      ],
      getVCode: {
        seconds: 60
      },
      setForm: {
        mobile: "",
        sms_code: "",
        password: "",
        password2: ""
      }
    };
  },
  created() {
    // console.log(this.$route)
    const t = this.$route.query.t || "";
    let title = "设置新密码";
    if (t == "modify") {
      title = "修改密码";
    }
    if (t == "find") {
      title = "找回密码";
    }
    this.$parent.setHeader({
      centerValue: title
    });
  },
  methods: {
    getVCodeAction() {
      // console.log('getVCodeAction')
      const f = {
        mobile: this.setForm.mobile,
        type: 3 // 类型,默认为1,1注册验证,2登陆验证,3修改密码验证,4绑定手机号
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
    submitForm() {
      const f = JSON.parse(JSON.stringify(this.setForm));
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
      api_user_changePassword(f).then(res => {
        // console.log(res)
        if (res.code == 0) {
          alert("修改成功");
          setTimeout(() => {
            this.$router.go(-2);
          }, 300);
        } else {
          alert(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-setPwd {
  .main {
    > div {
      padding: 15px;
      box-sizing: border-box;
      text-align: left;
      .pwd-list {
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
              width: 65%;
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
