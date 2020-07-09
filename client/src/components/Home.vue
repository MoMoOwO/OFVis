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
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('areaChart')"
            ></el-button>
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
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('areaLineChart')"
            ></el-button>
          </div>
          <line-chart :type="lineTypeChoosed" regionChoosed="all"></line-chart>
        </el-card>
        <!-- 梯度分布图容器 -->
        <el-card class="box-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Gradient-Distribution-Chart</span>
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('boxplot')"
            ></el-button>
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
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('mapView')"
            ></el-button>
          </div>
          <map-view></map-view>
        </el-card>
        <!-- 画廊容器 -->
        <el-card class="gallery-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Map-Gallery</span>
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('mapGallery')"
            ></el-button>
          </div>
          <!-- <map-gallery></map-gallery> -->
          <maps-gll></maps-gll>
        </el-card>
      </el-main>
      <!-- 左侧 -->
      <el-main class="right-panel">
        <!-- 聚类容器 -->
        <el-card class="clustering-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>SOMClusterView</span>
            <!-- Cluster 设置弹出框 -->
            <!-- <el-popover
              placement="left-start"
              width="230"
              title="Clustering Setting"
              v-model="isClusteringSettingPopverVisible"
            >
              <el-divider content-position="center">Train Set</el-divider>
              <el-radio-group v-model="SOMCluOpt.trainSetType">
                <el-radio :label="1">Random Data</el-radio>
                <el-radio :label="2">70% Data</el-radio>
              </el-radio-group>
              <el-divider content-position="center">Clustering Features</el-divider>Moran's-I
              <el-input v-model="SOMCluOpt.MI" size="mini" type="number" placeholder="请输入内容"></el-input>Mode
              <el-input v-model="SOMCluOpt.Mo" size="mini" type="number" placeholder="请输入内容"></el-input>Qd
              <el-input v-model="SOMCluOpt.Qd" size="mini" type="number" placeholder="请输入内容"></el-input>Skewness
              <el-input v-model="SOMCluOpt.Sk" size="mini" type="number" placeholder="请输入内容"></el-input>Ex_Kurtosis
              <el-input v-model="SOMCluOpt.EK" size="mini" type="number" placeholder="请输入内容"></el-input>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="isClusteringSettingPopverVisible = false"
                >取消</el-button>
                <el-button type="primary" size="mini" @click="submitClusteringSetting">确定</el-button>
              </div>
              <el-button style="padding: 0;" slot="reference" icon="el-icon-setting" type="text"></el-button>
            </el-popover>-->
            <el-button
              style="padding: 0"
              type="text"
              icon="el-icon-info"
              @click="tipClick('somView')"
            ></el-button>
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
// import MapGallery from './charts/MapGallery.vue'
import SomView from './charts/SOMView.vue'
import MapsGll from './charts/MapsGll.vue'

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
			// SOM 聚类设置弹出框是否可见
			isClusteringSettingPopverVisible: false,
			// SOM 训练集配置项
			SOMCluOpt: {
				trainSetType: 1,
				MI: 0,
				Mo: 0,
				Qd: 0,
				SK: 0,
				EK: 0
			},
			tips: {
				areaChart: 'areaCharts tips',
				areaLineChart: 'areaLineCharts tips',
				boxplot: 'boxplot tips',
				mapView: 'mapView tips',
				mapGallery: 'mapGallery tips',
				somView: 'SOMView tips'
			},
			tipsDescription: 'Click the info-button to see tips here.'
		}
	},
	components: {
		AreaChart,
		BoxPlot,
		LineChart,
		MapView,
		// MapGallery,
		SomView,
		MapsGll
	},
	computed: {
		swiper() {
			return this.$refs.areaChartSwiperRef.swiper
		}
	},
	methods: {
		// 旧
		submitClusteringSetting() {
			console.log('提交了 Cluster 的修改')
			console.log(this.SOMCluOpt)
			this.isClusteringSettingPopverVisible = false
		},
		// 点击各个图表的 tips
		tipClick(chart) {
			console.log(chart)
			this.tipsDescription = this.tips[chart]
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
}
.el-alert {
	padding: 3px 16px;
}
</style>
