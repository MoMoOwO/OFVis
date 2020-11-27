var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
const OTDataModel = require('../modules/otdata');
const ThresholdModel = require('../modules/threshold');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'gradient-api' });
});

// 获取梯度数据
// date：请求日期
router.get('/gdata', async function (req, res, next) {
  // 获取查询参数
  const { date } = req.query;

  // 查询梯度数据
  const geoDocs = await OTDataModel.aggregate([
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
  ]);

  let geoData = []; // 梯度数据
  let max = geoDocs[0].TempData[0].sstg, min = geoDocs[0].TempData[0].sstg; // 梯度值最大值最小值
  if (geoDocs.length) { // 查询到文档
    // 遍历文档获取数据
    for (let doc of geoDocs) {
      if (!Number.isNaN(doc.TempData[0].sstg)) {
        geoData.push([doc.longitude, doc.latitude, doc.TempData[0].sstg])
        max < doc.TempData[0].sstg && (max = doc.TempData[0].sstg)
        min > doc.TempData[0].sstg && (min = doc.TempData[0].sstg)
      }
    }
  } else {
    console.log('/gradient/gdata err' + err);
    res.status(400).json({ meta: { msg: '查询温度梯度数据出错！', status: 400 } });
  }

  // 查询梯度阈值
  const ThDocs = await ThresholdModel.find({ date }, { '_id': 0 });

  let thresholds = [];
  if (ThDocs.length) {
    thresholds = ThDocs[0].thresholds;
  } else {
    console.log('/gradient/gdata err' + err);
    res.status(400).json({ meta: { msg: '查询温度梯度阈值数据出错！', status: 400 } });
  }

  res.status(200).json({ data: { geoData, max, min, thresholds }, meta: { msg: '获取海温梯度数据成功！', status: 200 } });

});

router.put('/thresholds/:date', function (req, res, next) {
  // 获取查询参数
  ClusterTreeModel.updateOne(req.params, req.body, (err, doc) => {
    if (err) {
      console.log('/thresholds/:date err:' + err);
      res.status(400).json({ meta: { msg: 'Save thresholds failed!', status: 400 } });
    } else {
      res.status(200).json({ data: 'Save thresholds Success!', meta: { msg: 'Save thresholds Success!', status: 200 } });
    }
  });
});

module.exports = router;
