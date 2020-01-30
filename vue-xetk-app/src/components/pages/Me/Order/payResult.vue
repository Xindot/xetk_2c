<template>
  <div class="view-payResult">
    <div class="main">
      <div :style="'min-height:'+(w_height-54)+'px;'">
        <div class="main">
          <p class="p-1">
            <img :src="payStatusIcon[result.status]" alt />
          </p>
          <p class="p-2">
            <span>{{payStatusText[result.status]}}</span>
          </p>
          <p class="p-3">
            <span>￥{{result.amount}}</span>
          </p>
          <p class="p-4">
            <img :src="icons.i_back_index" alt @click="backIndexPage" />
          </p>
          <p class="p-5">
            <span>订单详情请到【我的】-【我的订单】中查看</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  i_back_index,
  i_pay_result_success,
  i_pay_result_fail
} from "@/utils/icons";
export default {
  data() {
    return {
      pathMatch: null,
      w_height: window.innerHeight,
      icons: { i_back_index },
      payStatusText: ["交易失败", "交易成功"],
      payStatusIcon: [i_pay_result_fail, i_pay_result_success],
      result: {
        status: 1, //1成功 0失败
        amount: 0
      }
    };
  },
  created() {
    this.pathMatch = this.$route.params.pathMatch || "";
    //
    this.result.status = this.$route.query.status || 0;
    this.result.amount = this.$route.query.amount || 0;
    //
    const order_id = this.$route.query.order_id || "";
    const pageFrom = this.$route.query.pageFrom || "";
    if (pageFrom == "pay") {
      this.$parent.setHeader({
        leftEvent: () => {
          this.leftFn(order_id, pageFrom);
        }
      });
    }
    this.leftFn(order_id, pageFrom);
  },
  methods: {
    leftFn(order_id, pageFrom) {
      let path = "";
      if (["oil", "phone", "mall"].includes(this.pathMatch)) {
        path = `${this.pathMatch}OrderDetail`;
      }
      if (!path) {
        return;
      }
      this.$router.push({
        path: `${this.routesMatch[path]}_${order_id}`,
        query: {
          pageFrom
        }
      });
    },
    backIndexPage() {
      this.$router.push(this.routesMatch["index"]);
    }
  }
};
</script>

<style lang="scss" scoped>
.view-payResult {
  .main {
    > div {
      background-color: #ffffff;
      margin-top: 10px;
      .main {
        text-align: center;
        p {
          &.p-1 {
            padding-top: 20px;
            img {
              width: 124px;
              height: 118px;
            }
          }
          &.p-2 {
            font-size: 17px;
            color: #898989;
            margin-top: 10px;
          }
          &.p-3 {
            font-size: 14px;
            color: #f04035;
            margin-top: 10px;
          }
          &.p-4 {
            margin: 30px 0 40px;
            img {
              width: 165px;
              height: 40px;
            }
          }
          &.p-5 {
            font-size: 12px;
            color: #767676;
          }
        }
      }
    }
  }
}
</style>
