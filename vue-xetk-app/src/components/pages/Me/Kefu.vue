<template>
  <div class="view-kefu">
    <div class="main">
      <div>
        <div class="k-list">
          <div v-for="(el,index) in list" :key="index">
            <span>{{el.label}}</span>
            <span class="float-right clear-float">
              <a v-if="el.tag=='a'" :href="el.tagValue">{{el.value}}</a>
              <span v-else>{{el.value}}</span>
            </span>
          </div>
        </div>
        <div class="btn">
          <a :href="'tel:'+tel">
            <p>联系客服</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const tel = "400-862-9665";
export default {
  data() {
    return {
      tel,
      list: [
        {
          label: "客服电话",
          value: tel,
          tag: "a",
          tagValue: `tel:${tel}`
        },
        {
          label: "企业邮箱",
          value: "gushitech@163.com"
        },
        {
          label: "工作时间",
          value: "工作日 09:00-18:00"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.view-kefu {
  .main {
    > div {
      padding: 15px;
      text-align: left;
      box-sizing: border-box;
      .k-list {
        background-color: #ffffff;
        border-radius: 10px;
        padding: 15px 20px;
        box-sizing: border-box;
        > div {
          font-size: $default-font-size;
          color: $default-color;
          line-height: 30px;
          font-weight: 500;
          padding: 15px 0 5px 0;
          > a {
            color: #2372fc;
          }
          + div {
            border-top: solid 1px $border-color;
          }
          .float-right {
            color: #acacac;
          }
        }
      }
      .btn {
        text-align: center;
        padding: 25px;
        box-sizing: border-box;
        a {
          text-decoration: none;
          color: #ffffff;
          p {
            border-radius: $semi-circle-border-radius;
            font-size: 18px;
            padding: 7px;
            background-image: $background-image-to-right;
          }
        }
      }
    }
  }
}
</style>
