// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 安装配置ECharts
// import Echarts from 'echarts';
// Vue.prototype.$echarts = Echarts;
// import ECharts from 'vue-echarts';
// Vue.component('v-chart', ECharts)

// 安装及配置Emement-UI
import ElementUI from 'element-ui';
// 引入国际化语言
import locale from '../node_modules/element-ui/lib/locale/lang/en';
Vue.use(ElementUI, {locale});
// 引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

// 导入axios
import Axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, Axios);

// 导入Vuex，状态管理工具
import Vuex from 'vuex';
// 注册vuex到vue中
Vue.use(Vuex);
// 实例化一个vuex实例
var store = new Vuex.Store({
  state: {
    // state可以理解为专门用来存储共享数据的
    // 如果在组件中访问state中的属性，只能通过this.$store.state.***来访问
    date: 20150101,
    dateRange: ['2016-01-01', '2016-12-31']
  },
  mutations: {
    // 如果要操作store.state中的数据，只能通过调用mutatuions提供的方法才能操作对应的数据，不推荐直接操作state中的数据
    // 修改单个日期，主要用于在地图上显示日期
    changeDate(state, newDate) {
      state.date = newDate;
    },
    // 修改日期范围，主要用于日历图联动到地图等
    changeDateRange(state, newDate) {
      state.dateRange = newDate;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  // 挂载仓储
  components: { App },
  template: '<App/>'
})
