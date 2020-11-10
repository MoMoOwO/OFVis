var express = require('express');
var router = express.Router();
// 引入可以操作数据库的 Model 模块
const ImgDataModel = require('../modules/imgdata');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'img-api' });
});

/* router.get('/marker', function (req, res, next) {
  ImgDataModel.find({ fileName: /^marker/ }, (err, docs) => {
    if (err) {
      console.log('/img/marker err:' + err);
      res.status(400).json({ meta: { msg: '获取 marker 图片失败！', status: 400 } });
    } else {
      let dataArr = new Array(3)
      for (let obj of docs) {
        if (obj.fileName === 'marker-icon-2x') {
          dataArr[0] = obj.base64Str;
        } else if (obj.fileName === 'marker-icon') {
          dataArr[1] = obj.base64Str;
        } else {
          dataArr[2] = obj.base64Str;
        }
      }
      res.status(200).json({ data: dataArr, meta: { msg: '获取 marker 图片成功！', status: 200 } });
    }
  });
}); */

router.get('/oceanimg', function (req, res, next) {
  // 获取类型，1 获取传入日期一个月的或者某年的所有月份的所有图片，2 获取指定日期的图片，3 为获取date数组中日期的图片
  const { type, date } = req.query;

  if (type === '1') { // 获取给定日期整个月份或者某年的所有月份的图片
    ImgDataModel.find({ fileName: new RegExp('^' + date + '\\d{2}$') }, { _id: 0, fileName: 1, base64Str: 1 }, (err, docs) => {
      if (err) {
        console.log('/img/oceanimg err:' + err);
        res.status(400).json({ meta: { msg: '获取 oceanimg 图片失败！', status: 400 } });
      } else {
        res.status(200).json({ data: docs, meta: { msg: '获取 oceanimg 图片成功！', status: 200 } });
      }
    });
  } else if (type === '2') { // 获取指定日期的图片
    ImgDataModel.find({ fileName: date }, { _id: 0, fileName: 1, base64Str: 1 }, (err, docs) => {
      if (err) {
        console.log('/img/oceanimg err:' + err);
        res.status(400).json({ meta: { msg: '获取 oceanimg 图片失败！', status: 400 } });
      } else {
        res.status(200).json({ data: docs[0], meta: { msg: '获取 oceanimg 图片成功！', status: 200 } });
      }
    });
  } else if (type === '3') {
    const dateArr = date.split(',') // 得到日期数组
    ImgDataModel.find({ fileName: { $in: dateArr } }, { _id: 0, fileName: 1, base64Str: 1 }, (err, docs) => {
      if (err) {
        console.log('/img/oceanimg err:' + err);
        res.status(400).json({ meta: { msg: '获取 oceanimg 图片失败！', status: 400 } });
      } else {
        // console.log(date)
        res.status(200).json({ data: docs, meta: { msg: '获取 oceanimg 图片成功！', status: 200 } });
      }
    });
  } else {
    res.status(400).json({ meta: { msg: 'type 参数有误！', status: 400 } });
  }
});

module.exports = router;
