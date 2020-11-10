# OF-Vis client 客户端

## 项目初始化过程

1. 使用 Vue CLI 快速搭建 Vue 项目，具体配置选项过程[参考](https://blog.csdn.net/chenshanqiang/article/details/103358618)

    ``` bash
    npm install @vue/cli -g
    vue create client
    # OR
    vue ui
    ```

2. 在 client 目录下 .eslintrc.js 文件的 rules 节点下添加如下规则，之后可根据个人编程习惯再做调整

    ``` JavaScript
    'space-before-function-paren': 0,
    'space-in-parens': 0,
    'no-tabs': 'off',
    'indent': 'off'
    ```

3. 在 client 目录下新建 .prettierrc.json 文件，添加如下配置内容，之后也可以根据跟人编程习惯再做调整

    ``` json
    {
        "singleQuote": true,
        "semi": false
    }
    ```

4. 运行项目，项目默认运行在 `8080` 端口上

    ``` bash
    cd client
    npm run serve
    ```

5. 清理项目

    (1) 打开 client/src/App.vue，将 `template` 标签中的 `div` 里的内容清空，将 `script` 标签下内容清空，将 `style` 标签下的内容清空。

    (2) 打开 client/src/router/index.js，将引入的 `Home` 组件删除，并清空 `routes` 路由数组。

    (3) 删除 client/src/views 目录。

    (4) 删除 client/src/components 目录下的 HelloWorld.vue 组件文件。

## 前端界面开发

1. 依赖库摘要：

    (1) less_loader

    + 安装：`npm i less_loader -S -D`
    + 作用：用于编译 less 样式
    + [官网](https://github.com/webpack-contrib/less-loader)

    (2) element-ui

    + 安装：`npm i element-ui -S`
    + 作用：前端组件库，用于前端整体界面开发与特定组件使用，如表单组件
    + [官网](https://element.eleme.cn/#/zh-CN/)

    (3) vue-echarts

    + 安装：`npm i echarts vue-echarts -S`
    + 作用：用于前端图表开发
    + [官网](https://github.com/ecomfe/vue-echarts)
    + [Echarts 官网](https://echarts.apache.org/zh/index.html)

    (4) vue-awesome-swiper

    + 安装：`npm i vue-awesome-swiper@2.6.7 -S`
    + 作用：左右、上下切换显示内容的组件。
    + [官网](https://github.com/surmon-china/vue-awesome-swiper)
    + [swiper 官网](https://www.swiper.com.cn)
    + 由于新版本的 swiper 组件会与 Echarts 图表的单击时间冲突，所以版本限定使用 v2.6.7

    (5) vue2-leaflet

    + 安装：`npm i vue2-leaflet leaflet -S`
    + 作用：用于进行地图开发
    + [官网](https://github.com/vue-leaflet/Vue2Leaflet)
    + [leaflet 官网](https://leafletjs.com)

    (6) vue-axios

    + 安装：`npm i axios vue-axios -S`
    + 作用：用于向后端发起异步请求，并得到返回的数据。
    + [官网](https://github.com/imcvampire/vue-axios)
    + [axios 官网](https://github.com/axios/axios)

2. 主要结构介绍：....

### 主页布局

1. 添加全局样式：在 client/src/assets 目录下创建 css 文件夹，在该文件夹中创建 global.css 样式表文件，该文件中控制全局的样式，现阶段添加如下样式，让容器占满全屏幕。最后需要在 main.js 入口该文件中引入该样式：`import './assets/css/global.css'`

    ``` css
    /* 全局样式表 */
    html, body, #app {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    ```

2. 安装配置 Element-UI 组件库

    (1) 添加 element-ui 依赖：`npm i element-ui -S`

    (2) 之后采用按需导入的方式使用 element-ui 提供的组件

    + 在 client/src 目录下创建 plugins 文件夹，在该文件夹下创建 element.js，暂时添加以下内容，来引入主页布局所需要的组件

      ``` JavaScript
      import Vue from 'vue'
      // 按需引入 element-ui 组件
      import {
        Message,
        Container,
        Header,
        Main
      } from 'element-ui'
      // 将组建添加到 Vue 实例中
      Vue.use(Container)
      Vue.use(Header)
      Vue.use(Main)
      ```

    + 在 main.js 中引入 element-ui 的样式文件 `import 'element-ui/lib/theme-chalk/index.css'`，引入 element.js `import './plugins/element.js'`

3. 创建首页组件并完成首页路由

    (1) 首页布局

    + 组件：element-ui 的组件 - `el-container`、`el-header`、`el-main`、`el-card`
    + 主要页面结构

      ``` HTML
      <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="../assets/logo.png" />
            <span>OFViser</span>
          </div>
          <el-alert title="成功提示的文案" type="success" :closable="false"></el-alert>
        </el-header>
        <!-- 主体区域 - 圣杯布局 -->
        <el-container class="main-container">
          <!-- 右侧 -->
          <el-main class="left-panel">
            <el-card id="area-chart-card">面积图</el-card>
            <el-card id="line-chart-card">雷达折线图</el-card>
            <el-card id="box-chart-card">箱线图</el-card>
          </el-main>
          <!-- 中部 -->
          <el-main class="mid-panel">
            <el-card id="map-card">地图</el-card>
            <el-card id="gallery-card">画廊</el-card>
          </el-main>
          <!-- 左侧 -->
          <el-main class="right-panel">
            <el-card id="card-placeholder1">占位1</el-card>
            <el-card id="card-placeholder2">占位2</el-card>
            <el-card id="card-placeholder3">占位3</el-card>
          </el-main>
        </el-container>
      </el-container>
      ```

    + 最终效果
    ![首页布局](https://i.loli.net/2020/05/28/gUS5dFvQe6ZyG2A.jpg)

    (2) 首页路由导航和根路由的路由重定向，我们希望在进入页面时就导航到 `/home` 路径中，同时显示该路由下的首页界面，所以在 client/src/router/index.js 路由文件的路由规则中添加如下规则

    ``` JavaScript
    const routes = [
      { path: '/', redirect: '/home' },
      { path: '/home', component: Home }
    ]
    ```

### 基础面积图开发 - AreaChart

1. 设计上主要使用了 Echarts 的热力图和柱状图，[热力图 Demo](https://echarts.apache.org/examples/zh/index.html#chart-type-heatmap)、[柱状图 Demo](https://echarts.apache.org/examples/zh/index.html#chart-type-bar)，热力图采用了日历坐标系，统计每一天的海洋锋的锋面面积，而柱状图则统计了每个月份平均的锋面面积信息，两种图表通过并指排列而保持对应关系。
2. 另外需要借助 tooltip 组件而设计鼠标悬浮操作，需要按需引入 tooltip 组件；热力图、日历图组件也需要单独引入；而柱状图是基础组件不需要另外引入；热力图的颜色映射可以通过可视化的 visualMap 组件来展示，需要按需引入；另外也可以引入预定义的主题样式。
3. AreaChart.vue 中 template 整体布局情况大致如下：

    ``` HTML
    <div class="areaContainer">
      <v-chart class="calendarContainer" ref="calendarChart"
      :options="calendarOpt" theme="infographic" ></v-chart>
      <v-chart class="barContainer" ref="barChart" :options="barOpt" theme="infographic"></v-chart>
    </div>
    ```

4. AreaChart.vue 中 script 下的主要内容为：

    ``` JavaScript
    import 'echarts/theme/infographic.js'
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/heatmap'
    import 'echarts/lib/component/calendar'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/visualMap'

    export default {
      data() {
        return {
          calendarOpt: {
            // ...
          },
          barOpt: {
            // ...
          }
        }
      },
      components: {
        'v-chart': ECharts
      }
    }
    ```

5. 图表配置项介绍

    (1) 这里图表基本使用配置项不做介绍，只介绍官方 Demo 中没有介绍的但是设计中使用到的配置项。

    (2) tooltip 是 Echarts 提供的鼠标悬浮提示框组件，使用它很方便的实现鼠标悬浮提示详细信息，但是在实际使用中可能因为图表在靠近窗口边缘或父容器限制等原因导致 tooltip 会被截取而显示不全，这时候需要可以通过 `tooltip.confine` 来进行设置，接收一个布尔值，对应的效果则是是否强制将 tooltip 局限在 Echarts 图表容器中。

    (3) 我们设计中日历图是从上往下排列，而柱状图的竖轴则应该也是从上往下排列，这就需要设置倒置的坐标轴，这是 Echarts 3.x 引入的新特性，需要通过设置 `yAxis.inverse` 属性来进行配置，接收的也是一个布尔值，对应效果则是是否倒置排列。

    (4) 坐标轴标签旋转，可以通过 `yAxis.axisLabel.rotate` 来设置，接收一个角度值，纯数字的话默认单位为度。

6. 通过接口实现适时显示与隐藏 Loading 效果，由于数据是向后台请求来的，所以需要时间，另外更新数据也需要时间，所以需要一个 Loading 界面来缓和用户的等待。要点是要获取的 Echarts 容器组件的引用然后适时调用接口即可，具体函数实现如下，通过传递一个布尔值来决定是否显示 Loading。

    ``` JavaScript
    methods:{
      isShowLoadding(b) {
        if (b) {
          this.$refs.calendarChart.showLoading({
            text: 'Loading…',
            color: '#409EFF',
            maskColor: 'rgba(255, 255, 255, 0.4)'
          })
          this.$refs.barChart.showLoading({
            text: 'Loading…',
            color: '#409EFF',
            maskColor: 'rgba(255, 255, 255, 0.4)'
          })
        } else {
          this.$refs.calendarChart.hideLoading()
          this.$refs.barChart.hideLoading()
        }
      }
    }
    ```

7. 面积图最终效果
![面积图效果](https://i.loli.net/2020/06/20/xKl7iRbq1SeMI6C.jpg)

## 使用 Element UI Container 容器创建 Header-Main-Footer 三段式布局

1. 撑满单张页面需要讲父容器 HTML，body 宽高设置为 100%

## 使用 Element UI Layout 布局设计栅格布局

1. el-row 行 el-col 列
2. 跨行跨列，位移等
3. 利用 br 换行标签实现在某行某列中添加两个 div 从而在平行列中实现跨行
4. br 会继承父元素的 line-height 属性，此时可以将 br 的 display 设置为 none

## 引入 leaflet 开源地图 js 库，自行封装地图组件

> Map

1. 在页面上创建映射与其他操作的中心类，但它并不就是地图本身...
2. 两个参数：容器，选项
3. 选项(摘要)：
   1. center: 中心 [lat,lon],
   2. zoom: 缩放比例 int,
   3. zoomControl: 缩放控件 bool,
   4. scrollWheelZoom: 滚轮缩放 bool,
   5. doubleClickZoom: 双击缩放 bool,
   6. dragging: 拖拽 bool,
   7. attributionControl: 瓦片提供商，建议显示，版权.... bool,
   8. ...
4. 加载图层/切片(瓦片)，通过 URL 设置切片，执行完如下步骤，才算显示一张地图。[Leaflet 地图框架使用手册——L.TileLayer](https://blog.csdn.net/black2Girl/article/details/85264597)

```JavaScript
L.tileLayer(
        "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        { attribution:'OSM' }
      ).addTo(mymap);
```

![效果](https://i.loli.net/2019/08/30/LHSM6OthoIZnP8i.jpg)

## 使用 Mapbox 来设计符合自身需求的 style 的地图(由于设计需要，地图上不必要的文本信息不必要显示，防止干扰)

1. 去[Mapbox 官网](https://www.mapbox.com/)注册登录
2. 点击右上角头像，选择 studio，进入 studio 创作自己 style 的地图瓦片
3. 选择 New style 开始创建地图瓦片
4. 官方为我们提供了一些模板
   ![模板](https://i.loli.net/2019/08/31/KRqdf8gQB1tZiPl.jpg)
5. 我们选择 Light 主题，左侧为地理属性的 style 设置，如下我们式删除一些属性的前后变化
   ![修改前](https://i.loli.net/2019/08/31/iIdGe3EWKtoJ6UC.jpg)
   ![修改后](https://i.loli.net/2019/08/31/61Wwyz3UojV5iDF.jpg)
6. 接下来制作瓦片链接(tileLayer 中的 url 链接)
7. 点击右上角的 Share...，如下图，复制 Share 中的链接即用来创建地图瓦片 url
   ![Share](https://i.loli.net/2019/08/31/bSeJElDQjnTRMCr.jpg)
8. 按如下模板修改 url 格式：https://api.mapbox.com/styles/v1/Your_Username/Your_Style_Id/tiles/256/{z}/{x}/{y}?access_token=Your_Access_Token
9. 之后我们便可以使用这个 url 替换之前 L.tileLayer 中的 url
   ![使用自制的瓦片](https://i.loli.net/2019/08/31/gLkYS65wfrPCXnh.jpg)

## 实现跨域请求后端数据和点标记在地图上的绘制

1. 跨域请求后端数据，在 config 目录下的 index.js 中按如下配置，将/data 路由转到 3000 端口(服务端端口)

```JavaScript
proxyTable: {
  '/data': { // 解决路由请求时的跨域问题
    target: 'http://localhost:3000'
  }
},
```

2. 在地图上添加点标记图层使用 leaft 的 api-cicle，主要用到如下的参数设置：第一个参数为地理经纬度，color 为点标记颜色，radius 为半径大小，fillOpacity 为透明度，最后不要忘记添加到地图容器中。

```JavaScript
L.circle([32, 125],{color:'yellow',radius:1,fillOpacity:1}).addTo(this.mymap);
```

3. 标量值到点标记颜色的映射，采用 D3 的线性比例尺完成渐变颜色设计，目前效果不太好。[参考](https://www.bbsmax.com/A/D854XNVY5E/)采用颜色映射原理的方式，同样效果不太好，需要继续调整颜色映射参数。
   ![leaflet绘制点图层](https://i.loli.net/2019/09/07/VAPuqD7SYJQa4vI.jpg)![采用颜色映射原理](https://i.loli.net/2019/09/07/vQ7hOW1RLVBKojS.jpg)

## 实现 ECharts calendar 日历图组件化封装

1. 下载 ECharts

```JavaScript
  npm i echarts
```

2. 在 main.js 中安装及配置 ECharts，这样配置后若要使用 echarts，则直接使用 this.\$echarts 即可

```JavaScript
import Echarts from 'echarts';
Vue.prototype.$echarts = Echarts;
```

3. 组件使用,参数 datequery 为要查询的年份(2015,2016,2017)

```Vue
  <template>
    <div id="app">
      <calendar :datequery='2015'></calendar>
    </div>
  </template>

  <script>

  import CalendarChart from '@/components/charts/Calendar.vue';

  export default {
    data() {
      return {
        datequery: '2016'
      };
    },
    components: { calendar: CalendarChart },
  };
  </script>

  <style>
  #app {
    width: 100%;
    height: 100%;
  }
  </style>
```

4. 简单封装,后续根据需要进行完善
