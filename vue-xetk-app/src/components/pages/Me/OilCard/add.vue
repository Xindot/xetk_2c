<template>
  <div class="view-oilCardAdd">
    <div class="main">
      <div>
        <div class="c-1">
          <p>
            <span>油卡类型</span>
          </p>
          <div class="s-list">
            <div v-for="(el,index) in list" :key="index">
              <div @click="selectOne(el)">
                <img :src="el.img" class="oil-logo" alt />
                <img v-if="el.type==form.type" :src="icons.i_selected_b_r" class="selected" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="c-2">
          <div>
            <div v-for="(el,index) in listForm" :key="index">
              <div class="left">
                <span>{{el.label}}</span>
              </div>
              <div class="right">
                <input v-if="el.inputType=='tel'" type="tel" v-model="form[el.key]" @blur="blurIt(el.key)" :placeholder="el.placeholder" :maxlength="el.maxlength" />
                <input v-else type="text" v-model="form[el.key]" @blur="blurIt(el.key)" :placeholder="el.placeholder" :maxlength="el.maxlength" />
              </div>
            </div>
          </div>
        </div>
        <div class="c-3">
          <div class="btn" @click="goAddFn">
            <span>确认添加</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i_oil_cnpc_w, i_oil_sinopec_w, i_selected_b_r } from "@/utils/icons";
import { api_oil_bindOil } from "@/api/oilMan";
import { verifyMobile11 } from "@/utils/verify";
export default {
  components: {},
  data() {
    return {
      icons: { i_selected_b_r },
      list: [
        {
          key: "sinopec",
          img: i_oil_sinopec_w,
          type: 1
        },
        {
          key: "cnpc",
          img: i_oil_cnpc_w,
          type: 2
        }
      ],
      listForm: [
        {
          label: "油卡卡号",
          key: "card_no",
          placeholder: "请输入油卡卡号",
          inputType: "tel",
          maxlength: 19
        },
        {
          label: "确认油卡卡号",
          key: "card_no_2",
          placeholder: "请再次输入油卡卡号",
          inputType: "tel",
          maxlength: 19
        },
        {
          label: "持卡人姓名",
          key: "name",
          placeholder: "请输入持卡人姓名",
          maxlength: 20
        },
        {
          label: "持卡人手机号",
          key: "mobile",
          placeholder: "请输入持卡人手机号",
          inputType: "tel",
          maxlength: 11
        }
      ],
      selectedIdx: 0,
      form: {
        type: 1, // 1中石化,2中石油
        card_no: "",
        card_no_2: "",
        name: "",
        mobile: ""
      }
    };
  },
  created() {},
  methods: {
    selectOne(el) {
      this.form.type = el.type;
    },
    blurIt(key) {
      if (key == "card_no") {
        const value = this.form[key];
        if (value.substr(0, 1) == "1" && value.length == 19) {
          this.form.type = 1;
        }
        if (value.substr(0, 1) == "9" && value.length == 16) {
          this.form.type = 2;
        }
      }
      if (key == "mobile") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    goAddFn() {
      const f = this.form;
      if (f.card_no != f.card_no_2) {
        alert("两次输入的油卡卡号不一样");
        return;
      }
      for (let i = 0; i < this.listForm.length; i++) {
        const el = this.listForm[i];
        if (f[el.key] == "") {
          alert(el.placeholder);
          return;
        }
      }
      if (f.type == 1) {
        // 中石化开头1,位数19位
        if (!(f.card_no.substr(0, 1) == "1" && f.card_no.length == 19)) {
          alert("您输入的油卡卡号格式不正确");
          return;
        }
      }
      if (f.type == 2) {
        // 中石油开头9,位数16位
        if (!(f.card_no.substr(0, 1) == "9" && f.card_no.length == 16)) {
          alert("您输入的油卡卡号格式不正确");
          return;
        }
      }
      if (!verifyMobile11(f.mobile)) {
        alert("手机号格式不正确");
        return;
      }
      //   console.log(f)
      api_oil_bindOil(f).then(res => {
        if (res.code == 0) {
          alert("恭喜您添加成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        } else {
          alert(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-oilCardAdd {
  .main {
    > div {
      padding: 10px;
      box-sizing: border-box;
      .c-1 {
        p {
          text-align: left;
          font-size: 18px;
          color: $default-color;
          font-weight: bolder;
          padding: 0 5px;
        }
        .s-list {
          > div {
            display: inline-block;
            width: 50%;
            padding: 2.5px;
            box-sizing: border-box;
            > div {
              padding-bottom: 60%;
              background-image: $background-image-to-right;
              position: relative;
              border-radius: 5px;
              overflow: hidden;
              box-shadow: 0 5px 10px 0 #adadad;
              img {
                &.oil-logo {
                  position: absolute;
                  left: 0;
                  right: 0;
                  margin: auto;
                  height: 45%;
                  top: 50%;
                  transform: translateY(-50%);
                }
                &.selected {
                  position: absolute;
                  right: 0;
                  bottom: 0;
                  height: 50%;
                }
              }
            }
          }
        }
      }
      .c-2 {
        margin-top: 15px;
        padding: 5px;
        font-size: 16px;
        color: $default-color;
        > div {
          background-color: #ffffff;
          border-radius: 5px;
          > div {
            height: 60px;
            line-height: 60px;
            + div {
              border-top: solid 1px #eeeeee;
            }
            > div {
              display: inline-block;
              &.left {
                width: 35%;
                text-align: left;
                padding-left: 15px;
                box-sizing: border-box;
              }
              &.right {
                width: 65%;
                text-align: right;
                input {
                  width: 100%;
                  height: 40px;
                  box-sizing: border-box;
                  padding: 0 15px;
                  font-size: $default-font-size;
                }
              }
            }
          }
        }
      }
      .c-3 {
        margin: 40px 0;
        padding: 0 20px;
        .btn {
          color: #ffffff;
          border-radius: $btn-border-radius;
          line-height: $list-one-height;
          font-size: 18px;
          background-image: $background-image-to-right;
        }
      }
    }
  }
}
</style>
