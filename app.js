// 加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 加载路由控制
var index = require('./routes/index');
var users = require('./routes/users');

// 创建项目实例
var app = express();

// 引入JSON接口文件
var api = require('./routes/api');

// 引入解决跨域的包
var cors = require('cors');

// 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 定义icon图标
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 定义cookie解析器
app.use(cookieParser());

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', index);
app.use('/users', users);

// 设置跨域访问
app.use(cors());

// JSON API
app.get('/post', api.post);
app.get('/postlist', api.postlist);
app.get('/postcount', api.postcount);
app.get('/postrecent', api.postrecent);
app.get('/postcategory', api.postcategory);
app.get('/posttag', api.posttag);

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Headers',
//      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1');
//     res.header("Content-Type", "application/json;charset=utf-8");
//     if (req.method == 'OPTIONS') {
//     	// 让options请求快速返回
//     	res.send(200);
//     } else {
//     	next();
//     }
// });

// 404错误处理
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境，500错误处理和错误堆栈跟踪
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// 输出模型app
module.exports = app;
