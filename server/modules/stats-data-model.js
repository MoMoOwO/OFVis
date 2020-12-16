// 引入连接到数据库的 mongoose 对象
const mongoose = require('./db.js');

// 定义文档 StatData 的 Schema
const StatsDataSchema = mongoose.Schema({
  date: String,
  statistics: [
    {
      regionId: Number,
      Max: Number,
      Min: Number,
      Range: Number,
      Mean: Number,
      Mode: Number,
      Median: Number,
      Upper: Number,
      Q3: Number,
      Q1: Number,
      Lower: Number,
      Qd: Number,
      Outliers: Array,
      Skewness: Number,
      Excess_Kurtosis: Number,
      Area: Number
    }
  ]
});

// 使用 Schema 创建可以操做改文档的 Model 并暴漏出去
module.exports = mongoose.model("StatsData", StatsDataSchema, "StatsData");
