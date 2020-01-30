<template>
  <div class="view-oilCard">
    <div class="main">
      <div>
        <div class="list">
          <div v-for="(el,index) in list" :key="index">
            <p class="p-1">
              <img :src="oilCardIcon[el.type]" alt />
            </p>
            <p class="p-2">
              <span>{{el.card_no}}</span>
              <img :src="icons.i_delete_w" alt @click="removeBindIt(el)" />
            </p>
          </div>
        </div>
        <div class="list-no" v-if="!list||(list&&list.length==0)">
          <div v-show="listApiStatus==2">
            <img :src="icons.i_order_list_no" alt />
            <p>暂无油卡</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  i_delete_w,
  i_oil_cnpc_w,
  i_oil_sinopec_w,
  i_order_list_no
} from "@/utils/icons";
import { api_user_oilCard, api_oil_removeBind } from "@/api/oilMan";
export default {
  components: {},
  data() {
    return {
      icons: { i_oil_cnpc_w, i_oil_sinopec_w, i_delete_w, i_order_list_no },
      oilCardIcon: [null, i_oil_sinopec_w, i_oil_cnpc_w], // 油卡类型(1中石化，2中石油)
      list: [],
      listApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    // console.log('created()')
    this.$parent.setHeader({
      rightEvent: () => {
        this.$router.push(this.routesMatch["addOilCard"]);
      }
    });
    const token = window.localStorage.getItem("token") || "";
    if (token) {
      this.getList();
    }
  },
  mounted() {},
  methods: {
    getList() {
      this.listApiStatus = 1;
      api_user_oilCard().then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.list = res.data;
        }
        this.listApiStatus = 2;
      });
    },
    removeBindIt(el) {
      window.showModal({
        title: "确定解绑?",
        success: res => {
          // console.log(res)
          if (res.confirm) {
            api_oil_removeBind({ old_card_id: el.id }).then(res => {
              if (res.code == 0) {
                alert("解绑成功");
                this.getList();
              } else {
                alert(res.msg || "解绑失败");
              }
            });
          }
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
      padding: 15px;
      .list {
        > div {
          text-align: left;
          padding: 15px;
          color: #ffffff;
          border-radius: 5px;
          overflow: hidden;
          background-image: $background-image-to-right;
          + div {
            margin-top: 15px;
          }
          p {
            &.p-1 {
              img {
                width: 65px;
              }
            }
            &.p-2 {
              position: relative;
              img {
                width: 24px;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
              }
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
