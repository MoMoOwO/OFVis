var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
const StatsDataModel = require('../modules/stats-data-model');
const SamplesDataModel = require('../modules/samples-data-model');
// 引入工具类
const utils = require('../modules/utils');

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
  // 获取查询类型和区域 id
  const { type, regionId } = req.query;

  if (type == '1') { // 请求的某一年的面积数据
    const year = req.query.year;
    StatsDataModel.find({ date: new RegExp('^' + year) }, (err, docs) => {
      if (err) { // 获取数据库出错
        console.log('/data/areadata err:' + err);
        res.status(400).json({ meta: { msg: '获取面积数据失败！', status: 400 } });
      } else { // 正常返回数据
        let barData = new Array(12); // 柱状图 12 个月份面积数据
        let calendarData = []; // 日历图面积数组 ['2015-01-01', 2222]
        for (let doc of docs) {
          // 根据区域计算面积
          let area = 0;
          for (let obj of doc.statistics) {
            if (regionId == 'all') { // 总面积
              area += obj.Area;
            } else if (obj.regionId == +regionId) { // 某个区域面积
              area = obj.Area;
            }
          }
          // doc 为一个子文档
          if (doc.date.length == 6) { // 月份的统计数据，直接给 barData
            let index = +doc.date.slice(-2) - 1;
            barData[index] = area;
          } else { // 天统计数据
            let formateDate = utils.dateFormate(doc.date);
            calendarData.push([formateDate, area]);
          }
        }
        res.status(200).json({ data: { barData, calendarData }, meta: { msg: '获取面积数据成功！', status: 200 } });
      }
    });
  } else if (type == '2') { // 请求三年的月份的面积数据，用于折线图
    // console.log(type, regionId, year); // 2 all
    StatsDataModel.find({ date: /^(2016|2015|2017)\d{2}$/ }, (err, docs) => {
      if (err) {
        console.log('/data/areadata err:' + err);
        res.status(400).json({ meta: { msg: '获取面积数据失败！', status: 400 } });
      } else {
        let lineData = [
          {
            year: '2015',
            data: new Array(12)
          },
          {
            year: '2016',
            data: new Array(12)
          },
          {
            year: '2017',
            data: new Array(12)
          }
        ]
        for (let doc of docs) {
          // 根据区域计算面积
          let area = 0;
          for (let obj of doc.statistics) {
            if (regionId == 'all') { // 总面积
              area += obj.Area;
            } else if (obj.regionId == +regionId) { // 某个区域面积
              area = obj.Area;
            }
          }
          // 保存面积数据
          let yearStr = doc.date.slice(0, 4);
          let index = +doc.date.slice(-2) - 1;
          if (yearStr == '2015') {
            lineData[0].data[index] = area;
          } else if (yearStr == '2016') {
            lineData[1].data[index] = area;
          } else if (yearStr == '2017') {
            lineData[2].data[index] = area;
          } else {
            console.log('竟然还有意外！');
          }
        }
        res.status(200).json({ data: { lineData }, meta: { msg: '获取面积数据成功！', status: 200 } });
      }
    });
  } else {
    res.status(400).json({ meta: { msg: 'type 参数有误！', status: 400 } });
  }
});

