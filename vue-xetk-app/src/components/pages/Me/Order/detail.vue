<template>
  <div class="view-orderDetail">
    <div class="main">
      <div>
        <div class="order-1">
          <div class="basic list-one">
            <p>
              <span class="s-left" :class="'status-'+orderDetail.status">{{statusName[orderDetail.status]}}</span>
              <span>{{orderDetail.title}}</span>
            </p>
          </div>
          <!--  -->
          <template v-if="pathMatch=='phone'">
            <div v-for="(el,index) in phoneList" :key="index" class="list-one">
              <div class="left">
                <span>{{el.label}}</span>
              </div>
              <div class="right">
                <span v-if="el.key.includes('amount')">￥</span>
                <span>{{orderDetail[el.key]}}</span>
              </div>
            </div>
          </template>
          <!--  -->
          <template v-if="pathMatch=='oil'">
            <div v-for="(el,index) in oilList" :key="index" class="list-one">
              <div class="left">
                <span>{{el.label}}</span>
              </div>
              <div class="right">
                <span v-if="el.key.includes('amount')">￥</span>
                <span>{{orderDetail[el.key]}}</span>
              </div>
            </div>
          </template>
          <!--  -->
          <div v-for="(el,index) in payList" :key="index" class="list-one">
            <div class="left">
              <span v-if="el.key=='pay_amount'">{{statusName[orderDetail.status]}}</span>
              <span v-else>{{el.label}}</span>
            </div>
            <div class="right" :class="el.key">
              <span v-if="el.key.includes('amount')">￥</span>
              <span>{{orderDetail[el.key]}}</span>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="order-2">
          <div v-for="(el,index) in orderList" :key="index" class="list-one">
            <div class="left">
              <span>{{el.label}}</span>
            </div>
            <div class="right">
              <span>{{orderDetail[el.key]}}</span>
            </div>
          </div>
        </div>
        <div v-if="dateList&&pathMatch=='phone'" class="order-3">
          <div v-for="(el,index) in dateList" :key="index" :class="'index-'+index" class="list-one">
            <div class="left">
              <span v-if="index==0">本期到账</span>
              <span v-else>{{el.fee}}</span>
            </div>
            <div class="center">
              <span v-if="index==0">到账时间</span>
              <span v-else>{{el.date}}</span>
            </div>
            <div class="right">
              <span v-if="index==0">状态</span>
              <span v-else>{{el.status}}</span>
            </div>
          </div>
        </div>
        <div v-if="orderDetail.order_type=='oil_card'" class="tips-1">
          <p>*该订单为领取油卡订单，查看领取的油卡请前往我的油卡查看</p>
        </div>
        <div class="order-4">
          <p :class="'payApiStatus-'+payApiStatus">
            <img v-if="orderDetail.status>=0" :src="icons.i_order_cancel" alt @click="cancelOrder" />
            <img v-if="orderDetail.status==0" :src="icons.i_order_gopay" alt @click="rechargeOrderPay(orderDetail)" />
          </p>
        </div>
      </div>
    </div>
    <!--  -->
    <div v-if="selectPay.visible" class="select-pay">
      <!-- mint-ui -->
      <mt-popup v-model="selectPay.visible" position="bottom">
        <div class="pay-list">
          <p>选择支付方式</p>
          <div v-for="(el,index) in selectPay.list" :key="index" :style="'width:'+(100/selectPay.list.length)+'%;'" @click="selectPayWay(el)" :class="'payApiStatus-'+payApiStatus">
            <p class="p-1">
              <img :src="el.icon" alt />
            </p>
            <p class="p-2">{{payApiStatus==1?'支付中...':el.text}}</p>
          </div>
        </div>
      </mt-popup>
      <!-- mint-ui  -->
    </div>
    <!--  -->
  </div>
</template>

