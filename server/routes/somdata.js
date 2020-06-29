var express = require('express');
var router = express.Router();
var SOM = require('ml-som');
// 引入可以操作数据库的 Model 模块
const SOMDataModel = require('../modules/sommodel');
const RegionDataModel = require('../modules/regiondata');
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

router.get('/somresult', function (req, res, next) {
  SOMDataModel.find({}, (err, doc) => {
    if (err) {
      console.log('/som/somresult err:' + err);
      res.status(400).json({ meta: { msg: '获取 SOM-Model 数据失败！', status: 400 } });
    } else {
      const somModel = { name: doc[0].name, options: doc[0].options, data: doc[0].data };
      // 加载模型
      const som = SOM.load(somModel);
      const matrix = som.getUMatrix();
      // UMatrix
      const UMatrix = []
      let min = matrix[0][0]
      let max = matrix[0][0]
      const size = matrix.length;
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j] > min ? min = min : min = matrix[i][j]
          matrix[i][j] < max ? max = max : max = matrix[i][j]
          UMatrix.push([i, j, matrix[i][j], size * i + j]) // [x, y, dis, id]
        }
      }

      // weightMatrix
      const weightData = doc[0].data;
      const weightsMatrix = [];
      for (let i = 0; i < weightData.length; i++) {
        for (let j = 0; j < weightData[i].length; j++) {
          weightsMatrix.push([i, j, [
            { name: "Moran's I", value: weightData[i][j][0] },
            { name: "Mode", value: weightData[i][j][1] },
            { name: "Qd", value: weightData[i][j][2] },
            { name: "Skewness", value: weightData[i][j][3] },
            { name: "Excess_Kurtosis", value: weightData[i][j][4] },
          ], size * i + j]); // [x, y, weightData, id]
        }
      }

      // 获取 BMU 统计
      RegionDataModel.find({}, (err, docs) => {
        if (err) {
          console.log('/som/somresult err:' + err);
          res.status(400).json({ meta: { msg: '获取 BMUCount 数据失败！', status: 400 } });
        } else {
          const predictSet = []
          for (let i = 0; i < docs.length; i++) {
            // 遍历添加各海区的特征值
            for (let obj of docs[i].FeaturesData) {
              predictSet.push(
                {
                  MoranI: obj.MoranI,
                  Mode: obj.Mode,
                  Qd: obj.Qd,
                  Skewness: obj.Skewness,
                  Excess_Kurtosis: obj.Excess_Kurtosis
                }
              );
            }
          }
          // count 数组
          const unitCount = []; // new Array(size * size)
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              unitCount.push([i, j, 0, size * i + j]); // [x, y, count, id]
            }
          }
          for (let obj of predictSet) {
            let res = som.predict(obj);
            unitCount[size * res[0] + res[1]][2]++; // 统计
          }

          res.status(200).json({ data: { min, max, size, UMatrix, unitCount, weightsMatrix }, meta: { msg: '获取 UMatrix 成功！', status: 200 } });
        }
      });
    }
  });
});

module.exports = router;
