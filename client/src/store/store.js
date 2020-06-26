import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { // 共享状态/数据
    barDateChoosed: '201501', // 从面积柱状图中点击某个月份，箱线图切换到相同月份的统计，
    boxRegionChoosed: 'all',
    galleryDateRange: '201501',
    imgShowOnMap: '',
    markerShowOnMap: [], // 箱线图悬浮的某个点
    markersShowOnMap: [] // 箱线图中点选的点
  },
  mutations: { // 对外提供修改 state 中数据的接口
    selectedRegionIDOnBox(state, newID) {
      state.boxRegionChoosed = newID
    },
    selectedDateOnBar(state, newVal) {
      state.barDateChoosed = newVal
      state.galleryDateRange = newVal
    },
    selectImgShowOnMap(state, newVal) {
      state.imgShowOnMap = newVal
    },
    hoverPointOnBoxplot(state, newVal) {
      state.markerShowOnMap = newVal
    }
  },
  getters: { // 对外提供获取 state 中数据的接口，可以在获取时对 state 中数据进行包装，否则也可以直接从 state 中获取数据
    getRegionIDLabel: (state) => {
      return 'RegionID: ' + state.boxRegionChoosed
    }
  }
})

export default store
