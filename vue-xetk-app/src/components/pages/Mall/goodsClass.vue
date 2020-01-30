<template>
  <div class="view-goods-class">
    <div class="main">
      <div class="filter-menu-bg" v-if="fliterMenuIdx>=0" @click="fliterMenuIdx=-1"></div>
      <div class="filter-menu fixed">
        <div class="m-1">
          <div v-for="(el,index) in fliterMenu" :key="index" @click="switchFilterMenu(el,index)">
            <span :class="{'selected':index==fliterMenuIdx}">{{el}}</span>
            <span class="s-triangle" :class="{'reverse':index==fliterMenuIdx}"></span>
          </div>
        </div>
        <div class="m-2">
          <div v-if="fliterMenuIdx==-1 && selectedMenuOne.child && selectedMenuOne.child instanceof Array && selectedMenuOne.child.length>0" class="f--1" ref="subMenuList">
            <span v-for="(el,index) in selectedMenuOne.child" :key="index" :class="{'selected':index==shopSubMenuIdx}" @click="selectShopSubMenuOne(el,index)">{{el.class_name}}</span>
          </div>
          <div v-if="fliterMenuIdx==0 && shopMenu && shopMenu instanceof Array && shopMenu.length>0" class="f-0">
            <div v-for="(el,index) in shopMenu" :key="index" @click="selectShopMenuOne(el,index)">
              <div class="left">
                <span :class="{'selected':index==shopMenuIdx}">{{el.class_name}}</span>
              </div>
              <div class="right">
                <img v-if="index==shopMenuIdx" :src="icons.i_mall_red_selected" alt />
              </div>
            </div>
          </div>
          <div v-if="fliterMenuIdx==1 && sortMenu && sortMenu instanceof Array && sortMenu.length>0" class="f-1">
            <div v-for="(el,index) in sortMenu" :key="index" @click="selectSortMenuOne(el,index)">
              <div class="left">
                <span :class="{'selected':index==sortMenuIdx}">{{el}}</span>
              </div>
              <div class="right">
                <img v-if="index==sortMenuIdx" :src="icons.i_mall_red_selected" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <goods-list ref="goodsList" :goodsListParams="goodsListParams" />
      <!--  -->
    </div>
  </div>
</template>

