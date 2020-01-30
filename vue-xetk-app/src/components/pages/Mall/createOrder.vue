<template>
  <div class="view-create-order">
    <div class="main">
      <div>
        <div class="content">
          <!--  -->
          <div class="select-my-address" @click="selectMyAddress">
            <div class="s-have style-2" v-if="selectedAddress">
              <p class="p-1">
                <span v-if="selectedAddress.username">{{selectedAddress.username}}</span>
                <span v-if="selectedAddress.phone">{{selectedAddress.phone}}</span>
              </p>
              <p class="p-2">
                <img class="img-1" :src="icons.i_location_1" alt />
                <span>{{selectedAddress.province||''}} {{selectedAddress.city||''}} {{selectedAddress.district||''}} {{selectedAddress.address||''}}</span>
                <img :src="icons.i_arrow_b" class="right-arrow" alt />
              </p>
            </div>
            <div class="s-no" v-else>
              <p>
                <img class="img-1" :src="icons.i_location_1" alt />
                <span>请添加收货地址</span>
                <img :src="icons.i_arrow_b" class="right-arrow" alt />
              </p>
            </div>
          </div>
          <div class="bottom-line-a">
            <img :src="icons.i_mall_bottom_line_a" alt />
          </div>
          <!--  -->
          <div class="order-goods-detail">
            <div class="specs">
              <div class="c-1">
                <img :src="orderGoodsInfo.image" alt />
                <div>
                  <p class="p-1">{{orderGoodsInfo.goods_name}}</p>
                  <p class="p-2">已选: {{orderGoodsInfo.sku_name||'标准'}}</p>
                  <p class="p-3">
                    <span>x1</span>
                    <span class="r float-right clear-float">￥{{orderGoodsInfo.sku_price}}</span>
                  </p>
                </div>
              </div>
              <p class="p-2">
                <span>购买数量</span>
                <span class="s-num float-right clear-float">
                  <img :src="icons.i_mall_btn_minus" alt @click="changeGoodsNum(-1)" :style="paySubmitForm.goods_num<=1?'opacity:.5':''" />
                  <span>{{paySubmitForm.goods_num}}</span>
                  <img :src="icons.i_mall_btn_plus" alt @click="changeGoodsNum(1)" :style="paySubmitForm.goods_num>=99?'opacity:.5':''" />
                </span>
              </p>
              <p class="p-3">
                <span>不支持7天无理由退货(部分单品除外)</span>
              </p>
              <p class="p-4">
                <span class="s-r">
                  <span class="s-1">共1件商品 小计：￥</span>
                  <span class="s-2">{{orderPrice.amount}}</span>
                </span>
              </p>
            </div>
          </div>
          <!--  -->
        </div>
      </div>
    </div>
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
    <div class="btn fixed-bottom">
      <div class="left">
        <p>
          <span class="s-1">总计 ￥{{orderPrice.amount}}</span>
        </p>
      </div>
      <div class="right" @click="goOrderPay">
        <span>提交订单</span>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
