<template>
  <div class="view-address-edit">
    <div class="main">
      <div>
        <div class="form-list">
          <div v-for="(el,index) in list" :key="index" class="list-one">
            <div>
              <div class="left">
                <span>{{el.label}}</span>
              </div>
              <div class="right">
                <div v-if="el.type=='input'" class="r-i">
                  <input
                    v-if="el.inputType=='tel'"
                    type="tel"
                    v-model="form[el.key]"
                    :placeholder="el.tips"
                    :maxlength="el.maxlength"
                  />
                  <input
                    v-else
                    type="text"
                    v-model="form[el.key]"
                    :placeholder="el.tips"
                    :maxlength="el.maxlength"
                    @blur="inputBlur"
                  />
                </div>
                <div v-if="el.type=='select'" class="r-s" @click="selectOne(el)">
                  <span v-if="form[el.key+'Str']">{{form[el.key+'Str']}}</span>
                  <span class="un-selected" v-else>{{el.selectText||'请选择'}}</span>
                  <img :src="icons.i_arrow_b" class="right-arrow" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-list">
          <div v-for="(el,index) in list2" :key="index" class="list-one">
            <div>
              <div class="left">
                <span>{{el.label}}</span>
              </div>
              <div class="right">
                <div v-if="el.type=='switch'" class="r-sw">
                  <span
                    class="i-switch"
                    :class="{'on':form[el.key]===1}"
                    @click="form[el.key]=(1-form[el.key])"
                  >
                    <span class="dot"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="detail&&detail.id>0" class="btn" @click="deleteAddress(detail)">
          <button>删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyMobile11 } from "@/utils/verify";
