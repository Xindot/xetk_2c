<template>
  <div class="view-56">
    <div class="main">
      <div>
        <div class="content">
          <iframe :src="url" id="mobsf" scrolling="no" frameborder="0" style="position:absolute;top:-40px;left: 0;" :style="'width:'+w_width+'px;height:'+(w_height-4)+'px;'" security="restricted" sandbox="allow-same-origin allow-scripts"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      w_width: window.innerWidth,
      w_height: window.innerHeight,
      url: "https://m.kuaidi100.com/app/query/?com=&nu="
    };
  },
  created() {
    const url = decodeURIComponent(this.$route.query.url || "");
    if (url) {
      this.url = url;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.view-56 {
  .main {
    > div {
      .content {
        position: relative;
        iframe {
          max-width: $page-max-width;
        }
      }
    }
  }
}
</style>
