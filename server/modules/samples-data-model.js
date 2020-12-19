// 引入连接到数据库的 mongoose 对象
const mongoose = require('./db.js');

// 定义文档 RegionData 的 Schema
const SamplesDataSchema = mongoose.Schema({
  date: String,
  features: [
    {
      regionId: Number,
      IQR: Number,
      Skewness: Number,
      MoransI: Number,
      SDD: Number,
      LALSR: Number,
      Mean: Number,
      Mode: Number,
      Median: Number,
      Excess_Kurtosis: Number,
      Area: Number
    }
  ]
});

// 使用 Schema 创建可以操做改文档的 Model 并暴漏出去
module.exports = mongoose.model("SamplesData", SamplesDataSchema, "SamplesData");
