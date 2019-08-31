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
        center: [32, 125],
        zoom: 5,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        attributionControl: false,
        //preferCanvas: true, // 启用canvas
      });
      // 通过给定URL模板和具有选项的对象来实例化一个切片图层
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0",
        //"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
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