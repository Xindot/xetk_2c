<template>
  <div id="app">
    <cHeader class="header" />
    <router-view class="router-view" />
    <cFooter/>
  </div>
</template>

<script>
import cHeader from "@/components/common/header";
import cFooter from "@/components/common/footer";
export default {
  name: "app",
  components: {
    cHeader,
    cFooter
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
$input-placeholder-color: #aaaaaa;

html,
body,
p,
h1,
h3,
h4,
h6 {
  margin: 0;
  padding: 0;
}
body {
  background-color: #eeeeee;
  font-size: 14px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header,
.router-view {
  margin: auto;
  .width-1 {
    margin: auto;
    @media (min-width: 600px) {
      width: 480px;
    }
    @media (min-width: 768px) {
      width: 750px;
    }
    @media (min-width: 992px) {
      width: 970px;
    }
    @media (min-width: 1200px) {
      width: 1180px;
    }
  }
}

//
input,
button,
select,
textarea {
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  border: none;
}

// input placeholder
::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: $input-placeholder-color;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: $input-placeholder-color;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: $input-placeholder-color;
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: $input-placeholder-color;
}

.skewX-5deg {
  transform: skewX(-5deg);
  -ms-transform: skewX(-5deg);
  -moz-transform: skewX(-5deg);
  -webkit-transform: skewX(-5deg);
  -o-transform: skewX(-5deg);
}

.el-checkbox__input + .el-checkbox__label {
  padding-left: 5px;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0f9982;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0f9982;
  border-color: #0f9982;
}

.v-tips {
  color: #f56c6c;
  line-height: 1rem;
  font-size: 12px;
  padding: 2px;
  text-align: left;
}

pre {
  margin: 0;
  padding: 0;
  font-size: 0;
  code {
    font-size: 14px !important;
    padding: 15px 5px 15px 5px !important;
    box-sizing: border-box;
    font-family: consolas, Menlo, "PingFang SC", "Microsoft YaHei", monospace;
    border-radius: 4px;
    > span {
      &:first-child {
        margin-left: 10px;
      }
    }
  }
}

// 修改选中的颜色
// ::selection {
//   background: #000000;
//   color: #000;
//   color: #fff;
// }
// ::-moz-selection {
//   background: #000000;
//   color: #000;
//   color: #fff;
// } /*火狐浏览器*/
// ::-webkit-selection {
//   background: #000000;
//   color: #000;
//   color: #fff;
// } /*谷歌*/
.hljs {
  padding: 0;
  .hljs-ln td {
    padding: 2px 10px;
    &.hljs-ln-numbers {
      text-align: center;
      color: rgba(119, 119, 119, 0.8);
      border-right: 0.5px solid rgba(119, 119, 119, 0.5);
      vertical-align: top;
    }
    &.hljs-ln-code {
      padding-left: 15px;
    }
  }
}

.xe-pre-code {
  position: relative;
  &:hover {
    .copy-code {
      opacity: 1;
      visibility: visible;
    }
  }
  .copy-code {
    position: absolute;
    top: 7.5px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 24px;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    border: none;
    border-radius: 6px;
    color: #ccc;
    background-color: hsla(0, 0%, 90.2%, 0.2);
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.25);
    opacity: 0;
    visibility: hidden;
    user-select: none;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    z-index: 1;
    .anticon {
      display: inline-block;
      color: inherit;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}

.el-message {
  min-width: 220px;
  &.el-message--success {
    background-color: #ffffff;
    border-color: #e5e5e5;
    .el-message__content {
      color: #000000;
    }
  }
  .el-icon-success {
    color: #109982;
  }
}

.float-left {
  float: left;
}
.float-right {
  float: right;
}
/* 伪类清除浮动 开始 */
.clear-float::after {
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}
.clear-float {
  zoom: 1;
}
/* 伪类清除浮动 结束 */

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #1d1d1d;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1d1d1d;
  color: #fff;
}

.el-collapse {
  .el-collapse-item {
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
      color: #109982;
      > i {
        font-size: 16px;
        margin-right: 5px;
      }
    }
    .el-collapse-item__wrap {
      padding: 0 5px;
      box-sizing: border-box;
      background-color: #f5f5f5;
      .el-collapse-item__content {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
