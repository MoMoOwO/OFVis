# OF-Vis client 客户端

## 项目初始化过程

1. 使用 Vue CLI 快速搭建 Vue 项目，具体配置选项过程[参考](https://blog.csdn.net/chenshanqiang/article/details/103358618)

    ``` bash
    npm install @vue/cli -g
    vue create client
    # OR
    vue ui
    ```

2. 在 .eslintrc.js 文件的 rules 节点下添加如下规则，之后可根据个人编程习惯再做调整

    ``` JavaScript
    'space-before-function-paren': 0,
    'space-in-parens': 0
    ```

3. 新建 .prettierrc.json 文件，添加如下配置内容，之后也可以根据跟人编程习惯再做调整

    ``` json
    {
        "singleQuote": true,
        "semi": false
    }
    ```

## 本地客户端

1. 本地客户端端口 localhost:8080
2. 与本地服务端端口不同，会造成跨域请求，之后在前后端通讯的时候解决

## 借助 Element UI 设计主界面

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
