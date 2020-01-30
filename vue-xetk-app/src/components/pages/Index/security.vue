<template>
  <div class="view-security">
    <div class="main">
      <div>
        <img :src="img.img_security" alt srcset />
      </div>
    </div>
  </div>
</template>

<script>
import { img_security } from "@/utils/icons";
export default {
  data() {
    return {
      img: { img_security }
    };
  }
};
</script>

<style lang="scss" scoped>
.view-security {
  .main {
    > div {
      padding: 15px;
      box-sizing: border-box;
      font-size: 0;
      img {
        width: 100%;
      }
    }
  }
}
</style>
