<template>
  <!-- 地图根容器 -->
  <l-map style="height: 565px; width: 100%;" :center="[33, 124]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <!-- <l-tile-layer :url="tileUrl"></l-tile-layer>
    <l-image-overlay :url="imgUrl" :bounds="[[18, 113], [43, 135]]"></l-image-overlay>-->
    <l-image-overlay :url="allimgUrl" :bounds="[[-80, 180], [80, -180]]"></l-image-overlay>
    <l-marker :lat-lng="[36.07, 129.38]"></l-marker>
  </l-map>
</template>

<script>
export default {
	data() {
		return {
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0',
			imgUrl: require('../../assets/201601.png'),
			allimgUrl: require('../../assets/01511.cs.png'),
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
