var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
const OTDataModel = require('../modules/otdata');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'gradient-api' });
});

// 获取梯度数据
// date：请求日期
router.get('/gdata', function (req, res, next) {
  // 获取查询参数
  const { date } = req.query;

  OTDataModel.aggregate([
    { "$match": {} },
    {
      "$project": {
        "_id": 0,
        "latitude": 1,
        "longitude": 1,
        "regionId": 1,
        "TempData": {
          "$filter": {
            "input": "$TempData",
            "as": "item",
            "cond": { "$eq": ["$$item.date", date + ''] }
          }
        }
      }
    }
  ], (err, docs) => {
    if (err) {
      console.log('/gradient/gdata err' + err);
      res.status(400).json({ meta: { msg: '查询温度梯度数据出错！', status: 400 } });
    } else {
      let geoData = [null, [], [], [], [], [], [], [], [], [], [], [], [], []]; // 梯度数据
      let max = docs[0].TempData[0].sstg, min = docs[0].TempData[0].sstg; // 梯度值最大值最小值

      for (let doc of docs) {
        if (!Number.isNaN(doc.TempData[0].sstg)) {
          geoData[doc.regionId].push([doc.longitude, doc.latitude, doc.TempData[0].sstg])
          max < doc.TempData[0].sstg && (max = doc.TempData[0].sstg)
          min > doc.TempData[0].sstg && (min = doc.TempData[0].sstg)
        }
      }

      res.status(200).json({ data: { geoData, max, min }, meta: { msg: '获取海温梯度数据成功！', status: 200 } });
    }
  });
});

module.exports = router;
