<template>
  <!-- 地图根容器 -->
  <l-map style="height: 555px; width: 100%;" :center="[33.9, 124.2]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <l-tile-layer :url="tileUrl"></l-tile-layer>
    <!-- 图片图层 -->
    <l-image-overlay :url="imgUrl" :bounds="[[21.975, 116.975], [40.75, 134.06]]"></l-image-overlay>
    <!-- marker 图层 -->
    <l-marker :lat-lng="marker.length ? marker[2] : [0,0]" v-show="!marker.length"></l-marker>
    <!-- markers 图层 -->
    <!-- <l-marker :lat-lng="marker[2]">
      <l-tooltip>{{RegionID: marker[0]+1 <br/> }}</l-tooltip>
    </l-marker>-->
  </l-map>
</template>

<script>
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
	data() {
		return {
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA',
			mapOptions: {
				zoomSnap: 0.5, // 开启小数(0.5)缩放级别
				zoom: 5.5,
				zoomControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: false,
				dragging: true,
				attributionControl: false
			},
			queryInfo: {
				type: '2', // 获取指定日期的数据
				date: this.$store.state.imgShowOnMap
			},
			imgUrl: '', // 图片
			marker: this.$store.state.markerShowOnMap, // 悬浮交互显示的点
			markers: [] // 点选交互显示的点集
		}
	},
	created() {
		// 从后台获取 marker 图表
		this.getMarkerIcon()
	},
	mounted() {
		// this.marker = [0, 0.1068, [40.475, 120.975]]
		this.getImg()
	},
	watch: {
		'$store.state.imgShowOnMap': {
			// 联动，监听选择区域的改变
			handler: function(newVal) {
				this.queryInfo.date = newVal
				this.getImg()
			},
			deep: true
		},
		'$store.state.markerShowOnMap': function(newVal) {
			this.marker = newVal
		},
		deep: true
	},
	methods: {
		// 获取图表图片
		async getMarkerIcon() {
			const { data: res } = await this.axios.get('img/marker')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get marker-ico data!')
			} else {
				// 删除默认图标
				delete L.Icon.Default.prototype._getIconUrl
				const icoArr = res.data
				// 配置 marker 图标
				L.Icon.Default.mergeOptions({
					iconRetinaUrl: icoArr[0],
					iconUrl: icoArr[1],
					shadowUrl: icoArr[3]
				})
			}
		},
		// 获取显示在地图上的图片
		async getImg() {
			const { data: res } = await this.axios.get('img/oceanimg', {
				params: this.queryInfo
			})
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get img data!')
			} else {
				console.log(res)
				this.imgUrl = res.data.base64Str
			}
		}
	}
}
</script>

<style lang="less" scoped>
</style>
