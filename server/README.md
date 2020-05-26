# OF-Vis server 端

## 项目初始化过程

1. 通过 express-generator 快速初始化一个 express Web 服务端框架。

    ``` bash
    npm install express express-generator -g
    express server
    cd server
    npm install
    ```

2. 将前端渲染模板从 jade 切换为 ejs、HTML 模板。

    (1) 安装依赖 `npm i ejs --save`

    (2) app.js 文件中添加如下配置项：

    ``` JavaScript
    const ejs = require('ejs');
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    ```

    (3) 修改默认路由，删除 user 路由，删除 views 下自带的所有 jade 模板

    (4) 创建 error.html、index.html ejs 模板；其中 error.html 用于错误路由提示，index.html 可以通过 res 传值的方式 `<%=key%>` 来测试接口。

    (5) 模板用于测试后端接口用，上线前要删除这部分没必要的（网络检索时看到的）

## 本地服务器

> 默认端口 localhost:3000  
> 之后前端使用 localhost：8080，此时会出现跨域请求，此问题我们在前端解决

## 完成请求后代数据测试 api

1. 添加 modules 文件夹，下面的 db.js 封装了对数据库的链接查询等基本操作
2. 创建 data.js 来处理/data 路由，下面的/source 子路由为请求原始数据
3. 设计为 post 请求，后期添加前端 post 传值的接收等处理
4. 链接查询数据库操作主要有封装的 db.js 完成，后续的数据处理传送的等操作在路由文件中处理 data.js
