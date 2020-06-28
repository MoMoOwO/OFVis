var express = require('express');
var router = express.Router();
var SOM = require('ml-som');
// 引入可以操作数据库的 Model 模块
const SOMDataModel = require('../modules/sommodel');
// 引入工具类
const utils = require('../modules/utils');

// 检查是否存在 SOM-Model
SOMDataModel.find({}, (err, docs) => {
  if (err) {
    console.log('/som/UMatrix err:' + err);
    res.status(400).json({ meta: { msg: '获取 SOM-Model 数据失败！', status: 400 } });
  } else {
    if (docs.length === 0) {
      // 初始化
      utils.initSOMModel();
      console.log('SOM-Model 创建完毕！');
    } else {
      console.log('已存在 SOM-Model！');
    }
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'som-data-api' });
});

router.get('/UMatrix', function (req, res, next) {
  SOMDataModel.find({}, (err, docs) => {
    if (err) {
      console.log('/som/UMatrix err:' + err);
      res.status(400).json({ meta: { msg: '获取 SOM-Model 数据失败！', status: 400 } });
    } else {
      const somModel = { name: docs[0].name, options: docs[0].options, data: docs[0].data };
      // 加载模型
      const som = SOM.load(somModel);
      const matrix = som.getUMatrix();

      const UMatrix = []
      let min = matrix[0][0]
      let max = matrix[0][0]
      const size = matrix.length;
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j] > min ? min = min : min = matrix[i][j]
          matrix[i][j] < max ? max = max : max = matrix[i][j]
          UMatrix.push([i, j, matrix[i][j]])
        }
      }

      // 初始化
      res.status(200).json({ data: { min, max, size, UMatrix }, meta: { msg: '获取 UMatrix 成功！', status: 200 } });
    }
  })
});

module.exports = router;
