<?php

    require_once dirname(__FILE__) . '/../core/auth/auth.class.php';

    class IdiomAuth extends Auth {

        /**
         * 验证接口调用签名(idiom)
         *
         * @param string $string
         * @param string $sign
         * @return bool
         */
        public static function authSign($string, $sign) {

            // 调用父方法验证签名
            return parent::sign($string, $sign, "idiom");
        }
    }