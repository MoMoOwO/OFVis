<template>
  <div class="line-chart">
    <v-chart
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
	components: {
		'v-chart': ECharts
	},
	data() {
		const data = [
			{
				name: '个人积分',
				type: 'line',
				data: [28, 36, 12, 68, 232, 336, 458, 569, 165, 146, 87, 35]
			},
			{
				name: '全国均值',
				type: 'line',
				data: [289, 356, 12, 16, 23, 36, 58, 69, 126, 246, 355, 466]
			}
		]
		const indicatorData = [
			{ name: '1月', max: 600 },
			{ name: '2月', max: 600 },
			{ name: '3月', max: 600 },
			{ name: '4月', max: 600 },
			{ name: '5月', max: 600 },
			{ name: '6月', max: 600 },
			{ name: '7月', max: 600 },
			{ name: '8月', max: 600 },
			{ name: '9月', max: 600 },
			{ name: '10月', max: 600 },
			{ name: '11月', max: 600 },
			{ name: '12月', max: 600 }
		]
		const legendData = []
		const seriesData = []
		const xAxisData = []
		for (var i = 0; i < data.length; i++) {
			legendData.push(data[i].name)
			seriesData.push({
				value: data[i].data,
				name: data[i].name
			})
		}
		for (var item of indicatorData) {
			xAxisData.push(item.name)
		}
		return {
			polarOpt: {
				tooltip: {},
				legend: {
					data: legendData,
					itemWidth: 8,
					itemHeight: 8
				},
				grid: {
					left: 0,
					right: 0,
					bottom: 10,
					containLabel: true
				},
				radar: {
					indicator: indicatorData
				},
				series: [
					{
						name: '预算 vs 开销（Budget vs spending）',
						type: 'radar',
						itemStyle: { normal: { areaStyle: { type: 'default' } } },
						data: seriesData
					}
				]
			},
			lineOpt: {
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				grid: {
					left: 0,
					right: 0,
					bottom: 10,
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: xAxisData
				},
				yAxis: {
					type: 'value'
				},
				series: data
			}
		}
	},
	methods: {},
	created() {},
	mounted() {},
	props: ['type']
}
</script>

<style lang="less" scoped>
.line-chart {
	height: 390px;
}
</style>