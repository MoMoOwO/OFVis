import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/vue2leaflet.js'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// 导入全局样式表
import './assets/css/global.css'
// 导入 element-ui 组件相关样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入 VueAwesomeSwiper 滑动组件并应用
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 导入axios
import Axios from 'axios'
import VueAxios from 'vue-axios'

// 导入 Vuex 状态管理器
import store from './store/store'

// 导入 tree-list 组件
import VueTreeList from 'vue-tree-list'

// 配置 leaflet marker 图标
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./assets/markers/marker-icon-2x.png'),
  iconUrl: require('./assets/markers/marker-icon.png'),
  shadowUrl: require('./assets/markers/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

// 配置请求根路径
Axios.defaults.baseURL = '/api/'
// 配置 axios
Vue.use(VueAxios, Axios)

// 配置 VueAwesomeSwiper
Vue.use(VueAwesomeSwiper)

// 配置 VueTreeList
Vue.use(VueTreeList)

Vue.config.productionTip = false

new Vue({
  store, // 配置 Vuex 状态管理器
  router,
  render: h => h(App)
}).$mount('#app')
