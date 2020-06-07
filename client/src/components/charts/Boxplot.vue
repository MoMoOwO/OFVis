<template>
  <div class="box-plot">
    <v-chart :options="boxOpt" theme="infographic" />
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
	name: '',
	components: {
		'v-chart': ECharts
	},
	data() {
		const data = {
			boxData: [
				[655, 850, 940, 980, 1070],
				[760, 800, 845, 885, 960],
				[780, 840, 855, 880, 940],
				[720, 767.5, 815, 865, 920],
				[740, 807.5, 810, 870, 950]
			],
			outliers: [
				[0, 650],
				[2, 620],
				[2, 720],
				[2, 720],
				[2, 950],
				[2, 970]
			],
			asixData: [0, 1, 2, 3, 4]
		}
		return {
			boxOpt: {
				title: [
					{
						text: 'Michelson-Morley Experiment',
						left: 'center'
					},
					{
						text: 'upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ',
						borderColor: '#999',
						borderWidth: 1,
						textStyle: {
							fontSize: 14
						},
						left: '10%',
						top: '90%'
					}
				],
				legend: {
					data: ['line', 'line2', 'line3']
				},
				tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
					}
				},
				grid: {
					left: '10%',
					right: '10%',
					bottom: '15%'
				},
				xAxis: {
					type: 'category',
					data: data.axisData,
					boundaryGap: true,
					nameGap: 30,
					splitArea: {
						show: false
					},
					axisLabel: {
						formatter: 'expr {value}'
					},
					splitLine: {
						show: false
					}
				},
				yAxis: {
					type: 'value',
					name: 'km/s minus 299,000',
					splitArea: {
						show: true
					}
				},
				series: [
					{
						name: 'boxplot',
						type: 'boxplot',
						data: data.boxData,
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
						data: data.outliers
					}
				]
			}
		}
	},

	computed: {},

	watch: {},

	mounted() {},

	methods: {}
}
</script>

<style lang="less" scoped>
.box-plot {
	height: 390px;
}
</style>
