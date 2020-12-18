<template>
  <v-chart
    class="heatmap-container"
    theme="infographic"
    ref="heatmapRef"
    :init-options="this.$store.state.echartInitOption"
    :options="heatmapOpt"
  ></v-chart>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
  components: {
    'v-chart': ECharts
  },
  // title 图表标题，subTitle 副标题，matrixData 矩阵数据
  props: ['title', 'subTitle', 'matrixData'],
  data() {
    return {
      heatmapOpt: {
        title: {
          text: this.title,
          subtext: this.subTitle
          // left: 7,
          // top: 3
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
          left: 8,
          right: 8,
          top: 45,
          bottom: 35
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
          max: 1,
          text: ['High', 'Low'],
          bottom: 0,
          left: 'center',
          itemHeight: 90,
          itemWidth: 15,
          precision: 4,
          calculable: false,
          orient: 'horizontal',
          dimension: 2,
          color: ['#636363', '#bdbdbd', '#f0f0f0'],
          seriesIndex: 0,
          show: true // 暂时不显示
        },
        series:
          // 距离矩阵图
          {
            data: this.matrixData, // [x, y, dis, unitId]
            type: 'heatmap',
            label: {
              show: false, // 暂时不显示
              position: 'insideBottomLeft',
              color: '#000',
              formatter: (p) => p.data[3],
              distance: 0,
              fontSize: 10
            },
            tooltip: {
              formatter: (p) => {
                let res = `Unit ${p.data[3]}<br/>`
                if (this.title === 'U Matrix') {
                  res += `distance: ${p.data[2].toFixed(4)}`
                } else {
                  res += `weight: ${p.data[2].toFixed(4)}`
                }
                return res
              }
            }
          }
      }
    }
  },
  computed: {},
  mounted() {
    this.setVisualMap()
  },
  methods: {
    setVisualMap() {
      let min = this.matrixData[0][2]
      let max = this.matrixData[0][2]
      for (const item of this.matrixData) {
        min > item[2] && (min = item[2])
        max < item[2] && (max = item[2])
      }
      this.heatmapOpt.visualMap.min = min
      this.heatmapOpt.visualMap.max = max

      if (this.title !== 'U Matrix') {
        this.heatmapOpt.visualMap.color = ['#F03B20', '#FEB24C', '#FFEDA0']
      }
    }
  }
}
</script>

<style lang="less" scoped>
.heatmap-container {
  width: 210px;
  height: 280px;
  margin: 0 auto;
}
</style>
