<template>
  <div class="view-login">
    <div class="main">
      <div :style="'min-height:'+w_height+'px;'">
        <div class="l-2">
          <div class="l-2-1">
            <img :src="icons.i_logo" alt />
            <p>油惠侠</p>
          </div>
          <div class="l-2-2">
            <div class="login-btn" @click="downLoadApp">
              <span>下载APP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_arrow_w, i_logo } from "@/utils/icons";
import { browserName } from "@/utils/const";
export default {
  data() {
    return {
      w_height: window.innerHeight,
      icons: { i_arrow_w, i_logo }
    };
  },
  created() {
    // console.log(this.$route)
  },
  mounted() {},
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    downLoadApp() {
      // console.log(browserName);
      if (browserName == "android") {
        window.open(
          "https://gskj.oss-cn-hangzhou.aliyuncs.com/android/app-youhuixia.apk"
        );
      } else if (browserName == "ios") {
        window.open(
          "https://apps.apple.com/cn/app/%E6%B2%B9%E6%83%A0%E4%BE%A0-5%E6%8A%98%E4%BC%98%E6%83%A0%E5%85%85%E6%B2%B9%E5%8D%A1/id1473958449"
        );
      } else {
        window.open(
          "https://apps.apple.com/cn/app/%E6%B2%B9%E6%83%A0%E4%BE%A0-5%E6%8A%98%E4%BC%98%E6%83%A0%E5%85%85%E6%B2%B9%E5%8D%A1/id1473958449"
        );
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
      .l-2 {
        margin-top: 50px;
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
    }
  }
}
</style>

