<template>
  <div class="view-mall-order-detail">
    <div class="main">
      <div>
        <div class="content">
          <!--  -->
          <div class="order-status" v-if="orderDetail">
            <span class="s-1"></span>
            <span class="s-2">订单状态：</span>
            <span class="s-3">{{orderDetail.order_status_name}}</span>
          </div>
          <!--  -->
          <div class="select-my-address">
            <div class="s-have style-2" v-if="selectedAddress">
              <p class="p-1">
                <span v-if="selectedAddress.username">{{selectedAddress.username}}</span>
                <span v-if="selectedAddress.phone">{{selectedAddress.phone}}</span>
              </p>
              <p class="p-2">
                <img class="img-1" :src="icons.i_location_1" alt />
                <span v-if="selectedAddress.province">{{selectedAddress.province}}</span>
                <span v-if="selectedAddress.city">{{selectedAddress.city}}</span>
                <span v-if="selectedAddress.district">{{selectedAddress.district}}</span>
                <span v-if="selectedAddress.address">{{selectedAddress.address}}</span>
              </p>
            </div>
          </div>
          <!--  -->
          <div class="order-goods-detail">
            <div class="specs">
              <div class="c-1">
                <img :src="orderDetail.detail.image" alt />
                <div>
                  <p class="p-1">
                    <span v-if="orderDetail.order_type=='oil_card'">卡号：</span>
                    <span>{{orderDetail.detail.goods_name}}</span>
                  </p>
                  <p class="p-2">
                    <span v-if="orderDetail.order_type=='goods'">规格: {{orderDetail.detail.sku_name}}</span>
                    <span
                      v-if="orderDetail.order_type=='oil_card'"
                    >类型: {{orderDetail.detail.oilcard_type}}</span>
                  </p>
                  <p class="p-3">
                    <span>x1</span>
                    <span class="r float-right clear-float">￥{{orderDetail.detail.sku_price}}</span>
                  </p>
                </div>
              </div>
              <p class="p-3">
                <span style="display: block;" :style="orderDetail.order_status>0?'opacity:.5':''">
                  <span>专属优惠：</span>
                  <span class="float-right clear-float">￥{{orderDetail.coupon_amount}}</span>
                </span>
                <span v-if="orderDetail.order_status>0" style="display: block;margin-top: 8px;">
                  <span>订单总价：</span>
                  <span class="float-right clear-float">￥{{orderDetail.order_amount}}</span>
                </span>
              </p>
              <p class="p-4">
                <span v-if="orderDetail.order_status<=0">剩余待支付</span>
                <span v-if="orderDetail.order_status>0">实支付</span>
                <span class="red float-right clear-float">￥{{orderDetail.order_amount}}</span>
              </p>
            </div>
          </div>
          <!--  -->
          <div class="order-info">
            <p class="p-1">订单信息</p>
            <p class="p-2" v-if="orderDetail.shipping_company_name">
              物流公司：
              <span>{{orderDetail.shipping_company_name}}</span>
            </p>
            <p class="p-2" v-if="orderDetail.shipping_code">
              物流单号：
              <span>{{orderDetail.shipping_code}}</span>
            </p>
            <p class="p-2" v-if="orderDetail.order_sn">
              订单编码：
              <span>{{orderDetail.order_sn}}</span>
            </p>
            <p class="p-2" v-if="orderDetail.order_time">
              创建时间：
              <span>{{orderDetail.order_time}}</span>
            </p>
          </div>
          <!--  -->
          <div class="order-status-operate">
            <p v-if="orderDetail.order_status==0">
              <span @click="cancelMallOrder(orderDetail)">取消订单</span>
              <span class="red" @click="payMallOrder(orderDetail)">立即支付</span>
            </p>
            <p v-if="orderDetail.order_status==1||orderDetail.order_status==2">
              <span @click="viewMall56Info(orderDetail)">查看物流</span>
              <span class="red" @click="confirmReceipt(orderDetail)">确认收货</span>
            </p>
            <p v-if="orderDetail.order_status==3">
              <span @click="viewMall56Info(orderDetail)">查看物流</span>
              <!-- <span class="red" @click="mallOrderAgain(orderDetail)">再次购买</span> -->
            </p>
            <p v-if="orderDetail.order_status==-1">
              <span @click="delMallOrder(orderDetail)">删除订单</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div v-if="selectPay.visible" class="select-pay">
      <!-- mint-ui -->
      <mt-popup v-model="selectPay.visible" position="bottom">
        <div class="pay-list">
          <p>选择支付方式</p>
          <div
            v-for="(el,index) in selectPay.list"
            :key="index"
            :style="'width:'+(100/selectPay.list.length)+'%;'"
            @click="selectPayWay(el)"
            :class="'payApiStatus-'+payApiStatus"
          >
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
import { i_location_1, i_wechat_pay } from "@/utils/icons";
import {
  api_shop_orderDetail,
  api_shop_close,
  api_shop_orderPay,
  api_shop_finish,
  api_shop_delete
} from "@/api/oilMan";
import { browserName } from "@/utils/const";
import { isJSON } from "@/utils/verify";

