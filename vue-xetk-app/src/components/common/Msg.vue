<template>
  <div class="view-msg">
    <div>
      <!--  -->
      <div v-if="toast.visible"
           class="msg-toast"
           :class="{'mask':toast.mask}">
        <div class="fixed-center">
          <p v-if="toast.image||toast.icons[toast.icon]">
            <img :src="toast.image||toast.icons[toast.icon]"
                 alt />
          </p>
          <p>{{toast.title}}</p>
        </div>
      </div>
      <!--  -->
      <div v-if="modal.visible"
           class="msg-modal">
        <div class="fixed-center">
          <div class="tips">
            <p v-if="modal.title"
               class="title">{{modal.title}}</p>
            <p v-if="modal.content"
               class="content"
               v-html="modal.content"></p>
          </div>
          <div class="selects">
            <div v-for="(el,index) in modal.selects"
                 :key="index"
                 :style="'width:'+(100/modal.selects.length)+'%;'"
                 @click="el.event&&el.event()">
              <span :style="'color:'+el.color">{{el.text}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div v-if="photoPreview.visible"
           class="msg-photo-preview"
           @click="photoPreview.visible=false">
        <div class="fixed-center"
             @click.stop>
          <img :src="photoPreview.img"
               alt=""
               preview="m-p-p-0"
               preview-text="ss">
        </div>
      </div>
      <!--  -->
      <div v-if="selectArea.visible">
        <!-- mint-ui -->
        <mt-popup v-model="selectArea.visible"
                  position="bottom">
          <div class="btn-2">
            <span class="s-l"
                  @click="selectArea.cancel">取消</span>
            <span class="s-r float-right clear-float"
                  @click="selectArea.confirm">确定</span>
          </div>
          <mt-picker :slots="selectArea.slots"
                     value-key="name"
                     @change="selectArea.onValuesChange"></mt-picker>
        </mt-popup>
        <!-- mint-ui  -->
      </div>
      <div v-if="selectCarNum.visible">
        <!-- mint-ui -->
        <mt-popup v-model="selectCarNum.visible"
                  position="bottom">
          <div class="btn-2">
            <span class="s-l"
                  @click="selectCarNum.cancel">取消</span>
            <span class="s-r float-right clear-float"
                  @click="selectCarNum.confirm">确定</span>
          </div>
          <mt-picker :slots="selectCarNum.slots"
                     @change="selectCarNum.onValuesChange"></mt-picker>
        </mt-popup>
        <!-- mint-ui  -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toast: {
        title: "",
        icon: "",
        mask: false,
        icons: {
          success: "",
          loading: ""
        },
        visible: false,
        duration: 1500
      },
      modal: {
        title: "",
        content: "",
        defaultSelects: [
          {
            text: "取消",
            color: "#666666",
            visible: true,
            event: null
          },
          {
            text: "确定",
            color: "#ff8901",
            visible: true,
            event: null
          }
        ],
        selects: [],
        selectableNum: 2,
        visible: false
      },
      photoPreview: {
        visible: false,
        img: ""
      },
      selectArea: {
        visible: false,
        area3List: null,
        slots: [
          {
            flex: 1,
            values: [],
            className: "slot-1",
            textAlign: "center"
          },
          {
            flex: 1,
            values: [],
            className: "slot-1",
            textAlign: "center"
          },
          {
            flex: 1,
            values: [],
            className: "slot-1",
            textAlign: "center"
          }
        ],
        values: null
      },
      selectCarNum: {
        visible: false,
        area2List: null,
        slots: [
          {
            flex: 1,
            values: [],
            className: "slot-1",
            textAlign: "center"
          },
          {
            flex: 1,
            values: [],
            className: "slot-1",
            textAlign: "center"
          }
        ],
        values: null
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    showToast(msg) {
      this.toast.visible = true;
      this.toast.title = msg.title || "";
      this.toast.icon = msg.image || msg.icon || "success"; // icon只支持 'success' 'loading'
      this.toast.mask = msg.mask ? true : false;
      const duration = msg.duration || this.toast.duration;
      msg.success && msg.success({ during: true, duration });
      setTimeout(() => {
        this.toast.visible = false;
        msg.success && msg.success({ end: true });
      }, duration);
    },
    showModal(msg) {
      this.modal.visible = true;
      this.modal.title = msg.title || "";
      this.modal.content = msg.content || "";
      const ds = this.modal.defaultSelects;
      ds[0].text = msg.cancelText || "取消";
      ds[0].color = msg.cancelColor || "#666666";
      ds[0].visible = msg.showCancel === false ? false : true;
      ds[0].event = () => {
        msg.success && msg.success({ cancel: true });
        this.modal.visible = false;
      };
      ds[1].text = msg.confirmText || "确定";
      ds[1].color = msg.confirmColor || "#ff8901";
      ds[1].event = () => {
        msg.success && msg.success({ confirm: true });
        this.modal.visible = false;
      };
      let list = [];
      for (let i = 0; i < ds.length; i++) {
        if (ds[i].visible) {
          list.push(ds[i]);
        }
      }
      this.modal.selects = list;
    },
    // 预览图片
    showPhotoPreview(msg) {
      this.photoPreview.visible = true;
      this.photoPreview.img = msg.img;
    },
    // 显示选择省市区
    showSelectArea(msg) {
      this.selectArea.visible = true;
      const area3List = msg.area3List || [];
      this.selectArea.area3List = area3List;
      this.selectArea.slots[0].values = area3List;
      this.selectArea.slots[1].values = area3List[0].child;
      this.selectArea.slots[2].values = area3List[0].child[0].child;
      //
      const value0 = this.selectArea.slots[0].values[0] || {};
      const value1 = this.selectArea.slots[1].values[0] || {};
      const value2 = this.selectArea.slots[2].values[0] || {};
      this.selectArea.values = [
        {
          code: value0.code,
          name: value0.name
        },
        {
          code: value1.code,
          name: value1.name
        },
        {
          code: value2.code,
          name: value2.name
        }
      ];
      this.selectArea.cancel = () => {
        msg.success &&
          msg.success({
            cancel: true
          });
        this.selectArea.visible = false;
      };
      this.selectArea.confirm = () => {
        const values = this.selectArea.values;
        if (values[0].name && values[1].name && values[2].name) {
          // console.log(values);
          msg.success &&
            msg.success({
              confirm: true,
              values
            });
          this.selectArea.visible = false;
        } else {
          alert("请先选择省市区");
        }
      };
      this.selectArea.onValuesChange = picker => {
        const value0 = picker.getSlotValue(0);
        if (value0 && value0.child && value0.child instanceof Array) {
          picker.setSlotValues(1, value0.child);
          const value1 = picker.getSlotValue(1);
          if (value1 && value1.child && value1.child instanceof Array) {
            picker.setSlotValues(2, value1.child);
            const value2 = picker.getSlotValue(2);
            this.selectArea.values = [
              {
                code: value0.code,
                name: value0.name
              },
              {
                code: value1.code,
                name: value1.name
              },
              {
                code: value2.code,
                name: value2.name
              }
            ];
            // console.log(this.selectArea.values);
          }
        }
      };
    },
    // 显示选择车牌号
    showSelectCarNum(msg) {
      this.selectCarNum.visible = true;
      const num2List = msg.num2List || [];
      // console.log(num2List);
      this.selectCarNum.num2List = num2List;
      this.selectCarNum.slots[0].values = num2List[0];
      this.selectCarNum.slots[1].values = num2List[1];
      //
      const value0 = this.selectCarNum.slots[0].values[0] || "";
      const value1 = this.selectCarNum.slots[1].values[0] || "";
      this.selectCarNum.values = [value0, value1];
      // console.log(this.selectCarNum.values);
      this.selectCarNum.cancel = () => {
        msg.success &&
          msg.success({
            cancel: true
          });
        this.selectCarNum.visible = false;
      };
      this.selectCarNum.confirm = () => {
        const values = this.selectCarNum.values;
        // console.log(values);
        if (values[0] && values[1]) {
          msg.success &&
            msg.success({
              confirm: true,
              values
            });
          this.selectCarNum.visible = false;
        } else {
          alert("请先选择车牌号前缀");
        }
      };
      this.selectCarNum.onValuesChange = picker => {
        const value0 = picker.getSlotValue(0);
        const value1 = picker.getSlotValue(1);
        // console.log(value0, value1);
        if (value0 && value1) {
          this.selectCarNum.values = [value0, value1];
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.view-msg {
  > div {
    @import "@style/scss/mint-ui/popup.scss";
    font-size: $default-font-size;
    .msg-toast {
      &.mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
      }
      > div {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%);
        background-color: $default-color;
        color: #ffffff;
        text-align: center;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 15px;
        box-shadow: 0 0 10px 0 rgba(51, 51, 51, 0.3);
        z-index: 10002;
        width: fit-content;
        max-width: 80%;
      }
    }
    .msg-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      > div {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
        min-width: 75%;
        max-width: 90%;
        background-color: #ffffff;
        color: $default-color;
        text-align: center;
        border-radius: 10px;
        z-index: 10002;
        .tips {
          padding: 20px;
          box-sizing: border-box;
          > p {
            padding: 10px;
            box-sizing: border-box;
            &.title {
              font-size: 18px;
            }
            &.content {
              opacity: 0.6;
            }
          }
        }
        .selects {
          font-size: 18px;
          line-height: $list-one-height;
          border-top: solid 1px #eeeeee;
          > div {
            display: inline-block;
            + div {
              position: relative;
              &::before {
                content: "";
                border-left: solid 1px #eeeeee;
                position: absolute;
                height: 100%;
                left: 0;
              }
            }
          }
        }
      }
    }
    .msg-photo-preview {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      > div {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
        min-width: 75%;
        max-width: 92.5%;
        background-color: #ffffff;
        color: $default-color;
        text-align: center;
        border-radius: 10px;
        z-index: 10002;
        font-size: 0;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
