var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
var DB = require('../modules/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// 获取温度梯度数据，接收传递参数date为请求的日期
router.post('/grid', (req, res, next) => {
    //let collectionName = req.query.type; // 请求的时间分辨率，不同力度在不同的集合下
    let collectionName = req.query.date; // 获取请求的日期
    let query = { "sstg": {$ne: NaN} };

    DB.find(collectionName, query, (err, docs) => {
        let oceanInfo = [];
        if (err) {
            res.json({
                status: 1,
                data: err.message
            });
        } else {
            for (let i = 0; i < docs.length; i++){
                oceanInfo.push({
                    'latitude': parseFloat(docs[i].latitude),
                    'longitude': parseFloat(docs[i].longitude),
                    'sstg': parseFloat(docs[i].sstg)
                });
            }

            res.json({
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
