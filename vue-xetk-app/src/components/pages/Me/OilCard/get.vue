<template>
  <div class="view-getOilCard">
    <div class="main">
      <div>
        <div class="content">
          <!--  -->
          <div class="select-my-address" @click="selectMyAddress">
            <div class="s-have" v-if="selectedAddress">
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
          <!--  -->
          <div class="select-oil-card-package" @click="selectOilpackageFn">
            <div class="s">
              <div class="left">
                <img class="img-1" :src="icons.i_menu" alt />
                <span style="margin-left:5px;">选择油卡套餐</span>
              </div>
              <div class="right">
                <span v-if="showForm.amount">{{showForm.amount}}元</span>
                <span v-if="showForm.months" style="margin:0 25px 0 10px;">{{showForm.months}}个月</span>
                <img :src="icons.i_arrow_b" class="right-arrow" alt />
              </div>
            </div>
          </div>
          <!--  -->
          <div class="c-3">
            <div class="s">
              <p class="p-1">
                <span>选择油卡归属</span>
              </p>
              <div class="d-2">
                <div v-for="(el,index) in oilTypes" :key="index" @click="selectOilType(el,index)">
                  <div :class="{'getable':el.getable}">
                    <p class="p-1">
                      <img :src="el.icon" alt />
                      <span>{{el.text}}</span>
                    </p>
                    <p class="p-2">剩余{{el.num}}张</p>
                    <img
                      v-if="el.getable&&submitForm.type==index+1"
                      :src="icons.i_selected_b_r"
                      class="selected"
                      alt
                    />
                  </div>
                </div>
              </div>
              <p class="p-3">
                <span>数量</span>
                <span class="float-right clear-float">x1</span>
              </p>
              <p class="p-4">
                <span>快递费</span>
                <span class="s-2">({{showForm.express_text}})</span>
                <span class="float-right clear-float">￥{{showForm.express_fee}}</span>
              </p>
            </div>
          </div>
          <!--  -->
          <div class="c-4">
            <div class="t">
              <p class="p-1">
                <span class="s-1">{{explains.t1}}</span>
                <span class="float-right clear-float" @click="showTips('qc')">{{explains.t2}}</span>
              </p>
              <p class="p-2" v-html="explains.t3"></p>
            </div>
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
    <div class="tips" v-if="tips.visible" @click="tips.visible=false;">
      <div>
        <p class="p-1">{{tips.title}}</p>
        <p class="p-2" v-html="tips.content"></p>
      </div>
    </div>
    <!--  -->
    <div class="btn fixed-bottom">
      <p>
        <span class="s-1">总计:</span>
        <span class="s-2">￥{{orderPrice.totalAndEx}}</span>
        <span class="s-3">(省{{orderPrice.economizeAndEx}}元)</span>
        <span class="float-right clear-float" @click="getOilCardFn">立即领取</span>
      </p>
    </div>
    <!--  -->
  </div>
</template>

