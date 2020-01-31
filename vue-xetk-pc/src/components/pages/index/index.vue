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
          <p class="p-1">
            <span class="filter-icon float-left clear-float">
              <i class="el-icon-s-unfold"></i>
            </span>
            <span class="s-1 float-left clear-float">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <span>{{questionTypes[listFilter2.type] || '类型'}}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in questionTypes" :key="index" :command="index+''">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <span>
                <i class="el-icon-close"></i>
              </span> -->
            </span>
            <span class="s-1">
              <span>共</span>
              <span style="color:#d95757;">{{questionPage.total}}</span>
              <span>道题</span>
            </span>
            <span class="s-2" v-if="questionPage.total>20">随机来15道题</span>
          </p>
          <p v-if="apiStatus==2&&questionList.length==0" style="text-align:center;color:#666;margin-top:15px;">
            <span>暂无题目</span>
          </p>
          <div class="question-list">
            <div v-for="(item,index) in questionList" :key="index" class="list-one">
              <div>
                <h3>
                  <span class="s-idx">{{index+1+(listFilter2.page-1)*listFilter2.size}}</span>
                  <el-tag type="info" size="mini">{{questionTypes[item.type]}}</el-tag>
                  <span>{{item.title}}</span>
                </h3>
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
                <div class="q-options">
                  <p v-for="(item1,index1) in item.options" :key="index1">{{selectOptions[index1]}}、{{item1}}</p>
                </div>
                <div class="q-answer">
                  <el-collapse>
                    <el-collapse-item name="1">
                      <template slot="title">
                        <i class="el-icon-medal"></i>
                        参考答案
                      </template>
                      <div>
                        <span v-if="item.type==0||item.type==1">{{selectOptions[item.answer]}}</span>
                        <span v-else>{{item.answer}}</span>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                      <template slot="title">
                        <i class="el-icon-news"></i>
                        解析
                      </template>
                      <div>
                        <span>暂无</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </div>
            <div style="margin-top:10px;text-align:center;" v-if="questionPage.total>listFilter2.size">
              <el-pagination background layout="prev, pager, next" :current-page="listFilter2.page" :page-size="listFilter2.size" :total="questionPage.total" @current-change="handleCurrentChange"></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { questionTypes, selectOptions } from "@/utils/const";
import {
  SunApi_xetk_category_list,
  SunApi_xetk_question_list
} from "@/api/SunApi";
import { checkHtml } from "@/utils/verify";
export default {
  data() {
    return {
      questionTypes,
      selectOptions,
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
        type: "0",
        category_id: ""
      },
      questionList: [],
      questionPage: {
        total: 0
      },
      apiStatus: 0 //0未请求 1请求中 2请求结束
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
          this.listFilter2.page = 1;
          this.getQuestionList();
        }
      });
    },
    selectFn1(item, idx) {
      this.sIdx1 = idx;
      this.subCategoryList = item.children || [];
      this.listFilter2.page = 1;
      this.getQuestionList();
    },
    selectFn2(item, idx) {
      this.sIdx2 = idx;
      this.listFilter2.page = 1;
      this.getQuestionList();
    },
    handleCommand(command) {
      this.listFilter2.type = command + "";
      this.listFilter2.page = 1;
      this.getQuestionList();
    },
    getQuestionList() {
      const f = this.listFilter2 || {};
      f.category_id = this.subCategoryList[this.sIdx2].id || "";
      this.apiStatus = 1;
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
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          });
        }
        this.apiStatus = 2;
      });
    },
    copySuccess() {
      this.$copyResult("代码复制成功", "success");
    },
    copyError() {
      this.$copyResult("代码复制失败", "error");
    },
    handleCurrentChange(val) {
      this.listFilter2.page = val;
      this.getQuestionList();
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
    @media (max-width: 600px) {
      display: none;
    }
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
        @media (max-width: 600px) {
          display: none;
        }
        > p {
          cursor: pointer;
          height: 50px;
          line-height: 50px;
          box-sizing: border-box;
          padding-left: 15px;
          border-top: 1px solid #e5e5e5;
          border-left: 1px solid #e5e5e5;
          border-right: 1px solid #e5e5e5;
          overflow-x: auto;
          word-break: break-all;
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
        @media (max-width: 600px) {
          width: 100%;
        }
        .p-1 {
          text-align: right;
          border-bottom: 1px solid #e5e5e5;
          height: 40px;
          .filter-icon {
            display: none;
          }
          @media (max-width: 600px) {
            .filter-icon {
              display: inline-block;
              font-size: 22px;
              padding-right: 10px;
              box-sizing: border-box;
            }
          }
          .s-1 {
            display: inline-block;
            margin: 0 10px;
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
              > h3 {
                position: relative;
                .s-idx {
                  display: inline-block;
                  margin-left: -16px;
                  width: 24px;
                  height: 24px;
                  line-height: 24px;
                  text-align: center;
                  background-color: #1d1d1d;
                  color: #fff;
                  font-size: 14px;
                }
                .el-tag {
                  margin: 0 5px;
                  vertical-align: 0px;
                }
              }
              .xe-pre-code {
                margin-top: 10px;
              }
              .q-options {
                margin: 5px 0;
                > p {
                  line-height: 1.5;
                }
              }
              .q-answer {
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
