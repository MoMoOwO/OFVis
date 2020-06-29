<template>
  <div class="som-container">
    <v-chart class="umartix-container" :options="uMatrixOpt"></v-chart>
    <v-chart ref="weightMartix" class="wmartix-container" :options="wMatrixOpt"></v-chart>
    <!-- <el-table
      :data="tableData"
      height="385"
      border
      :row-class-name="tableRowClassName"
      :header-cell-style="{
          'background-color': '#ccc',
          'color': 'black',
          'font-size': '9px'
      }"
    >
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column prop="MI" label="Moran's I" width="85"></el-table-column>
      <el-table-column prop="Mo" label="Mode" width="60"></el-table-column>
      <el-table-column prop="Qd" label="Qd" width="60"></el-table-column>
      <el-table-column prop="Sk" label="Skewness" width="88"></el-table-column>
      <el-table-column prop="EK" label="Ex_Kurtosis" width="97"></el-table-column>
      <el-table-column prop="ClusterId" label="ClusterId" width="90"></el-table-column>
    </el-table>-->
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
	data() {
		return {
			uMatrixOpt: {
				// 0 坐标轴用于两个矩阵图，1 坐标轴用于散点图
				xAxis: [
					{
						type: 'category',
						show: false
					},
					{
						type: 'value',
						min: 0,
						max: 10,
						show: false
					}
				],
				yAxis: [
					{
						type: 'category',
						show: false
					},
					{
						type: 'value',
						min: 0,
						max: 10,
						show: false
					}
				],
				grid: {
					left: 20,
					right: 20,
					top: 40,
					bottom: 0
					// containLabel: true
				},
				legend: {
					data: ['distance'],
					borderColor: '#ccc',
					borderWidth: 1
				},
				tooltip: {},
				visualMap: {
					min: 0,
					max: 10,
					precision: 4,
					calculable: false,
					orient: 'horizontal',
					left: 'center',
					dimension: 2,
					inRange: {
						color: ['#fff', '#000']
					},
					show: false
				},
				series: [
					// 聚类矩阵图
					{
						name: 'cluster',
						data: [],
						type: 'heatmap',
						xAxisIndex: 0,
						yAxisIndex: 0,
						label: {
							// show: true
						}
					},
					// 距离矩阵图
					{
						name: 'distance',
						symbolSize: function(data) {
							return data[2] * 2
						},
						hoverAnimation: false,
						type: 'scatter',
						symbol: 'rect',
						xAxisIndex: 0,
						yAxisIndex: 0,
						data: [],
						itemStyle: {
							color: 'rgb(255,255,255)'
						},
						tooltip: {
							formatter: function(params) {
								return 'Distance: ' + params.value[2]
							}
						}
					}
				]
			},
			wMatrixOpt: {
				grid: {
					left: 20,
					right: 20,
					top: 40,
					bottom: 0
					// containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
					show: false
				},
				yAxis: {
					type: 'category',
					data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
					show: false
				},
				series: []
			}
		}
	},
	components: {
		'v-chart': ECharts
	},
	props: [],
	mounted() {
		this.getSOMResult()
	},
	methods: {
		// 获取表格数据
		getTableData() {
			this.resData.forEach(item => {
				this.tableData.push({
					id: item[2],
					MI: item[3][0].toFixed(3),
					Mo: item[3][1].toFixed(3),
					Qd: item[3][2].toFixed(3),
					Sk: item[3][3].toFixed(3),
					EK: item[3][4].toFixed(3),
					DESC: item[4],
					ClusterId: item[5]
				})
			})
		},
		// 表格行类名
		tableRowClassName({ row, rowIndex }) {
			if (row.ClusterId === 0) {
				return 'cluster-a-row'
			} else if (row.ClusterId === 1) {
				return 'cluster-b-row'
			} else if (row.ClusterId === 2) {
				return 'cluster-c-row'
			} else if (row.ClusterId === 3) {
				return 'cluster-d-row'
			}
			return ''
		},

		// 获取 UMatrix
		async getSOMResult() {
			const { data: res } = await this.axios.get('som/somresult')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get matrix data!')
			} else {
				this.uMatrixOpt.visualMap.min = res.data.min
				this.uMatrixOpt.visualMap.max = res.data.max
				this.uMatrixOpt.series[0].data = res.data.UMatrix
				this.uMatrixOpt.series[1].data = res.data.unitCount

				this.wMatrixOpt.xAxis.max = res.data.size
				this.wMatrixOpt.yAxis.max = res.data.size
				const seriesData = this.getSeries(res.data.weightsMatrix)
				this.$refs.weightMartix.mergeOptions({
					series: {
						symbolSize: 31,
						hoverAnimation: false,
						type: 'scatter',
						data: seriesData.scatterSeriesData,
						itemStyle: {
							color: 'rgb(0,0,0, 0)',
							borderColor: '#ccc',
							borderWidth: 2
						}
					}
				})
				this.$refs.weightMartix.mergeOptions({
					legend: {
						data: ["Moran's I", 'Mode', 'Qd', 'Skewness', 'Excess_Kurtosis'],
						icon: 'circle',
						itemWidth: 7,
						itemHeight: 7,
						textStyle: {
							fontSize: 12,
							color: '#ffff0'
						},
						top: 5
					},
					series: seriesData.pieSeries
				})
			}
		},
		getSeries(weightsMatrix) {
			const pieSeries = []
			const scatterSeriesData = []
			for (const item of weightsMatrix) {
				const center = this.$refs.weightMartix.convertToPixel(
					{ xAxisIndex: 0, yAxisIndex: 0 },
					[item[0] + '', item[1] + '']
				)
				pieSeries.push({
					id: item[3],
					type: 'pie',
					center: center,
					animation: false,
					label: {
						show: false
					},
					radius: 15,
					roseType: 'radius',
					data: item[2]
				})
				scatterSeriesData.push([item[0], item[1], item[3]])
			}
			console.log(pieSeries)
			return { pieSeries, scatterSeriesData }
		}
	}
}
</script>

<style lang="less" scoped>
.som-container {
	width: 100%;
	height: 390px;
	display: flex;
	.umartix-container {
		width: 365px;
	}
	.wmartix-container {
		width: 365px;
	}
	/* .el-table {
		margin: 5px 5px 5px 0px;
	} */
}
</style>
