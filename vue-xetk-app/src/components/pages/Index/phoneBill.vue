<template>
  <div class="view-phoneBill">
    <div class="main">
      <div>
        <div class="o-c-1 fixed-top">
          <div class="left">
            <img :src="mobileTypes[mobileIdx]"
                 alt />
          </div>
          <div class="right">
            <input type="tel"
                   v-model="rechargeForm.mobile"
                   @input="checkMobile"
                   placeholder="请输入手机号"
                   maxlength="11" />
            <img v-if="rechargeForm.mobile"
                 :src="icons.i_clear"
                 alt
                 @click="rechargeForm.mobile='';checkMobile()" />
          </div>
        </div>
        <div class="o-c-2">
          <div>
            <div class="row-0">
              <div v-for="(el,index) in phoneWays"
                   :key="index"
                   :class="{'selected':index==phoneWaySelectedIdx}"
                   @click="phoneWaySelectOne(el,index)">
                <span>{{el}}</span>
              </div>
            </div>
            <div class="row-1"
                 v-if="!(phoneWaySelectedIdx==1)">
              <!-- 金额控制组件 -->
              <AmountControl amountType="phone" />
              <!-- 金额控制组件 -->
            </div>
            <div class="row-2"
                 v-if="rechargeList">
              <p>
                <img :src="icons.i_order"
                     alt />
                <span>{{!(phoneWaySelectedIdx==1)?'选择话费充值套餐':'选择话费充值金额'}}</span>
              </p>
              <div v-if="!(phoneWaySelectedIdx==1)"
                   class="o-c-list">
                <!-- 充值选项组件 -->
                <RechargeList :list="rechargeList"
                              :sidx="rechargeSelectedIdx"
                              pageType="phone"
                              rechargeType="1" />
                <!-- 充值选项组件 -->
              </div>
              <div v-else
                   class="o-c-list">
                <!-- 充值选项组件 -->
                <RechargeList :list="rechargeList"
                              :sidx="rechargeSelectedIdx"
                              pageType="phone"
                              rechargeType="0" />
                <!-- 充值选项组件 -->
              </div>
            </div>
          </div>
        </div>
        <div class="o-c-3">
          <!--  -->
        </div>
        <div class="o-c-4">
          <div>
            <div v-if="phoneWaySelectedIdx==0"
                 @click="showRechargeDetail">
              <p>
                <span class="s-1">充值明细</span>
                <span class="s-r">
                  <span v-if="rechargeDetail.list">{{rechargeDetail.list.length}}个月</span>
                  <span v-else>暂无</span>
                  <img :src="icons.i_arrow_b"
                       alt
                       class="right-arrow" />
                </span>
              </p>
            </div>
            <div @click="usableCoupon.num>0&&showCouponSelect()">
              <p>
                <span class="s-1">优惠券</span>
                <span class="s-r">
                  <span v-if="usableCoupon.selectedOne">
                    <span>{{usableCoupon.selectedOne.title}}</span>
                  </span>
                  <span v-else>
                    <span v-if="usableCoupon.num>0">{{usableCoupon.num}}张</span>
                    <span v-else>{{listApiStatus==2?'暂无可用优惠券':''}}</span>
                  </span>
                  <img :src="icons.i_arrow_b"
                       alt
                       class="right-arrow" />
                </span>
              </p>
            </div>
          </div>
          <div v-if="phoneWaySelectedIdx==0&&rechargeDetail.list&&rechargeDetail.list.length==1">
            <p style="font-size:11px;color:#ACACAC;padding:8px 0;">1个月套餐将在下月当天充值</p>
          </div>
        </div>
        <div class="o-c-6 rechargeDetial-component"
             v-if="rechargeDetail.visible">
          <!-- 充值计划组件 -->
          <RechargePlan :rechargePlanList="rechargeDetail.list" />
          <!-- 充值计划组件 -->
        </div>
        <transition :name="usableCoupon.transitionName">
          <div class="o-c-7 coupon-component fixed-top"
               v-if="usableCoupon.visible">
            <div class="c-l-h"></div>
            <!-- 优惠券列表组件 -->
            <CouponList :couponList="usableCoupon.list" />
            <!-- 优惠券列表组件 -->
            <div class="c-l-f fixed-bottom"
                 @click="noCouponSelect">暂不使用优惠券</div>
          </div>
        </transition>
      </div>
    </div>
    <div class="btn fixed-bottom">
      <div class="left">
        <p>
          总计:
          <span class="s-1">￥{{orderPrice.total}}</span>
          <span class="s-2">(省{{orderPrice.economize}}元)</span>
        </p>
      </div>
      <div class="right"
           @click="goOrderPayPage">
        <span>立即充值</span>
      </div>
    </div>
  </div>
