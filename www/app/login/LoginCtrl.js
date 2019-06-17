define(function(require){
	var app = require("app");
	require("./loginService");
	app.controller("LoginCtrl",["loginService","$state","checkLoginService","titleService",function(loginService,$state,checkLoginService,titleService){
		//设置标题
		titleService.setTitle("登录");
		this.formdata = {};
		var self = this;
		this.doLogin = function(){
			loginService.doLogin(this.formdata.email,this.formdata.password,function(data){
				if(data.data.status == 1){
					alert(data.data.msg);
					checkLoginService.checkLogin();
					$state.go("root.home");
				} else {
					alert(data.data.msg);
					self.formdata.password = "";
				}
			})
		}
	}])
})