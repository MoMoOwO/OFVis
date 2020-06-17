var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
const StatDataModel = require('../modules/statdata');
const RegionDataModel = require('../modules/regiondata');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'data-api' });
});

// 请求面积数据
/*
  params
  type: 1/2 // 1 或 2，1 为请求日历图面积数据，2 为请求折线图数据
  regionId: string/number // 海区编号，all 所有海区，数字编号为对应还去
  year: Number/null // 2015，2016，2017，单个年份（日历面积图）
*/
router.get('/areadata', (req, res, next) => {
  let type = req.query.type;
  let regionId = req.query.regionId;
  if (type == '1') { // 请求的某一年的面积数据
    let year = req.query.year;
    StatDataModel.find({ date: new RegExp('^' + year) }, (err, docs) => {
      if (err) { // 获取数据库出错
        console.log('/areadata err:' + err);
        res.status(400).json({ data: '获取面积数据失败！' });
      } else { // 正常返回数据
        let barData = new Array(12); // 柱状图 12 个月份面积数据
        let calendar = []; // 日历图面积数组 ['2015-01-01', 2222]
        for (let doc of docs) {
          // doc 为一个子文档
          if (doc.date.length == 6) { // 月份的统计数据，直接给 barData
            let area = 0;
            for (let obj in doc.StatisticsData) {
              if (regionId == 'all') { // 总面积
                area += obj.Area;
              } else { // 某个区域面积
                obj.regionId == +regionId ? area = obj.Area : area = 0;
              }
            }
            let index = +doc.date.slice(-2) - 1;
            barData[index] = area;
          } else { // 天统计数据

          }
        }
      }
    });
  }
});

module.exports = router;
