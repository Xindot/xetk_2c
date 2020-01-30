<template>
  <div class="view-amount">
    <div>
      <div class="left">
        <span>每月充值金额</span>
      </div>
      <div class="right">
        <img :src="icons.i_minus" alt @click="operateAmount(-1)" :style="!amountObj.status[0]?'opacity:.3':''" />
        <span>{{amountObj.amount}}</span>
        <img :src="icons.i_plus" alt @click="operateAmount(1)" :style="!amountObj.status[1]?'opacity:.3':''" />
      </div>
    </div>
  </div>
</template>

<script>
import { i_minus, i_plus } from "@/utils/icons";

export default {
  data() {
    return {
      icons: { i_minus, i_plus },
      amountObj: {
        amount: 100,
        range: 50,
        region: [50, 1000],
        status: [true, true]
      }
    };
  },
  props: ["amountType", "f_amount"],
  created() {
    if (this.amountType == "oil") {
      this.amountObj.amount = this.f_amount || 500;
      this.amountObj.range = 100;
      this.amountObj.region = [100, 10000];
    } else {
      this.amountObj.amount = 50;
      this.amountObj.range = 50;
      this.amountObj.region = [50, 1000];
    }
    this.checkStatus();
    this.$parent.rechargeForm.amount = this.amountObj.amount;
  },
  methods: {
    // 操作充值金额
    operateAmount(num) {
      this.amountObj.status = [true, true];
      this.amountObj.amount =
        this.amountObj.amount + num * this.amountObj.range;
      this.checkStatus();
      this.$parent.rechargeForm.amount = this.amountObj.amount;
      // 检测优惠券 + 油卡充值明细
      this.$parent.checkUsableCouponAndRechargeDetail();
      // 计算订单价格
      this.$parent.computeOrderPrice();
    },
    checkStatus() {
      if (this.amountObj.amount <= this.amountObj.region[0]) {
        this.amountObj.amount = this.amountObj.region[0];
        this.amountObj.status[0] = false;
      }
      if (this.amountObj.amount >= this.amountObj.region[1]) {
        this.amountObj.amount = this.amountObj.region[1];
        this.amountObj.status[1] = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view-amount {
  > div {
    > div {
      display: inline-block;
      vertical-align: middle;
      + div {
        position: relative;
        &::before {
          content: "";
          border-left: solid 2px #dbdbdb;
          position: absolute;
          left: 0;
          height: 80%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &.left {
        width: 35%;
        text-align: left;
      }
      &.right {
        width: 65%;
        font-size: 0;
        text-align: right;
        > img {
          height: 24px;
          width: 24px;
        }
        > span {
          font-size: 15px;
          font-size: medium;
          padding: 0 40px;
        }
        > * {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
