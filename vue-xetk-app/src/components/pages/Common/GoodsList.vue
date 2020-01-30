<template>
  <div>
    <!--  -->
    <div class="goods-list" :class="{'loading':loadMore.loading}" v-infinite-scroll="loadMoreFn" :infinite-scroll-disabled="loadMore.loading">
      <div v-for="(el,index) in goodsList" :key="index">
        <div @click="goGoodsDetailPage(el)" :data-id="el.id">
          <p class="p-img">
            <img :src="el.image" alt />
          </p>
          <p class="p-title ellipsis">
            <span>{{el.goods_name}}</span>
          </p>
          <p class="p-price">
            <span class="s-1">￥{{el.sell_price}}</span>
            <span class="s-2">￥{{el.original_pirce}}</span>
          </p>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="d-list-no" v-if="!goodsList||(goodsList&&goodsList.length==0)">
      <div v-show="listApiStatus==2">
        <img :src="icons.i_order_list_no" alt />
        <p>暂无商品信息</p>
      </div>
    </div>
    <!--  -->
    <div class="load-more">
      <div v-if="loadMore.loading">
        <img class="icon" :src="loadMore.icon" alt />
        <span>加载中...</span>
      </div>
      <div v-if="!loadMore.loading && goodsList_count>0">
        <span>没有更多了~</span>
      </div>
    </div>
    <!--  -->
  </div>
</template>


<script>
import { api_shop_list } from "@/api/oilMan";
import { i_order_list_no, i_spinner_preloader } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_order_list_no },
      goodsList_count: 0,
      goodsList: [],
      listApiStatus: 0, // 0未请求 1请求中 2请求结束
      loadMore: {
        icon: i_spinner_preloader,
        loading: false
      }
    };
  },
  props: ["goodsListParams"],
  created() {},
  methods: {
    // 获取商品列表
    getGoodsList() {
      // this.goodsList = [];
      // this.goodsList_count = 0;
      this.listApiStatus = 1;
      api_shop_list(this.goodsListParams).then(res => {
        if (res.code == 0) {
          const list = (res.data && res.data.data) || [];
          for (let i = 0; i < list.length; i++) {
            const n = list[i];
            n.sell_price = Number(n.sell_price).toFixed(1);
            n.original_pirce = Number(n.original_pirce).toFixed(1);
          }
          this.goodsList = list;
          const count = res.data.count || 0;
          this.goodsList_count = count;
        } else {
          alert(res.msg);
        }
        this.listApiStatus = 2;
      });
    },
    loadMoreFn() {
      if (this.loadMore.loading) {
        return;
      }
      if (this.goodsList.length < this.goodsList_count) {
        // console.log("loadMore");
        this.loadMore.loading = true;
        this.goodsListParams.page += 1;
        api_shop_list(this.goodsListParams).then(res => {
          // console.log(res);
          if (res.code == 0) {
            const list = (res.data && res.data.data) || [];
            for (let i = 0; i < list.length; i++) {
              const n = list[i];
              n.sell_price = Number(n.sell_price).toFixed(1);
              n.original_pirce = Number(n.original_pirce).toFixed(1);
            }
            this.goodsList = [...this.goodsList, ...list];
          } else {
            alert(res.msg);
          }
          this.loadMore.loading = false;
        });
      }
    },
    goGoodsDetailPage(el) {
      // console.log(el);
      this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${el.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@style/scss/load-more.scss";
.goods-list {
  margin-top: 80px;
  padding: 0 12.5px;
  box-sizing: border-box;
  text-align: left;
  border-radius: 3px;
  overflow: hidden;
  > div {
    padding: 2.5px;
    box-sizing: border-box;
    display: inline-block;
    width: 50%;
    vertical-align: top;
    > div {
      background-color: #ffffff;
      border-radius: 3px;
      overflow: hidden;
      .p-img {
        position: relative;
        font-size: 0;
        padding-bottom: 100%;
        overflow: hidden;
        overflow: hidden;
        img {
          position: absolute;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .p-title {
        padding: 5px 5px;
        box-sizing: border-box;
        font-size: 13px;
        color: #333333;
      }
      .p-price {
        padding: 0 5px 5px 5px;
        .s-1 {
          font-size: 15px;
          color: #e11111;
        }
        .s-2 {
          margin-left: 5px;
          font-size: 13px;
          color: #acacac;
          text-decoration: line-through;
        }
      }
    }
  }
}
.d-list-no {
  text-align: center;
  font-size: 0;
  > div {
    margin-top: 50%;
    transform: translateY(-50%);
    img {
      width: 192px;
      height: 137px;
    }
    p {
      font-size: 14px;
      color: #7b7b7b;
    }
  }
}
</style>
