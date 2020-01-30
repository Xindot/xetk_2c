<template>
  <div class="header"
       :class="{'white':fdata.white,'relative':fdata.relative}"
       :style="'background-color:'+fdata.backgroundColor+';'">
    <div v-if="fdata">
      <!-- left 默认图标 -->
      <div class="left"
           @click="fdata.leftEvent?fdata.leftEvent():leftEvent()">
        <div>
          <span v-if="fdata.leftType=='text'">{{fdata.leftValue}}</span>
          <img v-else-if="fdata.white"
               :src="icons.i_arrow_w "
               alt />
          <img v-else-if="fdata.white_1"
               :src="icons.i_arrow_w_1 "
               alt
               class="w-1" />
          <img v-else
               :src="icons.i_arrow_b"
               alt />
        </div>
      </div>
      <!-- center 默认文本 -->
      <div class="center">
        <div>
          <img v-if="fdata.centerType=='icon'"
               :src="fdata.centerValue"
               alt />
          <span v-else-if="fdata.centerValue">{{fdata.centerValue}}</span>
          <span v-if="fdata.centerTabs"></span>
        </div>
      </div>
      <!-- right 默认文本 -->
      <div class="right"
           @click="fdata.rightEvent&&fdata.rightEvent()">
        <div>
          <img v-if="fdata.rightType=='icon'"
               :src="fdata.rightValue"
               alt />
          <span v-else
                :style="'color:'+fdata.rightColor||''+';'">{{fdata.rightValue}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_arrow_b, i_arrow_w, i_arrow_w_1 } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_arrow_b, i_arrow_w, i_arrow_w_1 }
    };
  },
  props: ["fdata"],
  methods: {
    leftEvent() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  z-index: 111;
  height: 44px;
  background-color: rgba(255, 255, 255, 1);
  color: $default-color;
  transition: background-color 0.3s;
  &.relative {
    position: relative;
  }
  &.white {
    color: #ffffff;
  }
  > div {
    height: 100%;
    > div {
      display: inline-block;
      height: 100%;
      vertical-align: top;
      position: relative;
      > div {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 15px;
        box-sizing: border-box;
        font-size: 0;
      }
      &.left {
        width: 20%;
        text-align: left;
        > div {
          img {
            width: 13.5px;
            height: 13.5px;
            transform: rotate(-135deg);
            margin-left: 10px;
            &.w-1 {
              width: 25px;
              height: 25px;
              margin-left: 2px;
            }
          }
        }
      }
      &.center {
        width: 60%;
        > div {
          font-size: 18px;
          font-weight: 500;
        }
      }
      &.right {
        width: 20%;
        text-align: right;
        > div {
          img {
            height: 27px;
          }
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