export default {
  data() {
    return {
      icons: { i_location_1 },
      detailForm: {
        order_id: ""
      },
      orderDetail: {
        detail: {}
      },
      selectedAddress: null,
      paySubmitForm: {
        order_id: "",
        pay_type: "", // 支付方式: alipay 支付宝支付, weixin 网页微信支付, weixin_app app微信支付
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
    // console.log(this.$route);
    this.detailForm.order_id = this.$route.params.id || ""; // 匹配 :id
    if (this.detailForm.order_id) {
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
      api_shop_orderDetail(this.detailForm).then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.orderDetail = res.data || {};
          this.selectedAddress = {
            username: this.orderDetail.username,
            phone: this.orderDetail.phone,
            address: this.orderDetail.address
          };
        } else {
          alert(res.msg);
        }
      });
    },
    // 取消商品订单
    cancelMallOrder(el) {
      if (!el.id) {
        return;
      }
      // console.log(el);
      confirm("确定取消此商品订单?", ok => {
        if (ok) {
          const f = { order_id: el.id };
          api_shop_close(f).then(res => {
            if (res.code == 0) {
              alert("商品订单取消成功");
              this.getDetail();
            } else {
              alert(res.msg);
            }
          });
        }
      });
    },
    // 查看物流信息
    viewMall56Info(el) {
      // alert(el.id);
      if (el.shipping_url) {
        this.$router.push({
          path: this.routesMatch["mallOrder56"],
          query: {
            url: encodeURIComponent(el.shipping_url)
          }
        });
      } else {
        alert("物流地址获取失败");
      }
    },
    // 确认收货
    confirmReceipt(el) {
      if (!el.id) {
        alert("商品id获取错误");
        return;
      }
      // console.log(el);
      confirm("确定收货?", ok => {
        if (ok) {
          const f = { order_id: el.id };
          api_shop_finish(f).then(res => {
            if (res.code == 0) {
              alert("确认收货操作成功");
              this.getDetail();
            } else {
              alert(res.msg);
            }
          });
        }
      });
    },
    // // 再次购买
    // mallOrderAgain(el) {
    //   const gid = (el.detail && el.detail.good_id) || "";
    //   // alert(gid);
    //   if (gid) {
    //     this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${gid}`);
    //   } else {
    //     alert("商品id获取错误");
    //   }
    // },
    // 删除订单
    delMallOrder(el) {
      if (!el.id) {
        alert("商品id获取错误");
        return;
      }
      // console.log(el);
      confirm("确定删除此订单?", ok => {
        if (ok) {
          const f = { order_id: el.id };
          api_shop_delete(f).then(res => {
            if (res.code == 0) {
              alert("商品订单删除成功");
              this.$router.go(-1);
            } else {
              alert(res.msg);
            }
          });
        }
      });
    },
    // 商城订单支付
    payMallOrder(el) {
      if (!this.paySubmitForm.order_id) {
        this.paySubmitForm.order_id = el.id;
      }
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
    // 选择支付方式
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.paySubmitForm.pay_type = el.key;
      // console.log(this.paySubmitForm)
      // alert(el.text)
      const f = this.paySubmitForm;
      const amount = Number(this.orderDetail.order_amount).toFixed(2);
      this.payApiStatus = 1;
      setTimeout(() => {
        this.payApiStatus = 2;
      }, 5000);
      api_shop_orderPay(f).then(res => {
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
        this.selectPay.visible = false;
      });
    },
    // 去订单结果页
    goPayResultPage(amount, order_id, res) {
      let path = "mallOrderPayResult";
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
.view-mall-order-detail {
  .main {
    > div {
      .content {
        @import "@style/scss/select-my-address.scss";
        .select-my-address {
          margin-top: 10px;
        }
        .order-status {
          height: 40px;
          line-height: 40px;
          background-color: #ffffff;
          text-align: left;
          padding: 0 15px;
          box-sizing: border-box;
          // border-top: solid 1px #eeeeee;
          margin-top: 1px;
          .s-1 {
            width: 15px;
            height: 15px;
            background: linear-gradient(
              0deg,
              rgba(252, 90, 103, 1) 0%,
              rgba(255, 171, 107, 1) 100%
            );
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            position: relative;
            transform: translateY(2px);
            &::after {
              content: "";
              position: absolute;
              width: 5px;
              height: 5px;
              background-color: #ffffff;
              left: 5px;
              top: 5px;
              border-radius: 5px;
              border: none;
            }
          }
          .s-2 {
            margin-left: 5px;
            font-size: 18px;
            color: #333333;
          }
          .s-3 {
            font-size: 18px;
            color: #e11111;
          }
        }
        .order-goods-detail {
          margin-top: 15px;
          background-color: #ffffff;
          .specs {
            padding: 15px;
            box-sizing: border-box;
            text-align: left;
            padding-bottom: 0;
            .c-1 {
              position: relative;
              font-size: 0;
              margin-bottom: 15px;
              img {
                width: 80px;
                // height: 80px;
                border: solid 1px #eeeeee;
                position: absolute;
              }
              > div {
                width: 100%;
                box-sizing: border-box;
                display: inline-block;
                vertical-align: top;
                padding-left: 100px;
                p {
                  &.p-1 {
                    color: #333333;
                    font-size: 16px;
                  }
                  &.p-2 {
                    color: #7f7f7f;
                    font-size: 12px;
                    margin-bottom: 5px;
                  }
                  &.p-3 {
                    font-size: 16px;
                    color: #acacac;
                    .r {
                      font-size: 17px;
                      color: #333333;
                    }
                  }
                }
              }
            }
            > p {
              padding: 15px 0;
              box-sizing: border-box;
              &.p-3,
              &.p-4 {
                border-top: solid 1px #eeeeee;
                font-size: 14px;
                color: #333333;
                span {
                  &.red {
                    color: #e11111;
                  }
                }
              }
            }
          }
        }
        .order-info {
          margin-top: 10px;
          text-align: left;
          background-color: #ffffff;
          padding: 10px 15px;
          box-sizing: border-box;
          p {
            line-height: 2;
            &.p-1 {
              font-size: 17px;
              color: #333333;
            }
            &.p-2 {
              color: #acacac;
              font-size: 13px;
              span {
                font-size: 12px;
              }
            }
          }
        }
        @import "@style/scss/order-status-operate.scss";
      }
    }
  }
  @import "@style/scss/select-pay.scss";
}
</style>
