<template>
	<div class="area-chart">
		<!-- autoresize为根据容器缩放重新渲染 -->
		<v-chart class="calendar-chart"
			ref="calendar" 
			:options="calendarOpt" 
			autoresize  
			@click="handleClick"
			@dblclick="handledbClick">
		</v-chart>
		<v-chart class="bar-chart"
			ref="bar" 
			:options="barOpt" 
			autoresize>

		</v-chart>
	</div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/heatmap";
import "echarts/lib/component/calendar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/visualMap";
import "echarts/lib/chart/bar";

export default {
	data() {
		return {
			datequery: "2015",
			clickDateIndex: null,
			calendarOpt: {
				title: {
					text: "Area by daily",
					subtext: this.$store.state.dateRange[0] + ' to ' + this.$store.state.dateRange[1]
				},
				visualMap: {
					min: 0,
					max: 0,
					precision: 2, // 显示两位小数
					//calculable: false,  // 可选范围
					orient: "horizontal",
					color: ["#F03B20", "#FEB24C", "#FFEDA0"],
					left: "center",
					bottom: "0"
				},
				calendar: {
					orient: "vertical", // 排列方向，默认horizontal
					left: 30,
					right: 0,
					bottom: 50,
					yearLabel: { // 年份标签边距
						show: false
					},
					// monthLabel: { // 月份标签边距
					//   margin: 20
					// },
					dayLabel: {
						firstDay: 1 // 从周一开始
					},
					height: "auto",
					cellSize: "auto", // 单元格大小，[宽，高]数值，auto
					range: "2015" // 设置日历范围，格式：yyyy, yyyy-MM,字符串形式
				},
				tooltip: {
					position: "top",
					formatter: (params) => {
						return `Date: ${params.value[0]} <br />area: ${params.value[1].toFixed(2)} km²`;
					},
					//triggerOn: 'none'
				},
				series: [
					{
						coordinateSystem: "calendar",
						type: "heatmap",
						calendarIndex: 0, // 日历索引
						// 设置散点大小
						symbolSize: function(val) {
							return val[1] / 60;
						},
						itemStyle:{
							normal:{
								//borderColor: 'red',
							},
						emphasis:{
								borderColor: 'blue'
							}
						},
						data: null
					}
				]
			},
			barOpt: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					data: ['2015', '2016', '2017']
				},
				grid: {
					left: 0
				},
				xAxis: {
					type: 'value',
					show: false
				},
				yAxis: {
					type: 'category',
					data: ['周一', '周二', '周三', '周四', '周五', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					//show: false,
					splitArea: {
						show: true
					}
				},
				series: [
					{
						name: '2015',
						type: 'bar',
						label: {
							show: true,
							position: 'insideRight'
						},
						data: [320, 302, 301, 334, 390, 330, 320, 320, 302, 301, 334, 390]
					},
					{
						name: '2016',
						type: 'bar',
						label: {
							show: true,
							position: 'insideRight'
						},
						data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90,]
					},
					{
						name: '2017',
						type: 'bar',
						label: {
							show: true,
							position: 'insideRight'
						},
						data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290, 330, 310]
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
						this.calendarOpt.visualMap.min = result.data.message.min;
						this.calendarOpt.visualMap.max = result.data.message.max;
						this.calendarOpt.calendar.range = year.toString();
						this.calendarOpt.series[0].data = result.data.message.data;
						// 隐藏缓冲条
						this.$refs.calendar.hideLoading();
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
			// 点击显示Tip，会一直显示用来保持上下文，双击之后取消显示
			/* this.$refs.calendar.dispatchAction({
				type: 'showTip',
				seriesIndex: e.seriesIndex,
				dataIndex: e.dataIndex,
				name: e.name,
				position: 'top'
			}); */
			this.$refs.calendar.dispatchAction({
				type: 'downplay',
				dataIndex: this.clickDateIndex
			});
			this.clickDateIndex = e.dataIndex;
			this.$refs.calendar.dispatchAction({
				type: 'highlight',
				dataIndex: e.dataIndex
			});
			let newDate = e.value[0].split('-');
			// 修改store仓储中的工共数据date
			this.$store.commit('changeDate', +(newDate[0] + newDate[1] + newDate[2]));
		},
		handledbClick(e){
			// 双击与鼠标移出公用一个handle，隐藏tip
			// 隐藏Tip
			this.$refs.calendar.dispatchAction({
				type: 'hideTip'
			});
		}
	},
	created() {},
	mounted() {
		// 显示缓冲条
		this.$refs.calendar.showLoading({
			text: 'Loading…',
			color: '#F03B20',
			maskColor: 'rgba(255, 255, 255, 0.4)'
		});
		// 获取数据
		this.getData();
	},
	props: {},
	components: {
		"v-chart": ECharts
	}
};
</script>

<style scoped>
.area-chart {
	display: flex;
	width: 100%;
	height: 100%;
}
.calendar-chart {
	width: 80%;
	height: 100%;
}
.bar-chart {
	width: 20%;
	height: 100%;
}
.echarts {
	width: 100%;
	height: 100%;
}
</style>