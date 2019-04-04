var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var managersRouter = require('./routes/managers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置登陆拦截
app.use(function(req,res,next){
	console.log(req.path);
	if (req.cookies.userId||req.cookies.managerId) {
		next();
	}else {
		//console.log(1)
		if (req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path=='/goods/list' 
			|| req.originalUrl=='/users/register'||req.originalUrl=='/managers/loginout'||req.path=='/managers/getcheckcode'
			||req.originalUrl=='/managers/login') {
				//console.log(2)
           next();//req.originalUrl路径包含请求的查询字符串，req.path只是请求的路径
       }else{
          res.status(200).json({
          	code:3,
          	msg:"当前未登录！"
          })
       }
	}
});
//   app.use((req, res, next) => {
//   if(req.cookies.userId){
//     next();
//   }else{
//     if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path=='/goods/list' || req.originalUrl=='/users/registor'){
//       next()
//     }else{
//       res.json({
//         status: '10001',
//         msg: '当前未登录',
//         result: ''
//       });
//     }
//   }
// })

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/managers', managersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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
