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
        <el-card id="area-chart-card" :body-style="{ padding: '0px' }">
          <!-- 卡片头部区域 -->
          <div slot="header">
            <span>面积图</span>
            <el-button style="float: right; padding: 5px" icon="el-icon-setting" type="text"></el-button>
          </div>
          <!-- 卡片内容区域，图表区域 -->
          <area-chart></area-chart>
        </el-card>
        <el-card id="line-chart-card">
          <div slot="header">
            <span>雷达折线图</span>
          </div>
        </el-card>
        <el-card id="box-chart-card">
          <div slot="header">
            <span>箱线图</span>
          </div>
        </el-card>
      </el-main>
      <!-- 中部 -->
      <el-main class="mid-panel">
        <el-card id="map-card">
          <div slot="header">
            <span>地图</span>
          </div>
        </el-card>
        <el-card id="gallery-card">
          <div slot="header">
            <span>画廊</span>
          </div>
        </el-card>
      </el-main>
      <!-- 左侧 -->
      <el-main class="right-panel">
        <el-card id="card-placeholder1">
          <div slot="header">
            <span>占位1</span>
          </div>
        </el-card>
        <el-card id="card-placeholder2">
          <div slot="header">
            <span>占位2</span>
          </div>
        </el-card>
        <el-card id="card-placeholder3">
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

export default {
	data() {
		return {}
	},
	methods: {},
	created() {},
	mounted() {},
	components: {
		'area-chart': AreaChart
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
	background-color: #eaedf1;
	.left-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		padding-right: 2.5px;
		#area-chart-card {
			width: 40%;
			height: 100%;
			margin-right: 5px;
		}
		#line-chart-card,
		#box-chart-card {
			width: 58.5%;
			height: 49.42%;
			margin-right: 2.5px;
		}
		#line-chart-card {
			margin-bottom: 5px;
		}
	}
	.mid-panel {
		flex: none;
		width: 440px;
		padding: 5px 2.5px;
		#map-card {
			height: 70%;
		}
		#gallery-card {
			margin-top: 5px;
			height: 28.7%;
		}
	}
	.right-panel {
		flex: 1;
		padding-left: 2.5px;
		display: flex;
		flex-wrap: wrap;
		#card-placeholder1 {
			height: 50%;
			width: 100%;
			margin-bottom: 5px;
		}
		#card-placeholder2,
		#card-placeholder3 {
			height: 48.6%;
			width: 49.3%;
		}
		#card-placeholder2 {
			margin-right: 5px;
		}
	}
}
.el-main {
	padding: 5px;
}
.el-card > .el-card__header {
	background-color: yellowgreen;
}
</style>
