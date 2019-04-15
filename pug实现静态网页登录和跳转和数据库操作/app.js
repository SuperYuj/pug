var express = require('express');
var pug = require('pug');
var indexRouter = require('./routers/index');
var bodyParaser = require('body-parser');

var app = express();

// 设置默认模板引擎是pug
app.engine('.pug', pug.__express);
app.set('view engine', 'pug');
app.set('views', 'views'); // 模板所在的目录为view

app.use(bodyParaser.urlencoded({extended:false})); //expanded:false表示解析值类型是string|Array, true表示解析值是任意类型
app.use(express.static('public')); //静态资源所有目录

app.use(indexRouter);

var port = 8080;
app.listen(port, function () {
    console.log('启动服务器成功,监听8080');
});
