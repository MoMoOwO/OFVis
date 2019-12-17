<template>
	<!-- <div class="calendar">
    <div id="chart" @click="chartClick($event)"></div>
	</div>-->
	<v-chart :options="calendarOpt"></v-chart>
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
      datequery: "2017",

			calendarOpt: {
				// title: {
				//   text: "日历图"
				// },
				visualMap: {
					min: 0,
					max: 1000,
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
					range: this.datequery ? this.datequery : "2017" // 设置日历范围，格式：yyyy, yyyy-MM,字符串形式
				},
				tooltip: {
					position: "top",
					formatter: "{c}"
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
						data: this.getVirtulData(this.datequery)
					}
				]
			}
		};
	},
	watch: {},
	methods: {
		// 格式化时间
		getVirtulData(year) {
      year = year || "2017"; // 默认
      console.log(this.$store);
			var date = +ECharts.number.parseDate(year + "-01-01"); // 起始
			var end = +ECharts.number.parseDate(+year + 1 + "-01-01"); // 结束
			var dayTime = 3600 * 24 * 1000; // 一天的时间，单位毫秒
			var data = [];
			// 以一天的毫秒数进行累加，遍历每一天，为每一天添加随机数据
			for (var time = date; time < end; time += dayTime) {
				data.push([
					ECharts.format.formatTime("yyyy-MM-dd", time), // 日期
					Math.floor(Math.random() * 1000) /// 向下取整
				]);
      }
      console.log(data);
			// 返回日历数据
			return data;
		},

		// 绘制日历图
		/* drawCanlendar() {
			// 初始化图表 renderer指定使用svg渲染
			let canlendarChart = this.$echarts.init(
				document.getElementById("chart"),
				null,
				{ renderer: "svg" }
			);
			canlendarChart.setOption(this.options);

			// 散点点击
			canlendarChart.on("click", params => {
				console.log(params.value);
			});
		},

		// 其他标签的点击事件
		chartClickcc(event) {
			if (event.target.tagName === "tspan") {
				console.log(event.target.textContent);
			}
		} */
	},
	created() {},
	mounted() {},
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