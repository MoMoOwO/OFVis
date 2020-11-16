var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
const OTDataModel = require('../modules/otdata');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'gradient-api' });
});

// 获取梯度数据
// date：请求日期，areaId：请求海区
router.get('/gdata', function (req, res, next) {
  // 获取查询参数
  const { date, areaId } = req.query;

  // 查找数据
  OTDataModel.find({ regionId: areaId }, (err, docs) => {
    // 地理信息数据
    let geoData = [];
    let min, max; // 梯度最值
    if (err) {
      console.log('/gradient/gdata err' + err);
      res.status(400).json({ meta: { msg: '查询温度梯度数据出错！', status: 400 } });
    } else {
      // 遍历组织数据
      for (let doc of docs) {
        let geoItem = [doc.longitude, doc.latitude];
        for (let item of doc.TempData) {
          if (item.date == date && !Number.isNaN(item.sstg)) {
            geoItem.push(item.sstg);
          }
        }
        geoData.push(geoItem);
      }

      // 计算梯度最值
      //console.log(geoData);
      let min = geoData[0][2];
      let max = geoData[0][2];
      for (let item of geoData) {
        item[2] <= min && (min = item[2]);
        item[2] >= max && (max = item[2]);
      }

      res.status(200).json({ data: { geoData, max, min }, meta: { msg: '获取海温梯度数据成功！', status: 200 } });
    }
  });
});

module.exports = router;
