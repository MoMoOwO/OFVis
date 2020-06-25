<template>
  <!-- 地图根容器 -->
  <l-map style="height: 555px; width: 100%;" :center="[33.9, 124.2]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <l-tile-layer :url="tileUrl"></l-tile-layer>
    <!-- 图片图层 -->
    <l-image-overlay :url="imgUrl" :bounds="[[21.975, 116.975], [40.75, 134.06]]"></l-image-overlay>
    <!-- marker 图层 -->
    <!-- <l-marker :lat-lng="latlon"></l-marker> -->
  </l-map>
</template>

<script>
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// 删除默认图标
delete L.Icon.Default.prototype._getIconUrl

export default {
	data() {
		return {
			latlon: [],
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA',
			imgUrl: this.$store.state.imgShowOnMap,
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
	created() {
		// 从后台获取 marker 图表
		this.getMarkerIcon()
	},
	watch: {
		'$store.state.imgShowOnMap': {
			// 联动，监听选择区域的改变
			handler: function(newVal) {
				this.imgUrl = newVal
			},
			deep: true
		}
	},
	methods: {
		async getMarkerIcon() {
			const { data: res } = await this.axios.get('img/marker')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get marker-ico data!')
			} else {
				const icoArr = res.data
				// 配置 marker 图标
				L.Icon.Default.mergeOptions({
					iconRetinaUrl: icoArr[0],
					iconUrl: icoArr[1],
					shadowUrl: icoArr[3]
				})
			}
		}
	}
}
</script>

<style lang="less" scoped>
</style>
