angular.module("idiomDirective", [])

// 核心指令
.directive("startup", function() {
	return {
		restrict: "AE",
		scope: {},
		controller: ["$scope", function($scope) {
			
			/* 开始游戏按钮，三种模式 开始 */

			// 正确率模式
			this.playProp = function() {
				$scope.settings.status = $scope.constants.STATUS_DOING;
				$scope.settings.mode = $scope.constants.MODE_PROP;
				$scope.settings.timeout = 0;
				$scope.settings.count = 30;
				$scope.settings.correct = 0;
				$scope.settings.incorrect = 0;
			};

			/* 开始游戏按钮，三种模式 结束 */
			
			// 获取数据
			this.get = function() {
				$scope.request.http.get("./data/idiom.json", "post", {}, this.getCallback);
			};

			// 添加游戏数据到界面
			this.getCallback = function() {

			};
		}]
	};
})

// 正确率模式
.directive("playProp", function() {
	return {
		require: "startup",
		compile: function() {

		},
		link: function(scope, element, attr, superCtrl) {

			window.alert('aaaa');

			console.log(superCtrl);

			element.bind("click", function() {
				window.alert("playProp");
				superCtrl.playProp();
			});
		}
	}
})