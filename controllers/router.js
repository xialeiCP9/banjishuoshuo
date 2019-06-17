var User = require("../models/User.js");
var formidable = require("formidable");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var gm = require("gm");
var url = require("url");

exports.checkExist = function(req,res){
	var form = new formidable.IncomingForm();

	form.parse(req,function(err,fields,files){
		var email = fields.email;
		User.find({email: email},function(err,data){
			if(err){
				res.json({
					status: -1,
					msg: '服务器错误'
				});
				return;
			}
			res.json({
				status: data.length,
				msg: ""
			})
		})
	})
}

exports.addUser = function(req,res){
	var form = new formidable.IncomingForm();

	form.parse(req,function(err,fields,files){
		var password = crypto.createHash("sha256").update(fields.password).digest("hex");
		console.log(fields.email,password);
		var u = new User({
			email: fields.email,
			password: password
		});
		u.save(function(err){
			if(err){
				res.json({
					status: -1,
					msg: "服务器错误"
				})
				return;
			}
			req.session.login = true;
			req.session.email = fields.email;
			req.session.avatar = "/images/default_avatar.jpg";
			res.json({
				status: 1,
				msg: "注册成功"
			});
		})
	})
}

exports.checkLogin = function(req,res){
	if(req.session.login){
		res.json({
			isLogin: true,
			email: req.session.email,
			avatar: req.session.avatar
		})
	} else {
		res.json({
			isLogin: false
		})
	}
}

exports.doLogin = function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields){
		if(err){
			console.log(err);
			res.json({
				status: -1,
				msg: "服务器错误"
			});
			return;
		}
		var email = fields.email;
		User.find({email: email},function(err,data){
			console.log(err);
			if(err){
				res.json({
					status: -1,
					msg: "服务器错误"
				});
				return;
			}
			if(data.length == 0){
				res.json({
					status: -2,
					msg: "用户名或密码错误"
				});
				return;
			}
			var u = data[0];
			var password = crypto.createHash("sha256").update(fields.password).digest("hex");
			if(password == u.password){
				req.session.login = true;
				req.session.email = email;
				req.session.avatar = data[0].avatar;
				res.json({
					status: 1,
					msg: "登录成功"
				});
				return;
			}
			res.json({
				status: -2,
				msg: "用户名或密码错误"
			});
		})
	})
}

exports.getProfile = function(req,res){
	if(!req.session.login){
		res.json({
			status: -3,
			msg: "需要先登录"
		});
		return;
	}

	var email = req.session.email;
	User.find({email: email},function(err,data){
		if(err){
			console.log(err);
			res.json({
				status: -1,
				msg: "服务器错误"
			});
			return;
		}
		if(data.length == 0){
			res.json({
				status: -2,
				msg: "用户不存在"
			});
			return;
		}
		res.json({
			status: 1,
			nickname: data[0].nickname,
			email: data[0].email,
			avatar: data[0].avatar || "/images/default_avatar.jpg",
			briefintro: data[0].briefintro
		})
	})
}

//上传文件
exports.upload = function(req,res){
	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname,"../www/uploads");
	form.keepExtensions = true;
	form.parse(req,function(err,fields,files){
		if(err){
			console.log(err);
			res.json({
				status: -1,
				msg: '服务器错误'
			});
			return;
		}
		//判断图片的高度和宽度是否大于100；
		
		gm(files.file.path).size(function(err,size){
			if(err){
				console.log(err);
				res.json({
					status: -1,
					msg: '服务器错误'
				});
				return;
			}
			if(size.width < 100 || size.height < 100){
				res.json({
					status: -2,
					msg: '图片的高度和宽度，都必须大于100'
				});
				return;
			}
			res.json({
				status: 1,
				msg: '图片符合规范，请使用方框进行截图',
				file: files
			})
		})
		
	})
};

//裁剪图片
exports.doCut = function(req,res){
	
	var w = url.parse(req.url,true).query.w;
	var h = url.parse(req.url,true).query.h;
	var x = url.parse(req.url,true).query.x;
	var y = url.parse(req.url,true).query.y;
	var picUrl = url.parse(req.url,true).query.url;

	gm(picUrl).crop(w,h,x,y).resize(100,100,"!").write(picUrl,function(err){
		if(err){
			console.log(err);
			res.json({
				status: -1,
				msg: "服务器错误"
			});
			return;
		}
		res.json({
			status: 1,
			msg: "剪切成功"
		})
	})
}

exports.doProfile = function(req,res){
	var form = new formidable.IncomingForm();

	form.parse(req,function(err,fields,files){
		if(err){
			console.log(err);
			res.json({
				status: -1,
				msg: "服务器错误"
			});
			return;
		}
		User.updateOne({email: fields.email},{
			nickname: fields.nickname,
			avatar: fields.avatar,
			briefintro: fields.briefintro
		},function(err,data){
			if(err){
				console.log(err);
				res.json({
					status: -1,
					msg: "服务器错误"
				});
				return;
			}
			if(data.ok == 1){
				//重新设置session信息
				req.session.avatar = fields.avatar;
				res.json({
					status: 1,
					msg: "修改成功"
				})
			} else {
				res.json({
					status: -2,
					msg: "修改失败，请刷新重试"
				})
			}
		})
	})
}