<template>
  <!-- 地图根容器 -->
  <l-map style="height: 555px; width: 100%;" :center="[33.9, 124.2]" :options="mapOptions">
    <!-- 地图瓦片 -->
    <l-tile-layer :url="tileUrl"></l-tile-layer>
    <!-- 图片图层 -->
    <!-- <l-image-overlay
      :url="imgUrl.length === 0 ? '' : imgUrl"
      :bounds="[[21.975, 116.975], [40.75, 134.06]]"
    ></l-image-overlay>-->
    <l-image-overlay :url="imgUrl.length === 0 ? '' : imgUrl" :bounds="[[22, 117], [40.9, 135]]"></l-image-overlay>
    <!-- 是否显示海区图层 -->
    <l-control class="control-panel" position="bottomleft">
      <span>Region:</span>
      <br />
      <el-switch
        style="{margin-top: 5px;}"
        v-model="isShowRegion"
        size="mini"
        active-color="#13ce66"
      ></el-switch>
    </l-control>
    <!-- GeoJson 图层 全海区 -->
    <l-geo-json v-if="isShowRegion" :options="geoJsonOptions" :geojson="geojson"></l-geo-json>

    <!-- 交互显示的图层 -->
    <!-- marker 图层 -->
    <l-marker :lat-lng="marker.length ? marker[2] : [0,0]" v-show="!marker.length">
      <l-tooltip>{{marker.length ? `Gradient: ${marker[1]}℃/km [${marker[2]}]` : [0,0]}}</l-tooltip>
    </l-marker>
    <!-- markers 图层 -->
    <!-- <l-marker :lat-lng="marker[2]">
      <l-tooltip>{{RegionID: marker[0]+1 <br/> }}</l-tooltip>
    </l-marker>-->
    <!-- gejson 图层 -->
    <l-geo-json :geojson="showRegionJson" :options="showRegionJsonOptions"></l-geo-json>
  </l-map>
</template>

