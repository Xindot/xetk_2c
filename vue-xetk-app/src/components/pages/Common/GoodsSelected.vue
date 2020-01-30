<template>
  <div>
    <p class="p-title" v-if="goodsSelected_count>0">
      <span class="s-1"></span>
      <span>精选商品</span>
    </p>
    <!--  -->
    <div class="goods-selected">
      <div v-infinite-scroll="loadMoreFn" :infinite-scroll-disabled="loadMore.loading">
        <div v-for="(el,index) in goodsSelected" :key="index" :style="'width:'+(100/2)+'%;'">
          <div @click="goGoodsDetailPage(el)" :data-id="el.id">
            <p class="p-1">
              <img v-lazy="el.image" alt />
            </p>
            <p class="p-2 ellipsis">
              <span>{{el.goods_name}}</span>
            </p>
            <p class="p-3">
              <span class="s-1">￥{{el.sell_price}}</span>
              <span class="s-2 float-right clear-float">已售{{el.sales_volume}}件</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="load-more">
      <div v-if="loadMore.loading">
        <img class="icon" :src="loadMore.icon" alt />
        <span>加载中...</span>
      </div>
      <div v-if="!loadMore.loading && goodsSelected_count>0">
        <span>没有更多了~</span>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
import { i_spinner_preloader } from "@/utils/icons";
import { api_shop_selected } from "@/api/oilMan";
export default {
  data() {
    return {
      goodsSelected_count: 0,
      goodsSelected: [],
      listFliter: {
        page: 1,
        limit: 20
      },
      loadMore: {
        icon: i_spinner_preloader,
        loading: false
      }
    };
  },
  props: ["f_loadMore", "f_limit"],
  created() {
    if (this.f_limit > 0) {
      this.listFliter.limit = this.f_limit;
    }
    this.getSelected();
    // console.log("f_loadMore=>", this.f_loadMore);
  },
  methods: {
    getSelected() {
      api_shop_selected(this.listFliter).then(res => {
        // console.log(res);
        if (res.code == 0) {
          const list = res.data.data || [];
          this.goodsSelected = list;
          const count = res.data.count || 0;
          this.goodsSelected_count = count;
        } else {
          alert(res.msg);
        }
      });
    },
    loadMoreFn() {
      if (!this.f_loadMore) {
        return;
      }
      if (this.loadMore.loading) {
        return;
      }
      if (this.goodsSelected.length < this.goodsSelected_count) {
        // console.log("loadMore");
        this.loadMore.loading = true;
        this.listFliter.page += 1;
        api_shop_selected(this.listFliter).then(res => {
          // console.log(res);
          if (res.code == 0) {
            const list = res.data.data || [];
            this.goodsSelected = [...this.goodsSelected, ...list];
          } else {
            alert(res.msg);
          }
          this.loadMore.loading = false;
        });
      }
    },
    goGoodsDetailPage(el) {
      window.sessionStorage.setItem(
        "GoodsSelected:shopMenuIdx",
        this.shopMenuIdx
      );
      // console.log(el);
      this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${el.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@style/scss/load-more.scss";
p {
  &.p-title {
    padding: 0 10px;
    box-sizing: border-box;
    .s-1 {
      display: inline-block;
      width: 4px;
      height: 13px;
      background-image: $background-image-to-bottom;
      border-radius: 3px;
      margin-right: 8px;
    }
    text-align: left;
    font-size: 17px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 3px;
  }
}
.goods-selected {
  padding: 0 5px;
  box-sizing: border-box;
  text-align: left;
  > div {
    > div {
      display: inline-block;
      padding: 5px;
      box-sizing: border-box;
      > div {
        background-color: #ffffff;
        text-align: left;
        color: #333333;
        border-radius: 3px;
        padding-bottom: 5px;
        box-sizing: border-box;
        overflow: hidden;
        > p {
          &.p-1 {
            font-size: 0;
            position: relative;
            padding-bottom: 100%;
            overflow: hidden;
            img,
            img[lazy="loaded"] {
              width: 100%;
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
            }
            img[lazy="loading"] {
              width: 40px;
              height: 300px;
              margin: auto;
            }
          }
          &.p-2 {
            font-size: 14px;
            padding: 2px 5px;
            box-sizing: border-box;
          }
          &.p-3 {
            font-size: 14px;
            padding: 0 5px;
            box-sizing: border-box;
            .s-1 {
              color: #e01212;
            }
            .s-2 {
              font-size: 10px;
              color: #a4a4a4;
              padding-top: 1px;
            }
          }
        }
      }
    }
  }
}
</style>
