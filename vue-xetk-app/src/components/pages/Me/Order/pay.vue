<template>
  <div class="view-orderPay">
    <div class="main">
      <div>
        <p>充值详情</p>
        <div class="d-list">
          <div v-for="(value,key,index) in list" :key="index">
            <div>
              <span class="s-left">{{key}}</span>
              <span class="s-right float-right clear-float" :class="{'red-1':key=='应付款'}">{{value}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="select-pay fixed-bottom">
      <div class="pay-list">
        <p>选择支付方式</p>
        <div v-for="(el,index) in payList" :key="index" :style="'width:'+(100/payList.length)+'%;'" @click="selectPayWay(el)" :class="'payApiStatus-'+payApiStatus">
          <p class="p-1">
            <img :src="el.icon" alt />
          </p>
          <p class="p-2">{{payApiStatus==1?'支付中...':el.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_wechat_pay /*i_alipay_pay*/ } from "@/utils/icons";
import { api_oil_oilOrder } from "@/api/oilMan";
import { browserName } from "@/utils/const.js";
import { isJSON } from "@/utils/verify";
export default {
  data() {
    return {
      pathMatch: "",
      list: null,
      payList: [
        {
          icon: i_wechat_pay,
          text: "微信支付", // 支付方式: alipay 支付宝支付, weixin 网页微信支付, weixin_app app微信支付
          key: "weixin"
        }
        // ,{
        //   icon: i_alipay_pay,
        //   text: '支付宝支付',
        //   key: 'alipay',
        // }
      ],
      payApiStatus: 0, // 0未请求 1请求中 2请求结束
      paySubmitForm: null
    };
  },
  created() {
    this.pathMatch = this.$route.params.pathMatch || "";
    this.list = JSON.parse(this.$route.query.payForm);
    this.paySubmitForm = JSON.parse(this.$route.query.rechargeForm);
  },
  methods: {
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.paySubmitForm.pay_type = el.key;
      // console.log(this.paySubmitForm)
      // alert(el.text)
      const f = this.paySubmitForm;
      const amount = Number(f.amount).toFixed(2);
      this.payApiStatus = 1;
      setTimeout(() => {
        this.payApiStatus = 2;
      }, 5000);
      api_oil_oilOrder(f).then(res => {
        // console.log(res)
        if (res.code == 0) {
          const order_id = res.data.order_id || "";
          if (browserName == "wx") {
            let payInfo = res.data.weixin;
            if (isJSON(res.data.weixin)) {
              payInfo = JSON.parse(res.data.weixin || null);
            }
            if (payInfo.result_code == "FAIL") {
              alert(payInfo.err_code_des);
              // return;
            }
            // console.log('微信公众号支付 官网推荐方法');
            this.$parent.weixinPay_WeixinJSBridge(payInfo, res => {
              window.sessionStorage.setItem(
                "orderPay:res",
                JSON.stringify(res)
              );
              this.payApiStatus = 2;
              order_id && this.goPayResultPage(amount, order_id, res);
            });
            // jssdk
          } else {
            alert("请在微信内的浏览器打开");
          }
        } else {
          alert(res.msg);
        }
      });
    },
    // 去订单详情页
    goPayResultPage(amount, order_id, res) {
      let path = "oilOrderPayResult";
      if (this.pathMatch == "phone") {
        path = "phoneOrderPayResult";
      }
      this.$router.push({
        path: this.routesMatch[path],
        query: {
          status: res.err_msg == "get_brand_wcpay_request:ok" ? 1 : 0,
          amount: amount,
          order_id,
          pageFrom: "pay"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-orderPay {
  .main {
    > div {
      margin-top: 5px;
      text-align: left;
      > p {
        padding: 10px;
      }
      .d-list {
        background-color: #ffffff;
        > div {
          height: $list-one-height;
          line-height: $list-one-height;
          padding: 0 15px;
          + div {
            > div {
              border-top: solid 1px #eeeeee;
            }
          }
          > div {
            font-size: 15px;
            color: $default-color;
            .s-right {
              font-size: 17px;
              color: #acacac;
              &.red-1 {
                color: #e11111;
              }
            }
          }
        }
      }
    }
  }
  @import "@style/scss/select-pay.scss";
}
</style>
