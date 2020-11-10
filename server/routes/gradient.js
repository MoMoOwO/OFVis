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
  const { date, areaId } = req.query;
  console.log(date, areaId);

  OTDataModel.find({ regionId: areaId, "TEMPData.date": date.toString() }, (err, docs) => {
    if (err) {
      console.log('/gradient/gdata err' + err);
      res.status(400).json({ meta: { msg: '查询温度梯度数据出错！', status: 400 } });
    } else {
      let geoData = [];
      for (let doc of docs) {
        let geoItem = [doc.longitude, doc.latitude];
        for (let item of doc.TempData) {
          item.date == date.toString() && geoItem.push(item.sstg);
        }
        geoData.push(geoItem);
        console.log(geoData);
        res.status(200).json({ data: { geoData }, meta: { msg: '获取海温梯度数据成功！', status: 200 } });
      }
    }
  });
});

module.exports = router;
