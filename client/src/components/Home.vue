<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" />
        <span>OFViser</span>
      </div>
      <el-alert
        title="Tips："
        :description="tipsDescription"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>
    </el-header>
    <!-- 主体区域 - 圣杯布局 -->
    <el-container class="main-container">
      <!-- 右侧 -->
      <el-main class="left-panel">
        <!-- 基础面积图 -->
        <el-card class="area-chart-card" :body-style="{ padding: '0px' }">
          <!-- 卡片头部区域 -->
          <div class="card-header" slot="header">
            <span>Area-Chart</span>
            <el-button type="text" icon="el-icon-info" @click="tipClick('areaChart')"></el-button>
          </div>
          <!-- 卡片内容区域，图表区域 -->
          <!-- <area-chart></area-chart> -->
          <!-- 面积图区域，可滑动切换年份 -->
          <swiper ref="areaChartSwiperRef" :options="areaChartSwiperOptions">
            <swiper-slide v-for="year in areaChartYearArr" :key="year">
              <area-chart :yearChoosed="year"></area-chart>
            </swiper-slide>
            <div class="swiper-pagination" click="swiperPaginationClicked" slot="pagination"></div>
          </swiper>
        </el-card>
        <!-- 面积周期比较折线图容器 -->
        <el-card class="line-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Area-Periodogram</span>
            <div class="optPanel">
              <el-select
                style="width: 120px;"
                size="mini"
                v-model="lineTypeChoosed"
                placeholder="choose"
              >
                <el-option
                  v-for="item in lineType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button type="text" icon="el-icon-info" @click="tipClick('areaLineChart')"></el-button>
            </div>
          </div>
          <line-chart :type="lineTypeChoosed" regionChoosed="all"></line-chart>
        </el-card>
        <!-- 梯度分布图容器 -->
        <el-card class="box-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Gradient-Distribution-Chart</span>
            <el-button type="text" icon="el-icon-info" @click="tipClick('boxplot')"></el-button>
          </div>
          <box-plot></box-plot>
        </el-card>
      </el-main>
      <!-- 中部 -->
      <el-main class="mid-panel">
        <!-- 地图容器 -->
        <el-card class="map-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Map-View</span>
            <el-button type="text" icon="el-icon-info" @click="tipClick('mapView')"></el-button>
          </div>
          <map-view></map-view>
        </el-card>
        <!-- 画廊容器 -->
        <el-card class="gallery-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Map-Gallery</span>
            <div class="optPanel">
              <el-button
                type="text"
                icon="el-icon-full-screen"
                @click="isGalleryFunnlScreen = !isGalleryFunnlScreen"
              ></el-button>
              <el-button type="text" icon="el-icon-info" @click="tipClick('mapGallery')"></el-button>
            </div>
          </div>
          <map-gallery :isFullScreen="isGalleryFunnlScreen" @closeFullScreen="toggleFullScreenVal"></map-gallery>
        </el-card>
      </el-main>
      <!-- 左侧 -->
      <el-main class="right-panel">
        <!-- 聚类容器 -->
        <el-card class="clustering-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>SOMClusterView</span>
            <el-button type="text" icon="el-icon-info" @click="tipClick('somView')"></el-button>
          </div>
          <som-view></som-view>
        </el-card>
        <!-- <el-card class="card-placeholder2" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>占位2</span>
          </div>
        </el-card>
        <el-card class="card-placeholder3" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>占位3</span>
          </div>
        </el-card>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入 chart 组件
import AreaChart from './charts/AreaChart.vue'
import BoxPlot from './charts/Boxplot.vue'
import LineChart from './charts/LineChart.vue'
import MapView from './charts/MapView.vue'
import MapGallery from './charts/MapGallery.vue'
import SomView from './charts/SOMView.vue'

