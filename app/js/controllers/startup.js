angular.module("idiomControllers.startup", [])

// startup
.controller("startupCtrl", ["$scope", "$state", function($scope, $state) {

    if($scope.debug) {
        console.log("startupCtrl");
    }

    // startup页面初始化游戏数据
    $scope.$watch("viewContentLoaded", function() {

        $scope.initRuntime();

    });

    /* 开始游戏按钮，三种模式 开始 */

    // 正确率模式
    $scope.playProp = function() {
        $scope.runtime.mode = $scope.constants.MODE_PROP;
        $scope.runtime.status = $scope.constants.STATUS_DOING;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }
    };

    // 错误次数模式
    $scope.playError = function() {
        $scope.runtime.mode = $scope.constants.MODE_ERROR;
        $scope.runtime.status = $scope.constants.STATUS_DOING;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }
    };

    // 倒计时模式
    $scope.playTimeout = function() {
        $scope.runtime.mode = $scope.constants.MODE_TIMEOUT;
        $scope.runtime.status = $scope.constants.STATUS_DOING;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }
    };

    /* 开始游戏按钮，三种模式 结束 */

}]);