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
}

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
}

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
let i = 1;
console.log(i.toString().padStart(2, '0'));

module.exports = utils;
