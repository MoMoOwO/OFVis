<template>
  <div class="map" id="map"></div>
</template>

<script>
// 引入leaflet
import * as L from "leaflet";

export default {
  data() {
    return {
      map: ""
    };
  },
  watch: {},
  methods: {
    createMap() {
      // 地图对象
      var mymap = L.map(this.$el, {
        center: [33, 127],
        zoom: 6,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        //preferCanvas: true, // 启用canvas
      });
      // 通过给定URL模板和具有选项的对象来实例化一个切片图层
      L.tileLayer(
        "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        { attribution:'OSM' }
      ).addTo(mymap); // 将图层加到地图上
    }
  },
  created() {},
  mounted() {
    // 需要在此时调用绘制地图的函数，此时DOM组件已经初始化好
    this.createMap();
  },
  components: {},
  props: {}
};
</script>

<style scoped>
</style>