import {
  i_location_1,
  i_arrow_b,
  i_mall_bottom_line_a,
  i_mall_btn_plus,
  i_mall_btn_minus,
  i_wechat_pay
} from "@/utils/icons";
import { browserName } from "@/utils/const";
import { api_address_selected, api_shop_createOrder } from "@/api/oilMan";
import { isJSON } from "@/utils/verify";
export default {
  data() {
    return {
      icons: {
        i_location_1,
        i_arrow_b,
        i_mall_bottom_line_a,
        i_mall_btn_plus,
        i_mall_btn_minus
      },
      selectedAddress: null,
      orderGoodsInfo: null,
      paySubmitForm: {
        address_id: "",
        goods_id: "",
        sku_id: "",
        goods_num: 1,
        coupon_id: "",
        pay_type: "",
        openid: ""
      },
      orderPrice: {
        amount: 0
      },
      selectPay: {
        visible: false,
        list: [
          {
            icon: i_wechat_pay,
            text: "微信支付", // 支付方式: alipay 支付宝支付, weixin 网页微信支付, weixin_app app微信支付
            key: "weixin"
          }
        ]
      },
      payApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    if (this._GD_.selectedAddressOBJ) {
      this.selectedAddress = this._GD_.selectedAddressOBJ;
      this._GD_.selectedAddressOBJ = null;
    } else {
      const token = window.localStorage.getItem("token") || null;
      if (token) {
        this.getDefaultAddress();
      }
    }
    this.orderGoodsInfo = JSON.parse(
      window.localStorage.getItem("goodsDetail:orderGoodsInfo") || null
    );
    this.paySubmitForm = this.orderGoodsInfo.paySubmitForm;
    this.countOrderAmount();
  },
  methods: {
    getDefaultAddress() {
      api_address_selected().then(res => {
        if (res.code == 0) {
          // console.log(res);
          this.selectedAddress = res.data;
        } else {
          alert(res.msg);
        }
      });
    },
    selectMyAddress() {
      const token = window.localStorage.getItem("token") || null;
      if (!token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      this.$router.push({
        path: this.routesMatch["myAddress"],
        query: {
          pageMode: "select"
        }
      });
    },
    changeGoodsNum(num) {
      this.paySubmitForm.goods_num += Number(num);
      if (this.paySubmitForm.goods_num < 1) {
        this.paySubmitForm.goods_num = 1;
      }
      if (this.paySubmitForm.goods_num > 99) {
        this.paySubmitForm.goods_num = 99;
      }
      this.countOrderAmount();
    },
    countOrderAmount() {
      this.orderPrice.amount = (
        Number(this.paySubmitForm.goods_num) *
        Number(this.orderGoodsInfo.sku_price)
      ).toFixed(2);
    },
    goOrderPay() {
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
      if (this.selectedAddress && this.selectedAddress.id) {
        this.paySubmitForm.address_id = this.selectedAddress.id;
      }
      const f = this.paySubmitForm;
      if (!f.address_id) {
        alert("请选择收货地址");
        return;
      }
      this.selectPay.visible = true;
    },
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.paySubmitForm.pay_type = el.key;
      // console.log(this.paySubmitForm)
      // alert(el.text)
      const f = this.paySubmitForm;
      const amount = Number(this.orderPrice.amount).toFixed(2);
      this.payApiStatus = 1;
      setTimeout(() => {
        this.payApiStatus = 2;
      }, 5000);
      api_shop_createOrder(f).then(res => {
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
.view-create-order {
  .main {
    > div {
      .content {
        @import "@style/scss/select-my-address.scss";
        .select-my-address {
          border-radius: 0;
          margin-top: 10px;
        }
        .bottom-line-a {
          font-size: 0;
          img {
            width: 100%;
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
                height: 80px;
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
                      color: #e11111;
                    }
                  }
                }
              }
            }
            > p {
              padding: 15px 0;
              box-sizing: border-box;
              &.p-2,
              &.p-3,
              &.p-4 {
                border-top: solid 1px #eeeeee;
                font-size: 14px;
                color: #333333;
                .s-num {
                  > img {
                    width: 21px;
                    vertical-align: middle;
                    transform: translateY(-1px);
                  }
                  > span {
                    margin: 0 5px;
                    font-size: 15px;
                    color: #333333;
                    background-color: #e4e4e4;
                    padding: 0 8px;
                    height: 21px;
                    line-height: 21px;
                    display: inline-block;
                  }
                }
              }
              &.p-4 {
                text-align: right;
                .s-r {
                  .s-2 {
                    font-size: 15px;
                    color: #e11111;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  @import "@style/scss/select-pay.scss";
  .btn {
    width: 100%;
    line-height: $list-one-height;
    background-color: #ffffff;
    font-size: $default-font-size;
    > div {
      display: inline-block;
      box-sizing: border-box;
      &.left {
        width: 70%;
        padding-left: 15px;
        text-align: left;
        .s-1 {
          font-size: 18px;
          color: #333333;
        }
      }
      &.right {
        width: 30%;
        background-image: $background-image-to-bottom-5;
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
}
</style>
