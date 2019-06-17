define(function(require){
	var app = require("app");

	app.directive("carousel",["$interval",function($interval){
		return {
			restrict: "E",
			scope: {
				lists: "="
			},
			templateUrl: './app/ngDirectives/carousel.html',
			link: function($scope,ele,attr){
				console.log($scope.lists)
				var num = $scope.lists.length;
				$scope.idx = 0;
				$scope.hoverStyle = function(){
					return {"margin-top": 60 * $scope.idx + "px"}
				}
				$interval(function(){
					$scope.idx ++;
					if($scope.idx >= num){
						$scope.idx = 0;
					}
				},4000);
			}
		}
	}])
})