angular.module("idiomControllers.doing", [])

// startup
.controller("doingCtrl", ["$scope", "$state", "getSign", function($scope, $state, getSign) {

    // 成语数据
    $scope.doing = {
        i: 0,
        idioms: null
    };

    // 开始游戏，加载页面时加载数据
    $scope.$watch("viewContentLoaded", function() {

        // 请求参数
        var params = {
            number: $scope.settings.count
        };

        params.sign = getSign.get(params);

        // 请求接口
        $scope.request.http("/get/random.php", "get", params, $scope.getDataCallback);
    });

    // 加载时获取班级数据回调
    $scope.getDataCallback = function(data) {

        // 调试模式日志
        if($scope.debug) {
            console.log("getDataCallback", data);
        }

        // 获取班级数据处理
        if(data.code == 200) {
            if($scope.debug) {
                console.log("success");
            }

            // 成语数据
            $scope.doing.idioms = data.extend;

            // 成语总数
            $scope.settings.count = data.number;

            // 遍历成语并设置错误数据
            for(w in $scope.doing.idioms) {
                $scope.doing.idioms[w].w = $scope.doing.idioms[w].word.strToChars();
                $scope.doing.idioms[w].w[$scope.doing.idioms[w].error_location - 1][0] = $scope.doing.idioms[w].error_word;

                if($scope.debug) {
                    console.log($scope.doing.idioms[w]);
                }

            }
        }
    }

    // 判断选择结果
    $scope.correcting = function(selected) {
        if($scope.debug) {
            console.log("selected", selected);
        }

        if(selected == $scope.doing.idioms[$scope.doing.i].error_location) {
            if($scope.debug) {
                console.log("correct");
            }

            $scope.settings.correct++;      // 回答正确
        } else {
            if($scope.debug) {
                console.log("incorrect");
            }

            $scope.settings.incorrect++;    // 回答错误
        }

        // 输入下一个成语
        $scope.doing.i++;
    }

    // 监听成语数量，如果全部回答完成，切换到完成页面
    $scope.$watch("doing.i", function(newValue, oldValue) {
        if(newValue >= $scope.settings.count) {
            $state.go("completed");
        }
    });

    // 监听timeout
    $scope.$watch("settings.timeout", function(newValue, oldValue) {
        switch(newValue) {
            case 0:

                break;
        }
    });

    //将字符串拆成字符，并存到数组中
    String.prototype.strToChars = function(){
        var chars = new Array();
        for (var i = 0; i < this.length; i++){
            chars[i] = [this.substr(i, 1), this.isCHS(i)];
        }
        String.prototype.charsArray = chars;
            return chars;
        }

    //判断某个字符是否是汉字
    String.prototype.isCHS = function(i){
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
        return true;
    else
        return false;
    }

}]);