// 引入连接到数据库的 mongoose 对象
const mongoose = require('./db.js');

// 定义文档 RegionData 的 Schema
const ClusterTreeListModelSchema = mongoose.Schema({
  colors: Array,
  id: Number,
  isLeaf: Boolean,
  name: String,
  children: Array
});

// 使用 Schema 创建可以操做改文档的 Model 并暴漏出去
module.exports = mongoose.model("ClusterTreeList", ClusterTreeListModelSchema, "ClusterTreeList");
