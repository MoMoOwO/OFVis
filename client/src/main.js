import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/vue2leaflet.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入 element-ui 组件相关样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入 leaflet 地图插件的样式
import 'leaflet/dist/leaflet.css'

// 导入 VueAwesomeSwiper 滑动组件并应用
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

// 导入axios
import Axios from 'axios'
import VueAxios from 'vue-axios'

// 导入 Vuex 状态管理器
import store from './store/store'

// 配置请求根路径
Axios.defaults.baseURL = '/api/'
// 配置 axios
Vue.use(VueAxios, Axios)

// 配置 VueAwesomeSwiper
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false

new Vue({
  store, // 配置 Vuex 状态管理器
  router,
  render: h => h(App)
}).$mount('#app')
