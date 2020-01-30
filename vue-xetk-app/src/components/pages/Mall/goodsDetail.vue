<template>
  <div class="view-goods-detail">
    <div class="main">
      <div class="banner-1" v-if="gDetail&&gDetail.banner&&gDetail.banner.length">
        <mt-swipe :auto="0" :show-indicators="gDetail.banner&&gDetail.banner.length>1" :style="'height:'+(w_width*0.8)+'px;'">
          <mt-swipe-item v-for="(el,index) in gDetail.banner" :key="index">
            <img :src="el" alt />
          </mt-swipe-item>
        </mt-swipe>
        <div class="desc">
          <p class="p-title">{{gDetail.goods_name}}</p>
          <p class="p-price">
            <span class="s-1">￥{{gDetail.sell_price}}</span>
            <span class="s-2">￥{{gDetail.original_pirce}}</span>
          </p>
        </div>
      </div>
      <div class="select-1" @click="goSelectSpecs">
        <p>请选择规格数量</p>
      </div>
      <div class="detail-1">
        <p class="p-t">商品详情图</p>
        <div>
          <p v-for="(el,index) in gDetail.detail" :key="index">
            <img v-lazy="el" />
          </p>
        </div>
      </div>
    </div>
    <div class="select-1-more" v-if="selectSpecs.visible">
      <mt-popup v-model="selectSpecs.visible" position="bottom" :style="'max-width:'+pageMaxWidth+'px;'">
        <img :src="icons.i_clear" alt class="close-btn" @click="selectSpecs.visible=false" />
        <div class="specs">
          <div class="c-1">
            <img :src="gDetail.image" alt />
            <div>
              <p class="p-1">￥{{selectedSkuOne.sku_price||gDetail.sell_price}}</p>
              <p class="p-2">(库存{{gDetail.store_num}})</p>
              <p class="p-3">已选: {{selectedSkuOne.sku_name}}</p>
            </div>
          </div>
          <p class="p-1">
            <span>规格</span>
            <br />
            <span v-for="(el,index) in gDetail.sku" :key="index" class="sku" :class="{'selected':index==selectedSkuIdx}" @click="selectOneSku(el,index)">{{el.sku_name}}</span>
            <span class="no-sku" v-if="gDetail.sku.length==0">该产品为标准产品，暂无规格</span>
          </p>
          <p class="p-2">
            <span>购买数量</span>
            <span class="s-num float-right clear-float">
              <img :src="icons.i_mall_btn_minus" alt @click="changeGoodsNum(-1)" :style="paySubmitForm.goods_num<=1?'opacity:.5':''" />
              <span>{{paySubmitForm.goods_num}}</span>
              <img :src="icons.i_mall_btn_plus" alt @click="changeGoodsNum(1)" :style="paySubmitForm.goods_num>=99?'opacity:.5':''" />
            </span>
          </p>
        </div>
        <div class="btn" @click="buyNowItOk">
          <span>确定</span>
        </div>
      </mt-popup>
    </div>
    <div class="btn fixed-bottom" @click="buyNowIt">
      <img :src="icons.i_mall_btn_buy" alt />
    </div>
  </div>
</template>

<script>
import { pageMaxWidth } from "@/utils/const";
import { api_shop_detail } from "@/api/oilMan";
import {
  i_mall_btn_buy,
  i_mall_btn_plus,
  i_mall_btn_minus,
  i_clear
} from "@/utils/icons";
export default {
  data() {
    return {
      icons: {
        i_mall_btn_buy,
        i_mall_btn_plus,
        i_mall_btn_minus,
        i_clear
      },
      pageMaxWidth,
      w_width:
        window.innerWidth > pageMaxWidth ? pageMaxWidth : window.innerWidth,
      gid: "",
      gDetail: {
        banner: []
      },
      selectSpecs: {
        visible: false
      },
      selectedSkuOne: {},
      selectedSkuIdx: -1,
      paySubmitForm: {
        address_id: "",
        goods_id: "",
        sku_id: "",
        goods_num: 1,
        coupon_id: "",
        pay_type: "",
        openid: ""
      }
    };
  },
  created() {
    this._GD_.goodsDetailBack = true;
    // console.log(this.$route);
    this.gid = Number(this.$route.params.pathMatch || 0);
    if (this.gid > 0) {
      this.paySubmitForm.goods_id = this.gid;
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      const f = {
        id: this.gid
      };
      api_shop_detail(f).then(res => {
        if (res.code == 0) {
          this.gDetail = res.data || {};
        } else {
          alert(res.msg);
        }
      });
    },
    goSelectSpecs() {
      this.selectSpecs.visible = true;
    },
    changeGoodsNum(num) {
      this.paySubmitForm.goods_num += Number(num);
      if (this.paySubmitForm.goods_num < 1) {
        this.paySubmitForm.goods_num = 1;
      }
      if (this.paySubmitForm.goods_num > 99) {
        this.paySubmitForm.goods_num = 99;
      }
    },
    selectOneSku(el, index) {
      this.selectedSkuOne = el;
      this.selectedSkuIdx = index;
      this.paySubmitForm.sku_id = el.id;
    },
    buyNowIt() {
      const sku = this.gDetail.sku || [];
      if (sku.length > 0) {
        this.selectSpecs.visible = true;
        return;
      }
      this.buyNowItOk();
    },
    buyNowItOk() {
      const sku = this.gDetail.sku || [];
      const f = this.paySubmitForm;
      if (sku.length > 0 && !f.sku_id) {
        alert("请先选择规格");
        return;
      }
      let sku_name = "标准";
      let sku_price = this.gDetail.sell_price;
      if (f.sku_id) {
        sku_name = this.selectedSkuOne.sku_name;
        sku_price = this.selectedSkuOne.sku_price;
      }
      const orderGoodsInfo = {
        image: this.gDetail.image,
        goods_name: this.gDetail.goods_name,
        sku_name,
        sku_price,
        paySubmitForm: f
      };
      window.localStorage.setItem(
        "goodsDetail:orderGoodsInfo",
        JSON.stringify(orderGoodsInfo)
      );
      this.$router.push(this.routesMatch["mallCreateOrder"]);
    }
  }
};
</script>


