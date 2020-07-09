<template>
  <swiper ref="imgSwiper" class="swiper" :options="swiperOption">
    <div class="swiper-lazy-preloader swiper-lazy-preloader-white" v-show="!imgList.length"></div>
    <swiper-slide v-for="(index, item) in imgList" :key="item.fileName" v-show="imgList.length">
      <div style="text-align: center;">{{item.fileName}}</div>

      <!-- <img :src="item.base64Str" :title="item.fileName" @click="imgItemClicked(item)" /> -->
      <l-map style="height: 150px; width: 140px;" :center="[32.3, 126.8]" :options="mapOptions">
        <l-image-overlay :url="item.base64Str" :bounds="[[22, 117], [40.9, 135]]"></l-image-overlay>
        <!-- 海区分类 gejson 图层 -->
        <l-geo-json
          v-if="clusterShowData.date.length"
          :geojson="getShowRegionJson(index)"
          :options="getShowRegionJsonOptions(index)"
        ></l-geo-json>
      </l-map>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
	data() {
		return {
			queryInfo: {
				type: '1', // 1 月份的所有天，或者年份的 12 个月，3 日期数组
				date: this.$store.state.yearOnGallery
			},
			// 要显示带海区分类的数据
			clusterShowData: {
				date: [],
				regionId: [],
				color: []
			},
			imgList: [],
			swiperOption: {
				slidesPerView: 3,
				spaceBetween: 5,
				slidesPerGroup: 3,
				loop: true,
				loopFillGroupWithBlank: true,
				pagination: '.swiper-pagination',
				paginationClickable: true,
				simulateTouch: false // 不可触摸滑动
			},
			mapOptions: {
				zoomSnap: 0.5, // 开启小数(0.5)缩放级别
				zoom: 3,
				zoomControl: false,
				scrollWheelZoom: true,
				doubleClickZoom: false,
				dragging: true,
				attributionControl: false
			},
			// 所有海区的 geojson 数据，用于取显示海区
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
			// 在地图上显示海区的数据
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
			// 显示 geojson 配置项
			showRegionJsonOptions: {}
		}
	},
	components: {},
	created() {
		this.getImgData()
	},
	computed: {
		swiper() {
			return this.$refs.imgSwiper.swiper
		}
	},
	mounted() {
		this.swiper.slideTo(3, 10, false)
	},
	watch: {
		'$store.state.barDateChoosed': {
			// 联动，监听选择年月份的改变
			handler: function(newVal) {
				this.imgList = []
				this.queryInfo.type = '1'
				this.queryInfo.date = newVal
				this.getImgData()
			},
			deep: true
		},
		'$store.state.yearOnGallery': {
			// 联动，监听选择年月份的改变
			handler: function(newVal) {
				this.imgList = []
				this.queryInfo.type = '1'
				this.queryInfo.date = newVal
				this.getImgData()
			},
			deep: true
		},
		'$store.state.dateArrOnGallery': {
			// 联动，监听选择年月份的改变
			handler: function(newVal) {
				if (newVal.length !== 0) {
					// 有新数组
					this.imgList = []
					this.queryInfo.type = '3'
					this.queryInfo.date = newVal.join(',')
					this.getImgData()
				}
			},
			deep: true
		}
	},
	methods: {
		async getImgData() {
			this.imgList = []
			const { data: res } = await this.axios.get('img/oceanimg', {
				params: this.queryInfo
			})
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get oceanimg data!')
			} else {
				this.imgList = res.data
				this.$store.commit('selectImgShowOnMap', this.imgList[0].fileName)
			}
		},
		imgItemClicked(imgData) {
			// console.log(imgData)
			this.$store.commit('selectImgShowOnMap', imgData.fileName)
    },
    // 获取对应的 geojson 数据
    getShowRegionJson(index){

    },
    // 获取对应 geojson 配置项
    getShowRegionJsonOptions(){

    }
	}
}
</script>

<style lang="less" scoped>
.swiper {
	height: 205px;
	width: 100%;
	background-color: #ccc;
	.swiper-slide {
		/* display: flex;
		justify-content: center;
		align-items: center; */
		background-color: white;
		/* object-fit: contain;
		img {
			max-width: 100%;
			max-height: 100%;
			transform: translateY(-10px);
		} */
	}
}
</style>
