<template>
  <div>
    <el-container>
      <el-card>
        <div slot="header" class="card-header">
          <span>Ocean fronts detection in subdivided sea areas</span>
        </div>
        <div class="card-body">
          <v-chart
            ref="mapRef"
            class="map-container"
            :options="mapOpt"
            theme="infographic"
          />
          <el-form
            ref="form"
            :model="queryInfo"
            :label-position="'top'"
            label-width="80px"
          >
            <el-form-item label="Date">
              <el-date-picker
                v-model="queryInfo.date"
                type="month"
                value-format="yyyyMM"
                placeholder="Select date"
                :default-value="new Date('2015-01')"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <el-button
                type="primary"
                :loading="isSearching"
                @click="searchBtnClicked"
                >Search</el-button
              >
            </el-form-item>
            <el-form-item label="Threshold values">
              <el-col v-for="index in 13" :key="index" :span="6">
                <el-input
                  type="number"
                  :placeholder="'Area' + index"
                  v-model="threshold[index]"
                  @focus="inputGetFocus(index)"
                ></el-input>
                <el-col></el-col>
              </el-col>
            </el-form-item>
            <br />
            <el-form-item>
              {{ threshold }}
              <div>{{ queryInfo.date }}</div>
            </el-form-item>
            <br />
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-container>
  </div>
</template>

<script>
// 主题
import 'echarts/theme/infographic.js'
// 组件
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/world'

export default {
  components: {
    'v-chart': ECharts
  },
  props: [],
  data() {
    return {
      // 日期可选范围
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date('2015-01').getTime() ||
            time.getTime() > new Date('2017-12').getTime()
          )
        }
      },
      // 地图配置项
      mapOpt: {
        tooltip: {
          trigger: 'item'
        },
        geo: {
          show: true,
          map: 'world',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          roam: false,
          center: [123, 32],
          zoom: 25,
          itemStyle: {
            normal: {
              areaColor: '#ccc',
              borderColor: '#3B5077'
            },
            emphasis: {
              areaColor: '#ccc'
            }
          },
          silent: true
        },
        visualMap: {
          type: 'continuous', // 连续型
          min: 0, // 范围
          max: 0.1306,
          // right: 750,
          bottom: 350,
          precision: 4,
          calculable: true, // 显示手柄
          inRange: {
            color: ['#2B83BA', '#ABDDA4', '#FDAE61', '#D7191C'] // color
          },
          textStyle: {
            color: '#000'
          }
        },

        series: [
          {
            name: 'Temp_grade',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [
              [121.15, 31.89, 0.01],
              [109.781327, 39.608266, 0.02],
              [120.38, 37.35, 0.03]
            ],
            symbolSize: 3,
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: '海区',
            type: 'map',
            map: 'seaareas',
            roam: false,
            zoom: 1.5,
            center: [123.1, 31.8],
            itemStyle: {
              areaColor: 'rgba(255, 255, 255, 0)',
              borderColor: '#000',
              borderType: 'dashed',
              label: {
                formatter: function (p) {
                  console.log(p)
                  return p.name
                }
              }
            },
            silent: true
          }
        ]
      },
      // 是否正在查询数据
      isSearching: false,
      queryInfo: {
        date: null
      },
      threshold: [0],
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              name: '1',
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
              name: '2',
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
              name: '3',
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
              name: '4',
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
              name: '5',
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
              name: '6',
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
              name: '7',
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
              name: '8',
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
              name: '9',
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
              name: '10',
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
              name: '11',
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
              name: '12',
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
              name: '13',
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
      }
    }
  },
  mounted() {
    // 注册多边形海区
    // ECharts.registerMap('seaareas', this.geojson)
    // this.mapOpt.series[1].map = 'seaareas'
  },
  created() {
    // 注册多边形海区
    ECharts.registerMap('seaareas', this.geojson)
    this.mapOpt.series[1].map = 'seaareas'
  },
  methods: {
    onSubmit() {
      alert('提交了数据！')
    },
    // 获取数据
    async getGradientData() {
      this.isSearching = true
      const { data: res } = await this.axios.get('/gradient/gdata', {
        params: this.queryInfo
      })
      console.log(res)

      // 配置地图展示
      this.mapOpt.visualMap.min = res.data.min
      this.mapOpt.visualMap.max = res.data.max
      // this.mapOpt.series[0].data = res.data.geoData

      this.isSearching = false
    },
    searchBtnClicked() {
      if (this.queryInfo.date == null) {
        // 保证已选择 date
        this.$message.error('Please select date first!')
        this.isSearching = false
        return 0
      } else {
        // this.queryInfo.areaId = index
        // console.log(this.queryInfo)
        this.getGradientData()
      }
    },
    // 海区阈值输入框获取焦点的时候请求梯度数据
    inputGetFocus(index) {
      // console.log('海区' + index)
      // 高亮提示
      this.$refs.mapRef.dispatchAction({
        type: 'highlight',
        seriesIndex: 1,
        name: index + ''
      })
      // 缓存 this
      const that = this
      setTimeout(function () {
        that.$refs.mapRef.dispatchAction({
          type: 'downplay',
          seriesIndex: 1,
          name: index + ''
        })
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  padding-top: 50px;
  justify-content: center;
  .card-body {
    display: flex;
    .map-container {
      width: 400px;
      height: 700px;
    }
    .el-form {
      margin-left: 10px;
      width: 400px;
      .el-col-6 {
        padding: 2px;
      }
      .el-button {
        margin-left: 4px;
      }
    }
  }
}
</style>
