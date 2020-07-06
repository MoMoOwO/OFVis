<template>
  <swiper ref="imgSwiper" class="swiper" :options="swiperOption">
    <div class="swiper-lazy-preloader swiper-lazy-preloader-white" v-show="!imgList.length"></div>
    <swiper-slide v-for="item in imgList" :key="item.fileName">
      <img :src="item.base64Str" :title="item.fileName" @click="imgItemClicked(item)" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
	data() {
		return {
			queryInfo: {
				type: '1',
				date: this.$store.state.yearOnGallery
			},
			imgList: [],
			swiperOption: {
				slidesPerView: 3,
				spaceBetween: 5,
				slidesPerGroup: 3,
				loop: true,
				loopFillGroupWithBlank: true,
				pagination: '.swiper-pagination',
				paginationClickable: true
			}
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
				this.queryInfo.date = newVal
				this.imgList = []
				this.getImgData()
			},
			deep: true
		},
		'$store.state.yearOnGallery': {
			// 联动，监听选择年月份的改变
			handler: function(newVal) {
				this.queryInfo.date = newVal
				this.imgList = []
				this.getImgData()
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
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		object-fit: contain;
		img {
			max-width: 100%;
			max-height: 100%;
			transform: translateY(-10px);
		}
	}
}
</style>
