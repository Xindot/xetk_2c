<template>
  <div class="view-lawbreaking">
    <div class="main">
      <div>
        <div class="law-list">
          <div v-for="(el,index) in list" :key="index">
            <span class="handled" :class="'s-'+el.handled">{{['未处理','已完成'][el.handled]}}</span>
            <p class="p-1">
              <span>{{el.area}}</span>
            </p>
            <p class="p-2">
              <span>{{el.date}}</span>
            </p>
            <p class="p-3">
              <span>{{el.act}}</span>
            </p>
            <p class="p-4">
              <span>罚款{{el.money}}元</span>
              <span>扣{{el.fen}}分</span>
            </p>
          </div>
        </div>
        <div class="list-no" v-if="!list||(list&&list.length==0)">
          <div v-show="listApiStatus==2">
            <img :src="icons.i_order_list_no" alt />
            <p>暂无违章信息</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_order_list_no } from "@/utils/icons";

import { api_car_lawbreaking } from "@/api/oilMan";
export default {
  data() {
    return {
      icons: { i_order_list_no },
      info: {},
      list: [],
      listApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listApiStatus = 1;
      api_car_lawbreaking().then(res => {
        // console.log(res);
        this.listApiStatus = 2;
        if (res.code == 0) {
          const rs = res.data || null;
          this.list = (rs && rs.lists) || [];
        } else {
          alert(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-lawbreaking {
  .main {
    > div {
      .law-list {
        padding: 0 15px;
        box-sizing: border-box;
        > div {
          background-color: #ffffff;
          margin-top: 15px;
          border-radius: 5px;
          box-sizing: border-box;
          text-align: left;
          font-size: 14px;
          color: #acacac;
          position: relative;
          .handled {
            position: absolute;
            right: 0;
            top: 15px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            width: 50px;
            background-image: $background-image-to-right;
            color: #ffffff;
            font-size: 12px;
            border-radius: 50px 0 0 50px;
            &.s-1 {
              background-image: $background-image-to-right-4;
            }
          }
          p {
            line-height: 1.8;
            padding: 0 20px;
            box-sizing: border-box;
            &.p-1 {
              font-size: 15px;
              color: #333333;
              padding-top: 10px;
              box-sizing: border-box;
              max-width: 85%;
            }
            &.p-4 {
              font-size: 15px;
              color: #e11111;
              border-top: solid 1px #eeeeee;
              margin-top: 10px;
              padding: 10px 20px;
              box-sizing: border-box;
            }
          }
        }
      }
      .list-no {
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
    }
  }
}
</style>
