const SOMDataModel = require('./sommodel');
const RegionDataModel = require('./regiondata');

const utils = {}; // 工具类

utils.dateFormate = function dateFormate(strDate) { // 20150101 -> 2015-01-01
  let formate1 = strDate.slice(0, 4) + '-' + strDate.slice(4);
  return formate1.slice(0, 7) + '-' + formate1.slice(7);
}

utils.initSOMModel = function initSOMModel() {
  RegionDataModel.find({}, (err, docs) => {
    if (err) {
      console.log('初始化SOM-Model：查询数据失败！');
    } else {
      // 训练集
      const trainingSet = [];
      // 遍历文档
      for (let i = 0; i < docs.length; i++) {
        // 遍历添加各海区的特征值
        for (let obj of docs[i].FeaturesData) {
          trainingSet.push(
            {
              MoranI: obj.MoranI,
              Mode: obj.Mode,
              Qd: obj.Qd,
              Skewness: obj.Skewness,
              Excess_Kurtosis: obj.Excess_Kurtosis
            }
          )
        }
      }
      // som 配置项
      const options = {
        fields: [
          { name: 'MoranI', range: [Math.min.apply(Math, trainingSet.map(item => { return item.MoranI })), Math.max.apply(Math, trainingSet.map(item => { return item.MoranI }))] },
          { name: 'Mode', range: [Math.min.apply(Math, trainingSet.map(item => { return item.Mode })), Math.max.apply(Math, trainingSet.map(item => { return item.Mode }))] },
          { name: 'Qd', range: [Math.min.apply(Math, trainingSet.map(item => { return item.Qd })), Math.max.apply(Math, trainingSet.map(item => { return item.Qd }))] },
          { name: 'Skewness', range: [Math.min.apply(Math, trainingSet.map(item => { return item.Skewness })), Math.max.apply(Math, trainingSet.map(item => { return item.Skewness }))] },
          { name: 'Excess_Kurtosis', range: [Math.min.apply(Math, trainingSet.map(item => { return item.Excess_Kurtosis })), Math.max.apply(Math, trainingSet.map(item => { return item.Excess_Kurtosis }))] },
        ]
      };

      // 根据经验公式确定尺寸
      const size = Math.ceil(Math.sqrt(5 * Math.sqrt(trainingSet.length)))
      // 创建 som 对象
      const som = new SOM(size, size, options);
      // 训练调整输出层
      som.train(trainingSet);
      // 将训练好的模型输出
      const model = som.export();

      const sommodel = new SOMDataModel(model)

      sommodel.save(error => {
        if (error) {
          console.log('初始化 SOM-Model：插入 SOM-Model 失败！');
        } else {
          console.log('初始化 SOM-Model：插入 SOM-Model 成功！');
        }
      });
    }
  });
}

module.exports = utils;
