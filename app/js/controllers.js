angular.module("idiomControllers", ["idiomControllers.startup"])

// 启动控制器
.controller("wrapperController", ["$rootScope", "$scope", "$http", "$state", '$translate', function($rootScope, $scope, $http, $state, $translate) {

	/* 公共变量 开始 */
	$scope.debug = true;




	/* 公共变量 结束 */

	// 请求接口封装
	$scope.request = {
		http: function(path, method, data, callback) {
			if(method.toLowerCase() == 'get') {
				$http({
					url: path,
					method: 'get',
					params: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			} else if(method.toLowerCase() == 'post') {
				$http({
					url: path,
					method: 'post',
					data: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			} else if(method.toLowerCase() == 'jsonp') {

				// 设置JSONP回调函数为success
				data.callback = "JSON_CALLBACK";

				$http({
					url: path,
					method: 'jsonp',
					params: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			}
		}
	}

}]);