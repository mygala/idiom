angular.module("idiomControllers.loading", [])

// loading
.controller("loadingCtrl", ["$scope", "$state", "$timeout", function($scope, $state, $timeout) {

    if($scope.debug) {
        console.log("loadingCtrl");
    }

    $timeout(function() {
        $scope.runtime.status = $scope.constants.STATUS_STARTUP;
    }, $scope.config.LOADING_TIME);

}]);