<template>
  <div class="tab-bar">
    <div v-for="(el,index) in list" :key="index" :style="'width:'+(100/list.length)+'%;'" @click="selectTabBar(el,index)">
      <div>
        <div class="icon">
          <img v-if="el.icon" :src="index==selectedIndex?el.selectedIcon:el.icon" alt />
        </div>
        <div class="text">
          <span>{{el.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  i_index_0,
  i_index_1,
  i_mall_0,
  i_mall_1,
  i_find_0,
  i_find_1,
  i_me_0,
  i_me_1
} from "@/utils/icons";
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      config: {
        color: "",
        selectedColor: ""
      },
      list: [
        {
          icon: i_index_0,
          selectedIcon: i_index_1,
          text: "首页",
          path: this.routesMatch["index"]
        },
        {
          icon: i_mall_0,
          selectedIcon: i_mall_1,
          text: "商城",
          path: this.routesMatch["mall"]
        },
        {
          icon: i_find_0,
          selectedIcon: i_find_1,
          text: "发现",
          path: this.routesMatch["find"]
        },
        {
          icon: i_me_0,
          selectedIcon: i_me_1,
          text: "我的",
          path: this.routesMatch["me"]
        }
      ],
      selectedIndex: 0
    };
  },
  created() {
    const path = this.$route.path;
    // console.log(path)
    if (path) {
      this.setSelectedIdx(path);
    }
  },
  methods: {
    setSelectedIdx(path) {
      for (let i = 0; i < this.list.length; i++) {
        const n = this.list[i];
        if (n.path == path) {
          this.selectedIndex = i;
        }
      }
    },
    selectTabBar(el, index) {
      this.selectedIndex = index;
      this.$router.push(el.path);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: $list-one-height;
  background-color: #ffffff;
  font-size: 11px;
  z-index: 111;
  box-shadow: 0 0 10px 0 #dedede;
  > div {
    display: inline-block;
    text-align: center;
    position: relative;
    height: 100%;
    > div {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      .icon {
        width: 22px;
        height: 22px;
        margin: auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
