<template>
	<div id="mapCom">
		<div id="legendDiv">
			<span class="domain domain-q0">{{q0}}</span>
			<span class="domain domain-q1">{{q1}}</span>
			<span class="domain domain-q2">{{q2}}</span>
			<span class="domain domain-q3">{{q3}}</span>
			<span class="domain domain-q4">{{q4}}</span>
			<span class="legend-step" style="background-color: rgb(215, 25, 28);"></span>
			<span class="legend-step" style="background-color: rgb(216, 29, 30);"></span>
			<span class="legend-step" style="background-color: rgb(217, 32, 31);"></span>
			<span class="legend-step" style="background-color: rgb(218, 36, 33);"></span>
			<span class="legend-step" style="background-color: rgb(219, 40, 35);"></span>
			<span class="legend-step" style="background-color: rgb(220, 44, 37);"></span>
			<span class="legend-step" style="background-color: rgb(221, 47, 38);"></span>
			<span class="legend-step" style="background-color: rgb(222, 51, 40);"></span>
			<span class="legend-step" style="background-color: rgb(223, 55, 42);"></span>
			<span class="legend-step" style="background-color: rgb(224, 59, 44);"></span>
			<span class="legend-step" style="background-color: rgb(225, 62, 45);"></span>
			<span class="legend-step" style="background-color: rgb(225, 66, 47);"></span>
			<span class="legend-step" style="background-color: rgb(226, 70, 49);"></span>
			<span class="legend-step" style="background-color: rgb(227, 73, 50);"></span>
			<span class="legend-step" style="background-color: rgb(228, 77, 52);"></span>
			<span class="legend-step" style="background-color: rgb(229, 81, 54);"></span>
			<span class="legend-step" style="background-color: rgb(230, 85, 56);"></span>
			<span class="legend-step" style="background-color: rgb(231, 88, 57);"></span>
			<span class="legend-step" style="background-color: rgb(232, 92, 59);"></span>
			<span class="legend-step" style="background-color: rgb(233, 96, 61);"></span>
			<span class="legend-step" style="background-color: rgb(234, 100, 63);"></span>
			<span class="legend-step" style="background-color: rgb(235, 103, 64);"></span>
			<span class="legend-step" style="background-color: rgb(236, 107, 66);"></span>
			<span class="legend-step" style="background-color: rgb(237, 111, 68);"></span>
			<span class="legend-step" style="background-color: rgb(238, 114, 69);"></span>
			<span class="legend-step" style="background-color: rgb(239, 118, 71);"></span>
			<span class="legend-step" style="background-color: rgb(240, 122, 73);"></span>
			<span class="legend-step" style="background-color: rgb(241, 126, 75);"></span>
			<span class="legend-step" style="background-color: rgb(242, 129, 76);"></span>
			<span class="legend-step" style="background-color: rgb(243, 133, 78);"></span>
			<span class="legend-step" style="background-color: rgb(244, 137, 80);"></span>
			<span class="legend-step" style="background-color: rgb(244, 140, 81);"></span>
			<span class="legend-step" style="background-color: rgb(245, 144, 83);"></span>
			<span class="legend-step" style="background-color: rgb(246, 148, 85);"></span>
			<span class="legend-step" style="background-color: rgb(247, 152, 87);"></span>
			<span class="legend-step" style="background-color: rgb(248, 155, 88);"></span>
			<span class="legend-step" style="background-color: rgb(249, 159, 90);"></span>
			<span class="legend-step" style="background-color: rgb(250, 163, 92);"></span>
			<span class="legend-step" style="background-color: rgb(251, 167, 94);"></span>
			<span class="legend-step" style="background-color: rgb(252, 170, 95);"></span>
			<span class="legend-step" style="background-color: rgb(253, 174, 97);"></span>
			<span class="legend-step" style="background-color: rgb(251, 175, 99);"></span>
			<span class="legend-step" style="background-color: rgb(249, 176, 100);"></span>
			<span class="legend-step" style="background-color: rgb(247, 178, 102);"></span>
			<span class="legend-step" style="background-color: rgb(245, 179, 104);"></span>
			<span class="legend-step" style="background-color: rgb(243, 180, 105);"></span>
			<span class="legend-step" style="background-color: rgb(241, 181, 107);"></span>
			<span class="legend-step" style="background-color: rgb(239, 182, 109);"></span>
			<span class="legend-step" style="background-color: rgb(237, 183, 110);"></span>
			<span class="legend-step" style="background-color: rgb(235, 185, 112);"></span>
			<span class="legend-step" style="background-color: rgb(232, 186, 114);"></span>
			<span class="legend-step" style="background-color: rgb(230, 187, 115);"></span>
			<span class="legend-step" style="background-color: rgb(228, 188, 117);"></span>
			<span class="legend-step" style="background-color: rgb(226, 189, 119);"></span>
			<span class="legend-step" style="background-color: rgb(224, 190, 120);"></span>
			<span class="legend-step" style="background-color: rgb(222, 192, 122);"></span>
			<span class="legend-step" style="background-color: rgb(220, 193, 124);"></span>
			<span class="legend-step" style="background-color: rgb(218, 194, 125);"></span>
			<span class="legend-step" style="background-color: rgb(216, 195, 127);"></span>
			<span class="legend-step" style="background-color: rgb(214, 196, 129);"></span>
			<span class="legend-step" style="background-color: rgb(212, 198, 131);"></span>
			<span class="legend-step" style="background-color: rgb(210, 199, 132);"></span>
			<span class="legend-step" style="background-color: rgb(208, 200, 134);"></span>
			<span class="legend-step" style="background-color: rgb(206, 201, 136);"></span>
			<span class="legend-step" style="background-color: rgb(204, 202, 137);"></span>
			<span class="legend-step" style="background-color: rgb(202, 203, 139);"></span>
			<span class="legend-step" style="background-color: rgb(200, 205, 141);"></span>
			<span class="legend-step" style="background-color: rgb(198, 206, 142);"></span>
			<span class="legend-step" style="background-color: rgb(196, 207, 144);"></span>
			<span class="legend-step" style="background-color: rgb(194, 208, 146);"></span>
			<span class="legend-step" style="background-color: rgb(191, 209, 147);"></span>
			<span class="legend-step" style="background-color: rgb(189, 210, 149);"></span>
			<span class="legend-step" style="background-color: rgb(187, 212, 151);"></span>
			<span class="legend-step" style="background-color: rgb(185, 213, 152);"></span>
			<span class="legend-step" style="background-color: rgb(183, 214, 154);"></span>
			<span class="legend-step" style="background-color: rgb(181, 215, 156);"></span>
			<span class="legend-step" style="background-color: rgb(179, 216, 157);"></span>
			<span class="legend-step" style="background-color: rgb(177, 217, 159);"></span>
			<span class="legend-step" style="background-color: rgb(175, 219, 161);"></span>
			<span class="legend-step" style="background-color: rgb(173, 220, 162);"></span>
			<span class="legend-step" style="background-color: rgb(171, 221, 164);"></span>
			<span class="legend-step" style="background-color: rgb(168, 219, 165);"></span>
			<span class="legend-step" style="background-color: rgb(165, 216, 165);"></span>
			<span class="legend-step" style="background-color: rgb(161, 214, 166);"></span>
			<span class="legend-step" style="background-color: rgb(158, 212, 166);"></span>
			<span class="legend-step" style="background-color: rgb(155, 210, 167);"></span>
			<span class="legend-step" style="background-color: rgb(152, 207, 167);"></span>
			<span class="legend-step" style="background-color: rgb(149, 205, 168);"></span>
			<span class="legend-step" style="background-color: rgb(145, 203, 168);"></span>
			<span class="legend-step" style="background-color: rgb(142, 201, 169);"></span>
			<span class="legend-step" style="background-color: rgb(139, 198, 170);"></span>
			<span class="legend-step" style="background-color: rgb(136, 196, 170);"></span>
			<span class="legend-step" style="background-color: rgb(133, 194, 171);"></span>
			<span class="legend-step" style="background-color: rgb(129, 192, 171);"></span>
			<span class="legend-step" style="background-color: rgb(126, 189, 172);"></span>
			<span class="legend-step" style="background-color: rgb(123, 187, 172);"></span>
			<span class="legend-step" style="background-color: rgb(120, 185, 173);"></span>
			<span class="legend-step" style="background-color: rgb(117, 183, 173);"></span>
			<span class="legend-step" style="background-color: rgb(113, 180, 174);"></span>
			<span class="legend-step" style="background-color: rgb(110, 178, 174);"></span>
			<span class="legend-step" style="background-color: rgb(107, 176, 175);"></span>
			<span class="legend-step" style="background-color: rgb(104, 174, 176);"></span>
			<span class="legend-step" style="background-color: rgb(101, 171, 176);"></span>
			<span class="legend-step" style="background-color: rgb(97, 169, 177);"></span>
			<span class="legend-step" style="background-color: rgb(94, 167, 177);"></span>
			<span class="legend-step" style="background-color: rgb(91, 165, 178);"></span>
			<span class="legend-step" style="background-color: rgb(88, 162, 178);"></span>
			<span class="legend-step" style="background-color: rgb(85, 160, 179);"></span>
			<span class="legend-step" style="background-color: rgb(81, 158, 179);"></span>
			<span class="legend-step" style="background-color: rgb(78, 156, 180);"></span>
			<span class="legend-step" style="background-color: rgb(75, 153, 181);"></span>
			<span class="legend-step" style="background-color: rgb(72, 151, 181);"></span>
			<span class="legend-step" style="background-color: rgb(69, 149, 182);"></span>
			<span class="legend-step" style="background-color: rgb(65, 147, 182);"></span>
			<span class="legend-step" style="background-color: rgb(62, 144, 183);"></span>
			<span class="legend-step" style="background-color: rgb(59, 142, 183);"></span>
			<span class="legend-step" style="background-color: rgb(56, 140, 184);"></span>
			<span class="legend-step" style="background-color: rgb(53, 138, 184);"></span>
			<span class="legend-step" style="background-color: rgb(49, 135, 185);"></span>
			<span class="legend-step" style="background-color: rgb(46, 133, 185);"></span>
		</div>
		<div id="dateDiv">
			Date
			<br />
			{{date}}
		</div>
		<div id="checkAreaDiv">
			<el-checkbox v-model="isShowAreas" @change="showAreaChecked">Sea Areas</el-checkbox>
		</div>
		<div id="mapContainer"></div>
	</div>
