var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
// 引入路由文件
var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var imgRouter = require('./routes/image');
var somRouter = require('./routes/somdata');
var detectRouter = require('./routes/detect')

var app = express();

// view engine setup
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// 配置
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 应用路由文件
app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/img', imgRouter);
app.use('/som', somRouter);
app.use('/detect', detectRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
