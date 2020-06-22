<template>
  <div class="box-plot">
    <v-chart ref="boxPlot" :options="boxOpt" @click="boxPlotItemClicked" theme="infographic" />
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
			historyData: {
				axisData: [],
				boxData: [],
				outliers: []
			},
			boxOpt: {
				title: [
					{
						text: this.dateChoosed + ' RegionID: all',
						right: 0,
						top: 13
					}
				],
				tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
					}
				},
				toolbox: {
					show: false,
					feature: {
						restore: {
							title: 'restore'
						}
					},
					left: 70,
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
					axisLabel: {
						interval: 0
					}
				},
				yAxis: {
					type: 'value',
					name: '℃/km',
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
								console.log(param)
								return [
									'Region ' + param.name + ': ',
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
		// 获取箱线图数据
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
		},
		// 点击箱线图数据项，只用于一层
		boxPlotItemClicked(e) {
			if (e.seriesType === 'boxplot') {
				// 点击箱体查询
				console.log(e)
				// 记录历史数据
				this.historyData.axisData = this.boxOpt.xAxis.data
				this.historyData.boxData.data = this.boxOpt.series[0].data
				this.historyData.boxData.data = this.boxOpt.series[1].data

				// 修改查询条件
				this.queryInfo.type = '2'
				this.queryInfo.regionId = e.name
				this.queryInfo.date = this.queryInfo.date.slice(0, 4)
				// 请求新数据
				this.getBoxplotData()
				// 显示 restore 按钮
				this.boxOpt.toolbox.show = true
			} else if (e.seriesType === 'scatter') {
				// 点击散点在地图上添加标注
				console.log(`点击了点，日期${this.queryInfo.date}，数据${e.data}`)
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
