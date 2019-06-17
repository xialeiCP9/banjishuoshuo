var express = require("express");
var mongoose = require("mongoose");
var session = require("express-session");
var router = require("./controllers/router.js")

var app = express();

//链接数据库
mongoose.connect("mongodb://localhost/shuoshuo",{useNewUrlParser: true});
//使用session
app.use(session({
	secret: 'xialei',
	cookie: {maxAge: 60 * 24 * 60 * 1000 },
	resave: false,
	saveUninitialized: true
}));

//路由表
app.post("/checkexist",router.checkExist);
//注册
app.post("/user",router.addUser);
//检测是否登录
app.get("/checklogin",router.checkLogin);

//登录
app.post("/login",router.doLogin);

//得到个人信息
app.get("/profile",router.getProfile);
//修改个人信息
app.post("/profile",router.doProfile);

//上传文件
app.post("/upload",router.upload);
//切图片
app.get("/cut",router.doCut);

app.use(express.static("www"));

//不存在页面
app.use(function(req,res){
	res.send("该页面不存在");
})

app.listen(3000);

