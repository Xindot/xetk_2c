<template>
  <div class="view-recharge-list">
    <div>
      <div>
        <div v-for="(el,index) in list" :key="index" :style="'width:'+(100/3)+'%;'">
          <div
            class="to-left"
            :class="{'selected':index==sidx}"
            @click="selectOneRecharge(el,index)"
          >
            <img v-if="el.tag" :src="el.tag" alt />
            <p class="p-1">
              <span v-if="rechargeType==1" class="s-1">{{(Number(el.discount)*10).toFixed(1)}}折</span>
              <span v-if="rechargeType==0" class="s-1">{{el.real_price}}</span>
              <span v-if="pageType=='oil'&&rechargeType==1">{{el.months}}个月</span>
            </p>
            <p class="p-2">
              <span v-if="pageType=='oil'&&rechargeType==1">已售{{el.sell_num}}件</span>
              <span v-if="pageType=='phone'&&rechargeType==1">{{el.months}}个月</span>
              <span v-if="rechargeType==0">售价{{el.sell_price}}元</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["list", "sidx", "pageType", "rechargeType"],
  created() {},
  methods: {
    // 选择一个充值对象id
    selectOneRecharge(el, index) {
      this.$parent.rechargeSelectedIdx = index;
      this.$parent.rechargeForm.recharge_id = el.id;
      this.$parent.usableCoupon.list = [];
      this.$parent.usableCoupon.selectedOne = null;
      // 检测优惠券 + 油卡充值明细
      this.$parent.checkUsableCouponAndRechargeDetail();
      // 计算订单价格
      this.$parent.computeOrderPrice();
    }
  }
};
</script>

<style lang="scss" scoped>
.view-recharge-list {
  > div {
    > div {
      > div {
        text-align: center;
        display: inline-block;
        padding: 2.5px;
        box-sizing: border-box;
        vertical-align: top;
        > div {
          background-color: #ffffff;
          border: solid 1px #999999;
          padding: 20px 0;
          box-sizing: border-box;
          border-radius: 5px;
          position: relative;
          overflow: hidden;
          &.selected {
            color: #ffffff;
            border: solid 1px #fe9044;
            &.to-left {
              background-image: $background-image-to-left;
            }
            .p-1 {
              .s-1 {
                color: #ffffff;
              }
            }
          }
          > img {
            position: absolute;
            right: -2px;
            top: -1px;
            width: 40px;
          }
          .p-1 {
            .s-1 {
              font-size: 15px;
              color: #d42020;
              font-weight: medium;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