<script>
import {
  i_location_1,
  i_arrow_b,
  i_menu,
  i_oil_cnpc_w_logo,
  i_oil_sinopec_w_logo,
  i_selected_b_r,
  i_wechat_pay /*i_alipay_pay*/
} from "@/utils/icons";
import {
  api_address_selected,
  api_recharge_express,
  api_recharge_getOilCard
} from "@/api/oilMan";
const tel = "400-862-9665";
import { browserName } from "@/utils/const";
import { isJSON } from "@/utils/verify";
export default {
  data() {
    return {
      icons: {
        i_location_1,
        i_arrow_b,
        i_menu,
        i_selected_b_r
      },
      oilTypes: [
        {
          icon: i_oil_sinopec_w_logo,
          text: "中石化 油卡",
          num: 0,
          getable: false
        },
        {
          icon: i_oil_cnpc_w_logo,
          text: "中石油 油卡",
          num: 0,
          getable: false
        }
      ],
      explains: {
        t1: "领取说明",
        t2: "什么是圈存？",
        t3: `1、使用时间：长期有效。<br>
            2、活动期间，车主充值任意加油套餐并支付成功的用户，即可免费获得一张加油卡。该油卡会自动添加至用户的油卡列表，本次充值金额也会按时充值到该油卡中。<br>
            3、油卡均为加油惠公司副卡，每张副卡均单独使用，且不具备在其地方充值，只可在加油惠进行充值。<br>
            4、用户需要在领取油卡界面填写收货地址，请务必保证其真实性，若因用户的收货信息输入有误原因导致无法收到油卡，平台概不负责。<br>
            5、油卡会在用户付款成功后的7个工作日内寄出，如遇节假日将顺延，寄出后会以短信形式通知用户，请注意查收。<br>
            6、若领取后的油卡丢失或损坏导致卡内的充值金额流失，平台概不负责。<br>
            7、用户收到油卡后，需要先将油卡圈存后才可使用卡内的充值金额。<br>
            8、如以上信息未能解决您的疑问，可联系在线客服或拨打客服热线<a href="tel:${tel}">${tel}</a>咨询。<br>
            9、本次领取油卡的最终活动解释权归油惠侠所有。<br>`
      },
      tips: {
        visible: false,
        title: "",
        content: ""
      },
      selectedAddress: null,
      selectedRecharge: null,
      submitForm: {
        recharge_id: "",
        address_id: "",
        coupon_id: "",
        pay_type: "", // 支付方式: alipay 支付宝支付, weixin 网页微信支付, weixin_app app微信支付
        amount: "",
        openid: "",
        type: "" // 油卡类型,1为石化,2为石油
      },
      showForm: {
        amount: 0,
        months: 0,
        express_fee: 0,
        express_text: ""
      },
      orderPrice: {
        origin: 0, // 原价
        totalNoC: 0, // 最终价 不减优惠券
        total: 0, // 最终价 减去优惠券
        totalAndEx: 0, // 最终价 减去优惠券 加快递费
        economizeNoC: 0, // 省的钱 不加优惠券
        economize: 0, // 省的钱 加上优惠券
        economizeAndEx: 0 // 省的钱 加上优惠券 减快递费
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
    if (this._GD_.selectedAddressOBJ) {
      this.selectedAddress = this._GD_.selectedAddressOBJ;
      this._GD_.selectedAddressOBJ = null;
    } else {
      const token = window.localStorage.getItem("token") || null;
      if (token) {
        this.getDefaultAddress();
      }
    }
    if (this._GD_.selectedRechargeOBJ) {
      this.selectedRecharge = this._GD_.selectedRechargeOBJ;
      window.localStorage.setItem(
        "MeOilCardGet:selectedRecharge",
        JSON.stringify(this.selectedRecharge)
      );
      this._GD_.selectedRechargeOBJ = null;
    } else {
      this.selectedRecharge = JSON.parse(
        window.localStorage.getItem("MeOilCardGet:selectedRecharge") || null
      );
    }
    if (this.selectedRecharge) {
      // console.log(this.selectedRecharge)
      Object.assign(this.showForm, { ...this.selectedRecharge.showForm });
      Object.assign(this.submitForm, { ...this.selectedRecharge.submitForm });
      Object.assign(this.orderPrice, { ...this.selectedRecharge.orderPrice });
      // console.log(this.submitForm,this.showForm,this.orderPrice)
      this.submitForm.amount = Number(this.orderPrice.total || 0);
      this.getExpress();
    }
  },
  mounted() {},
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
    selectOilpackageFn() {
      this.$router.push({
        path: this.routesMatch["oilpackage"],
        query: {
          pageMode: "select"
        }
      });
    },
    selectOilType(el, index) {
      // console.log(el);
      if (el.getable) {
        this.submitForm.type = index + 1;
      } else {
        alert("该油卡暂不可领取");
      }
    },
    getExpress() {
      const recharge_id = this.submitForm.recharge_id;
      const amount = Number(this.showForm.amount || 0);
      const f = { recharge_id, amount };
      api_recharge_express(f).then(res => {
        if (res.code == 0) {
          //   console.log(res);
          this.oilTypes[0].num = res.data.Sinopec_total || 0;
          this.oilTypes[0].getable = res.data.Sinopec == 1 ? true : false;
          this.oilTypes[1].num = res.data.PetroChina_total || 0;
          this.oilTypes[1].getable = res.data.PetroChina == 1 ? true : false;
          //
          this.showForm.express_fee = res.data.express_fee || 0;
          this.showForm.express_text = res.data.express_text || "";
          //
          const total = Number(this.orderPrice.total || 0);
          const economize = Number(this.orderPrice.economize || 0);
          const express = Number(this.showForm.express_fee || 0);
          this.orderPrice.totalAndEx = (total + express).toFixed(2);
          this.orderPrice.economizeAndEx = (economize - express).toFixed(2);
          // console.log(this.orderPrice)
        } else {
          alert(res.msg);
        }
      });
    },
    getOilCardFn() {
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
        this.submitForm.openid = openid;
      } else {
        alert("请在微信内部浏览器中打开使用");
        return;
      }
      if (this.selectedAddress && this.selectedAddress.id) {
        this.submitForm.address_id = this.selectedAddress.id;
      }
      this.submitForm.amount = Number(this.showForm.amount || 0);
      const f = this.submitForm;
      // console.log(JSON.stringify(f));
      if (!f.address_id) {
        alert("请选择收货地址");
        return;
      }
      if (!(f.recharge_id >= 0 && f.recharge_id !== "")) {
        alert("请选择油卡套餐");
        return;
      }
      if (!(f.type == 1 || f.type == 2)) {
        alert("请选择油卡归属");
        return;
      }
      if (!(f.amount > 0)) {
        alert("充值金额必须大于0");
        return;
      }
      this.selectPay.visible = true;
    },
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.submitForm.pay_type = el.key;
      // console.log(this.submitForm)
      // alert(el.text)
      const f = this.submitForm;
      const amount = Number(f.amount).toFixed(2);
      this.payApiStatus = 1;
      setTimeout(() => {
        this.payApiStatus = 2;
      }, 5000);
      api_recharge_getOilCard(f).then(res => {
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
      let path = "oilOrderPayResult";
      this.$router.push({
        path: this.routesMatch[path],
        query: {
          status: res.err_msg == "get_brand_wcpay_request:ok" ? 1 : 0,
          amount: amount,
          order_id,
          pageFrom: "pay"
        }
      });
    },
    showTips() {
      const title = "什么是圈存？";
      const content = `1.“圈存”即激活已充值到账的金额到加油卡中，您可以把加油卡给工作人员，告诉他:我是在网上充值的，请帮我圈存。工作人员会拿卡去圈存机器刷新一下，金额就圈存到加油卡中，并可以刷卡加油了；<br>
        2.充值到账后，金额永远不会过期，您在需要加油时再去加油站圈存即可；<br>
        3.中石化加油卡在办卡省的省内任意中石化直营加油站易捷便利店自助圈存机操作（或请工作人员操作）可以在全国刷卡加油使用；中石油加油卡可在全国任意办卡充值加油站请工作人员帮忙圈存和加油；<br>
        4.如果您是中石化卡，充值到账但圈存没有钱则可能是因为加油卡是多用户卡，需要请加油站工作人员帮忙给加油卡“预分配”，然后再去圈存；如果您是中石油卡，收到中石油的充值成功短信即代表充值成功，直接去加油站圈存即可。<br>`;
      this.tips.title = title;
      this.tips.content = content;
      this.tips.visible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.view-getOilCard {
  .main {
    > div {
      .content {
        padding: 0 15px;
        box-sizing: border-box;
        @import "@style/scss/select-my-address.scss";
        .select-oil-card-package {
          margin-top: 10px;
          height: 40px;
          background-color: #ffffff;
          border-radius: 5px;
          position: relative;
          .s {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
            font-size: 15px;
            color: #333333;
            > div {
              display: inline-block;
              width: 50%;
              &.left {
                text-align: left;
                img {
                  width: 24px;
                  height: 24px;
                  vertical-align: middle;
                  transform: translateY(-1px);
                  margin-left: 5px;
                }
              }
              &.right {
                text-align: right;
                color: #e11111;
                font-size: 12px;
                img {
                  height: 10px;
                  width: 10px;
                  position: absolute;
                  right: 10px;
                  top: 50%;
                  transform: translateY(-50%) rotate(45deg);
                  opacity: 0.5;
                }
              }
            }
          }
        }
        .c-3 {
          margin-top: 10px;
          background-color: #ffffff;
          border-radius: 5px;
          padding: 10px;
          box-sizing: border-box;
          .s {
            text-align: left;
            font-size: 14px;
            color: #333333;
            p {
              line-height: 2;
              &.p-4 {
                .s-2 {
                  color: #e11111;
                  font-size: 12px;
                }
              }
              .float-right {
                color: #565656;
                font-size: 12px;
              }
            }
            .d-2 {
              color: #ffffff;
              > div {
                display: inline-block;
                width: 50%;
                padding: 10px 2px;
                box-sizing: border-box;
                position: relative;
                &:last-child {
                  text-align: right;
                }
                > div {
                  width: 96%;
                  display: inline-block;
                  background: $background-image-to-right-2;
                  padding: 10px 0;
                  box-sizing: border-box;
                  border-radius: 5px;
                  position: relative;
                  text-align: left;
                  box-shadow: 0 5px 10px 0 #c5c5c5;
                  &.getable {
                    background: $background-image-to-top;
                  }
                  p {
                    &.p-1 {
                      text-align: center;
                      font-size: 0;
                      img {
                        height: 30px;
                        width: 30px;
                        vertical-align: text-bottom;
                        margin-right: 5px;
                        transform: translateY(5px);
                      }
                      span {
                        font-size: 14px;
                      }
                    }
                    &.p-2 {
                      padding-left: 20px;
                      box-sizing: border-box;
                    }
                  }
                  img {
                    &.selected {
                      position: absolute;
                      right: 0;
                      bottom: 0;
                      height: 64%;
                    }
                  }
                }
              }
            }
          }
        }
        .c-4 {
          margin-top: 10px;
          .t {
            text-align: left;
            font-size: 12px;
            color: #4a4a4a;
            .p-1 {
              .s-1 {
                font-size: 18px;
              }
              .float-right {
                color: #ee3834;
                text-decoration: underline;
              }
            }
            .p-2 {
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  @import "@style/scss/select-pay.scss";
  .tips {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 111;
    > div {
      position: fixed;
      width: 92.5%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;
      padding: 15px;
      box-sizing: border-box;
      color: #4a4a4a;
      border-radius: 10px;
      .p-1 {
        font-size: 15px;
        text-decoration: underline;
        margin-bottom: 10px;
      }
      .p-2 {
        font-size: 12px;
        text-align: left;
      }
    }
  }
  .btn {
    height: 50px;
    background-color: #ffffff;
    p {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      text-align: left;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;
      color: #333333;
      span {
        vertical-align: text-bottom;
        &.s-2 {
          font-size: 18px;
          margin: 0 10px;
        }
        &.s-3 {
          font-size: 11px;
          color: #e11111;
        }
        &.float-right {
          display: inline-block;
          height: 36px;
          line-height: 36px;
          background: $background-image-to-right;
          padding: 0 15px;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
