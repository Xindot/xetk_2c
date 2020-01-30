<template>
  <div v-if="goodsHot.length>0">
    <p class="p-title">
      <span class="s-1"></span>
      <span>热门好物</span>
    </p>
    <div class="goods-hot">
      <div v-for="(el,index) in goodsHot" :key="index" :style="'width:'+(100/3)+'%;'" @click="goGoodsDetailPage(el)">
        <p class="p-1">
          <img :src="el.image" alt />
        </p>
        <p class="p-2 ellipsis">
          <span>{{el.goods_name}}</span>
        </p>
        <p class="p-3">
          <span class="s-1">￥{{el.sell_price}}</span>
          <span class="s-2">￥{{el.original_pirce}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["goodsHot"],
  methods: {
    goGoodsDetailPage(el) {
      // console.log(el);
      this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${el.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
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
.goods-hot {
  padding: 0 4px;
  box-sizing: border-box;
  margin-top: 8px;
  text-align: left;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  > div {
    padding: 0 4px;
    box-sizing: border-box;
    display: inline-block;
    text-align: left;
    // &:first-child {
    //   width: 100% !important;
    //   > p {
    //     &.p-1 {
    //       padding-bottom: 30%;
    //       position: relative;
    //       overflow: hidden;
    //       img {
    //         position: absolute;
    //         top: 50%;
    //         transform: translateY(-50%);
    //       }
    //     }
    //     &.p-2,
    //     &.p-3 {
    //       display: none;
    //     }
    //   }
    // }
    > p {
      &.p-1 {
        font-size: 0;
        position: relative;
        padding-bottom: 100%;
        overflow: hidden;
        img {
          width: 100%;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      &.p-2 {
        font-size: 12px;
        color: #333333;
      }
      &.p-3 {
        font-size: 12px;
        .s-1 {
          color: #e01212;
          margin-right: 5px;
        }
        .s-2 {
          font-size: 11px;
          color: #a4a4a4;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>