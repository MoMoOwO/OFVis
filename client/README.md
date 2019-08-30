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
    7. ...
4. 加载图层/切片，通过URL设置切片，执行完如下步骤，才算显示一张地图

``` bash
L.tileLayer(
        "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        { attribution:'OSM' }
      ).addTo(mymap);
```

![](https://i.loli.net/2019/08/30/LHSM6OthoIZnP8i.jpg)

