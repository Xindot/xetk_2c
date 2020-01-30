<template>
  <div class="view-about">
    <div class="main">
      <div>
        <img v-for="(el,index) in img.img_abouts" :key="index" :src="el" alt srcset />
      </div>
    </div>
  </div>
</template>

<script>
import { img_abouts } from "@/utils/icons";
// console.log(img_abouts);
export default {
  data() {
    return {
      img: { img_abouts }
    };
  }
};
</script>

<style lang="scss" scoped>
.view-about {
  .main {
    > div {
      font-size: 0;
      img {
        width: 100%;
      }
    }
  }
}
</style>
