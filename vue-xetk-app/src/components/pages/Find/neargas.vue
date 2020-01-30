<template>
  <div class="view-neargas">
    <div class="main">
      <div>
        <div class="amap-page-container fixed">
          <el-amap vid="amapDemo" :center="amapBase.center" :zoom="amapBase.zoom" class="amap-demo" :events="amapBase.events" :plugin="amapBase.plugin">
            <el-amap-info-window :autoMove="true" :position="currentWindow.position" :visible="currentWindow.visible" :events="currentWindow.events">
              <div class="select-point">
                <p class="p-1">
                  <span>{{currentWindow.point.name}}</span>
                </p>
                <p class="p-2">
                  <span>地址:</span>
                  <span>{{currentWindow.point.address}}</span>
                </p>
                <p class="p-3">
                  <span>电话:</span>
                  <span>
                    <a :href="'tel:'+currentWindow.point.tel">{{currentWindow.point.tel}}</a>
                  </span>
                </p>
                <p class="p-4">
                  <button class="navi-button" @click="addressNav">去这里</button>
                </p>
              </div>
            </el-amap-info-window>
            <el-amap-marker v-for="(el, index) in amapMarkers" :key="index" :vid="index" :position="el.position" :events="el.events" :visible="el.visible" :draggable="el.draggable" :icon="el.icon" :template="el.template"></el-amap-marker>
          </el-amap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, MessageBox } from "mint-ui";
import { browserName } from "@/utils/const";

// 初始化高德地图的 key 和插件
window.VueAMap.initAMapApiLoader({
  key: "dbd40d23be081d5373df9e30ce65115d",
  plugin: [
    "Autocomplete",
    "PlaceSearch",
    "Scale",
    "OverView",
    "ToolBar",
    "MapType",
    "PolyEditor",
    "AMap.CircleEditor",
    "AMap.Geolocation"
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: "1.4.4"
});
import { api_place_around } from "@/api/aMap";
export default {
  data() {
    const vm = this;
    return {
      icons: {
        close:
          "https://s1.nianran.net/static/d3lemon/assets/icon/find/neargas/clear@1x.png",
        marker:
          "https://s1.nianran.net/static/d3lemon/assets/icon/find/neargas/map-marker@1x.png"
      },
      list: [],
      // api_docs https://lbs.amap.com/api/webservice/guide/api/search#text
      parameters: {
        key: "79aab4a0d6aedb8dcc1e090bba74e624",
        location: "120.01656,30.28065",
        types: "010100" // 010100为加油站（中类）
      },
      currentWindow: {
        point: {},
        position: [120.01656, 30.28065],
        visible: false,
        events: {
          close: () => {
            this.currentWindow.visible = false;
          }
        }
      },
      amapBase: {
        loaded: false,
        locationed: false,
        zoom: 12,
        center: [120.01656, 30.28065],
        events: {
          complete: () => {
            this.amapBase.loaded = true;
            Indicator.close();
            if (!this.amapBase.locationed) {
              Indicator.open({
                text: "定位中...",
                spinnerType: "fading-circle"
              });
              setTimeout(() => {
                Indicator.close();
                if (!this.amapBase.locationed) {
                  MessageBox(
                    "温馨提示",
                    "获取定位失败，请检查手机是否开启定位权限"
                  );
                }
              }, 10000);
            }
          },
          click: () => {
            // let { lng, lat } = e.lnglat;
            // // console.log(lng, lat);
            this.currentWindow.visible = false;
          },
          dragstart: () => {
            this.currentWindow.visible = false;
          },
          dragend: function() {
            //console.log("dragging",e,this.getCenter());
            const point = this.getCenter();
            // console.log(point);
            vm.parameters.location = [point.lng, point.lat].join(",");
            vm.getPlaceAround();
          }
        },
        plugin: [
          {
            pName: "Geolocation",
            events: {
              init(o) {
                if (vm.amapBase.locationed) {
                  Indicator.close();
                  return;
                }
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  // console.log(status, result);
                  window.sessionStorage.setItem(
                    "getCurrentPosition",
                    JSON.stringify({ status, result })
                  );
                  if (
                    result &&
                    result.position &&
                    result.position.lng &&
                    result.position.lat
                  ) {
                    vm.amapBase.center = [
                      result.position.lng,
                      result.position.lat
                    ];
                    // console.log(vm.amapBase.center);
                    vm.parameters.location = vm.amapBase.center.join(",");
                    vm.getPlaceAround();
                    Indicator.close();
                    vm.amapBase.locationed = true;
                    vm.amapBase.loaded = true;
                    vm.$nextTick();
                  }
                });
              }
            }
          }
        ]
      },
      amapMarkers: []
    };
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    setTimeout(() => {
      Indicator.close();
      if (!this.amapBase.loaded) {
        MessageBox("温馨提示", "地图加载失败，请稍后重新打开试试");
      }
    }, 10000);
    // this.getPlaceAround();
  },
  mounted() {
    if (browserName == "wx") {
      if (this.amapBase.locationed) {
        Indicator.close();
        return;
      }
      this.getWxPosition();
    }
  },
  beforeDestroy() {
    Indicator.close();
  },
  methods: {
    getWxPosition() {
      const wxLocation = JSON.parse(
        window.sessionStorage.getItem("wxGetLocation:res") ||
          window.sessionStorage.getItem("wxGetLocation:res2") ||
          null
      );
      if (wxLocation && wxLocation.longitude && wxLocation.latitude) {
        this.amapBase.center = [wxLocation.longitude, wxLocation.latitude];
        // console.log(this.amapBase.center);
        this.parameters.location = this.amapBase.center.join(",");
        this.getPlaceAround();
        Indicator.close();
        this.amapBase.locationed = true;
      } else {
        this.$parent.wxGetLocation(res => {
          window.sessionStorage.setItem(
            "wxGetLocation:res2",
            JSON.stringify(res)
          );
          if (res && res.longitude && res.latitude) {
            this.amapBase.center = [res.longitude, res.latitude];
            // console.log(this.amapBase.center);
            this.parameters.location = this.amapBase.center.join(",");
            this.getPlaceAround();
            Indicator.close();
            this.amapBase.locationed = true;
          }
        });
      }
    },
    getPlaceAround() {
      const p = this.parameters;
      api_place_around(p).then(res => {
        // console.log(res);
        if (res.pois && res.pois instanceof Array && res.pois.length > 0) {
          this.setMarkers(res.pois);
        }
      });
    },
    setMarkers(pois) {
      let markers = [];
      for (let i = 0; i < pois.length; i++) {
        const p = pois[i];
        markers.push({
          point: p,
          position: p.location.split(","),
          events: {
            click: e => {
              const vid = e.target.F.vid;
              const point =
                (this.amapMarkers[vid] && this.amapMarkers[vid].point) || null;
              // console.log(e, vid, point);
              this.switchWindow(point);
            }
          },
          visible: true,
          draggable: false,
          tips: false,
          template: `<div class="oil-marker">
            <div class="icon">
              <img src="${this.icons.marker}" style="width:26px;">
              <span>${i + 1}</span>
            </div>
          </div>`
        });
      }
      this.amapMarkers = markers;
    },
    switchWindow(point) {
      // console.log(point);
      this.currentWindow.visible = false;
      this.$nextTick(() => {
        if (point.address instanceof Array) {
          point.address = point.address[0];
        }
        if (point.tel instanceof Array) {
          point.tel = point.tel[0];
        }
        this.currentWindow = {
          ...{
            point,
            position: point.location.split(","),
            visible: true
          }
        };
      });
    },
    addressNav() {
      const point = this.currentWindow.point || null;
      // console.log("point=>", point);
      if (point) {
        const latitude = (point.location || "").split(",")[1];
        const longitude = (point.location || "").split(",")[0];
        this.$parent.wxOpenLocation({
          latitude: parseFloat(latitude), // 纬度，浮点数，范围为90 ~ -90
          longitude: parseFloat(longitude), // 经度，浮点数，范围为180 ~ -180。
          name: point.name || "", // 位置名
          address: point.address || "" // 地址详情说明
        });
      }
    }
  }
};
</script>>

