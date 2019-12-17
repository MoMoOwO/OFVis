var express = require('express');
var router = express.Router();
var utils = require('../modules/utils')
// 引入自定义数据库操作模块
var DB = require('../modules/db');

/* GET home page. */
router.get('/', function(req, res, next) {
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
            for (let i = 0; i < docs.length; i++){
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
    let { date = '20150101' } = req.query.date; // 获取请求的日期
    let query = { "sstg": {$ne: NaN} };
    // 请求数据库
    DB.find(date, query, (err, docs) => {
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else { // 成功的回调
            let oceanInfo = []; // 返回的数据数组
            for (let i = 0; i < docs.length; i++){ // 遍历文档，组织数据结构
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

// 日历数据请求，统计面积数据，year为请求的年份默认2015，areaid为请求的区域默认全区域
router.post('/calendar', (req, res, next) => {
    let { year = '2015', areaid = 'all' } = req.query;
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
            let max = 0;
            let min = 0;
            let areaArr = docs[0].areas;
            for (let i = 0; i < areaArr.length; i++){ // 遍历文档的面积数组，组织数据结构
                if (areaid === 'all') {
                    calendarData.push([areaArr[i][0], areaArr[1]]); // [日期, 总面积]
                    max = max > areaArr[1] ? max : areaArr[1];
                    min = min < areaArr[1] ? min : areaArr[1];
                } else {
                    let index = +areaid + 1;
                    calendarData.push([areaArr[i][0], areaArr[index]]); // [日期, 区域面积]
                    max = max > areaArr[1] ? max : areaArr[1];
                }
                
            }
        }
    });


});

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
            for (let i = 0; i < docs.length; i++){
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
                    mintemp: Math.min.apply(Math, oceanInfo.map(o => { return o.temp; } ))
                }
            });
        }
    });
});

module.exports = router;
