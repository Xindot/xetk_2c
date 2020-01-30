<template>
  <div class="view-index">
    <div class="width-1">
      <div class="nav">
        <span v-for="(item,index) in categoryList" :key="index" @click="selectFn1(item,index)" :class="{'selected':index==sIdx1}">{{item.name}}</span>
      </div>
      <div class="content">
        <div class="left">
          <p v-for="(item,index) in subCategoryList" :key="index" @click="selectFn2(item,index)" :class="{'selected':index==sIdx2}">{{item.name}}</p>
        </div>
        <div class="right">
          <p class="p-1" v-if="questionPage.total>0">
            <span class="s-1">
              <span>共 </span>
              <span style="color:#d95757;">{{questionPage.total}} </span>
              <span>道题目</span>
            </span>
            <span class="s-2" v-if="questionPage.total>20">随机来 15 道题目</span>
          </p>
          <p v-if="questionList.length==0" style="text-align:center;color:#666;margin-top:5px;">
            <span>暂无题目</span>
          </p>
          <div class="question-list">
            <div v-for="(item,index) in questionList" :key="index" class="list-one">
              <div>
                <h3>{{index+1}}、{{item.title}}</h3>
                <div v-if="item.code" v-highlight class="xe-pre-code">
                  <button class="copy-code" type="button" aria-label="复制代码" v-clipboard:copy="item.code" v-clipboard:success="copySuccess" v-clipboard:error="copyError">
                    <i aria-label="icon: copy" class="anticon anticon-copy">
                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
                      </svg>
                    </i>
                  </button>
                  <pre>
                    <code v-html="item.code"></code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SunApi_xetk_category_list,
  SunApi_xetk_question_list
} from "@/api/SunApi";
import { checkHtml } from "@/utils/verify";
export default {
  data() {
    return {
      listFilter: {
        page: 1,
        size: 500,
        status: 1
      },
      categoryList: [],
      subCategoryList: [],
      sIdx1: 0,
      sIdx2: 0,
      listFilter2: {
        page: 1,
        size: 20,
        sort: "",
        user_id: "",
        type: "",
        category_id: ""
      },
      questionList: [],
      questionPage: {
        total: 0
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const f = this.listFilter;
      SunApi_xetk_category_list(f).then(res => {
        if (res.code == 200) {
          this.categoryList = res.result || [];
          window.localStorage.setItem(
            "categoryList",
            JSON.stringify(this.categoryList)
          );
          this.subCategoryList = this.categoryList[this.sIdx1].children || [];

          this.getQuestionList();
        }
      });
    },
    selectFn1(item, idx) {
      this.sIdx1 = idx;
      this.subCategoryList = item.children || [];
      this.getQuestionList();
    },
    selectFn2(item, idx) {
      this.sIdx2 = idx;
      this.getQuestionList();
    },
    getQuestionList() {
      const f = this.listFilter2 || {};
      f.category_id = this.subCategoryList[this.sIdx2].id || "";
      SunApi_xetk_question_list(f).then(res => {
        if (res.code == 200) {
          const list = res.result || [];
          for (let i = 0; i < list.length; i++) {
            const el = list[i];
            if (el.code && checkHtml(el.code)) {
              el.code = el.code.replace(/\</g, "&lt;");
            }
          }
          this.questionList = list;
          Object.assign(this.questionPage, {
            total: res.total || 0
          });
          this.$nextTick(() => {
            this.highlightCode();
          });
        }
      });
    },
    copySuccess() {
      this.$copyResult("代码复制成功", "success");
    },
    copyError() {
      this.$copyResult("代码复制失败", "error");
    }
  }
};
</script>

<style lang="scss" scoped>
.view-index {
  text-align: left;
  .nav {
    padding: 20px 0;
    box-sizing: border-box;
    > span {
      display: inline-block;
      padding: 5px 15px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: #ccc;
      }
      &.selected {
        background-color: #0f9982;
        color: #fff;
      }
      + span {
        margin-left: 5px;
      }
    }
  }
  .content {
    background-color: #ffffff;
    > div {
      display: inline-block;
      vertical-align: top;
      &.left {
        width: 20%;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e5e5e5;

        > p {
          cursor: pointer;
          height: 50px;
          line-height: 50px;
          box-sizing: border-box;
          padding-left: 20px;
          border-top: 1px solid #e5e5e5;
          border-left: 1px solid #e5e5e5;
          border-right: 1px solid #e5e5e5;
          &:hover {
            background-color: #fafafa;
            border-left: 5px solid #ccc;
          }
          &.selected {
            background-color: #fff;
            border-right: none;
            color: #109982;
            font-weight: bold;
            border-left: 5px solid #109982;
          }
        }
      }
      &.right {
        width: 80%;
        padding: 10px 15px;
        box-sizing: border-box;
        .p-1 {
          text-align: right;
          border-bottom: 1px solid #e5e5e5;
          height: 40px;
          .s-1 {
            display: inline-block;
            margin: 0 20px;
            height: 30px;
            line-height: 30px;
          }
          .s-2 {
            display: inline-block;
            padding: 0 10px;
            box-sizing: border-box;
            cursor: pointer;
            text-align: center;
            border: 1px solid #ccc;
            color: #333;
            height: 30px;
            line-height: 30px;
          }
        }
        .question-list {
          padding: 10px 0;
          box-sizing: border-box;
          .list-one {
            display: inline-block;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            vertical-align: top;
            background-color: #fff;
            border: 1px dashed #e3e3e3;
            border: 1px dashed transparent;
            background: linear-gradient(white, white) padding-box,
              repeating-linear-gradient(
                -45deg,
                #ccc 0,
                #ccc 0.3em,
                white 0,
                white 0.7em
              );
            margin-top: 10px;

            + .list-one {
              margin-top: 20px;
            }
            > div {
              .xe-pre-code {
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
