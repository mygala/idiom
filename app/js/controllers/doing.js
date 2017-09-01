angular.module("idiomControllers.doing", [])

// startup
.controller("doingCtrl", ["$scope", "$state", "getSign", "$interval", function($scope, $state, getSign, $interval) {

    // 成语数据
    $scope.doing = {
        i: 0,
        idioms: null
    };

    // 开始游戏，加载页面时加载数据
    $scope.$watch("viewContentLoaded", function() {

        // 请求参数
        var params = {
            number: $scope.runtime.count
        };

        params.sign = getSign.get(params);

        if($scope.debug) {
            console.log("random params", params);
        }

        // 有条数再请求接口，避免务必要请求
        if(params.number) {

            // 请求接口
            $scope.request.http("/get/random.php", "get", params, $scope.getDataCallback);
        }
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
            $scope.runtime.count = data.number;

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

            $scope.runtime.correct++;      // 回答正确
        } else {
            if($scope.debug) {
                console.log("incorrect");
            }

            $scope.runtime.incorrect++;    // 回答错误
        }

        // 输入下一个成语
        $scope.doing.i++;
    }

    // 监听成语数量，如果全部回答完成，修改状态为正常完成
    $scope.$watch("doing.i", function(newValue, oldValue) {
        if(newValue >= $scope.runtime.count) {

            // 修改状态
            $scope.runtime.status = $scope.constants.STATUS_COMPLETED;
        }
    });

    /* 添加监听 开始 */

    // 根据模式监听
    switch($scope.runtime.mode) {
        case $scope.constants.MODE_PROP:        // 正确率模式

            break;
        case $scope.constants.MODE_ERROR:       // 错误次数模式

            // 监听错误次数
            $scope.$watch("runtime.incorrect", function(newValue, oldValue) {
                if(newValue >= $scope.runtime.error) {

                    // 修改状态
                    $scope.runtime.status = $scope.constants.STATUS_ERROR;
                }
            });
            break;
        case $scope.constants.MODE_TIMEOUT:     // 倒计时模式

            // 定义倒计时器
            $scope.runtime.timeout = $scope.config.TIMEOUT * 1000;
            $scope.interval = $interval(function() {
                $scope.runtime.timeout = $scope.runtime.timeout - 1000;

                console.log("countdown", $scope.runtime.timeout);
            }, 1000);

            // 监听timeout
            $scope.$watch("runtime.timeout", function(newValue, oldValue) {
                if(newValue < 0) {

                    // 停止倒计时，修正timeout的值
                    $interval.cancel($scope.interval);
                    if($scope.runtime.timeout < 0) {
                        $scope.runtime.timeout = 0;
                    }

                    // 修改状态
                    $scope.runtime.status = $scope.constants.STATUS_TIMEOUT;
                }
            });
            break;
    }

    // 超出总时长监听
    $scope.$watch("runtime.times", function(newValue, oldValue) {
        if(newValue >= $scope.runtime.totalTimes * 1000) {

            // 修改状态
            $scope.runtime.status = $scope.constants.STATUS_TIMEOUT;
        }
    });

    /* 添加监听 结束 */




    //将字符串拆成字符，并存到数组中
    String.prototype.strToChars = function() {
        var chars = new Array();
        for(var i = 0;i < this.length;i++) {
            chars[i] = [this.substr(i, 1), this.isCHS(i)];
        }
        String.prototype.charsArray = chars;
        return chars;
    }

    //判断某个字符是否是汉字
    String.prototype.isCHS = function(i) {
        if(this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) {
            return true;
        } else {
            return false;
        }
    }

}]);