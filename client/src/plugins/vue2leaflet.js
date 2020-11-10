import Vue from 'vue'
// 按需引入 Vue2Leaflet 组件
import { LMap, LTileLayer, LImageOverlay, LMarker, LTooltip, LGeoJson, LControl } from 'vue2-leaflet'
// 将组建添加到 Vue 实例中
Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-image-overlay', LImageOverlay)
Vue.component('l-marker', LMarker)
Vue.component('l-tooltip', LTooltip)
Vue.component('l-geo-json', LGeoJson)
Vue.component('l-control', LControl)
