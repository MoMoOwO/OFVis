<template>
  <div class="box-plot">
    <v-chart
      ref="boxPlot"
      theme="infographic"
      :init-options="this.$store.state.echartInitOption"
      :options="boxOpt"
      @click="boxPlotItemClicked"
      @restore="boxPlotItemsRestore"
    />
    <!-- 暂时删除鼠标悬浮与移出事件 -->
    <!-- @mouseover="boxPlotItemMouseover"
    @mouseout="boxPlotItemMouseout" -->
  </div>
</template>

<script>
// 主题
import 'echarts/theme/infographic.js'
// 组件
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  data() {
    return {
      queryInfo: {
        type: '1', // 请求类型，1 为所有海区，2 为请求某海域所有月份数据
        regionId: this.$store.state.boxRegionChoosed, // 默认初始请求所有海区数据
        date: this.$store.state.barDateChoosed
      },
      isClickSelectRegion: false,
      boxOpt: {
        title: {
          text:
            this.$store.state.barDateChoosed +
            ' ' +
            this.$store.getters.getRegionIDLabel,
          right: 8,
          top: 15
        },
        legend: {
          left: 5,
          top: 5,
          data: ['Outliers', 'Distribution', 'Mean'],
          itemGap: 5,
          itemWidth: 10,
          itemHeight: 10,
          borderWidth: 1,
          borderType: 'solid',
          borderRadius: 5
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: false,
          showTitle: false,
          feature: {
            restore: {
              icon:
                'path://M23.808 32c3.554-6.439 4.153-16.26-9.808-15.932v7.932l-12-12 12-12v7.762c16.718-0.436 18.58 14.757 9.808 24.238z'
            }
          },
          left: 0,
          top: 0
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 15,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: null,
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          triggerEvent: true,
          axisLabel: {
            formatter: (p) => {
              if (p.length < 3) {
                // 海区
                return 'R' + p
              } else {
                const months = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ]
                return months[p.slice(-2) - 1]
              }
            },
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '℃/km',
          // scale: true,
          /* splitArea: {
						show: true
					} */
          nameTextStyle: {
            padding: [0, 0, 0, 20]
          }
        },
        series: [
          {
            name: 'Distribution',
            type: 'boxplot',
            data: null,
            itemStyle: {
              normal: {
                borderColor: '#5B8FF9',
                borderWidth: 1
                // color: '#D9EAFF'
              }
            },
            tooltip: {
              formatter: (param) => {
                let name = ''
                param.name.length <= 2
                  ? (name = 'RegionID: ')
                  : (name = 'Date: ')
                return [
                  name + param.name,
                  'upper: ' + param.data[5].toFixed(4) + '℃/km',
                  'Q3: ' + param.data[4].toFixed(4) + '℃/km',
                  'median: ' + param.data[3].toFixed(4) + '℃/km',
                  'Q1: ' + param.data[2].toFixed(4) + '℃/km',
                  'lower: ' + param.data[1].toFixed(4) + '℃/km'
                ].join('<br/>')
              }
            }
          },
          {
            name: 'Outliers',
            type: 'scatter',
            itemStyle: {
              normal: {
                color: '#E8684A'
              }
            },
            symbolSize: 7,
            tooltip: {
              formatter: (p) => {
                let tooltip = ''
                p.name.length <= 2
                  ? (tooltip = `${p.seriesName}<br/>Region ${p.name}：${p.value[1]}℃/km`)
                  : (tooltip = `${p.seriesName}<br/>${p.name}：${p.value[1]}℃/km`)
                return tooltip
              }
            },
            data: null
          },
          {
            name: 'Mean',
            type: 'scatter',
            symbol: 'triangle',
            z: 5,
            symbolSize: 10,
            itemStyle: {
              color: '#F6BD16'
            },
            tooltip: {
              // show: false
              formatter: (p) => {
                let name = ''
                p.name.length <= 2 ? (name = 'RegionID: ') : (name = 'Date: ')
                const res = `${name}${p.name}</br>mean: ${p.value.toFixed(
                  4
                )}℃/km`
                return res
              }
            },
            data: null
          }
        ]
      }
    }
  },
  components: {
    'v-chart': ECharts
  },
  mounted() {
    this.getBoxplotData()
  },
  watch: {
    '$store.state.boxRegionChoosed': {
      // 联动，监听选择区域的改变
      handler: function (newVal) {
        this.queryInfo.regionId = newVal
      },
      deep: true
    },
    '$store.state.barDateChoosed': {
      // 响应柱状图选中的年月份
      handler: function (newVal) {
        this.queryInfo.date = newVal
        this.boxOpt.title.text =
          this.$store.state.barDateChoosed +
          ' ' +
          this.$store.getters.getRegionIDLabel
        this.getBoxplotData()
      },
      deep: true
    },
    '$store.state.yearOnGallery': {
      // 联动，监听年份变化
      handler: function (newVal) {
        this.queryInfo.date = newVal + '01'
        this.boxOpt.title.text =
          newVal + '01' + ' ' + this.$store.getters.getRegionIDLabel
        this.getBoxplotData()
      },
      deep: true
    }
  },
  methods: {
    // 是否显示缓冲条
    isShowLoadding(b) {
      if (b) {
        this.$refs.boxPlot.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
      } else {
        this.$refs.boxPlot.hideLoading()
      }
    },
    // 获取箱线图数据
    async getBoxplotData() {
      this.isShowLoadding(true)
      const { data: res } = await this.axios.get('data/boxdata', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('Failed to get boxplot data!')
      } else {
        // console.log(res.data)
        // 为图表数据赋值
        this.boxOpt.xAxis.data = res.data.axisData
        this.boxOpt.series[0].data = res.data.boxData
        this.boxOpt.series[1].data = res.data.outliers
        this.boxOpt.series[2].data = res.data.meanData
        this.isShowLoadding(false)
      }
    },
    // 点击箱线图数据项
    boxPlotItemClicked(e) {
      if (e.componentType === 'xAxis') {
        // 点击一层海域标签
        // 标记是点击触发显示海区联动
        this.isClickSelectRegion = true
        // 关闭 x 轴交互
        this.boxOpt.xAxis.triggerEvent = false
        // 修改查询条件
        this.queryInfo.type = '2'
        // 通过箱线图点击箱体选择一个海区，面积图和面积折线图调正显示为选择海区的面积统计
        this.$store.commit('selectedRegionIDOnAxis', +e.value) // 修改状态管理器中的数据，保持面积图表联动更新
        this.queryInfo.date = this.queryInfo.date.slice(0, 4)
        this.boxOpt.title.text =
          this.queryInfo.date.slice(0, 4) +
          ' ' +
          this.$store.getters.getRegionIDLabel
        // 请求新数据
        this.getBoxplotData()
        // 左移 legend
        this.boxOpt.legend.left = 27
        // 显示 restore 按钮
        this.boxOpt.toolbox.show = true
        // 地图显示海区
        // 显示对应海区
        this.$store.commit('changeRegionShowOnMap', [+e.value])
        // 在地图上显示 geojson 图层
        this.$store.commit('changeStateOfGeoJsonOnMap', true)
        // this.$store.commit('changeRegionShowOnMap', [+e.name])
      } else if (e.name.length <= 2 && e.seriesType === 'scatter') {
        // 点击一层散点
        // 点击散点在地图上添加标注
        console.log(`点击了点，日期${this.queryInfo.date}，数据${e.data}`)
      } else if (e.name.length === 6 && e.seriesType === 'scatter') {
        // 点击二层散点
        console.log(`点击了点，日期${e.name}，数据${e.data}`)
      } else {
        // 其他情况
        console.log('点击了其他情况：' + e)
        return 0
      }
    },
    boxPlotItemMouseover(e) {
      if (e.componentType === 'xAxis') {
        // 一层箱线图，海区
        // console.log(e.name + 1) // 海区 id
        this.$store.commit(
          'selectImgShowOnMap',
          this.$store.state.barDateChoosed
        )
        // 显示对应海区
        this.$store.commit('changeRegionShowOnMap', [+e.value])
        // 在地图上显示 geojson 图层
        this.$store.commit('changeStateOfGeoJsonOnMap', true)
      } else if (e.name.length <= 2 && e.seriesType === 'scatter') {
        // 一层散点
        this.$store.commit(
          'selectImgShowOnMap',
          this.$store.state.barDateChoosed
        )
        this.$store.commit('hoverPointOnBoxplot', e.data)
      } else if (e.name.length === 6 && e.seriesType === 'scatter') {
        // 二层散点
        // console.log(e)
        this.$store.commit('selectImgShowOnMap', e.name)
        this.$store.commit('hoverPointOnBoxplot', e.data)
      } else if (e.name.length === 6 && e.seriesType === 'boxplot') {
        // 二层箱体，在地图中显示对应日期
        this.$store.commit('selectImgShowOnMap', e.name)
      }
    },
    boxPlotItemMouseout(e) {
      if (e.componentType === 'xAxis' && !this.isClickSelectRegion) {
        this.$store.commit('changeRegionShowOnMap', []) // 隐藏对应海区范围
        // 在地图上不显示 geojson 图层
        this.$store.commit('changeStateOfGeoJsonOnMap', false)
      }
      this.$store.commit('hoverPointOnBoxplot', [])
    },
    // 还原箱线图数据
    boxPlotItemsRestore() {
      // 隐藏 restore 按钮
      this.boxOpt.toolbox.show = false
      // 右移 legend
      this.boxOpt.legend.left = 5
      this.queryInfo.type = '1'
      // 改变选择区域的
      this.$store.commit('selectedRegionIDOnAxis', 'all') // 修改状态管理器中的数据，保持其他图表联动更新
      this.queryInfo.date = this.$store.state.barDateChoosed // 还原为之前选择的日期
      this.boxOpt.title.text =
        this.$store.state.barDateChoosed +
        ' ' +
        this.$store.getters.getRegionIDLabel
      // 取消地图显示海区
      // this.$store.commit('changeRegionShowOnMap', [])
      // 重新获取数据
      this.getBoxplotData()

      // 隐藏海区
      this.$store.commit('changeRegionShowOnMap', [])
      // 在地图上不显示 geojson 图层
      this.$store.commit('changeStateOfGeoJsonOnMap', false)
      // 还原标志位
      this.isClickSelectRegion = false
      // 开启 x 轴交互
      this.boxOpt.xAxis.triggerEvent = true
    }
  }
}
</script>

<style lang="less" scoped>
.box-plot {
  height: 390px;
}
</style>
