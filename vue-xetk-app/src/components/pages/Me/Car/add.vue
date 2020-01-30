<template>
  <div class="view-car-add">
    <div class="main">
      <div>
        <div class="c-a-form">
          <div v-for="(el,index) in formList" :key="index">
            <span>{{el.label}}</span>
            <div class="right">
              <!--  -->
              <div v-if="el.type=='selectRadio'" class="select-radio">
                <div v-for="(em,indexm) in el.options" :key="indexm" @click="form.car_model=em">
                  <img v-show="form.car_model==em" :src="icons.i_car_selected_1" alt />
                  <img v-show="form.car_model!=em" :src="icons.i_car_selected_0" alt />
                  <span>{{em}}</span>
                </div>
              </div>
              <!--  -->
              <div v-if="el.type=='selectCarNum'" class="select-carNum">
                <span class="s-c-1" @click="goSelect(el)">
                  <span>{{showForm.car_model[0]}}</span>
                  <span>{{showForm.car_model[1]}}</span>
                </span>
                <input
                  type="text"
                  v-model="showForm.car_model[2]"
                  placeholder="请输入车牌号"
                  :maxlength="showForm.maxlength"
                />
              </div>
              <!--  -->
              <div v-if="el.type=='input'" class="r-input">
                <input
                  type="text"
                  v-model="form[el.key]"
                  :placeholder="el.tips"
                  :maxlength="el.maxlength"
                />
                <img :src="icons.i_warn_0" alt @click="showMark(el)" />
              </div>
            </div>
          </div>
        </div>
        <div class="btn" @click="addCarFn">
          <button>添加车辆</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import carNum from "@public/json/carNum";
