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
    for (let time = start; time < end; time += dayTime){
        dateArr1.push(sd.format(time, 'YYYY-MM-DD'));
        dateArr2.push(sd.format(time, 'YYYYMMDD'));
    }
    return { format1: dateArr1, format2: dateArr2 };
}

// let i = utils.getDateSequence(2016);
// console.log(i.format2);

module.exports = utils;
