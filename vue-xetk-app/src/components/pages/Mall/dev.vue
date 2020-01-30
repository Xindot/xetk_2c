<template>
  <div class="view-mall">
    <div class="main">
      <div>
        <div class="welcome">
          <p class="p-1">
            <img :src="icons.i_mall_welcome" alt="">
          </p>
          <p class="p-2">
            <span>精美商品即将来袭，敬请期待</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_mall_welcome } from "@/utils/icons";
export default {
  data() {
    return {
      icons: { i_mall_welcome }
    };
  }
};
</script>

<style lang="scss" scoped>
.view-mall {
  .main {
    > div {
      position: relative;
      .welcome {
        position: relative;
        margin-top: 20%;
        p {
          &.p-1 {
            img {
              width: 200px;
            }
          }
          &.p-2 {
            margin-top: 40px;
            span {
              font-size: 15px;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
</style>
