<template>
  <div class="view-address">
    <div class="main">
      <div>
        <div class="list">
          <div v-for="(el,index) in list"
               :key="index"
               @click="selectOneAddress(el)">
            <div class="left">
              <div>
                <p class="p-1">
                  <span>{{el.province||''}}</span>
                  <span>{{el.city||''}}</span>
                  <span>{{el.district||''}}</span>
                  <span>{{el.address||''}}</span>
                  <span v-if="el.selected==1"
                        class="s-default">默认</span>
                </p>
                <p class="p-2">
                  <span class="s-1">{{el.username}}</span>
                  <span class="s-2">{{el.phone}}</span>
                </p>
              </div>
            </div>
            <div class="right"
                 @click.stop="editAddress(el)">
              <img :src="icons.i_edit_1"
                   alt />
            </div>
          </div>
        </div>
        <div class="list-no"
             v-if="!list||(list&&list.length==0)">
          <div v-show="listApiStatus==2">
            <img :src="icons.i_order_list_no"
                 alt />
            <p>暂无收货地址</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn fixed-bottom"
         @click="addAddressFn">
      <button>添加新地址</button>
    </div>
  </div>
</template>

<script>
import { i_edit_1, i_order_list_no } from "@/utils/icons";
import { api_address_list } from "@/api/oilMan";
import { browserName } from "@/utils/const.js";
export default {
  data() {
    return {
      token: null,
      pageMode: null,
      icons: {
        i_edit_1,
        i_order_list_no
      },
      list: [],
      listApiStatus: 0 // 0未请求 1请求中 2请求结束
    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || null;
    this.pageMode = this.$route.query.pageMode || null;
    if (this.token) {
      this.getList();
    }
  },
  mounted() {},
  methods: {
    getList() {
      this.listApiStatus = 1;
      api_address_list({ size: 100 }).then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.list = res.data;
        }
        this.listApiStatus = 2;
      });
    },
    selectOneAddress(el) {
      // console.log(this.pageMode,el)
      if (this.pageMode == "select") {
        this._GD_.selectedAddressOBJ = el;
        this.$router.go(-1);
      }
    },
    editAddress(el) {
      if (!this.token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      // console.log('edit',el)
      window.sessionStorage.setItem(
        "MeAddressList:selected",
        JSON.stringify(el)
      );
      this.$router.push({
        path: this.routesMatch["myAddressEdit"]
      });
    },
    addAddressFn() {
      if (!this.token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      window.sessionStorage.removeItem("MeAddressList:selected");
      this.$router.push({
        path: this.routesMatch["myAddressEdit"]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-address {
  .main {
    > div {
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;
      .list {
        > div {
          margin-top: 10px;
          background-color: #ffffff;
          padding: 15px;
          box-sizing: border-box;
          border-radius: 3px;
          > div {
            display: inline-block;
            vertical-align: middle;
            &.left {
              width: 85%;
              text-align: left;
              .p-1 {
                color: #333333;
                .s-default {
                  font-size: 10px;
                  padding: 2px 5px;
                  background-color: red;
                  color: #ffffff;
                  border-radius: 3px;
                  margin-left: 10px;
                  word-break: keep-all;
                }
              }
              .p-2 {
                .s-1 {
                  color: #6d6d6d;
                }
                .s-2 {
                  margin-left: 18px;
                  color: #b2b2b2;
                }
              }
            }
            &.right {
              width: 15%;
              img {
                width: 24px;
                height: 24px;
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
  .btn {
    padding: 0 15px;
    box-sizing: border-box;
    bottom: 10px;
    button {
      width: 100%;
      height: 40px;
      line-height: 1;
      background: $background-image-to-right;
      border-radius: 50px;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
