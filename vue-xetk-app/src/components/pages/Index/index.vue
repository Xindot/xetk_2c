<template>
  <div class="view-index">
    <div class="main">
      <div>
        <!--  -->
        <div class="swiper-1" v-if="bannerList&&bannerList.length">
          <mt-swipe :auto="0" :show-indicators="bannerList&&bannerList.length>1" :style="'height:'+(w_width*0.56)+'px;'">
            <mt-swipe-item v-for="(el,index) in bannerList" :key="index">
              <img :src="el.image" alt @click="goPage(el,'banner')" />
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <!--  -->
        <div v-if="noticeList&&noticeList.length" class="notice" :class="{'no-swiper':!bannerList}">
          <div>
            <!--  -->
            <notice-marquee :f_list="noticeList" />
            <!--  -->
          </div>
        </div>
        <!--  -->
        <div v-if="false&&adv1List&&adv1List instanceof Array&&adv1List.length>0" class="adv-1-list">
          <div v-for="(el,index) in adv1List" :key="index" @click="goPage(el,'adv1')" :style="'width:'+(100/adv1List.length)+'%;'">
            <img :src="el.image" alt />
          </div>
        </div>
        <!--  -->
        <div v-if="menuList&&menuList instanceof Array&&menuList.length>0" class="menu-list">
          <div v-for="(el,index) in menuList" :key="index" @click="goPage(el,'menu')" :style="'width:'+(100/menuList.length)+'%;'">
            <img :src="el.image" alt />
            <p style="color:#4A4A4A;font-size:12px;">{{el.name}}</p>
          </div>
        </div>
        <!--  -->
        <div v-if="adv2List&&adv2List instanceof Array&&adv2List.length>0" class="adv-2-list">
          <div v-for="(el,index) in adv2List" :key="index" @click="goPage(el,'adv2')" :style="'width:'+(100/adv2List.length)+'%;'">
            <img :src="el.image" alt />
          </div>
        </div>
        <!--  -->
        <!-- <div v-if="shop_image_open&&adv3List&&adv3List instanceof Array&&adv3List.length>0" class="adv-3-list">
          <div v-for="(el,index) in adv3List" :key="index" @click="goPage(el,'adv3')" :style="'width:'+(100/adv3List.length)+'%;'">
            <img :src="el.image" alt />
          </div>
        </div>-->
        <!--  -->
        <div class="oilCard-recharge-all">
          <!--  -->
          <oil-card-recharge ref="oilCardRecharge" :recharge_mel="recharge_mel" :recharge_zhichong="recharge_zhichong" />
          <!--  -->
        </div>
        <!--  -->
        <div class="goods-hot-all" v-if="false">
          <!--  -->
          <goods-hot ref="goodsHot" :goodsHot="goodsHot" />
          <!--  -->
        </div>
        <!--  -->
        <div class="goods-selected-all">
          <!--  -->
          <goods-selected ref="goodsSelected" :f_loadMore="false" :f_limit="6" />
          <!--  -->
        </div>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { pageMaxWidth } from "@/utils/const";
