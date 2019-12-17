<template>
	<v-chart :options="polarOpt"></v-chart>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/polar';

export default {
	data() {
		let data = [];

		for (let i = 0; i <= 360; i++) {
			let t = (i / 180) * Math.PI;
			let r = Math.sin(2 * t) * Math.cos(2 * t);
			data.push([r, i]);
		}
		return {
			polarOpt: {
				title: {
					text: "极坐标双数值轴"
				},
				legend: {
					data: ["line"]
				},
				polar: {
					center: ["50%", "54%"]
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross"
					}
				},
				angleAxis: {
					type: "value",
					startAngle: 0
				},
				radiusAxis: {
					min: 0
				},
				series: [
					{
						coordinateSystem: "polar",
						name: "line",
						type: "line",
						showSymbol: false,
						data: data
					}
				],
				animationDuration: 2000
			}
		};
	},
	watch: {},
	methods: {},
	created() {},
	mounted() {},
	props: {},
	components: {
		'v-chart': ECharts
	}
};
</script>

<style scoped>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
	width: 100%;
	height: 100%;
}
</style>