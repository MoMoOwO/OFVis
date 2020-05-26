var express = require('express');
var router = express.Router();
var utils = require('../modules/utils');
// 引入自定义数据库操作模块
var DB = require('../modules/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/geo', (req, res, next) => {
    // type与集合名相同
    let collectionName = req.query.type; // 获取请求数据类型，分为海区和数据点两个Geo，分别对应集合：zone、dataPoly
    let query = {}; // 查询条件为查询所有
    // 查询数据库
    DB.find(collectionName, query, (err, docs) => {
        let geoInfo = []; // geo数据数组
        if (err) {
            // 失败的回调
            res.json({
                status: 1,
                data: err.message
            });
        } else {
            //成功的回调
            for (let i = 0; i < docs.length; i++) {
                geoInfo.push({
                    properties: docs[i].properties,
                    type: docs[i].type,
                    geometry: docs[i].geometry
                });
            }
            // 返回数据
            res.json({
                status: 0,
                message: {
                    length: geoInfo.length,
                    data: geoInfo
                }
            });
        }

    });
});

// 获取温度梯度数据，接收传递参数date为请求的日期，默认20150101
router.post('/grid', (req, res, next) => {
    let date = req.query.date; // 获取请求的日期
    let query = { "sstg": { $ne: NaN } };
    // 请求数据库
    DB.find(date, query, (err, docs) => {
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else { // 成功的回调
            let oceanInfo = []; // 返回的数据数组
            for (let i = 0; i < docs.length; i++) { // 遍历文档，组织数据结构
                oceanInfo.push({
                    latitude: parseFloat(docs[i].latitude),
                    longitude: parseFloat(docs[i].longitude),
                    sstg: parseFloat(docs[i].sstg)
                });
            }

            res.json({  // 返回数据
                status: 0,
                message: {
                    count: oceanInfo.length,
                    data: oceanInfo,
                    max: Math.max.apply(Math, oceanInfo.map(o => { return o.sstg; }))
                }
            });
        }
    });
});

router.post('/pointData', (req, res, next) => {
    let date = req.query.date; // 获取请求的日期
    let query = { "sstg": { $ne: NaN } };
    // 请求数据库
    DB.find(date, query, (err, docs) => {
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else { // 成功的回调
            let oceanInfo = []; // 返回的数据数组
            for (let i = 0; i < docs.length; i++) { // 遍历文档，组织数据结构
                oceanInfo.push({
                    regionid: +docs[i].region_id,
                    center: `(${docs[i].longitude},${docs[i].latitude})`,
                    sstg: parseFloat(docs[i].sstg)
                });
            }

            res.json({  // 返回数据
                status: 0,
                message: {
                    count: oceanInfo.length,
                    data: oceanInfo
                }
            });
        }
    });
});

// 日历数据请求，统计面积数据，year为请求的年份默认2015，areaid为请求的区域默认全区域
router.post('/calendar', (req, res, next) => {
    let year = parseInt(req.query.year);
    let areaid = req.query.areaid;
    //let totalArea = 2793935.0221; // 单位平方千米
    //let recordCount = 107061; // 记录总数，查找满足条件的记录数，按占比求面积

    // 获取日期序列，format1:YYYY-MM-DD用来返回给前端，format2:YYYYMMMDD用来遍历集合统计数据
    let query = { "date": year };
    // 查询数据库
    DB.find('Area', query, (err, docs) => {
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else {
            let calendarData = []; // 返回的数据数组
            let max = 0; // 面积最大值最小值
            let min = 0;
            let index = +areaid + 1; // 海域索引
            let areaArr = docs[0].areas; // 面积数组
            // 先将最大最小值赋值为第一个个面积值，保留两位小数
            if (areaid === 'all') {
                max = +areaArr[0][1].toFixed(2);
                min = +areaArr[0][1].toFixed(2);
            } else {
                max = +areaArr[0][index].toFixed(2);
                min = +areaArr[0][index].toFixed(2);
            }
            for (let i = 0; i < areaArr.length; i++) { // 遍历文档的面积数组，组织数据结构
                if (areaid === 'all') {
                    let area = +areaArr[i][1].toFixed(2); // 需要的面积，保留两位小数
                    calendarData.push([areaArr[i][0], area]); // [日期, 总面积]
                    max = max > area ? max : area;
                    min = min < area ? min : area;
                } else {
                    let area = +areaArr[i][index].toFixed(2);
                    calendarData.push([areaArr[i][0], area]); // [日期, 区域面积]
                    max = max > area ? max : area;
                    min = min < area ? min : area;
                }
            }

            res.json({  // 返回数据
                status: 0,
                message: {
                    count: calendarData.length,
                    data: calendarData,
                    max,
                    min
                }
            });
        }
    });


});

