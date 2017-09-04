
//将字符串拆成字符，并存到数组中
idiomApp.factory("strToChars", [function() {
    return {
        get: function(string) {
            var chars = new Array();
            for(var i = 0;i < string.length;i++) {
                chars[i] = [string.substr(i, 1), isCHS(string, i)];
            }
            String.prototype.charsArray = chars;
            return chars;
        }
    }

    //判断某个字符是否是汉字
    function isCHS(string, i) {
        if(string.charCodeAt(i) > 255 || string.charCodeAt(i) < 0) {
            return true;
        } else {
            return false;
        }
    }
}]);

// 格式化输出时间
idiomApp.factory("formatTime", [function() {
    return {
        get: function(time) {
            var outputTime = null;
            if(time < 10 && _isInteger(time)) {
                outputTime = "0" + time.toString() + ".00";
            } else if(time < 10 && _isInteger(time * 10)) {
                outputTime = "0" + time.toString() + "0";
            } else if(time < 10) {
                outputTime = "0" + time.toString();
            } else if(_isInteger(time)) {
                outputTime = time.toString() + ".00";
            } else if(_isInteger(time * 10)) {
                outputTime = time.toString() + "0";
            } else {
                outputTime = time.toString();
            }
            return outputTime;
        }
    }

    // 判断时间是否为整数
    function _isInteger(time) {
        return typeof time === 'number' && time % 1 === 0;
    }
}]);