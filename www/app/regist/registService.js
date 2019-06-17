define(function(require){
	var app = require("app");
	app.factory("registService",["$http",function($http){

		function checkExist(email,callback){
			$http.post("/checkexist",{email: email}).then(function(data){
				callback && callback(data);
			})
		}

		function doRegist(email,password,callback){
			$http.post("/user",{email: email,password: password}).then(function(data){
				callback && callback(data);
			})
		}

		return {
			checkExist: checkExist,
			doRegist: doRegist
		}
	}])
})