var express = require('express');
var router = express.Router();
// 引入自定义数据库操作模块
var DB = require('../modules/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
