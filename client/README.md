# OF-Vis client客户端

## 项目模板创建过程

1. 使用Vue脚手架快速搭建项目
2. vue init webpack client

## 本地客户端

1. 本地客户端端口localhost:8080
2. 与本地服务端端口不同，会造成跨域请求，之后在前后端通讯的时候解决

## 借助Element UI设计主界面

## 使用Element UI Container容器创建Header-Main-Footer三段式布局

1. 撑满单张页面需要讲父容器HTML，body宽高设置为100%

## 使用Element UI Layout布局设计栅格布局

1. el-row 行 el-col 列
2. 跨行跨列，位移等
3. 利用br换行标签实现在某行某列中添加两个div从而在平行列中实现跨行
4. br会继承父元素的line-height属性，此时可以将br的display设置为none

## 引入leaflet开源地图js库，自行封装地图组件

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
4. 加载图层/切片(瓦片)，通过URL设置切片，执行完如下步骤，才算显示一张地图。[Leaflet地图框架使用手册——L.TileLayer](https://blog.csdn.net/black2Girl/article/details/85264597)

``` bash
L.tileLayer(
        "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        { attribution:'OSM' }
      ).addTo(mymap);
```

![效果](https://i.loli.net/2019/08/30/LHSM6OthoIZnP8i.jpg)

## 使用Mapbox来设计符合自身需求的style的地图(由于设计需要，地图上不必要的文本信息不必要显示，防止干扰)

1. 去[Mapbox官网](https://www.mapbox.com/)注册登录
2. 点击右上角头像，选择studio，进入studio创作自己style的地图瓦片
3. 选择New style开始创建地图瓦片
4. 官方为我们提供了一些模板
![模板](https://i.loli.net/2019/08/31/KRqdf8gQB1tZiPl.jpg)
5. 我们选择Light主题，左侧为地理属性的style设置，如下我们式删除一些属性的前后变化
![修改前](https://i.loli.net/2019/08/31/iIdGe3EWKtoJ6UC.jpg)
![修改后](https://i.loli.net/2019/08/31/61Wwyz3UojV5iDF.jpg)
6. 接下来制作瓦片链接(tileLayer中的url链接)
7. 点击右上角的Share...，如下图，复制Share中的链接即用来创建地图瓦片url
![Share](https://i.loli.net/2019/08/31/bSeJElDQjnTRMCr.jpg)
8. 按如下模板修改url格式：https://api.mapbox.com/styles/v1/Your_Username/Your_Style_Id/tiles/256/{z}/{x}/{y}?access_token=Your_Access_Token
9. 之后我们便可以使用这个url替换之前L.tileLayer中的url
![使用自制的瓦片](https://i.loli.net/2019/08/31/gLkYS65wfrPCXnh.jpg)

## 实现跨域请求后端数据和点标记在地图上的绘制

1. 跨域请求后端数据，在config目录下的index.js中按如下配置，将/data路由转到3000端口(服务端端口)

  ``` code
  proxyTable: {
        '/data': { // 解决路由请求时的跨域问题
          target: 'http://localhost:3000'
        }
      },
  ```

2. 在地图上添加点标记图层使用leaft的api-cicle，主要用到如下的参数设置：第一个参数为地理经纬度，color为点标记颜色，radius为半径大小，fillOpacity为透明度，最后不要忘记添加到地图容器中。

  ``` code
  L.circle([32, 125],{color:'yellow',radius:1,fillOpacity:1}).addTo(this.mymap);
  ```

3. 标量值到点标记颜色的映射，采用D3的线性比例尺完成渐变颜色设计， 目前效果不太好[参考](https://www.bbsmax.com/A/D854XNVY5E/)
