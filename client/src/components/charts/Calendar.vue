<template>
  <div class="calendar">
    <div id="chart" @click="chartClick($event)"></div>
  </div>
</template>

<script>
export default {
  data() {

    var data = this.getVirtulData(this.datequery);

    return {
      options: {
        // title: {
        //   text: "日历图"
        // },
        calendar: {
          //rient: "vertical", // 排列方向，默认horizontal
          // yearLabel: { // 年份标签边距
          //   margin: 40
          // },
          // monthLabel: { // 月份标签边距
          //   margin: 20
          // },
          dayLabel: {
            firstDay: 1 // 从周一开始
          },
          height: 140,
          cellSize: "auto", // 单元格大小，[宽，高]数值，auto
          range: this.datequery ? this.datequery : '2017'  // 设置日历范围，格式：yyyy, yyyy-MM,字符串形式
        },
        tooltip: {
          position: 'top',
          formatter: '{c}'
        },
        series: [
          {
            coordinateSystem: "calendar",
            type: "scatter",
            calendarIndex: 0, // 日历索引
            // 设置散点大小
            symbolSize: function(val) {
              return val[1] / 60;
            },
            data: data
          }
        ]
      }
    };
  },
  watch: {},
  methods: {
    // 格式化时间
    getVirtulData(year) {
      year = year || "2017"; // 默认
      var date = +this.$echarts.number.parseDate(year + "-01-01"); // 起始
      var end = +this.$echarts.number.parseDate(+year + 1 + "-01-01"); // 结束
      var dayTime = 3600 * 24 * 1000; // 一天的时间，单位毫秒
      var data = [];
      // 以一天的毫秒数进行累加，遍历每一天，为每一天添加随机数据
      for (var time = date; time < end; time += dayTime) {
        data.push([
          this.$echarts.format.formatTime("yyyy-MM-dd", time), // 日期
          Math.floor(Math.random() * 1000) /// 向下取整
        ]);
      }

      // 返回日历数据
      return data;
    },

    // 绘制日历图
    drawCanlendar() {
      // 初始化图表 renderer指定使用svg渲染
      let canlendarChart = this.$echarts.init(
        document.getElementById("chart"),
        null,
        { renderer: "svg" }
      );
      canlendarChart.setOption(this.options);

      // 散点点击
      canlendarChart.on('click', (params)=> {
        console.log(params.value);
      })
    },

    // 其他标签的点击事件
    chartClickcc(event){
      if(event.target.tagName === 'tspan'){
        console.log(event.target.textContent);
      }
    }


  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.drawCanlendar();
    });
  },
  // datequery要查询的年份
  props: ['datequery'],
  components: {}
};
</script>

<style scoped>
#chart {
  margin: 0 auto;
  height: 300px;
  width: 1000px;
}
</style>