// 请求面积数据
/*
  params
  type: 1/2 // 1 或 2，1为请求某个个月份所有海区梯度分布情况，2 为查询某海区三年所有月份的情况
  date: '201501'/’2015' // 当 type=1 时用来查询该年该月所有海区数据，type=2时用来查询该年
  regionId: 1 // 当 type = 2 的时候根据该 id 查询对应海区数据
*/
router.get('/boxdata', async (req, res, next) => {
  // 获取查询类型和区域 id
  const { type, regionId, date } = req.query;

  // 箱线图所需数据
  let axisData = [];
  let boxData = [];
  let outliers = [];
  let meanData = [];

  if (type == '1') { // 查询某个年月份所有海区的梯度分布情况
    const statsDocs = await StatsDataModel.find({ date: date });

    if (statsDocs.length) { // 查询到数据
      let statData = statsDocs[0].statistics;
      // 遍历海域添加各海域箱线图数据
      for (let obj of statData) {
        if (!isNaN(obj.Upper)) { // 存在箱线图数据
          axisData.push(obj.regionId); // 坐标轴数据
          boxData.push([obj.Lower, obj.Q1, obj.Median, obj.Q3, obj.Upper]); // 箱体数据
          // 异常值数据
          for (let i = 0; i < obj.Outliers.length; i++) {
            let outIdx = boxData.length - 1;
            obj.Outliers[i].unshift(outIdx);
            outliers.push(obj.Outliers[i]);
          }
          // 平均值数据
          meanData.push(obj.Mean)
        }
      }
      res.status(200).json({ data: { axisData, boxData, outliers, meanData }, meta: { msg: '获取箱线图数据成功！', status: 200 } });
    } else {
      console.log('/data/boxdata err' + err);
      res.status(400).json({ meta: { msg: '查询箱线图数据出错！', status: 400 } });
    }
  } else if (type == '2') { // 查询该年
    const statsDocs = await StatsDataModel.find({ date: new RegExp('^' + date + '\\d{2}$') });

    if (statsDocs.length) { // 查询到数据
      for (let doc of statsDocs) {
        let index = +regionId - 1;
        let statData = doc.statistics[index];
        if (!isNaN(statData.Upper)) { // 存在箱线图数据
          axisData.push(doc.date);
          boxData.push([statData.Lower, statData.Q1, statData.Median, statData.Q3, statData.Upper]);
          for (let i = 0; i < statData.Outliers.length; i++) {
            let outIdx = boxData.length - 1;
            statData.Outliers[i].unshift(outIdx);
            outliers.push(statData.Outliers[i]);
          }
          meanData.push(statData.Mean)
        }
      }
      res.status(200).json({ data: { axisData, boxData, outliers, meanData }, meta: { msg: '获取箱线图数据成功！', status: 200 } });
    } else {
      console.log('/data/boxdata err' + err);
      res.status(400).json({ meta: { msg: '查询箱线图数据出错！', status: 400 } });
    }
  } else {
    res.status(400).json({ meta: { msg: 'type 参数有误！', status: 400 } });
  }
});

// 请求特征数据
/**
 * params
 * feature 特征值类型
 * year 年份
 */
router.get('/featuredata', async (req, res, next) => {
  const { feature, year } = req.query; // 特征类型

  // 月份数组
  const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 特征值数据
  let featureData = [{ regionId: 1, data: [] }, { regionId: 2, data: [] }, { regionId: 3, data: [] }, { regionId: 4, data: [] }, { regionId: 5, data: [] }, { regionId: 6, data: [] }, { regionId: 7, data: [] }, { regionId: 8, data: [] }, { regionId: 9, data: [] }, { regionId: 10, data: [] }, { regionId: 11, data: [] }, { regionId: 12, data: [] }, { regionId: 13, data: [] }];

  const samplesDocs = await SamplesDataModel.find({ date: new RegExp('^' + year + '\\d{2}$') });
  if (!samplesDocs.length) {
    res.status(400).json({ meta: { msg: '获取 Samples-Data 数据失败！', status: 400 } });
  }

  // 按月份遍历
  for (let item of samplesDocs) {
    let month = monthArr[+(item.date + '').slice(-2) - 1]; // 月份  x 轴
    // 按海区遍历，获取特征值数据
    for (let regionData of item.features) {
      let featureItem = [month, 'R' + regionData.regionId, +regionData[feature].toFixed(4)]; // 组装数据 [x, y, data]
      featureData[regionData.regionId - 1].data.push(featureItem); // 获取特征值并添加到特征值数组中 保留四位
    }
  }

  // 返回数据
  res.status(200).json({ data: { featureData }, meta: { msg: '获取特征值数据成功！', status: 200 } });

});

module.exports = router;
