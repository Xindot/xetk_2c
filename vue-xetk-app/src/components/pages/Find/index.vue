<template>
  <div class="view-find">
    <div class="main">
      <div>
        <div class="tab-list">
          <div v-for="(el,index) in tabs" :key="index" @click="goHdPage(el)">
            <img :src="el.img" alt :style="el.clicked?'opacity:.5;':''" />
          </div>
        </div>
        <div class="f-list">
          <div v-for="(el,index) in list" :key="index" @click="goHdPage(el)">
            <p class="p-1">
              <img :src="el.image" alt />
            </p>
            <p class="p-2">
              <span>{{el.title}}</span>
              <img class="float-right clear-float" :src="icons['i_hd_status_'+el.status]" alt />
              <!-- <span class="float-right clear-float">{{el.status_text}}</span> -->
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_hd_status_0, i_hd_status_1 } from "@/utils/icons";
import { api_activity_all, api_discover } from "@/api/oilMan";
export default {
  components: {},
  data() {
    return {
      icons: { i_hd_status_0, i_hd_status_1 },
      tabs: [
        {
          img:
            "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190820/07b71c2523fbc30052f504589cd97e62.png",
          redirect_to: "neargas",
          clicked: false
        },
        {
          img:
            "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190820/261b6cf5e7afe9824e8a34312706971e.png",
          redirect_to: "carviolation",
          clicked: false
        }
      ],
      list: []
    };
  },
  created() {
    // this.getTabs();
    this.getList();
  },
  methods: {
    getTabs() {
      api_discover().then(res => {
        if (res.code == 0) {
          this.tabs = res.data || [];
        }
      });
    },
    getList() {
      api_activity_all().then(res => {
        // console.log(res)
        if (res.code == 0) {
          this.list = res.data.activity || [];
        }
      });
    },
    goHdPage(el) {
      if (el.clicked) {
        return;
      }
      el.clicked = true;
      setTimeout(() => {
        el.clicked = false;
        if (el.redirect_to && this.routesMatch[el.redirect_to]) {
          this.$router.push(this.routesMatch[el.redirect_to]);
        } else {
          alert("敬请期待");
        }
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.view-find {
  .main {
    > div {
      .tab-list {
        background-color: #ffffff;
        padding: 15px;
        font-size: 0;
        > div {
          display: inline-block;
          width: 50%;
          text-align: left;
          &:last-child {
            text-align: right;
          }
          img {
            width: 97.5%;
          }
        }
      }
      .f-list {
        padding: 15px;
        font-size: 15px;
        color: $default-color;
        > div {
          background-color: #ffffff;
          text-align: left;
          border-radius: 5px;
          overflow: hidden;
          + div {
            margin-top: 15px;
          }
          .p-1 {
            font-size: 0;
            position: relative;
            padding-bottom: 40%;
            overflow: hidden;
            img {
              width: 100%;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .p-2 {
            height: $list-one-height;
            padding: 15px 10px 10px;
            box-sizing: border-box;
            > img {
              height: 22px;
            }
            > span {
              &.float-right {
                border: 1px transparent solid;
                border-image: linear-gradient(to right, #ffcb32, #fe8910) 1 10;
                color: #333333;
                padding: 2px 5px;
                margin-top: -3px;
                .status-0 {
                  color: #acacac;
                  border-color: #d3d7dd;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