<style lang="scss">
.view-neargas {
  .main {
    > div {
      .amap-page-container {
        position: fixed;
        top: 44px;
        width: 100%;
        height: calc(100% - 44px);
        .oil-marker {
          position: relative;
          .icon {
            position: relative;
            font-size: 0;
            width: 26px;
            span {
              display: inline-block;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              margin-top: -3px;
              height: 15px;
              line-height: 15px;
              font-size: 15px;
              color: #ffffff;
              font-weight: 600;
              text-align: center;
            }
          }
          .oil-tips {
            position: fixed;
            z-index: 11;
            width: 200px;
            background-color: #ffffff;
            transform: translate(-87px, -33px);
            text-align: left;
          }
        }
        .amap-info-contentContainer {
          transform: translateY(-26px);
          .select-point {
            p {
              &.p-1 {
                font-size: 17px;
                color: #333333;
              }
              &.p-2,
              &.p-3 {
                font-size: 12px;
                color: #878787;
              }
              &.p-4 {
                text-align: center;
                margin-top: 5px;
                button {
                  &.navi-button {
                    color: #fff;
                    padding: 0.5em 2.5em;
                    border-radius: 2px;
                    background-color: #007aff;
                    display: inline-block;
                    vertical-align: baseline;
                    white-space: nowrap;
                    text-align: center;
                    line-height: normal;
                    border-width: 0;
                    cursor: pointer;
                    zoom: 1;
                    -webkit-user-drag: none;
                    user-select: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
