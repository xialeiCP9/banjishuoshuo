define(function(require){
	var app = require("app");
	require("./registService");
	require("../ngDirectives/passwordStrengthBar");
	app.controller("RegistCtrl",["registService","titleService",'$state',"checkLoginService",
		function(registService,titleService,$state,checkLoginService){
		this.registform = {};
		this.passwordStrength = 0;
		this.isExist = false;
		titleService.setTitle("注册");
		var self = this;
		this.checkExist = function(){
			console.log(this.registform.email)
			if(this.registform.email === undefined){
				return;
			}
			registService.checkExist(this.registform.email,function(data){
				console.log(data.data.status)
				if(data.data.status > 0){
					self.isExist = true;
				} else {
					self.isExist = false;
				}
			})
		};

		this.doRegist = function(){
			registService.doRegist(this.registform.email,this.registform.password,function(data){
				if(data.data.status == 1){
					console.log(checkLoginService);
					//检测服务器是否登录
					checkLoginService.checkLogin();
					//跳转
					$state.go("root.home");
				}
			})
		}

		this.getStrength = function(){
				  //默认级别是0
			      var lvl = 0;
			      var txt = this.registform.password;
			      if(txt === undefined){
			      	return;
			      }
			      if(txt.length < 6){
			      	return 1;
			      }
			      //判断这个字符串中有没有数字
			      if (/[0-9]/.test(txt)) {
			          lvl++;
			      }
			      //判断字符串中有没有字母
			      if (/[a-zA-Z]/.test(txt)) {
			          lvl++;
			      }
			      //判断字符串中有没有特殊符号
			      if (/[^0-9a-zA-Z_]/.test(txt)) {
			          lvl++;
			      }
			      this.passwordStrength = lvl;
			      return this.passwordStrength;
		}
	}])
})