<script>
import { api_shop_nav } from "@/api/oilMan";
import { i_mall_red_selected } from "@/utils/icons";
import GoodsList from "@pages/Common/GoodsList";
export default {
  components: { GoodsList },
  data() {
    return {
      icons: { i_mall_red_selected },
      fliterMenu: ["选择类型", "默认排序"],
      fliterMenuIdx: -1,
      shopMenu: [],
      shopMenuIdx: 0,
      selectedMenuOne: {},
      sortMenu: ["默认排序", "价格由高到低", "价格由低到高"],
      sortMenuIdx: 0,
      shopSubMenuIdx: 0,
      selectedSubMenuOne: {},
      goodsListParams: {
        class_id: "",
        type_id: "",
        sort: "",
        way: "",
        page: 1,
        size: 20
      }
    };
  },
  created() {
    // console.log(this._GD_.goodsDetailBack);
    if (this._GD_.goodsDetailBack) {
      this._GD_.goodsDetailBack = null;
      // 获取一级目录缓存的索引
      this.shopMenuIdx =
        window.sessionStorage.getItem("goodsClass:shopMenuIdx") ||
        this.$route.query.menuIdx ||
        0;
      // 获取二级目录缓存的索引
      this.shopSubMenuIdx =
        window.sessionStorage.getItem("goodsClass:shopSubMenuIdx") || 0;
      // 获取排序缓存的索引
      this.sortMenuIdx =
        window.sessionStorage.getItem("goodsClass:sortMenuIdx") || 0;
    } else {
      this.shopMenuIdx = this.$route.query.menuIdx || 0;
      this.shopSubMenuIdx = 0;
      this.sortMenuIdx = 0;
    }
    // console.log(this.shopMenuIdx, this.shopSubMenuIdx, this.sortMenuIdx);
    // 获取菜单一级目录
    this.getShopMenu();
  },
  beforeDestory() {
    this.set_sessionStorage();
  },
  methods: {
    getShopMenu() {
      api_shop_nav().then(res => {
        // console.log(res);
        if (res.code == 0) {
          const menu = (res.data && res.data.menu) || [];
          this.shopMenu = menu;
          this.setFilterMenu();
        } else {
          alert(res.msg);
        }
      });
    },
    setFilterMenu() {
      this.selectedMenuOne = this.shopMenu[this.shopMenuIdx];
      // console.log(this.selectedMenuOne);
      const sName = this.selectedMenuOne.class_name;
      this.$set(this.fliterMenu, 0, sName);
      const ssName = this.sortMenu[this.sortMenuIdx];
      this.$set(this.fliterMenu, 1, ssName);
      this.$parent.setHeader({
        centerValue: sName
      });
      this.goodsListParams.sort =
        ["", "sell_price", "sell_price"][this.sortMenuIdx] || "";
      this.goodsListParams.way = ["", "desc", "asc"][this.sortMenuIdx] || "";
      this.goodsListParams.page = 1;
      this.goodsListParams.class_id = this.selectedMenuOne.id;
      this.selectedSubMenuOne =
        (this.selectedMenuOne.child &&
          this.selectedMenuOne.child instanceof Array &&
          this.selectedMenuOne.child[this.shopSubMenuIdx]) ||
        {};
      this.goodsListParams.type_id = this.selectedSubMenuOne.id || "";
      this.$refs.goodsList.getGoodsList();
    },
    // 切换筛选类型 商品分类 或 排序
    switchFilterMenu(el, index) {
      if (this.fliterMenuIdx == index) {
        this.fliterMenuIdx = -1;
        return;
      }
      this.fliterMenuIdx = index;
    },
    // 设置缓存
    set_sessionStorage() {
      window.sessionStorage.setItem("goodsClass:shopMenuIdx", this.shopMenuIdx);
      window.sessionStorage.setItem(
        "goodsClass:shopSubMenuIdx",
        this.shopSubMenuIdx
      );
      window.sessionStorage.setItem("goodsClass:sortMenuIdx", this.sortMenuIdx);
      window.sessionStorage.setItem(
        "goodsClass:shopSubMenuIdx",
        this.shopSubMenuIdx
      );
    },
    // 选择商品类型 一级分类
    selectShopMenuOne(el, index) {
      this.shopMenuIdx = index;
      this.shopSubMenuIdx = 0;
      this.set_sessionStorage();
      const sName = el.class_name;
      this.$set(this.fliterMenu, 0, sName);
      this.fliterMenuIdx = -1;
      this.setFilterMenu();
    },
    // 选择排序
    selectSortMenuOne(el, index) {
      this.sortMenuIdx = index;
      this.set_sessionStorage();
      const sName = el;
      this.$set(this.fliterMenu, 1, sName);
      this.fliterMenuIdx = -1;
      this.setFilterMenu();
    },
    // 选择商品类型 二级分类
    selectShopSubMenuOne(el, index) {
      // console.log(el, index);
      this.shopSubMenuIdx = index;
      this.set_sessionStorage();
      this.setFilterMenu();
      if (index >= 3) {
        this.$refs.subMenuList.scrollTo({
          left: window.innerWidth,
          behavior: "smooth"
        });
      } else {
        this.$refs.subMenuList.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-goods-class {
  .main {
    .filter-menu-bg {
      position: fixed;
      background-color: rgba(0, 0, 0, 0.1);
      height: 100%;
      width: 100%;
      z-index: 11;
    }
    .filter-menu {
      position: fixed;
      left: 0;
      width: 100%;
      z-index: 12;
      .m-1 {
        padding: 0 15px;
        box-sizing: border-box;
        background-color: #ffffff;
        height: 40px;
        line-height: 40px;
        > div {
          display: inline-block;
          width: 50%;
          position: relative;
          span {
            &.selected {
              color: #fd6067;
            }
          }
          /* 小三角 start */
          .s-triangle {
            position: relative;
            height: 6px;
            width: 12px;
            display: inline-block;
            left: 5px;
            top: -3px;
            transition: transform 0.3s;
            transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            &.reverse {
              transform: rotate(0deg);
              -ms-transform: rotate(0deg);
              -moz-transform: rotate(0deg);
              -webkit-transform: rotate(0deg);
              -o-transform: rotate(0deg);
            }
          }
          .s-triangle:before {
            content: "";
            position: absolute;
            left: 0;
            border-bottom: 6px solid #000;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
          }
          .s-triangle.reverse:before {
            border-bottom: 6px solid #fd6067;
          }
          /* 小三角 end */
        }
      }
      .m-2 {
        .f--1 {
          height: 40px;
          padding: 9px 15px;
          box-sizing: border-box;
          background-color: #eeeeee;
          text-align: left;
          white-space: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          > span {
            display: inline-block;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 50px;
            box-sizing: border-box;
            color: #333333;
            background-color: #e9ebec;
            height: 22px;
            overflow: hidden;
            &.selected {
              color: #ffffff;
              background-image: $background-image-to-left;
            }
            + span {
              margin-left: 10px;
            }
            &:last-child {
              margin-right: 15px;
            }
          }
        }
        .f-0,
        .f-1 {
          padding: 0 15px;
          box-sizing: border-box;
          background-color: #ffffff;
          text-align: left;
          > div {
            height: 40px;
            line-height: 40px;
            border-top: solid 1px #eeeeee;
            > div {
              display: inline-block;
              width: 50%;
              text-align: center;
              &.left {
                span {
                  margin-left: -12px;
                  &.selected {
                    color: #fd6067;
                  }
                }
              }
              &.right {
                text-align: right;
                img {
                  width: 24px;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
