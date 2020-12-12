var express = require('express');
var router = express.Router();
var SOM = require('ml-som');
// 引入可以操作数据库的 Model 模块
const SOMDataModel = require('../modules/sommodel');
const SamplesDataModel = require('../modules/samples-data-model');
const ClusterTreeListModel = require('../modules/cluster-tree-list-model');

let som = null;

// 检查是否存在 SOM-Model  异步自执行
(async () => {
  const docs = await SOMDataModel.find({}, { '_id': 0, 'options': 1, 'data': 1, 'name': 1 });
  if (docs.length) {
    console.log('SOM 模型初始化中....');
    som = SOM.load(docs[0]);
    console.log('SOM 模型初始化完毕....');
  } else {
    console.log('操作 SOMModel 出错！');
  }
})();

console.log(som)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'somv api' });
});

// 获取分类树结构数据
router.get('/clustertree', function (req, res, next) {
  ClusterTreeListModel.find({ name: 'root' }, (err, docs) => {
    if (err) {
      console.log('/som/clustertree err:' + err);
      res.status(400).json({ meta: { msg: '获取 Cluster-Tree-List 数据失败！', status: 400 } });
    } else {
      const clusterTreeListData = {
        id: docs[0].id,
        isLeaf: docs[0].isLeaf,
        name: docs[0].name,
        colors: docs[0].colors,
        children: docs[0].children
      }
      res.status(200).json({ data: clusterTreeListData, meta: { msg: '获取 Cluster-Tree-List 成功！', status: 200 } });
    }
  });
});
// 更新分类树结构
router.put('/clustertree/:name', function (req, res, next) {
  ClusterTreeListModel.updateOne(req.params, req.body, (err, doc) => {
    if (err) {
      console.log('/som/clustertree/:name err:' + err);
      res.status(400).json({ meta: { msg: '修改 Cluster-Tree-List 数据失败！', status: 400 } });
    } else {
      res.status(200).json({ data: 'Save Cluster Tree List Data Success!', meta: { msg: '修改 Cluster-Tree 数据成功！', status: 200 } });
    }
  })
});

// 获取 som 结果数据集，主要包含各类图表所需数据
router.get('/somresult', async function (req, res, next) {
  // 获取 SOMModel 数据
  const som_docs = await SOMDataModel.find({}, { '_id': 0, 'options': 1, 'data': 1, 'name': 1 });
  let som = null; // SOM对象
  if (docs.length) {
    som = SOM.load(som_docs[0]); // 加载 SOMMOdel，之后得到 som 网络模型
  } else {
    res.status(400).json({ meta: { msg: '获取 SOM-Model 数据失败！', status: 400 } });
  }

  // 获取 UMatrix 数据
  const u_matrix = som.getUMatrix();
  const size = u_matrix.length; // SOM 输出层的尺寸
  // UMatrix
  let UMatrix = []; // 最终 UMatrix 的数据
  let min = u_matrix[0][0];
  let max = u_matrix[0][0];

  // 装配 UMatrix 数组 [[x, y, dis], ...]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // 修改距离的最大最小值
      u_matrix[i][j] > max ? max = u_matrix[i][j] : max = max;
      u_matrix[i][j] < min ? min = u_matrix[i][j] : min = min;
      // 添加项
      UMatrix.push([i, j, u_matrix[i][j], size * i + j]); // [x, y, dis, id]
    }
  }

  // 权重矩阵
  const w_matrix = som_docs[0].data;
  let WMatrix = [];
  // 装配权重矩阵数据 [[x, y, [{id: n, value: []}], id]]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let nid = size * i + j; // id
      // 添加项
      WMatrix.push([x, y, [{ id: nid, value: w_matrix[i][j] }], nid]); // [[x, y, [{id: n, value: []}], id]]
    }
  }

  // 样本特征值数组
  const features = som_docs[0].options.fields;
  let indicatorArr = []; // 指标数组，用于雷达图
  // for (let obj)


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
          const predictSet = [] // 预测的数据集，只包含特征值
          const dataSetNames = [] // 数据集名称标识
          const dataSet = [] // 完整数据集，包含所有标识
          for (let i = 0; i < docs.length; i++) {
            let dataSetName = docs[i].date
            // 遍历添加各海区的特征值
            for (let obj of docs[i].FeaturesData) {
              dataSetName = dataSetName + '-' + obj.regionId
              dataSetNames.push(dataSetName)
              dataSetName = dataSetName.split('-')[0]
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
            dataSetName = ''
          }
          // count 数组
          const unitCount = []; // new Array(size * size)
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              unitCount.push([i, j, 0, size * i + j]); // [x, y, count, unitId]
            }
          }
          for (let i = 0; i < predictSet.length; i++) {
            let res = som.predict(predictSet[i]);
            unitCount[size * res[0] + res[1]][2]++; // 统计
            dataSet.push([
              dataSetNames[i],
              dataSetNames[i].split('-')[0],
              dataSetNames[i].split('-')[1],
              predictSet[i].MoranI,
              predictSet[i].Mode,
              predictSet[i].Qd,
              predictSet[i].Skewness,
              predictSet[i].Excess_Kurtosis,
              size * res[0] + res[1]
            ])
            // [dataSet, date, regionId, MI, Mo, Qd, Sk, EK]
          }

          const dataSetSchemaToParallel = [
            { name: 'DateSetName', index: 0, text: 'Sample Name' },
            { name: "Moran's I", index: 3, text: "Moran's I" },
            { name: 'Mode', index: 4, text: 'Mode.5' },
            { name: 'Qd', index: 5, text: 'Qd' },
            { name: 'Skewness', index: 6, text: 'Skewness' },
            { name: 'Excess_Kurtosis', index: 7, text: 'Excess_Kurtosis' }
          ]

          res.status(200).json({ data: { min, max, size, UMatrix, unitCount, weightsMatrix, dataSet, dataSetSchemaToParallel }, meta: { msg: '获取 SOM-Result 成功！', status: 200 } });
        }
      });
    }
  });
});

module.exports = router;
