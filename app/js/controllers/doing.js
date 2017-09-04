angular.module("idiomControllers.doing", [])

// doing
.controller("doingCtrl", ["$scope", "$state", "apis", "strToChars", "formatTime", "$interval", function($scope, $state, apis, strToChars, formatTime, $interval) {

    if($scope.debug) {
        console.log("doingCtrl");
    }

    // 成语数据
    $scope.doing = {
        i: 0,           // 成语位置控制
        idioms: null,   // 成语对象
        showTime: "",   // 页面显示时间
        ready: false    // 数据加载完成标志
    };

    // 开始游戏，加载页面时加载数据
    $scope.$watch("viewContentLoaded", function() {

        // 请求参数
        var params = {
            number: $scope.runtime.count
        };

        // 随机获取成语数据
        apis.getRandom(params, $scope.getRandomCallback, $scope);
    });

    /* 接口回调 开始 */

    // 随机获取成语数据回调
    $scope.getRandomCallback = function(data) {

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
                $scope.doing.idioms[w].w = strToChars.get($scope.doing.idioms[w].word);
                $scope.doing.idioms[w].w[$scope.doing.idioms[w].error_location - 1][0] = $scope.doing.idioms[w].error_word;

                if($scope.debug) {
                    console.log($scope.doing.idioms[w]);
                }
            }

            // 数据加载完成，监听开始设置计时器
            $scope.doing.ready = true;
        }
    }

    /* 接口回调 结束 */

    // 判断选择结果
    $scope.correcting = function(selected) {
        if($scope.debug) {
            console.log("selected", selected);
        }

        if(selected == $scope.doing.idioms[$scope.doing.i].error_location) {
            $scope.runtime.correct++;      // 回答正确

            if($scope.debug) {
                console.log("correct", $scope.runtime.correct);
            }
        } else {
            $scope.runtime.incorrect++;    // 回答错误

            if($scope.debug) {
                console.log("incorrect", $scope.runtime.incorrect);
            }
        }

        // 输入下一个成语
        $scope.doing.i++;

        if($scope.debug) {
            console.log("i", $scope.doing.i);
        }
    }

    // 监听成语数量，如果全部回答完成，修改状态为正常完成
    $scope.$watch("doing.i", function(newValue, oldValue) {
        if(newValue >= $scope.runtime.count) {

            switch($scope.runtime.mode) {
                case $scope.constants.MODE_PROP:        // 正确率模式

                    // 停止顺时计时
                    $interval.cancel($scope.timerInterval);
                    break;
                case $scope.constants.MODE_TIMEOUT:     // 倒计时模式

                    // 停止倒计时
                    $interval.cancel($scope.countdownInterval);
                    break;
            }

            // 修改状态
            $scope.runtime.status = $scope.constants.STATUS_COMPLETED;
        }
    });

    // 数据加载完成后开始监听
    $scope.$watch("doing.ready", function(newValue, oldValue) {
        if(newValue === true) {

            /* 添加监听 开始 */

            // 根据模式监听
            switch ($scope.runtime.mode) {
                case $scope.constants.MODE_ERROR:       // 错误次数模式

                    // 监听错误次数
                    $scope.$watch("runtime.incorrect", function (newValue, oldValue) {
                        if (newValue >= $scope.runtime.error) {

                            // 停止顺时计时
                            $interval.cancel($scope.timerInterval);

                            // 修改状态
                            $scope.runtime.status = $scope.constants.STATUS_ERROR;
                        }
                    });
                case $scope.constants.MODE_PROP:        // 正确率模式

                    // 定义顺时计时器
                    $scope.runtime.timerInterval = $interval(function () {
                        $scope.runtime.times = $scope.runtime.times + 10;

                        if ($scope.debug) {
                            console.log("times", $scope.runtime.times);
                        }
                    }, 10);

                    // 超出总时长监听
                    $scope.$watch("runtime.times", function (newValue, oldValue) {

                        // 设置页面显示时间格式
                        $scope.doing.showTime = formatTime.get(newValue / 1000);

                        if (newValue >= $scope.runtime.totalTimes) {

                            // 停止顺时计时，修正times的值
                            $interval.cancel($scope.runtime.timerInterval);

                            if (newValue > $scope.runtime.totalTimes) {
                                $scope.runtime.timeout = $scope.runtime.totalTimes;
                            }

                            // 修改状态
                            $scope.runtime.status = $scope.constants.STATUS_TIMEOUT;
                        }
                    });
                    break;
                case $scope.constants.MODE_TIMEOUT:     // 倒计时模式

                    // 定义倒计时器
                    $scope.runtime.countdownInterval = $interval(function () {
                        $scope.runtime.timeout = $scope.runtime.timeout - 10;

                        if ($scope.debug) {
                            console.log("countdown", $scope.runtime.timeout);
                        }
                    }, 10);

                    // 监听timeout
                    $scope.$watch("runtime.timeout", function (newValue, oldValue) {

                        // 设置页面显示时间格式
                        $scope.doing.showTime = formatTime.get(newValue / 1000);

                        if (newValue <= 0) {

                            // 停止倒计时，修正timeout的值
                            $interval.cancel($scope.runtime.countdownInterval);

                            if (newValue < 0) {
                                $scope.runtime.timeout = 0;
                            }

                            // 修改状态
                            $scope.runtime.status = $scope.constants.STATUS_TIMEOUT;
                        }
                    });
                    break;
            }

            /* 添加监听 结束 */
        }
    });
}]);