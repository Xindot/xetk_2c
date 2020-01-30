<template>
  <div class="view-oilCard">
    <div class="main">
      <div>
        <div class="o-c-1">
          <div>
            <!--  -->
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(el,index) in oilCardList" :key="index" :class="oilCardSwiperClassObject">
                  <div v-if="pageMode!='select'" @click="oilCardSelectOne(el,index)" :class="{'only-one':oilCardList.length==1}">
                    <div :class="{'add':!el.id}">
                      <img :src="oliCardIcon[el.type]" alt @click="oilCardEvent(el)" />
                      <p>{{el.card_no}}</p>
                    </div>
                    <img v-if="el.id && index == oilCardSelectedIdx" :src="icons.i_selected_t_r" alt />
                  </div>
                  <div v-if="pageMode=='select'" class="page-select">
                    <div>本次充值金额将充至您领取的油卡订单中</div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
        <div class="o-c-2">
          <div>
            <div class="row-1" v-if="pathMatch==1">
              <!-- 金额控制组件 -->
              <AmountControl amountType="oil" :f_amount="rechargeForm.amount" />
              <!-- 金额控制组件 -->
            </div>
            <div class="row-2" v-if="rechargeList">
              <p>
                <img :src="icons.i_order" alt />
                <span>{{pathMatch==1?'选择油卡充值套餐':'选择油卡充值金额'}}</span>
              </p>
              <div v-if="pathMatch==1" class="o-c-list">
                <!-- 充值选项组件 -->
                <RechargeList :list="rechargeList" :sidx="rechargeSelectedIdx" pageType="oil" rechargeType="1" />
                <!-- 充值选项组件 -->
              </div>
              <div v-else class="o-c-list">
                <!-- 充值选项组件 -->
                <RechargeList :list="rechargeList" :sidx="rechargeSelectedIdx" pageType="oil" rechargeType="0" />
                <!-- 充值选项组件 -->
              </div>
            </div>
          </div>
        </div>
        <div class="o-c-3" v-if="rechargeList">
          <div v-if="pathMatch==1">
            <p v-if="rechargeSelectedIdx>=0&&rechargeList.length>0">
              充{{rechargeList[rechargeSelectedIdx].months}}个月 原价
              <span class="s-1">{{orderPrice.origin}}</span> 折扣价
              <span>{{orderPrice.totalNoC}}</span> 省
              <span>{{orderPrice.economizeNoC}}</span>元
            </p>
          </div>
        </div>
        <div class="o-c-4" v-if="rechargeDetail">
          <div>
            <div v-if="pathMatch==1" @click="showRechargeDetail">
              <p>
                <span class="s-1">充值明细</span>
                <span class="s-2" v-if="rechargeDetail.list&&rechargeDetail.list.length==1">一个月套餐将在次月当天充值</span>
                <span class="s-r">
                  <span v-if="rechargeDetail.list">{{rechargeDetail.list.length}}个月</span>
                  <span v-else>暂无</span>
                  <img :src="icons.i_arrow_b" alt class="right-arrow" />
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
                  <img :src="icons.i_arrow_b" alt class="right-arrow" />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="o-c-6 rechargeDetial-component" v-if="rechargeDetail.visible">
          <!-- 充值计划组件 -->
          <RechargePlan :rechargePlanList="rechargeDetail.list" />
          <!-- 充值计划组件 -->
        </div>
        <transition :name="usableCoupon.transitionName">
          <div class="o-c-7 coupon-component fixed-top" v-if="usableCoupon.visible">
            <div class="c-l-h"></div>
            <!-- 优惠券列表组件 -->
            <CouponList :couponList="usableCoupon.list" />
            <!-- 优惠券列表组件 -->
            <div class="c-l-f fixed-bottom" @click="noCouponSelect">暂不使用优惠券</div>
          </div>
        </transition>
      </div>
    </div>
    <!--  -->
    <div class="btn fixed-bottom">
      <div class="left">
        <p>
          <span>总计:</span>
          <span class="s-1">￥{{orderPrice.total}}</span>
          <span class="s-2">(省{{orderPrice.economize}}元)</span>
        </p>
      </div>
      <div class="right" @click="goOrderPayPage">
        <span>立即充值</span>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
