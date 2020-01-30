<template>
  <div class="view-footer">
    <div class="main">
      <div class="content">
        <span>© 2019-{{year}} 小鹅题库 xetk.com 版权所有</span>
        <span>
          <a href="http://www.beian.miit.gov.cn" target="_blank">{{bah}}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      bah: "浙ICP备19019698号"
    };
  }
};
</script>

<style lang="scss" scoped>
.view-footer {
  .main {
    .content {
      width: 100%;
      text-align: center;
      color: #333;
      padding: 10px 0;
      font-size: 14px;
      opacity: 0.8;
      > span {
        padding: 0 5px;
      }
      a {
        color: #333 !important;
        text-decoration: none;
      }
    }
  }
}
</style>
