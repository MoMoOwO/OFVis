<template>
  <div class="areaContainer">
    <v-chart
      class="calendarContainer"
      theme="infographic"
      ref="calendarChartRef"
      :init-options="this.$store.state.echartInitOption"
      :options="calendarOpt"
      @mouseover="calendarItemMouseover"
      @click="calendarItemClicked"
      @dblclick="calendarItemdbClicked"
    ></v-chart>
    <v-chart
      class="barContainer"
      theme="infographic"
      ref="barChartRef"
      :init-options="this.$store.state.echartInitOption"
      :options="barOpt"
      @mouseover="barItemMouseover"
      @click="barItemClicked"
    ></v-chart>
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/calendar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'

export default {
  data() {
    return {
      queryInfo: {
        type: '1', // 请求基础面积统计图数据
        regionId: this.$store.state.boxRegionChoosed, // 默认初始请求所有海区数据
        year: this.yearChoosed
      },
      calendarOpt: {
        tooltip: {
          confine: true, // 将 tooltip 框定在容器内
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;',
          formatter: (p) => `${p.data[0]}<br/>${p.data[1].toFixed(2)}km²`
        },
        visualMap: {
          min: 0,
          max: 10000,
          // precision: 2, // 显示两位小数
          // calculable: false,  // 可选范围
          orient: 'horizontal',
          color: ['#F03B20', '#FEB24C', '#FFEDA0'],
          left: 'center',
          text: ['H', 'L'],
          textGap: 4,
          bottom: 8,
          itemHeight: '85%',
          itemWidth: 18
        },
        calendar: {
          // 热力图容器
          orient: 'vertical', // 排列方向，默认horizontal
          left: 'center',
          // right: 5,
          top: 30,
          bottom: 50,
          yearLabel: {
            // 年份标签边距
            show: false
          },
          monthLabel: {
            // 月份标签边距
            show: false
          },
          dayLabel: {
            firstDay: 1 // 从周一开始
          },
          height: 'auto',
          cellSize: 15, // 单元格大小，[宽，高]数值，auto
          range: this.yearChoosed // 设置日历范围，格式：yyyy, yyyy-MM,字符串形式
        },
        series: {
          // 热力图的series
          coordinateSystem: 'calendar',
          type: 'heatmap',
          calendarIndex: 0, // 日历坐标系索引
          itemStyle: {
            normal: {},
            emphasis: {
              borderWidth: 1,
              borderColor: '#333'
            }
          },
          data: null
        }
      },
      barOpt: {
        title: {
          text: '',
          right: 10,
          top: 4,
          textStyle: {
            fontSize: 17
          }
        },
        grid: {
          top: 30,
          left: 20,
          right: 20
        },
        tooltip: {
          confine: true, // 将 tooltip 框定在容器内
          backgroundColor: '#fff',
          textStyle: {
            color: '#565656',
            lineHeight: 28
          },
          padding: 12,
          extraCssText:
            'box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.8;max-height: 100%;',
          formatter: (p) =>
            `${this.yearChoosed}-${p.name}<br/>${p.data.toFixed(2)}km²`
        },
        xAxis: {
          type: 'value',
          axisTick: {
            // show: false // 轴刻度
          },
          axisLabel: {
            // show: false // 轴刻度标签
            formatter: (val) => {
              if (val >= 100000) {
                return `${val / 100000}×10⁵km²`
              } else if (val === 0) {
                return '0km²'
              } else {
                return `${val / 10000}×10⁴km²`
              }
            },
            rotate: -90
          }
        },
        yAxis: {
          type: 'category',
          data: [
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
          ],
          inverse: true, //  顺序倒置
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: -90
          }
        },
        series: {
          // barchart 的 series
          type: 'bar',
          color: '#E8684A',
          data: null
          // barWidth: 10,
          /* itemStyle: {
							normal: {
							},
							emphasis: {
								color: "#007AFF"
							}
						}, */
          // color: "#00A6FF",
          /* markLine: {
							data: [
								{ type: 'average', name: '平均值' }
							],
							lineStyle:{
								color: "green",
								width: 2,
							}
						} */
        }
      },
      selectedDateIndex: [], // 选中项索引
      selectDateOnCalendar: [], // 选中的日期
      timer: null // 用于延时提交
    }
  },
  props: ['yearChoosed'],
  components: {
    'v-chart': ECharts
  },
  mounted() {
    this.getAreaData()
  },
  watch: {
    '$store.state.boxRegionChoosed': {
      // 联动，监听区域选择的变化
      handler: function (newVal) {
        this.queryInfo.regionId = newVal
        this.getAreaData()
      },
      deep: true
    },
    yearChoosed: {
      handler: function (newVal) {
        this.queryInfo.year = newVal
        // 修改地图的显示
        this.$store.commit('selectedDateOnBar', this.yearChoosed + '01')
        this.getAreaData()
      }
    }
  },
  methods: {
    // 是否显示缓冲条
    isShowLoadding(b) {
      if (b) {
        this.$refs.calendarChartRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
        this.$refs.barChartRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
      } else {
        this.$refs.calendarChartRef.hideLoading()
        this.$refs.barChartRef.hideLoading()
      }
    },
    // 获取面积数据
    async getAreaData() {
      this.isShowLoadding(true)
      const { data: res } = await this.axios.get('data/areadata', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        // 后台返回错误请求
        this.$message.error('Failed to get area data!')
      } else {
        // 初始化图表数据
        let min = res.data.calendarData[0][1]
        let max = res.data.calendarData[0][1]
        for (const item of res.data.calendarData) {
          if (min > item[1]) min = item[1]
          if (max < item[1]) max = item[1]
        }

        this.calendarOpt.series.data = res.data.calendarData
        this.calendarOpt.visualMap.min = min
        this.calendarOpt.visualMap.max = max
        this.calendarOpt.calendar.range = this.queryInfo.year

        this.barOpt.series.data = res.data.barData
        this.barOpt.title.text =
          this.yearChoosed + ' ' + this.$store.getters.getRegionIDLabel
      }
      this.isShowLoadding(false)
    },
    // 条形图数据项点击事件
    barItemClicked(e) {
      if (this.queryInfo.regionId === 'all') {
        // 当为所有区域面积的时候才支持向下响应
        // 当选择柱状图上某个月时，显示箱线图显示该月份的海区统计，地图画廊显示该月份 30 天的情况(暂时取消画廊联动)
        this.$store.commit(
          'selectedDateOnBar',
          this.yearChoosed + (e.dataIndex + 1 + '').padStart(2, '0')
        )
      }
    },
    // 悬浮联动地图概览空间情形
    barItemMouseover(e) {
      const date =
        this.yearChoosed + (e.dataIndex + 1).toString().padStart(2, '0')
      this.$store.commit('selectImgShowOnMap', date)
    },
    // 在日历上悬浮联动地图概览空间情形
    calendarItemMouseover(e) {
      const date = e.data[0].split('-').join('')
      this.$store.commit('selectImgShowOnMap', date)
    },
    // 日历图单项点击
    calendarItemClicked(e) {
      clearTimeout(this.timer) // 清空 timer

      this.selectedDateIndex.push(e.dataIndex) // 记录 item 的索引项
      this.selectDateOnCalendar.push(e.value[0].replace(/-/g, '')) // 格式化的日期，用于向后台请求数据
      this.$refs.calendarChartRef.dispatchAction({
        type: 'highlight',
        dataIndex: e.dataIndex
      })

      // 延时更改，以支持多选
      this.timer = setTimeout(() => {
        this.$store.commit('changeDateArrOnGallery', this.selectDateOnCalendar)
      }, 2000)
    },
    // 日历图单项双击
    calendarItemdbClicked(e) {
      for (const index of this.selectedDateIndex) {
        this.$refs.calendarChartRef.dispatchAction({
          type: 'downplay',
          dataIndex: index
        })
      }
      // 置空
      this.timer = null
      this.selectedDateIndex = []
      this.selectDateOnCalendar = []
      this.$store.commit('changeDateArrOnGallery', [])
      // 先修改一下 2015 再恢复原来，否则不修改
      this.$store.commit('changeYearOnGallery', 2015)
      this.$store.commit('changeYearOnGallery', this.yearChoosed)
    }
  }
}
</script>

<style lang="less" scoped>
.areaContainer {
  width: 100%;
  height: 825px;
  display: flex;
  flex-wrap: wrap;
  .calendarContainer {
    width: 45%;
  }
  .barContainer {
    width: 55%;
  }
}
</style>