import { api_home_index } from "@/api/oilMan";
import { isUrl } from "@/utils/verify";
import noticeMarquee from "@pages/Common/NoticeMarquee";
import oilCardRecharge from "@pages/Common/OilCardRecharge";
import GoodsHot from "@pages/Common/GoodsHot";
import GoodsSelected from "@pages/Common/GoodsSelected";
export default {
  components: { noticeMarquee, oilCardRecharge, GoodsHot, GoodsSelected },
  data() {
    return {
      w_width:
        window.innerWidth > pageMaxWidth ? pageMaxWidth : window.innerWidth,
      bannerSwiper: null,
      bannerList: [],
      noticeSwiper: null,
      noticeList: [],
      adv1List: [],
      menuList: [],
      adv2List: [],
      // adv3List: [
      //   {
      //     image:
      //       "https://s1.nianran.net/static/d3lemon/assets/icon/index/shop-1@1x.png",
      //     redirect_to: "mall"
      //   }
      // ],
      shop_image_open: false,
      goodsHot: [],
      recharge_mel: [],
      recharge_zhichong: []
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    showGoodsSelected() {
      this.visible.goodsSelected = true;
    },
    getList() {
      const data = JSON.parse(
        window.sessionStorage.getItem("Index:AllList") || "{}"
      );
      if (data.hasOwnProperty("banner")) {
        this.setList(data);
        return;
      }
      api_home_index().then(res => {
        if (Number(res.code) == 0) {
          this.setList(res.data);
          window.sessionStorage.setItem(
            "Index:AllList",
            JSON.stringify(res.data)
          );
        } else {
          alert(res.msg);
        }
      });
    },
    setList(data) {
      this.bannerList = data.banner || [];
      this.noticeList = data.notice || [];
      this.menuList = data.menu || [];
      this.adv1List = data.adv1 || [];
      this.adv2List = data.adv2 || [];
      this.recharge_mel = data.recharge_mel || [];
      this.recharge_zhichong = data.recharge_zhichong || [];
      //
      const hot_goods = data.hot_goods || [];
      if (hot_goods.length > 0) {
        for (let i = 0; i < hot_goods.length; i++) {
          const n = hot_goods[i];
          n.sell_price = Number(n.sell_price).toFixed(0);
          n.original_pirce = Number(n.original_pirce).toFixed(0);
        }
      }
      this.goodsHot = hot_goods;
      this.shop_image_open = data.shop_image_open;
    },
    goPage(el) {
      const rM = this.routesMatch;
      // console.log(rM,el.redirect_to)
      if (
        rM &&
        el.redirect_to &&
        rM.hasOwnProperty(el.redirect_to) &&
        rM[el.redirect_to]
      ) {
        this.$router.push(rM[el.redirect_to]);
      } else {
        if (el.redirect_to && isUrl(el.redirect_to)) {
          window.location.open(el.redirect_to);
        } else {
          alert("敬请期待");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-index {
  .main {
    > div {
      min-height: calc(100% - 60px);
      .swiper-1 {
        font-size: 0;
        width: 100%;
        min-height: 100px;
        img {
          width: 100%;
        }
      }
      .notice {
        height: 30px;
        background-color: #ffffff;
        > div {
          position: relative;
          z-index: 1;
          height: 40px;
          transform: translateY(-50%);
          padding: 0 15px;
          &.no-swiper {
            transform: initial;
          }
          > div {
            background-color: #ffffff;
            border-radius: $semi-circle-border-radius;
            overflow: hidden;
            font-size: 12px;
            color: #787878;
            position: relative;
            height: 100%;
            box-shadow: 0 5px 10px 0 #dddddd;
          }
        }
      }
      .adv-1-list,
      .menu-list,
      .adv-2-list,
      .adv-3-list {
        background-color: #ffffff;
        padding: 5px 10px;
        box-sizing: border-box;
        > div {
          display: inline-block;
          padding: 0 5px;
          box-sizing: border-box;
          font-size: 0;
          img {
            width: 100%;
          }
        }
      }
      .oilCard-recharge-all {
        margin-top: 15px;
        > div {
          background-color: #ffffff;
          padding: 8px 0;
          box-sizing: border-box;
        }
      }
      .goods-hot-all {
        margin-top: 15px;
        > div {
          background-color: #ffffff;
          padding: 8px 0;
          box-sizing: border-box;
        }
      }
      .goods-selected-all {
        margin-top: 15px;
        background-color: #eeeeee;
      }
    }
  }
}
</style>

<style lang="scss">
.view-index {
  .swiper-1 {
    // mint-ui 轮播图
    .mint-swipe {
      .mint-swipe-items-wrap {
        .mint-swipe-item {
          img {
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .mint-swipe-indicators {
        bottom: 30px;
        .mint-swipe-indicator {
          &.is-active {
            opacity: 0.8;
            padding: 0 3px;
            border-radius: $semi-circle-border-radius;
          }
        }
      }
    }
    //
  }
}
</style>