import { i_arrow_b } from "@/utils/icons";
import {
  api_china_city,
  api_address_add,
  api_address_edit,
  api_address_del
} from "@/api/oilMan";
import { browserName } from "@/utils/const.js";
export default {
  data() {
    return {
      token: null,
      icons: { i_arrow_b },
      list: [
        {
          key: "username",
          label: "收货人",
          type: "input",
          inputType: "text",
          tips: "请输入收货人姓名",
          maxlength: 8,
          required: true
        },
        {
          key: "mobile",
          label: "手机号",
          type: "input",
          inputType: "tel",
          tips: "请输入收货人手机号",
          maxlength: 11,
          required: true
        },
        {
          key: "area",
          label: "所在地区",
          type: "select",
          selectType: "area",
          selectText: "请选择所在地区",
          tips: "请选择所在地区",
          required: true
        },
        {
          key: "address",
          label: "详细地址",
          type: "input",
          inputType: "text",
          tips: "请输入详细地址",
          maxlength: 30,
          required: true
        }
      ],
      list2: [
        {
          key: "selected",
          label: "设置成默认",
          type: "switch",
          switchType: "2",
          required: false
        }
      ],
      form: {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        area: "",
        areaStr: "",
        postal_code: "",
        address: "",
        selected: 0
      },
      detail: null
    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || null;
    this.getArea();
    let centerValue = "新增收货地址";
    this.detail = JSON.parse(
      window.sessionStorage.getItem("MeAddressList:selected") || null
    );
    // console.log("detail=>", this.detail);
    if (this.detail) {
      Object.assign(this.form, { ...this.detail });
      this.form.mobile = this.detail.phone;
      const area = [
        this.detail.province,
        this.detail.city,
        this.detail.district
      ].join(" ");
      this.form.area = area;
      this.form.areaStr = area;
      // console.log("form=>", this.form);
      if (this.form.id > 0) {
        centerValue = "编辑收货地址";
      }
    }
    this.$parent.setHeader({
      centerValue,
      rightEvent: () => {
        if (!this.token) {
          const loginPath = browserName == "wx" ? "wxLogin" : "login";
          this.$router.push(this.routesMatch[loginPath]);
          return;
        }
        const f = JSON.parse(JSON.stringify(this.form));
        // console.log(f)
        for (let i = 0; i < this.list.length; i++) {
          const n = this.list[i];
          if (n.required && !f[n.key]) {
            alert(n.tips);
            return;
          }
        }
        if (!verifyMobile11(f.mobile)) {
          alert("手机号格式不正确");
          return;
        }
        // console.log(f)
        if (f.id > 0) {
          api_address_edit(f).then(res => {
            if (res.code == 0) {
              alert("恭喜您，编辑地址成功！");
              this.$router.go(-1);
            } else {
              alert(res.msg);
            }
          });
        } else {
          api_address_add(f).then(res => {
            if (res.code == 0) {
              alert("恭喜您，添加地址成功！");
              this.$router.go(-1);
            } else {
              alert(res.msg);
            }
          });
        }
      }
    });
  },
  methods: {
    inputBlur() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    selectOne(el) {
      // console.log(el)
      if (el.type == "select" && el.selectType == "area") {
        if (
          this.area3List &&
          this.area3List instanceof Array &&
          this.area3List.length > 0
        ) {
          // document.querySelector("html").style.overflow = "hidden";
          // document.querySelector("body").style.overflow = "hidden";
          this.$parent.$refs.msg.showSelectArea({
            area3List: this.area3List,
            success: res => {
              // document.querySelector("html").style.overflow = "auto";
              // document.querySelector("body").style.overflow = "auto";
              // console.log(res);
              if (res.confirm) {
                // console.log(res.values);
                const nameArr = [];
                const codeArr = [];
                for (let i = 0; i < res.values.length; i++) {
                  const n = res.values[i];
                  n.name && nameArr.push(n.name);
                  n.code && codeArr.push(n.code);
                }
                this.form.province = nameArr[0];
                this.form.city = nameArr[1];
                this.form.district = nameArr[2];
                this.form.area = nameArr.join(" ");
                this.form.areaStr = this.form.area;
                this.form.postal_code = codeArr[2];
              }
            }
          });
        } else {
          alert("获取省市区数据失败，请稍后重试");
        }
      }
    },
    getArea() {
      api_china_city().then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.area3List = res.data || [];
        } else {
          alert(res.msg);
        }
      });
    },
    deleteAddress(detail) {
      if (!this.token) {
        const loginPath = browserName == "wx" ? "wxLogin" : "login";
        this.$router.push(this.routesMatch[loginPath]);
        return;
      }
      if (!detail.id) {
        return;
      }
      confirm("确定删除此地址?", ok => {
        if (ok) {
          const f = {
            id: detail.id
          };
          // console.log(f);
          api_address_del(f).then(res => {
            // console.log(res)
            if (res.code == 0) {
              alert("地址删除成功");
              this.$router.go(-1);
            } else {
              alert(res.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-address-edit {
  .main {
    > div {
      padding: 0 15px;
      box-sizing: border-box;
      .form-list {
        border-radius: 5px;
        overflow: hidden;
        margin-top: 15px;
        .list-one {
          height: 50px;
          line-height: 50px;
          background-color: #ffffff;
          padding: 0 10px;
          box-sizing: border-box;
          &.cut {
            margin-bottom: 10px;
          }
          + .list-one {
            > div {
              border-top: solid 1px #eeeeee;
            }
          }
          > div {
            > div {
              display: inline-block;
              text-align: left;
              &.left {
                width: 30%;
                font-size: 15px;
              }
              &.right {
                width: 70%;
                text-align: left;
                color: #000000;
                .r-i {
                  input {
                    width: 100%;
                    padding: 0;
                    color: #000000;
                  }
                }
                .r-s {
                  position: relative;
                  font-size: 14px;
                  .un-selected {
                    color: #acacac;
                  }
                  img {
                    &.right-arrow {
                      height: 8px;
                      width: 8px;
                      position: absolute;
                      right: 0;
                      top: 50%;
                      transform: translateY(-50%) rotate(45deg);
                      opacity: 0.5;
                    }
                  }
                }
                .r-sw {
                  text-align: right;
                  .i-switch {
                    display: inline-block;
                    width: 35px;
                    height: 22px;
                    border-radius: 50px;
                    vertical-align: middle;
                    text-align: left;
                    background-color: #cdcdcd;
                    // transition: text-align 3s;
                    &.on {
                      text-align: right;
                      background-color: #fb8241;
                    }
                    > span.dot {
                      display: inline-block;
                      width: 20px;
                      height: 20px;
                      background-color: #ffffff;
                      border-radius: 50px;
                      vertical-align: top;
                      margin: 1px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .btn {
        margin-top: 40px;
        padding: 0 20px;
        box-sizing: border-box;
        button {
          width: 100%;
          height: 40px;
          line-height: 1;
          background: $background-image-to-right-2;
          border-radius: 50px;
          font-size: 16px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
