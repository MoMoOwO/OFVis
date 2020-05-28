// 引入自定义数据库操作模块
var DB = require('../modules/db');
let sd = require("silly-datetime");

let utils = {}; // 工具类

// 获取一年(默认2105)的日期序列，两种格式YYYY-MM-DD、YYYYMMDD
utils.getDateSequence = function getDateSequence(year = 2015) {
    let start = +new Date(year + '-01-01');
    let end = +new Date((year + 1) + '-01-01');
    let dateArr1 = [];
    let dateArr2 = [];
    //console.log(start, end);
    let dayTime = 3600 * 24 * 1000;
    for (let time = start; time < end; time += dayTime) {
        dateArr1.push(sd.format(time, 'YYYY-MM-DD'));
        dateArr2.push(sd.format(time, 'YYYYMMDD'));
    }
    return { format1: dateArr1, format2: dateArr2 };
};

// let i = utils.getDateSequence(2016);
// console.log(i.format2);
// let num = 2.44667;
// let a = +num.toFixed(2)
// console.log(a, typeof a);

// 获取面积
utils.getAreas = function getAreas(date) {
    let promise = new Promise((resolve, reject) => {
        // 异步请求数据库
        DB.find('Area', { 'date': date }, (err, docs) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs[0].areas);
            }
        });
    });
    return promise;
};

/* getAreas(2015).then((result) => {
    console.log(result);
}, (err) => {
    console.log(err);
});
console.log("------"); */

/* let areasArr = [1, 2, 3, 4];
let days = 0, area = 0; // 记录某个月天数，用于计算平均面积area，最后添加到resultArr[idx].value数组中
// 先添加一月，后按十二月十一月依次添加
for (let i = 0; i < areasArr.length; i++) {
    // areasArr[0].split("-")：[2015, 01, 01]
    if (areasArr[i] % 2 === 0) {
        days += 1; // 天数累加
        area += areasArr[i]; // 累加对应海域的面积
    }
}
console.log(days, area);
 */

/* let arr = [1, 2, 3];
arr.push(4);
console.log(arr); */
// let i = 1;
/* function aa(t, e) {
    var i = (t.length - 1) * e + 1, n = Math.floor(i), a = +t[n - 1], o = i - n;
    return o ? a + o * (t[n] - a) : a;
} */
// console.log(i.toString().padStart(2, '0'));

// 求数组分位数的函数，arr为数组，per为分位数如0.25,0.5,0.75
utils.quantile = function quantile(arr, per) {
    let i = (arr.length - 1) * per + 1, n = Math.floor(i), a = +arr[n - 1], o = i - n;
    return o ? a + o * (arr[n] - a) : a;
};
// 准备箱线图数据
/*
    rawData: 数据集，二维数组
    [
        [12, 32, 43], // 第一个数据集(box)
        [23, 43, 54, 56], // 第二个数据集(box)
        ....
    ],
    opt: {boundIQR: 1.5} 界定界限离群值的参数，
    默认为1.5，即Q1 - 1.5 * (Q3 - Q1)
    如果为none/0则不适用界限
*/ 
utils.prepareBoxPlotData = function prepareBoxPlotData(rawData, opt) {
    opt = opt || [];
    let boxData = []; // 箱图中的数据
    let outliers = []; // 离群值
    let axisData = []; // 坐标轴的值
    let boundIQR = opt.boundIQR; // 获取 boundIQR
    let useExtreme = boundIQR === 'none' || boundIQR === 0; // 是否使用界限

    for (let i = 0; i < rawData.length; i++) {
        axisData.push(i + ''); // 坐标轴序号
        let ascList = rawData[i].sort((a, b) => a - b); // 获取升序序数组

        // 下四分位数
        let Q1 = utils.quantile(ascList, 0.25);
        // 中位数
        let Q2 = utils.quantile(ascList, 0.5);
        // 上四分位数
        let Q3 = utils.quantile(ascList, 0.75);
        let min = ascList[0]; // 最小值
        let max = ascList[ascList.length - 1]; // 最大值

        let bound = (boundIQR == null ? 1.5 : boundIQR) * (Q3 - Q1); // 设定的边界范围差

        // 下边缘
        let low = useExtreme
            ? min
            : Math.max(min, Q1 - bound);
        // 上边缘
        let high = useExtreme
            ? max
            : Math.min(max, Q3 + bound);

        boxData.push([low, Q1, Q2, Q3, high]); // 箱线图数据

        // 异常值数据
        for (let j = 0; j < ascList.length; j++) {
            let dataItem = ascList[j];
            if (dataItem < low || dataItem > high) {
                let outlier = [i, dataItem];
                opt.layout === 'vertical' && outlier.reverse();
                outliers.push(outlier);
            }
        }
    }
    return {
        boxData: boxData,
        outliers: outliers,
        axisData: axisData
    };
};

/* utils.hello = function say() {
    console.log("hello");
}
utils.hello(); */

module.exports = utils;
