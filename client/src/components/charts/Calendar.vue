<template>
	<!-- autoresize为根据容器缩放重新渲染 -->
	<v-chart 
		ref="calendar" 
		:options="calendarOpt" 
		autoresize  
		@click="handleClick"
		@dblclick="handledbClick">
	</v-chart>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/heatmap";
import "echarts/lib/component/calendar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/visualMap";

export default {
	data() {
		return {
			datequery: "2015",
			calendarOpt: {
				// title: {
				//   text: "日历图"
				// },
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
					right: 10,
					bottom: 50,
					// yearLabel: { // 年份标签边距
					//   margin: 40
					// },
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
					triggerOn: 'none'
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
						data: null
					}
				]
			}
		};
	},
	watch: {},
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
			this.$refs.calendar.dispatchAction({
				type: 'showTip',
				seriesIndex: e.seriesIndex,
				dataIndex: e.dataIndex,
				name: e.name,
				position: 'top'
			});
			let newDate = e.value[0].split('-');
			// 通过调用父组件的方法给父组件传值(修改data中的值)
			this.$emit('changeDateInMap', +(newDate[0] + newDate[1] + newDate[2]));
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
.echarts {
	width: 100%;
	height: 100%;
}
</style>