var express = require('express');
var db = require('../config/db');
var router = express.Router();


/**
 * 登录界面
 */
router.get('/', function (req, res) {
    res.render('login', {
        error: '',
    });
});

router.get('/test1',function (req,res,next) {
    res.send('hello');
});

/**
 * 登录提交
 */
router.post('/login.do', function (req, res) {      //这里的login.do等于login。pug的form表单的action="/login.do"
    var userName = req.body.username;
    var passWord = req.body.password;

    console.log('userName ' + userName + ' passWord :' + passWord);
    var sql = 'SELECT id,name,passwor FROM usere WHERE name = ? AND passwor = ?';
    var parameters = [userName,passWord];
    db.query(sql,parameters,function (err,data) {
        if(err){
            console.log('数据库出错'+err);
            return;
        }

        console.log(data);
        console.log(data.length);

        if(data.length === 0){
            res.render('login', {'message': '用户名或密码出错！'});//login对应login.pug
        }else{
            res.render('main',{'title':'主界面','name':'首页'});//main对应main.pug
        }
    });

});

/**
 * 用户添加  跳转到user-add.ejs
 */
router.get('/add.do',function (req,res) {//在main.pug中，<li><a href="add.do" target="right">添加用户
    // a href="add.do"等于这儿的/add.do
    res.render('test');
});

/**
 * 用户列表
 */
router.get('/list.do',function (req,res) {
    //  a href="list.do"等于这儿的/list.do
    //查询数据库列表数据：要在user-list.ejs中添加for循环，把查找数据换成<%= userLists[i].name %><%= userLists[i].passwor %>。
    var sql = 'SELECT id,name,passwor FROM usere';
    db.query(sql,function (err,data) {
        if(err){
            console.log("查询数据失败"+err);
            return;
        }
        res.render('employee',{'userLists':data});
    });
});

/**
 * 添加用户提交
 */
router.post('/add.do',function (req,res) {    //要在user-add.ejs中action后面改为/add.do
    var userName = req.body.clientname;
    var passWord = req.body.password;

    var sql = "INSERT INTO usere (name,passwor)VALUES (?,?)";
    var paramers = [userName,passWord];

    db.query(sql,paramers,function (err,data) {
        if(err){
            console.log("添加用户失败"+err);
            return;
        }
        console.log("添加用户成功");
        res.redirect('/list.do');//这儿的/list.do是跳转到上面的/list.do请求用户列表
    });
});


/**
 * 删除用户
 */
router.get('/delete',function (req,res) {
    //接收get请求参数
    var id = req.query.uid;
    console.log("id :"+id);

    var sql = 'DELETE FROM usere WHERE id = ?';
    var parameters = [id];
    db.query(sql,parameters,function (err,data) {
        if(err){
            console.log("删除失败"+err);
            return;
        }
        console.log("删除成功!");

        res.redirect('/list.do'); //重定向到用户列表界面，刷新列表数据
    })

});
/**
 * 进入修改用户
 */
router.get('/update',function (req,res) {
    //接收get请求参数
    var id = req.query.uid;
    console.log("id :"+id);

    var sql = 'SELECT id,name,passwor FROM usere WHERE id = ?';
    var parameters = [id];
    db.query(sql,parameters,function (err,data) {
        if(err){
            console.log("查询失败"+err);
            return;
        }

        console.log(data[0]);

        res.render('user_update',data[0]);
    })

});
//修改内容提交
router.post('/update',function (req,res) {
    var username = req.body.clientname;
    var password = req.body.password;
    var id = req.body.uid;
    var sql = 'UPDATE usere SET name = ?, passwor = ? WHERE id = ?';
    var parametes = [username,password,id];

    db.query(sql,parametes,function (err,data) {
        if(err){
            console.log("修改失败"+err);
            return;
        }
        console.log("修改成功!");

        res.redirect('/list.do'); //重定向到用户列表界面，刷新列表数据
    });
});
module.exports = router;
