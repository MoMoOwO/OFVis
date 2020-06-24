<template>
  <div class="box-plot">
    <v-chart
      ref="boxPlot"
      :options="boxOpt"
      @click="boxPlotItemClicked"
      @restore="boxPlotItemsRestore"
      theme="infographic"
    />
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
				regionId: this.$store.state.boxRegionChoosed, // 默认初始请求所有海区数据
				date: this.$store.state.barDateChoosed
			},
			boxOpt: {
				title: {
					text:
						this.$store.state.barDateChoosed +
						' ' +
						this.$store.getters.getRegionIDLabel,
					right: 0,
					top: 15
				},
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
						formatter: p => {
							if (p.length < 3) {
								// 海区
								return p
							} else {
								const months = [
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
								return months[p.slice(-2) - 1]
							}
						},
						interval: 0
					}
				},
				yAxis: {
					type: 'value',
					name: '℃/km',
					/* splitArea: {
						show: true
					} */
					nameTextStyle: {
						padding: [0, 0, 0, 20]
					}
				},
				series: [
					{
						type: 'boxplot',
						data: null,
						tooltip: {
							formatter: function(param) {
								let name = ''
								param.name.length === 1
									? (name = 'RegionID: ')
									: (name = 'Date: ')
								return [
									name + param.name,
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
	watch: {
		'$store.state.boxRegionChoosed': {
			// 联动，监听选择区域的改变
			handler: function(newVal) {
				this.queryInfo.regionId = newVal
			},
			deep: true
		},
		'$store.state.barDateChoosed': {
			// 响应柱状图选中的年月份
			handler: function(newVal) {
				this.queryInfo.date = newVal
				this.boxOpt.title.text =
					this.$store.state.barDateChoosed +
					' ' +
					this.$store.getters.getRegionIDLabel
				this.getBoxplotData()
			},
			deep: true
		}
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
			const { data: res } = await this.axios.get('data/boxdata', {
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
		// 点击箱线图数据项
		boxPlotItemClicked(e) {
			if (e.name.length === 1 && e.seriesType === 'boxplot') {
				// 点击一层箱体
				// 修改查询条件
				this.queryInfo.type = '2'
				this.$store.commit('selectedRegionIDOnBox', e.name) // 修改状态管理器中的数据，保持其他图表联动更新
				this.queryInfo.date = this.queryInfo.date.slice(0, 4)
				this.boxOpt.title.text =
					this.queryInfo.date.slice(0, 4) +
					' ' +
					this.$store.getters.getRegionIDLabel
				// 请求新数据
				this.getBoxplotData()
				// 显示 restore 按钮
				this.boxOpt.toolbox.show = true
			} else if (e.name.length === 1 && e.seriesType === 'scatter') {
				// 点击一层散点
				// 点击散点在地图上添加标注
				console.log(`点击了点，日期${this.queryInfo.date}，数据${e.data}`)
			} else if (e.name.length === 6 && e.seriesType === 'scatter') {
				// 点击二层散点
				console.log(`点击了点，日期${e.name}，数据${e.data}`)
			} else {
				// 其他情况
				return 0
			}
		},
		// 还原箱线图数据
		boxPlotItemsRestore() {
			// 隐藏 restore 按钮
			this.boxOpt.toolbox.show = false
			this.queryInfo.type = '1'
			// 改变选择区域的
			this.$store.commit('selectedRegionIDOnBox', 'all') // 修改状态管理器中的数据，保持其他图表联动更新
			this.queryInfo.date = this.$store.state.barDateChoosed // 还原为之前选择的日期
			this.boxOpt.title.text =
				this.$store.state.barDateChoosed +
				' ' +
				this.$store.getters.getRegionIDLabel
			// 重新获取数据
			this.getBoxplotData()
		}
	}
}
</script>

<style lang="less" scoped>
.box-plot {
	height: 390px;
}
</style>
