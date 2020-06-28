// 引入连接到数据库的 mongoose 对象
const mongoose = require('./db.js');

// 定义文档 SOMModel 的 Schema
const SOMModelSchema = mongoose.Schema({
  name: String,
  options: {
    fields: Array,
    gridType: String,
    torus: Boolean
  },
  data: Array
});

// 使用 Schema 创建可以操做改文档的 Model 并暴漏出去
module.exports = mongoose.model("SOMModel", SOMModelSchema, "SOMModel");
