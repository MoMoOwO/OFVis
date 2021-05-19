<template>
  <!-- 主体区域 - 圣杯布局 -->
  <div class="analysis-container">
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
              content="As an important way to filter time series, you can click the spatial distribution of the ocean front of the date you want to view on the calendar chart (double click to cancel), and click on the bar chart to display the spatial distribution of the whole month in the Map-Gallery."
              placement="top"
              effect="light"
            >
              <el-button type="text" icon="el-icon-info"></el-button>
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
            content="The statistics of the distribution of ocean front intensity is in response to the time step flitering of Area-chart. Initially, the statistics are based on the sea Area. Click the boxplot of a sea Area to display the statistics of the 12 months of the current year in the current sea Area, and sea Area and outliers can respond by hovering over the Map-View with the mouse."
            placement="top"
            effect="light"
          >
            <el-button type="text" icon="el-icon-info"></el-button>
          </el-tooltip>
        </div>
        <box-plot></box-plot>
      </el-card>
      <!-- 多特征视图 -->
      <el-card class="features-chart-card" :body-style="{ padding: '0px' }">
        <div class="card-header" slot="header">
          <span>Features-View</span>
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
              content="Features-View is used for comparison of different attribute features and analysis of time series change trend."
              placement="top"
              effect="light"
            >
              <el-button type="text" icon="el-icon-info"></el-button>
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
            content="In response to other charts, it mainly focuses on the exploration of the oceanic fronts' stuation."
            placement="top"
            effect="light"
          >
            <el-button type="text" icon="el-icon-info"></el-button>
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
              content="The combination of small-multiple and Carousel is mainly used to display the temporal and spatial sequence of the ocean front."
              placement="top"
              effect="light"
            >
              <el-button type="text" icon="el-icon-info"></el-button>
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
            content="SOM-Clustering-View, which includes Umatrix and Component Plane with added interaction, Cluster-Tree-List with support for reclassification and color matching, Smaples-View and Sea Classification Sequence-View for property comparison"
            placement="top"
            effect="light"
          >
            <el-button type="text" icon="el-icon-info"></el-button>
          </el-tooltip>
        </div>
        <som-view></som-view>
      </el-card>
    </el-main>
  </div>
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
      // 年份选择
      yearList: [
        { value: '2015', label: '2015' },
        { value: '2016', label: '2016' },
        { value: '2017', label: '2017' }
      ],
      // 特征值选项列表
      features: [
        { value: 'Mean', label: 'Mean' },
        { value: 'MoransI', label: "Moran's I" },
        { value: 'IQR', label: 'IQR' },
        { value: 'Skewness', label: 'Skewness' },
        { value: 'SDD', label: 'SDD' }
      ],
      featureChoosed: 'MoransI',
      // Gallery 是否最大化
      isGalleryFunnlScreen: false
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
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      return key
    }
  },
  methods: {
    // 关闭 gallery 全屏
    toggleFullScreenVal(val) {
      this.isGalleryFunnlScreen = val
    }
  }
}
</script>

<style lang="less" scoped>
.analysis-container {
  width: 100%;
  background-color: #eaedf1;
  display: flex;
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
</style>
