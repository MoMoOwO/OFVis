<template>
  <div class="line-chart">
    <v-chart
      ref="lineChart"
      :options="this.type === 'polarOpt' ? this.polarOpt : this.lineOpt"
      theme="infographic"
    />
  </div>
</template>

<script>
// 主题
import 'echarts/theme/infographic.js'
// 组件
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export default {
	data() {
		return {
			queryInfo: {
				type: '2', // 请求面积折线图统计图数据
				regionId: 'all', // 默认初始请求所有海区数据
				year: null // 不使用该参数
			},
			polarOpt: {
				title: {
					text: 'RegionID：' + this.regionChoosed,
					right: 0,
					top: 13
				},
				tooltip: {
					confine: true
				},
				legend: {
					data: null
				},
				grid: {
					left: 0,
					right: 0,
					bottom: 10,
					containLabel: true
				},
				radar: {
					indicator: [
						{ name: 'Jan', max: 600 },
						{ name: 'Feb', max: 600 },
						{ name: 'Mar', max: 600 },
						{ name: 'Apr', max: 600 },
						{ name: 'May', max: 600 },
						{ name: 'Jun', max: 600 },
						{ name: 'Jul', max: 600 },
						{ name: 'Aug', max: 600 },
						{ name: 'Sep', max: 600 },
						{ name: 'Oct', max: 600 },
						{ name: 'Nov', max: 600 },
						{ name: 'Dec', max: 600 }
					]
				},
				series: {
					type: 'radar',
					data: null
				}
			},
			lineOpt: {
				title: {
					text: 'RegionID：' + this.regionChoosed,
					right: 0,
					top: 10
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: null
				},
				grid: {
					left: 10,
					right: 10,
					bottom: 15,
					containLabel: true
				},
				xAxis: {
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
					axisLabel: {
						interval: 0
					}
				},
				yAxis: {
					type: 'value',
					name: '',
					nameTextStyle: {
						padding: [0, 0, 0, 55]
					},
					axisLabel: {
						formatter: value => value.toString()[0]
					}
				},
				series: null
			}
		}
	},
	components: {
		'v-chart': ECharts
	},
	props: ['type', 'regionChoosed'],
	mounted() {
		this.getAreaData()
	},
	methods: {
		// 是否显示缓冲条
		isShowLoadding(b) {
			if (b) {
				this.$refs.lineChart.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
			} else {
				this.$refs.lineChart.hideLoading()
			}
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
			const { data: res } = await this.axios.get('areadata', {
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
				this.lineOpt.series = lineData
				this.lineOpt.yAxis.name = `× 10^${max.toString().length - 1} km²`
				this.lineOpt.legend.data = yearArr
				this.isShowLoadding(false)
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
