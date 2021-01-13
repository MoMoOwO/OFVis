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
            <span>Area-View</span>
            <div class="optPanel">
              <el-select style="width: 120px" size="mini" v-model="yearChoosed">
                <el-option
                  v-for="item in yearList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip
                content="Click to see tips."
                placement="top"
                effect="light"
              >
                <el-button
                  type="text"
                  icon="el-icon-info"
                  @click="tipClick('areaChart')"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <!-- 卡片内容区域，图表区域 -->
          <!-- <area-chart></area-chart> -->
          <!-- 面积图区域，可滑动切换年份 -->
          <area-chart :yearChoosed="yearChoosed"></area-chart>
        </el-card>
        <!-- 梯度分布图容器 -->
        <el-card class="box-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Intensity-View</span>
            <el-tooltip
              content="Click to see tips."
              placement="top"
              effect="light"
            >
              <el-button
                type="text"
                icon="el-icon-info"
                @click="tipClick('boxplot')"
              ></el-button>
            </el-tooltip>
          </div>
          <box-plot></box-plot>
        </el-card>
        <!-- 多特征视图 -->
        <el-card class="features-chart-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Features-View</span>
            <!-- <el-divider direction="vertical"></el-divider>
            <el-radio v-model="radio" label="1">Polar</el-radio>
            <el-radio v-model="radio" label="2">Cartesian</el-radio>
            <el-divider direction="vertical"></el-divider> -->
            <div class="optPanel">
              <!-- 特征值选择 -->
              <el-select
                style="width: 120px"
                size="mini"
                v-model="featureChoosed"
              >
                <el-option
                  v-for="item in features"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip
                content="Click to see tips."
                placement="top"
                effect="light"
              >
                <el-button
                  type="text"
                  icon="el-icon-info"
                  @click="tipClick('areaLineChart')"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <scatter-line-chart :feature="featureChoosed"></scatter-line-chart>
        </el-card>
      </el-main>
      <!-- 中部 -->
      <el-main class="mid-panel">
        <!-- 地图容器 -->
        <el-card class="map-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Map-View</span>
            <el-tooltip
              content="Click to see tips."
              placement="top"
              effect="light"
            >
              <el-button
                type="text"
                icon="el-icon-info"
                @click="tipClick('mapView')"
              ></el-button>
            </el-tooltip>
          </div>
          <map-view></map-view>
        </el-card>
        <!-- 画廊容器 -->
        <el-card class="gallery-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Map-Gallery</span>
            <div class="optPanel">
              <el-tooltip content="Full Screen" placement="top" effect="light">
                <el-button
                  type="text"
                  icon="el-icon-full-screen"
                  @click="isGalleryFunnlScreen = !isGalleryFunnlScreen"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="Click to see tips."
                placement="top"
                effect="light"
              >
                <el-button
                  type="text"
                  icon="el-icon-info"
                  @click="tipClick('mapGallery')"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <map-gallery
            :isFullScreen="isGalleryFunnlScreen"
            @closeFullScreen="toggleFullScreenVal"
          ></map-gallery>
        </el-card>
      </el-main>
      <!-- 左侧 -->
      <el-main class="right-panel">
        <!-- 聚类容器 -->
        <el-card class="clustering-card" :body-style="{ padding: '0px' }">
          <div class="card-header" slot="header">
            <span>Clustering-View</span>
            <el-tooltip
              content="Click to see tips."
              placement="top"
              effect="light"
            >
              <el-button
                type="text"
                icon="el-icon-info"
                @click="tipClick('somView')"
              ></el-button>
            </el-tooltip>
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
import ScatterLineChart from './charts/ScatterLineChart.vue'
import MapView from './charts/MapView.vue'
import MapGallery from './charts/MapGallery.vue'
import SomView from './charts/SOMView.vue'

export default {
  data() {
    return {
      yearList: [
        { value: '2015', label: '2015' },
        { value: '2016', label: '2016' },
        { value: '2017', label: '2017' }
      ],
      radio: 1, // 坐标系选择
      // 特征值选项列表
      features: [
        { value: 'MoransI', label: "Moran's I" },
        { value: 'IQR', label: 'IQR (Interquartile Range)' },
        { value: 'Skewness', label: 'Skewness' },
        { value: 'SDD', label: 'SDD (Spatial Distribution Density)' },
        {
          value: 'LALSR',
          label: 'LALSR (Longitude and Latitude Dimension Span Ratio)'
        }
      ],
      featureChoosed: 'MoransI',
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
    ScatterLineChart,
    MapView,
    MapGallery,
    SomView
  },
  computed: {
    // 双向绑定选择的年份
    yearChoosed: {
      get() {
        return this.$store.state.yearOnGallery
      },
      set(value) {
        this.$store.commit('changeYearOnGallery', value)
      }
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
    .features-chart-card,
    .box-chart-card {
      width: 58.5%;
      height: 49.42%;
      margin-right: 2.5px;
    }
    .features-chart-card {
      margin-top: 4px;
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
  align-items: center;
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
.el-radio {
  margin-right: 0;
  line-height: inherit;
}
</style>
