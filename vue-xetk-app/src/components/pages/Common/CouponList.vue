<template>
  <div>
    <div class="coupon-list" v-if="couponList && couponList.length>0">
      <div v-for="(el,index) in couponList" :key="index" class="list-one" :class="{'grey':el.use_status!=1}" @click="selectOneCoupon(el)">
        <div class="left">
          <p class="p-1">
            ￥
            <span>{{Number(el.amount).toFixed(0)}}</span>
          </p>
          <p class="p-2">满{{Number(el.min_amount).toFixed(2)}}元可用</p>
        </div>
        <div class="center">
          <p class="p-1">{{el.title}}</p>
          <p class="p-2">{{el.area_text}}</p>
          <p class="p-3">有效期至{{el.finished_at}}</p>
        </div>
        <div class="right">
          <p>
            <img v-if="el.use_status>0" :src="useStatusIcon[el.use_status]" alt />
            <span v-else>{{el.use_text}}</span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!couponList||(couponList&&couponList.length==0)" class="coupon-list-no">
      <div v-show="listApiStatus==2">
        <img :src="icons.i_coupon_list_no" alt />
        <p>暂无优惠券</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  i_coupon_status_0,
  i_coupon_status_1,
  i_coupon_status_2,
  i_coupon_list_no
} from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_coupon_list_no },
      useStatusIcon: [
        "",
        i_coupon_status_0,
        i_coupon_status_1,
        i_coupon_status_2
      ],
      useStatusName: ["", "可使用", "已使用", "已过期"] // 类型 1未使用，2已使用，3已过期
    };
  },
  props: ["couponList", "listApiStatus"],
  created() {},
  methods: {
    selectOneCoupon(el) {
      if (el.use_status == 0) {
        alert("该优惠券暂时不可用");
        return;
      }
      this.$parent.selectOneCoupon && this.$parent.selectOneCoupon(el);
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-list {
  padding: 15px;
  box-sizing: border-box;
  > .list-one {
    background-color: #ffffff;
    position: relative;
    box-shadow: 0 0 10px 0 #dddddd;
    border-radius: 5px;
    &.grey {
      > div {
        &.left {
          color: #aaacb1;
        }
      }
    }
    + .list-one {
      margin-top: 15px;
    }
    > div {
      display: inline-block;
      font-size: 10px;
      vertical-align: middle;
      box-sizing: border-box;
      height: 100%;
      padding: 15px 5px;
      &.left {
        width: 30%;
        color: #e11111;
        .p-1 {
          font-weight: 500;
          font-size: 18px;
          span {
            font-size: 30px;
          }
        }
        .p-2 {
          opacity: 0.8;
        }
      }
      &.center {
        text-align: left;
        width: 45%;
        .p-1 {
          font-size: 15px;
          font-weight: 500;
          span {
            font-weight: initial;
            font-size: 12px;
          }
        }
      }
      &.right {
        width: 25%;
        font-size: 0;
        text-align: right;
        img {
          width: 90%;
        }
        span {
          color: #ffffff;
          font-size: 13px;
          background-color: #aaacb1;
          padding: 3px 8px;
          border-radius: 5px;
        }
      }
    }
    &::before {
      content: "";
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: #eeeeee;
      border-radius: $semi-circle-border-radius;
      position: absolute;
      top: 0;
      right: 25%;
      transform: translate(8px, -8px);
    }
    &::after {
      content: "";
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: #eeeeee;
      border-radius: $semi-circle-border-radius;
      position: absolute;
      bottom: 0;
      right: 25%;
      transform: translate(8px, 8px);
    }
  }
}
.coupon-list-no {
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
