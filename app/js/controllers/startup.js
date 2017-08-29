angular.module("idiomControllers.startup", [])

// startup
.controller("startupCtrl", ["$scope", "$state", function($scope, $state) {

    /* 开始游戏按钮，三种模式 开始 */

    // 正确率模式
    $scope.playProp = function() {
        $scope.settings.status = $scope.constants.STATUS_DOING;
        $scope.settings.mode = $scope.constants.MODE_PROP;
        $scope.settings.timeout = 0;
        $scope.settings.count = 30;
        $scope.settings.correct = 0;
        $scope.settings.incorrect = 0;

        console.log($scope.settings);

        $state.go("doing");

    };

    // 错误次数模式
    $scope.playError = function() {
        $scope.settings.status = $scope.constants.STATUS_DOING;
        $scope.settings.mode = $scope.constants.MODE_ERROR;
        $scope.settings.timeout = 0;
        $scope.settings.count = 30;
        $scope.settings.correct = 0;
        $scope.settings.incorrect = 0;

        console.log($scope.settings);

        $state.go("doing");

    };

    // 错误次数模式
    $scope.playTimeout = function() {
        $scope.settings.status = $scope.constants.STATUS_DOING;
        $scope.settings.mode = $scope.constants.MODE_TIMEOUT;
        $scope.settings.timeout = 0;
        $scope.settings.count = 30;
        $scope.settings.correct = 0;
        $scope.settings.incorrect = 0;

        console.log($scope.settings);

        $state.go("doing");

    };

    /* 开始游戏按钮，三种模式 结束 */

}]);