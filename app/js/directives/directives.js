var idiomDirective = angular.module("idiomDirective", []);

// 核心指令
idiomDirective.directive("super", function() {
	return {
		restrict: "AE",
		scope: {},
		controller: ["$scope", "$http", function($scope, $http) {
			
			// 开始
			this.play = function() {
				$scope.step = "play";
				setPlayState(true);
			};
			
			// 失败
			this.gameover = function() {
				$scope.step = "gameover";
				setPlayState(false);
			};
			
			// 成功
			this.done = function() {
				$scope.step = "done";
				setPlayState(false);
			};
			
			// 控制play状态
			this.setPlayState = function(is) {
				$scope.playState = is;
			};
			
			// 获取数据
			this.getIdiom = function() {
				$http.get("./data/idiom.json").success(function(data) {
					console.log("data", data);
				});
			};
		}]
	};
});

// 点击开始指令
idiomDirective.directive("play", function() {
	return {
		require: "?super",
		link: function(scope, element, attr, superCtrl) {

			console.log(superCtrl);

			element.bind("click", function() {
				window.alert("start");
				superCtrl.play();
			});
		}
	}
});

// 启动指令
idiomDirective.directive("startup", function() {
	return {
		restrict: "E",
		templateUrl: "./tpls/startup.html",
		replace: true,
		link: function() {
			
		}
	};
});

// 开始成语指令
idiomDirective.directive("playbox", function() {
	return {
		restrict: "E",
		templateUrl: "./tpls/play_box.html",
		replace: true
	}
});