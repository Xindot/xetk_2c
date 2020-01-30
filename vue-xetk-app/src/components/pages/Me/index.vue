<template>
  <div class="view-me">
    <div class="main">
      <div>
        <div class="user-info">
          <div v-if="userInfo" @click="goList2Page({path:routesMatch['setting']})">
            <img :src="userInfo.avatar || icons.i_b_avatar" class="avatar" alt />
            <span class="u-phone">{{userInfo.mobile||userInfo.phone||'未绑定手机号'}}</span>
          </div>
          <span v-else class="go-login" @click="goLoginPage">登录/注册</span>
          <img :src="icons.i_b_oilCard" class="oil-card" alt @click="goOilCardPage" />
        </div>
        <div class="list-1">
          <div v-for="(el,index) in list1" :key="index" :style="'width:'+(100/list1.length)+'%;'">
            <p class="p-1">{{el.label}}</p>
            <p class="p-2">{{el.value}}</p>
          </div>
        </div>
        <div class="list-2">
          <div v-for="(el,index) in list2" :key="index" @click="goList2Page(el)" :class="{'cut':el.cut}">
            <div>
              <img :src="el.icon" class="icon" alt />
              <span>{{el.label}}</span>
              <img :src="icons.i_arrow_b" class="right-arrow" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api_user_info } from "@/api/oilMan";
import { browserName } from "@/utils/const";
import {
  i_arrow_b,
  i_b_avatar,
  i_b_oilCard,
  i_list2_coupon,
  i_list2_mallOrder,
  i_list2_oilOrder,
  i_list2_phoneOrder,
  i_list2_question,
  i_list2_kefu,
  i_list2_address,
  i_list2_setting,
  i_list2_about
} from "@/utils/icons";
export default {
  components: {},
  data() {
    return {
      icons: { i_arrow_b, i_b_avatar, i_b_oilCard },
      userInfo: null,
      list1: [
        {
          label: "总充值金额",
          key: "prev_recharge_amount",
          value: "0"
        },
        {
          label: "下次充值金额",
          key: "next_recharge_amount",
          value: "0"
        },
        {
          label: "下次充值日期",
          key: "next_recharge_date",
          value: ""
        }
      ],
      list2: [
        {
          icon: i_list2_coupon,
          label: "我的优惠券",
          path: this.routesMatch["myCoupon"],
          needLogin: true,
          cut: true
        },
        {
          icon: i_list2_mallOrder,
          label: "商城订单",
          path: this.routesMatch["mallOrderList"],
          needLogin: true
        },
        {
          icon: i_list2_oilOrder,
          label: "油卡订单",
          path: this.routesMatch["oilOrderList"],
          needLogin: true
        },
        {
          icon: i_list2_phoneOrder,
          label: "话费订单",
          path: this.routesMatch["phoneOrderList"],
          needLogin: true,
          cut: true
        },
        {
          icon: i_list2_question,
          label: "常见问题",
          path: this.routesMatch["faq"],
          needLogin: false
        },
        {
          icon: i_list2_about,
          label: "关于我们",
          path: this.routesMatch["about"],
          needLogin: false
        },
        {
          icon: i_list2_kefu,
          label: "我的客服",
          path: this.routesMatch["customerservice"],
          needLogin: false
        },
        {
          icon: i_list2_address,
          label: "我的地址",
          path: this.routesMatch["myAddress"],
          needLogin: true
        },
        {
          icon: i_list2_setting,
          label: "设置",
          path: this.routesMatch["setting"],
          needLogin: true
        }
      ]
    };
  },
  created() {
    const token = window.localStorage.getItem("token") || "";
    if (token) {
      this.getUserInfo();
    } else {
      this.userInfo = null;
      for (let i = 0; i < this.list1.length; i++) {
        const el = this.list1[i];
        el.value = "0";
        if (el.key == "next_recharge_date") {
          el.value = "暂无";
        }
      }
    }
  },
  mounted() {},
  methods: {
    getUserInfo() {
      api_user_info().then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.userInfo = res.data;
          if (this.userInfo) {
            for (let i = 0; i < this.list1.length; i++) {
              const el = this.list1[i];
              el.value = this.userInfo[el.key];
            }
            window.localStorage.setItem(
              "MeIndex:userInfo",
              JSON.stringify(this.userInfo)
            );
          }
        } else {
          alert(res.msg);
        }
      });
    },
    goOilCardPage() {
      const token = window.localStorage.getItem("token") || "";
      if (!token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      this.$router.push(this.routesMatch["myOilCard"]);
    },
    goList2Page(el) {
      const token = window.localStorage.getItem("token") || "";
      if (el.needLogin && !token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      if (el.path) {
        this.$router.push(el.path);
      } else {
        alert("敬请期待");
      }
    },
    // 去登录页面
    goLoginPage() {
      const loginPath = browserName == "wx" ? "wxLogin" : "login";
      this.$router.push(this.routesMatch[loginPath]);
    }
  }
};
</script>

<style lang="scss" scoped>
.view-me {
  .main {
    > div {
      margin-top: 10px;
      font-size: $default-font-size;
      .user-info {
        background-color: #ffffff;
        padding: 20px 0;
        text-align: left;
        position: relative;
        font-size: 18px;
        color: $default-color;
        .u-phone {
          margin-left: 60px;
        }
        .go-login {
          margin-left: 20px;
        }
        img {
          &.avatar {
            width: 30px;
            height: 30px;
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
          }
          &.oil-card {
            height: 30px;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .list-1 {
        background-color: #ffffff;
        color: $default-color;
        padding: 15px 0;
        > div {
          display: inline-block;
          vertical-align: top;
          p {
            &.p-1 {
              font-size: 12px;
            }
            + p {
              margin-top: 10px;
            }
          }
        }
      }
      .list-2 {
        margin-top: 10px;
        text-align: left;
        > div {
          background-color: #ffffff;
          padding: 0 20px;
          box-sizing: border-box;
          line-height: $list-one-height;
          &.cut {
            margin-bottom: 10px;
          }
          // + div {
          //   border-top: solid 1px $border-color;
          // }
          > div {
            position: relative;
            span {
              margin-left: 40px;
            }
            img {
              &.icon {
                width: 24px;
                height: 24px;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }
              &.right-arrow {
                height: 10.5px;
                width: 10.5px;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
                opacity: 0.5;
              }
            }
          }
        }
      }
    }
  }
}
</style>
