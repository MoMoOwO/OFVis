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

1. 默认端口 localhost:3000  
2. 之后前端使用 localhost：8080，此时会出现跨域请求，此问题我们在前端解决

## 封装数据库类

1. 添加 mongoose 依赖，运行 `npm i mongoose -S`
2. 在项目根目录添加 modules 文件夹，新建 db.js 主要用于暴漏连接到数据库的 mongoose 对象。
3. 创建各个数据库文档对应的 js 操作文件，其中主要内容为定义对应文档的 Schema，然后暴漏可以操作对应数据库的 Model 对象。

## 后台 api 设计

1. 数据请求全部走 `/data` 路由，在 routes 目录下创建 data.js 路由文件。
2. 在 data.js 文件中引入操作数据库的 Model 类。
3. 在 app.js 中引入 data 路由文件并应用。

    ``` JavaScript
    var dataRouter = require('./routes/data');
    // ...
    app.use('/data', dataRouter);
    ```

4. data.js 路由请求文件开发。
