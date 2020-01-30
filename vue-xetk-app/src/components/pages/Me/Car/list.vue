<template>
  <div class="view-car">
    <div class="main">
      <div>
        <div class="c-list">
          <div v-for="(el,index) in list" :key="index" :style="'right:'+el.transX+'px;'">
            <div class="info" @touchstart="touchS" @touchend="touchE($event,el)">
              <div class="left">
                <p>
                  <span class="s-1">车辆类型:</span>
                  <span class="s-2">{{el.car_model}}</span>
                </p>
                <p>
                  <span class="s-1">车牌号:</span>
                  <span class="s-2">{{el.plate_number}}</span>
                </p>
                <p>
                  <span class="s-1">车架号:</span>
                  <span class="s-2">{{el.vin}}</span>
                </p>
                <p>
                  <span class="s-1">发送机号:</span>
                  <span class="s-2">{{el.engine_number}}</span>
                </p>
              </div>
              <div class="right">
                <p>
                  <span @click="goLawBreakingPage(el)">违章查询</span>
                </p>
              </div>
            </div>
            <div class="remove" :style="'width:'+el.transX+'px;'" @click.stop="deleteIt(el)">
              <span>删除</span>
            </div>
          </div>
        </div>
        <div class="list-no" v-if="!list||(list&&list.length==0)">
          <div v-if="listApiStatus==2">
            <img :src="icons.i_order_list_no" alt />
            <p>暂无车辆</p>
          </div>
          <div v-if="listApiStatus==0">
            <p>您还没有登录，请登录后再查看</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn fixed-bottom" @click="addCarFn">
      <button>添加车辆</button>
    </div>
  </div>
</template>

<script>
import { i_order_list_no } from "@/utils/icons";
import { api_car_user, api_car_delete } from "@/api/oilMan";
import { browserName, iOS, Android } from "@/utils/const.js";
// console.log(iOS, Android);
export default {
  data() {
    return {
      icons: { i_order_list_no },
      list: [],
      listApiStatus: 0, // 0未请求 1请求中 2请求结束
      touch: {
        startX: null,
        transX: 0,
        width: 60
      }
    };
  },
  created() {
    this.nativeAppInfo = JSON.parse(this.$route.query.nativeAppInfo || null);
  },
  mounted() {
    if (iOS() || Android()) {
      if (this.nativeAppInfo && this.nativeAppInfo.appToken) {
        window.localStorage.setItem("token", this.nativeAppInfo.appToken);
      } else {
        window.localStorage.setItem("token", "");
      }
    }
    const token = window.localStorage.getItem("token");
    if (token) {
      this.getList();
    }
  },
  methods: {
    // 左滑删除
    touchS(e) {
      // console.log(e);
      if (e.touches.length == 1) {
        const et = e.touches[0];
        this.touch.startX = et.clientX;
      }
    },
    touchE(e, el) {
      // console.log(e);
      if (e.changedTouches.length == 1) {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].transX = 0;
        }
        const et = e.changedTouches[0];
        const disX = this.touch.startX - et.clientX;
        const tw = this.touch.width;
        if (disX > tw / 2) {
          el.transX = tw;
        } else {
          el.transX = 0;
        }
      }
    },
    deleteIt(el) {
      // console.log(el);
      confirm("确定删除此车辆?", ok => {
        if (ok) {
          const f = {
            id: el.id
          };
          // console.log(f);
          api_car_delete(f).then(res => {
            if (res.code == 0) {
              alert("删除车辆成功");
              this.getList();
            } else {
              alert(res.msg);
            }
          });
        } else {
          el.transX = 0;
        }
      });
    },
    getList() {
      this.listApiStatus = 1;
      api_car_user().then(res => {
        if (res.code == 0) {
          const list = res.data.car || [];
          if (list && list instanceof Array && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              list[i].transX = 0;
            }
          }
          this.list = list;
        } else {
          alert(res.msg);
        }
        this.listApiStatus = 2;
      });
    },
    addCarFn() {
      const token = window.localStorage.getItem("token") || "";
      if (!token) {
        if (iOS() || Android()) {
          this.$parent.webviewEvent({
            eventName: "router",
            eventData: {
              redirect_type: "app",
              url: "login"
            }
          });
        } else {
          // 登录
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
        }
        return;
      }
      this.$router.push({
        path: this.routesMatch["myCarAdd"]
      });
    },
    goLawBreakingPage() {
      this.$router.push({
        path: this.routesMatch["myCarLaw"]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-car {
  .main {
    > div {
      .c-list {
        margin-top: 10px;
        background-color: #ffffff;
        > div {
          padding: 15px;
          box-sizing: border-box;
          position: relative;
          right: 0;
          transition: right 0.3s;
          + div {
            border-top: solid 1px #eeeeee;
          }
          .info {
            > div {
              display: inline-block;
              vertical-align: middle;
              &.left {
                width: 70%;
                text-align: left;
                font-size: 12px;
                color: #4a4a4a;
                p {
                  line-height: 1.6;
                  .s-1 {
                    display: inline-block;
                    width: 70px;
                  }
                  .s-2 {
                    color: #808080;
                    font-size: 11px;
                  }
                }
              }
              &.right {
                width: 30%;
                text-align: center;
                p {
                  span {
                    display: inline-block;
                    font-size: 14px;
                    color: #e11111;
                    border: solid 1px;
                    height: 20px;
                    padding: 0 6px;
                    border-radius: 3px;
                  }
                }
              }
            }
          }
          .remove {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 100%;
            color: #ffffff;
            background-color: #fe5331;
            font-size: 13px;
            transform: translateX(100%);
            overflow: hidden;
            transition: width 0.3s;
            span {
              display: inline-block;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              word-break: keep-all;
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
    bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    button {
      width: 100%;
      height: 40px;
      line-height: 1;
      background: $background-image-to-left-3;
      border-radius: 50px;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