export default {
	data() {
		return {
			// 日历柱状面积图 swiper 配置项
			areaChartSwiperOptions: {
				direction: 'vertical', // 垂直方向移动
				autoHeight: true,
				height: 825,
				pagination: '.swiper-pagination',
				paginationClickable: true,
				onSlideChangeEnd: swiper => {
					// 修改在 gallery 上显示的年份数据
					this.$store.commit(
						'changeYearOnGallery',
						this.areaChartYearArr[swiper.realIndex]
					)
				}
			},
			areaChartYearArr: [2015, 2016, 2017],
			// 折线图类型选项数组
			lineType: [
				{ value: 'polarOpt', label: 'Polar' },
				{ value: 'lineOpt', label: 'Cartesian' }
			],
			// 选中的折线图类型
			lineTypeChoosed: 'polarOpt',
			// Gallery 是否最大化
			isGalleryFunnlScreen: false,
			tips: {
				areaChart:
					'时间序列筛选的重要途径，可以在日历图上点选想要查看的日期的海洋锋空间分布情况(双击取消)，在条形图上点选会在 Map-Gallery 中显示整个月的空间分布情况',
				areaLineChart:
					'可以选择极坐标系或者直角坐标系，极坐标系有利于周期性的发现，而直角坐标系更适合比较，支持点选进行海洋锋空间分布的查看与比较',
				boxplot:
					'海洋锋强度分布情况的统计，响应 Area-Chart 的时间筛选，初始按海区统计，点击某个海区的 boxplot 会显示当前海区当前年份十二个月份的统计情况，海区与 outliers 能够通过鼠标悬浮在 Map-View 上响应。',
				mapView: '响应其他图表，主要进行聚焦的海洋锋空间状态探索',
				mapGallery:
					'Small-Multiple 与 Carousel 的结合，主要用于海洋锋时空序列的展示',
				somView:
					'SOM 聚类窗口，不仅包括增加了交互的 UMatrix 和 Component Plane，还设置了支持重新分类与配色的 Cluster Tree List，此外还有属性相关性研究的 Parallel 和 海区分类时序散点图'
			},
			tipsDescription: 'Click the info-button to see tips here.'
		}
	},
	components: {
		AreaChart,
		BoxPlot,
		LineChart,
		MapView,
		MapGallery,
		SomView
	},
	computed: {
		swiper() {
			return this.$refs.areaChartSwiperRef.swiper
		}
	},
	methods: {
		// 点击各个图表的 tips
		tipClick(chart) {
			console.log(chart)
			this.tipsDescription = this.tips[chart]
		},
		// 关闭 gallery 全屏
		toggleFullScreenVal(val) {
			this.isGalleryFunnlScreen = val
		}
	}
}
</script>

<style lang="less" scoped>
.home-container {
	height: 100%;
}
.el-header {
	background-color: #ccc;
	display: flex;
	padding-left: 0;
	align-items: center;
	color: #fff;
	font-size: 20px;
	> div {
		display: flex;
		align-items: center;
		span {
			margin: 0px 15px;
		}
		img {
			height: 75px;
			width: 75px;
		}
	}
}
.main-container {
	width: 100%;
	height: 850px;
	background-color: #eaedf1;
	.left-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		padding-right: 2.5px;
		.area-chart-card {
			width: 40%;
			height: 100%;
			margin-right: 5px;
		}
		.line-chart-card,
		.box-chart-card {
			width: 58.5%;
			height: 49.42%;
			margin-right: 2.5px;
		}
		.line-chart-card {
			margin-bottom: 5px;
		}
	}
	.mid-panel {
		flex: none;
		width: 440px;
		padding: 5px 2.5px;
		.map-card {
			height: 70%;
		}
		.gallery-card {
			margin-top: 5px;
			height: 28.7%;
		}
	}
	.right-panel {
		flex: 1;
		padding-left: 2.5px;
		display: flex;
		flex-wrap: wrap;
		width: 740px;

		.clustering-card {
			height: 99.4%;
			width: 100%;
			//margin-bottom: 5px;
		}
		/* .card-placeholder2,
		.card-placeholder3 {
			height: 48.6%;
			width: 49.3%;
		}
		.card-placeholder2 {
			margin-right: 5px;
		} */
	}
}
.el-main {
	padding: 5px;
}
.card-header {
	display: flex;
	justify-content: space-between;
	line-height: 28px;
	.el-button {
		padding: 0;
	}
	.optPanel {
		display: flex;
		.el-button {
			margin-left: 5px;
		}
	}
}
.el-alert {
	padding: 3px 16px;
}
</style>