import Swiper from "swiper";
import CouponList from "@pages/Common/CouponList";
import RechargePlan from "@pages/Common/RechargePlan";
import AmountControl from "@pages/Common/AmountControl";
import RechargeList from "@pages/Common/RechargeList";
import { browserName } from "@/utils/const";
import {
  i_add_oilCard,
  i_oil_cnpc_b,
  i_oil_sinopec_b,
  i_order,
  i_arrow_b,
  i_selected_t_r
} from "@/utils/icons";
import {
  api_user_oilCard,
  api_oil_meals,
  api_oil_meal,
  api_oil_usableCoupon,
  api_oil_detail
} from "@/api/oilMan";
export default {
  components: { CouponList, RechargePlan, AmountControl, RechargeList },
  data() {
    return {
      title: "",
      listApiStatus: 0, // 0未请求 1请求中 2请求结束
      icons: { i_order, i_arrow_b, i_selected_t_r },
      mySwiper: null,
      mySwiperActiveIndex: 0,
      oilCardList: [
        {
          type: 0 // 油卡类型(1中石化，2中石油)  0新增油卡
        }
      ],
      oliCardIcon: [i_add_oilCard, i_oil_sinopec_b, i_oil_cnpc_b],
      oilCardSelectedIdx: -1,
      rechargeList: null,
      rechargeSelectedIdx: -1,
      pathMatch: 0,
      rechargeForm: {
        amount: 0,
        oil_card_id: "",
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
        totalNoC: 0, // 最终价 不减优惠券
        total: 0, // 最终价 减去优惠券
        economizeNoC: 0, // 省的钱 不加优惠券
        economize: 0 // 省的钱 加上优惠券
      },
      pageMode: null,
      scrollTop: {
        a: 0,
        b: 0,
        d: 0
      }
    };
  },
  watch: {
    "mySwiper.activeIndex": function(newVal) {
      // console.log(newVal,oldVal)
      this.mySwiperActiveIndex = newVal;
    }
  },
  computed: {
    oilCardSwiperClassObject() {
      return {
        "s-left": this.mySwiperActiveIndex == 0,
        "s-right": this.mySwiperActiveIndex == this.oilCardList.length - 1
      };
    }
  },
  created() {
    this.pathMatch = this.$route.params.pathMatch || ""; // 1油卡套餐充值 0油卡直充
    this.title = "油卡直充";
    if (this.pathMatch == 1) {
      this.title = "油卡套餐充值";
      this.pageMode = this.$route.query.pageMode;
      this.rechargeForm.amount = this.$route.query.srAmount || 0;
    }
    // console.log(this.pathMatch)
    this.$parent.setHeader({
      centerValue: this.title
    });
    this.getList();
    if (this.pageMode != "select") {
      const token = window.localStorage.getItem("token") || "";
      if (token) {
        this.getMyOilCard();
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, false);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    // 监听页面滚动
    handleScroll() {
      const sHeight = 80;
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop)
      this.scrollTop.a = scrollTop;
      if (this.scrollTop.b <= this.scrollTop.a) {
        if (this.scrollTop.d > 0) {
          return;
        }
        // console.log("下滚");
        if (scrollTop > sHeight) {
          this.$parent.header.backgroundColor = "rgba(255, 93, 76)";
          this.scrollTop.d = 1;
        }
      } else {
        if (this.scrollTop.d < 0) {
          return;
        }
        // console.log("上滚");
        if (scrollTop < sHeight) {
          this.$parent.header.backgroundColor = "transparent";
          this.scrollTop.d = -1;
        }
      }
      setTimeout(() => {
        this.scrollTop.b = this.scrollTop.a;
      }, 0);
    },
    // 初始化轮播图
    intiMySwiper() {
      this.mySwiper = new Swiper(".view-oilCard .swiper-container", {
        slideToClickedSlide: true,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: -20
      });
    },
    // 获取充值列表
    getList() {
      this.rechargeList = null;
      // 1油卡套餐充值 0油卡直充
      if (this.pathMatch == 1) {
        api_oil_meals().then(res => {
          // console.log(res)
          if (res.code == 0) {
            this.rechargeList = res.data || [];
            this.defaultSeleted();
          }
        });
      } else {
        api_oil_meal().then(res => {
          // console.log(res)
          if (res.code == 0) {
            this.rechargeList = res.data || [];
            this.defaultSeleted();
          }
        });
      }
    },
    defaultSeleted() {
      const srId = this.$route.query.srId || "";
      const srIdx = this.$route.query.srIdx || 0;
      // console.log("srId=>", srId, "srIdx", srIdx);
      if (this.pathMatch == 1) {
        if (srId > 0) {
          this.rechargeForm.recharge_id = srId;
          for (let i = 0; i < this.rechargeList.length; i++) {
            if (this.rechargeList[i].id == srId) {
              this.rechargeSelectedIdx = i;
              break;
            }
          }
        } else {
          for (let i = 0; i < this.rechargeList.length; i++) {
            if (this.rechargeList[i].selected == 1) {
              this.rechargeSelectedIdx = i;
              this.rechargeForm.recharge_id = this.rechargeList[i].id;
              break;
            }
          }
        }
      } else {
        this.rechargeSelectedIdx = srIdx || 0;
        this.rechargeForm.recharge_id = "";
      }
      // 检测优惠券 + 油卡充值明细
      this.checkUsableCouponAndRechargeDetail();
      // 计算订单价格
      this.computeOrderPrice();
    },
    // 获取我的油卡
    getMyOilCard() {
      api_user_oilCard().then(res => {
        // console.log(res)
        if (res.code == 0) {
          const list = res.data || [];
          if (list.length > 0) {
            this.oilCardList = [...list, ...this.oilCardList];
            this.$nextTick(() => {
              this.intiMySwiper();
            });
          }
        }
      });
    },
    // 选择油卡
    oilCardSelectOne(el, index) {
      if (el.id) {
        this.oilCardSelectedIdx = index;
        this.rechargeForm.oil_card_id = el.id;
      }
    },
    // 新增油卡
    oilCardEvent(el) {
      if (!el.id) {
        const token = window.localStorage.getItem("token") || "";
        if (token) {
          this.goAddOilCardPage();
        } else {
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
        }
      }
    },
    // 检测可用优惠券 + 油卡充值明细
    checkUsableCouponAndRechargeDetail() {
      const one = this.rechargeList[this.rechargeSelectedIdx];
      if (this.pathMatch == 0) {
        // 直充
        this.rechargeForm.amount = one.real_price;
      }
      // console.log(this.rechargeForm)
      if (!this.rechargeForm.amount) {
        return;
      }
      if (this.pathMatch == 1 && this.rechargeForm.recharge_id === "") {
        return;
      }
      const f = {
        amount: this.rechargeForm.amount,
        recharge_id: this.rechargeForm.recharge_id,
        channel: "oil_recharge"
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
      if (this.pathMatch == 1) {
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
      // console.log(one)
      if (this.pathMatch == 1) {
        // console.log(this.rechargeSelectedIdx)
        const amount = Number(this.rechargeForm.amount) || 1000;
        const discount = Number(one.discount) || 1;
        const months = Number(one.months) || 1;
        let couponAmount = 0;
        if (this.usableCoupon.selectedOne) {
          couponAmount = Number(this.usableCoupon.selectedOne.amount || 0);
        }
        this.orderPrice.origin = (amount * months).toFixed(2);
        this.orderPrice.totalNoC = (amount * discount * months).toFixed(2);
        this.orderPrice.total = (
          amount * discount * months -
          couponAmount
        ).toFixed(2);
        this.orderPrice.economizeNoC = (
          amount *
          (1 - discount) *
          months
        ).toFixed(2);
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
        this.orderPrice.totalNoC = real_price.toFixed(2);
        this.orderPrice.total = (real_price - couponAmount).toFixed(2);
        this.orderPrice.economizeNoC = (sell_price - real_price).toFixed(2);
        this.orderPrice.economize = (
          sell_price -
          real_price +
          couponAmount
        ).toFixed(2);
      }
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
        centerValue: this.title
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
      // 隐藏选择优惠券
      this.hideCouponSelect();
      // 计算订单价格
      this.computeOrderPrice();
    },
    // 去新增油卡页面
    goAddOilCardPage() {
      this.$router.push(this.routesMatch["addOilCard"]);
    },
    // 去订单支付页面
    goOrderPayPage() {
      if (this.pageMode != "select") {
        if (browserName == "wx") {
          const openid = window.localStorage.getItem("openid:wxQauth2") || "";
          if (!openid) {
            const loginPath = browserName == "wx" ? "wxLogin" : "login";
            this.$router.push(this.routesMatch[loginPath]);
            return;
          }
          this.rechargeForm.openid = openid;
        } else {
          alert("请在微信内部浏览器中打开使用");
        }
      }
      const f = this.rechargeForm;
      // console.log(f)
      if (this.pageMode != "select") {
        if (!f.oil_card_id) {
          let title = "请选择一张要充值的油卡";
          if (this.oilCardList.length <= 1) {
            title = "您还没有添加油卡，请先添加油卡";
          }
          alert(title);
          return;
        }
      }
      if (this.pageMode != "select") {
        const token = window.localStorage.getItem("token") || "";
        if (!token) {
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
          return;
        }
      }
      if (!f.amount) {
        alert("请选择要充值的金额");
        return;
      }
      if (this.pathMatch == 1) {
        if (f.recharge_id === "") {
          alert("请选择要充值的套餐");
          return;
        }
      } else {
        delete f.recharge_id;
      }
      // console.log(f)
      let couponTitle = "暂无可用优惠券";
      if (this.usableCoupon.selectedOne) {
        couponTitle = this.usableCoupon.selectedOne.title;
      }
      const payForm = {
        充值详情: ["油卡直充", "油卡套餐充值"][this.pathMatch],
        订单总额: this.orderPrice.origin,
        优惠券减免: couponTitle,
        应付款: this.orderPrice.total
      };
      // return
      if (this.pageMode == "select") {
        const one = this.rechargeList[this.rechargeSelectedIdx];
        this._GD_.selectedRechargeOBJ = {
          showForm: {
            amount: f.amount,
            months: one.months
          },
          submitForm: {
            recharge_id: f.recharge_id,
            coupon_id: f.coupon_id,
            openid: f.openid
          },
          orderPrice: this.orderPrice
        };
        this.$router.go(-1);
        return;
      }
      this.$router.push({
        path: this.routesMatch["oilOrderPay"],
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
.view-oilCard {
  .main {
    > div {
      margin-top: -44px;
      .o-c-1 {
        font-size: 0;
        padding-bottom: 50%;
        background-image: linear-gradient(to bottom, #fa763e, #f45739);
        border-bottom-right-radius: 50% 20px;
        border-bottom-left-radius: 50% 20px;
        overflow: hidden;
        box-sizing: border-box;
        position: relative;
        z-index: 9;
        > div {
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          padding-bottom: 25%;
          z-index: 8;
          .swiper-container {
            width: 100%;
            height: 100%;
            position: absolute;
            text-align: center;
            .swiper-slide {
              width: calc(100% - 40px);
              box-sizing: border-box;
              position: relative;
              transition: transform 0.5s;
              &.s-left {
                transform: translateX(-20px);
              }
              &.s-right {
                transform: translateX(20px);
              }
              > div {
                position: relative;
                height: 100%;
                width: calc(100% - 40px);
                background-color: #ffffff;
                border-radius: 15px 15px 0 0;
                margin: auto;
                font-size: 15px;
                color: $default-color;
                font-weight: medium;
                box-sizing: border-box;
                text-align: left;
                > div {
                  position: absolute;
                  left: 40px;
                  top: 50%;
                  transform: translateY(-50%);
                  &.add {
                    left: 0;
                    right: 0;
                    text-align: center;
                    > img {
                      height: 22px;
                      padding: 10px 0;
                    }
                  }
                  > img {
                    height: 33px;
                  }
                }
                &.only-one {
                  width: 100%;
                }
                &.page-select {
                  text-align: center;
                  width: 100%;
                  > div {
                    left: initial;
                    position: inherit;
                  }
                }
                > img {
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: 50%;
                }
              }
            }
          }
        }
      }
      .o-c-2 {
        padding: 15px;
        padding-bottom: 0;
        font-size: $default-font-size;
        color: $default-color;
        > div {
          background-color: #ffffff;
          border-radius: 5px;
          > div {
            + div {
              border-top: solid 1px #eeeeee;
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
            background-color: rgba(249, 110, 61, 1);
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
