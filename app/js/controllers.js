angular.module("idiomControllers", ["idiomControllers.startup", "idiomControllers.doing"])

// 公共控制器
.controller("wrapperController", ["$rootScope", "$scope", "$http", "$state", "apiAddr", "$translate", function($rootScope, $scope, $http, $state, apiAddr, $translate) {

	/* 拦截器 开始 */
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

		window.alert("$stateChangeStart");

		// 路由切换之前，拦截，下边是具体处理
		event.preventDefault();

		switch (toState.name) {
			case "doing":

				console.log($scope.settings.status);

				if (!$scope.settings.status || !$scope.settings.mode) {
					$state.go("startup");
					return;
				}
				break;
			default:
				release();
		}

		// 放行不需要拦截或符合条件的路由
		function release() {
			event.defaultPrevented = false;
		}
	});
	/* 拦截器 结束 */

	/* 公共变量 开始 */
	$scope.debug = true;		// 调试模式开关

	$scope.constants = {
		MODE_PROP: 1,			// 正确率模式
		MODE_ERROR: 2,			// 错误次数模式
		MODE_TIMEOUT: 3,		// 倒计时模式
		STATUS_LOADING: 100,	// 加载中
		STATUS_STARTUP:	150,	// 开始
		STATUS_DOING: 200,		// 进行中
		STATUS_OVER: 300		// 结束
	};

	$scope.settings = {
		status: null,			// 状态标志
		mode: null,				// 游戏模式
		timeout: 0,				// 超时时间/总用时
		count: 0,				// 题目总数
		correct: 0,				// 正确题目数
		incorrect: 0			// 错误题目数
	};



	/* 公共变量 结束 */

	// 请求接口封装
	$scope.request = {
		http: function(path, method, data, callback) {
			if(method.toLowerCase() == 'get') {
				$http({
					url: apiAddr.get() + path,
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
					url: apiAddr.get() + path,
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
					url: apiAddr.get() + path,
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