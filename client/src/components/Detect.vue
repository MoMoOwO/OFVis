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
            :model="form"
            :label-position="'top'"
            label-width="80px"
          >
            <el-form-item label="Date">
              <el-date-picker
                v-model="form.date"
                type="month"
                value-format="yyyyMM"
                placeholder="Select date"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Threshold values">
              <el-col v-for="index in 13" :key="index" :span="6">
                <el-input
                  type="number"
                  :default-value="new Date('2014')"
                  :placeholder="'Area' + index"
                  v-model="form.threshold[index]"
                  @focus="inputGetFocus(index)"
                ></el-input>
                <el-col></el-col>
              </el-col>
            </el-form-item>
            <br />
            <el-form-item>
              {{ form.threshold }}
              <div>{{ form.date }}</div>
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
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date('2015-01').getTime() ||
            time.getTime() > new Date('2017-12').getTime()
          )
        }
      },
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
          roam: true,
          center: [124, 32],
          zoom: 25,
          itemStyle: {
            normal: {
              areaColor: '#ccc',
              borderColor: '#3B5077'
            },
            emphasis: {
              areaColor: '#ccc'
            }
          }
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
          }
        ]
      },
      form: {
        date: '',
        threshold: [0],
        area: 1
      }
    }
  },
  mounted() {},
  methods: {
    onSubmit() {
      alert('提交了数据！')
    },
    inputGetFocus(index) {
      console.log('海区' + index)
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
    }
  }
}
</style>