<script>
import { i_order_cancel, i_order_gopay, i_wechat_pay } from "@/utils/icons";
import {
  api_recharge_orderDetail,
  api_recharge_close,
  api_oil_recharge_pay
} from "@/api/oilMan";
import { browserName } from "@/utils/const";
export default {
  data() {
    return {
      icons: { i_order_cancel, i_order_gopay },
      pathMatch: "",
      orderId: "",
      statusName: {
        all: "全部",
        "0": "待支付",
        "1": "进行中",
        "3": "已完成",
        "7": "已退款",
        "-1": "已取消"
      },
      orderDetail: {},
      phoneList: [
        {
          label: "手机号码",
          key: "mobile"
        },
        {
          label: "月充值金额",
          key: "amount"
        }
      ],
      oilList: [
        {
          label: "油卡类型",
          key: "card_type_name"
        },
        {
          label: "油卡卡号",
          key: "card_no"
        },
        {
          label: "月充值金额",
          key: "amount"
        }
      ],
      payList: [
        {
          label: "优惠券",
          key: "coupon_text"
        },
        {
          label: "支付状态",
          key: "pay_amount"
        }
      ],
      orderList: [
        {
          label: "订单编号",
          key: "order_sn"
        },
        {
          label: "下单时间",
          key: "order_time"
        }
      ],
      dateList: null,
      detailForm: {
        order_id: "",
        type: "" // oil_recharge,mobile_recharge
      },
      paySubmitForm: {
        order_id: "",
        pay_type: "", //支付方式 alipay—支付宝支付，weixin—网页微信支付，weixin_app—app微信支付
        channel: "", //oil_recharge,mobile_recharge
        openid: ""
      },
      selectPay: {
        visible: false,
        list: [
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
        ]
      },
      payApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    // console.log(this.$route)
    this.pathMatch = this.$route.params.pathMatch || ""; // 匹配 *
    if (this.pathMatch == "oil") {
      this.detailForm.type = "oil_recharge";
    } else {
      this.detailForm.type = "mobile_recharge";
    }
    this.paySubmitForm.channel = this.detailForm.type;

    this.detailForm.order_id = this.$route.params.id || ""; // 匹配 :id
    if (this.detailForm.order_id && this.detailForm.type) {
      this.paySubmitForm.order_id = this.detailForm.order_id;
      this.getDetail();
    }
    // 返回事件
    const pageFrom = this.$route.query.pageFrom || "";
    if (pageFrom == "pay") {
      this.$parent.setHeader({
        leftEvent: () => {
          this.$router.push(this.routesMatch["me"]);
        }
      });
    }
  },
  methods: {
    getDetail() {
      api_recharge_orderDetail(this.detailForm).then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.orderDetail = res.data;
          const list = res.data.order_detail || [];
          if (list.length > 0) {
            this.dateList = [{}, ...list];
          }
        } else {
          alert(res.msg);
        }
      });
    },
    // 充值订单支付
    rechargeOrderPay(el) {
      if (!this.paySubmitForm.order_id) {
        this.paySubmitForm.order_id = el.id;
      }
      // 验证token 和 openid
      const token = window.localStorage.getItem("token") || null;
      if (!token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      if (browserName == "wx") {
        const openid = window.localStorage.getItem("openid:wxQauth2") || "";
        if (!openid) {
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
          return;
        }
        this.paySubmitForm.openid = openid;
      } else {
        alert("请在微信内部浏览器中打开使用");
        return;
      }
      this.selectPay.visible = true;
    },
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.paySubmitForm.pay_type = el.key;
      const f = this.paySubmitForm;
      const amount = Number(this.orderDetail.pay_amount).toFixed(2);
      this.payApiStatus = 1;
      setTimeout(() => {
        this.payApiStatus = 2;
      }, 5000);
      api_oil_recharge_pay(f).then(res => {
        if (res.code == 0) {
          const order_id = res.data.order_id || "";
          if (browserName == "wx") {
            const payInfo = JSON.parse(res.data.weixin || null);
            // console.log('微信公众号支付 官网推荐方法');
            this.$parent.weixinPay_WeixinJSBridge(payInfo, res => {
              window.sessionStorage.setItem(
                "orderDetailPay:res",
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
          amount,
          order_id,
          pageFrom: "detail"
        }
      });
    },
    // 取消订单
    cancelOrder() {
      confirm("确定取消此订单?", ok => {
        if (ok) {
          const f = {
            order_id: this.detailForm.order_id,
            channel: this.detailForm.type //oil_recharge,mobile_recharge
          };
          this.payApiStatus = 1;
          api_recharge_close(f).then(res => {
            // console.log(res)
            if (res.code == 0) {
              alert("订单取消成功");
              this.getDetail();
            } else {
              alert(res.msg);
            }
            this.payApiStatus = 2;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-orderDetail {
  .main {
    > div {
      padding: 15px;
      box-sizing: border-box;
      > div {
        border-radius: 5px;
        overflow: hidden;
        background-color: #ffffff;
        .list-one {
          padding: 12px 0;
          text-align: left;
          font-size: 12px;
          color: $default-color;
          + .list-one {
            border-top: solid 1px #f5f5f5;
          }
          > div {
            display: inline-block;
            padding: 0 10px;
            box-sizing: border-box;
            &.left {
              width: 30%;
              text-align: left;
            }
            &.right {
              width: 70%;
              text-align: right;
              font-size: 13px;
              color: #acacac;
              &.pay_amount {
                color: #e11111;
              }
              &.coupon_text {
                color: #fd8912;
              }
            }
          }
        }
        &.order-1 {
          .basic {
            padding: 15px 0;
            p {
              font-size: $default-font-size;
              color: $default-color;
              .s-left {
                padding: 2px 10px;
                color: #ffffff;
                border-radius: 0 50px 50px 0;
                margin-right: 20px;
                // 默认 灰
                background-color: #cecece;
                // all全部,0待支付,1进行中,3已完成,7已退款,-1取消
                // 进行中 青
                &.status-1 {
                  background-color: #2ddbac;
                }
                // 已完成 红
                &.status-3 {
                  background-image: linear-gradient(to right, #fe9044, #ee3733);
                }
                // 待支付 黄
                &.status-0 {
                  background-image: linear-gradient(to right, #ffcc33, #fd8710);
                }
              }
            }
          }
        }
        &.order-2,
        &.order-3 {
          margin-top: 10px;
        }
        &.order-3 {
          padding: 5px 0;
          .list-one {
            padding: 5px 0;
            font-size: 12px;
            color: #acacac;
            border-top: none;
            &.index-0 {
              padding: 10px 0;
              > div {
                color: $default-color;
                font-size: $default-font-size;
              }
            }
            > div {
              width: calc(100% / 3);
              text-align: center;
            }
          }
        }
        &.tips-1 {
          background-color: transparent;
          text-align: left;
          padding: 10px 0;
          font-size: 11px;
          color: #e11111;
        }
        &.order-4 {
          background-color: transparent;
          padding: 15px 0;
          p {
            &.payApiStatus-1 {
              opacity: 0.5;
            }
            text-align: right;
            img {
              height: 26px;
              + img {
                margin-left: 15px;
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
