<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" />
        <span>OFViser</span>
      </div>
      <el-alert title="成功提示的文案" type="success" :closable="false"></el-alert>
    </el-header>
    <!-- 主体区域 - 圣杯布局 -->
    <el-container class="main-container">
      <!-- 右侧 -->
      <el-main class="left-panel">
        <el-card class="area-chart-card" :body-style="{ padding: '0px' }">
          <!-- 卡片头部区域 -->
          <div class="card-header" slot="header">
            <span>基础面积图</span>
            <el-button style="padding: 0;" icon="el-icon-setting" type="text"></el-button>
          </div>
          <!-- 卡片内容区域，图表区域 -->
          <area-chart></area-chart>
        </el-card>
        <el-card class="line-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>面积周期变化</span>
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
          </div>
          <line-chart :type="lineTypeChoosed"></line-chart>
        </el-card>
        <el-card class="box-chart-card" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>梯度分布图</span>
          </div>
          <box-plot></box-plot>
        </el-card>
      </el-main>
      <!-- 中部 -->
      <el-main class="mid-panel">
        <el-card class="map-card" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>地图</span>
          </div>
          <map-view></map-view>
        </el-card>
        <el-card class="gallery-card" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>画廊</span>
          </div>
        </el-card>
      </el-main>
      <!-- 左侧 -->
      <el-main class="right-panel">
        <el-card class="card-placeholder1" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>占位1</span>
          </div>
          <som-view></som-view>
        </el-card>
        <el-card class="card-placeholder2" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>占位2</span>
          </div>
        </el-card>
        <el-card class="card-placeholder3" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>占位3</span>
          </div>
        </el-card>
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
import SOMView from './charts/SOMView.vue'

export default {
	data() {
		return {
			// 折线图类型选项数组
			lineType: [
				{ value: 'polarOpt', label: 'Polar' },
				{ value: 'lineOpt', label: 'Cartesian' }
			],
			// 选中的折线图类型
			lineTypeChoosed: 'polarOpt'
		}
	},
	methods: {},
	created() {},
	mounted() {},
	components: {
		'area-chart': AreaChart,
		'box-plot': BoxPlot,
		'line-chart': LineChart,
		'map-view': MapView,
		'som-view': SOMView
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
		.card-placeholder1 {
			height: 50%;
			width: 100%;
			margin-bottom: 5px;
		}
		.card-placeholder2,
		.card-placeholder3 {
			height: 48.6%;
			width: 49.3%;
		}
		.card-placeholder2 {
			margin-right: 5px;
		}
	}
}
.el-main {
	padding: 5px;
}
.card-header {
	display: flex;
	justify-content: space-between;
}
</style>
