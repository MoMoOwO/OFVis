<template>
  <div class="box-plot">
    <v-chart ref="boxPlot" :options="boxOpt" theme="infographic" />
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
				regionId: 'all', // 默认初始请求所有海区数据
				date: this.dateChoosed // 不使用该参数
			},
			boxOpt: {
				title: [
					/* {
						text: 'Michelson-Morley Experiment',
						left: 'center'
					} */
				],
				tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
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
					data: null,
					boundaryGap: true,
					nameGap: 30,
					splitArea: {
						show: false
					},
					axisLabel: {
						interval: 0,
						rotate: 90,
						formatter: 'region {value}'
					}
				},
				yAxis: {
					type: 'value',
					name: 'km/s',
					splitArea: {
						show: true
					}
				},
				series: [
					{
						type: 'boxplot',
						data: null,
						tooltip: {
							formatter: function(param) {
								return [
									'Experiment ' + param.name + ': ',
									'upper: ' + param.data[4],
									'Q3: ' + param.data[3],
									'median: ' + param.data[2],
									'Q1: ' + param.data[1],
									'lower: ' + param.data[0]
								].join('<br/>')
							}
						}
					},
					{
						name: 'outlier',
						type: 'scatter',
						data: null
					}
				]
			}
		}
	},
	components: {
		'v-chart': ECharts
	},
	props: ['dateChoosed'],
	mounted() {
		this.getBoxplotData()
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
		async getBoxplotData() {
			this.isShowLoadding(true)
			const { data: res } = await this.axios.get('boxdata', {
				params: this.queryInfo
			})
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get boxplot data!')
			} else {
				// 为图表数据赋值
				this.boxOpt.xAxis.data = res.data.axisData
				this.boxOpt.series[0].data = res.data.boxData
				this.boxOpt.series[1].data = res.data.outliers
				this.isShowLoadding(false)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.box-plot {
	height: 390px;
}
</style>
