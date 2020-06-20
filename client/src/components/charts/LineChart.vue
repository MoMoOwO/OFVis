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
			queryInfo: {
				type: '2', // 请求面积折线图统计图数据
				regionId: 'all', // 默认初始请求所有海区数据
				year: null // 不使用该参数
			},
			polarOpt: {
				tooltip: {
					confine: true
				},
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
	components: {
		'v-chart': ECharts
	},
	props: ['type'],
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
		async getAreaData() {
			// this.showLoading(true)
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
