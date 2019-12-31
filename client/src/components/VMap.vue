<template>
	<l-map id="mapCom" :center="center" :options="mapOptions">
        <!-- 地图瓦片图层 -->
        <l-tile-layer :url="url">
        </l-tile-layer>
        <!-- 特征地图图层 -->
        <l-choropleth-layer :data="areaData"
            titleKey="areaId" idKey="areaId"
            :value="value"
            geojsonIdKey="id" :geojson="areaGeojson" 
            :colorScale="colorScale"
            strokeWidth=0 currentStrokeWidth=0>
            <template slot-scope="props">
                <h3>{{props}}</h3>
                <l-info-control :item="props.currentItem" :unit="props.unit" 
                title="The gradient value" placeholder="Hover over a point"/>
                <l-reference-chart title="Gradient value"
                :colorScale="colorScale" :min="props.min" :max="props.max" position="topright"/>
            </template>
        </l-choropleth-layer>
    </l-map>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet';
import { InfoControl, ReferenceChart, ChoroplethLayer } from 'vue-choropleth';
import areaGeojson from './data/zone.json'; // 海区数据
import 'leaflet/dist/leaflet.css';

export default {
	data() {
		return {
            url: "https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0",
            center: [32, 124],
            mapOptions: {
                zoomSnap: 0.5, // 开启小数(0.5)缩放级别
                zoom: 5.5,
                zoomControl: false,
                scrollWheelZoom: true,
                doubleClickZoom: false,
                dragging: true,
                attributionControl: false,
            },
            value:{
                key: "number",
                metric: "℃/km"
            },
            colorScale: ["2B83BA", "ABDDA4", "FDAE61", "D7191C"],
            areaGeojson,
            areaData: [
                {
                    areaId: '1',
                    number: 10
                },
                {
                    areaId: '2',
                    number: 20
                },
                {
                    areaId: '3',
                    number: 30
                },
                {
                    areaId: '4',
                    number: 40
                },
                {
                    areaId: '5',
                    number: 50
                },
                {
                    areaId: '6',
                    number: 60
                },
                {
                    areaId: '7',
                    number: 70
                },
                {
                    areaId: '8',
                    number: 80
                },
                {
                    areaId: '9',
                    number: 90
                },
                {
                    areaId: '10',
                    number: 100
                },
                {
                    areaId: '11',
                    number: 110
                },
                {
                    areaId: '12',
                    number: 120
                },
                {
                    areaId: '13',
                    number: 130
                }
            ]
        };
	},
	watch: {},
	methods: {},
	created() {

    },
	mounted() {
        console.log(this);
        console.log(this.$slots.default);
    },
    props: [],
    components: {
        'l-map': LMap,
        'l-tile-layer': LTileLayer,
        'l-geo-json': LGeoJson,
        'l-info-control': InfoControl, 
        'l-reference-chart': ReferenceChart, 
        'l-choropleth-layer': ChoroplethLayer 
    }
};
</script>

<style scoped>
#mapCom {
	width: 438px;
	height: 730px;
	margin: 1px auto;
	position: absolute;
}
</style>