import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { // 共享状态/数据
    // Echarts 实例化配置项
    echartInitOption: {
      renderer: 'svg' // 使用 svg 渲染
    },
    statsControlGeoJsonOnMap: false,
    barDateChoosed: '201501', // 从面积柱状图中点击某个月份，箱线图切换到相同月份的统计，
    boxRegionChoosed: 'all', // 在箱线图上通过点击箱体选择海区，保持面积图联动
    imgShowOnMap: '20150101', // 在地图上显示的
    yearOnGallery: '2015', // 在 MapGallery 中显示哪一年十二个月的空间状态
    dateArrOnGallery: [], // 通过日历图，折线图修改该数组，显示在 gallery 中
    markerShowOnMap: [], // 箱线图悬浮的某个点
    // markersShowOnMap: [], // 箱线图中点选的点
    regionsShowOnMap: [], // 联动在地图上显示的海区
    regionsColors: [], // 海区颜色
    sampleDataSelectedOnSOM: {} // 在 SOMView 中选择的样本数据 {dateArr, regionIDArr, color}
  },
  mutations: { // 对外提供修改 state 中数据的接口
    changeStateOfGeoJsonOnMap(state, newState) {
      state.statsControlGeoJsonOnMap = newState
    },
    selectedRegionIDOnAxis(state, newID) {
      state.boxRegionChoosed = newID
    },
    selectedDateOnBar(state, newVal) {
      state.barDateChoosed = newVal
    },
    selectImgShowOnMap(state, newVal) {
      state.imgShowOnMap = newVal
    },
    hoverPointOnBoxplot(state, newVal) {
      state.markerShowOnMap = newVal
    },
    changeRegionShowOnMap(state, newVal) {
      state.regionsShowOnMap = newVal
    },
    changeRegionsColors(state, newVal) {
      state.regionsColors = newVal
    },
    changeDateArrOnGallery(state, newVal) {
      state.dateArrOnGallery = newVal
    },
    changeYearOnGallery(state, newVal) {
      state.yearOnGallery = newVal
    },
    selectSampleDataOnSom(state, newVal) {
      state.sampleDataSelectedOnSOM = newVal
    }
  },
  getters: { // 对外提供获取 state 中数据的接口，可以在获取时对 state 中数据进行包装，否则也可以直接从 state 中获取数据
    getRegionIDLabel: (state) => {
      return 'RegionID: ' + state.boxRegionChoosed
    }
  }
})

export default store
