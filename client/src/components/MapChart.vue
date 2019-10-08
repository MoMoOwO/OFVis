<template>
  <div class="map" id="map"></div>
</template>

<script>
// 引入leaflet
import * as L from "leaflet";
// 引入leaflet样式
import 'leaflet/dist/leaflet.css';
// 引入D3
import * as d3 from "d3";

export default {
  data() {
    return {
      mymap: ""
    };
  },
  watch: {},
  methods: {
    createMap() {
      // 地图对象
      this.mymap = L.map(this.$el, {
        center: [32, 124.5],
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
      ).addTo(this.mymap); // 将图层加到地图上
      this.addPoint();
      //L.circle([32, 125],{color:this.getColor(0.5),radius:1,fillOpacity:1}).addTo(this.mymap);
    },
    addPoint(){
      this.axios.post('/data/source').then(result => {
        if(result.data.status === 0){
          let blue = d3.rgb(0, 0, 255); // 蓝色，红色
          let red = d3.rgb(255, 0, 0);
          let compute = d3.interpolate(blue, red); // 插值

          // 线性比例尺
          let scaleLinear = d3.scaleLinear().domain([result.data.message.mintemp, result.data.message.maxtemp]).range([0, 1]);

          let maxTemp = result.data.message.maxtemp;
          let minTemp = result.data.message.mintemp;

          //console.log(result.data.message.data);
          result.data.message.data.forEach(item => {
            L.circle([item.lat, item.lon], 
            {color:this.getColor((item.temp - minTemp) / (maxTemp - minTemp)),
            radius:1,fillOpacity:1}).addTo(this.mymap);

            //L.circle([item.lat, item.lon], {color:compute(scaleLinear(item.temp)), radius:1, fillOpacity:1}).addTo(this.mymap);
          });

        }else{
          console.log("请求数据失败！");
          console.log(result.message.data);
        }
      })
      //L.circle([32, 125],{color:"#3388ff",radius:1,fillOpacity:1}).addTo(this.mymap);
    },

    getColor(value){ // 根据标量值获取颜色的映射
      var r, g, b;
      if (value >= 0 & value <= 1 / 3) {
        r = 0;
        g = 0;
        b = 3 * value;
      } else if (value > 1 / 3 && value <= 2 / 3) {
        r = 0;
        g = 3 * (value - 1 / 3);
        b = 0;
      } else { // value >= 2/3 && value <= 1
        r = 3 * (value - 2 / 3);
        g = 0;
        b = 0;
      }
      r = 255 * r;
      g = 255 * g;
      b = 255 * b;
      return `rgb(${r},${g},${b})`;
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