</template>

<script>
import CouponList from "@pages/Common/CouponList";
import RechargePlan from "@pages/Common/RechargePlan";
import AmountControl from "@pages/Common/AmountControl";
import RechargeList from "@pages/Common/RechargeList";
import { browserName } from "@/utils/const";
import {
  i_mobile,
  i_mobile_10000,
  i_mobile_10010,
  i_mobile_10086,
  i_clear,
  i_order,
  i_arrow_b
} from "@/utils/icons";
import {
  api_mobile_meals,
  api_mobile_meal,
  api_oil_usableCoupon,
  api_oil_detail
} from "@/api/oilMan";
import { verifyMobile3Type } from "@/utils/verify";
export default {
  components: { CouponList, RechargePlan, AmountControl, RechargeList },
  data() {
    return {
      icons: { i_order, i_arrow_b, i_clear },
      mobileTypes: [i_mobile, i_mobile_10000, i_mobile_10010, i_mobile_10086],
      mobileIdx: 0,
      phoneWays: ["话费套餐", "话费直充"],
      phoneWaySelectedIdx: 0, // 0套餐 1直充
      rechargeList: null, // 充值列表
      rechargeSelectedIdx: 0,
      rechargeForm: {
        amount: 0,
        mobile: "",
        pay_type: "weixin", // 支付方式: alipay 支付宝支付, weixin 网页微信支付, weixin_app app微信支付
        recharge_id: "",
        coupon_id: "",
        openid: ""
      },
      usableCoupon: {
        transitionName: "",
        list: [],
        num: 0,
        selectedOne: null,
        visible: false
      },
      rechargeDetail: {
        visible: false,
        list: null
      },
      orderPrice: {
        origin: 0, // 原价
        total0: 0, // 最终价 不减优惠券
        total: 0, // 最终价 减去优惠券
        economize0: 0, // 省的钱 不加优惠券
        economize: 0 // 省的钱 加上优惠券
      },
      listApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  watch: {},
  created() {
    this.getList();
    const openid = window.localStorage.getItem("openid") || "";
    if (openid) {
      this.rechargeForm.openid = openid;
    }
  },
  mounted() {},
  methods: {
    checkMobile() {
      const rs = verifyMobile3Type(this.rechargeForm.mobile);
      this.mobileIdx =
        ["chinaTelecom", "chinaUnicom", "chinaMobile"].indexOf(rs) + 1;
    },
    phoneWaySelectOne(el, index) {
      this.phoneWaySelectedIdx = index;
      this.getList();
    },
    getList() {
      this.rechargeList = null;
      if (this.phoneWaySelectedIdx == 1) {
        api_mobile_meal().then(res => {
          // console.log(res)
          if (res.code == 0) {
            this.rechargeList = res.data;
            this.defaultSeleted();
          }
        });
      } else {
        api_mobile_meals().then(res => {
          // console.log(res)
          if (res.code == 0) {
            this.rechargeList = res.data;
            this.defaultSeleted();
          }
        });
      }
    },
    defaultSeleted() {
      if (this.phoneWaySelectedIdx == 0) {
        for (let i = 0; i < this.rechargeList.length; i++) {
          if (this.rechargeList[i].selected == 1) {
            this.rechargeSelectedIdx = i;
            this.rechargeForm.recharge_id = this.rechargeList[i].id;
            break;
          }
        }
      } else {
        this.rechargeSelectedIdx = 0;
        this.rechargeForm.recharge_id = "";
      }
      // 检测优惠券 + 油卡充值明细
      this.checkUsableCouponAndRechargeDetail();
      // 计算订单价格
      this.computeOrderPrice();
    },
    goAddOilCardPage() {
      this.$router.push(this.routesMatch["addOilCard"]);
    },
    // 展示充值明细
    showRechargeDetail() {
      // console.log(this.rechargeDetail)
      if (this.rechargeDetail.list && this.rechargeDetail.list.length > 0) {
        this.rechargeDetail.visible = true;
      }
    },
    // 显示优惠券
    showCouponSelect() {
      if (this.usableCoupon.list && this.usableCoupon.list.length > 0) {
        this.usableCoupon.visible = true;
        this.usableCoupon.transitionName = "slide-up";
        // window.scrollTo({ top: 0, behavior: 'smooth' });
        this.$parent.setHeader({
          centerValue: "选择优惠券",
          leftEvent: () => {
            this.hideCouponSelect();
          }
        });
      }
    },
    // 隐藏选择优惠券
    hideCouponSelect() {
      this.$parent.setHeader({
        centerValue: "话费充值"
      });
      this.usableCoupon.transitionName = "slide-down";
      setTimeout(() => {
        this.usableCoupon.visible = false;
      }, 100);
    },
    // 暂不选择优惠券
    noCouponSelect() {
      this.usableCoupon.selectedOne = {
        title: "暂不使用优惠券",
        amount: 0
      };
      this.rechargeForm.coupon_id = "";
      // 隐藏选择优惠券
      this.hideCouponSelect();
      // 计算订单价格
      this.computeOrderPrice();
    },
    // 选择一个优惠券
    selectOneCoupon(el) {
      this.usableCoupon.selectedOne = el;
      this.rechargeForm.coupon_id = el.id;
      this.hideCouponSelect();
      // 计算订单价格
      this.computeOrderPrice();
    },
    // 检测可用优惠券 + 油卡充值明细
    checkUsableCouponAndRechargeDetail() {
      const one = this.rechargeList[this.rechargeSelectedIdx];
      if (this.phoneWaySelectedIdx == 1) {
        this.rechargeForm.amount = one.real_price;
      }
      if (!this.rechargeForm.amount) {
        return;
      }
      const f = {
        amount: this.rechargeForm.amount,
        recharge_id: this.rechargeForm.recharge_id,
        channel: "mobile_recharge"
      };
      const token = window.localStorage.getItem("token") || "";
      if (token) {
        this.listApiStatus = 1;
        api_oil_usableCoupon(f).then(res => {
          if (res.code == 0) {
            this.usableCoupon.list = res.data.coupon_list || [];
            this.usableCoupon.num = res.data.coupon_num || 0;
          } else {
            alert(res.msg);
          }
          this.listApiStatus = 2;
        });
      }
      if (this.phoneWaySelectedIdx == 0) {
        api_oil_detail(f).then(res => {
          if (res.code == 0) {
            this.rechargeDetail.list = res.data || [];
          } else {
            alert(res.msg);
          }
        });
      }
    },
    // 计算订单价格
    computeOrderPrice() {
      const one = this.rechargeList[this.rechargeSelectedIdx];
      if (this.phoneWaySelectedIdx == 0) {
        const amount = Number(this.rechargeForm.amount) || 1000;
        const discount = Number(one.discount) || 1;
        const months = Number(one.months) || 1;
        let couponAmount = 0;
        if (this.usableCoupon.selectedOne) {
          couponAmount = Number(this.usableCoupon.selectedOne.amount || 0);
        }
        this.orderPrice.origin = (amount * months).toFixed(2);
        this.orderPrice.total0 = (amount * discount * months).toFixed(2);
        this.orderPrice.total = (
          amount * discount * months -
          couponAmount
        ).toFixed(2);
        this.orderPrice.economize0 = (amount * (1 - discount) * months).toFixed(
          2
        );
        this.orderPrice.economize = (
          amount * (1 - discount) * months +
          couponAmount
        ).toFixed(2);
      } else {
        const sell_price = Number(one.sell_price);
        const real_price = Number(one.real_price);
        let couponAmount = 0;
        if (this.usableCoupon.selectedOne) {
          couponAmount = Number(this.usableCoupon.selectedOne.amount || 0);
        }
        this.orderPrice.origin = sell_price.toFixed(2);
        this.orderPrice.total0 = real_price.toFixed(2);
        this.orderPrice.total = (real_price - couponAmount).toFixed(2);
        this.orderPrice.economize0 = (sell_price - real_price).toFixed(2);
        this.orderPrice.economize = (
          sell_price -
          real_price +
          couponAmount
        ).toFixed(2);
      }
    },
    // 去订单支付页面
    goOrderPayPage() {
      const token = window.localStorage.getItem("token") || "";
      if (!token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      const f = this.rechargeForm;
      // console.log(f)
      if (!f.mobile) {
        alert("请输入要充值的手机号");
        return;
      }
      if (!f.amount) {
        alert("请选择要充值的金额");
        return;
      }
      if (this.phoneWaySelectedIdx === 0) {
        if (f.recharge_id === "") {
          alert("请选择要充值的套餐");
          return;
        }
      }
      // console.log(f)
      let couponTitle = "暂无可用优惠券";
      if (this.usableCoupon.selectedOne) {
        couponTitle = this.usableCoupon.selectedOne.title;
      }
      const payForm = {
        充值详情: this.phoneWays[this.phoneWaySelectedIdx] || "",
        订单总额: this.orderPrice.origin,
        优惠券减免: couponTitle,
        应付款: this.orderPrice.total
      };
      // return
      this.$router.push({
        path: this.routesMatch["phoneOrderPay"],
        query: {
          payForm: JSON.stringify(payForm),
          rechargeForm: JSON.stringify(f)
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-phoneBill {
  .main {
    > div {
      .o-c-1 {
        height: $list-one-height;
        background-color: #ffffff;
        &.fixed-top {
          top: 44px;
        }
        > div {
          display: inline-block;
          font-size: 0;
          height: 100%;
          position: relative;
          vertical-align: middle;
          &.left {
            width: 20%;
            img {
              height: 24px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 15px;
            }
          }
          &.right {
            width: 80%;
            input {
              width: 80%;
              font-size: $default-font-size;
              line-height: 30px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0;
            }
            img {
              height: 16px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 25px;
            }
          }
        }
      }
      .o-c-2 {
        margin-top: 50px;
        padding: 15px;
        padding-bottom: 0;
        font-size: $default-font-size;
        color: $default-color;
        > div {
          background-color: #ffffff;
          border-radius: 5px;
          > div {
            + div {
              border-bottom: solid 1px #eeeeee;
            }
            &:last-child {
              border: none;
            }
          }
          .row-0 {
            font-size: 15px;
            color: $default-color;
            > div {
              display: inline-block;
              width: 50%;
              line-height: $list-one-height;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                bottom: 0;
                width: 100%;
                left: 0;
                height: 1px;
              }
              &:not(.selected) {
                &::after {
                  background-color: #eeeeee;
                }
              }
              &.selected {
                color: #ef3a34;
                &::after {
                  // border-bottom: 1px solid;
                  // border-image: linear-gradient(#FE9044, #EE3733) 30 30;
                  background-image: $background-image-to-right;
                }
              }
            }
          }
          .row-1 {
            padding: 20px;
            box-sizing: border-box;
          }
          .row-2 {
            padding: 15px 5px;
            > p {
              text-align: left;
              position: relative;
              padding: 0 24px;
              > img {
                height: 24px;
                width: 24px;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .o-c-list {
              padding: 5px;
              box-sizing: border-box;
              font-size: 12px;
              color: #838383;
              text-align: left;
            }
          }
        }
      }
      .o-c-3 {
        padding: 5px 15px;
        > div {
          > p {
            text-align: right;
            font-size: 11px;
            color: #acacac;
            > span {
              color: #e11111;
              &.s-1 {
                text-decoration: line-through;
              }
            }
          }
        }
      }
      .o-c-4 {
        padding: 0 15px;
        font-size: 11px;
        color: $default-color;
        margin-bottom: 25px;
        > div {
          border-radius: 5px;
          overflow: hidden;
          > div {
            padding: 0 10px;
            line-height: $list-one-height;
            text-align: left;
            background-color: #ffffff;
            + div {
              border-top: solid 1px #eeeeee;
            }
            p {
              position: relative;
              .s-1 {
                font-size: 15px;
              }
              .s-2 {
                color: #e11111;
                padding: 0 5px;
              }
              .s-r {
                position: absolute;
                right: 0;
                color: #acacac;
                > span {
                  padding: 0 10px;
                }
                img.right-arrow {
                  height: 10px;
                  width: 10px;
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%) rotate(45deg);
                  opacity: $arrow-b-opacity;
                }
              }
            }
          }
        }
      }
      .o-c-7 {
        &.coupon-component {
          height: 100%;
          top: 0;
          background-color: #eeeeee;
          box-sizing: border-box;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 50px;
          .c-l-h {
            height: 44px;
            background-color: #ffffff;
          }
          .c-l-f {
            line-height: 50px;
            background-color: #ffffff;
            bottom: 0;
            width: 100%;
            color: #aaacb1;
          }
        }
      }
    }
  }
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
        }
        .s-2 {
          font-size: 11px;
          color: #e11111;
          padding: 0 5px;
        }
      }
      &.right {
        width: 30%;
        background-image: $background-image-to-right;
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
}
</style>
