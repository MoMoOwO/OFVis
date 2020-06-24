<template>
  <!-- 地图根容器 -->
  <l-map style="height: 565px; width: 100%;" :center="[33, 124]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <l-tile-layer :url="tileUrl"></l-tile-layer>
    <!-- <l-image-overlay :url="imgUrl" :opacity="0.5" :bounds="[[21.98, 116.98], [40.79, 134.06]]"></l-image-overlay>
    <l-marker :lat-lng="[22, 117]"></l-marker>
    <l-marker :lat-lng="[41, 131]"></l-marker>
    <l-marker :lat-lng="[40.475, 120.975 + 0.02]"></l-marker>
    <l-marker :lat-lng="[38.075, 120.825 + 0.02]"></l-marker>-->

    <l-image-overlay :url="imgUrl" :opacity="0.5" :bounds="[[21.975, 116.975], [40.75, 134.06]]"></l-image-overlay>
    <l-marker :lat-lng="[22, 117]"></l-marker>
    <l-marker :lat-lng="[41, 131]"></l-marker>
    <l-marker :lat-lng="[40.475, 120.975]"></l-marker>
    <l-marker :lat-lng="[38.075, 120.825]"></l-marker>
    <l-marker :lat-lng="[30.625, 123.075]"></l-marker>
  </l-map>
</template>

<script>
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// 配置 marker 图标
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('../../../static/marker/marker-icon-2x.png'),
	iconUrl: require('../../../static/marker/marker-icon.png'),
	shadowUrl: require('../../../static/marker/marker-shadow.png')
})
export default {
	data() {
		return {
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA',
			imgUrl: require('../../assets/maps/201501.png'),
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
	props: [],
	mounted() {},
	methods: {
		async getMarkerImg() {},
		doSomethingOnReady() {
			alert('地图加载完毕')
		}
	}
}
</script>

<style lang="less" scoped>
</style>
