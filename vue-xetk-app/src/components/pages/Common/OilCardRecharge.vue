<template>
  <div v-if="recharge_mel.length>0 || recharge_zhichong.length>0">
    <p class="p-title">
      <span class="s-1"></span>
      <span>油卡充值</span>
    </p>
    <div class="select-recharge">
      <div class="select-0" v-if="recharge_mel.length>0">
        <div class="left" @click="goPage('oilpackage')">
          <img :src="icons.img_recharge_select_0" alt />
        </div>
        <div class="right">
          <div v-for="(el,index) in recharge_mel" :key="index">
            <div>
              <div @click="goPage('oilpackage',el,index)">
                <img v-if="el.tag" :src="el.tag" alt />
                <p class="p-1 ellipsis">{{(Number(el.discount)*10).toFixed(1)}}折</p>
                <p class="p-2 ellipsis">
                  <span>¥{{el.amount}}/月</span>
                  <span class="s-p">|</span>
                  <span>{{el.months}}月</span>
                </p>
                <p class="p-3 ellipsis">立省{{el.save_money}}元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="select-1" v-if="recharge_zhichong.length>0">
        <div class="left" @click="goPage('oildirect')">
          <img :src="icons.img_recharge_select_1" alt />
        </div>
        <div class="right">
          <div v-for="(el,index) in recharge_zhichong" :key="index">
            <div>
              <div @click="goPage('oildirect',el,index)">
                <img v-if="el.tag" :src="el.tag" alt />
                <p class="p-1 ellipsis">{{el.sell_price}}元</p>
                <p class="p-2 ellipsis">
                  <span>折扣价{{el.real_price}}元</span>
                </p>
                <p class="p-3 ellipsis">立省{{el.save_money}}元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { img_recharge_select_0, img_recharge_select_1 } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { img_recharge_select_0, img_recharge_select_1 },
      amount: 500
    };
  },
  props: ["recharge_mel", "recharge_zhichong"],
  methods: {
    goGoodsDetailPage(el) {
      // console.log(el);
      this.$router.push(`${this.routesMatch["mallGoodsDetail"]}_${el.id}`);
    },
    goPage(path, el, index) {
      this.$router.push({
        path: this.routesMatch[path],
        query: {
          srAmount: (el && el.amount) || "",
          srId: (el && el.id) || "",
          srIdx: index || ""
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  &.p-title {
    padding: 0 10px;
    box-sizing: border-box;
    .s-1 {
      display: inline-block;
      width: 4px;
      height: 13px;
      background-image: $background-image-to-bottom;
      border-radius: 3px;
      margin-right: 8px;
    }
    text-align: left;
    font-size: 17px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 3px;
  }
}
.select-recharge {
  padding: 5px 10px;
  padding-right: 12.5px;
  box-sizing: border-box;
  > div {
    + div {
      margin-top: 10px;
    }
    text-align: left;
    &.select-0 {
      > div {
        &.left {
          padding-bottom: 42.5%;
        }
      }
    }
    &.select-1 {
      > div {
        &.left {
          padding-bottom: 19.8%;
        }
        &.right {
          > div {
            > div {
              > div {
                > p {
                  &.p-3 {
                    background-color: #f98e4b;
                  }
                }
              }
            }
          }
        }
      }
    }
    > div {
      display: inline-block;
      vertical-align: top;
      &.left {
        width: 34%;
        font-size: 0;
        position: relative;
        img {
          position: absolute;
          width: 100%;
        }
      }
      &.right {
        width: 66%;
        text-align: right;
        > div {
          vertical-align: top;
          display: inline-block;
          width: 50%;
          padding-left: 10px;
          box-sizing: border-box;
          &:nth-child(3),
          &:nth-child(4) {
            padding-top: 10px;
          }
          > div {
            border: solid 1px #eeeeee;
            border-radius: 5px;
            width: 100%;
            text-align: left;
            padding-bottom: 64%;
            position: relative;
            overflow: hidden;
            > div {
              position: absolute;
              width: 100%;
              height: 100%;
              > img {
                position: absolute;
                right: 0;
                top: 0;
                width: 40px;
              }
              > p {
                width: 100%;
                padding: 0 6px;
                box-sizing: border-box;
                white-space: nowrap;
                &.p-1 {
                  padding: 3px 6px;
                  font-size: 17px;
                  color: #4a4a4a;
                  font-weight: 600;
                  @media screen and (max-width: 350px) {
                    padding: 0 6px;
                    font-size: 14px;
                  }
                }
                &.p-2 {
                  font-size: 12px;
                  color: #a9a9a9;
                  @media screen and (max-width: 350px) {
                    padding: 0 3px;
                  }
                  .s-p {
                    margin: 0 6px;
                    @media screen and (max-width: 350px) {
                      margin: 0 1px;
                    }
                  }
                }
                &.p-3 {
                  position: absolute;
                  bottom: 0;
                  background-color: #fa5a4a;
                  font-size: 10px;
                  color: #ffffff;
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