<script>
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
	data() {
		return {
			// 地图瓦片地址
			tileUrl:
				'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA',
			// 地图配置项
			mapOptions: {
				zoomSnap: 0.5, // 开启小数(0.5)缩放级别
				zoom: 5.5,
				zoomControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: false,
				dragging: true,
				attributionControl: false
			},
			// 查询信息
			queryInfo: {
				type: '2', // 获取指定日期的数据
				date: this.$store.state.imgShowOnMap
			},
			// 图片图层图片 URL
			imgUrl: '', // 图片
			// 是否显示 Region
			isShowRegion: false,
			// geojson数据
			geojson: {
				type: 'FeatureCollection',
				features: [
					{
						properties: {
							note: '1',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[117.5, 41],
									[117.5, 37],
									[119.35, 37],
									[120, 38.5],
									[122, 38.5],
									[122, 40],
									[123, 41],
									[117.5, 41]
								]
							]
						}
					},
					{
						properties: {
							note: '2',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[122, 40],
									[126, 40],
									[126, 38],
									[127, 38],
									[127, 36],
									[124, 36],
									[124, 38],
									[122, 38.5],
									[122, 40]
								]
							]
						}
					},
					{
						properties: {
							note: '3',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[122, 38.5],
									[120, 38.5],
									[118.5, 35],
									[124, 35],
									[124, 38],
									[122, 38.5]
								]
							]
						}
					},
					{
						properties: {
							note: '4',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[123, 35],
									[124, 35],
									[124, 36],
									[129.2, 36],
									[132, 35],
									[132, 33],
									[125.7, 33],
									[123, 34.5],
									[123, 35]
								]
							]
						}
					},
					{
						properties: {
							note: '5',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[118.5, 35],
									[118.5, 30],
									[122.4, 30],
									[123, 31],
									[123, 31.5],
									[123.8, 32.2],
									[123.8, 32.8],
									[123, 33.4],
									[123, 35],
									[118.5, 35]
								]
							]
						}
					},
					{
						properties: {
							note: '6',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[131.3, 33],
									[131.3, 31],
									[127.7, 31],
									[127.7, 33],
									[131.3, 33]
								]
							]
						}
					},
					{
						properties: {
							note: '7',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[117, 30],
									[116.3, 23.1],
									[118, 23.1],
									[120.3, 24],
									[123, 27.6],
									[123.3, 29.5],
									[123, 31],
									[122.4, 30],
									[117, 30]
								]
							]
						}
					},
					{
						properties: {
							note: '8',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[110, 18.5],
									[110, 23.1],
									[118, 23.1],
									[120.3, 24],
									[120.3, 22],
									[112, 18.5],
									[110, 18.5]
								]
							]
						}
					},
					{
						properties: {
							note: '9',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[120.3, 24],
									[122, 25],
									[124, 25],
									[124, 19.5],
									[122, 19.5],
									[120.3, 22],
									[120.3, 24]
								]
							]
						}
					},
					{
						properties: {
							note: '10',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[127.7, 31],
									[126, 29],
									[123.062, 28],
									[123, 27.6],
									[120.3, 24],
									[122, 25],
									[126, 25],
									[131.3, 31],
									[127.7, 31]
								]
							]
						}
					},
					{
						properties: {
							note: '11',
							distance: '1845824.01 m',
							drawtype: 'polygon',
							area: '21646118.32 ha'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[123, 34.5],
									[123, 33.4],
									[123.8, 32.8],
									[123.8, 32.2],
									[123, 31.5],
									[123, 31],
									[123.3, 29.5],
									[123.062, 28],
									[126, 29],
									[127.7, 31],
									[127.7, 33],
									[125.7, 33],
									[123, 34.5]
								]
							]
						}
					},
					{
						properties: {
							note: '12',
							distance: '',
							drawtype: 'polygon',
							area: ''
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[131.3, 31],
									[126, 25],
									[124, 25],
									[124, 19.5],
									[131.3, 19.5],
									[131.3, 31]
								]
							]
						}
					},
					{
						properties: {
							note: '13',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[132, 35],
									[129.2, 36],
									[127, 36],
									[127, 38],
									[126, 38],
									[126, 40],
									[122, 40],
									[123, 41],
									[132, 41],
									[132, 35]
								]
							]
						}
					}
				]
			},
			// geojson 图层配置项
			geoJsonOptions: {
				onEachFeature: (feature, layer) => {
					return layer.bindTooltip(
						'<div>RegionID:' + feature.properties.note + '</div>',
						{ permanent: false, sticky: true }
					)
				},
				style: {
					weight: 1,
					color: '#ccc',
					fillColor: '#ECEFF1',
					fillOpacity: 0.2
				}
				/* feature => {
					if (this.regionId === 'all') {
						return {
							weight: 1,
							color: this.color,
							fillColor: this.color,
							fillOpacity: 0.2
						}
					} else {
						return {
							weight: feature.properties.note === this.regionId ? 1 : 0,
							color:
								feature.properties.note === this.regionId ? this.color : '',
							fillColor:
								feature.properties.note === this.regionId ? this.color : '',
							fillOpacity: feature.properties.note === this.regionId ? 0.2 : 0
						}
					}
				} */
			},
			marker: this.$store.state.markerShowOnMap, // 悬浮交互显示的点
			markers: [], // 点选交互显示的点集
			regionsId: this.$store.state.regionsShowOnMap, // 在地图上显示的海区 id
			regionsColors: this.$store.state.regionsColors, // 海区的颜色标记
			showRegionJson: {
				type: 'FeatureCollection',
				features: [
					{
						properties: {
							note: '-1',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[0, 0],
									[0, 1],
									[0, 0]
								]
							]
						}
					}
				]
			},
			showRegionJsonCopy: {
				type: 'FeatureCollection',
				features: [
					{
						properties: {
							note: '-1',
							drawtype: 'polygon'
						},
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[0, 0],
									[0, 1],
									[0, 0]
								]
							]
						}
					}
				]
			},
			showRegionJsonOptions: {}
		}
	},
	created() {
		// 从后台获取 marker 图表
		// this.getMarkerIcon()
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
		'$store.state.markerShowOnMap': {
			handler: function(newVal) {
				this.marker = newVal
			},
			deep: true
		},
		'$store.state.regionsShowOnMap': {
			handler: function(newVal) {
				this.getRegionGeoJsonShowOnMap(newVal, this.$store.state.regionsColors)
				// console.log(newVal, this.$store.state.regionsColors)
			},
			deep: true
		}
	},
	methods: {
		// 获取图表图片
		async getMarkerIcon() {
			/* const DefaultIcon = L.icon({
				iconUrl: markerIcon,
				iconRetinaUrl: markerIcon2x,
				shadowUrl: markerShadow,
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				tooltipAnchor: [16, -28],
				shadowSize: [41, 41]
			})
			L.Marker.prototype.options.icon = DefaultIcon */
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
					shadowUrl: icoArr[3],
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					tooltipAnchor: [16, -28],
					shadowSize: [41, 41]
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
				this.imgUrl = res.data.base64Str
			}
		},
		// 跟据传递的参数获取对应海区的 GeoJson 和 Options
		getRegionGeoJsonShowOnMap(ids, colors) {
			const features = []
			for (const index of ids) {
				for (const feature of this.geojson.features) {
					if (feature.properties.note === index + '') {
						features.push(feature)
					}
				}
			}
			this.showRegionJson.features = features
			this.showRegionJsonOptions = {
				style: feature => {
					if (this.regionsColors.length === 0) {
						return {
							weight: 1,
							color: '#000',
							fillColor: '#ECEFF1',
							fillOpacity: 0.2
						}
					} else {
						return {
							weight: 1,
							color: this.regionsColors[+feature.properties.note],
							fillColor: this.regionsColors[+feature.properties.note],
							fillOpacity: 0.2
						}
					}
				}
			}
		}
	}
}
</script>

<style lang="less" scoped>
.leaflet-control {
	padding: 6px 8px;
	font: 14px/16px Arial, Helvetica, sans-serif;
	background: white;
	background: rgba(255, 255, 255, 0.8);
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	border-radius: 5px;
	.el-switch {
		margin-top: 5px;
	}
}
</style>
