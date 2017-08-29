angular.module("idiomControllers.doing", [])

// startup
.controller("doingCtrl", ["$scope", "$state", "getSign", function($scope, $state, getSign) {

    // 开始游戏，加载页面时加载数据
    $scope.$watch("viewContentLoaded", function() {

        // 请求参数
        var params = {
            number: $scope.settings.count
        };

        params.sign = getSign.get(params);

        // 请求接口
        $scope.request.http("/get/random.php", "get", params, $scope.getDataCallback);
    })

    // 加载时获取班级数据回调
    $scope.getDataCallback = function(data) {

        // 调试模式日志
        if($scope.debug) {
            console.log("getDataCallback", data);
        }

        // 获取班级数据处理
        if(data.code == 200) {
            console.log("success");
        }
    }

}]);