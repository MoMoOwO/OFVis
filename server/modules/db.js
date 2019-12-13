// 引入操作数据库的模块
const mongoClient = require('mongodb').MongoClient;

// 数据库连接url
const dbUrl = 'mongodb://localhost:27017';

// 连接数据库
function __connectDB(callback) {
    mongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        if (err) {
            console.log('连接数据库失败！');
            console.log(err);
        } else {
            callback(err, db);
        }
    });
}

// 查找
exports.find = (collectionName, json, callback) => {
    __connectDB((err, db) => {
        db.db('NOAA').collection(collectionName).find(json).toArray((error, docs) => {
            if (error) {
                console.log('查询' + collectionName + '失败！');
                console.log(error);
            } else {
                callback(error, docs);
            }
            db.close();
        });
    });
}