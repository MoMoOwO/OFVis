# OF-Vis server端

## 项目创建过程

1. express server (创建项目目录结构，项目已创建忽略此步) 
2. cd server
3. npm install (安装依赖)

## 本地服务器

> 默认端口localhost:3000
> 之后前端使用localhost：8080，此时会出现跨域请求，此问题我们在前端解决

## 修改后端模板引擎为ejs、Html模板

### 模板用于测试后端接口用，上线前要删除这部分没必要的(网络)

1. npm i ejs --save
2. app.js 中引入及配置

    ``` bash
    var ejs = require('ejs');
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    ```

3. 修改默认路由，删除user路由，删除views下自带的所有jade模板
4. 创建error.html、index.html ejs模板中前端接收res传值的方式<%=key%>

## 完成请求后代数据测试api

1. 添加modules文件夹，下面的db.js封装了对数据库的链接查询等基本操作
2. 创建data.js来处理/data路由，下面的/source子路由为请求原始数据
3. 设计为post请求，后期添加前端post传值的接收等处理
4. 链接查询数据库操作主要有封装的db.js完成，后续的数据处理传送的等操作在路由文件中处理data.js
