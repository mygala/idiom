<?php

    require_once dirname(__FILE__) . '/auth.config.class.php';

    class Auth extends AuthConfig {

        /**
         * 验证接口调用签名
         *
         * @param string $string
         * @param string $sign
         * @param string $key
         * @return bool
         */
        protected function sign($string, $sign, $key) {

            // 获取秘钥
            $secretKey = parent::get($key);

            if (empty($secretKey)) {
                Logs::debug("秘钥不存在", "获取秘钥");
                return false;
            }

            Logs::debug("获取秘钥成功", "获取秘钥");

            // 验证签名
            if (sha1($string . "&sks_" . strtolower($secretKey)) === $sign) {
                Logs::debug("成功", "验证签名");
                return true;
            } else {
                Logs::debug("失败", "验证签名");
                return false;
            }
        }
    }