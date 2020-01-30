<template>
  <div>
    <div class="recharge-plan-list"
         v-if="rechargePlanList">
      <div class="center-view">
        <div class="d-1">
          <p>充值计划-{{rechargePlanList.length}}个月</p>
        </div>
        <div class="d-2">
          <div class="list-head">
            <div>
              <div>序号</div>
              <div>充值时间</div>
              <div>充值金额(元)</div>
            </div>
          </div>
          <div class="list-body">
            <div v-for="(el,index) in rechargePlanList"
                 :key="index">
              <div>{{el.num}}</div>
              <div>{{el.date}}</div>
              <div>{{el.amount}}</div>
            </div>
          </div>
        </div>
        <div class="d-3">
          <img :src="icons.i_close_w"
               alt
               @click="hide" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_close_w } from "@/utils/icons";

export default {
  data() {
    return {
      icons: { i_close_w }
    };
  },
  props: ["rechargePlanList"],
  methods: {
    hide() {
      this.$parent.rechargeDetail.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.recharge-plan-list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: $fixed-max-width;
  margin: auto;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 11111;
  .center-view {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 90%;
    max-width: $fixed-max-width;
    margin: auto;
    transform: translate(-50%, -50%);
    .d-1 {
      line-height: 60px;
      background-image: $background-image-to-right;
      color: #ffffff;
      font-size: 18px;
      border-radius: 5px 5px 0 0;
    }
    .d-2 {
      border-radius: 0 0 5px 5px;
      background-color: #ffffff;
      > div {
        &.list-head {
          > div {
            > div {
              &:last-child {
                color: initial;
              }
            }
          }
        }
        &.list-body {
          max-height: 175px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        > div {
          line-height: 50px;
          color: #333333;
          font-size: 14px;
          &:first-child {
            font-size: 15px;
          }
          > div {
            display: inline-block;
            width: calc(100% / 3);
            &:last-child {
              color: #e11111;
            }
          }
        }
      }
    }
    .d-3 {
      font-size: 0;
      img {
        height: 35px;
        padding: 25px;
      }
    }
  }
}
</style>
