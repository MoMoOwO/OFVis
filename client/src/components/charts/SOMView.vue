<template>
  <div class="som-container">
    <!-- UMartix -->
    <v-chart
      class="umartix-container"
      theme="infographic"
      ref="unitMatrixRef"
      :init-options="this.$store.state.echartInitOption"
      :options="uMatrixOpt"
      @click="uMatrixItemClicked"
      @dblclick="uMatrixItemdblClicked"
    ></v-chart>
    <!-- WeightMartix -->
    <v-chart
      class="wmatrix-container"
      theme="infographic"
      ref="weightMatrixRef"
      :init-options="this.$store.state.echartInitOption"
      :options="wMatrixOpt"
      @restore="wMatrixTiled"
    ></v-chart>
    <!-- Tree-List -->
    <v-chart class="tree-chart" ref="treeChartRef" v-if="!showTree"></v-chart>
    <div class="tree-list" v-if="showTree">
      <span class="title-label"
        ><font color="#166369" size="4">Cluster-Tree-List</font></span
      >
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="addNewCluster"
        >Add Cluster</el-button
      >
      <vue-tree-list
        @delete-node="deleteCluster"
        @drop="changeUnitClusterId"
        :model="treeData"
        default-tree-node-name="New Cluster"
        v-bind:default-expanded="false"
      >
        <!-- 图标类插槽 -->
        <span class="icon" slot="editNodeIcon">
          <i class="el-icon-edit"></i>
        </span>
        <span class="icon" slot="delNodeIcon">
          <i class="el-icon-delete"></i>
        </span>
        <span class="icon" slot="leafNodeIcon">
          <i class="el-icon-menu"></i>
        </span>
        <!-- 作用域插槽 -->
        <template v-slot:treeNodeIcon="slotProps">
          <el-color-picker
            class="icon"
            v-model="clustersColors[slotProps.model.clusterId]"
            :predefine="predefineColors"
            size="mini"
            @change="changeClusterColor"
          ></el-color-picker>
        </template>
      </vue-tree-list>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-document-checked"
        @click="saveClusterTreeList"
        >Save Data</el-button
      >
    </div>
    <!-- 平行坐标图和散点图 -->
    <swiper class="swiper" :options="chartSwiperOptions">
      <swiper-slide>
        <!-- 平行坐标图 -->
        <v-chart
          ref="paralleRef"
          theme="infographic"
          :init-options="this.$store.state.echartInitOption"
          :options="paralleOpt"
          @axisareaselected="selectedAreaOnParalle"
        ></v-chart>
      </swiper-slide>
      <swiper-slide>
        <!-- 序列图 -->
        <v-chart
          ref="timeVariantChartRef"
          theme="infographic"
          :init-options="this.$store.state.echartInitOption"
          :options="timeVariantChartOpt"
          @click="timeVariantItemClicked"
          @dblclick="timeVariantItemdblClicked"
          @datazoom="timeVariantDataZoom"
          @restore="timeVariantRestore"
        ></v-chart>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>

    <!-- 矩阵图平铺 -->
    <el-dialog
      title="U-Matrix & Component Planes"
      ref="matrixDialogRef"
      :visible.sync="isFullScreen"
      width="70%"
    >
      <div>
        <!-- U-Matrix -->
        <div v-if="matrixData.length === 6">
          <heat-map-chart
            :title="matrixData[0].title"
            :matrixData="matrixData[0].data"
          ></heat-map-chart>
        </div>
        <!-- Component Planes -->
        <div class="component-planes-container" v-if="matrixData.length === 6">
          <heat-map-chart
            v-for="index in 5"
            :key="index"
            :title="index === 1 ? matrixData[index].title : '  '"
            :subTitle="matrixData[index].subTitle"
            :matrixData="matrixData[index].data"
          ></heat-map-chart>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/parallelAxis'
import 'echarts/lib/component/parallel'
import 'echarts/lib/component/dataZoom'
// tree-list 组件
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list'

// 引入热力图
import HeatMapChart from './HeatMapChart.vue'

