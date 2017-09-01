angular.module("idiomControllers", ["idiomControllers.startup", "idiomControllers.doing", "idiomControllers.completed"])

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
		STATUS_LOADING: 50,		// 加载中
		STATUS_STARTUP:	100,	// 开始
		STATUS_DOING: 200,		// 进行中
		STATUS_COMPLETED: 300,	// 正常完成结束
		STATUS_TIMEOUT: 400,	// 时间到了结束
		STATUS_ERROR: 500		// 错误次数到了结束
	};

	// 初始化配置
	$scope.config = {
		COUNT: 10,			// 题目总数
		ERROR: 3,			// 错误模式最多错误次数
		TIMEOUT: 60,		// 倒计时模式时间长度，单位秒
		TOTAL_TIMES: 10	// 最长总用时，超过就timeout
	};

	// 初始化游戏数据
	$scope.runtime = {};

	/* 公共变量 结束 */

	// 初始化游戏数据（重置）
	$scope.initRuntime = function() {

		// 初始化游戏数据
		$scope.runtime = {
			status: null,			                		// 状态标志
			mode: null,				                		// 游戏模式
			times: 0,				                		// 总用时
			timeout: $scope.config.TIMEOUT * 1000,			// 超时控制
			totalTimes: $scope.config.TOTAL_TIMES * 1000,	// 最长总用时，超过就timeout
			count: $scope.config.COUNT,						// 题目总数
			correct: 0,				                		// 正确题目数
			incorrect: 0,			                		// 错误题目数
			error: $scope.config.ERROR						// 错误模式次数限制
		};

		if($scope.debug) {
			console.log("initRuntime", $scope.runtime);
		}
	}

	/* 添加监听 开始 */

	// 格式化输出时间
	$scope.formatTime = function(time) {
		function _isInteger(time) {
			return typeof time === 'number' && time % 1 === 0;
		}

		var outputTime = null;
		if(time < 10 && _isInteger(time)) {
			outputTime = "0" + time.toString() + ".00";
		} else if(time < 10 && _isInteger(time * 10)) {
			outputTime = "0" + time.toString() + "0";
		} else if(time < 10) {
			outputTime = "0" + time.toString();
		} else if(_isInteger(time)) {
			outputTime = time.toString() + ".00";
		} else if(_isInteger(time * 10)) {
			outputTime = time.toString() + "0";
		} else {
			outputTime = time.toString();
		}
		return outputTime;
	}

	// 监听状态变化
	$scope.$watch("runtime.status", function(newValue, oldValue) {
		switch(newValue) {
			case $scope.constants.STATUS_LOADING:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_LOADING");
				}
				break;
			case $scope.constants.STATUS_STARTUP:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_STARTUP");
				}
				break;
			case $scope.constants.STATUS_DOING:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_DOING");
				}
				break;
			case $scope.constants.STATUS_COMPLETED:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_COMPLETED");
				}
				break;
			case $scope.constants.STATUS_TIMEOUT:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_TIMEOUT");
				}
				break;
			case $scope.constants.STATUS_ERROR:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_ERROR");
				}
				break;
		}
	});

	/* 添加监听 结束 */

	/* 请求接口封装 开始 */

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

	/* 请求接口封装 结束 */

}]);