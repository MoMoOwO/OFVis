// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 安装配置ECharts
import Echarts from 'echarts';
Vue.prototype.$echarts = Echarts;

// 安装及配置Emement-UI
import ElementUI from 'element-ui';
Vue.use(ElementUI);
// 引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

// 导入axios
import Axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, Axios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
