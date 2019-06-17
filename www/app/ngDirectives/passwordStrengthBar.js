define(function(require){
	var app = require("app");

	app.directive("passwordStrengthBar",[function(){
		return {
			restrict: "E",
			scope: {
				"strength" : "@"
			},
			templateUrl: "./app/ngDirectives/passwordStrengthBar.html",
			link: function($scope){
				
			}
		}
	}])
})