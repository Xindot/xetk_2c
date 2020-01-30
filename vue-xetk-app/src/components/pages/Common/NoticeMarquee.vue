<template>
  <div class="marquee" @click="goPage">
    <div class="marquee_title">
      <img :src="icons.i_notice" alt />
    </div>
    <div class="marquee_box">
      <ul class="marquee_list" :class="{marquee_top:animate}">
        <li v-for="(el,index) in f_list" :key="index" class="ellipsis">{{el.content}}</li>
      </ul>
    </div>
  </div>
</template> 
<script>
import { i_notice } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_notice },
      animate: false,
      timer: null
    };
  },
  props: ["f_list"],
  created() {
    // 页面显示
    this.timer = setInterval(this.showMarquee, 3000);
  },
  beforeDestory() {
    clearInterval(this.timer);
  },
  methods: {
    showMarquee() {
      this.animate = true;
      setTimeout(() => {
        this.f_list.push(this.f_list[0]);
        this.f_list.shift();
        this.animate = false;
      }, 500);
    },
    goPage() {
      // console.log(this.f_list[0]);
      const path = this.f_list[0].redirect_to;
      if (this.routesMatch[path]) {
        this.$router.push(this.routesMatch[path]);
      } else {
        alert("敬请期待");
      }
    }
  }
};
</script>
 
<style scoped lang="scss">
.marquee {
  width: 100%;
  height: 50px;
  align-items: center;
  color: #3a3a3a;
  background-color: white;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  .marquee_title {
    padding: 0 20px;
    height: 21px;
    font-size: 14px;
    // border-right: 1px solid #d8d8d8;
    align-items: center;
    img {
      position: absolute;
      height: 24px;
      width: 24px;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .marquee_box {
    display: block;
    position: relative;
    width: 85%;
    height: 30px;
    overflow: hidden;
    .marquee_list {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: left;
      &.marquee_top {
        transition: all 0.5s;
        margin-top: -30px;
      }
      li {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding-left: 15px;
        span {
          padding: 0 2px;
        }
      }
    }
  }
}
</style>
