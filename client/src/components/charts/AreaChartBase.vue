<template>
	<div class="area-chart-container">
		<!-- autoresize为根据容器缩放重新渲染 -->
		<v-chart class="area-chart"
			ref="areaChart" 
			:options="areaChartOpt" 
			autoresize  
			@click="handleClick"
			@dblclick="handledbClick"
			@brush="handleBrush">
		</v-chart>
	</div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/heatmap";
import "echarts/lib/chart/bar";
import "echarts/lib/component/calendar";
import "echarts/lib/component/brush";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/markLine";

export default {
	data() {
		return {
			datequery: "2015",
			clickDateIndex: null,
			ctrlDown: false,
			shiftDown: false,
			selectedDateIdx: [],
			selectedDate: [],
			areaChartOpt: {
				title: {
					text: "Area of Ocean-Front",
					//subtext: this.$store.state.dateRange[0] + ' to ' + this.$store.state.dateRange[1]
				},
				toolbox:{
					top: 20,
					feature: {
						brush:{
							// 此处配置，刷选的功能
							top: 20,
							type: ['lineY', 'clear']
						}
					}
				},
				brush:{
					// 此处配置刷选的作用项
					yAxisIndex: 0,
					brushType: 'rect'
				},
				visualMap: {
					min: 0,
					max: 0,
					precision: 2, // 显示两位小数
					//calculable: false,  // 可选范围
					orient: "horizontal",
					color: ["#F03B20", "#FEB24C", "#FFEDA0"],
					left: 0,
					bottom: "0",
					itemHeight: "100%",
					seriesIndex: 0
				},
				tooltip: {
					position: "top",
					formatter: (e) => {
						if(e.componentSubType === 'heatmap'){ // 热力图悬浮
							return `Date: ${e.value[0]} <br />area: ${e.value[1].toFixed(2)} km²`;
						} else if(e.componentSubType === 'bar'){ // 条形图悬浮
							return `Date: ${e.seriesName}-${(e.dataIndex + 1).toString().padStart(2, '0')} <br />area: ${e.data.toFixed(2)} km²`
						}
					}
					//triggerOn: 'none'
				},
				calendar: { // 热力图容器
					orient: "vertical", // 排列方向，默认horizontal
					left: 5,
					right: "45%",
					bottom: 50,
					yearLabel: { // 年份标签边距
						show: false
					},
					monthLabel: { // 月份标签边距
						show: false
					},
					dayLabel: {
						firstDay: 1 // 从周一开始
					},
					height: "auto",
					cellSize: "auto", // 单元格大小，[宽，高]数值，auto
					range: "2015" // 设置日历范围，格式：yyyy, yyyy-MM,字符串形式
				},
				grid: {
					left: "72%",
					right: 5
				}, // 条形图容器
				xAxis: {
					type: 'value',
					//show: false,
					splitLine: { // 分割线
						show: true,
						interval: 2 // 间隔几条显示一条
					},
					axisTick:{
						show: false // 轴刻度
					},
					axisLabel:{
						show: false // 轴刻度标签
					}
				},
				yAxis: {
					type: 'category',
					data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					inverse: true, //  顺序倒置
					axisTick: {
						alignWithLabel: true
					}
				},
				series: [
					{ // 热力图的series
						coordinateSystem: "calendar",
						type: "heatmap",
						calendarIndex: 0, // 日历索引
						/* itemStyle: {
							emphasis: {
								borderColor: function(params){
									console.log(params);
								}
							}
						}, */
						itemStyle: {
							normal: {
							},
							emphasis: {
								borderColor: "black"
							}
						},
						data: null
					},
					{ // barchart的series
						name: '2017',
						type: 'bar',
						//barWidth: 10,
						itemStyle: {
							normal: {
							},
							emphasis: {
								color: "#007AFF"
							}
						},
						color: '#00A6FF',
						data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290, 330, 310],
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
				]
			}
		};
	},
	watch: {
		'this.$store.state.dateRange': {
			handler(newVal, oldVal){
				this.calendarOpt.title.subtext = this.$store.state.dateRange[0] + ' to ' + this.$store.state.dateRange[1];
				// 显示该日期的情况
			}
		}
	},
	methods: {
		// 根据年份和海域获取日历面积数据，year年份，areaid：0为全部，其余与海域id对应
		getData(year = 2015, areaid = 0) {
			this.axios
				.post(`data/calendar?year=${year}&areaid=${areaid}`)
				.then(result => {
					if (result.data.status === 0) {						
						// 更新数据
						this.areaChartOpt.visualMap.min = result.data.message.min;
						this.areaChartOpt.visualMap.max = result.data.message.max;
						this.areaChartOpt.calendar.range = year.toString();
						this.areaChartOpt.series[0].data = result.data.message.data;
						// 隐藏缓冲条
						this.$refs.areaChart.hideLoading();
					} else {
						// 失败请求数据的回调
						this.$notify.error({
							title: "Error",
							message: "Failed get Calendar-data!"
						});
					}
				});
		},
		handleClick(e){
			console.log(e)
			// 点击强调该项，双击之后取消显示
			if (e.componentSubType === 'heatmap') {
				// ctrl键按下，可以隔项多选
				if (this.ctrlDown) {
					// 强调该项
					this.$refs.areaChart.dispatchAction({
						type: 'highlight',
						dataIndex: e.dataIndex
					});
					this.selectedDateIdx.push(e.dataIndex); // 记录点击的项索引
					// 记录点击项的日期
					let dateArr = this.areaChartOpt.series[0].data[e.dataIndex][0].split('-');
					this.selectedDate.push(+(dateArr[0] + dateArr[1] + dateArr[2]));
				} else if (this.shiftDown) { // shift按下，可以选中任意起始范围
					// shift按下时，selsectedDateIdx数组中只保持日期的开始与结束索引
					// 强调该项
					this.$refs.areaChart.dispatchAction({
						type: 'highlight',
						dataIndex: e.dataIndex
					});
					this.selectedDateIdx.push(e.dataIndex);
					// 判断是否又修改了终止日其索引
					if (this.selectedDateIdx.length === 3){
						// 终止未修改
						if(this.selectedDateIdx[1] == this.selectedDateIdx[2]){
							this.selectedDateIdx.pop();
						} else { // 修改了结束日期
							this.selectedDateIdx = [this.selectedDateIdx[0], this.selectedDateIdx[2]];
						}
					}
					// 此时selectedDateIdx数组为二维，只保存了起始和终止日期的索引
					if (this.selectedDateIdx.length === 2){
						// 从小的索引开始
						let startIdx = this.selectedDateIdx[0];
						let endIdx = this.selectedDateIdx[1];
						if (this.selectedDateIdx[0] > this.selectedDateIdx[1]) {
							startIdx = this.selectedDateIdx[1];
							endIdx = this.selectedDateIdx[0];
						} else {
							startIdx = this.selectedDateIdx[0];
							endIdx = this.selectedDateIdx[1];
						}
						// 强调范围内的项
						for(let i = startIdx; i <= endIdx; i++){
							this.$refs.areaChart.dispatchAction({
								type: 'highlight',
								dataIndex: i
							});
							// 记录点击项的日期
							let dateArr = this.areaChartOpt.series[0].data[i][0].split('-');
							this.selectedDate.push(+(dateArr[0] + dateArr[1] + dateArr[2]));
						}
					}
				} else {
					// 单纯单击只能选中一个
					// 强调该项
					this.$refs.areaChart.dispatchAction({
						type: 'highlight',
						dataIndex: e.dataIndex
					});
					this.handledbClick(e);
					this.selectedDateIdx.push(e.dataIndex);
					// 记录点击项的日期
					let dateArr = this.areaChartOpt.series[0].data[e.dataIndex][0].split('-');
					this.selectedDate.push(+(dateArr[0] + dateArr[1] + dateArr[2]));
				}

				let newDate = e.value[0].split('-');
				// 修改store仓储中的工共数据date
				//this.$store.commit('changeDate', +(newDate[0] + newDate[1] + newDate[2]));
				console.log(this.selectedDate);
			}
			
		},
		handledbClick(e){
			// 双击取消所有强调项
			if (this.selectedDateIdx.length === 2){
				for(let i = this.selectedDateIdx[0]; i <= this.selectedDateIdx[1]; i++){
					this.$refs.areaChart.dispatchAction({
						type: 'downplay',
						dataIndex: i
					});
				}
			}else{
				// 将所有的淡化
				for(let i of this.selectedDateIdx ) {
					// 淡化之前的选中项
					this.$refs.areaChart.dispatchAction({
						type: 'downplay',
						dataIndex: i
					});
				}
			}
			this.selectedDateIdx = []; // 置空选中项索引数组
			this.selectedDate = []; // 指控选中日期数组
		},
		handleBrush(e){
			console.log(e);
		},
		// 监听键盘按下的事件处理函数
		handleKeydown(e){
			e.preventDefault(); // 取消默认事件
			// 组合键按下可以使用快捷键属性来判断(boolean)
			if(e.ctrlKey){
				this.ctrlDown = true;
			} else if (e.shiftKey){
				this.shiftDown = true;
			}
			// 移除事件，避免重复执行该事件响应
			window.removeEventListener('keydown', this.handleKeydown);
		},
		// 监听键盘弹起的事件处理函数
		handleKeyup(e){
			// 快捷键谈起只能通过keyCode来判断
			if(e.keyCode === 17 || this.ctrlDown){
				this.ctrlDown = false;
			} else if (e.keyCode === 16 || this.ctrlDown){
				this.shiftDown = false;
			}
			// 重新添加事件监听
			window.addEventListener('keydown', this.handleKeydown);
		}
	},
	created() {},
	mounted() {
		// 显示缓冲条
		this.$refs.areaChart.showLoading({
			text: 'Loading…',
			color: '#409EFF',
			maskColor: 'rgba(255, 255, 255, 0.4)'
		});
		// 获取数据
		this.getData();
		// 添加键盘事件监听
		window.addEventListener('keydown', this.handleKeydown);
		window.addEventListener('keyup', this.handleKeyup);
	},
	props: {},
	components: {
		"v-chart": ECharts
	}
};
</script>

<style scoped>
.area-chart-container {
	position: relative;
	width: 100%;
	height: 100%;
}
.area-chart {
	position: absolute;
	width: 100%;
	height: 100%;
}
.echarts {
	width: 100%;
	height: 100%;
}
</style>