// 雷达图数据请求，areaid为请求的区域默认全区域
router.post('/radar', (req, res, next) => {
    let areaid = req.query.areaid; // 海域id

    let index = +areaid + 1; // 海域索引

    DB.find('Area', {}, (err, docs) => {
        if (err) {
            res.json({
                status: 1,
                data: err.message
            });
        } else {
            // 返回的数据结构
            let resultArr = [];

            // 遍历三年的数据
            for (let i = 0; i < docs.length; i++) {
                // docs: [{date: 2015, areas: [['2015-01-01, 123,123...]...]}...]
                let date = docs[i].date.toString(); // 获取年份
                resultArr.push({ name: date, value: [] });
                // 统计面积
                let areasArr = docs[i].areas; // 某一年的全天的面积
                let days = 0, area = 0; // 记录某个月天数，用于计算平均面积area，最后添加到resultArr[i].value数组中

                // 先添加一月，后按十二月十一月依次添加
                for (let j = 0; j < areasArr.length; j++) {
                    // areasArr[0].split("-")：[2015, 01, 01]
                    if (areasArr[j][0].split("-")[1] === '01') {
                        days += 1; // 天数累加
                        area += areasArr[j][index]; // 累加对应海域的面积
                    }
                }
                // 求一月的平均面积，并添加到数组中
                resultArr[i].value.push(area / days);
                days = 0, area = 0; // 重置

                // 添加十二月、十一月、十月....
                for (let j = 12; j > 1; j--) {
                    for (let k = 0; k < areasArr.length; k++) {
                        // areasArr[0].split("-")：[2015, 01, 01]
                        if (areasArr[k][0].split("-")[1] === j.toString().padStart(2, '0')) {
                            days += 1; // 天数累加
                            area += areasArr[k][index]; // 累加对应海域的面积
                        }
                    }
                    resultArr[i].value.push(area / days);
                    days = 0, area = 0;
                }
            }

            res.json({
                status: 0,
                message: {
                    count: resultArr.length,
                    data: resultArr
                }
            });
        }
    });
});

// 箱线图数据请求，date为请求年份，areaid为请求的区域
router.post('/box', (req, res, next) => {
    let date = req.query.date;
    //let areaid = req.query.areaid;

    // 请求数据库
    DB.find(date, {}, (err, docs) => {
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else { // 成功的回调
            let gradData = [[], [], [], [], [], [], [], [], [], [], [], [], []]; // 海域海洋锋梯度数据
            for (let i = 0; i < docs.length; i++) { // 遍历文档，组织数据结构
                if (docs[i].zone_mask === 1 && docs[i].region_id !== -1) {
                    gradData[docs[i].region_id - 1].push(docs[i].sstg);
                }
            }

            let resData = utils.prepareBoxPlotData(gradData);
            res.json({  // 返回数据
                status: 0,
                message: resData
            });
        }
    });
});

//
router.post('/source', (req, res, next) => {
    let collectionName = '20151201_grad';
    let query = {};

    DB.find(collectionName, query, (err, docs) => {
        let oceanInfo = [];
        if (err) {
            res.json({
                status: 1,
                data: err.message
            });
        } else {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].temperature0 !== '--') {
                    oceanInfo.push({
                        'lat': parseFloat(docs[i].lat),
                        'lon': parseFloat(docs[i].lon),
                        'temp': parseFloat(docs[i].temperature0)
                    });
                }
            }

            res.json({
                status: 0,
                message: {
                    count: oceanInfo.length,
                    data: oceanInfo,
                    maxtemp: Math.max.apply(Math, oceanInfo.map(o => { return o.temp; })),
                    mintemp: Math.min.apply(Math, oceanInfo.map(o => { return o.temp; }))
                }
            });
        }
    });
});

module.exports = router;