export default {
  data() {
    return {
      // color: '#409EFF',
      // 提供的预选色
      // ['#5B8FF9', '#61DDAA', '#E8684A', '#F6BD16', '#7262fd', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4']
      // [ '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33' ]
      predefineColors: [
        '#5B8FF9',
        '#61DDAA',
        '#E8684A',
        '#F6BD16',
        '#7262fd',
        '#78D3F8',
        '#9661BC',
        '#F6903D',
        '#008685',
        '#F08BB4'
      ],
      // 聚类选用的颜色
      clustersColors: ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3'],
      // unit 样本统计数据，用于刷新 series，无类别标识
      unitCountData: [],
      // 散点原数据，无类别标识
      clusterScatterData: [],
      // 样本数据原数据，无类别标识
      sampleDataSet: [],
      // 权重矩阵的原数据
      weightMatrixData: [],
      // 雷达图指示器
      indicatorArr: [],
      // 矩阵图数据，用于平铺显示
      matrixData: [],
      // 是否平铺显示
      isFullScreen: false,
      // UMatrix 配置项
      uMatrixOpt: {
        title: {
          text: 'U-Matrix',
          left: 7,
          top: 5
        },
        xAxis: {
          type: 'category',
          show: false
        },
        yAxis: {
          type: 'category',
          show: false
        },
        grid: {
          left: 7,
          right: 7,
          top: 45,
          bottom: 1
          // containLabel: true
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;'
        },
        visualMap: {
          min: 0,
          max: 10,
          precision: 4,
          calculable: false,
          orient: 'horizontal',
          left: 'center',
          dimension: 2,
          inRange: {
            color: ['#f0f0f0', '#bdbdbd', '#636363']
          },
          seriesIndex: 0,
          show: false // 暂时不显示
        },
        series: [
          // 距离矩阵图
          {
            name: 'Unit',
            data: [], // [x, y, dis, unitId]
            type: 'heatmap',
            label: {
              show: false, // 暂时不显示
              position: 'insideBottomLeft',
              color: '#000',
              formatter: (p) => p.data[3],
              distance: 0,
              fontSize: 10
            },
            itemStyle: {
              normal: {},
              emphasis: {
                borderWidth: 1,
                borderColor: '#333'
              }
            },
            tooltip: {
              formatter: (p) =>
                `Unit ${p.data[3]}<br/>distance: ${p.data[2].toFixed(4)}`
            }
          },
          // unitCout
          {
            name: 'Sample Count',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) * 8
            },
            hoverAnimation: false,
            type: 'scatter',
            symbol: 'rect',
            data: [], // [x, y, count, unitId, clusterId]
            itemStyle: {
              color: (p) => this.clustersColors[p.data[4]]
            },
            tooltip: {
              formatter: (p) => `Samples Count: ${p.data[2]}`
            }
          }
        ]
      },
      // 权重矩阵配置项
      wMatrixOpt: {
        title: {
          text: 'Component-Plane',
          left: 7,
          top: 5
        },
        grid: {
          left: 7,
          right: 7,
          top: 45,
          bottom: 1
          // containLabel: true
        },
        toolbox: {
          feature: {
            restore: {
              title: 'tile',
              icon:
                'path://M32 0h-13l5 5-6 6 3 3 6-6 5 5z M32 32v-13l-5 5-6-6-3 3 6 6-5 5z M0 32h13l-5-5 6-6-3-3-6 6-5-5z M0 0v13l5-5 6 6 3-3-6-6 5-5z',
              iconStyle: {
                borderColor: '#666'
              }
            }
          },
          right: 10,
          top: 0
        },
        xAxis: {
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6'],
          show: false
        },
        yAxis: {
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6'],
          show: false
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;'
        },
        series: []
      },
      // tree 和 loading 的显示
      showTree: false,
      // 修改后树结构对象
      newTree: {},
      // 绑定树结构对象
      treeData: new Tree([
        {
          id: 1,
          isLeaf: false,
          name: 'Cluster 1',
          clusterId: 0,
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: false,
          delNodeDisabled: false,
          children: []
        },
        {
          id: 2,
          isLeaf: false,
          name: 'Cluster 2',
          clusterId: 1,
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: false,
          delNodeDisabled: false,
          children: []
        },
        {
          id: 3,
          isLeaf: false,
          name: 'Cluster 3',
          clusterId: 2,
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: false,
          delNodeDisabled: false,
          children: []
        }
      ]),
      // 平行坐标图与时序散点图切换 swiper 配置项
      chartSwiperOptions: {
        noSwiping: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        simulateTouch: false
      },
      // 平行坐标图配置项
      paralleOpt: {
        title: {
          text: 'Samples-View',
          /* textStyle: {
            color: '#166369',
            fontWeight: 'normal'
          }, */
          left: 7,
          top: 3
        },
        legend: {
          data: [],
          // right: '14%',
          // top: 3,
          bottom: 28,
          left: 'center',
          itemGap: 5,
          itemWidth: 10,
          itemHeight: 10,
          borderWidth: 1,
          borderType: 'solid',
          borderRadius: 5
        },
        toolbox: {
          feature: {
            brush: {
              type: ['clear'],
              transformable: false,
              seriesIndex: 'all',
              throttleType: 'debounce',
              throttleDelay: 1000,
              title: {
                clear: 'clear'
              }
            }
          },
          top: 0,
          right: 30
          /* tooltip: {
						textStyle: {
							fontSize: 10
						}
					} */
        },
        parallel: {
          left: 35,
          right: 45
        },
        parallelAxis: [
          { dim: 0, name: 'Mean', nameGap: 10, axisLine: { show: true } },
          { dim: 1, name: "Moran's I", nameGap: 10, axisLine: { show: true } },
          { dim: 2, name: 'IQR', nameGap: 10, axisLine: { show: true } },
          { dim: 3, name: 'Skewness', nameGap: 10, axisLine: { show: true } },
          { dim: 4, name: 'SDD', nameGap: 10, axisLine: { show: true } }
        ],
        series: []
      },
      // 时序散点图配置项
      timeVariantChartOpt: {
        title: {
          text: 'Sequence-View',
          left: 7,
          top: 3
        },
        toolbox: {
          feature: {
            restore: {
              title: 'restore'
            }
          },
          right: 30,
          top: 0
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'category',
          // name: 'regionID',
          nameTextStyle: {
            padding: [0, 0, 0, 20]
          },
          axisLabel: {
            formatter: (val) => 'R' + val
          }
        },
        grid: {
          top: 40,
          left: 35,
          right: 20,
          bottom: 80
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;',
          formatter: (p) => `Date: ${p.data[0]}<br/>RegionID: ${p.data[1]}`
        },
        dataZoom: {
          type: 'slider',
          start: 0,
          end: 100,
          showDataShadow: false,
          handleIcon:
            'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '50%',
          bottom: 30
        },
        series: {
          symbolSize: 10,
          data: [], // [x, y, unitId, clusterId]
          type: 'heatmap',
          itemStyle: {
            normal: {
              color: (p) => this.clustersColors[p.data[3]]
            }
            /* emphasis: {
              borderWidth: 1,
              borderColor: '#333'
            } */
          }
        }
      },
      selectedUnitIndex: [], // 选中项索引
      selectedUnitID: [], // 选中的 unitId
      timer: null, // 延时器
      brushTimer: null, // 刷选延时器
      itemSeriesHightlightDataIndex: [] //
    }
  },
  components: {
    'v-chart': ECharts,
    VueTreeList,
    HeatMapChart
  },
  props: [],
  created() {
    this.getClusterTreeData() // 先获取该数据，因为图表要使用该数据
  },
  mounted() {
    this.getSOMResult() // 获取 SOM 聚类信息
  },
  methods: {
    // 是否显示缓冲条
    isShowLoadding(b) {
      if (b) {
        this.$refs.unitMatrixRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
        this.$refs.weightMatrixRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
        this.$refs.paralleRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
        this.$refs.treeChartRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
      } else {
        this.$refs.unitMatrixRef.hideLoading()
        this.$refs.weightMatrixRef.hideLoading()
        this.$refs.paralleRef.hideLoading()
        this.$refs.treeChartRef.hideLoading()
      }
    },
    // 获取聚类树数据
    async getClusterTreeData() {
      const { data: res } = await this.axios.get('/som/clustertree')
      if (res.meta.status !== 200) {
        this.$message.error('Failed to get Cluster-Tree data!')
      } else {
        // 获取颜色数组
        this.clustersColors = res.data.colors
        // 为树结构的数据赋值
        // console.log(res.data.children)
        this.treeData = new Tree(res.data.children)
      }
    },
    // 前端根据 unitId 将节点内的样本进行划分
    getClusterID(unitID) {
      // 遍历分类树
      for (const clusterObj of this.treeData.children) {
        for (const unitObj of clusterObj.children) {
          if (unitObj.unitId === unitID) {
            return clusterObj.clusterId
          }
        }
      }
    },
    // 获取 SOM Result
    async getSOMResult() {
      this.isShowLoadding(true)
      const { data: res } = await this.axios.get('som/somresult')
      if (res.meta.status !== 200) {
        this.$message.error('Failed to get matrix data!')
      } else {
        this.unitCountData = res.data.unitCount // 保存原数据 备份节点样本统计数据
        this.matrixData.push({ title: 'U Matrix', data: res.data.UMatrix }) // 为平铺添加数据
        // UMatrix 矩阵
        this.setUMatrix(
          res.data.min,
          res.data.max,
          res.data.UMatrix,
          res.data.unitCount
        )

        this.weightMatrixData = res.data.WMatrix
        this.indicatorArr = res.data.indicatorArr
        // 权重矩阵
        this.setWeightsMatrix(res.data.WMatrix, res.data.indicatorArr)

        this.sampleDataSet = res.data.samplesSet // 保存原数据 备份样本数据
        // 平行坐标图
        this.setParallelChart(res.data.samplesSet, false)
        // 时空演变图
        this.setTimeVariantChart(res.data.samplesSet)

        // 图表渲染完毕
        this.showTree = true // 显示 TreeList
        this.isShowLoadding(false) // 隐藏 loading
      }
    },
    // 创建 UMatrix
    /**
     * @param {Number} min 距离颜色映射最小值
     * @param {Number} max 距离颜色映射最大值
     * @param {Array} UMatrix 距离矩阵数据
     * @param {Array} unitCount 结点样本统计数据
     */
    setUMatrix(min, max, UMatrix, unitCount) {
      // 颜色映射的最大最小值
      this.uMatrixOpt.visualMap.min = min
      this.uMatrixOpt.visualMap.max = max
      // UMatrix series 数据
      this.uMatrixOpt.series[0].data = UMatrix // [x, y, dis, unitId] 添加外层聚类矩阵灰度图数据
      // 每个结点 样本统计数据
      for (const item of unitCount) {
        item.push(this.getClusterID(item[3])) // [x, y, count, unitId, clusterId] 为每个结点添加类别信息
      }
      this.uMatrixOpt.series[1].data = unitCount // 在 UMatrix 中添加结点样本统计数据
    },
    // 根据数据用于创建权重矩阵图
    /**
     * @param {Number} size 坐标轴最大值
     * @param {Array} WMatrix 后台返回的权重矩阵数据
     * @param {Array} indicatorArr 用于雷达图的指标数组
     */
    setWeightsMatrix(WMatrix, indicatorArr) {
      const radar = [] // 雷达图坐标系
      const radarSeries = [] // 雷达图 series
      const scatterData = [] // 散点图数据

      // 遍历特征值 指标数组
      for (const obj of indicatorArr) {
        this.matrixData.push({
          title: 'Component Planes',
          subTitle: obj.text,
          data: []
        })
      }

      // 遍历 WMatrix 获取雷达图坐标系和 series 获取散点图数据
      for (const item of WMatrix) {
        // item [x, y, [radarSeriesData], unitId]
        // 获取雷达图中心点
        const center = this.$refs.weightMatrixRef.convertToPixel(
          { xAxisIndex: 0, yAxisIndex: 0 },
          [item[0] + '', item[1] + '']
        )
        // 设置并添加雷达图坐标系
        radar.push({
          indicator: indicatorArr,
          center: center,
          radius: 22,
          name: {
            show: true,
            textStyle: {
              color: 'transparent'
            }
          },
          axisLine: {
            // show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          z: 20
        })

        // 添加雷达图 series
        radarSeries.push({
          type: 'radar',
          name: 'Unit ' + item[3],
          radarIndex: item[3],
          symbol: 'none',
          areaStyle: {
            normal: {
              opacity: 1,
              color: '#ccc'
            }
          },
          tooltip: {
            formatter: (p) => {
              let res = p.seriesName + '<br />'
              const featues = ['Mean', "Morans'I", 'IQR', 'Skewness', 'SDD']
              for (let i = 0; i < p.value.length; i++) {
                res += featues[i] + '：' + p.value[i].toFixed(2) + '<br />'
              }
              return res
            }
          },
          lineStyle: {
            color: '#ccc'
          },
          data: item[2],
          z: 20
        })

        // 获取散点数据信息，用于外层圆圈
        scatterData.push([
          item[0] + '',
          item[1] + '',
          item[3],
          this.getClusterID(item[3])
        ]) // [x, y, unitId, clusterId]

        // 为 matrixData 添加数据
        const weightsArr = item[2][0].value
        for (let i = 0; i < weightsArr.length; i++) {
          this.matrixData[i + 1].data.push([
            item[0],
            item[1],
            weightsArr[i],
            item[3]
          ]) // [x, y, weight, unitId]
        }
      }

      // 散点图 series
      const scatterSeries = [
        {
          name: 'cluster',
          symbolSize: 50,
          hoverAnimation: false,
          type: 'scatter',
          data: scatterData, // [x, y, unitId, clusterId]
          itemStyle: {
            color: (p) => this.clustersColors[p.data[3]]
          },
          tooltip: {
            formatter: (p) => `Unit ${p.data[2]}`
          }
        },
        {
          symbolSize: 45,
          // hoverAnimation: false,
          type: 'scatter',
          data: scatterData, // [x, y, unitId, clusterId]
          itemStyle: {
            color: '#fff',
            opacity: 1
          },
          tooltip: {
            show: false
          },
          slient: true,
          animation: false,
          z: 10
        }
      ]

      // 在左上角添加一个雷达图坐标轴标识
      radar.push({
        indicator: indicatorArr,
        center: ['77%', '6.5%'],
        radius: 10,
        shape: 'circle',
        name: {
          show: true,
          textStyle: {
            fontSize: 10,
            color: '#636363'
          },
          formatter: (name) => {
            let res = ''
            switch (name) {
              case 'Mean':
                res = 'Me'
                break
              case 'Skewness':
                res = 'Sk'
                break
              case 'MoransI':
                res = 'MI'
                break
              default:
                res = name
            }
            return res
          }
        },
        nameGap: 1,
        splitNumber: 1,
        splitLine: {
          show: true
        },
        splitArea: {
          show: false
        },
        silent: false,
        z: 20
      })

      // 权重矩阵图 series
      const WMatrixSeries = [...scatterSeries, ...radarSeries]

      // 创建权重矩阵图表
      this.$refs.weightMatrixRef.mergeOptions({
        radar,
        series: WMatrixSeries
      })
    },
    // 创建平行坐标图和演化图
    /**
     * @param {Array} samplesSet 样本完整数据
     */
    setParallelChart(samplesSet, linked) {
      // 设置平行坐标图 legend
      const legendData = []
      // console.log(this.treeData)
      for (const obj of this.treeData.children) {
        legendData.push(obj.name)
      }
      this.paralleOpt.legend.data = legendData // 设置图例数据

      const parallelSeries = [] // 平行坐标图 series

      // 根据类别颜色数创建数组，类别数
      for (let i = 0; i < this.clustersColors.length; i++) {
        parallelSeries.push({
          name: legendData[i],
          type: 'parallel',
          lineStyle: {
            color: this.clustersColors[i],
            opacity: 0.8
          },
          data: []
        })
      }

      // 每个 BMU 结点的样本
      const samplesBMUData = []

      // 遍历样本数组，添加到对应的 BMU 中
      for (const item of samplesSet) {
        if (linked && this.selectedUnitID.indexOf(item[8]) === -1) {
          // 联动，且不是选中的 BMU 单元，则跳过
          continue
        }
        // item ['201501-1', '201501', '1', Me, MI, IQR, Sk, SDD, unitId]
        samplesBMUData[item[8]] === undefined && (samplesBMUData[item[8]] = []) // 如果 BMU 尚未有空间先添加空间

        samplesBMUData[item[8]].push(item)
      }

      // 遍历 BMU 数组，统计每个 BMU 中样本特征值的平均值
      for (const item of samplesBMUData) {
        if (item !== undefined) {
          const len = item.length
          const avgFeaturesData = [0, 0, 0, 0, 0] // 先统计特征值，再计算平均
          for (let i = 0; i < len; i++) {
            // item[i] ['201501-1', '201501', '1', Me, MI, IQR, Sk, SDD, unitId]
            avgFeaturesData[0] += item[i][3]
            avgFeaturesData[1] += item[i][4]
            avgFeaturesData[2] += item[i][5]
            avgFeaturesData[3] += item[i][6]
            avgFeaturesData[4] += item[i][7]
          }
          // 求平均
          avgFeaturesData[0] /= len
          avgFeaturesData[1] /= len
          avgFeaturesData[2] /= len
          avgFeaturesData[3] /= len
          avgFeaturesData[4] /= len

          avgFeaturesData.push(item[0][8]) // [Me, MI, IQR, Sk, SDD, unitId] 特征值平均值和 unitId

          const parallelData = {
            value: avgFeaturesData,
            lineStyle: {
              width: len
            }
          }

          const clusterId = this.getClusterID(item[0][8]) // 获取类别 id
          // item.push(clusterId)
          // arr[clusterId].push(item)
          parallelSeries[clusterId].data.push(parallelData) // 平行坐标轴，在对应类别下添加数据
        }
      }

      // 数据赋值创建两个图表
      this.paralleOpt.series = parallelSeries
    },
    // 创建时空演化图
    /**
     * @param {Array} samplesSet 样本完整数据
     */
    setTimeVariantChart(samplesSet) {
      const timeVariantChartData = [] // 时变图数据
      // 遍历样本数据
      for (const item of samplesSet) {
        // item ['201501-1', '201501', '1', MI, IQR, Sk, SDD, LALSR, unitId]
        const clusterId = this.getClusterID(item[8]) // 获取类别 id
        // 获取时变图 data
        timeVariantChartData.push([item[1], item[2], item[8], clusterId]) // [date(x), regionId(y), unitId, clusterId]
      }
      // 数据赋值创建时空演化图
      this.timeVariantChartOpt.series.data = timeVariantChartData
    },
    // 为类选择了新的 color
    changeClusterColor() {
      // uMaxtrix 配色改变
      this.$refs.unitMatrixRef.mergeOptions({
        series: {
          itemStyle: {}
        }
      })
      // 权重矩阵配色改变
      this.$refs.weightMatrixRef.mergeOptions({
        series: {
          itemStyle: {}
        }
      })
      // 平行坐标图配色改变
      // 更新平行坐标图
      this.setParallelChart(this.sampleDataSet, false)

      // 演化图更新配色
      this.$refs.timeVariantChartRef.mergeOptions({
        series: {
          itemStyle: {}
        }
      })
    },
    // 删除根节点（cluster）
    deleteCluster(node) {
      if (node.children && node.children.length !== 0) {
        // 有孩子结点
        return this.$message.error('Delete Failed：This node has children！')
      } else {
        // 改变 clusterId
        // 不改变 id， id 一直往后迭代
        this.clustersColors.pop()
        node.remove()
      }
    },
    // 添加新的类
    addNewCluster() {
      this.clustersColors.push('') // 添加一种空颜色
      const node = new TreeNode({
        isLeaf: false,
        clusterId: this.clustersColors.length - 1,
        dragDisabled: true,
        addTreeNodeDisabled: true,
        addLeafNodeDisabled: true,
        editNodeDisabled: false,
        delNodeDisabled: false
      })
      if (!this.treeData.children) this.treeData.children = []
      this.treeData.addChildren(node)
    },
    // 获取修改后的分类树结构
    getNewTree() {
      const vm = this
      function _dfs(oldNode) {
        const newNode = {
          colors: vm.clustersColors // 携带回设置好的聚类颜色
        }
        for (const k in oldNode) {
          if (k !== 'children' && k !== 'parent') {
            newNode[k] = oldNode[k]
          }
        }
        if (oldNode.children && oldNode.children.length > 0) {
          newNode.children = []
          for (let i = 0; i < oldNode.children.length; i++) {
            newNode.children.push(_dfs(oldNode.children[i]))
          }
        }
        return newNode
      }
      vm.newTree = _dfs(vm.treeData)
    },
    // 拖动修改 unit 所属的类
    /**
     * @param {Object} params
     * params.node 拖拽的节点
     * params.src 拖拽的节点的父节点
     * params.target 拖拽节点的目标节点
     */
    changeUnitClusterId(params) {
      // const moveUnitId = params.node.unitId
      const targetClusterId = params.target.clusterId
      if (typeof targetClusterId !== 'undefined') {
        const newUnitCountData = []
        const newClusterScatterData = []
        for (const item of this.unitCountData) {
          newUnitCountData.push([
            item[0],
            item[1],
            item[2],
            item[3],
            this.getClusterID(item[3])
          ]) // [x, y, count, unitId, clusterId]
        }
        for (const item of this.clusterScatterData) {
          newClusterScatterData.push([
            item[0],
            item[1],
            item[2],
            this.getClusterID(item[2])
          ]) // [x, y, unitId, clusterId]
        }
        this.uMatrixOpt.series[1].data = newUnitCountData

        // 更新权重矩阵图
        this.setWeightsMatrix(this.weightMatrixData, this.indicatorArr)

        // 更新平行坐标图
        this.setParallelChart(this.sampleDataSet, false)

        // 更新时序散点图
        this.setTimeVariantChart(this.sampleDataSet)
      } else {
        this.$message.error('Moved Error!')
        return 0
      }
    },
    // 将分类结构传递给后台保存
    async saveClusterTreeList() {
      this.getNewTree()
      const childrenData = this.newTree.children
      const { data: res } = await this.axios.put('som/clustertree/root', {
        children: childrenData
      })
      if (res.meta.status !== 200) {
        this.$message.error('Save failed!')
      } else {
        this.$message.success('Save succeeded!')
      }
    },
    // UMatrix 点选
    uMatrixItemClicked(e) {
      if (e.seriesType === 'heatmap') {
        // 响应 heatmap 的 item 项
        this.selectedUnitIndex.push(e.dataIndex)
        this.selectedUnitID.push(e.data[3])
        this.$refs.unitMatrixRef.dispatchAction({
          type: 'highlight',
          dataIndex: e.dataIndex
        })

        /* // 筛选平行坐标图的
        const parallelSeries = []
        // 根据类别颜色数创建数组，类别数
        for (let i = 0; i < this.clustersColors.length; i++) {
          parallelSeries.push({
            type: 'parallel',
            lineStyle: {
              color: (p) => {
                if (this.selectedUnitID.indexOf(p.data[8]) === -1) {
                  return 'rgb(204,204,204, 0)'
                } else {
                  return this.clustersColors[i]
                }
              },
              width: 2
            },
            data: []
          })
        }
        for (const item of this.sampleDataSet) {
          const clusterId = this.getClusterID(item[8])
          parallelSeries[clusterId].data.push(item)
        }
        // 修改平行坐标图
        this.paralleOpt.series = parallelSeries */

        this.setParallelChart(this.sampleDataSet, true)

        // 取消了时序图联动
        /* // 筛选时变图
        for (let i = 0; i < this.timeVariantChartOpt.series.data.length; i++) {
          if (
            this.selectedUnitID.indexOf(
              this.timeVariantChartOpt.series.data[i][2]
            ) !== -1
          ) {
            this.itemSeriesHightlightDataIndex.push(i)
          }
        }
        // 时序散点图高亮
        this.$refs.timeVariantChartRef.dispatchAction({
          type: 'highlight',
          dataIndex: this.itemSeriesHightlightDataIndex
        }) */

        // 延时更改，以支持多选
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 获取 gallery 中需要的数据 dateArr regionIDArr clolors
          this.$store.commit(
            'selectSampleDataOnSom',
            this.getSampleDetailData(this.selectedUnitID)
          )
        }, 2000)
      }
    },
    // UMatrix 双击取消选择
    uMatrixItemdblClicked(e) {
      // UMartix 恢复
      for (const index of this.selectedUnitIndex) {
        this.$refs.unitMatrixRef.dispatchAction({
          type: 'downplay',
          dataIndex: index
        })
      }

      // 恢复平行坐标图
      this.setParallelChart(this.sampleDataSet, false)

      // 取消了时序图联动
      /* // timescatter 恢复
      this.$refs.timeVariantChartRef.dispatchAction({
        type: 'downplay',
        dataIndex: this.itemSeriesHightlightDataIndex
      }) */
      // 置空
      this.itemSeriesHightlightDataIndex = []
      this.timer = null
      this.selectedUnitIndex = []
      this.selectedUnitID = []
      this.$store.commit('selectSampleDataOnSom', {
        date: [],
        regionId: [],
        color: []
      })
    },
    // 时变图中选中样本
    timeVariantItemClicked(e) {
      console.log('暂时取消！')
      // 记录点选的数据信息
      /* this.selectedUnitIndex.push(e.dataIndex)
      this.selectedUnitID.push(e.data[2])
      console.log(e)

      // 点选的保持高亮
      this.$refs.timeVariantChartRef.dispatchAction({
        type: 'highlight',
        dataIndex: e.dataIndex
      })

      // 筛选平行坐标图的
      const parallelSeries = []
      // 根据类别颜色数创建数组，类别数
      for (let i = 0; i < this.clustersColors.length; i++) {
        parallelSeries.push({
          type: 'parallel',
          lineStyle: {
            color: (p) => {
              if (this.selectedUnitID.indexOf(p.data[8]) === -1) {
                return 'rgb(204,204,204, 0)'
              } else {
                return this.clustersColors[i]
              }
            },
            width: 2
          },
          data: []
        })
      }
      for (const item of this.sampleDataSet) {
        const clusterId = this.getClusterID(item[8])
        parallelSeries[clusterId].data.push(item)
        console.log(item)
      }
      // 修改平行坐标图
      this.paralleOpt.series = parallelSeries

      // 延时更改，以支持多选
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 获取 gallery 中需要的数据 dateArr regionIDArr clolors
        this.$store.commit(
          'selectSampleDataOnSom',
          this.getSampleDetailData(this.selectedUnitID)
        )
      }, 2000) */
    },
    // 时变图中取消选中样本
    timeVariantItemdblClicked(e) {
      console.log('暂时取消！')
      // 时序图高亮取消
      /* for (const index of this.selectedUnitIndex) {
        this.$refs.timeVariantChartRef.dispatchAction({
          type: 'downplay',
          dataIndex: index
        })
      }

      // 恢复平行坐标图
      this.setParallelChart(this.sampleDataSet)

      // 置空
      this.timer = null
      this.selectedUnitIndex = []
      this.selectedUnitID = []
      this.$store.commit('selectSampleDataOnSom', {
        date: [],
        regionId: [],
        color: []
      }) */
    },
    // 时变图上 datazoom
    timeVariantDataZoom(e) {
      clearTimeout(this.brushTimer)
      this.brushTimer = setTimeout(() => {
        let dateArr = [] // 日期数组
        // 获取日期数据
        for (let i = 0; i < this.sampleDataSet.length; i++) {
          dateArr.push(this.sampleDataSet[i][1])
        }
        dateArr = Array.from(new Set(dateArr)) // 去重
        const start = parseInt((dateArr.length * e.start) / 100) // 开始位置
        const end = parseInt((dateArr.length * e.end) / 100 + 1) // 结束位置
        const selectDate = dateArr.slice(start, end)

        const res = this.getSampleDataFromBrush(selectDate)
        this.$store.commit('selectSampleDataOnSom', res)
      }, 2000)
    },
    // 刷选复原
    timeVariantRestore() {
      this.brushTimer = null
      this.$store.commit('selectSampleDataOnSom', {
        date: [],
        regionId: [],
        color: []
      })
    },
    // 根据选中的 unitID 数组获取日期、海区、分类颜色等数组
    getSampleDetailData(unitIDArr) {
      // 初始化样本数组，并赋空值
      const sampleDateRegionData = new Array(unitIDArr.length)
      for (let i = 0; i < sampleDateRegionData.length; i++) {
        sampleDateRegionData[i] = []
      }
      // 初始化分类 ID 数组 和 分类颜色数组
      // const clusterIDArr = new Array(unitIDArr.length)
      const clusterColorsArr = new Array(unitIDArr.length)

      for (let i = 0; i < unitIDArr.length; i++) {
        for (const item of this.sampleDataSet) {
          if (item[8] === unitIDArr[i]) sampleDateRegionData[i].push(item[0]) // 每个 unitId 对应的样本的 date-regionID 数组
        }
        const clusterID = this.getClusterID(unitIDArr[i])
        clusterColorsArr[i] = this.clustersColors[clusterID]
      }

      // 返回的数据
      const resObj = {
        date: [],
        regionId: [],
        color: []
      }

      // 遍历获取最终数据
      for (let i = 0; i < sampleDateRegionData.length; i++) {
        for (let j = 0; j < sampleDateRegionData[i].length; j++) {
          const date = sampleDateRegionData[i][j].split('-')[0]
          const region = sampleDateRegionData[i][j].split('-')[1]
          if (resObj.date.indexOf(date) === -1) {
            // 时间数组中没有该日期数据
            resObj.date.push(date)
            resObj.regionId.push([region])
            resObj.color.push([clusterColorsArr[i]])
          } else {
            // 存在该日期的数据
            const index = resObj.date.indexOf(date)
            resObj.regionId[index].push(region)
            resObj.color[index].push(clusterColorsArr[i])
          }
        }
      }
      return resObj
    },
    /**
     * @param {dateArr} 刷选的日期数组
     */
    // 时变图中刷选得到的样本数据
    getSampleDataFromBrush(dateArr) {
      // console.log(this.sampleDataSet)
      // 返回的数据
      const resObj = {
        date: dateArr,
        regionId: [],
        color: []
      }

      const samplesLen = this.sampleDataSet.length
      for (let i = 0; i < samplesLen; i++) {
        const sampleItem = this.sampleDataSet[i]
        if (resObj.date.indexOf(sampleItem[1]) !== -1) {
          // 时间数组中有该日期数据
          const index = resObj.date.indexOf(sampleItem[1])
          resObj.regionId[index] === undefined && (resObj.regionId[index] = [])
          resObj.regionId[index].push(sampleItem[2])
          resObj.color[index] === undefined && (resObj.color[index] = [])
          const clusterID = this.getClusterID(sampleItem[8])
          resObj.color[index].push(this.clustersColors[clusterID])
        }
      }

      return resObj
    },
    // 在时序散点图上 datazoom 的时候保持高亮
    dataRangeOnTimeScatter(e) {
      console.log(e)
      if (this.itemSeriesHightlightDataIndex.length !== 0) {
        console.log(e)
        this.$refs.scatterRef.dispatchAction({
          type: 'highlight',
          dataIndex: this.itemSeriesHightlightDataIndex
        })
      }
    },
    // 在平行坐标轴上进行刷选
    selectedAreaOnParalle(e) {
      // e.intervals 为该选择轴上的值区间（类别轴为起始索引，数值轴为数值上下限）
      console.log('平行坐标轴刷选了')
      /* const series0 = this.$refs.paralleRef.getModel().getSeries()[0]
			const series1 = this.$refs.paralleRef.getModel().getSeries()[1]
			const indices0 = series0.getRawIndicesByActiveState('active')
			const indices1 = series1.getRawIndicesByActiveState('active')
			console.log(indices0, indices1) */
    },
    // 展开权重矩阵平面
    wMatrixTiled() {
      this.isFullScreen = true
      console.log('矩阵图展开！')
    },
    // 全屏关闭
    fullScreenClosed() {
      this.isFullScreen = false
      console.log('即将关闭')
    }
  }
}
</script>

<style lang="less" scoped>
.som-container {
  // width: 100%;
  height: 822px;
  display: flex;
  flex-wrap: wrap;
  .umartix-container {
    width: 365px;
    height: 390px;
  }
  .wmatrix-container {
    width: 365px;
    height: 390px; /*  */
  }
  .tree-chart,
  .tree-list {
    width: 28%;
    height: 410px;
    margin: 5px 0 0 7px;
    padding: 5px;
    overflow: auto;
    .el-button {
      margin-bottom: 3px;
    }
    border: 1px #ccc dashed;
    .title-label {
      display: block;
      margin-bottom: 5px;
    }
  }
  /* 滚动条整体样式(高宽分别对应横竖滚动条的尺寸) */
  .tree-list::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  /* 滚动条里面小方块 */
  .tree-list::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  /* 滚动条里面轨道 */
  .tree-list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .icon {
    &:hover {
      cursor: pointer;
    }
    margin-right: 5px;
  }
  .swiper {
    margin-top: 5px;
    height: 420px;
    width: 500px;
    border: 1px #ccc dashed;
  }
  .u-matrix-container {
    align-items: center;
  }
  .component-planes-container {
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
