var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Image' });
});

// 请求图片，按名称请求
router.get('/files', function (req, res, next) {
  let fileName = req.query.name;
  console.log(fileName);
  let bData = fs.readFileSync('../public/images/' + fileName + '.png');
  console.log(bData);
  let base64Str = bData.roString('base64');
  let dataUri = 'data:image/png;baser64' + base64Str;
  console.log(dataUri);
  res.send(dataUri);
});

module.exports = router;
