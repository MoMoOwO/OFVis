import Vue from 'vue';
import Router from 'vue-router';

// 引入自定义组件
import CalendarChart from '@/components/charts/Calendar.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
    },
    {path: '/calendar', component: CalendarChart}
  ]
})
