import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { // 共享状态/数据
    barDateChoosed: '201501',
    boxRegionChoosed: 'all'
  },
  mutations: { // 对外提供修改 state 中数据的接口
    selectedRegionIDOnBox(state, newID) {
      state.boxRegionChoosed = newID
    }
  },
  getters: { // 对外提供获取 state 中数据的接口，可以在获取时对 state 中数据进行包装，否则也可以直接从 state 中获取数据
    getRegionIDLabel: (state) => {
      return 'RegionID: ' + state.boxRegionChoosed
    }
  }
})

export default store
