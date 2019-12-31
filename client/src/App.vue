<template>
	<div id="mainContainer">
		<header id="headerContainer">
			<div id="logoContainer">
				<div id="sysNameDiv">OF-Vis</div>
			</div>
		</header>

		<article id="articleContainer">
			<div class="art-container left-container">
				<div id="radar-chart">
					<radar-chart @changeDateInMap="changeDateInMap"></radar-chart>
				</div>
				<div id="line-chart">
					<box-chart></box-chart>
				</div>
				<div id="calendar-chart">
					<calendar-chart @changeDateInMap="changeDateInMap"></calendar-chart>
				</div>
			</div>
			<div class="art-container center-container">
				<div id="map">
					<map-chart :dateShowInMap="dateShowInMap"></map-chart>
					<!-- <map-chart></map-chart> -->
				</div>
			</div>
			<div class="art-container right-container"></div>
		</article>
	</div>
</template>

<script>
import mapchart from "@/components/MapChart.vue";
import radarchart from "@/components/charts/Radar.vue";
import boxchart from "@/components/charts/Box.vue";
import calendarchart from "@/components/charts/Calendar.vue";
import map from "@/components/VMap.vue";

export default {
	data() {
		return {
			// 在地图上显示的数据的日期
			dateShowInMap: 20150101 
		};
	},
	watch: {},
	methods: {
		changeDateInMap(newDate){
			this.dateShowInMap = newDate;
		}
	},
	created() {},
	mounted() {},
	components: {
		//"map-chart": mapchart,
		"map-chart": map,
		//"spiderweb-chart": spiderwebchart,
		'box-chart': boxchart,
		"radar-chart": radarchart,
		"calendar-chart": calendarchart
	},
	props: {}
};
</script>

<style scoped>
#mainContainer {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	border: solid 2px #ccc;
	border-radius: 4px;
	height: 100%;
	width: 100%;
	padding: 36px 0 0;
}

#headerContainer {
	width: 100%;
	height: 36px;
	margin: -36px 0 0;
	box-sizing: border-box;
	border-bottom: solid 2px #ccc;
}
#logoContainer {
	height: 36px;
	width: 100px;
	position: relative;
	overflow: hidden;
}
#logoContainer > #sysNameDiv {
	font-size: 18px;
	position: absolute;
	left: 25%;
	top: 50%;
	transform: translate(-25%, -50%);
	transition: all ease-out 1s;

	/* 文本不可选中 */
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Chrome/Safari/Opera */
	-khtml-user-select: none; /* Konqueror */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
}
#logoContainer > #sysNameDiv:hover {
	font-size: 20px;
}
#logoContainer::after {
	content: "";
	position: absolute;
	left: 82px;
	height: 60px;
	width: 2px;
	transform: translateY(-25%) rotate(45deg);
	background-color: #ccc;
}
#logoContainer::before {
	content: "";
	position: absolute;
	top: 34px;
	height: 2px;
	width: 64px;
	background-color: #ccc;
}

#articleContainer {
	height: 100%;
	width: 100%;
	display: flex;
}

.art-container {
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	box-sizing: border-box;
	margin: 4px;
}
.left-container {
	flex: 1;
	display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}
.center-container {
	width: 440px;
}
.right-container {
	flex: 1;
}

#calendar-chart{
    width: 30%;
    height: 100%;
}
#radar-chart, #line-chart{
    width: 70%;
    height: 50%;
}
#radar-chart{
}
#line-chart{
}

#map {
	position: absolute;
	width: 438px;
	height: 800px;
}
</style>