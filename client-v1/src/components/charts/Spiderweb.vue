<template>
	<div>
		<highcharts class="chart" :options="chartOptions"></highcharts>
	</div>
</template>

<script>
export default {
	data() {
		return {
			chartOptions: {
				chart: {
					type: "spline"
				},
				credits: {
					enabled: false // 不显示版权水印
				},
				title: {
					text: "Sin chart"
				},
				series: [
					{
						data: [10, 0, 8, 2, 6, 4, 5, 5],
						color: "#6fcd98"
					}
				]
			}
		};
	},
	watch: {},
	methods: {},
	created() {},
	mounted() {},
	props: {}
};
</script>

<style scoped>
</style>