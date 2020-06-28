// 引入连接到数据库的 mongoose 对象
const mongoose = require('./db.js');

// 定义文档 ImgData 的 Schema
const ImgDataSchema = mongoose.Schema({
  fileName: String,
  base64Str: String,
});

// 使用 Schema 创建可以操做改文档的 Model 并暴漏出去
module.exports = mongoose.model("ImgData", ImgDataSchema, "ImgData");
