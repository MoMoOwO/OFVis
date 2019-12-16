var express = require('express');
var router = express.Router();
var tilelive = require('tilelive');

router.get('/', function (req, res, next) {
    tilelive.load('', function (err, source) {
        if (err) {
            throw err;
        } else {
            var z = req.params[0];
            var x = req.params[1];
            var y = req.params[2];
            source.getTile(z, x, y, function(error, tile, headers) {
                if (error) {
                    res.json({
                        status: 1,
                        data: err.message
                    });
                } else {
                    res.send(title);
                }
            });
        }
    })
});

module.exports = router;