</template>

<script>
// 引入leaflet
import * as L from "leaflet";
// 引入leaflet样式
import "leaflet/dist/leaflet.css";
// 引入chroma.js
import * as chroma from "chroma-js";
import * as d3 from "d3";

export default {
	data() {
		return {
			// 地图图层
			myMap: null,
			// 海区分区组图层
			areaLayers: null,
			// 数据点组图层
			dataLayers: null,
			// 标记是否显示海区划分图层
			isShowAreas: false,
			// 用来显示当前现实的日期
			date: 20150101,
			// 最大值
			maxData: 2,
			// 温度区间五分位数
			q0: 0.00,
			q1: 0,
			q2: 0,
			q3: 0,
			q4: 0
		};
	},
	watch: {
		maxData:{  // 监听maxData的改变，当maxData改变，其他四个数也改变
			handler(newVal, oldVal){
				this.q1 = (0.25 * this.maxData).toFixed(2);
				this.q2 = (0.5 * this.maxData).toFixed(2);
				this.q3 = (0.75 * this.maxData).toFixed(2);
				this.q4 = this.maxData.toFixed(2);
			}
		}
	},
	methods: {
		// 初始化地图图层，只包含地图
		createMap() {
			// 地图对象
			this.myMap = L.map("mapContainer", {
				center: [32, 124],
				zoomSnap: 0.5, // 开启小数(0.5)缩放级别
				zoom: 5.5,
				zoomControl: false,
				scrollWheelZoom: true,
				doubleClickZoom: false,
				dragging: true,
				attributionControl: false
				//preferCanvas: true, // 启用canvas
			});
			// 通过给定URL模板和具有选项的对象来实例化一个切片图层
			L.tileLayer(
				"https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0",
				//"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
				{ attribution: "OSM" }
			).addTo(this.myMap); // 将图层加到地图上
		},
		// 添加海区Geo和数据点Geo、填充不可见的
		addGeoOnMap(){
			// 请求海区Geo
			this.axios.post("data/geo?type=zone").then(result => {
				if(result.data.status === 0){
					console.log(result.data.message.data[0]);
					// 成功请求数据的回调
					this.areaLayers = L.geoJSON(result.data.message.data, {
						style: { weight: 1, opacity: 1 }
					}); // 将geo数据初始化为图层组
					this.areaLayers.bindPopup((e) => { // 绑定点击事件
						return "Area_id: " + e.feature.properties.note; // 显示海区编号
					});
				}else{
					// 失败请求数据的回调
					this.$notify.error({
						title: 'Error',
						message: 'Failed get Geo-data!'
					});
				}
			});
			// 请求数据点Geo
			this.axios.post("data/geo?type=dataPoly").then(result => {
				if(result.data.status === 0){
					console.log(result.data.message.data[0]);
					// 成功请求数据的回调
					this.dataLayers = L.geoJSON(result.data.message.data, {
						style: { fillColor: "red", weight: 0, opacity: 1 }
					}); // 将geo数据初始化为图层组
					this.dataLayers.bindPopup((e) => { // 绑定点击事件
						return "sstg: " + e.feature.properties.sstg; // 显示梯度值
					});
					this.myMap.addLayer(this.dataLayers); // 添加到地图
				}else{
					// 失败请求数据的回调
					this.$notify.error({
						title: 'Error',
						message: 'Failed get Geo-data!'
					});
				}
			});
		},
		addPoint() {
			this.axios.post(`/data/grid?date=${this.date}`).then(result => {
				if (result.data.status === 0) {
					let max = result.data.message.max;
					let min = 0;
					this.maxData = max; // 更新最大值
					// 定义线性颜色映射比例尺
					let legendColor = chroma
						.scale(["2B83BA", "ABDDA4", "FDAE61", "D7191C"])
						.domain([min, max]);
					console.log(result);

					//console.log(result.data.message.data);
					/* result.data.message.data.forEach(item => {
						L.circle([item.latitude, item.longitude], {
							color: legendColor(item.sstg),
							radius: 1,
							fillOpacity: 1
						}).addTo(this.myMap);
						// let react = this.getReact([item.longitude, item.latitude]);
						// L.polygon(react, {
						// 	fil lColor: legendColor(item.sstg),
						// 	weight: 0,
						// 	fillOpacity: 1
						// }).addTo(this.myMap);

						//L.circle([item.lat, item.lon], {color:compute(scaleLinear(item.temp)), radius:1, fillOpacity:1}).addTo(this.myMap);
					}); */

					myMap._initPathRoot();
					let svg = d3.select("#mapContainer").select("svg");
					let g = svg.append("g");
					
					result.data.message.data.forEach(item => {
						item.LatLng = new L.LatLng(item.latitude, item.longitude);
					});
					let features =  g.selectAll("circle")
						.data(result.data.message.data)
						.enter().append("circle")
						.style("opacity", 1) 
						.style("fill", (d, i) => {
							return legendColor(d.sstg)
						})
						.attr("r", 1); 
					myMap.on("viewreset", update);
					update();
					function update() {
						features.attr("transform", 
						function(d) { 
							return "translate("+ 
								myMap.latLngToLayerPoint(d.LatLng).x +","+ 
								myMap.latLngToLayerPoint(d.LatLng).y +")";
							}
						)
					}

				} else {
					this.$notify.error({
						title: 'Error',
						message: 'Failed get Grid-data!'
					});
				}
			});
			//L.circle([32, 125],{color:"#3388ff",radius:1,fillOpacity:1}).addTo(this.myMap);
		},
		showAreaChecked(val){
			// val:true/false是否选中
			if(val){
				this.myMap.addLayer(this.areaLayers);
			}else{
				this.myMap.removeLayer(this.areaLayers);
			}
		},
		getReact(coords) {
			return [
				[coords[1] - 0.05, coords[0] - 0.05],
				[coords[1] - 0.05, coords[0] + 0.05],
				[coords[1] + 0.05, coords[0] + 0.05],
				[coords[1] + 0.05, coords[0] - 0.05]
			];
		}
	},
	created() {},
	mounted() {
		// 为其他data初始化
		this.q1 = (0.25 * this.maxData).toFixed(2);
		this.q2 = (0.5 * this.maxData).toFixed(2);
		this.q3 = (0.75 * this.maxData).toFixed(2);
		this.q4 = this.maxData.toFixed(2);
		// 需要在此时调用绘制地图的函数，此时DOM组件已经初始化好
		this.createMap();
		this.addGeoOnMap();
		this.addPoint();
	},
	components: {},
	props: {}
};
</script>

