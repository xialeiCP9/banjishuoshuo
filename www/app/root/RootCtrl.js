define(function(require){
	var app = require("app");
	require("../ngServices/checkLoginService");
	require("jquery-ui");
	require("bootstraps");
	app.controller("RootCtrl",["checkLoginService",function(checkLoginService){
		//实例化控制器后，即要开始检测是否登录
		checkLoginService.checkLogin();
		this.isLogin = function(){
			return checkLoginService.isLogin();
		};
		this.getEmail = function(){
			return checkLoginService.getEmail();
		}
		this.getAvatar = function(){
			return checkLoginService.getAvatar();
		}
		this.dropdown = false;
		this.isShowDialog = function(b){
			this.dropdown = b;
		}
	}])
})