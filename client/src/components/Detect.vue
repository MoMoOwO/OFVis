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
                class="search-btn"
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
              <el-button type="primary" @click="submitNewThreshold"
                >Submit</el-button
              >
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
          trigger: 'item',
          formatter: (p) => p.marker + ' ' + p.data[2]
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
          seriesIndex: 0,
          min: 0, // 范围
          max: 0,
          range: [0, 0],
          bottom: 330,
          precision: 4,
          calculable: true, // 显示手柄
          inRange: {
            color: [
              'rgb(0, 0,143.4375)',
              'rgb(0, 0,159.375)',
              'rgb(0, 0,175.3125)',
              'rgb(0, 0,191.25)',
              'rgb(0, 0,207.1875)',
              'rgb(0, 0,223.125)',
              'rgb(0, 0,239.0625)',
              'rgb(0, 0,255)',
              'rgb(0, 15.9375,255)',
              'rgb(0, 31.875,255)',
              'rgb(0, 47.8125,255)',
              'rgb(0, 63.75,255)',
              'rgb(0, 79.6875,255)',
              'rgb(0, 95.625,255)',
              'rgb(0, 111.5625,255)',
              'rgb(0, 127.5,255)',
              'rgb(0, 143.4375,255)',
              'rgb(0, 159.375,255)',
              'rgb(0, 175.3125,255)',
              'rgb(0, 191.25,255)',
              'rgb(0, 207.1875,255)',
              'rgb(0, 223.125,255)',
              'rgb(0, 239.0625,255)',
              'rgb(0, 255,255)',
              'rgb(15.9375, 255,239.0625)',
              'rgb(31.875, 255,223.125)',
              'rgb(47.8125, 255,207.1875)',
              'rgb(63.75, 255,191.25)',
              'rgb(79.6875, 255,175.3125)',
              'rgb(95.625, 255,159.375)',
              'rgb(111.5625, 255,143.4375)',
              'rgb(127.5, 255,127.5)',
              'rgb(143.4375, 255,111.5625)',
              'rgb(159.375, 255,95.625)',
              'rgb(175.3125, 255,79.6875)',
              'rgb(191.25, 255,63.75)',
              'rgb(207.1875, 255,47.8125)',
              'rgb(223.125, 255,31.875)',
              'rgb(239.0625, 255,15.9375)',
              'rgb(255, 255,0)',
              'rgb(255, 239.0625,0)',
              'rgb(255, 223.125,0)',
              'rgb(255, 207.1875,0)',
              'rgb(255, 191.25,0)',
              'rgb(255, 175.3125,0)',
              'rgb(255, 159.375,0)',
              'rgb(255, 143.4375,0)',
              'rgb(255, 127.5,0)',
              'rgb(255, 111.5625,0)',
              'rgb(255, 95.625,0)',
              'rgb(255, 79.6875,0)',
              'rgb(255, 63.75,0)',
              'rgb(255, 47.8125,0)',
              'rgb(255, 31.875,0)',
              'rgb(255, 15.9375,0)',
              'rgb(255, 0,0)',
              'rgb(239.0625, 0,0)',
              'rgb(223.125, 0,0)',
              'rgb(207.1875, 0,0)',
              'rgb(191.25, 0,0)',
              'rgb(175.3125, 0,0)',
              'rgb(159.375, 0,0)',
              'rgb(143.4375, 0,0)',
              'rgb(127.5, 0,0)'
            ]
          },
          realtime: false, // 拖拽结束更新视图
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 3,
            progressive: 0, // 关闭渐进渲染
            animation: false // 关闭动画
          },
          {
            type: 'map',
            map: 'seaareas',
            roam: false,
            zoom: 1.5,
            center: [123.1, 31.8],
            itemStyle: {
              normal: {
                areaColor: 'rgba(255, 255, 255, 0)',
                borderColor: '#000',
                borderType: 'dashed'
              },
              emphasis: {
                areaColor: 'rgba(255, 255, 255, 0)',
                borderWidth: 1,
                borderType: 'solid',
                borderColor: 'red',
                label: {
                  show: false
                }
              }
            },
            silent: true
          }
        ]
      },
      // 是否正在查询数据
      isSearching: false,
      // 查询参数
      queryInfo: {
        date: null
      },
      // 梯度阈值
      threshold: [0],
      // 海区划分 geoJson 数据
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
      },
      // 高亮的海区 name
      areaName: null
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
    // 提交修改的阈值数组
    async submitNewThreshold() {
      // 阈值数组符合条件
      if (
        this.threshold.indexOf('') !== -1 ||
        this.threshold.indexOf(null) !== -1
      ) {
        // 转换为数值型数组
        const thresholds = this.threshold.map(Number)
        // 保存阈值数据
        const { data: res } = await this.axios.put('/gradient/thresholds', {
          date: this.queryInfo.date,
          thresholds
        })
        if (res.meta.status !== 200) {
          this.$message.error('Save failed!')
        } else {
          this.$message.success('Save succeeded!')
        }
      } else {
        this.$message.error('The input threshold is illegal!')
      }
    },
    // 是否显示缓冲条
    isShowLoadding(b) {
      if (b) {
        this.$refs.mapRef.showLoading({
          text: 'Loading…',
          color: '#409EFF',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        })
      } else {
        this.$refs.mapRef.hideLoading()
      }
    },
    // 获取数据
    async getGradientData() {
      this.isSearching = true // 禁用搜索
      this.mapOpt.series[0].data = [] // 清空数据
      this.isShowLoadding(true) // 显示缓冲条

      // 请求数据
      const { data: res } = await this.axios.get('/gradient/gdata', {
        params: this.queryInfo
      })
      // console.log(res)

      if (res.meta.status !== 200) {
        // 后台返回错误请求
        this.$message.error('Failed to get gradient data!')
      } else {
        // 配置地图展示
        this.mapOpt.visualMap.min = res.data.min
        this.mapOpt.visualMap.max = res.data.max
        this.mapOpt.visualMap.range = [res.data.min, res.data.max]
        this.mapOpt.series[0].data = res.data.geoData

        this.isSearching = false // 恢复搜索
        this.isShowLoadding(false) // 隐藏缓冲条
      }
    },
    async getThresholdsData() {
      // 请求数据
      const { data: res } = await this.axios.get('/gradient/thresholds', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        // 后台返回错误请求
        this.$message.error('Failed to get thresholds data!')
      } else {
        this.threshold = res.data.thresholds
      }
    },
    // 搜索查询对应日期的数据
    searchBtnClicked() {
      if (this.queryInfo.date == null) {
        // 保证已选择 date
        this.$message.error('Please select date first!')
        this.isSearching = false
        return 0
      } else {
        // this.queryInfo.areaId = index
        // console.log(this.queryInfo)
        // 将之前的高亮海区 downplay
        this.areaName == null ||
          this.$refs.mapRef.dispatchAction({
            type: 'downplay',
            seriesIndex: 1,
            name: this.areaName
          })
        this.areaName = null
        // 获取数据
        this.getGradientData()
        this.getThresholdsData()
      }
    },
    // 海区阈值输入框获取焦点的时候请求梯度数据
    inputGetFocus(index) {
      // console.log('海区' + index)
      // 将之前的高亮海区 downplay
      this.areaName == null ||
        this.$refs.mapRef.dispatchAction({
          type: 'downplay',
          seriesIndex: 1,
          name: this.areaName
        })
      // 高亮提示
      this.$refs.mapRef.dispatchAction({
        type: 'highlight',
        seriesIndex: 1,
        name: index + ''
      })
      // 保存高亮海区 areaName
      this.areaName = index + ''
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
      .search-btn {
        margin-left: 4px;
      }
    }
  }
}
</style>
