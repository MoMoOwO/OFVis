var express = require('express');
var router = express.Router();
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
            })
        }
        
    });
});

// 获取温度梯度数据，接收传递参数date为请求的日期
router.post('/grid', (req, res, next) => {
    let collectionName = req.query.date; // 获取请求的日期
    let query = { "sstg": {$ne: NaN} };
    // 请求数据库
    DB.find(collectionName, query, (err, docs) => {
        let oceanInfo = []; // 返回的数据数组
        if (err) { // 数据库查询失败回调
            res.json({
                status: 1,
                data: err.message
            });
        } else { // 成功的回调
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
