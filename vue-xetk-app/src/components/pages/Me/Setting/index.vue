<template>
  <div class="view-setting">
    <div class="main">
      <div>
        <div class="s-list">
          <div v-for="(el,index) in list" :key="index">
            <div class="left">
              <span>{{el.label}}</span>
            </div>
            <div class="right" :class="el.key" @click="goPage(el)">
              <span>
                <img v-if="el.key=='avatar'" class="i-avatar" :src="el.value||icons.i_b_avatar" alt />
                <span v-else-if="el.key=='pwd'">{{el.value||'修改'}}</span>
                <span v-else-if="el.key=='phone'">{{el.value||'未绑定手机号'}}</span>
                <span v-else>{{el.value}}</span>
              </span>
              <img :src="icons.i_arrow_b" class="right-arrow" alt />
            </div>
          </div>
        </div>
        <div class="login-out" @click="loginOut">
          <p>退出登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_b_avatar, i_arrow_b } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_b_avatar, i_arrow_b },
      userInfo: null,
      list: [
        {
          label: "头像",
          key: "avatar",
          value: ""
        },
        {
          label: "绑定手机号",
          key: "phone",
          value: "",
          path: this.routesMatch["bindMobile"]
        },
        {
          label: "登录密码",
          key: "pwd",
          value: "",
          path: `${this.routesMatch["setPwd"]}?t=modify`
        }
      ]
    };
  },
  created() {
    // console.log(this._GD_.userInfo)
    if (this._GD_.userInfo) {
      this.userInfo = this._GD_.userInfo;
    } else {
      this.userInfo = JSON.parse(
        window.localStorage.getItem("MeIndex:userInfo") || null
      );
    }
    if (this.userInfo) {
      for (let i = 0; i < this.list.length; i++) {
        const el = this.list[i];
        if (el.key) {
          el.value = this.userInfo[el.key] || "";
        }
      }
    }
  },
  computed: {},
  methods: {
    goPage(el) {
      if (el.path) {
        this.$router.push(el.path);
      }
    },
    loginOut() {
      window.showModal({
        title: "确定退出登录?",
        success: res => {
          // console.log(res)
          if (res.confirm) {
            window.localStorage.setItem("token", "");
            alert("已退出登录");
            this.$router.go(-1);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-setting {
  .main {
    > div {
      .s-list {
        margin-top: 10px;
        padding: 0 15px;
        box-sizing: border-box;
        background-color: #ffffff;
        > div {
          line-height: $list-one-height;
          + div {
            border-top: solid 1px #eeeeee;
          }
          > div {
            display: inline-block;
            &.left {
              width: 40%;
              text-align: left;
              font-size: 15px;
              color: $default-color;
            }
            &.right {
              width: 60%;
              text-align: right;
              position: relative;
              font-size: $default-font-size;
              color: #acacac;
              &.avatar {
                > span {
                  padding-right: 0;
                }
                > img {
                  &.right-arrow {
                    display: none;
                  }
                }
              }
              > span {
                padding: 0 15px;
                img {
                  vertical-align: middle;
                  &.i-avatar {
                    height: 30px;
                    width: 30px;
                  }
                }
              }
              > img {
                &.right-arrow {
                  height: 10.5px;
                  width: 10.5px;
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%) rotate(45deg);
                  opacity: $arrow-b-opacity;
                }
              }
            }
          }
        }
      }
      .login-out {
        height: $list-one-height;
        line-height: $list-one-height;
        background-color: #ffffff;
        margin-top: 20px;
        text-align: center;
        font-size: 18px;
        color: #e11111;
      }
    }
  }
}
</style>
