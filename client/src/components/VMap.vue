<template>
	<l-map id="mapCom" :zoom="zoom" :center="center">
        <l-tile-layer :url="url">
            <l-geo-json
                :geojson="geojson"
                :optionsStyle="optionStyle"
            >
            </l-geo-json>
        </l-tile-layer>
    </l-map>
</template>

<script>
import {LMap, LTileLayer, LGeoJson} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
	data() {
		return {
            url: "https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA#5.0/33.031539/127.253861/0",
            center: [32, 124],
			zoomSnap: 0.5, // 开启小数(0.5)缩放级别
			zoom: 5.5,
			zoomControl: false,
			scrollWheelZoom: true,
			doubleClickZoom: false,
			dragging: true,
            attributionControl: false,
            geojson: [{
            "properties": {
                "note": "1",
                "distance": "1261715.86 m",
                "drawtype": "polygon",
                "area": "13989975.45 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [117.5, 41],
                        [117.5, 37],
                        [119.35, 37],
                        [120, 38.5],
                        [122, 38.5],
                        [122, 40],
                        [123, 41],
                        [117.5, 41]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "2",
                "distance": "1589338.12 m",
                "drawtype": "polygon",
                "area": "13173053.07 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [122, 40],
                        [126, 40],
                        [126, 38],
                        [127, 38],
                        [127, 36],
                        [124, 36],
                        [124, 38],
                        [122, 38.5],
                        [122, 40]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "3",
                "distance": "1427578.01 m",
                "drawtype": "polygon",
                "area": "16547105.01 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [122, 38.5],
                        [120, 38.5],
                        [118.5, 35],
                        [124, 35],
                        [124, 38],
                        [122, 38.5]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "4",
                "distance": "2102855.58 m",
                "drawtype": "polygon",
                "area": "24664170.83 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [123, 35],
                        [124, 35],
                        [124, 36],
                        [129.2, 36],
                        [132, 35],
                        [132, 33],
                        [125.7, 33],
                        [123, 34.5],
                        [123, 35]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "5",
                "distance": "1564309.16 m",
                "drawtype": "polygon",
                "area": "23646686.96 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [118.5, 35],
                        [118.5, 30],
                        [122.4, 30],
                        [123, 31],
                        [123, 31.5],
                        [123.8, 32.2],
                        [123.8, 32.8],
                        [123, 33.4],
                        [123, 35],
                        [118.5, 35]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "6",
                "distance": "749468.50 m",
                "drawtype": "polygon",
                "area": "6898472.84 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [131.3, 33],
                        [131.3, 31],
                        [127.7, 31],
                        [127.7, 33],
                        [131.3, 33]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "7",
                "distance": "2132171.42 m",
                "drawtype": "polygon",
                "area": "38846898.80 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [117, 30],
                        [116.3, 23.1],
                        [118, 23.1],
                        [120.3, 24],
                        [123, 27.6],
                        [123.3, 29.5],
                        [123, 31],
                        [122.4, 30],
                        [117, 30]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "8",
                "distance": "2745476.04 m",
                "drawtype": "polygon",
                "area": "37948278.83 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [110, 18.5],
                        [110, 23.1],
                        [118, 23.1],
                        [120.3, 24],
                        [120.3, 22],
                        [112, 18.5],
                        [110, 18.5]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "9",
                "distance": "1581840.00 m",
                "drawtype": "polygon",
                "area": "20605014.13 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [120.3, 24],
                        [122, 25],
                        [124, 25],
                        [124, 19.5],
                        [122, 19.5],
                        [120.3, 22],
                        [120.3, 24]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "10",
                "distance": "2564505.97 m",
                "drawtype": "polygon",
                "area": "27284892.08 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [127.7, 31],
                        [126, 29],
                        [123.062, 28],
                        [123, 27.6],
                        [120.3, 24],
                        [122, 25],
                        [126, 25],
                        [131.3, 31],
                        [127.7, 31]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "11",
                "distance": "1845824.01 m",
                "drawtype": "polygon",
                "area": "21646118.32 ha"
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [123, 34.5],
                        [123, 33.4],
                        [123.8, 32.8],
                        [123.8, 32.2],
                        [123, 31.5],
                        [123, 31],
                        [123.3, 29.5],
                        [123.062, 28],
                        [126, 29],
                        [127.7, 31],
                        [127.7, 33],
                        [125.7, 33],
                        [123, 34.5]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "12",
                "distance": "",
                "drawtype": "polygon",
                "area": ""
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [131.3, 31],
                        [126, 25],
                        [124, 25],
                        [124, 19.5],
                        [131.3 ,19.5],
                        [131.3, 31]
                    ]
                ]
            }
        }, {
            "properties": {
                "note": "13",
                "distance": "",
                "drawtype": "polygon",
                "area": ""
            },
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [132, 35],
                        [129.2, 36],
                        [127, 36],
                        [127, 38],
                        [126, 38],
                        [126, 40],
                        [122, 40],
                        [123, 41],
                        [132, 41],
                        [132, 35]
                    ]
                ]
            }
        }],
            optionStyle: {
                fillColor: 'red',
                color: 'blcak'
            },
        };
	},
	watch: {},
	methods: {},
	created() {

    },
	mounted() {},
    props: [],
    components: {
        'l-map': LMap,
        'l-tile-layer': LTileLayer,
        'l-geo-json': LGeoJson
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