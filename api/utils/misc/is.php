<?php

    class Is {

        function __construct() {

        }

        /**
         * 验证邮箱
         *
         * @param string $email
         * @return boolean
         */
        public static function isEmail($email) {
            return (preg_match('/^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,4}$/', $email)) ? true : false;
        }

        /**
         * 验证手机号码
         *
         * @param string $mobile
         * @return boolean
         */
        public static function isMobile($mobile) {
            if (strlen($mobile) !== 11) {
                return false;
            }

            return preg_match("/13[1234567890]{1}\d{8}|15[1234567890]{1}\d{8}|18[1234567890]{1}\d{8}/", $mobile) ? true : false;
        }

        /**
         * 验证URL
         *
         * @param string $url
         * @return boolean
         */
        // 该函数有问题,需要重写
        public static function isUrl($url) {
            $url = urldecode($url);
            return preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i", $url) ? true : false;
        }

        /**
         * 身份证验证
         *
         * @param string $numCard
         * @return boolean
         */
        public static function isIdentify($numCard) {

            if (strlen($numCard) !== 18) {
                return false;
            }

            $numCard = strtoupper($numCard);

            // 将身份证的每位数以数组的形式存放在$arr
            $arr   = array();
            $mod   = 0;
            $count = 0;

            // 中间变量
            $duiying = null;
            $X = "X";

            for ($i = 0; $i <= 16; $i++) {
                $arr[$i] = substr($numCard, $i, 1);             //依次获取身份证号码前17位
                $mod     = (pow(2, 17 - $i) % 11) * $arr[$i];   //校验位算法，可参考http://baike.baidu.cn/view/5112521.htm
                $count   = $count + $mod;                       //累加
             }

             // 经过校验算法后的余数
             $avg = $count % 11;                                //求余，$avg取值在[0,10]

             switch ($avg) {
                 case 0:
                     $duiying = 1;
                     break;
                 case 1:
                     $duiying = 0;
                     break;
                 case 2:
                     $duiying = $X;
                     break;
                 case 3:
                     $duiying = 9;
                     break;
                 case 4:
                     $duiying = 8;
                     break;
                 case 5:
                     $duiying = 7;
                     break;
                 case 6:
                     $duiying = 6;
                     break;
                 case 7:
                     $duiying = 5;
                     break;
                 case 8:
                     $duiying = 4;
                     break;
                 case 9:
                     $duiying = 3;
                     break;
                 case 10:
                     $duiying = 2;
                     break;
             }

             //获取身份证最后一位数
             $last_num = substr($numCard, 17, 1);

             //判断用户输入的身份证最后一位数与前17位数转换得到校验位是否相等
             return ($duiying === $last_num) ? true : false;

        }

    }

