define(function(require){
	var app = require("app");
	app.factory("checkLoginService",["$http",function($http){
		var isLogin = false;
		var email = "";
		var avatar = "";
		return {
			checkLogin : function(callback){
				//从服务器中查询是否登陆
				$http.get("/checklogin").then(function(data){
					isLogin = data.data.isLogin;
					email = data.data.email;
					avatar = data.data.avatar || "/images/default_avatar.jpg";
					callback && callback();
				})
			},
			isLogin : function(){
				return isLogin;
			},
			getEmail : function(){
				return email;
			},
			getAvatar : function(){
				return avatar;
			}
		}
	}])
})