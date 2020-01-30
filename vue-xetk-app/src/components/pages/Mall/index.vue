<template>
  <div class="view-mall">
    <div class="main">
      <div :class="{'have-header':header.visible}">
        <!--  -->
        <div class="b-1" :style="'height:'+(w_width*0.56)+'px;'">
          <mt-swipe :auto="4000" :show-indicators="false">
            <mt-swipe-item v-for="(el,index) in shopAdvs" :key="index">
              <img :src="el.image" alt />
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!--  -->
        <div class="b-2" v-if="shopMenu.length>0">
          <div v-for="(el,index) in shopMenu" :key="index" :style="'width:'+(100/5)+'%;'" @click="goShopMenuPage(el,index)">
            <div v-if="el.image">
              <img :src="el.image" alt />
              <p>{{el.class_name}}</p>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="goods-hot-all">
          <!--  -->
          <goods-hot ref="goodsHot" :goodsHot="goodsHot" />
          <!--  -->
        </div>
        <!--  -->
        <div class="goods-selected-all">
          <!--  -->
          <goods-selected ref="goodsSelected" :f_loadMore="true" />
          <!--  -->
        </div>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { pageMaxWidth } from "@/utils/const";
import { i_mall_banner_2, i_mall_goods_hot_main } from "@/utils/icons";
import { api_shop_nav } from "@/api/oilMan";
import GoodsHot from "@pages/Common/GoodsHot";
import GoodsSelected from "@pages/Common/GoodsSelected";
export default {
  components: { GoodsHot, GoodsSelected },
  data() {
    return {
      w_width:
        window.innerWidth > pageMaxWidth ? pageMaxWidth : window.innerWidth,
      icons: {
        i_mall_banner_2,
        i_mall_goods_hot_main
      },
      shopAdvs: [],
      shopMenu: [],
      goodsHot: [],
      header: {
        visible: true
      },
      scrollTop: {
        a: 0,
        b: 0,
        d: 0
      }
    };
  },
  created() {
    this.header.visible = !!this.$route.meta.header;
    this.getShopMenu();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, false);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    // 监听页面滚动
    handleScroll() {
      const sHeight = 200;
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);
      if (scrollTop < sHeight) {
        // console.log("top<", sHeight);
        this.$parent.header.white = true;
        this.$parent.header.white_1 = false;
      } else {
        this.$parent.header.white = false;
        this.$parent.header.white_1 = true;
      }
      // this.scrollTop.a = scrollTop;
      // if (this.scrollTop.b < this.scrollTop.a) {
      //   // console.log("下滚");
      // } else if (this.scrollTop.b > this.scrollTop.a) {
      //   // console.log("上滚");
      // }
      // setTimeout(() => {
      //   this.scrollTop.b = this.scrollTop.a;
      // }, 0);
    },
    getShopMenu() {
      api_shop_nav().then(res => {
        // console.log(res);
        if (res.code == 0) {
          const advs = (res.data && res.data.advs) || [];
          this.shopAdvs = advs;
          const menu = (res.data && res.data.menu) || [];
          this.shopMenu = menu;
          const hot_goods = (res.data && res.data.hot_goods) || [];
          for (let i = 0; i < hot_goods.length; i++) {
            const n = hot_goods[i];
            n.sell_price = Number(n.sell_price).toFixed(0);
            n.original_pirce = Number(n.original_pirce).toFixed(0);
          }
          this.goodsHot = hot_goods;
        } else {
          alert(res.msg);
        }
      });
    },
    goShopMenuPage(el, index) {
      // console.log(el);
      window.sessionStorage.removeItem("goodsClass:shopMenuIdx");
      window.sessionStorage.removeItem("goodsClass:shopSubMenuIdx");
      window.sessionStorage.removeItem("goodsClass:sortMenuIdx");
      this.$router.push({
        path: this.routesMatch["mallGoodsClass"],
        query: {
          menuIdx: index
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.view-mall {
  .main {
    > div {
      &.have-header {
        margin-top: -44px;
      }
      .b-1 {
        .mint-swipe {
          .mint-swipe-items-wrap {
            .mint-swipe-item {
              font-size: 0;
              img {
                width: 100%;
              }
            }
          }
        }
      }
      .b-2 {
        padding: 10px;
        box-sizing: border-box;
        font-size: 0;
        background-color: #ffffff;
        text-align: left;
        > div {
          display: inline-block;
          text-align: center;
          > div {
            padding: 5px 0;
            box-sizing: border-box;
            img {
              width: 100%;
              padding: 0 15px;
              box-sizing: border-box;
            }
            p {
              font-size: 11px;
              color: #333333;
            }
          }
        }
      }
      .goods-hot-all {
        padding: 10px;
        box-sizing: border-box;
        > div {
          border-radius: 3px;
          background-color: #ffffff;
          padding: 8px 0;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.view-mall {
  .goods-selected-all {
    .p-title {
      display: none;
    }
  }
}
</style>
