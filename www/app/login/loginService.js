define(function(require){
	var app = require("app");

	app.factory("loginService",["$http",function($http){
		function doLogin(email,password,callback){
			$http.post("/login",{email: email,password: password}).then(function(data){
				callback && callback(data);
			})
		}
		return {
			doLogin: doLogin
		}
	}])
})