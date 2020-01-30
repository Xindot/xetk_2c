<template>
  <div class="view-coupon">
    <div class="main">
      <div>
        <div class="list-1 fixed-top">
          <div
            v-for="(el,index) in list1"
            :key="index"
            :style="'width:'+(100/list1.length)+'%;'"
            @click="selectOneTab(el,index)"
          >
            <span>{{el.value}}</span>
            <img v-if="index==selectedIdx1" :src="icons.i_coupon_line_1" alt />
          </div>
        </div>
        <!-- 优惠券列表组件 -->
        <CouponList :couponList="list2" :listApiStatus="listApiStatus" />
        <!-- 优惠券列表组件 -->
      </div>
    </div>
  </div>
</template>

<script>
import CouponList from "@pages/Common/CouponList";
import { i_coupon_line_1 } from "@/utils/icons";
import { api_user_coupon } from "@/api/oilMan";
export default {
  components: { CouponList },
  data() {
    return {
      icons: { i_coupon_line_1 },
      list1: [
        { key: 1, value: "可使用" },
        { key: 2, value: "已使用" },
        { key: 3, value: "已过期" }
      ],
      selectedIdx1: 0,
      list2: [],
      listFilter: {
        page: 1,
        limit: 200,
        status: 1
      },
      listApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listApiStatus = 1;
      this.list2 = [];
      api_user_coupon(this.listFilter).then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.list2 = res.data.data || [];
        } else {
          alert(res.msg);
        }
        this.listApiStatus = 2;
      });
    },
    selectOneTab(el, index) {
      this.selectedIdx1 = index;
      this.listFilter.status = el.key;
      this.getList();
    },
    selectOneCoupon(el) {
      if (el.use_status == 0) {
        alert("该优惠券暂时不可用");
        return;
      }
      // console.log(el.channel)
      if (el.channel == "oil_recharge") {
        this.$router.push(this.routesMatch["oilpackage"]);
      } else {
        this.$router.push(this.routesMatch["phonepackage"]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-coupon {
  .main {
    > div {
      padding-top: 40px;
      .list-1 {
        background-color: #ffffff;
        height: 40px;
        font-size: 12px;
        padding: 5px 0;
        box-sizing: border-box;
        &.fixed-top {
          top: 44px;
        }
        > div {
          display: inline-block;
          text-align: center;
          position: relative;
          height: 100%;
          img {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            height: 2px;
          }
        }
      }
    }
  }
}
</style>