// console.log(carNum);
import { i_car_selected_0, i_car_selected_1, i_warn_0 } from "@/utils/icons";
import { api_car_add } from "@/api/oilMan";
export default {
  data() {
    return {
      icons: { i_car_selected_0, i_car_selected_1, i_warn_0 },
      formList: [
        {
          key: "car_model",
          label: "选择车型:",
          type: "selectRadio",
          options: ["小型车", "大型车", "新能源小型车", "新能源大型车"],
          tips: "请选择车型",
          required: true
        },
        {
          key: "plate_number",
          label: "车牌号码:",
          type: "selectCarNum",
          options2: {
            CNS:
              "京,津,沪,渝,冀,晋,辽,吉,黑,苏,浙,皖,闽,赣,鲁,豫,鄂,湘,粤,琼,川,贵,云,陕,甘,青,台,蒙,桂,藏,宁,新,港,澳",
            CNJ:
              "川,鄂,甘,赣,桂,贵,黑,沪,吉,冀,津,晋,京,辽,鲁,蒙,闽,宁,青,琼,陕,苏,皖,湘,新,渝,豫,粤,云,浙,藏",
            ENJ: "A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z",
            carNum: carNum.data
          },
          tips: "请选择并填写车牌号码",
          required: true
        },
        {
          key: "vin",
          label: "车架号",
          type: "input",
          tips: "请输入车架号后6位",
          mark:
            "https://s1.nianran.net/static/d3lemon/assets/icon/me/car/add/demo-vin@2x.png",
          maxlength: 6,
          required: true
        },
        {
          key: "engine_number",
          label: "发动机号",
          type: "input",
          tips: "请输入发动机号后6位",
          mark:
            "https://s1.nianran.net/static/d3lemon/assets/icon/me/car/add/demo-engine@2x.png",
          maxlength: 6,
          required: true
        }
      ],
      showForm: {
        car_model: ["浙", "A", ""],
        maxlength: 5
      },
      form: {
        plate_number: "", //	车牌号
        car_model: "", //	车型
        vin: "", //	车架号
        engine_number: "" //	发动机号
      }
    };
  },
  watch: {
    "showForm.car_model": {
      handler(n) {
        // console.log(n);
        n[2] = n[2].toUpperCase();
      },
      // immediate: true,  //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 person 对象的属性值的变化
    },
    "form.car_model": {
      handler(n) {
        // console.log(n);
        if (n.includes("新能源")) {
          this.showForm.maxlength = 6;
        } else {
          this.showForm.maxlength = 5;
        }
      },
      deep: true
    },
    "form.vin": {
      handler(n) {
        // console.log(n);
        this.form.vin = (n || "").toUpperCase();
      },
      deep: true
    }
  },
  created() {},
  methods: {
    selectOneCarModel(em) {
      this.form.car_model = em;
    },
    goSelect(el) {
      if (el.type == "selectCarNum") {
        const CNJ = el.options2.CNJ.split(",");
        const ENJ = el.options2.ENJ.split(",");
        const num2List = [CNJ, ENJ];
        this.$parent.$refs.msg.showSelectCarNum({
          num2List,
          success: res => {
            // console.log(res);
            if (res.confirm) {
              // console.log(res.values);
              this.$set(this.showForm.car_model, 0, res.values[0]);
              this.$set(this.showForm.car_model, 1, res.values[1]);
            }
          }
        });
      }
    },
    showMark(el) {
      this.$parent.$refs.msg.showPhotoPreview({
        img: el.mark
      });
    },
    addCarFn() {
      const f = JSON.parse(JSON.stringify(this.form));
      const car_model = this.showForm.car_model;
      if (car_model[2]) {
        f.plate_number = car_model.join("");
      }
      // console.log(f);
      // 验证必填
      for (let i = 0; i < this.formList.length; i++) {
        const n = this.formList[i];
        if (n.required && !f[n.key]) {
          alert(n.tips);
          return;
        }
      }
      let vLength = 7;
      if (f.car_model.includes("新能源")) {
        vLength = 8;
      }
      if (f.plate_number.length != vLength) {
        alert("车牌号长度不正确");
        return;
      }
      if (f.vin.length != 6) {
        alert("请输入车架号后6位");
        return;
      }
      if (f.engine_number.length != 6) {
        alert("请输入发动机号后6位");
        return;
      }
      api_car_add(f).then(res => {
        if (res.code == 0) {
          alert("添加车辆成功");
          this.$router.go(-1);
        } else {
          alert(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-car-add {
  .main {
    > div {
      padding: 15px;
      box-sizing: border-box;
      .c-a-form {
        background-color: #ffffff;
        padding: 0 15px;
        box-sizing: border-box;
        text-align: left;
        > div {
          min-height: 60px;
          line-height: 60px;
          position: relative;
          &:first-child {
            padding-top: 15px;
            line-height: initial;
            .right {
              position: relative;
              width: 100%;
            }
          }
          &:nth-child(3),
          &:nth-child(4) {
            border-top: solid 1px #eeeeee;
          }
          .right {
            display: inline-block;
            position: absolute;
            right: 0;
            width: 75%;
            z-index: 11;
            .select-radio {
              padding: 10px 0;
              padding-left: 20%;
              box-sizing: border-box;
              > div {
                display: inline-block;
                width: 50%;
                font-size: 13px;
                color: #333333;
                height: 30px;
                line-height: 30px;
                img {
                  width: 17px;
                  height: 17px;
                  vertical-align: middle;
                  margin-right: 5px;
                  transform: translateY(-1.5px);
                }
              }
            }
            .select-carNum {
              display: inline-block;
              text-align: right;
              position: relative;
              .s-c-1 {
                display: inline-block;
                border-radius: 3px;
                border: solid 1px #d2d2d2;
                height: 26px;
                font-size: 15px;
                color: #333333;
                line-height: initial;
                transform: translateY(-1px);
                > span {
                  display: inline-block;
                  padding: 0 15px;
                  box-sizing: border-box;
                  vertical-align: middle;
                  height: 100%;
                  line-height: 26px;
                  &:last-child {
                    border-left: solid 1px #d3d3d3;
                  }
                }
              }
              input {
                width: 50%;
                text-align: left;
                margin-left: 10px;
                border: solid 1px #d3d3d3;
                height: 26px;
                vertical-align: middle;
                border-radius: 3px;
                padding-left: 5px;
                box-sizing: border-box;
              }
            }
            .r-input {
              input {
                width: 70%;
                text-align: left;
                height: 32px;
                vertical-align: middle;
                border-radius: 3px;
                margin-left: 20px;
              }
              img {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      }
      .btn {
        bottom: 10px;
        padding: 20px;
        box-sizing: border-box;
        button {
          width: 100%;
          height: 40px;
          line-height: 1;
          background: $background-image-to-left-3;
          border-radius: 50px;
          font-size: 16px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>