<style lang="scss" scoped>
.view-goods-detail {
  .main {
    .banner-1 {
      margin-top: -44px;
      background-color: #ffffff;
      .desc {
        padding: 20px 15px 10px;
        p {
          text-align: left;
          &.p-title {
            font-size: 16px;
            color: #333333;
          }
          &.p-price {
            margin-top: 10px;
            .s-1 {
              color: #e11111;
              font-size: 18px;
            }
            .s-2 {
              margin-left: 10px;
              color: #acacac;
              font-size: 15px;
              text-decoration: line-through;
            }
          }
        }
      }
    }
    .select-1 {
      margin-top: 10px;
      p {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: #333333;
        background-color: #ffffff;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
    .detail-1 {
      margin-top: 10px;
      .p-t {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        color: #333333;
        background-color: #ffffff;
      }
      > div {
        p {
          font-size: 0;
          img[lazy="loaded"] {
            width: 100%;
          }
          img[lazy="loading"] {
            width: 40px;
            height: 300px;
            margin: auto;
          }
        }
      }
    }
  }
  .select-1-more {
    .mint-popup {
      width: 100%;
      border-radius: 10px 10px 0 0;
      img.close-btn {
        position: absolute;
        right: 5px;
        width: 25px;
        top: 5px;
        z-index: 111;
      }
      .specs {
        padding: 15px;
        box-sizing: border-box;
        text-align: left;
        .c-1 {
          position: relative;
          font-size: 0;
          img {
            width: 100px;
            height: 100px;
            border: solid 1px #eeeeee;
          }
          > div {
            width: calc(100% - 100px);
            position: absolute;
            bottom: 0;
            left: 100px;
            padding: 0 20px;
            box-sizing: border-box;
            p {
              &.p-1 {
                color: #e11111;
                font-size: 18px;
              }
              &.p-2 {
                color: #acacac;
                font-size: 10px;
                margin-bottom: 5px;
              }
              &.p-3 {
                font-size: 12px;
                color: #333333;
              }
            }
          }
        }
        > p {
          padding: 15px 0;
          box-sizing: border-box;
          &.p-1 {
            .no-sku {
              color: #d5d5d5;
              font-size: 12px;
            }
            .sku {
              font-size: 12px;
              color: #ffffff;
              background-color: #d5d5d5;
              padding: 2px 8px;
              border-radius: 3px;
              + .sku {
                margin-left: 10px;
              }
              &.selected {
                background-image: $background-image-to-left-5;
              }
            }
          }
          &.p-2 {
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
                background-color: #ffffff;
                padding: 0 8px;
                height: 21px;
                line-height: 21px;
                display: inline-block;
              }
            }
          }
        }
      }
      .btn {
        height: 50px;
        line-height: 50px;
        background-image: $background-image-to-left-5;
        font-size: 18px;
        color: #ffffff;
      }
    }
  }
  .btn {
    bottom: 0;
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.view-goods-detail {
  .main {
    .banner-1 {
      // mint-ui 轮播图
      .mint-swipe {
        .mint-swipe-items-wrap {
          .mint-swipe-item {
            img {
              width: 100%;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        .mint-swipe-indicators {
          .mint-swipe-indicator {
            &.is-active {
              opacity: 0.8;
              padding: 0 3px;
              border-radius: $semi-circle-border-radius;
            }
          }
        }
      }
      //
    }
  }
}
</style>