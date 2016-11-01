var idiomController = angular.module("idiomController", []);

// 启动控制器
idiomController.controller("startupController", ["$scope", function($scope) {
	$scope.hello = "hello";
}]);