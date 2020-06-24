<template>
  <!-- 地图根容器 -->
  <l-map style="height: 565px; width: 100%;" :center="[33, 124]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <l-tile-layer :url="tileUrl"></l-tile-layer>
    <l-image-overlay :url="imgUrl" :opacity="0.5" :bounds="[[20.6, 115.4], [41.6, 134.5]]"></l-image-overlay>
    <l-marker :lat-lng="[36.07, 129.38]"></l-marker>
  </l-map>
</template>

<script>
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// 配置 marker 图标
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
	data() {
		return {
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0',
			imgUrl: require('../../assets/maps/20150624.png'),
			mapOptions: {
				zoomSnap: 0.5, // 开启小数(0.5)缩放级别
				zoom: 5.5,
				zoomControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: false,
				dragging: true,
				attributionControl: false
			}
		}
	},
	methods: {
		doSomethingOnReady() {
			alert('地图加载完毕')
		}
	},
	created() {},
	mounted() {},
	props: {}
}
</script>

<style lang="less" scoped>
</style>
