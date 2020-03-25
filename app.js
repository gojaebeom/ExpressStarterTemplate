var express = require('express');
var createError = require('http-errors');

var path = require('path');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var {api_router, page_router} = require('./routes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/resources/templates/pages'));
app.set('view engine', 'ejs');

/*** middleware ***/
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/resources/static')));

app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use('/', page_router);
app.use('/api', api_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('다음 번 실행함!!');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
