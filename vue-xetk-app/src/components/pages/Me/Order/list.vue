<template>
  <div class="view-orderList">
    <div class="main">
      <div v-infinite-scroll="loadMoreFn" :infinite-scroll-disabled="loadMore.loading">
        <div class="status-list fixed-top" ref="statusList">
          <div>
            <div v-for="(el,index) in statusNameCommone" :key="index" :class="{'selected':index==statusSelectedIdx}" @click="selectOrderStatus(el,index)">
              <span>{{el.value}}</span>
            </div>
          </div>
        </div>
        <div v-if="['oil','phone'].includes(pathMatch)" class="order-list">
          <div v-for="(el,index) in list" :key="index" class="recharge">
            <p class="p-1">
              <span class="s-left" :class="'status-'+el.status">{{el.status_text}}</span>
              <span class="s-title">{{el.title}}</span>
              <span class="s-right" :class="{'have-delete':el.status==-1}">
                <span>￥{{el.amount}}</span>
                <img v-if="el.status==-1" :src="icons.i_delete_b" alt @click="deleteRechargeOrder(el)" />
              </span>
            </p>
            <p class="p-2" @click="goOrderDetailPage(el)">
              <span class="s-date">{{el.order_time}}</span>
              <img class="right-arrow" :src="icons.i_arrow_b" alt />
            </p>
          </div>
        </div>
        <div v-if="pathMatch=='mall'" class="order-list">
          <div v-for="(el,index) in list" :key="index" class="mall">
            <p class="m-1">
              <span class="s-1">订单状态：</span>
              <span class="s-2">{{el.order_status_name}}</span>
            </p>
            <div class="m-2" @click="goOrderDetailPage(el)">
              <div class="left">
                <img :src="el.goods.image" alt />
              </div>
              <div class="right" :class="el.order_type">
                <p class="p-1">
                  <span v-if="el.order_type=='oil_card'">卡号：</span>
                  <span>{{el.goods.goods_name}}</span>
                </p>
                <p class="p-2">
                  <span v-if="el.order_type=='goods'">规格: {{el.goods.sku_name}}</span>
                  <span v-if="el.order_type=='oil_card'">类型: {{el.goods.oilcard_type}}</span>
                </p>
                <p class="p-3">
                  <template v-if="el.order_type=='goods'">
                    <span class="s-2">￥{{el.goods.sku_price_f0}}</span>
                    <br />
                    <span class="s-1">x{{el.goods.num}}</span>
                  </template>
                  <template v-if="el.order_type=='oil_card'">
                    <span class="s-1">x{{el.goods.num}}</span>
                    <span class="s-2">￥{{el.goods.sku_price_f0}}</span>
                  </template>
                </p>
              </div>
            </div>
            <div class="m-2-1">
              <span>下单时间: {{el.order_time}}</span>
              <span class="r float-right clear-cloat">合计: {{el.order_amount}}</span>
            </div>
            <div class="order-status-operate">
              <p v-if="el.order_status==0">
                <span @click="cancelMallOrder(el)">取消</span>
                <span class="red" @click="payMallOrder(el)">去支付</span>
              </p>
              <p v-if="el.order_status==1||el.order_status==2">
                <span @click="viewMall56Info(el)">查看物流</span>
                <span class="red" @click="confirmReceipt(el)">确认收货</span>
              </p>
              <p v-if="el.order_status==3">
                <span @click="viewMall56Info(el)">查看物流</span>
                <span class="red" @click="mallOrderAgain(el)">再次购买</span>
              </p>
              <p v-if="el.order_status==-1">
                <span @click="delMallOrder(el)">删除订单</span>
              </p>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="d-list-no" v-if="!list||(list&&list.length==0)">
          <div v-show="listApiStatus==2">
            <img :src="icons.i_order_list_no" alt />
            <p>暂无订单信息</p>
          </div>
        </div>
        <!--  -->
        <div class="load-more">
          <div v-if="loadMore.loading">
            <img class="icon" :src="loadMore.icon" alt />
            <span>加载中...</span>
          </div>
          <div v-if="!loadMore.loading && list_count>0">
            <span>没有更多了~</span>
          </div>
        </div>
        <!--  -->
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
import {
  i_arrow_b,
  i_delete_b,
  i_order_list_no,
  i_oil_sinopec_card,
  i_oil_cnpc_card,
  i_wechat_pay,
  i_spinner_preloader
} from "@/utils/icons";
import {
  api_recharge_orderList,
  api_recharge_close,
  api_shop_orderList,
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
      pathMatch: "",
      icons: {
        i_arrow_b,
        i_delete_b,
        i_order_list_no,
        i_oil_sinopec_card,
        i_oil_cnpc_card
      },
      statusNameCommone: [],
      statusName: [],
      statusNames: [
        [
          { key: "all", value: "全部" },
          { key: "0", value: "待支付" },
          { key: "1", value: "进行中" },
          { key: "3", value: "已完成" },
          { key: "7", value: "已退款" },
          { key: "-1", value: "已取消" }
        ],
        [
          { key: "all", value: "全部" },
          { key: "0", value: "待支付" },
          { key: "1", value: "待发货" },
          { key: "2", value: "待收货" },
          { key: "3", value: "已完成" },
          { key: "-1", value: "已取消" }
        ]
      ],
      statusSelectedIdx: 0,
      list_count: 0,
      list: [],
      listFilter: {
        page: 1,
        limit: 10,
        type: "oil_recharge", // oil_recharge,mobile_recharge
        status: "all" // all全部,0待支付,1进行中,3已完成,7已退款,-1取消
        // mall status // all默认全部订单(-1已取消,0待支付,1已付款,2待收货,3交易完成)
      },
      listApiStatus: 0, // 0未请求 1请求中 2请求结束
      mall_orderDetail: {
        detail: {}
      },
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
      payApiStatus: 0, // 0未请求 1请求中 2请求结束
      loadMore: {
        icon: i_spinner_preloader,
        loading: false
      }
    };
  },
  created() {
    this.pathMatch = this.$route.params.pathMatch || "";
    this.statusNameCommone = this.statusNames[0];
    let title = "油卡订单";
    let type = "oil_recharge";
    if (this.pathMatch == "phone") {
      title = "话费订单";
      type = "mobile_recharge";
    }
    if (this.pathMatch == "mall") {
      title = "商城订单";
      this.statusNameCommone = this.statusNames[1];
    }
    this.$parent.setHeader({
      centerValue: title
    });
    this.listFilter.type = type;
    this.getList();
  },
  methods: {
    getList() {
      this.listApiStatus = 1;
      this.list = [];
      this.list_count = 0;
      if (this.pathMatch == "mall") {
        delete this.listFilter.type;
        api_shop_orderList(this.listFilter).then(res => {
          if (res.code == 0) {
            const list = (res.data && res.data.data) || [];
            for (let i = 0; i < list.length; i++) {
              const n = list[i];
              n.goods.sku_price_f0 = Number(n.goods.sku_price).toFixed(0);
            }
            this.list = list;
            this.list_count = (res.data && res.data.count) || 0;
          } else {
            alert(res.msg);
          }
          this.listApiStatus = 2;
        });
      } else {
        api_recharge_orderList(this.listFilter).then(res => {
          // console.log(res)
          if (res.code == 0) {
            this.list = res.data.data || [];
          } else {
            alert(res.msg);
          }
          this.listApiStatus = 2;
        });
      }
    },
    // 加载更多
    loadMoreFn() {
      if (this.loadMore.loading) {
        return;
      }
      if (this.list.length < this.list_count) {
        // console.log("loadMore");
        this.loadMore.loading = true;
        this.listFilter.page += 1;
        api_shop_orderList(this.listFilter).then(res => {
          // console.log(res);
          if (res.code == 0) {
            const list = (res.data && res.data.data) || [];
            for (let i = 0; i < list.length; i++) {
              const n = list[i];
              n.goods.sku_price_f0 = Number(n.goods.sku_price).toFixed(0);
            }
            this.list = [...this.list, ...list];
          } else {
            alert(res.msg);
          }
          this.loadMore.loading = false;
        });
      }
    },
    // 去订单详情页面
    goOrderDetailPage(el) {
      if (!el.id) {
        return;
      }
      let path = "";
      if (["oil", "phone", "mall"].includes(this.pathMatch)) {
        path = `${this.pathMatch}OrderDetail`;
      }
      if (!path) {
        return;
      }
      this.$router.push(`${this.routesMatch[path]}_${el.id}`);
    },
    // 选择订单状态
    selectOrderStatus(el, index) {
      this.statusSelectedIdx = index;
      this.listFilter.status = el.key;
      this.listFilter.page = 1;
      this.getList();
      if (index >= 3) {
        this.$refs.statusList.scrollTo({
          left: window.innerWidth,
          behavior: "smooth"
        });
      } else {
        this.$refs.statusList.scrollTo({ left: 0, behavior: "smooth" });
      }
    },
    // 删除充值订单
    deleteRechargeOrder(el) {
      if (!el.id) {
        return;
      }
      confirm("确定删除此订单?", ok => {
        if (ok) {
          const f = {
            order_id: el.id,
            channel: this.listFilter.type, //oil_recharge,mobile_recharge
            type: "delete" // delete删除,close取消
          };
          api_recharge_close(f).then(res => {
            // console.log(res)
            if (res.code == 0) {
              alert("订单删除成功");
              this.getList();
            } else {
              alert(res.msg);
            }
          });
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
              this.getList();
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
              this.getList();
            } else {
              alert(res.msg);
            }
          });
        }
      });
    },
    // 再次购买
    mallOrderAgain(el) {
      const gid = (el.goods && el.goods.goods_id) || "";
      // alert(gid);
      if (gid) {
        this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${gid}`);
      } else {
        alert("商品id获取错误");
      }
    },
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
              this.getList();
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
      this.mall_orderDetail = el;
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
    // 选择支付方式
    selectPayWay(el) {
      if (this.payApiStatus == 1) {
        return;
      }
      this.paySubmitForm.pay_type = el.key;
      // console.log(this.paySubmitForm)
      // alert(el.text)
      const f = this.paySubmitForm;
      const amount = Number(this.mall_orderDetail.order_amount).toFixed(2);
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
.view-orderList {
  .main {
    > div {
      padding-top: 40px;
      .status-list {
        line-height: 40px;
        background-color: #ffffff;
        text-align: left;
        width: 100%;
        white-space: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        &.fixed-top {
          top: 44px;
        }
        &::-webkit-scrollbar {
          display: none; /* 隐藏滚动条 */
        }
        > div {
          > div {
            font-size: 13px;
            color: #777777;
            &.selected {
              border-bottom: solid 2px #333333;
              font-size: 15px;
              color: $default-color;
            }
            display: inline-block;
            width: 20%;
            text-align: center;
          }
        }
      }
      .order-list {
        padding: 10px 15px;
        padding-bottom: 0;
        > div {
          background-color: #ffffff;
          text-align: left;
          border-radius: 5px;
          font-size: $default-font-size;
          color: $default-color;
          + div {
            margin-top: 10px;
          }
          &.recharge {
            .p-1 {
              padding: 8px 0;
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
              .s-right {
                color: #e11111;
                float: right;
                position: relative;
                &.have-delete {
                  span {
                    margin-right: 40px;
                  }
                }
                span {
                  margin-right: 15px;
                }
                img {
                  height: 24px;
                  vertical-align: middle;
                  position: absolute;
                  padding: 5px 5px 5px 10px;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                }
              }
            }
            .p-2 {
              padding: 15px 10px;
              border-top: solid 1px #eeeeee;
              font-size: 12px;
              color: #777777;
              position: relative;
              img {
                &.right-arrow {
                  height: 8px;
                  width: 8px;
                  position: absolute;
                  right: 15px;
                  top: 50%;
                  transform: translateY(-50%) rotate(45deg);
                  opacity: $arrow-b-opacity;
                }
              }
            }
          }
          &.mall {
            .m-1 {
              font-size: 14px;
              color: #333333;
              padding: 10px 15px;
              box-sizing: border-box;
              // border-bottom: solid 1px #eeeeee;
              .s-2 {
                color: #e11111;
              }
            }
            .m-2 {
              padding: 10px 15px;
              box-sizing: border-box;
              // border-bottom: solid 1px #eeeeee;
              > div {
                display: inline-block;
                vertical-align: top;
                &.left {
                  width: 25%;
                  font-size: 0;
                  text-align: left;
                  border-radius: 3px;
                  overflow: hidden;
                  img {
                    width: 100%;
                  }
                }
                &.right {
                  width: 75%;
                  padding-left: 10px;
                  box-sizing: border-box;
                  position: relative;
                  &.oil_card {
                    .p-1 {
                      width: 100%;
                    }
                    .p-3 {
                      position: relative;
                    }
                  }
                  .p-1 {
                    font-size: 14px;
                    color: #333333;
                    width: 75%;
                  }
                  .p-2 {
                    font-size: 10px;
                    color: #ababab;
                  }
                  .p-3 {
                    position: absolute;
                    right: 0;
                    top: 0;
                    text-align: right;
                    font-size: 15px;
                    width: 25%;
                    .s-1 {
                      color: #acacac;
                    }
                    .s-2 {
                      color: #333333;
                    }
                  }
                }
              }
            }
            .m-2-1 {
              padding: 0 15px;
              box-sizing: border-box;
              font-size: 10px;
              color: #a9a9a9;
              .r {
                font-size: 12px;
                color: #333333;
              }
            }
            @import "@style/scss/order-status-operate.scss";
            .order-status-operate {
              margin-top: 0;
              margin-bottom: 0;
            }
          }
        }
      }
      .d-list-no {
        text-align: center;
        font-size: 0;
        > div {
          margin-top: 50%;
          transform: translateY(-50%);
          img {
            width: 192px;
            height: 137px;
          }
          p {
            font-size: 14px;
            color: #7b7b7b;
          }
        }
      }
      @import "@style/scss/load-more.scss";
    }
  }
  @import "@style/scss/select-pay.scss";
}
</style>
