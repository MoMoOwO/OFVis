import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Analysis from '../components/Analysis.vue'
import Detect from '../components/Detect.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/detect', component: Detect },
      { path: '/analysis', component: Analysis }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