<style scoped>
#mapContainer {
	width: 438px;
	height: 730px;
	margin: 1px auto;
	position: absolute;
}
#dateDiv {
	width: 80px;
	height: 40px;
	text-align: center;
	border-radius: 6px;
	background-color: rgb(248, 248, 248);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	position: absolute;
	top: 5px;
	left: 5px;
	z-index: 99999;
}
#legendDiv {
	height: 200px;
	width: 75px;
	padding: 10px 5px;
	background-color: rgb(248, 248, 248);
	border-radius: 6px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	font-size: 0;
	box-sizing: border-box;
	position: absolute;
	top: 340px;
	left: 5px;
	z-index: 99999;
}
.legend-step {
	display: inline-block;
	height: 0.83%;
	width: 40px;
}
.domain {
	position: absolute;
	font-size: 12px;
	/* font-weight: bold; */
	right: 5px;
	transform: translateY(-50%);
}
.domain-q0 {
	top: 185px;
}
.domain-q1 {
	top: 145px;
}
.domain-q2 {
	top: 50%;
}
.domain-q3 {
	top: 55px;
}
.domain-q4 {
	top: 10px;
}
#checkAreaDiv{
	background-color: rgb(248, 248, 248);
	border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: absolute;
    top: 270px;
    left: 5px;
    z-index: 99999;
}
</style>