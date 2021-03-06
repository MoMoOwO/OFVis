<template>
  <div class="swiper">
    <swiper ref="imgSwiper" class="swiper" :options="swiperOption">
      <div
        class="swiper-lazy-preloader swiper-lazy-preloader-white"
        v-show="!imgList.length"
      ></div>
      <swiper-slide
        v-for="(item, index) in imgList"
        :key="item.fileName"
        v-show="imgList.length"
      >
        <div
          style="text-align: center; cursor: pointer"
          @click="selectMap(index)"
        >
          {{ item.fileName }}
        </div>
        <!-- <img :src="item.base64Str" :title="item.fileName" @click="imgItemClicked(item)" /> -->
        <l-map
          style="height: 150px; width: 141px"
          :center="[32.3, 126]"
          :options="mapSwiperOptions"
        >
          <l-image-overlay
            :url="item.base64Str"
            :bounds="[
              [22, 117],
              [40.9, 135]
            ]"
          ></l-image-overlay>
          <!-- 海区分类 gejson 图层 -->
          <l-geo-json
            v-if="samplesData.regionId.length"
            :geojson="getShowRegionJson(index)"
            :options="getShowRegionJsonOptions(index)"
          ></l-geo-json>
          <!-- 普通显示单海区范围 -->
          <l-geo-json
            v-if="statsToShowRegion"
            :geojson="showRegionGeoJson"
            :options="showRegionGeoJsonOptions"
          ></l-geo-json>
        </l-map>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <!-- 弹窗 SmallMutiple -->
    <el-dialog
      title="Map-Gallery"
      :visible.sync="isFullScreen"
      width="50%"
      :before-close="fullScreenClosed"
      @opened="mapGalleryDialogOpened"
    >
      <div
        v-for="(item, index) in imgList"
        :key="item.fileName"
        v-show="imgList.length"
      >
        <div
          style="text-align: center; cursor: pointer"
          @click="selectMap(index)"
        >
          {{ item.fileName }}
        </div>
        <l-map
          ref="map"
          style="height: 180px; width: 140px"
          :center="[32, 125.9]"
          :options="mapGalleryOptions"
        >
          <l-image-overlay
            :url="item.base64Str"
            :bounds="[
              [22, 117],
              [40.9, 135]
            ]"
          ></l-image-overlay>
          <!-- 海区分类 gejson 图层 -->
          <l-geo-json
            v-if="samplesData.regionId.length"
            :geojson="getShowRegionJson(index)"
            :options="getShowRegionJsonOptions(index)"
          ></l-geo-json>
          <!-- 普通显示单海区范围 -->
          <l-geo-json
            v-if="statsToShowRegion"
            :geojson="showRegionGeoJson"
            :options="showRegionGeoJsonOptions"
          ></l-geo-json>
        </l-map>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tileUrl:
        'https://api.mapbox.com/styles/v1/momoowo/cjzzc245d0hpc1cnts2lnwtwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9tb293byIsImEiOiJjanp5enEyenIxbnl6M2JtdjJib3B5cmJrIn0.THgFXKBewGaYauwvYLy5bA',
      queryInfo: {
        type: '1', // 1 月份的所有天，或者年份的 12 个月，3 日期数组
        date: this.$store.state.yearOnGallery
      },
      imgList: [],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 5,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        simulateTouch: false, // 不可触摸滑动
        onClick(swiper) {
          console.log(swiper)
        }
      },
      mapSwiperOptions: {
        zoomSnap: 0.5, // 开启小数(0.5)缩放级别
        zoom: 3,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        attributionControl: false
      },
      mapGalleryOptions: {
        zoomSnap: 0.5, // 开启小数(0.5)缩放级别
        zoom: 3.5,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        attributionControl: false
      },
      statsToShowRegion: this.$store.state.statsControlGeoJsonOnMap,
      // 这些 geojson 用于在统计图表交互时显示的海区
      // 在海区上显示的 geojson 数据
      showRegionGeoJson: {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              note: '-1',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [0, 1],
                  [0, 0]
                ]
              ]
            }
          }
        ]
      },
      showRegionGeoJsonCopy: {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              note: '-1',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [0, 1],
                  [0, 0]
                ]
              ]
            }
          }
        ]
      },
      // geojson 样式
      showRegionGeoJsonOptions: {},
      // 下面的 geojson 用于显示在 SOM-View 中交互的海区显示
      // 所有海区的 geojson 数据，用于取显示海区
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              note: '1',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [117.5, 41],
                  [117.5, 37],
                  [119.35, 37],
                  [120, 38.5],
                  [122, 38.5],
                  [122, 40],
                  [123, 41],
                  [117.5, 41]
                ]
              ]
            }
          },
          {
            properties: {
              note: '3',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [122, 40],
                  [126, 40],
                  [126, 38],
                  [127, 38],
                  [127, 36],
                  [124, 36],
                  [124, 38],
                  [122, 38.5],
                  [122, 40]
                ]
              ]
            }
          },
          {
            properties: {
              note: '2',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [122, 38.5],
                  [120, 38.5],
                  [118.5, 35],
                  [124, 35],
                  [124, 38],
                  [122, 38.5]
                ]
              ]
            }
          },
          {
            properties: {
              note: '4',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [123, 35],
                  [124, 35],
                  [124, 36],
                  [129.2, 36],
                  [132, 35],
                  [132, 33],
                  [125.7, 33],
                  [123, 34.5],
                  [123, 35]
                ]
              ]
            }
          },
          {
            properties: {
              note: '5',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [118.5, 35],
                  [118.5, 30],
                  [122.4, 30],
                  [123, 31],
                  [123, 31.5],
                  [123.8, 32.2],
                  [123.8, 32.8],
                  [123, 33.4],
                  [123, 35],
                  [118.5, 35]
                ]
              ]
            }
          },
          {
            properties: {
              note: '7',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [131.3, 33],
                  [131.3, 31],
                  [127.7, 31],
                  [127.7, 33],
                  [131.3, 33]
                ]
              ]
            }
          },
          {
            properties: {
              note: '8',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [117, 30],
                  [116.3, 23.1],
                  [118, 23.1],
                  [120.3, 24],
                  [123, 27.6],
                  [123.3, 29.5],
                  [123, 31],
                  [122.4, 30],
                  [117, 30]
                ]
              ]
            }
          },
          {
            properties: {
              note: '10',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [110, 18.5],
                  [110, 23.1],
                  [118, 23.1],
                  [120.3, 24],
                  [120.3, 22],
                  [112, 18.5],
                  [110, 18.5]
                ]
              ]
            }
          },
          {
            properties: {
              note: '11',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [120.3, 24],
                  [122, 25],
                  [124, 25],
                  [124, 19.5],
                  [122, 19.5],
                  [120.3, 22],
                  [120.3, 24]
                ]
              ]
            }
          },
          {
            properties: {
              note: '9',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [127.7, 31],
                  [126, 29],
                  [123.062, 28],
                  [123, 27.6],
                  [120.3, 24],
                  [122, 25],
                  [126, 25],
                  [131.3, 31],
                  [127.7, 31]
                ]
              ]
            }
          },
          {
            properties: {
              note: '6',
              distance: '1845824.01 m',
              drawtype: 'polygon',
              area: '21646118.32 ha'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [123, 34.5],
                  [123, 33.4],
                  [123.8, 32.8],
                  [123.8, 32.2],
                  [123, 31.5],
                  [123, 31],
                  [123.3, 29.5],
                  [123.062, 28],
                  [126, 29],
                  [127.7, 31],
                  [127.7, 33],
                  [125.7, 33],
                  [123, 34.5]
                ]
              ]
            }
          },
          {
            properties: {
              note: '12',
              distance: '',
              drawtype: 'polygon',
              area: ''
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [131.3, 31],
                  [126, 25],
                  [124, 25],
                  [124, 19.5],
                  [131.3, 19.5],
                  [131.3, 31]
                ]
              ]
            }
          },
          {
            properties: {
              note: '13',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [132, 35],
                  [129.2, 36],
                  [127, 36],
                  [127, 38],
                  [126, 38],
                  [126, 40],
                  [122, 40],
                  [123, 41],
                  [132, 41],
                  [132, 35]
                ]
              ]
            }
          }
        ]
      },
      // 在地图上显示海区的数据
      showRegionJson: {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              note: '-1',
              drawtype: 'polygon'
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [0, 1],
                  [0, 0]
                ]
              ]
            }
          }
        ]
      },
      // 显示 geojson 配置项
      showRegionJsonOptions: {},
      // SOM 选中的 Sample 数据，要显示带海区分类的数据
      samplesData: {
        date: [],
        regionId: [],
        color: []
      }
    }
  },
  props: ['isFullScreen'],
  created() {
    this.getImgData()
  },
  computed: {
    swiper() {
      return this.$refs.imgSwiper.swiper
    }
  },
  mounted() {
    this.swiper.slideTo(3, 10, false)
  },
  watch: {
    /* '$store.state.barDateChoosed': {
      // 联动，监听选择年月份的改变
      handler: function (newVal) {
        this.imgList = []
        this.queryInfo.type = '1'
        this.queryInfo.date = newVal
        this.getImgData()
      },
      deep: true
    }, */
    '$store.state.yearOnGallery': {
      // 联动，监听选择年月份的改变
      handler: function (newVal) {
        this.imgList = []
        this.queryInfo.type = '1'
        this.queryInfo.date = newVal
        this.getImgData()
      },
      deep: true
    },
    '$store.state.dateArrOnGallery': {
      // 联动，监听选择年月份的改变
      handler: function (newVal) {
        if (newVal.length !== 0) {
          // 有新数组
          this.imgList = []
          this.queryInfo.type = '3'
          this.queryInfo.date = newVal.join(',')
          this.getImgData()
        }
      },
      deep: true
    },
    '$store.state.sampleDataSelectedOnSOM': {
      // 联动，监听选择年月份的改变
      handler: function (newVal) {
        // 非空对象
        if (newVal.date.length !== 0) {
          this.samplesData = newVal
          this.imgList = []
          this.queryInfo.type = '3'
          this.queryInfo.date = this.samplesData.date.join(',')
          this.getImgData()
        } else {
          this.samplesData = {
            date: [],
            regionId: [],
            color: []
          }
          // 还原在 Map-View 上的海区显示
          this.$store.commit('changeRegionShowOnMap', [])
          this.$store.commit('changeRegionsColors', [])
        }
      },
      deep: true
    },
    '$store.state.regionsShowOnMap': {
      handler: function (newVal) {
        // this.statsToShowRegion = !this.statsToShowRegion
        this.getRegionGeoJsonShowOnMap(newVal, this.$store.state.regionsColors)
        // console.log(newVal, this.$store.state.regionsColors)
      },
      deep: true
    },
    '$store.state.statsControlGeoJsonOnMap': {
      handler: function (newVal) {
        this.statsToShowRegion = newVal
      },
      deep: true
    }
  },
  methods: {
    async getImgData() {
      this.imgList = []
      const { data: res } = await this.axios.get('img/oceanimg', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('Failed to get oceanimg data!')
      } else {
        this.imgList = res.data
        this.$store.commit('selectImgShowOnMap', this.imgList[0].fileName)
      }
    },
    // 来自统计图表的协同交互
    // 跟据传递的参数获取对应海区的 GeoJson 和 Options
    getRegionGeoJsonShowOnMap(ids, colors) {
      const features = []
      for (const index of ids) {
        for (const feature of this.geojson.features) {
          if (feature.properties.note === index + '') {
            features.push(feature)
          }
        }
      }
      this.showRegionGeoJson.features = features
      this.showRegionGeoJsonOptions = {
        style: (feature) => {
          if (colors.length === 0) {
            return {
              weight: 1,
              color: '#000',
              fillColor: '#ECEFF1',
              fillOpacity: 0.01
            }
          } else {
            return {
              weight: 1,
              color: colors[ids.indexOf(feature.properties.note)],
              fillColor: colors[ids.indexOf(feature.properties.note)],
              fillOpacity: 0.3
            }
          }
        }
      }
    },

    // 来自 SOM-View 的协同交互
    // 获取对应的 geojson 数据
    getShowRegionJson(index) {
      // console.log(this.samplesData.regionId.length)
      // console.log('---')
      if (this.samplesData.regionId.length !== 0) {
        const showGeoJson = {
          type: 'FeatureCollection',
          features: []
        }
        // if (index === 0) console.log(this.samplesData)
        const regionIDArr = this.samplesData.regionId[index] // 当前日期的海区 id 数组

        const features = []
        for (const idx of regionIDArr) {
          for (const feature of this.geojson.features) {
            if (feature.properties.note === idx) {
              features.push(feature)
            }
          }
        }
        showGeoJson.features = features
        return showGeoJson
      } else {
        return this.showRegionJson
      }
    },
    // 获取对应 geojson 配置项
    getShowRegionJsonOptions(index) {
      // console.log(this.samplesData.color.length)
      if (this.samplesData.color.length !== 0) {
        const regionIDArr = this.samplesData.regionId[index] // 当前日期的海区 id 数组
        return {
          style: (feature) => {
            return {
              weight: 1,
              color: this.samplesData.color[index][
                regionIDArr.indexOf(feature.properties.note)
              ],
              fillColor: this.samplesData.color[index][
                regionIDArr.indexOf(feature.properties.note)
              ],
              fillOpacity: 0.3
            }
          }
        }
      } else {
        return this.showRegionJsonOptions
      }
    },
    // 单击某个 Slider
    selectMap(index) {
      this.fullScreenClosed()
      if (this.samplesData.date.length === 0) {
        this.$store.commit('selectImgShowOnMap', this.imgList[index].fileName)
        this.$store.commit(
          'changeRegionShowOnMap',
          this.$store.state.regionsShowOnMap
        )
        this.$store.commit(
          'changeRegionsColors',
          this.$store.state.regionsColors
        )
      } else {
        this.$store.commit('selectImgShowOnMap', this.samplesData.date[index])
        this.$store.commit(
          'changeRegionShowOnMap',
          this.samplesData.regionId[index]
        )
        this.$store.commit('changeRegionsColors', this.samplesData.color[index])
      }
    },
    // 关闭 gallery 全屏 dialog
    fullScreenClosed() {
      this.$emit('closeFullScreen', false)
    },
    // gallery 打开了
    mapGalleryDialogOpened() {
      // 由于初始 div 不显示，所以 leaflet 会出现偏移
      // 采取这种措施解决 leaflet 偏移问题
      for (const mapRef of this.$refs.map) {
        mapRef.mapObject._onResize()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.swiper {
  height: 205px;
  width: 100%;
  background-color: #ccc;
  .swiper-lazy-preloader {
    z-index: 999;
  }
  .swiper-slide {
    /* display: flex;
		justify-content: center;
		align-items: center; */
    background-color: white;
    /* object-fit: contain;
		img {
			max-width: 100%;
			max-height: 100%;
			transform: translateY(-10px);
		} */
  }
}
</style>
