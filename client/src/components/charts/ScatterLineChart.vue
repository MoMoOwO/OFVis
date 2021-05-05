<template>
  <div class="line-chart">
    <v-chart
      theme="infographic"
      ref="scatterLineChart"
      :init-options="this.$store.state.echartInitOption"
      :options="scatterLineOpt"
      @click="scatterLineChartClick"
      @restore="scatterLineChartRestore"
    />
    <!-- 鼠标悬浮与移除事件 -->
    <!-- @mouseover="scatterLineChartMouseover"
    @mouseout="scatterLineChartMouseout" -->
  </div>
</template>

<script>
// 主题
import 'echarts/theme/infographic.js'
// 组件
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export default {
  data() {
    return {
      queryInfo: {
        feature: this.feature, // 默认初始请求所有海区数据
        year: this.$store.state.yearOnGallery // 不使用该参数
      },
      scatterLineOpt: {
        title: {
          text: '',
          right: 10,
          top: 10
        },
        legend: {
          show: true,
          top: 5,
          icon: 'none',
          itemWidth: 0,
          itemGap: 3,
          borderWidth: 1,
          borderType: 'solid',
          borderRadius: 5,
          left: 5,
          width: '45%'
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
        tooltip: {
          trigger: 'axis',
          confine: true,
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;',
          formatter: (p) => {
            let res = p[0].name + '<br/>'
            if (p[0].componentSubType === 'scatter') {
              // 散点图上鼠标悬浮的 tooltip
              p.reverse()
              p.forEach((item) => {
                res += `${item.marker}${item.data[1]}: ${item.data[2]}<br/>`
              })
            } else {
              // 折线图上鼠标悬浮的 tooltip
              res = ''
              res = 'R' + p[0].seriesName + '<br/>'
              res += `${p[0].data[0]}: ${p[0].data[1]}`
            }
            // console.log(res)
            return res
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 15,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
          // type: 'category'
        },
        series: []
      },
      isClickSelectRegion: false, // 标记是悬浮交互显示海区，还是点击交互显示海区
      rowData: []
    }
  },
  components: {
    'v-chart': ECharts
  },
  props: ['feature'],
  mounted() {
    this.getRowData()
  },
  watch: {
    '$store.state.yearOnGallery': {
      // 联动，监听区域选择的变化
      handler: function (newVal) {
        this.queryInfo.year = newVal
        this.getRowData()
        this.setScatterChart(this.rowData)
      },
      deep: true
    },
    feature: {
      // 联动，监听区域选择的变化
      handler: function (newVal) {
        this.queryInfo.feature = newVal
        this.getRowData()
        this.setScatterChart(this.rowData)
      },
      deep: true
    }
  },
  methods: {
    // 是否显示缓冲条
    isShowLoadding(b) {
      if (b) {
        this.$refs.scatterLineChart.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
      } else {
        this.$refs.scatterLineChart.hideLoading()
      }
    },
    // 获取原始数据，这些数据可以直接用于散点图，和抽取部分用于折线图
    async getRowData() {
      this.isShowLoadding(true)
      // 请求数据
      const { data: res } = await this.axios.get('data/featuredata', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        this.$message.error('Failed to get feature data!')
      } else {
        this.rowData = res.data.featureData // 缓存原数据

        this.setScatterChart(this.rowData) // 创建散点图

        this.isShowLoadding(false)
      }
    },
    // 获取散点图中的散点大小，面积映射
    getSymbolSize(val) {
      let res
      switch (this.feature) {
        case 'Mean':
          res = Math.sqrt(val * 70) * 10
          break
        case 'MoransI':
          res = Math.sqrt(val * 10) * 10
          break
        case 'IQR':
          res = Math.sqrt(val * 100) * 10
          break
        case 'Skewness':
          res = Math.sqrt(Math.abs(val) * 10) * 10
          break
        case 'SDD':
          res = Math.sqrt(val * 10) * 8
          break
        default:
          alert('时变散点图半径计算出错！')
          break
      }
      return res
    },
    // 设置散点图
    setScatterChart(scatterData) {
      const scatterSeries = []
      // 装配散点图 series
      for (const obj of scatterData) {
        scatterSeries.push({
          name: 'R' + obj.regionId,
          type: 'scatter',
          symbolSize: (val) => {
            return this.getSymbolSize(val[2])
          },
          itemStyle: {
            color: (p) => {
              const color = p.data[2] >= 0 ? '#E8684A' : '#5B8FF9'
              return color
            },
            opacity: 1
          },
          hoverAnimation: false,
          data: obj.data
        })
      }

      // 修改图表 title
      this.scatterLineOpt.title.text = `${this.$store.state.yearOnGallery} ${this.$store.getters.getRegionIDLabel}`
      this.scatterLineOpt.legend.show = true // 显示图例
      this.scatterLineOpt.toolbox.show = false // 隐藏返回按钮
      this.scatterLineOpt.yAxis.type = 'category' // y 轴类型 类目型
      this.scatterLineOpt.yAxis.triggerEvent = true // 开启 y 轴点击事件
      this.scatterLineOpt.series = scatterSeries // series 赋值
    },
    // 设置折线图
    setLineChart(lineData) {
      const lineSeries = {
        name: lineData.regionId,
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: true,
        itemStyle: {
          color: (p) => {
            const color = p.data[1] >= 0 ? '#E8684A' : '#5B8FF9'
            return color
          },
          opacity: 1
        },
        lineStyle: {
          color: '#65789B'
        },
        smooth: true,
        connectNulls: false,
        data: lineData.data
      }

      // 显示返回按钮
      this.scatterLineOpt.toolbox.show = true
      this.scatterLineOpt.legend.show = false // 隐藏图例
      this.scatterLineOpt.yAxis.type = 'value' // y 轴类型 数值型
      this.scatterLineOpt.yAxis.triggerEvent = false // 关闭 y 轴点击事件
      this.scatterLineOpt.series = lineSeries
    },
    // 图表点击事件
    scatterLineChartClick(e) {
      // y 轴的标签点击某个海区，然后以折线图的形式显示该海区特征值的时变特性
      if (e.componentType === 'yAxis') {
        // 是点击交互显示海区，mouseout 不隐藏海区范围
        this.isClickSelectRegion = true
        // 在 y 轴上选择海区，联动面积图显示该海区的面积
        this.$store.commit('selectedRegionIDOnAxis', e.value.slice(1)) // 修改状态管理器中的数据，保持面积图表联动更新

        // 图表 title 修改
        this.scatterLineOpt.title.text = `${this.$store.state.yearOnGallery} ${this.$store.getters.getRegionIDLabel}`
        // 在 y 轴标签上进行点击
        const regionId = +e.value.slice(1)
        const scatterData = this.rowData[regionId - 1]
        const monthlyData = [
          ['Jan', null],
          ['Feb', null],
          ['Mar', null],
          ['Apr', null],
          ['May', null],
          ['Jun', null],
          ['Jul', null],
          ['Aug', null],
          ['Sep', null],
          ['Oct', null],
          ['Nov', null],
          ['Dec', null]
        ]
        const lineData = { regionId, data: [] }
        // 装配折线图数据
        for (const item of scatterData.data) {
          switch (item[0]) {
            case 'Jan':
              monthlyData[0][1] = item[2]
              break
            case 'Feb':
              monthlyData[1][1] = item[2]
              break
            case 'Mar':
              monthlyData[2][1] = item[2]
              break
            case 'Apr':
              monthlyData[3][1] = item[2]
              break
            case 'May':
              monthlyData[4][1] = item[2]
              break
            case 'Jun':
              monthlyData[5][1] = item[2]
              break
            case 'Jul':
              monthlyData[6][1] = item[2]
              break
            case 'Aug':
              monthlyData[7][1] = item[2]
              break
            case 'Sep':
              monthlyData[8][1] = item[2]
              break
            case 'Oct':
              monthlyData[9][1] = item[2]
              break
            case 'Nov':
              monthlyData[10][1] = item[2]
              break
            case 'Dec':
              monthlyData[11][1] = item[2]
              break
          }
        }
        lineData.data = monthlyData
        // console.log(lineData)
        this.setLineChart(lineData)
      } else {
        console.log('在 Features-View 中出现其他鼠标点击情况！')
      }

      // 地图显示对应海区
      // 显示对应海区的范围
      this.$store.commit('changeRegionShowOnMap', [+e.value.slice(1)])
      // 在地图上显示 geojson 图层
      this.$store.commit('changeStateOfGeoJsonOnMap', true)
      // console.log(e)
    },
    // 鼠标在 y 轴海区标签悬浮时在地图上显示海区范围
    scatterLineChartMouseover(e) {
      if (e.componentType === 'yAxis') {
        // 在 y 轴标签上进行鼠标悬浮
        // 显示对应年份的海洋锋空间情况
        this.$store.commit(
          'selectImgShowOnMap',
          this.$store.state.yearOnGallery + '01'
        )
        // 显示对应海区的范围
        this.$store.commit('changeRegionShowOnMap', [+e.value.slice(1)])
        // 在地图上显示 geojson 图层
        this.$store.commit('changeStateOfGeoJsonOnMap', true)
      } else if (e.seriesType === 'scatter' || e.seriesType === 'line') {
        // 悬浮显示在地图上显示对应日期空间形态
        const date =
          this.$store.state.yearOnGallery +
          (e.dataIndex + 1).toString().padStart(2, '0')
        this.$store.commit('selectImgShowOnMap', date)
      } else {
        console.log('在 Features-View 中出现其他鼠标悬浮情况！')
      }
    },
    // 鼠标从 y 轴还去标签离开时地图上的海区范围显示消失
    scatterLineChartMouseout(e) {
      if (e.componentType === 'yAxis') {
        // 在 y 轴标签上进行点击，点击状态下的话不隐藏已经显示的海区范围
        if (!this.isClickSelectRegion) {
          this.$store.commit('changeRegionShowOnMap', []) // 隐藏对应海区范围
          // 在地图上不显示 geojson 图层
          this.$store.commit('changeStateOfGeoJsonOnMap', false)
        }
      }
    },
    // 用于折线图返回到原来的散点图
    scatterLineChartRestore() {
      // 设置散点图
      this.setScatterChart(this.rowData)
      // 面积图复原
      this.$store.commit('selectedRegionIDOnAxis', 'all')
      // title 复原
      this.scatterLineOpt.title.text = `${this.$store.state.yearOnGallery} ${this.$store.getters.getRegionIDLabel}`
      // 隐藏海区
      this.$store.commit('changeRegionShowOnMap', [])
      // 在地图上不显示 geojson 图层
      this.$store.commit('changeStateOfGeoJsonOnMap', false)
      // 还原标志位
      this.isClickSelectRegion = false
    },
    /*
		将数字取整为10的倍数
		@param {Number} num 需要取整的值
		@param {Boolean} ceil 是否向上取整
		@param {Number} prec 需要用0占位的数量
		*/
    formatInt(num, prec, ceil = true) {
      const len = String(num).length
      if (len <= prec) {
        return num
      }
      const mult = Math.pow(10, prec)
      return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult
    },
    // 获取折线图数据
    async getAreaData() {
      this.isShowLoadding(true)
      const { data: res } = await this.axios.get('data/areadata', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('Failed to get area data!')
      } else {
        // 组织径向雷达图数据和普通折线图数据
        const yearArr = [] // 年份标签数组，用于 legend 显示
        const data = [] // 三年所有数据
        for (const obj of res.data.lineData) {
          yearArr.push(obj.year)
          data.push(obj.data)
        }
        let max = data[0][0] // 求最大值
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (max < data[i][j]) max = data[i][j]
          }
        }
        // 向上取十倍数整数
        max = this.formatInt(max, parseInt(max).toString().length - 2, true)
        // 修改雷达图的 indicator
        for (let i = 0; i < this.polarOpt.radar.indicator.length; i++) {
          this.polarOpt.radar.indicator[i].max = max
        }
        // 修改雷达图和折线图数据
        const lineData = []
        const polarData = []
        for (let i = 0; i < yearArr.length; i++) {
          lineData.push({
            name: yearArr[i],
            type: 'line',
            data: data[i]
          })
          polarData.push({
            name: yearArr[i],
            value: data[i]
          })
        }

        this.polarOpt.series.data = polarData
        this.polarOpt.legend.data = yearArr
        this.polarOpt.title.text = this.$store.getters.getRegionIDLabel

        this.lineOpt.series = lineData
        this.lineOpt.yAxis.name = `× 10^${max.toString().length - 1} km²`
        this.lineOpt.legend.data = yearArr
        this.lineOpt.title.text = this.$store.getters.getRegionIDLabel

        this.isShowLoadding(false)
      }
    },
    // 折线图点击事件
    lineItemClick(e) {
      if (e.seriesType === 'radar') {
        this.$store.commit('changeYearOnGallery', e.name)
      } else if (e.seriesType === 'line') {
        const month = (e.dataIndex + '').padStart(2, 0)
        const dates = ['2015' + month, '2016' + month, '2017' + month]
        this.$store.commit('changeDateArrOnGallery', dates)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.line-chart {
  height: 390px;
}
</style>
