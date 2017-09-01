angular.module("idiomControllers.loading", [])

// loading
.controller("loadingCtrl", ["$scope", "$state", "$timeout", function($scope, $state, $timeout) {

    console.log("loadingCtrl");

    $timeout(function() {
        $state.go("startup");
    }, $scope.config.LOADING_TIME);

}]);