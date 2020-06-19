<template>
  <div class="areaContainer">
    <v-chart
      class="calendarContainer"
      ref="calendarChart"
      :options="calendarOpt"
      theme="infographic"
    ></v-chart>
    <v-chart class="barContainer" ref="barChart" :options="barOpt" theme="infographic"></v-chart>
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/calendar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/visualMap'

export default {
	data() {
		const monthsData = [
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
		return {
			queryInfo: {
				type: '1', // 请求基础面积统计图数据
				regionId: 'all', // 默认初始请求所有海区数据
				year: this.yearChoosed
			},
			calendarOpt: {
				title: {
					text: this.yearChoosed,
					right: 0
				},
				tooltip: {
					confine: true, // 将 tooltip 框定在容器内
					formatter: p => p.data[0] + ':<br/>' + p.data[1].toFixed(2) + 'km²'
				},
				visualMap: {
					min: 0,
					max: 10000,
					// precision: 2, // 显示两位小数
					// calculable: false,  // 可选范围
					orient: 'horizontal',
					color: ['#F03B20', '#FEB24C', '#FFEDA0'],
					left: 'center',
					itemHeight: '100%'
				},
				calendar: {
					// 热力图容器
					orient: 'vertical', // 排列方向，默认horizontal
					left: 'center',
					// right: 5,
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
					calendarIndex: 0, // 日历索引
					data: null
				}
			},
			barOpt: {
				grid: {
					left: 20,
					right: 20
				},
				tooltip: {
					confine: true, // 将 tooltip 框定在容器内
					formatter: p => p.data.toFixed(2) + 'km²'
				},
				xAxis: {
					type: 'value',
					axisTick: {
						show: false // 轴刻度
					},
					axisLabel: {
						show: false // 轴刻度标签
					}
				},
				yAxis: {
					type: 'category',
					data: monthsData,
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
			}
		}
	},
	props: ['yearChoosed'],
	components: {
		'v-chart': ECharts
	},
	mounted() {
		this.getAreaData()
	},
	methods: {
		// 是否显示缓冲条
		isShowLoadding(b) {
			if (b) {
				this.$refs.calendarChart.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.barChart.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
			} else {
				this.$refs.calendarChart.hideLoading()
				this.$refs.barChart.hideLoading()
			}
		},
		// 获取面积数据
		async getAreaData() {
			this.isShowLoadding(true)
			const { data: res } = await this.axios.get('areadata', {
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
			}
			this.isShowLoadding(false)
		}
	}
}
</script>

<style lang="less" scoped>
.areaContainer {
	width: 100%;
	height: 815px;
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
