var express = require('express');
var router = express.Router();
var SOM = require('ml-som');
// 引入可以操作数据库的 Model 模块
const SOMDataModel = require('../modules/sommodel');
const SamplesDataModel = require('../modules/samples-data-model');
const ClusterTreeListModel = require('../modules/cluster-tree-list-model');

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
  const somDocs = await SOMDataModel.find({}, { '_id': 0, 'options': 1, 'data': 1, 'name': 1 });
  let som = null; // SOM对象
  if (somDocs.length) {
    som = SOM.load(somDocs[0]); // 加载 SOMMOdel，之后得到 som 网络模型
  } else {
    res.status(400).json({ meta: { msg: '获取 SOM-Model 数据失败！', status: 400 } });
  }

  // 获取 UMatrix 数据
  const u_matrix = som.getUMatrix();
  const size = u_matrix.length; // SOM 输出层的尺寸
  // UMatrix
  let UMatrix = []; // 最终 UMatrix 的数据
  // 距离矩阵的最大最小值
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

  // 样本特征值数组
  const features = somDocs[0].options.fields;
  let indicatorArr = []; // 指标数组，用于雷达图
  for (let obj of features) {
    indicatorArr.push({
      'text': obj.name, // 指标名称
      'max': 0 // 指标最大值，最后通过遍历 w_matrix 来确定最大值
    });
  }

  // 权重矩阵  用于雷达图 series
  const w_matrix = somDocs[0].data;
  let WMatrix = [];
  // 装配权重矩阵数据 [[x, y, [{id: n, value: []}], id]]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let nid = size * i + j; // id
      // 添加项
      WMatrix.push([i, j, [{ id: nid, value: w_matrix[i][j] }], nid]); // [[x, y, [{id: n, value: []}], id]]

      // 遍历特征值权重值数组 w_matrix[i][j] 来确定对应指标的最大值
      let featuresWeightArr = w_matrix[i][j];
      for (let k = 0; k < featuresWeightArr.length; k++) {
        let weight = featuresWeightArr[k]; // 权重值
        (weight > indicatorArr[k].max) && (indicatorArr[k].max = weight); // 如果权重值大则替换
      }
    }
  }

  // 获取样本数据，使用 SOM 模型开始预测
  const samplesDocs = await SamplesDataModel.find({});

  const predictSet = []; // 用于预测的数据集，是只包含样本特征值的数组
  const samplesNameSet = []; // 样本数据集名称标识
  const samplesSet = []; // 样本的完整数据集，包含年份、海域、BMU等标识

  // 从 samplesDocs 中获取数据
  for (let i = 0; i < samplesDocs.length; i++) {
    let sampleName = samplesDocs[i].date; // 用‘日期-海区’来标识，先获取日期
    // 遍历添加各海区的特征值
    for (let obj of samplesDocs[i].features) {
      sampleName += '-' + obj.regionId; // 日期-海区  标识
      samplesNameSet.push(sampleName);
      // 添加预测集数据
      predictSet.push({
        MoransI: obj.MoransI,
        IQR: obj.IQR,
        Skewness: obj.Skewness,
        SDD: obj.SDD,
        LALSR: obj.LALSR
      });
      sampleName = sampleName.split('-')[0]; // 遍历到下一个海区，先恢复到只是 日期 的状态
    }
  }

  // 统计 SOM 输出层每个 BMU 上样本的数量
  const unitCount = [];
  // 现将每个节点的统计初始化为 0
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      unitCount.push([i, j, 0, size * i + j]); // [x, y, count, unitId]
    }
  }

  // 开始预测，开通统计 BMU 的样本
  const predictSetLen = predictSet.length;
  for (let i = 0; i < predictSetLen; i++) {
    let predictData = predictSet[i];
    let BMU = som.predict(predictData); // 寻找 BMU
    let unitId = size * BMU[0] + BMU[1];
    unitCount[unitId][2] += 1; // 对应 BMU 结点统计 +1

    // 完整的样本数据集，['date-regionId', date, regionId, MoransI, IQR, Skewness, SDD, LALSR, unitId]
    // 该数据集可用于平行坐标图和时序图
    samplesSet.push([
      samplesNameSet[i], // 'date-regionId'
      samplesNameSet[i].split('-')[0], // date
      samplesNameSet[i].split('-')[1], // regionId,
      predictData.MoransI,
      predictData.IQR,
      predictData.Skewness,
      predictData.SDD,
      predictData.LALSR,
      unitId
    ]);
  }

  // 平行坐标轴 每个坐标轴与数据 series 之间的 Schema 映射
  const samplesSetSchemaToParallel = [
    { name: 'samplesName', index: 0, text: 'Sample Name' },
    { name: "Moran's I", index: 3, text: "Moran's I" },
    { name: 'IQR', index: 4, text: 'IQR' },
    { name: 'Skewness', index: 5, text: 'Skewness' },
    { name: 'SDD', index: 6, text: 'SDD' },
    { name: 'LALSR', index: 7, text: 'LALSR' }
  ];

  res.status(200).json({ data: { min, max, size, UMatrix, unitCount, indicatorArr, WMatrix, samplesSet, samplesSetSchemaToParallel }, meta: { msg: '获取 SOM-Result 成功！', status: 200 } });
});

module.exports = router;
